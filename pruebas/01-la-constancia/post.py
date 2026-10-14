"""Postproducción de fotogramas: motion blur por acumulación + grano fino.

Para cada fotograma promedia sus muestras del obturador (ver render.cjs) y añade
grano de película: ruido de luminancia suave, distinto en cada fotograma, que
además hace de dither y evita el banding en los degradados oscuros.

Uso: python3 post.py <carpeta_muestras> <carpeta_salida>
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

src, dst = Path(sys.argv[1]), Path(sys.argv[2])
dst.mkdir(parents=True, exist_ok=True)
manifest = json.loads((src / "manifest.json").read_text())

GRAIN_SIGMA = 3.2 / 255   # intensidad del grano
CHROMA_SIGMA = 0.8 / 255  # pequeña variación de color, como en película

for n_str, samples in sorted(manifest.items(), key=lambda kv: int(kv[0])):
    n = int(n_str)
    acc = None
    for k in range(samples):
        img = np.asarray(Image.open(src / f"f{n:04d}_{k:02d}.png").convert("RGB"), dtype=np.float32) / 255
        acc = img if acc is None else acc + img
    frame = acc / samples

    # Grano: ruido gaussiano a media resolución, escalado con interpolación bilineal
    rng = np.random.default_rng(1000 + n)
    h, w = frame.shape[:2]
    lum = rng.normal(0, 1, (h // 2, w // 2)).astype(np.float32)
    lum = np.asarray(Image.fromarray(lum, mode="F").resize((w, h), Image.BILINEAR)) * GRAIN_SIGMA * 1.6
    chroma = rng.normal(0, CHROMA_SIGMA, (h, w, 3)).astype(np.float32)
    frame = frame + lum[..., None] + chroma

    out = np.clip(frame * 255 + 0.5, 0, 255).astype(np.uint8)
    Image.fromarray(out).save(dst / f"f{n:04d}.png", compress_level=1)
    if n % 10 == 0:
        print(f"f{n}", end=" ", flush=True)
print("\nlisto")
