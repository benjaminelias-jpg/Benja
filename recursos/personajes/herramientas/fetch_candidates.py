# Busca candidatas en Commons (páginas de categoría HTML), descarga miniaturas de 500 px,
# detecta caras con YuNet y puntúa lo cerca que está cada foto de un «plano medio limpio».
# uso: python3 -I fetch_candidates.py config.json OUT_DIR yunet.onnx
import json, os, re, sys, time, html, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
import cv2, numpy as np

CFG, OUT, YUNET = sys.argv[1:4]
UA = 'BenjaCreativeTools/1.0 (https://github.com/benjaminelias-jpg/Benja)'
os.makedirs(OUT, exist_ok=True)
BAD = re.compile(r'signature|firma|logo|house|casa|car_|yacht|grave|tomb|statue|estatua|wax|cera|mural|graffiti|caricature|stamp|sello|coin|book|cover|poster|drawing|painting|sketch|map|chart|building|museum|award_|trophy|plaque|tweet|screenshot|video|\.svg|\.tif|\.gif|\.pdf|\.webm|\.ogv', re.I)

def get(url, binary=False, tries=4):
    for k in range(tries):
        try:
            r = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60)
            d = r.read(); return d if binary else d.decode('utf-8', 'replace')
        except urllib.error.HTTPError as e:
            if e.code == 404: return None
            time.sleep(5 * (k + 1))
        except Exception:
            time.sleep(3 * (k + 1))
    return None

SUBBAD = re.compile(r'signature|statue|works|films|book|house|grave|memorial|art|music|caricature|wax|museum|exhibit|store|tribute|product|logo|family|cars|yacht|award|cosplay|impersonat|mural|graffiti|stamps|coins|monument|street|ships|aircraft|companies|organizations|quotes|audio|videos|animated|drawings|paintings', re.I)

def parse(h):
    items = []
    for box in re.findall(r'<li class="gallerybox".*?</li>', h, re.S):
        f = re.search(r'href="/wiki/(File:[^"]+)"', box)
        img = re.search(r'src="(?:https:)?//(?:upload|thumb)\.wikimedia\.org/wikipedia/commons/thumb/([0-9a-f])/([0-9a-f]{2})/([^/"]+)/', box)
        dim = re.search(r'data-file-width="(\d+)" data-file-height="(\d+)"', box)
        if not (f and img and dim): continue
        items.append({'file': html.unescape(urllib.parse.unquote(f.group(1))), 'name': urllib.parse.unquote(img.group(3)),
                      'hash': img.group(1) + '/' + img.group(2), 'w': int(dim.group(1)), 'h': int(dim.group(2))})
    return items

def page(cat):
    url = 'https://commons.wikimedia.org/wiki/Category:' + urllib.parse.quote(cat.replace(' ', '_'))
    out, subs = [], []
    for _ in range(3):  # hasta 3 páginas de 200 archivos
        h = get(url); time.sleep(1.2)
        if not h: break
        out += parse(h)
        sc = h.find('id="mw-subcategories"')
        if sc >= 0 and not subs:
            blk = h[sc:h.find('id="mw-pages"') if 'id="mw-pages"' in h else h.find('id="mw-category-media"')]
            subs = [html.unescape(urllib.parse.unquote(m)).replace('_', ' ') for m in re.findall(r'href="/wiki/Category:([^"#]+)"', blk)]
        nxt = re.search(r'<a href="([^"]+filefrom=[^"]+)"[^>]*>next page</a>', h)
        if not nxt: break
        url = 'https://commons.wikimedia.org' + html.unescape(nxt.group(1))
    return out, subs

def gallery(cat):
    items, subs = page(cat)
    last = cat.split()[-1]
    subs = [c for c in dict.fromkeys(subs) if last.lower() in c.lower() and not SUBBAD.search(c)]
    pri = lambda c: (0 if re.search(r'portrait|headshot|20[12]\d|in 20', c, re.I) else 1)
    for c in sorted(subs, key=pri)[:14]:
        items += page(c)[0]
    return items

det = None
def faces(img):
    global det
    h, w = img.shape[:2]
    d = cv2.FaceDetectorYN.create(YUNET, '', (w, h), 0.75, 0.3, 50)
    _, f = d.detect(img)
    return [] if f is None else f.tolist()

def score(it, img):
    h, w = img.shape[:2]
    F = faces(img)
    if not F: return None
    F.sort(key=lambda f: -f[2] * f[3])
    x, y, fw, fh = F[0][:4]
    big = [f for f in F if f[2] * f[3] > 0.25 * fw * fh]
    re_, le, nose = (F[0][4], F[0][5]), (F[0][6], F[0][7]), (F[0][8], F[0][9])
    eye_d = abs(le[0] - re_[0]) + 1e-3
    front = 1 - min(1, abs(nose[0] - (re_[0] + le[0]) / 2) / (0.5 * eye_d))
    rel_h = fh / h; cy = (y + fh / 2) / h; cx = (x + fw / 2) / w
    orig_face = fh * it['h'] / h
    s = 0.0
    s += 2.0 * max(0, 1 - abs(rel_h - 0.17) / 0.17)        # plano medio: cara ~17 % del alto
    s += 1.0 * max(0, 1 - abs(cy - 0.30) / 0.30)
    s += 1.0 * max(0, 1 - abs(cx - 0.5) / 0.5)
    s += 1.0 * front
    s += 1.0 * min(1, orig_face / 350)
    s -= 1.5 * (len(big) - 1)
    return {'score': round(s, 3), 'n_faces': len(big), 'face': [round(v / w, 4) if i % 2 == 0 else round(v / h, 4) for i, v in enumerate([x, y, fw, fh])],
            'front': round(front, 2), 'orig_face_px': int(orig_face)}

def thumb(it):
    url = f"https://thumb.wikimedia.org/wikipedia/commons/thumb/{it['hash']}/{urllib.parse.quote(it['name'])}/500px-{urllib.parse.quote(it['name'])}"
    if it['name'].lower().endswith('.png'): pass
    d = get(url, binary=True); time.sleep(0.25)
    if not d: return None
    img = cv2.imdecode(np.frombuffer(d, np.uint8), cv2.IMREAD_COLOR)
    return d, img

people = json.load(open(CFG))
res = {}
for p in people:
    if not p['categoria']: continue
    cats = [p['categoria']]
    items, seen = [], set()
    for c in cats:
        for it in gallery(c):
            if it['file'] in seen: continue
            seen.add(it['file']); items.append(it)
    ok = [it for it in items if not BAD.search(it['name']) and it['h'] >= 1000 and it['w'] >= 650 and it['w'] / it['h'] <= 1.7]
    hint = lambda it: (2 if re.search(r'crop|portrait|headshot|retrato', it['name'], re.I) else 0) + min(it['h'], 4000) / 4000
    ok.sort(key=hint, reverse=True); ok = ok[:40]
    pdir = os.path.join(OUT, p['id']); os.makedirs(pdir, exist_ok=True)
    def work(it):
        t = thumb(it)
        if not t: return None
        d, img = t
        if img is None: return None
        sc = score(it, img)
        if not sc: return None
        fn = re.sub(r'[^\w\-]+', '_', it['name'])[:80] + '.jpg'
        cv2.imwrite(os.path.join(pdir, fn), img)
        return {**it, **sc, 'thumb': fn}
    with ThreadPoolExecutor(3) as ex:
        cands = [c for c in ex.map(work, ok) if c]
    cands.sort(key=lambda c: -c['score'])
    res[p['id']] = cands
    print(p['id'], 'archivos', len(items), 'filtrados', len(ok), 'con cara', len(cands), flush=True)
    json.dump(res, open(os.path.join(OUT, 'candidatas.json'), 'w'), ensure_ascii=False, indent=1)
