#!/usr/bin/env python3
"""Recorta una luz TransFlare del pack de Brayan (4K horizontal) a clip vertical 1080×1920 de 1,734 s con el pico a 0,74 s.
Uso: luz.py 033 [033 …] → luces/luz-NNN.mp4"""
import os, re, subprocess, sys
# Carpeta del pack de luces (TransFlare 4K). Cámbiala con la variable LUCES_DIR si está en otra ruta.
L = os.environ.get("LUCES_DIR", os.path.expanduser("~/Movies/Light Leaks Transitions - 4K"))
for n in sys.argv[1:]:
    f = f"{L}/TransFlare_{n}_4k_3840x2160.mov"
    r = subprocess.run(["ffmpeg", "-i", f, "-vf", "scale=64:36,signalstats,metadata=print:key=lavfi.signalstats.YAVG", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    t = [float(x) for x in re.findall(r"pts_time:([\d.]+)", r)]
    y = [float(x) for x in re.findall(r"YAVG=([\d.]+)", r)]
    pk = t[max(range(len(y)), key=lambda k: y[k])]
    st = max(0, pk - .74)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{st:.3f}", "-t", "1.734", "-i", f, "-vf", "scale=-2:1920,crop=1080:1920,fps=30",
                    "-an", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", f"luces/luz-{n}.mp4"], check=True)
    print(n, f"pico {pk:.2f} s")
