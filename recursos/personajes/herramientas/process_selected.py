# Descarga las fotos elegidas, guarda su licencia, recorta la persona (BiRefNet-portrait), limpia bordes
# (estimación de primer plano), pasa a B/N con el contraste de la skill Ramiro y anota la cara.
# uso: python3 -I process_selected.py seleccion.json candidatas.json config.json OUT_DIR birefnet.onnx yunet.onnx
import json, os, re, sys, time, html, urllib.parse, urllib.request
import cv2, numpy as np, onnxruntime as ort
from PIL import Image
from pymatting import estimate_foreground_ml

SEL, CANDS, CFG, OUT, BIREF, YUNET = sys.argv[1:7]
UA = 'BenjaCreativeTools/1.0 (https://github.com/benjaminelias-jpg/Benja)'
sel = json.load(open(SEL)); cands = json.load(open(CANDS)); cfg = {p['id']: p for p in json.load(open(CFG))}
RAW = sys.argv[7] if len(sys.argv) > 7 else os.path.join(OUT, '_originales'); os.makedirs(RAW, exist_ok=True)
so = ort.SessionOptions(); so.enable_cpu_mem_arena = False; so.intra_op_num_threads = 4
sess = ort.InferenceSession(BIREF, so, providers=['CPUExecutionProvider'])
db_path = os.path.join(OUT, 'personajes.json')
db = json.load(open(db_path)) if os.path.exists(db_path) else {}

def get(url, binary=False):
    for k in range(5):
        try:
            r = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=120)
            d = r.read(); return d if binary else d.decode('utf-8', 'replace')
        except Exception as e:
            print('  reintento', k, url[:90], e); time.sleep(6 * (k + 1))
    raise RuntimeError(url)

def strip(s): return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', s))).strip()

def licencia(file):
    h = get('https://commons.wikimedia.org/wiki/' + urllib.parse.quote(file.replace(' ', '_'))); time.sleep(1.2)
    U = r'(?:_|&#95;)'
    lic = re.search(r'class="licensetpl' + U + r'short"[^>]*>(.*?)</span>', h, re.S)
    url = re.search(r'class="licensetpl' + U + r'link"[^>]*>(.*?)</span>', h, re.S)
    aut = re.search(r'id="fileinfotpl' + U + r'aut"[^>]*>.*?</td>\s*<td[^>]*>(.*?)</td>', h, re.S)
    attr = re.search(r'class="licensetpl' + U + r'attr"[^>]*>(.*?)</span>', h, re.S)
    return {'licencia': strip(lic.group(1)) if lic else None, 'licencia_url': strip(url.group(1)) if url else None,
            'autor': strip(attr.group(1)) if attr else (strip(aut.group(1))[:200] if aut else None),
            'fuente': 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(file.replace(' ', '_'))}

def mask(rgb):
    h, w = rgb.shape[:2]
    x = cv2.resize(rgb, (1024, 1024), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
    x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
    o = sess.run(None, {sess.get_inputs()[0].name: x.transpose(2, 0, 1)[None].astype(np.float32)})[0][0, 0]
    m = 1 / (1 + np.exp(-o)); m = (m - m.min()) / (m.max() - m.min() + 1e-6)
    return cv2.resize(m, (w, h), interpolation=cv2.INTER_LINEAR)

def face(img):
    h, w = img.shape[:2]; s = 640 / max(h, w)
    sm = cv2.resize(img, (int(w * s), int(h * s)))
    d = cv2.FaceDetectorYN.create(YUNET, '', (sm.shape[1], sm.shape[0]), 0.6, 0.3, 20)
    _, f = d.detect(sm)
    if f is None: return None
    f = max(f.tolist(), key=lambda r: r[2] * r[3])
    return [v / s for v in f[:4]]

for pid, picks in sel.items():
    if pid in db and len(db[pid].get('imagenes', [])) == len(picks): continue   # ya hecho (reanudable)
    C = {c['file']: c for c in cands[pid]}
    entry = db.get(pid, {k: cfg[pid][k] for k in ('nombre', 'temas', 'por_que', 'keywords')})
    entry['nombre'] = cfg[pid]['nombre']; entry['temas'] = cfg[pid]['temas']; entry['por_que'] = cfg[pid]['por_que']; entry['keywords'] = cfg[pid]['keywords']
    imgs = []
    for n, pk in enumerate(picks, 1):
        c = C[pk['file']] if isinstance(pk, dict) else C[pk]
        name = c['name']; q = urllib.parse.quote(name)
        # Wikimedia limita las descargas de originales: miniatura estándar más grande que quepa
        std = [s_ for s_ in (1920, 1280, 960, 500) if s_ <= c['w']]
        url = (f"https://thumb.wikimedia.org/wikipedia/commons/thumb/{c['hash']}/{q}/{std[0]}px-{q}" if std
               else f"https://upload.wikimedia.org/wikipedia/commons/{c['hash']}/{q}")
        raw = os.path.join(RAW, f'{pid}-{n}' + os.path.splitext(name)[1].lower())
        try:
            if not os.path.exists(raw) or os.path.getsize(raw) == 0:
                d_ = get(url, True); open(raw, 'wb').write(d_); time.sleep(1.5)
            lic = licencia(c['file'])
        except RuntimeError as e:
            print('  SALTADA', pid, n, e, flush=True); continue
        img = cv2.imread(raw, cv2.IMREAD_COLOR)
        if img is None: print('  ILEGIBLE', raw, flush=True); continue
        H, W = img.shape[:2]
        # encuadre: plano medio alrededor de la cara (cabeza + torso), relación ~2:3
        fx, fy, fw, fh = c['face'][0] * W, c['face'][1] * H, c['face'][2] * W, c['face'][3] * H
        cw = min(W, fw * 4.4); ch = min(H, fh * 7.2)
        if ch < cw * 1.25: cw = min(cw, ch / 1.25)
        x0 = int(np.clip(fx + fw / 2 - cw / 2, 0, W - cw)); y0 = int(np.clip(fy - fh * 1.1, 0, H - ch))
        crop = img[y0:y0 + int(ch), x0:x0 + int(cw)]
        sc = min(1.0, 1600 / crop.shape[0]); crop = cv2.resize(crop, None, fx=sc, fy=sc, interpolation=cv2.INTER_AREA) if sc < 1 else crop
        rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
        a = mask(rgb)
        # quedarse con la figura principal (la que contiene la cara) y quitar manchas sueltas
        bin_ = (a > 0.5).astype(np.uint8); nl, lab, st, _ = cv2.connectedComponentsWithStats(bin_, 8)
        f2 = face(crop)
        if nl > 2 and f2:
            cx, cy = int(f2[0] + f2[2] / 2), int(f2[1] + f2[3] / 2)
            keep = lab[min(cy, lab.shape[0] - 1), min(cx, lab.shape[1] - 1)]
            if keep == 0: keep = 1 + np.argmax(st[1:, cv2.CC_STAT_AREA])
            near = cv2.dilate((lab == keep).astype(np.uint8), np.ones((25, 25), np.uint8))
            a = a * near
        # primer plano limpio (sin halo del fondo) y alfa algo más ceñido, como en la skill
        F = estimate_foreground_ml(rgb.astype(np.float64) / 255, a.astype(np.float64))
        At = np.clip((a - 0.2) / 0.65, 0, 1)
        At = cv2.GaussianBlur(cv2.erode((At * 255).astype(np.uint8), np.ones((3, 3), np.uint8)), (0, 0), 0.7).astype(np.float32) / 255
        g = F @ np.array([0.299, 0.587, 0.114])
        g = np.clip((g - 0.5) * 1.2 + 0.5 - 0.03, 0, 1)
        # recorte ajustado a la silueta con margen
        ys, xs = np.where(At > 0.03)
        pad = 12; t, b = max(0, ys.min() - pad), min(At.shape[0], ys.max() + pad); l, r = max(0, xs.min() - pad), min(At.shape[1], xs.max() + pad)
        g, At = g[t:b, l:r], At[t:b, l:r]
        fn = f'{pid}-{n}.png'
        Image.fromarray(np.dstack([(g * 255).astype(np.uint8), (At * 255).astype(np.uint8)]), 'LA').save(os.path.join(OUT, fn), optimize=True)
        fc = None
        if f2:
            fc = {'cx': round((f2[0] + f2[2] / 2 - l) / (r - l), 3), 'cy': round((f2[1] + f2[3] / 2 - t) / (b - t), 3),
                  'w': round(f2[2] / (r - l), 3), 'h': round(f2[3] / (b - t), 3)}
        imgs.append({'archivo': fn, 'ancho': int(r - l), 'alto': int(b - t), 'cara': fc,
                     'nota': pk.get('nota', '') if isinstance(pk, dict) else '', **lic, 'archivo_commons': c['file']})
        print(pid, fn, (r - l, b - t), lic['licencia'], '|', (lic['autor'] or '')[:60], flush=True)
    entry['imagenes'] = imgs
    db[pid] = entry
    json.dump(db, open(db_path, 'w'), ensure_ascii=False, indent=1)
