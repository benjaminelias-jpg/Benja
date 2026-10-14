"""Comprueba en el MP4 final que cada golpe suena en su fotograma.

Para cada señal de tipo hit/foley de build_info.json busca el pico de audio más cercano
(±4 fotogramas) en el MP4 y mide el desfase. Más de 1,5 fotogramas = fallo de sincronía.

Uso: python3 verificar_sync.py <video.mp4> <proyecto>/build_info.json
"""
import json
import subprocess
import sys

import numpy as np

SR = 48000
video, info_path = sys.argv[1], sys.argv[2]
info = json.load(open(info_path))
fps = info["fps"]
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", video, "-vn", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                     capture_output=True, check=True).stdout
x = np.abs(np.frombuffer(raw, dtype=np.float32))

ok = True
seen = set()
print(f"{'señal':22s} {'objetivo':>9s} {'medido':>9s} {'desfase':>8s}")
for c in sorted(info["cues"], key=lambda c: c["f"]):
    if not (c["type"].startswith("hit") or c["type"] == "foley") or c["f"] in seen:
        continue
    seen.add(c["f"])
    t = c["f"] / fps
    a, b = int((t - 4 / fps) * SR), int((t + 4 / fps) * SR)
    seg = x[max(0, a):b]
    # El ataque: la subida de energía más brusca de la ventana (en 3 ms), no el máximo:
    # justo antes de un hit suele sonar el final de un riser casi igual de fuerte
    env = np.convolve(seg, np.ones(48) / 48, "same")
    rise = env[144:] - env[:-144]
    i = int(np.argmax(rise)) + 144
    got = (max(0, a) + i) / SR * fps
    d = got - c["f"]
    flag = "OK" if -0.5 <= d <= 1.5 else "REVISAR"
    ok &= flag == "OK"
    print(f"{c['type'] + (':' + c['name'] if c.get('name') else ''):22s} {'f' + str(c['f']):>9s} {'f%.2f' % got:>9s} {d:+8.2f}  {flag}")

loud = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", video, "-af", "ebur128=peak=true", "-f", "null", "-"],
                      capture_output=True, text=True).stderr
for line in loud.splitlines()[-12:]:
    if line.strip().startswith(("I:", "Peak:")):
        print(line.strip())
sys.exit(0 if ok else 1)
