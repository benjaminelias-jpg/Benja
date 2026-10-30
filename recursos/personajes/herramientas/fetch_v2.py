# Candidatas desde los artículos de Wikipedia (en, es, de, fr, it, pt) + imagen principal de Wikidata (P18).
# Son los retratos ya elegidos por los editores, mucho más limpios que las categorías de Commons.
# uso: python3 -I fetch_v2.py config.json OUT_DIR yunet.onnx [ids...]
import sys, os, json, hashlib, unicodedata
here = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(here, 'fetch_candidates.py')).read().split('people = json.load')[0]
argv = sys.argv; sys.argv = argv[:4]
exec(src)
WIKI = {'rafa-nadal': 'Rafael_Nadal', 'mrbeast': 'MrBeast'}
LANGS = ['es', 'de', 'fr', 'it', 'pt']

def fold(s): return ''.join(c for c in unicodedata.normalize('NFD', s.lower()) if unicodedata.category(c) != 'Mn')

def article_imgs(h, keys):
    out = []
    body = h[h.find('id="mw-content-text"'):]
    info_end = body.find('</table>') if 'infobox' in body[:20000] else -1
    for m in re.finditer(r'<img [^>]*src="(?:https:)?//(?:upload|thumb)\.wikimedia\.org/wikipedia/commons/thumb/([0-9a-f])/([0-9a-f]{2})/([^/"]+)/[^"]*"[^>]*>', body):
        tag = m.group(0); name = urllib.parse.unquote(m.group(3))
        dim = re.search(r'data-file-width="(\d+)" data-file-height="(\d+)"', tag)
        if not dim or not any(k in fold(name) for k in keys): continue
        out.append({'file': 'File:' + name, 'name': name, 'hash': m.group(1) + '/' + m.group(2),
                    'w': int(dim.group(1)), 'h': int(dim.group(2)), 'infobox': 0 <= m.start() < info_end})
    return out

def dims(name):
    h = get('https://commons.wikimedia.org/wiki/File:' + urllib.parse.quote(name.replace(' ', '_'))); time.sleep(1.2)
    m = re.search(r'([\d,\.]+)\s*×\s*([\d,\.]+)\s*pixels', h or '')
    return (int(re.sub(r'\D', '', m.group(1))), int(re.sub(r'\D', '', m.group(2)))) if m else (0, 0)

people = json.load(open(CFG))
ids = argv[4:] or [p['id'] for p in people if p['categoria']]
P = {p['id']: p for p in people}
path = os.path.join(OUT, 'candidatas.json')
res = json.load(open(path)) if os.path.exists(path) else {}
for pid in ids:
    p = P[pid]
    parts = fold(p['nombre']).split()
    keys = [parts[-1]] + ([parts[0]] if len(parts) > 1 else []) + (['beast', 'donaldson'] if pid == 'mrbeast' else [])
    title = WIKI.get(pid, p['nombre'].replace(' ', '_'))
    h = get('https://en.wikipedia.org/wiki/' + urllib.parse.quote(title)); time.sleep(1.2)
    items = article_imgs(h, keys) if h else []
    q = re.search(r'wikidata\.org/wiki/Special:EntityPage/(Q\d+)', h or '') or re.search(r'wikidata\.org/wiki/(Q\d+)', h or '')
    p18 = []
    if q:
        e = list(json.loads(get(f'https://www.wikidata.org/wiki/Special:EntityData/{q.group(1)}.json'))['entities'].values())[0]; time.sleep(1)
        p18 = [c['mainsnak']['datavalue']['value'] for c in e['claims'].get('P18', [])]
        for l in LANGS:
            t = e['sitelinks'].get(l + 'wiki', {}).get('title')
            if not t: continue
            hh = get(f'https://{l}.wikipedia.org/wiki/' + urllib.parse.quote(t.replace(' ', '_'))); time.sleep(1.2)
            if hh: items += article_imgs(hh, keys)
    for n in p18:
        nm = n.replace(' ', '_'); md = hashlib.md5(nm.encode()).hexdigest()
        if any(it['name'] == nm for it in items):
            for it in items:
                if it['name'] == nm: it['infobox'] = True
            continue
        w, hgt = dims(nm)
        items.append({'file': 'File:' + nm, 'name': nm, 'hash': md[0] + '/' + md[:2], 'w': w, 'h': hgt, 'infobox': True})
    uniq = {}
    for it in items:
        if it['name'] in uniq: uniq[it['name']]['infobox'] |= it['infobox']; uniq[it['name']]['n'] += 1
        else: uniq[it['name']] = {**it, 'n': 1}
    ok = [it for it in uniq.values() if not BAD.search(it['name']) and it['h'] >= 700 and it['w'] >= 450]
    pdir = os.path.join(OUT, pid); os.makedirs(pdir, exist_ok=True)
    def work(it):
        t = thumb(it) if it['w'] >= 500 else None
        if not t: return None
        d, img = t
        if img is None: return None
        sc = score(it, img)
        if not sc: return None
        sc['score'] = round(sc['score'] - 1.0 * (sc['n_faces'] - 1) + 0.8 * it['infobox'] + 0.2 * min(it['n'], 4), 3)
        fn = re.sub(r'[^\w\-]+', '_', it['name'])[:80] + '.jpg'
        cv2.imwrite(os.path.join(pdir, fn), img)
        return {**it, **sc, 'thumb': fn}
    with ThreadPoolExecutor(3) as ex:
        cands = [c for c in ex.map(work, ok) if c]
    cands.sort(key=lambda c: -c['score'])
    res[pid] = cands
    print(pid, 'imágenes', len(uniq), 'filtradas', len(ok), 'con cara', len(cands), flush=True)
    json.dump(res, open(path, 'w'), ensure_ascii=False, indent=1)
