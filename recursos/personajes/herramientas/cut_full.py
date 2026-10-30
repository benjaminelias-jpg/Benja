# Recorte de cuerpo entero (sin encuadre previo): BiRefNet sobre la foto completa, separa a la persona elegida
# (la de la cara más cercana a --cara x,y normalizado) con watershed si hay otra pegada, limpia bordes y pasa a B/N.
# uso: python3 -I cut_full.py foto.jpg salida.png birefnet.onnx yunet.onnx cx cy
import sys, json
import cv2, numpy as np, onnxruntime as ort
from PIL import Image
from pymatting import estimate_foreground_ml
src, out, biref, yunet = sys.argv[1:5]; hx, hy = float(sys.argv[5]), float(sys.argv[6])
img = cv2.imread(src); H, W = img.shape[:2]
so = ort.SessionOptions(); so.enable_cpu_mem_arena = False
sess = ort.InferenceSession(biref, so, providers=['CPUExecutionProvider'])
rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
x = cv2.resize(rgb, (1024, 1024), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
o = sess.run(None, {sess.get_inputs()[0].name: x.transpose(2, 0, 1)[None].astype(np.float32)})[0][0, 0]
m = 1 / (1 + np.exp(-o)); m = (m - m.min()) / (m.max() - m.min() + 1e-6)
A = cv2.resize(m, (W, H), interpolation=cv2.INTER_LINEAR)
s = 800 / max(H, W); sm = cv2.resize(img, None, fx=s, fy=s)
d = cv2.FaceDetectorYN.create(yunet, '', (sm.shape[1], sm.shape[0]), 0.6, 0.3, 20); _, F = d.detect(sm)
faces = [[v / s for v in f[:4]] for f in F.tolist()]
tgt = min(faces, key=lambda f: (f[0] + f[2] / 2 - hx * W) ** 2 + (f[1] + f[3] / 2 - hy * H) ** 2)
others = [f for f in faces if f is not tgt and f[2] > 0.4 * tgt[2]]
if others:
    # watershed: semilla por persona (cara + torso), fondo donde el alfa es bajo
    mk = np.zeros((H, W), np.int32); mk[A < 0.15] = 1
    tcx = tgt[0] + tgt[2] / 2
    for lab, f in [(2, tgt)] + [(3 + i, f) for i, f in enumerate(others)]:
        cx, cy, fw, fh = f[0] + f[2] / 2, f[1] + f[3] / 2, f[2], f[3]
        # torso ancho, recortado del lado de la otra persona (la frontera queda en el hueco entre los dos)
        oc = (others[0][0] + others[0][2] / 2) if lab == 2 else tcx
        near, far = (0.45, 0.95) if oc < cx else (0.95, 0.45)
        cv2.ellipse(mk, (int(cx), int(cy)), (int(fw * .32), int(fh * .38)), 0, 0, 360, lab, -1)
        x0, x1 = int(cx - fw * near), int(cx + fw * far)
        cv2.rectangle(mk, (x0, int(cy + fh * .9)), (x1, int(min(H - 2, cy + fh * 7))), lab, -1)
    mk[(A < 0.15)] = 1
    grad = cv2.morphologyEx(cv2.GaussianBlur(img, (0, 0), 1.2), cv2.MORPH_GRADIENT, np.ones((3, 3), np.uint8))
    ws = cv2.watershed(grad, mk.copy())
    keep = (ws == 2).astype(np.uint8); keep = cv2.dilate(keep, np.ones((5, 5), np.uint8))
    A = A * cv2.GaussianBlur(keep.astype(np.float32), (0, 0), 1.5)
# componente principal (la de la cara)
bin_ = (A > 0.5).astype(np.uint8); nl, lab, st, _ = cv2.connectedComponentsWithStats(bin_, 8)
k = lab[int(tgt[1] + tgt[3] / 2), int(tgt[0] + tgt[2] / 2)]
if k: A = A * cv2.dilate((lab == k).astype(np.uint8), np.ones((15, 15), np.uint8))
sc = min(1.0, 2000 / max(H, W)); 
if sc < 1: rgb = cv2.resize(rgb, None, fx=sc, fy=sc, interpolation=cv2.INTER_AREA); A = cv2.resize(A, (rgb.shape[1], rgb.shape[0])); tgt = [v * sc for v in tgt]
Fg = estimate_foreground_ml(rgb.astype(np.float64) / 255, A.astype(np.float64))
At = np.clip((A - 0.2) / 0.65, 0, 1)
At = cv2.GaussianBlur(cv2.erode((At * 255).astype(np.uint8), np.ones((3, 3), np.uint8)), (0, 0), 0.7).astype(np.float32) / 255
g = np.clip((Fg @ np.array([0.299, 0.587, 0.114]) - 0.5) * 1.2 + 0.5 - 0.03, 0, 1)
ys, xs = np.where(At > 0.03); pad = 16
t, b, l, r = max(0, ys.min() - pad), min(At.shape[0], ys.max() + pad), max(0, xs.min() - pad), min(At.shape[1], xs.max() + pad)
g, At = g[t:b, l:r], At[t:b, l:r]; h2, w2 = g.shape
Image.fromarray(np.dstack([(g * 255).astype(np.uint8), (At * 255).astype(np.uint8)]), 'LA').save(out, optimize=True)
bordes = {k_: bool(v) for k_, v in {'arriba': t == 0, 'abajo': b == At.shape[0] + t and b >= rgb.shape[0], 'izq': l == 0, 'der': r >= rgb.shape[1]}.items()}
cara = {'cx': round((tgt[0] + tgt[2] / 2 - l) / w2, 3), 'cy': round((tgt[1] + tgt[3] / 2 - t) / h2, 3), 'w': round(tgt[2] / w2, 3), 'h': round(tgt[3] / h2, 3)}
json.dump({'ancho': w2, 'alto': h2, 'cara': cara, 'toca_borde': bordes}, open(out[:-4] + '.json', 'w'))
print(out, w2, h2, cara, bordes)
