"""Simula la foto de pantalla sobre una letra de una fuente base y la vuelve a trazar.

Pipeline (igual al que sufrieron las letras reales):
  letra a resolución de pantalla (altura x ~74 px) -> deformación suave (lente/perspectiva)
  -> rejilla de puntos de pantalla + ruido -> desenfoque -> sobremuestreo 6x
  -> suavizado 2.5 px -> umbral -> contorno.
"""
import json, os
import numpy as np, cv2, pathops
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
from fontTools.pens.transformPen import TransformPen

HERE = os.path.dirname(os.path.abspath(__file__))
TRACE = os.path.join(os.path.dirname(HERE), 'trace')
UP = 6
XH_PX = 74.0     # altura x de las letras de la foto, en píxeles originales

DEFAULT = dict(warp=1.6, warp_len=55.0, warp_fine=0.45, fine_sigma=2.5, blur=1.35, grid=0.10, noise=0.05, sigma=2.5, thr=0.5,
               bold=0.0, rot_mean=0.0, rot_sd=0.0, pre_scale=1.0)


class PathopsPen(BasePen):
    def __init__(self, gs):
        super().__init__(gs); self.path = pathops.Path(); self.p = self.path.getPen()
    def _moveTo(self, pt): self.p.moveTo(pt)
    def _lineTo(self, pt): self.p.lineTo(pt)
    def _curveToOne(self, a, b, c): self.p.curveTo(a, b, c)
    def _qCurveToOne(self, a, b): self.p.qCurveTo(a, b)
    def _closePath(self): self.p.closePath()
    def _endPath(self): self.p.endPath()


class Base:
    def __init__(self, path):
        self.f = TTFont(path)
        self.gs = self.f.getGlyphSet()
        self.cmap = self.f.getBestCmap()
        self.xh = self.f['OS/2'].sxHeight
        self.upm = self.f['head'].unitsPerEm

    def glyph(self, ch):
        name = self.cmap.get(ord(ch))
        if name is None:
            return None, 0
        pen = PathopsPen(self.gs)
        self.gs[name].draw(pen)
        return pen.path, self.gs[name].width


def flatten(path, step):
    from fontTools.pens.recordingPen import RecordingPen
    rec = RecordingPen(); path.draw(rec)
    contours, cur, last = [], [], None
    for op, pts in rec.value:
        if op == 'moveTo':
            cur = [pts[0]]; last = pts[0]
        elif op == 'lineTo':
            cur.append(pts[0]); last = pts[0]
        elif op in ('curveTo', 'qCurveTo'):
            ctrl = [last] + list(pts)
            L = sum(np.hypot(ctrl[i + 1][0] - ctrl[i][0], ctrl[i + 1][1] - ctrl[i][1]) for i in range(len(ctrl) - 1))
            for t in np.linspace(0, 1, max(4, int(L / step)) + 1)[1:]:
                q = [np.array(p, float) for p in ctrl]
                while len(q) > 1:
                    q = [(1 - t) * q[i] + t * q[i + 1] for i in range(len(q) - 1)]
                cur.append(tuple(q[0]))
            last = pts[-1]
        elif op in ('closePath', 'endPath'):
            if cur:
                contours.append(cur)
            cur = []
    return contours


def degrade(base, ch, prm=None, seed=0):
    """Devuelve (mask 6x, meta) con el mismo formato que trace/letters/*.png + json."""
    prm = dict(DEFAULT, **(prm or {}))
    path, adv = base.glyph(ch)
    if path is None or path.bounds == (0, 0, 0, 0):
        return None, None
    if prm['pre_scale'] != 1.0:     # escalar la letra base antes de "fotografiarla" (p. ej. < >)
        bx0, by0, bx1, by1 = path.bounds; cxp, cyp = (bx0 + bx1) / 2, (by0 + by1) / 2; sc = prm['pre_scale']
        scaled = pathops.Path(); path.draw(TransformPen(scaled.getPen(), (sc, 0, 0, sc, cxp * (1 - sc), cyp * (1 - sc))))
        path = scaled
    k = XH_PX / base.xh                     # px originales por unidad de la fuente base
    xmin, ymin, xmax, ymax = path.bounds
    pad = 14
    W = int((xmax - xmin) * k + 2 * pad) + 1
    H = int((ymax - ymin) * k + 2 * pad) + 1
    ss = 4
    hi = np.zeros((H * ss, W * ss), np.uint8)
    rng = np.random.default_rng(seed)
    for c in flatten(path, 4 * base.upm / 1000):
        pts = np.array([[((x - xmin) * k + pad) * ss, ((ymax - y) * k + pad) * ss] for x, y in c], np.float32)
        m = np.zeros_like(hi)
        cv2.fillPoly(m, [np.round(pts * 16).astype(np.int32)], 1, shift=4)
        hi ^= m
    cov = cv2.resize(hi.astype(np.float32), (W, H), interpolation=cv2.INTER_AREA)
    if prm['bold']:
        r = int(round(abs(prm['bold']) * ss))
        hi2 = cv2.dilate(hi, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))) if prm['bold'] > 0 else \
              cv2.erode(hi, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1)))
        cov = cv2.resize(hi2.astype(np.float32), (W, H), interpolation=cv2.INTER_AREA)
    # sobremuestreo a 6x ANTES de deformar (deformación suave sin pixelar)
    big = cv2.resize(cov, (W * UP, H * UP), interpolation=cv2.INTER_CUBIC)
    yy, xx = np.mgrid[0:H * UP, 0:W * UP].astype(np.float32)
    def field(amp, wl):
        out = np.zeros_like(xx)
        for _ in range(3):
            ang = rng.uniform(0, np.pi); f = 2 * np.pi / (wl * UP * rng.uniform(0.7, 1.4))
            out += amp * UP / np.sqrt(3) * np.sin(f * (np.cos(ang) * xx + np.sin(ang) * yy) + rng.uniform(0, 6.3))
        return out
    def noise_field(amp, sig):
        # ruido aleatorio de banda limitada (no ondas regulares), en píxeles originales
        n = cv2.GaussianBlur(rng.normal(0, 1, (H, W)).astype(np.float32), (0, 0), sig)
        n /= n.std() + 1e-6
        return cv2.resize(n, (W * UP, H * UP), interpolation=cv2.INTER_CUBIC) * amp * UP
    dx = field(prm['warp'], prm['warp_len']) + noise_field(prm['warp_fine'], prm['fine_sigma'])
    dy = field(prm['warp'], prm['warp_len']) + noise_field(prm['warp_fine'], prm['fine_sigma'])
    if prm['rot_sd'] or prm['rot_mean']:   # cada letra queda un poco torcida, como en la foto (giro sobre la línea base)
        a = -np.radians(np.clip(rng.normal(prm['rot_mean'], prm['rot_sd']), -1.0, 4.0))   # + = inclinada hacia adelante
        cx, cy = W * UP / 2, ymax * k * UP + pad * UP
        dx += (xx - cx) * (np.cos(a) - 1) - (yy - cy) * np.sin(a)
        dy += (xx - cx) * np.sin(a) + (yy - cy) * (np.cos(a) - 1)
    big = cv2.remap(big, xx + dx, yy + dy, cv2.INTER_LINEAR, borderValue=0)
    # rejilla de puntos de pantalla (periodo ~3.3 px originales) + ruido
    per = 3.3 * UP
    grid = 0.5 + 0.5 * np.cos(2 * np.pi * xx / per) * np.cos(2 * np.pi * yy / per)
    big = big * (1 - prm['grid'] * grid) + prm['noise'] * cv2.GaussianBlur(rng.normal(0, 1, big.shape).astype(np.float32), (0, 0), UP * 0.6)
    big = cv2.GaussianBlur(big, (0, 0), prm['blur'] * UP)
    big = cv2.GaussianBlur(big, (0, 0), prm['sigma'])
    lo, hi_ = np.percentile(big, 1), np.percentile(big, 99.7)
    dark = np.clip((big - lo) / max(hi_ - lo, 1e-6), 0, 1)
    mask = (dark > prm['thr']).astype(np.uint8) * 255
    # quitar manchitas sueltas y agujeritos (como en extract.py)
    n, lab, st, _ = cv2.connectedComponentsWithStats((mask > 0).astype(np.uint8), 8)
    keep = [i for i in range(1, n) if st[i][4] > 400]
    mask = np.isin(lab, keep).astype(np.uint8) * 255
    inv = (mask == 0).astype(np.uint8)
    n2, lab2, st2, _ = cv2.connectedComponentsWithStats(inv, 4)
    for i in range(1, n2):
        if st2[i][4] < 300:
            mask[lab2 == i] = 255
    base_y = (ymax - 0) * k * UP + pad * UP       # y de la línea base en el lienzo 6x
    xtop_y = (ymax - base.xh) * k * UP + pad * UP
    meta = dict(x0=0, y0=0, base=float(base_y), xtop=float(xtop_y),
                adv_px=float(adv * k * UP), xmin_px=float(pad * UP - 0 + 0), origin_x=float((0 - xmin) * k * UP + pad * UP))
    return mask, meta
