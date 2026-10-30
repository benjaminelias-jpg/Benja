# Sugiere personajes de la BBDD para un texto (una frase del guion, un tema…), por coincidencia de palabras clave y temas.
# uso: python3 recursos/personajes/buscar.py "estás perdiendo dinero en cada venta"
import json, os, re, sys, unicodedata
D = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'personajes.json')))

def fold(s):
    s = unicodedata.normalize('NFD', s.lower())
    return ''.join(c for c in s if unicodedata.category(c) != 'Mn')

def puntua(texto):
    t = ' ' + re.sub(r'[^\w%]+', ' ', fold(texto)) + ' '
    res = []
    for pid, p in D.items():
        hits = [k for k in p['keywords'] if ' ' + fold(k) + ' ' in t or (len(k) > 5 and fold(k) in t)]
        hits += [k for k in p['temas'] if fold(k) in t and k not in hits]
        if hits: res.append((len(hits), pid, p['nombre'], hits, len(p['imagenes'])))
    return sorted(res, reverse=True)

if __name__ == '__main__':
    texto = ' '.join(sys.argv[1:]) or sys.stdin.read()
    r = puntua(texto)
    if not r: print('Sin coincidencias. Temas disponibles:', ', '.join(sorted({t for p in D.values() for t in p['temas']})))
    for n, pid, nombre, hits, nimg in r[:5]:
        print(f'{nombre:20} {n} coincidencia(s): {", ".join(hits)}  ·  {nimg} foto(s) {"(sin foto todavía)" if not nimg else ""}')
