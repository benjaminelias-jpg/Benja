# Recorte limpio de la persona (des-contaminación del fondo blanco) + B/N + ojo de pez centrado en la cara
import sys, numpy as np
from PIL import Image, ImageFilter
src, cut, out = sys.argv[1:4]
I = np.asarray(Image.open(src).convert("RGB")).astype(np.float32) / 255
A = np.asarray(Image.open(cut).convert("RGBA"))[..., 3].astype(np.float32) / 255
# 1 · color del fondo (estudio blanco) estimado donde el alfa es 0
B = np.median(I[A < 0.02], axis=0)
# 1b · huecos del pelo: píxeles casi blancos (fondo de estudio) cerca del borde → transparentes
band_src = Image.fromarray((A * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(81))
interior = np.asarray(band_src).astype(np.float32) / 255 > 0.5
mn, mx = I.min(axis=2), I.max(axis=2)
lum = I @ np.array([0.299, 0.587, 0.114], np.float32)
blanco = np.clip((lum - 0.74) / 0.12, 0, 1) * np.clip(1 - (mx - mn) / 0.16, 0, 1)
zona = (~interior) & (np.mgrid[0:A.shape[0], 0:A.shape[1]][0] < 0.62 * A.shape[0])
A = np.where(zona, A * (1 - blanco), A)
A = np.asarray(Image.fromarray((A * 255).astype(np.uint8)).filter(ImageFilter.MedianFilter(3))).astype(np.float32) / 255

# 2 · des-contaminar bordes: F = (C - (1-a)·B) / a
a = np.clip(A, 0.05, 1)[..., None]
F = np.clip((I - (1 - a) * B) / a, 0, 1)
# 3 · alfa más ceñido: endurecer, erosionar 1 px y suavizar
At = np.clip((A - 0.25) / 0.6, 0, 1)
im = Image.fromarray((At * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
At = np.asarray(im).astype(np.float32) / 255
# 4 · blanco y negro + contraste
g = F @ np.array([0.299, 0.587, 0.114], np.float32)
g = np.clip((g - 0.5) * 1.2 + 0.5 - 0.03, 0, 1)
# 5 · ojo de pez: abomba el centro (cara) sin mover el borde del radio R → sin huecos
H, W = g.shape
cx, cy, R, k = 0.47 * W, 0.27 * H, 0.8 * H, 0.22
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
dx, dy = xx - cx, yy - cy
r = np.sqrt(dx * dx + dy * dy) / R
f = np.where(r < 1, 1 - k + k * r * r, 1.0)
sx, sy = cx + dx * f, cy + dy * f
def sample(img):
    x0 = np.clip(np.floor(sx).astype(int), 0, W - 2); y0 = np.clip(np.floor(sy).astype(int), 0, H - 2)
    tx = np.clip(sx - x0, 0, 1); ty = np.clip(sy - y0, 0, 1)
    return (img[y0, x0] * (1 - tx) * (1 - ty) + img[y0, x0 + 1] * tx * (1 - ty)
            + img[y0 + 1, x0] * (1 - tx) * ty + img[y0 + 1, x0 + 1] * tx * ty)
Ao = sample(At); Go = sample(g * At) / np.maximum(Ao, 1e-4)
rgba = np.dstack([Go, Go, Go, Ao])
Image.fromarray((np.clip(rgba, 0, 1) * 255).astype(np.uint8), "RGBA").save(out)
print("ok", B)
