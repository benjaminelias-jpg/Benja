"""Arma la fuente a partir de las letras recortadas de la foto (letters/*.png + *.json)."""
import glob, json, os, sys
import numpy as np, cv2, pathops
from PIL import Image
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen

HERE = os.path.dirname(os.path.abspath(__file__))
XH = 540
SB = int(os.environ.get('SB', '4'))       # margen a cada lado (las letras de la foto casi se tocan)
# orden de preferencia: la primera es la versión por defecto
ORDER = {
    'c': ['l1_c'], 'o': ['l1_o'], 'n': ['l1_n', 'l2_n'], 't': ['l1_t1', 'l2_t', 'l1_t2'], 'u': ['l1_u'],
    'l': ['l1_l'], 'a': ['l2_a1', 'l1_a', 'l2_a2', 'l2_a3'], 'p': ['l1_p'], 'r': ['l2_r'], 'b': ['l2_b'],
    'j': ['l2_j'], 'd': ['l3_d1', 'l3_d2', 'l2_d'], 'e': ['l3_e1', 'l3_e2'], 's': ['l3_s'],
}


TARGET_W = 118.0   # grosor de trazo típico de las letras nítidas (unidades de fuente)
WIDTHS = json.load(open(os.path.join(HERE, 'stroke_widths.json'))) if os.path.exists(os.path.join(HERE, 'stroke_widths.json')) else {}


def glyph_from_mask(iid):
    meta = json.load(open(os.path.join(HERE, 'letters', iid + '.json')))
    m = np.array(Image.open(os.path.join(HERE, 'letters', iid + '.png')).convert('L'))
    m = (m > 127).astype(np.uint8)
    s = XH / (meta['base'] - meta['xtop'])
    # igualar el grosor: las letras del renglón más desenfocado salieron más finas
    w = WIDTHS.get(iid)
    if w and w < 0.92 * TARGET_W:
        r = (0.97 * TARGET_W - w) / 2 / s
        pad = int(r) + 4
        mp = np.pad(m, pad)
        dist = cv2.distanceTransform((1 - mp).astype(np.uint8), cv2.DIST_L2, 5)
        m = (dist <= r).astype(np.uint8)[pad:-pad, pad:-pad]
    cnts, _ = cv2.findContours(m, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    path = pathops.Path()
    for c in cnts:
        if cv2.contourArea(c) < 200:
            continue
        c = cv2.approxPolyDP(c, 1.2, True)[:, 0, :].astype(float)
        if len(c) < 3:
            continue
        pts = [((meta['x0'] + u) * s, (meta['base'] - (meta['y0'] + v)) * s) for u, v in c]
        path.moveTo(*pts[0])
        for p in pts[1:]:
            path.lineTo(*p)
        path.close()
    path.simplify()
    # extensión horizontal del cuerpo (franja de altura x) para el espaciado: ignora colas y ganchos
    ys0 = int(meta['xtop'] - meta['y0'] + 0.15 * (meta['base'] - meta['xtop']))
    ys1 = int(meta['base'] - meta['y0'] - 0.15 * (meta['base'] - meta['xtop']))
    band = m[max(0, ys0):max(1, ys1)]
    cols = np.nonzero(band.sum(0))[0]
    if len(cols):
        bx0, bx1 = (meta['x0'] + cols.min()) * s, (meta['x0'] + cols.max()) * s
    else:
        bx0, bx1 = path.bounds[0], path.bounds[2]
    return path, bx0, bx1


def build(out, family='Laptop Grotesk'):
    order = ['.notdef', 'space']
    glyf = {'.notdef': TTGlyphPen(None).glyph(), 'space': TTGlyphPen(None).glyph()}
    adv = {'.notdef': 500, 'space': 220}
    cmap = {0x20: 'space'}
    variants = {}
    for ch, ids in ORDER.items():
        ids = [i for i in ids if os.path.exists(os.path.join(HERE, 'letters', i + '.json'))]
        names = []
        for k, iid in enumerate(ids[:3]):
            name = ch if k == 0 else f'{ch}.alt{k}'
            path, bx0, bx1 = glyph_from_mask(iid)
            pen = TTGlyphPen(None)
            path.draw(TransformPen(Cu2QuPen(pen, 1.0, reverse_direction=True), (1, 0, 0, 1, SB - bx0, 0)))
            glyf[name] = pen.glyph()
            adv[name] = round(bx1 - bx0 + 2 * SB)
            order.append(name); names.append(name)
        if names:
            cmap[ord(ch)] = names[0]
            variants[ch] = names
    fb = FontBuilder(1000, isTTF=True)
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap(cmap)
    fb.setupGlyf(glyf)
    hm = {}
    for n in order:
        g = glyf[n]; g.recalcBounds(fb.font['glyf'])
        hm[n] = (adv[n], g.xMin if g.numberOfContours else 0)
    fb.setupHorizontalMetrics(hm)
    fb.setupHorizontalHeader(ascent=950, descent=-300)
    fb.setupNameTable({'familyName': family, 'styleName': 'Regular'})
    fb.setupOS2(sTypoAscender=800, sTypoDescender=-250, usWinAscent=950, usWinDescent=300, sxHeight=XH, sCapHeight=740, fsType=0)
    fb.setupPost()
    base = [v[0] for v in variants.values()]
    alt1 = [v[1] for v in variants.values() if len(v) > 1]
    b2 = [v[0] for v in variants.values() if len(v) > 1]
    b3 = [v[0] for v in variants.values() if len(v) > 2]
    a2 = [v[2] for v in variants.values() if len(v) > 2]
    if alt1:
        fea = f"""
@ANYBASE = [{' '.join(base)}];
@ANYALT1 = [{' '.join(alt1)}];
@B2 = [{' '.join(b2)}]; @A1 = [{' '.join(alt1)}];
""" + (f"@B3 = [{' '.join(b3)}]; @A2 = [{' '.join(a2)}];\n" if a2 else "") + """
lookup cycle {
""" + ("    sub @ANYALT1 @B3' by @A2;\n" if a2 else "") + """    sub @ANYBASE @B2' by @A1;
} cycle;
feature calt { lookup cycle; } calt;
"""
        fb.addOpenTypeFeatures(fea)
    fb.save(out)
    print('ok', out, {k: len(v) for k, v in variants.items()})


if __name__ == '__main__':
    build(sys.argv[1])
