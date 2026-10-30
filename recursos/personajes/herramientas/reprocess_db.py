# Rehace la BBDD con la silueta completa de cada foto (sin encuadre previo: nunca corta hombros ni cabeza)
# y marca qué fotos sirven para una escena a pantalla completa (cuerpo que sigue hacia abajo y sin cortes laterales).
# uso: python3 -I reprocess_db.py <dir_bbdd> <candidatas.json> <seleccion.json> <originales> <birefnet> <yunet> [extras.json]
import json, os, subprocess, sys
R, CANDS, SEL, ORIG, BIREF, YUNET = sys.argv[1:7]
EXTRA = json.load(open(sys.argv[7])) if len(sys.argv) > 7 else []
here = os.path.dirname(os.path.abspath(__file__))
db = json.load(open(os.path.join(R, 'personajes.json')))
cands = json.load(open(CANDS)); sel = json.load(open(SEL))
def cut(src, out, hx, hy):
    subprocess.run([sys.executable, '-I', os.path.join(here, 'cut_full.py'), src, out, BIREF, YUNET, str(hx), str(hy)], check=True, capture_output=True)
    return json.load(open(out[:-4] + '.json'))
def clasifica(m):
    c, tb = m['cara'], m['toca_borde']
    debajo = (1 - c['cy'] - c['h'] / 2) / c['h']          # cuerpo bajo la barbilla, en alturas de cara
    lados = tb['izq'] or tb['der'] or tb['arriba']
    if not lados and not tb['abajo']: return 'cuerpo entero'
    if not lados and debajo >= 3.2: return 'escena'          # sigue por abajo: su borde inferior queda fuera del encuadre
    return 'primer plano'
for pid, p in db.items():
    C = {c['file']: c for c in cands.get(pid, [])}
    for im in p['imagenes']:
        f = im['archivo_commons']; c = C.get(f)
        n = im['archivo'].rsplit('-', 1)[1][:-4]
        raw = next((os.path.join(ORIG, x) for x in os.listdir(ORIG) if x.startswith(f'{pid}-{n}.')), None)
        if not raw or not c: print('  sin original', pid, n); continue
        hx, hy = c['face'][0] + c['face'][2] / 2, c['face'][1] + c['face'][3] / 2
        try: m = cut(raw, os.path.join(R, im['archivo']), hx, hy)
        except subprocess.CalledProcessError as e: print('  ERROR', pid, n, e.stderr[-300:]); continue
        os.remove(os.path.join(R, im['archivo'])[:-4] + '.json')
        im.update({'ancho': m['ancho'], 'alto': m['alto'], 'cara': m['cara'], 'toca_borde': m['toca_borde'], 'uso': clasifica(m)})
        print(pid, im['archivo'], im['uso'], m['toca_borde'], flush=True)
    json.dump(db, open(os.path.join(R, 'personajes.json'), 'w'), ensure_ascii=False, indent=1)
# fotos de cuerpo entero añadidas a mano (ya recortadas)
for e in EXTRA:
    p = db[e['id']]; n = len(p['imagenes']) + 1; fn = f"{e['id']}-{n}.png"
    subprocess.run(['cp', e['png'], os.path.join(R, fn)], check=True)
    m = json.load(open(e['png'][:-4] + '.json'))
    p['imagenes'].append({'archivo': fn, 'ancho': m['ancho'], 'alto': m['alto'], 'cara': m['cara'], 'toca_borde': m['toca_borde'], 'uso': clasifica(m),
                          'licencia': e['licencia'], 'licencia_url': e.get('licencia_url'), 'autor': e['autor'], 'fuente': e['fuente'], 'archivo_commons': e['file'],
                          'nota_derechos': 'Licencia de la foto: ver «licencia». Derechos de imagen de la persona aparte (no implica respaldo).'})
    print('añadida', fn, clasifica(m))
json.dump(db, open(os.path.join(R, 'personajes.json'), 'w'), ensure_ascii=False, indent=1)
print('ok')
