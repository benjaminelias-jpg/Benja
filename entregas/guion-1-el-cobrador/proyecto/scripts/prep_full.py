# Persona de cuerpo entero para la escena Ramiro: lienzo con margen (el ojo de pez no puede empujar la cabeza fuera) + ojo de pez en la cara.
# uso: python3 -I prep_full.py recorte.png salida.png [espejo]
import json, sys
import cv2, numpy as np
from PIL import Image
src, out = sys.argv[1:3]; flip = len(sys.argv) > 3 and sys.argv[3] == 'espejo'
meta = json.load(open(src[:-4] + '.json')); fc = dict(meta['cara'])
la = np.asarray(Image.open(src).convert('LA')).astype(np.float32) / 255
g, a = la[..., 0], la[..., 1]
if flip: g, a = g[:, ::-1].copy(), a[:, ::-1].copy(); fc['cx'] = 1 - fc['cx']
H, W = g.shape; fh = fc['h'] * H
pt, ps = int(0.6 * fh), int(0.5 * fh)                  # margen arriba y a los lados
g = np.pad(g, ((pt, 0), (ps, ps))); a = np.pad(a, ((pt, 0), (ps, ps)))
H2, W2 = g.shape; cx, cy = fc['cx'] * W + ps, fc['cy'] * H + pt
yy, xx = np.mgrid[0:H2, 0:W2].astype(np.float32); dx, dy = xx - cx, yy - cy
R, k = 3.4 * fh, 0.22
r = np.sqrt(dx * dx + dy * dy) / R; f = np.where(r < 1, 1 - k + k * r * r, 1.0)
mx, my = (cx + dx * f).astype(np.float32), (cy + dy * f).astype(np.float32)
ao = cv2.remap(a, mx, my, cv2.INTER_LINEAR); go = cv2.remap(g * a, mx, my, cv2.INTER_LINEAR) / np.maximum(ao, 1e-4)
# recorte final al contenido (con margen), sin tocar el borde inferior si la foto seguía por abajo
ys, xs = np.where(ao > 0.02); t, l, r_ = max(0, ys.min() - 10), max(0, xs.min() - 10), min(W2, xs.max() + 10)
b = H2 if meta['toca_borde'].get('abajo') else min(H2, ys.max() + 10)
go, ao = np.clip(go[t:b, l:r_], 0, 1), ao[t:b, l:r_]; H3, W3 = go.shape
Image.fromarray(np.dstack([(go * 255).astype(np.uint8)] * 3 + [(ao * 255).astype(np.uint8)]), 'RGBA').save(out, optimize=True)
cara = {'cx': round((cx - l) / W3, 4), 'cy': round((cy - t) / H3, 4), 'w': round(fc['w'] * W / W3, 4), 'h': round(fh / H3, 4)}
# borde derecho real de la cabeza (pelo, orejas, nuca), para que la punta de la flecha nunca la toque
fcy, ffh = (cy - t), fh
rows = ao[max(0, int(fcy - 1.0 * ffh)):int(fcy + 0.25 * ffh)]
cols = np.where((rows > 0.35).any(0))[0]
cab_der = float(cols.max()) / W3 if len(cols) else cara['cx'] + cara['w']
json.dump({'w': W3, 'h': H3, 'cara': cara, 'cabeza_der': round(cab_der, 4), 'abajo_continua': bool(meta['toca_borde'].get('abajo'))}, open(out[:-4] + '.json', 'w'))
print(out, W3, H3, cara)
