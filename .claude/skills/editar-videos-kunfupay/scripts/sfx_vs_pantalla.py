#!/usr/bin/env python3
"""¿Cada efecto de sonido coincide con algo que pasa en pantalla?

Para cada SFX (segundo + tipo) mide cuánto cambia la imagen entre [t−0,15 s] y [t+0,45 s] FUERA de las zonas que se
mueven siempre (la persona y la banda de subtítulos) y lo compara con el movimiento normal de esa zona en ±2 s.
Si no hay un cambio claro, el sonido «suena en vacío» → se marca.

Uso:
  sfx_vs_pantalla.py VIDEO.mp4 --eventos meta.json           (lista [["tipo", segundo], …] en "events")
  sfx_vs_pantalla.py VIDEO.mp4 --stem sfx.wav                 (detecta los golpes en la pista de efectos)
  opciones: --excluir "x0,y0,x1,y1;…" (fracciones 0–1; por defecto persona centrada y subtítulos)
            --desplazar "inicio,fin,resta"  (si el vídeo final se cortó después de anotar los eventos)
"""
import json, subprocess, sys
import numpy as np

args = sys.argv[1:]
video = args[0]
def opt(k, d=None): return args[args.index(k) + 1] if k in args else d

W, H = 192, 108                                     # análisis a baja resolución (suficiente para «¿apareció algo?»)
ex = opt("--excluir", "0.30,0.10,0.76,1.0;0.0,0.80,1.0,1.0")
mask = np.ones((H, W), bool)
for r in ex.split(";"):
    x0, y0, x1, y1 = [float(v) for v in r.split(",")]
    mask[int(y0 * H):int(y1 * H), int(x0 * W):int(x1 * W)] = False

raw = subprocess.run(["ffmpeg", "-v", "error", "-i", video, "-vf", f"fps=30,scale={W}:{H},format=gray", "-f", "rawvideo", "-"],
                     capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
d3 = np.abs(np.diff(fr, axis=0))[:, mask]
diff = np.r_[0, d3.mean(axis=1)]                    # cambio por fotograma fuera de las zonas excluidas
spread = np.r_[0, (d3 > 6).mean(axis=1)]            # qué parte de esa zona cambia: casi todo = zoom/destello, no «algo nuevo»

if "--eventos" in args:
    ev = json.load(open(opt("--eventos")))["events"]
else:                                                # onsets en la pista de SFX
    a = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", opt("--stem"), "-ac", "1", "-ar", "8000", "-f", "s16le", "-"],
                                     capture_output=True).stdout, np.int16).astype(float)
    env = np.array([np.sqrt((a[i:i + 80] ** 2).mean()) for i in range(0, len(a) - 80, 80)])  # 10 ms
    db = 20 * np.log10(env / 32768 + 1e-9)
    on = [i for i in range(5, len(db)) if db[i] > -58 and db[i] - db[i - 5:i].max() > 8]     # golpe: +8 dB en 50 ms
    ev, last = [], -1
    for i in on:
        if i - last > 15: ev.append(["sfx", round(i / 100, 2)])                     # un golpe cada 150 ms como mucho
        last = i
    # colas: SFX que siguen sonando ≥ 0,8 s después de su golpe → pueden quedar sobre una pantalla ya vacía
    for k, t in list(ev):
        j = int(t * 100); tail = j
        while tail < len(db) - 1 and db[tail] > -52 and tail - j < 600: tail += 1
        if (tail - j) / 100 >= .8: ev.append(["cola " + f"{(tail - j) / 100:.1f}s", round(t + .7, 2)])
if opt("--desplazar"):
    a0, a1, rest = [float(v) for v in opt("--desplazar").split(",")]
    ev = [[k, t if t < a0 else t - rest] for k, t in ev if not (a0 <= t < a1)]

malos = []
for kind, t in ev:
    i = int(t * 30)
    if i >= len(diff): continue
    win = diff[max(0, i - 5):i + 14]                 # −0,15 s … +0,45 s
    base = np.median(diff[max(0, i - 60):i + 60])    # movimiento normal en ±2 s
    pico = float(win.max()) if len(win) else 0
    ok = pico > max(0.12, base * 2.5)              # algo aparece o se mueve claramente por encima de lo normal
    k = int(np.argmax(win)) + max(0, i - 5)
    if ok and spread[k] > .55:                      # cambia casi toda la imagen a la vez → solo zoom o destello
        malos.append((t, kind + " (solo zoom/destello)", round(pico, 2), round(float(base), 2)))
    elif not ok: malos.append((t, kind, round(pico, 2), round(float(base), 2)))
print(f"{len(ev)} efectos · {len(malos)} sin nada nuevo en pantalla:")
for t, k, p, b in malos:
    print(f"  {int(t // 60)}:{t % 60:05.2f} · {k:32s} · cambio {p} (normal {b})")
