# Segunda pasada para quien tiene pocas candidatas: entra en «<Persona> by year» (años recientes primero)
# y en «Portraits of <Persona>», y añade lo nuevo a candidatas.json.
# uso: python3 -I supplement.py config.json OUT_DIR yunet.onnx id1 id2 ...
import sys, os, json
here = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(here, 'fetch_candidates.py')).read().split('people = json.load')[0]
argv = sys.argv; sys.argv = argv[:4]
exec(src)
ids = argv[4:]
people = {p['id']: p for p in json.load(open(CFG))}
res = json.load(open(os.path.join(OUT, 'candidatas.json')))
for pid in ids:
    p = people[pid]; cat = p['categoria']
    have = {c['file'] for c in res.get(pid, [])}
    items = []
    _, years = page(cat + ' by year')
    years = [y for y in dict.fromkeys(years) if re.search(r'(19[5-9]\d|20[0-2]\d)', y)]
    years.sort(key=lambda y: -int(re.search(r'(19[5-9]\d|20[0-2]\d)', y).group(1)))
    for y in years[:16]:
        items += page(y)[0]
    items += page('Portraits of ' + cat)[0]
    seen = set(have); new = []
    for it in items:
        if it['file'] in seen: continue
        seen.add(it['file']); new.append(it)
    ok = [it for it in new if not BAD.search(it['name']) and it['h'] >= 1000 and it['w'] >= 650 and it['w'] / it['h'] <= 1.7]
    hint = lambda it: (2 if re.search(r'crop|portrait|headshot|retrato', it['name'], re.I) else 0) + min(it['h'], 4000) / 4000
    ok.sort(key=hint, reverse=True); ok = ok[:40]
    pdir = os.path.join(OUT, pid); os.makedirs(pdir, exist_ok=True)
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
    allc = res.get(pid, []) + cands
    allc.sort(key=lambda c: -c['score'])
    res[pid] = allc
    print(pid, 'años', len(years), 'nuevos', len(new), 'filtrados', len(ok), 'con cara', len(cands), 'total', len(allc), flush=True)
    json.dump(res, open(os.path.join(OUT, 'candidatas.json'), 'w'), ensure_ascii=False, indent=1)
