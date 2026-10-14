"""Prepara un objeto recortado para la animación.

Recorta al contenido real (canal alfa), deja un margen pequeño para que la sombra
no se corte y reduce a un tamaño razonable. Si la imagen no tiene transparencia,
avisa: hay que recortarle el fondo primero (images_remove_background en Magnific).

Uso: python3 preparar_imagen.py <entrada> <salida.webp|.png> [--max 1400]
"""
import argparse

from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("dst"); ap.add_argument("--max", type=int, default=1400)
a = ap.parse_args()

im = Image.open(a.src).convert("RGBA")
alpha = im.split()[-1]
lo, hi = alpha.getextrema()
if lo > 250:
    raise SystemExit("La imagen no tiene fondo transparente: recórtale el fondo antes de usarla.")
bbox = alpha.point(lambda v: 255 if v > 8 else 0).getbbox()
im = im.crop(bbox)
pad = 12
canvas = Image.new("RGBA", (im.width + 2 * pad, im.height + 2 * pad), (0, 0, 0, 0))
canvas.paste(im, (pad, pad))
canvas.thumbnail((a.max, a.max), Image.LANCZOS)
if a.dst.lower().endswith(".webp"):
    canvas.save(a.dst, "WEBP", quality=92, method=6)
else:
    canvas.save(a.dst, optimize=True)
print(f"{a.dst}: {canvas.size[0]}×{canvas.size[1]}")
