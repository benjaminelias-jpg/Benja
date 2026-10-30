"""Fuente completa 'Laptop Grotesk'.

- Minúsculas a b c d e j l n o p r s t u: recortadas de la foto (trace/letters), con sus variantes reales.
- Todo lo demás: TeX Gyre Heros Bold pasado por la misma simulación de foto (degrade.py), 3 variantes
  para letras y números.
- Acentos sobre letras recortadas (y sobre la ı): letra + acento simulado, centrado sobre el cuerpo.
- Espaciado apretado como en la foto, con ajustes de pares (kern) para T V W Y L A P F, í ì î ï y puntuación.
"""
import json, os, sys, unicodedata, zlib
from multiprocessing import Pool
import numpy as np, cv2, pathops
from fontTools.agl import UV2AGL
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(os.path.dirname(HERE), 'trace'))
import degrade as D
import trace_font as TF

BASEFONT = os.path.join(os.path.dirname(HERE), 'basefonts', 'texgyreheros-bold.otf')
PRM = json.load(open(os.path.join(HERE, 'params.json')))
XH = 540
SB = 2              # margen de las minúsculas: casi se tocan, como en la foto, sin montarse
OVERHANG = 2        # cuánto puede sobresalir la tinta fuera del cuerpo antes de agrandar el margen
N_ALTS = 3
ASC_SCALE = 0.90    # ascendentes simuladas (h k f ...) a la altura de las recortadas (~715)
CAP_SCALE = 0.975   # mayúsculas a ~716 de alto

TRACED = set(TF.ORDER)
CHARS = (list("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzı0123456789")
         + list(".,:;!?¡¿'\"’‘”“()[]{}/\\|-–—_+=<>*#$%&@^~`´¨°ªº«»€·•…")
         + list("áéíóúàèìòùâêîôûäëïöüãõñçÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÄËÏÖÜÃÕÑÇ"))
# minúsculas acentuadas que se arman con nuestra letra base + acento simulado
COMPOSE = {c: (b, w) for c, b, w in [
    ('á', 'a', 'top'), ('é', 'e', 'top'), ('ó', 'o', 'top'), ('ú', 'u', 'top'), ('à', 'a', 'top'), ('è', 'e', 'top'),
    ('ò', 'o', 'top'), ('ù', 'u', 'top'), ('â', 'a', 'top'), ('ê', 'e', 'top'), ('ô', 'o', 'top'), ('û', 'u', 'top'),
    ('ä', 'a', 'top'), ('ë', 'e', 'top'), ('ö', 'o', 'top'), ('ü', 'u', 'top'), ('ã', 'a', 'top'), ('õ', 'o', 'top'),
    ('ñ', 'n', 'top'), ('ç', 'c', 'bottom'), ('í', 'ı', 'top'), ('ì', 'ı', 'top'), ('î', 'ı', 'top'), ('ï', 'ı', 'top')]}
OPENERS, CLOSERS = set('¿¡“‘«([{'), set('.,:;!?…’”»)]}')


# ---------------------------------------------------------------- utilidades de contornos

def rect(x0, y0, x1, y1):
    p = pathops.Path(); p.moveTo(x0, y0); p.lineTo(x1, y0); p.lineTo(x1, y1); p.lineTo(x0, y1); p.close(); return p


def shift(p, dx, dy=0):
    out = pathops.Path(); p.draw(TransformPen(out.getPen(), (1, 0, 0, 1, dx, dy))); return out


def mapy(p, f):
    """Aplica y -> f(y) a todos los puntos (los contornos son poligonales)."""
    rec = RecordingPen(); p.draw(rec)
    out = pathops.Path(); pen = out.getPen()
    for op, pts in rec.value:
        getattr(pen, op)(*[(x, f(y)) for x, y in pts])
    out.simplify()
    return out


def clip(p, x0, y0, x1, y1):
    return pathops.op(p, rect(x0, y0, x1, y1), pathops.PathOp.INTERSECTION)


def drop_small(p, min_area=500):
    """Quita contornos chicos (restos sueltos al recortar un acento)."""
    rec = RecordingPen(); p.draw(rec)
    out = pathops.Path(); pen = out.getPen(); cur = []
    def flush():
        if len(cur) > 2:
            a = 0.5 * abs(sum(cur[i][0] * cur[i - 1][1] - cur[i - 1][0] * cur[i][1] for i in range(len(cur))))
            if a >= min_area:
                pen.moveTo(cur[0])
                for q in cur[1:]:
                    pen.lineTo(q)
                pen.closePath()
    for op, pts in rec.value:
        if op == 'moveTo':
            cur = [pts[0]]
        elif op == 'lineTo':
            cur.append(pts[0])
        elif op in ('qCurveTo', 'curveTo'):
            cur.extend(pts)
        elif op in ('closePath', 'endPath'):
            flush(); cur = []
    return out


def union(a, b):
    return pathops.op(a, b, pathops.PathOp.UNION)


def bounds(p):
    b = p.bounds
    return None if b == (0, 0, 0, 0) else b


def band(p, lo=0.15, hi=0.85):
    """Extensión horizontal del contorno dentro de la franja del cuerpo (altura x)."""
    b = bounds(clip(p, -5000, lo * XH, 5000, hi * XH)) or p.bounds
    return b[0], b[2]


def mask_to_contours(mask, base, xtop, ox):
    s = XH / (base - xtop)
    cnts, _ = cv2.findContours((mask > 127).astype(np.uint8), cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    out = []
    for c in cnts:
        if cv2.contourArea(c) < 200:
            continue
        c = cv2.approxPolyDP(c, 1.2, True)[:, 0, :].astype(float)
        if len(c) >= 3:
            out.append([((u - ox) * s, (base - v) * s) for u, v in c])
    return out


def contours_to_path(contours):
    p = pathops.Path()
    for pts in contours:
        p.moveTo(*pts[0])
        for q in pts[1:]:
            p.lineTo(*q)
        p.close()
    p.simplify()
    return p


_base = None


def simulated(job):
    """job = (clave, carácter, etiqueta de semilla). Cada glifo tiene su propia semilla: su propia torcedura."""
    global _base
    key, ch, tag = job
    if _base is None:
        _base = D.Base(BASEFONT)
    prm = dict(PRM, pre_scale=0.72) if ch in '<>' else PRM
    m, meta = D.degrade(_base, ch, prm, seed=zlib.crc32(tag.encode()))
    adv = _base.glyph(ch)[1]
    if m is None:
        return key, None, adv
    return key, mask_to_contours(m, meta['base'], meta['xtop'], meta['origin_x']), adv


# ---------------------------------------------------------------- espaciado

def is_lower(ch):
    return unicodedata.category(ch) == 'Ll'


def place_lower(p, top=760):
    """Cuerpo a SB de cada lado; si la tinta (sin acentos) sobresale más de OVERHANG, se agranda el margen."""
    b0, b1 = band(p)
    ink = bounds(clip(p, -5000, -30, 5000, top)) or p.bounds
    extra_l = max(0.0, (b0 - ink[0]) - OVERHANG)
    extra_r = max(0.0, (ink[2] - b1) - OVERHANG)
    return shift(p, SB + extra_l - b0), round(b1 - b0 + 2 * SB + extra_l + extra_r)


def place_other(ch, p, hx0, hadv_rsb, body=None):
    """Mayúsculas, números y signos: proporciones de Helvetica, apretadas."""
    if ch.isupper() or unicodedata.category(ch) == 'Lu':
        fl = fr = 0.2
    elif ch.isdigit():
        fl = fr = 0.35
    elif ch in CLOSERS:
        fl, fr = 0.35, 0.75
    elif ch in OPENERS:
        fl, fr = 0.75, 0.35
    else:
        fl = fr = 0.6
    x0, _, x1, _ = (bounds(body) if body is not None else None) or p.bounds
    lsb, rsb = max(fl * hx0, 6), max(fr * hadv_rsb, 6)
    if ch == '1':
        lsb, rsb = 10, 14
    if ch in '–—':
        lsb = rsb = 40
    if ch == '-':
        lsb, rsb = max(lsb, 25), max(rsb, 25)
    return shift(p, lsb - x0), round(x1 - x0 + lsb + rsb)


# ---------------------------------------------------------------- armado

def build(out_ttf):
    base = D.Base(BASEFONT)
    name = lambda ch: UV2AGL.get(ord(ch), f'uni{ord(ch):04X}')
    glyphs, variants = {}, {}

    # 1) letras recortadas de la foto
    for ch, ids in TF.ORDER.items():
        vs = []
        for iid in ids[:N_ALTS]:
            path, bx0, bx1 = TF.glyph_from_mask(iid)
            if ch == 'j':      # el gancho de la j va debajo de la letra anterior, como en la foto
                vs.append((shift(path, SB - bx0), round(bx1 - bx0 + 2 * SB)))
            else:
                vs.append(place_lower(path))
        variants[ch] = vs

    # 2) simulaciones (en paralelo)
    jobs = []
    for ch in CHARS:
        if ch in TRACED:
            continue
        if ch in COMPOSE:
            jobs += [((ch, 100 + k), ch, f'acento/{ch}/{k}') for k in range(N_ALTS)]
        else:
            jobs += [((ch, k), ch, f'{ch}/{k}') for k in range(N_ALTS if ch.isalnum() else 1)]
    jobs += [((b, 200), b, f'base/{b}') for b in set(b for b, _ in COMPOSE.values())]
    with Pool(max(2, os.cpu_count() - 1)) as pool:
        res = pool.map(simulated, jobs, chunksize=3)
    sim = {key: (contours_to_path(cs) if cs else None, adv) for key, cs, adv in res}

    # 3) letras simuladas (sin acento compuesto)
    for ch in CHARS:
        if ch in TRACED or ch in COMPOSE:
            continue
        hb = base.glyph(ch)[0]
        hx0, hx1 = (hb.bounds[0], hb.bounds[2]) if bounds(hb) else (0, 0)
        hadv = base.glyph(ch)[1]
        # para mayúsculas acentuadas, el espaciado sale de la letra sin acento
        deco = unicodedata.decomposition(ch).split()
        base_ch = chr(int(deco[0], 16)) if deco and not deco[0].startswith('<') else ch
        if base_ch != ch:
            bb = base.glyph(base_ch)[0].bounds; hx0, hx1, hadv = bb[0], bb[2], base.glyph(base_ch)[1]
        vs = []
        k = 0
        while (ch, k) in sim:
            p, _ = sim[(ch, k)]
            k += 1
            if p is None:
                continue
            if is_lower(ch):
                p = mapy(p, lambda y: XH + (y - XH) * ASC_SCALE if y > XH else y)
                vs.append(place_lower(p))
            else:
                if unicodedata.category(ch) == 'Lu':
                    p = mapy(p, lambda y: y * CAP_SCALE)
                if ch in '<>':      # ya vienen escaladas 0.72 antes de la simulación; centradas en la banda del +
                    b = p.bounds
                    p = shift(p, 0, 250 - (b[1] + b[3]) / 2)
                body = clip(p, -5000, -400, 5000, 760) if unicodedata.category(ch) == 'Lu' else None
                vs.append(place_other(ch, p, hx0, hadv - hx1, body))
        if ch.isdigit() and vs:        # mismo avance en todas las variantes de un número, sin que ninguna quede pegada
            inks = [p.bounds for p, _ in vs]
            if ch == '1':
                adv0 = max(a for _, a in vs)
            else:
                adv0 = round(max(b[2] - b[0] for b in inks) + 2 * 12)
            vs = [(shift(p, (adv0 - (b[2] - b[0])) / 2 - b[0]), adv0) for (p, _), b in zip(vs, inks)]
        variants[ch] = vs

    # 4) acentuadas compuestas: nuestra base + acento simulado
    for ch, (b, where) in COMPOSE.items():
        hb, _ = sim[(b, 200)]
        hcx = sum(band(hb)) / 2
        htop = hb.bounds[3]
        vs = []
        for k in range(N_ALTS):
            acc_full, _ = sim[(ch, 100 + k)]
            bpath, badv = variants[b][k % len(variants[b])]
            tcx = sum(band(bpath)) / 2
            if where == 'top':
                acc = drop_small(clip(acc_full, -5000, XH + 25, 5000, 5000))
                ab = acc.bounds
                if b == 'ı':     # sobre la i: acento sobre el palo (el agudo un poco a la derecha, el grave a la izquierda)
                    off = {'í': 12, 'ì': -12}.get(ch, 0)
                    dx = tcx - (ab[0] + ab[2]) / 2 + off
                else:
                    dx = tcx - hcx
                dy = bpath.bounds[3] - htop          # sigue la altura real de nuestra letra
                vs.append((union(bpath, shift(acc, dx, max(dy, 0))), badv))
            else:  # cedilla
                acc = shift(drop_small(clip(acc_full, -5000, -5000, 5000, -12)), tcx - hcx)
                neck = bounds(clip(acc, -5000, -30, 5000, -20))
                if neck:
                    acc = union(acc, rect(neck[0], -16, neck[2], 15))   # puente solo sobre el cuello
                vs.append((union(bpath, acc), badv))
        variants[ch] = vs

    # 5) nombres de glifos
    order = ['.notdef', 'space', 'uni00A0']
    for ch in CHARS:
        n0 = name(ch); names = []
        for k, (p, adv) in enumerate(variants.get(ch, [])[:N_ALTS]):
            nm = n0 if k == 0 else f'{n0}.alt{k}'
            glyphs[nm] = (p, adv); names.append(nm)
        variants[ch] = names
    order += list(glyphs)

    # 6) tablas
    glyf, hm = {}, {}
    nd = pathops.Path()
    for r in ((50, 0, 450, 700), (110, 60, 390, 640)):
        pass
    outer, inner = rect(50, 0, 450, 700), rect(110, 60, 390, 640)
    nd = pathops.op(outer, inner, pathops.PathOp.DIFFERENCE)
    pen = TTGlyphPen(None); nd.draw(Cu2QuPen(pen, 1.0, reverse_direction=True)); glyf['.notdef'] = pen.glyph()
    glyf['space'] = TTGlyphPen(None).glyph(); glyf['uni00A0'] = TTGlyphPen(None).glyph()
    hm['.notdef'], hm['space'], hm['uni00A0'] = (500, None), (230, 0), (230, 0)
    for nm, (p, adv) in glyphs.items():
        pen = TTGlyphPen(None)
        p.draw(Cu2QuPen(pen, 1.0, reverse_direction=True))
        glyf[nm] = pen.glyph(); hm[nm] = (max(adv, 60), None)
    fb = FontBuilder(1000, isTTF=True)
    fb.setupGlyphOrder(order)
    cmap = {0x20: 'space', 0xA0: 'uni00A0'}
    cmap.update({ord(ch): v[0] for ch, v in variants.items() if v})
    fb.setupCharacterMap(cmap)
    fb.setupGlyf(glyf)
    for nm in order:
        g = glyf[nm]; g.recalcBounds(fb.font['glyf'])
        hm[nm] = (hm[nm][0], g.xMin if g.numberOfContours else 0)
    fb.setupHorizontalMetrics(hm)
    fb.setupHorizontalHeader(ascent=1000, descent=-300)
    fb.setupNameTable({
        'familyName': 'Laptop Grotesk', 'styleName': 'Regular', 'uniqueFontIdentifier': 'LaptopGrotesk-Regular;1.000',
        'fullName': 'Laptop Grotesk Regular', 'psName': 'LaptopGrotesk-Regular', 'version': 'Version 1.000',
        'copyright': 'Laptop Grotesk: 14 minúsculas trazadas de una foto de pantalla; el resto derivado de TeX Gyre Heros Bold (c) GUST e-foundry.',
        'licenseDescription': 'Los glifos derivados de TeX Gyre Heros se distribuyen bajo la GUST Font License (LPPL 1.3c).',
        'licenseInfoURL': 'http://www.gust.org.pl/fonts/licenses/GUST-FONT-LICENSE.txt',
    })
    fb.setupOS2(sTypoAscender=800, sTypoDescender=-250, sTypoLineGap=200, usWinAscent=1000, usWinDescent=300,
                sxHeight=XH, sCapHeight=716, usWeightClass=400, fsSelection=0x40, achVendID='NONE', fsType=0)
    fb.setupPost()

    # 7) OpenType: variantes que se alternan (calt) + ajustes de pares (kern)
    G = lambda chars: [n for c in chars for n in variants.get(c, [])]
    letters = [c for c in CHARS if c.isalnum() and variants.get(c)]
    base_g = [variants[c][0] for c in letters]
    b2 = [variants[c][0] for c in letters if len(variants[c]) > 1]
    a1 = [variants[c][1] for c in letters if len(variants[c]) > 1]
    b3 = [variants[c][0] for c in letters if len(variants[c]) > 2]
    a2 = [variants[c][2] for c in letters if len(variants[c]) > 2]
    LC_ROUND = 'acegoqsáéóàèòâêôäëöãõç'
    LC_STEM = 'mnpruñúùûü'
    LC_ALL = LC_ROUND + LC_STEM + 'vwxyz'
    A_ = 'AÁÀÂÄÃ'
    I_ACC = 'íìîï'

    # perfiles por fila (cada 4 unidades) para medir la distancia real entre dos letras
    prof = {}
    for nm, (p, adv) in glyphs.items():
        rows = {}
        for y in range(-340, 1100, 4):
            b = bounds(clip(p, -5000, y, 5000, y + 4))
            if b:
                rows[y] = (b[0], b[2])
        prof[nm] = (rows, adv)

    def gap(l, r):
        rl, advl = prof[l]; rr, _ = prof[r]
        g = [advl + rr[y][0] - rl[y][1] for y in rl if y in rr]
        return min(g) if g else 9999

    MIN_GAP = 6
    kern_pairs = {}       # (izq, der) -> valor

    def want(left, right, v):
        """Ajuste deseado v (negativo), sin acercarlas más de MIN_GAP (p. ej. la T sobre el acento de la ú)."""
        for r in G(right):
            for l in G(left):
                k = max(v, MIN_GAP - gap(l, r))
                if k < 0:
                    kern_pairs[(l, r)] = round(k)

    for left, right, v in [('T', LC_ALL, -110), ('VW', LC_ROUND, -70), ('VW', LC_STEM, -40), ('Y', LC_ROUND, -100),
                           ('Y', LC_STEM, -55), ('L', 'TVWY', -150), (A_, 'TY', -110), (A_, 'VW', -80), ('TY', A_, -110),
                           ('VW', A_, -80), ('PF', A_, -100), ('PF', 'J', -60), ('TVWYPF', '.,…', -100), ('¿¡', 'TVWY', -60)]:
        want(left, right, v)
    # i acentuadas: abrir solo lo justo para que el acento no choque con la letra vecina
    others = [n for n in glyphs if not any(n.split('.')[0] == variants[c][0] for c in I_ACC)]
    for ia in G(I_ACC):
        for o in others:
            for l, r in ((ia, o), (o, ia)):
                k = MIN_GAP - gap(l, r)
                if k > 0:
                    kern_pairs[(l, r)] = round(k)

    # agrupar por (derecha, valor) para que el feature quede compacto; un lookup por grupo
    groups = {}
    for (l, r), v in kern_pairs.items():
        groups.setdefault((r, v), []).append(l)
    fea = [f"@ANYBASE = [{' '.join(base_g)}];", f"@ANYALT1 = [{' '.join(a1)}];",
           f"@B2 = [{' '.join(b2)}];", f"@A1 = [{' '.join(a1)}];", f"@B3 = [{' '.join(b3)}];", f"@A2 = [{' '.join(a2)}];",
           "lookup cycle {", "    sub @ANYALT1 @B3' by @A2;", "    sub @ANYBASE @B2' by @A1;", "} cycle;",
           "feature calt { lookup cycle; } calt;"]
    # pares (izq, der) únicos: un solo lookup con pares glifo-glifo, sin conflictos de clases
    fea.append("lookup kernpairs {")
    for (l, r), v in sorted(kern_pairs.items()):
        fea.append(f"    pos {l} {r} {v};")
    fea.append("} kernpairs;")
    fea.append("feature kern { lookup kernpairs; } kern;")
    print('pares de kern:', len(kern_pairs))
    fb.addOpenTypeFeatures('\n'.join(fea))
    fb.save(out_ttf)
    print('ok', out_ttf, len(order), 'glifos,', len(cmap), 'caracteres')
    print('sin glifo:', [c for c in CHARS if not variants.get(c)])


if __name__ == '__main__':
    build(sys.argv[1])
