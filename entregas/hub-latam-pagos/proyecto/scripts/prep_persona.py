# Prepara la persona de cada escena Ramiro: recorte B/N de la BBDD (o de un frame del video) + ojo de pez en la cara.
# uso: python3 -I prep_persona.py bbdd <personajes.json> <id> <n> <salida.png>
#      python3 -I prep_persona.py frame <frame.jpg> <birefnet.onnx> <yunet.onnx> <salida.png>
import json, os, sys
import cv2, numpy as np
from PIL import Image

def fisheye(g, a, cx, cy, R, k=0.22):
    # misma lente que la skill: abomba el centro (cara) sin mover el borde del radio R
    H, W = g.shape
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    dx, dy = xx - cx, yy - cy
    r = np.sqrt(dx * dx + dy * dy) / R
    f = np.where(r < 1, 1 - k + k * r * r, 1.0)
    mx, my = (cx + dx * f).astype(np.float32), (cy + dy * f).astype(np.float32)
    ao = cv2.remap(a, mx, my, cv2.INTER_LINEAR)
    go = cv2.remap(g * a, mx, my, cv2.INTER_LINEAR) / np.maximum(ao, 1e-4)
    return np.clip(go, 0, 1), ao

mode = sys.argv[1]
if mode == 'bbdd':
    db, pid, n, out = sys.argv[2], sys.argv[3], int(sys.argv[4]), sys.argv[5]
    D = json.load(open(db)); im = D[pid]['imagenes'][n - 1]
    la = np.asarray(Image.open(os.path.join(os.path.dirname(db), im['archivo'])).convert('LA')).astype(np.float32) / 255
    g, a = la[..., 0], la[..., 1]; H, W = g.shape
    fc = im['cara']; cx, cy, fh = fc['cx'] * W, fc['cy'] * H, fc['h'] * H
else:
    from pymatting import estimate_foreground_ml
    import onnxruntime as ort
    src, biref, yunet, out = sys.argv[2:6]
    img = cv2.imread(src); Hs, Ws = img.shape[:2]
    so = ort.SessionOptions(); so.enable_cpu_mem_arena = False
    sess = ort.InferenceSession(biref, so, providers=['CPUExecutionProvider'])
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    x = cv2.resize(rgb, (1024, 1024), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
    x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
    o = sess.run(None, {sess.get_inputs()[0].name: x.transpose(2, 0, 1)[None].astype(np.float32)})[0][0, 0]
    m = 1 / (1 + np.exp(-o)); m = (m - m.min()) / (m.max() - m.min() + 1e-6)
    A = cv2.resize(m, (Ws, Hs), interpolation=cv2.INTER_LINEAR)
    F = estimate_foreground_ml(rgb.astype(np.float64) / 255, A.astype(np.float64))
    a = np.clip((A - 0.2) / 0.65, 0, 1).astype(np.float32)
    a = cv2.GaussianBlur(cv2.erode((a * 255).astype(np.uint8), np.ones((3, 3), np.uint8)), (0, 0), 0.7).astype(np.float32) / 255
    g = F @ np.array([0.299, 0.587, 0.114]); g = np.clip((g - 0.5) * 1.2 + 0.5 - 0.03, 0, 1).astype(np.float32)
    ys, xs = np.where(a > 0.03); t, b, l, r = max(0, ys.min() - 12), Hs, max(0, xs.min() - 12), min(Ws, xs.max() + 12)
    g, a = g[t:b, l:r], a[t:b, l:r]; H, W = g.shape
    sm = cv2.resize(img[t:b, l:r], None, fx=0.5, fy=0.5)
    d = cv2.FaceDetectorYN.create(yunet, '', (sm.shape[1], sm.shape[0]), 0.6, 0.3, 10); _, f = d.detect(sm)
    fx, fy, fw, fh = [v * 2 for v in max(f.tolist(), key=lambda q: q[2] * q[3])[:4]]
    cx, cy = fx + fw / 2, fy + fh / 2
    fc = {'cx': round(cx / W, 3), 'cy': round(cy / H, 3), 'w': round(fw / W, 3), 'h': round(fh / H, 3)}
# hombros cortados por el borde de la foto original: fundido lateral para que no quede un canto recto
for side in ('l', 'r'):
    col = a[:, :14].max(1) if side == 'l' else a[:, -14:].max(1)
    if (col > 0.5).mean() > 0.03:
        F = int(0.07 * W); ramp = np.clip(np.arange(W) / F, 0, 1) if side == 'l' else np.clip((W - 1 - np.arange(W)) / F, 0, 1)
        a = a * (ramp[None, :] ** 1.4).astype(np.float32)
g2, a2 = fisheye(g.astype(np.float32), a.astype(np.float32), cx, cy, R=3.4 * fh)
Image.fromarray(np.dstack([(g2 * 255).astype(np.uint8)] * 3 + [(a2 * 255).astype(np.uint8)]), 'RGBA').save(out, optimize=True)
json.dump({'w': W, 'h': H, 'cara': fc}, open(out[:-4] + '.json', 'w'))
print(out, W, H, fc)
