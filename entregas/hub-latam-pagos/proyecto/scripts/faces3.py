# Caras del hablante cada 3 frames (coordenadas en 1080x1920) para colocar los elementos sin taparle
import cv2, json, os, sys
E = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
Y = sys.argv[1]
fr = sorted(os.listdir(os.path.join(E, 'project', 'frames')))
out = {}
for i in range(0, len(fr), 3):
    im = cv2.imread(os.path.join(E, 'project', 'frames', fr[i])); im = cv2.resize(im, (540, 960))
    d = cv2.FaceDetectorYN.create(Y, '', (540, 960), 0.6, 0.3, 10); _, f = d.detect(im)
    if f is None: continue
    x, y, w, h = max(f.tolist(), key=lambda r: r[2] * r[3])[:4]
    out[i] = [round(x * 2), round(y * 2), round(w * 2), round(h * 2)]
json.dump(out, open(os.path.join(E, 'analysis', 'faces.json'), 'w'))
# resumen por tramo de 1 s
for s in range(0, len(fr), 30):
    v = [out[k] for k in out if s <= k < s + 30]
    if v: print(s // 30, 'x', min(a[0] for a in v), max(a[0] + a[2] for a in v), 'y', min(a[1] for a in v), max(a[1] + a[3] for a in v))
