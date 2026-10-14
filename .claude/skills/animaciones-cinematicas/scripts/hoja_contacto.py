"""Hoja de contactos para revisar una animación de un vistazo.

Uso:
  python3 hoja_contacto.py <carpeta_fotogramas> <salida.png> [--frames 30,120,240] [--every 15] [--cols 10] [--width 200]

Acepta los fotogramas finales (f0000.png) o los de vista previa (f0000_00.png).
Por defecto, un fotograma cada 15 (medio segundo a 30 fps).
"""
import argparse
import re
from pathlib import Path

from PIL import Image, ImageDraw

ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("out")
ap.add_argument("--frames"); ap.add_argument("--every", type=int, default=15)
ap.add_argument("--cols", type=int, default=10); ap.add_argument("--width", type=int, default=200)
a = ap.parse_args()

files = {}
for p in Path(a.src).glob("f*.png"):
    m = re.match(r"f(\d+)(?:_00)?\.png$", p.name)
    if m:
        files[int(m.group(1))] = p
frames = [int(x) for x in a.frames.split(",")] if a.frames else sorted(n for n in files if n % a.every == 0)
frames = [n for n in frames if n in files]
if not frames:
    raise SystemExit("No hay fotogramas que mostrar")

w = a.width
h = round(w * Image.open(files[frames[0]]).height / Image.open(files[frames[0]]).width)
rows = (len(frames) + a.cols - 1) // a.cols
sheet = Image.new("RGB", (a.cols * w, rows * (h + 18)), (40, 40, 40))
d = ImageDraw.Draw(sheet)
for i, n in enumerate(frames):
    x, y = (i % a.cols) * w, (i // a.cols) * (h + 18)
    sheet.paste(Image.open(files[n]).convert("RGB").resize((w, h), Image.LANCZOS), (x, y + 18))
    d.text((x + 4, y + 3), f"f{n}", fill=(255, 255, 0))
sheet.save(a.out)
print(f"{len(frames)} fotogramas → {a.out}")
