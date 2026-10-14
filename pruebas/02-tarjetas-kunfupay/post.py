"""Postproducción: motion blur por acumulación + grano fino (en paralelo).

Para cada fotograma promedia sus muestras del obturador (ver render.cjs) y añade
grano de película distinto en cada fotograma, que además hace de dither y evita
el banding en los degradados oscuros.

Uso: python3 post.py <carpeta_muestras> <carpeta_salida>
"""
import json
import sys
from multiprocessing import Pool
from pathlib import Path

import numpy as np
from PIL import Image

GRAIN_SIGMA = 3.2 / 255
CHROMA_SIGMA = 0.8 / 255


def process(job):
    src, dst, n, samples = job
    acc = None
    for k in range(samples):
        img = np.asarray(Image.open(src / f"f{n:04d}_{k:02d}.png").convert("RGB"), dtype=np.float32) / 255
        acc = img if acc is None else acc + img
    frame = acc / samples
    rng = np.random.default_rng(1000 + n)
    h, w = frame.shape[:2]
    lum = rng.normal(0, 1, (h // 2, w // 2)).astype(np.float32)
    lum = np.asarray(Image.fromarray(lum, mode="F").resize((w, h), Image.BILINEAR)) * GRAIN_SIGMA * 1.6
    frame = frame + lum[..., None] + rng.normal(0, CHROMA_SIGMA, (h, w, 3)).astype(np.float32)
    Image.fromarray(np.clip(frame * 255 + 0.5, 0, 255).astype(np.uint8)).save(dst / f"f{n:04d}.png", compress_level=1)
    return n


if __name__ == "__main__":
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    dst.mkdir(parents=True, exist_ok=True)
    manifest = json.loads((src / "manifest.json").read_text())
    jobs = [(src, dst, int(n), s) for n, s in sorted(manifest.items(), key=lambda kv: int(kv[0]))]
    with Pool(4) as pool:
        for i, _ in enumerate(pool.imap_unordered(process, jobs, chunksize=4)):
            if i % 100 == 0:
                print(f"{i}/{len(jobs)}", end=" ", flush=True)
    print("\nlisto")
