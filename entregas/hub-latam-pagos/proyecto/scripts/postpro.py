# Post-proceso de la skill Ramiro solo en las escenas (y la tarjeta final):
# ojo de pez de lente (k1 .10, k2 .02, mismo modelo que ffmpeg lenscorrection) + recorte 88 % + curva que hunde un poco los negros.
# uso: python3 -I postpro.py render_dir out_dir meta.json
import json, os, shutil, subprocess, sys
from multiprocessing import Pool
import cv2, numpy as np
SRC, OUT, META = sys.argv[1:4]
os.makedirs(OUT, exist_ok=True)
W, H, K1, K2, C = 1080, 1920, 0.10, 0.02, 0.88
# mapa combinado: píxel final -> recorte 88 % -> lente -> píxel del render
u, v = np.meshgrid(np.arange(W, dtype=np.float64), np.arange(H, dtype=np.float64))
X = (W - W * C) / 2 + (u + 0.5) * C - 0.5
Y = (H - H * C) / 2 + (v + 0.5) * C - 0.5
cx, cy = W / 2, H / 2
dx, dy = X - cx, Y - cy
r2 = (dx * dx + dy * dy) / ((W * W + H * H) / 4)
m = 1 + K1 * r2 + K2 * r2 * r2
MX, MY = (cx + dx * m).astype(np.float32), (cy + dy * m).astype(np.float32)
# curva exacta de ffmpeg (curves all='0/0.025 0.5/0.48 1/0.96') muestreada en una rampa
ramp = np.tile(np.arange(256, dtype=np.uint8), (2, 1))[..., None].repeat(3, 2)
p = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '256x2', '-i', '-', '-vf', "curves=all='0/0.025 0.5/0.48 1/0.96'",
                    '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], input=ramp.tobytes(), capture_output=True, check=True)
LUT = np.frombuffer(p.stdout, np.uint8).reshape(2, 256, 3)[0, :, 0].copy()
meta = json.load(open(META))
ranges = [(round(a * 30), round(b * 30)) for a, b in meta['scenes']]
inr = lambda i: any(a <= i < b for a, b in ranges)
files = sorted(f for f in os.listdir(SRC) if f.endswith('.jpg'))
def work(f):
    i = int(f[1:6])
    if not inr(i): shutil.copyfile(os.path.join(SRC, f), os.path.join(OUT, f)); return 0
    im = cv2.imread(os.path.join(SRC, f))
    o = cv2.remap(im, MX, MY, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
    cv2.imwrite(os.path.join(OUT, f), cv2.LUT(o, LUT), [cv2.IMWRITE_JPEG_QUALITY, 97]); return 1
with Pool(4) as pool: n = sum(pool.map(work, files, chunksize=16))
print('frames', len(files), 'post-procesados', n)
