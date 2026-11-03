#!/usr/bin/env python3
"""Muestreo para el revisor de errores visuales: por cada tramo de N s (5 por defecto) saca dos fotogramas a resolución
completa (centro del tramo y +1,5 s) y monta una hoja de contacto cada 30 s con la marca de tiempo.
Uso: muestrear.py VIDEO.mp4 SALIDA/ [--paso 5]"""
import os, subprocess, sys

video, out = sys.argv[1], sys.argv[2]
paso = float(sys.argv[sys.argv.index("--paso") + 1]) if "--paso" in sys.argv else 5.0
os.makedirs(os.path.join(out, "frames"), exist_ok=True)
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video],
                           capture_output=True, text=True).stdout)
tiempos = []
t = paso / 2
while t < dur:
    for tt in (t, t + 1.5):
        if tt < dur: tiempos.append(round(tt, 2))
    t += paso
for tt in tiempos:
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(tt), "-i", video, "-frames:v", "1",
                    os.path.join(out, "frames", f"f_{tt:07.2f}.png")], check=True)
# hojas de contacto de 30 s (12 fotogramas) con la marca de tiempo
por_hoja = int(30 / paso) * 2
for i in range(0, len(tiempos), por_hoja):
    grupo = tiempos[i:i + por_hoja]
    ins = sum([["-i", os.path.join(out, "frames", f"f_{tt:07.2f}.png")] for tt in grupo], [])
    fc = "".join(f"[{k}:v]scale=640:-2,drawtext=text='{tt:.1f}s':x=8:y=8:fontsize=26:fontcolor=yellow:box=1:boxcolor=black@0.7[s{k}];" for k, tt in enumerate(grupo))
    cols = 4
    lay = "|".join(f"{(k % cols) * 640}_{(k // cols)}*h0" for k in range(len(grupo)))
    lay = "|".join(f"{(k % cols) * 640}_" + ("0" if k // cols == 0 else "+".join(["h0"] * (k // cols))) for k in range(len(grupo)))
    fc += "".join(f"[s{k}]" for k in range(len(grupo))) + f"xstack=inputs={len(grupo)}:layout={lay}:fill=black[o]"
    dst = os.path.join(out, f"hoja_{grupo[0]:06.1f}-{grupo[-1]:06.1f}.jpg")
    subprocess.run(["ffmpeg", "-v", "error", "-y", *ins, "-filter_complex", fc, "-map", "[o]", "-frames:v", "1", dst], check=True)
    print(dst)
print(f"{len(tiempos)} fotogramas en {out}/frames")
