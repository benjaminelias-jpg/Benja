"""Recorta UNA letra de una línea enderezada de la foto y guarda su máscara.

Uso:
  python3 -I extract.py --id l1_c --line 1 --x0 40 --x1 420 \
      [--y0 0 --y1 H] [--thr 0.5] [--sigma 2.5] \
      [--erase "x,y x,y x,y; x,y x,y x,y"] [--keep all|largest|N] \
      [--base Y --xtop Y]

Todas las coordenadas son píxeles de lineN.png (la línea ya enderezada, 6x).
- thr: umbral de oscuridad 0..1 (más alto = trazo más fino).
- sigma: suavizado antes del umbral (quita la rejilla de la pantalla).
- chan: 'g' (por defecto) mide la oscuridad en el canal verde; 'max' usa max(R,G,B), así solo cuenta
  como tinta lo que es negro en los tres canales (deja fuera los flecos rojo/azul de la aberración cromática).
- erase: polígonos (separados por ';') que se borran: sirve para cortar la letra vecina.
- fill: polígonos (separados por ';') que se rellenan de tinta: sirve para reconstruir donde la
  línea naranja de la foto tapa la letra.
- keep: 'largest' deja solo la mancha más grande; 'all' deja todas; N deja las N más grandes (p. ej. 2 para i/j con punto).
- base / xtop: línea base y altura x LOCALES de esta letra (si no se dan, se usan las de la línea).
Salida: letters/<id>.png (máscara del recorte), letters/<id>.json, previews/<id>.png (contorno verde sobre la foto, borrado en rojo).
"""
import argparse, json, os
import numpy as np, cv2
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ap = argparse.ArgumentParser()
ap.add_argument('--id', required=True); ap.add_argument('--line', type=int, required=True)
ap.add_argument('--x0', type=int, required=True); ap.add_argument('--x1', type=int, required=True)
ap.add_argument('--y0', type=int); ap.add_argument('--y1', type=int)
ap.add_argument('--thr', type=float, default=0.5); ap.add_argument('--sigma', type=float, default=2.5)
ap.add_argument('--erase', default=''); ap.add_argument('--fill', default=''); ap.add_argument('--keep', default='largest')
ap.add_argument('--base', type=float); ap.add_argument('--xtop', type=float)
ap.add_argument('--chan', default='g', choices=['g', 'max'])  # g = canal verde (por defecto); max = max(R,G,B): solo cuenta como tinta lo negro en los 3 canales (excluye flecos cromáticos)
a = ap.parse_args()

info = json.load(open(os.path.join(HERE, 'lines.json')))[str(a.line)]
rgb = np.array(Image.open(os.path.join(HERE, f'line{a.line}.png')).convert('RGB'))
H, W = rgb.shape[:2]
y0 = a.y0 if a.y0 is not None else 0
y1 = a.y1 if a.y1 is not None else H
g = (rgb.max(axis=2) if a.chan == 'max' else rgb[..., 1]).astype(np.float32)
crop = g[y0:y1, a.x0:a.x1]
bg, ink = np.percentile(crop, 92), np.percentile(crop, 3)
dark = np.clip((bg - crop) / max(bg - ink, 1), 0, 1)
dark = cv2.GaussianBlur(dark, (0, 0), a.sigma) if a.sigma > 0 else dark
mask = (dark > a.thr).astype(np.uint8)
erase_polys = []
for poly in [p for p in a.erase.split(';') if p.strip()]:
    pts = np.array([[float(v) for v in q.split(',')] for q in poly.split()], np.float32)
    erase_polys.append(pts)
    cv2.fillPoly(mask, [np.round(pts - [a.x0, y0]).astype(np.int32)], 0)
fill_polys = []
for poly in [p for p in a.fill.split(';') if p.strip()]:
    pts = np.array([[float(v) for v in q.split(',')] for q in poly.split()], np.float32)
    fill_polys.append(pts)
    cv2.fillPoly(mask, [np.round(pts - [a.x0, y0]).astype(np.int32)], 1)
n, lab, st, _ = cv2.connectedComponentsWithStats(mask, 8)
order = sorted(range(1, n), key=lambda i: -st[i][4])
if a.keep == 'largest':
    keep = order[:1]
elif a.keep == 'all':
    keep = [i for i in order if st[i][4] > 400]
else:
    keep = order[:int(a.keep)]
mask = np.isin(lab, keep).astype(np.uint8) * 255
# rellenar agujeritos de la rejilla dentro del trazo (no los huecos reales de la letra)
inv = (mask == 0).astype(np.uint8)
n2, lab2, st2, _ = cv2.connectedComponentsWithStats(inv, 4)
for i in range(1, n2):
    if st2[i][4] < 300:
        mask[lab2 == i] = 255
os.makedirs(os.path.join(HERE, 'letters'), exist_ok=True); os.makedirs(os.path.join(HERE, 'previews'), exist_ok=True)
Image.fromarray(mask).save(os.path.join(HERE, 'letters', f'{a.id}.png'))
base = a.base if a.base is not None else info['baseline']
xtop = a.xtop if a.xtop is not None else info['xheight_top']
meta = dict(id=a.id, line=a.line, x0=a.x0, x1=a.x1, y0=y0, y1=y1, thr=a.thr, sigma=a.sigma, erase=a.erase, fill=a.fill,
            keep=a.keep, base=base, xtop=xtop, ink_area=int((mask > 0).sum()))
if a.chan != 'g':
    meta['chan'] = a.chan
json.dump(meta, open(os.path.join(HERE, 'letters', f'{a.id}.json'), 'w'), indent=1)
# vista previa: foto + contorno verde + zonas borradas en rojo + líneas base/altura x
pv = rgb[y0:y1, a.x0:a.x1].copy()
cnts, _ = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
cv2.drawContours(pv, cnts, -1, (0, 230, 0), 4)
for pts in erase_polys:
    cv2.polylines(pv, [np.round(pts - [a.x0, y0]).astype(np.int32)], True, (255, 0, 0), 3)
for pts in fill_polys:
    cv2.polylines(pv, [np.round(pts - [a.x0, y0]).astype(np.int32)], True, (255, 140, 0), 3)
for yy, col in ((base - y0, (0, 160, 255)), (xtop - y0, (255, 0, 255))):
    cv2.line(pv, (0, int(yy)), (pv.shape[1], int(yy)), col, 2)
# regla: marcas cada 50 px y números cada 100 px, en coordenadas de lineN.png
for X in range((a.x0 // 50 + 1) * 50, a.x1, 50):
    xx = X - a.x0
    cv2.line(pv, (xx, 0), (xx, 40 if X % 100 else 70), (220, 0, 0), 3)
    if X % 100 == 0:
        cv2.putText(pv, str(X), (xx + 4, 100), cv2.FONT_HERSHEY_SIMPLEX, 1.4, (220, 0, 0), 3)
for Y in range((y0 // 50 + 1) * 50, y1, 50):
    yy = Y - y0
    cv2.line(pv, (0, yy), (40 if Y % 100 else 70, yy), (220, 0, 0), 3)
    if Y % 100 == 0:
        cv2.putText(pv, str(Y), (75, yy + 12), cv2.FONT_HERSHEY_SIMPLEX, 1.4, (220, 0, 0), 3)
side = np.dstack([255 - mask] * 3)
out = np.concatenate([pv, np.full((pv.shape[0], 20, 3), 255, np.uint8), side], axis=1)
im = Image.fromarray(out); im.thumbnail((1600, 900)); im.save(os.path.join(HERE, 'previews', f'{a.id}.png'))
print(json.dumps(meta))
