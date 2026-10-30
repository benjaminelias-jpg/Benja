import json, os, sys, itertools
from multiprocessing import Pool
import numpy as np, cv2
from PIL import Image
from skimage.morphology import skeletonize
from scipy.ndimage import gaussian_filter1d
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import degrade as D

TR = D.TRACE
REF = {'c': 'l1_c', 'o': 'l1_o', 'n': 'l1_n', 't': 'l1_t1', 'u': 'l1_u', 'l': 'l1_l', 'a': 'l2_a1',
       'p': 'l1_p', 'r': 'l2_r', 'b': 'l2_b', 'j': 'l2_j', 'e': 'l3_e1'}
XHN, BASEY, CW, CH = 200, 480, 640, 720


def norm(mask, base, xtop):
    f = XHN / (base - xtop)
    m = cv2.resize(mask, None, fx=f, fy=f, interpolation=cv2.INTER_AREA)
    m = (m > 127).astype(np.uint8)
    by = int(round(base * f))
    ys0, ys1 = int((xtop + 0.15 * (base - xtop)) * f), int((base - 0.15 * (base - xtop)) * f)
    cols = np.nonzero(m[ys0:ys1].sum(0))[0]
    cx = int((cols.min() + cols.max()) / 2) if len(cols) else m.shape[1] // 2
    out = np.zeros((CH, CW), np.uint8)
    oy, ox = BASEY - by, CW // 2 - cx
    ya, yb = max(0, oy), min(CH, oy + m.shape[0]); xa, xb = max(0, ox), min(CW, ox + m.shape[1])
    out[ya:yb, xa:xb] = m[ya - oy:yb - oy, xa - ox:xb - ox]
    return out


def width(m):
    dt = cv2.distanceTransform(m, cv2.DIST_L2, 5); sk = skeletonize(m > 0); w = 2 * dt[sk]
    w = w[w > 0.3 * w.max()] if w.size else w
    return float(np.median(w)) if w.size else 0.0


def rough(m, sig=5):
    cnts, _ = cv2.findContours(m, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
    L = Ls = 0.0
    for c in cnts:
        if len(c) < 30: continue
        c = c[:, 0, :].astype(np.float32)
        L += np.sum(np.hypot(*np.diff(np.vstack([c, c[:1]]), axis=0).T))
        cs = np.stack([gaussian_filter1d(c[:, i], sig, mode='wrap') for i in range(2)], 1)
        Ls += np.sum(np.hypot(*np.diff(np.vstack([cs, cs[:1]]), axis=0).T))
    return L / max(Ls, 1)


def ref_data():
    out = {}
    for ch, iid in REF.items():
        meta = json.load(open(f'{TR}/letters/{iid}.json'))
        m = np.array(Image.open(f'{TR}/letters/{iid}.png').convert('L'))
        full = np.zeros((meta['y1'], meta['x1']), np.uint8)
        full[meta['y0']:meta['y1'], meta['x0']:meta['x1']] = m
        n = norm(full, meta['base'], meta['xtop'])
        out[ch] = (n, width(n), (rough(n), rough(n, 18)))
    return out


REFD = None


def evaluate(args):
    font, prm = args
    global REFD
    if REFD is None:
        REFD = ref_data()
    base = D.Base(font)
    ious, wr, rr, r2 = [], [], [], []
    for i, (ch, (rn, rw, rro)) in enumerate(REFD.items()):
        m, meta = D.degrade(base, ch, prm, seed=i)
        n = norm(m, meta['base'], meta['xtop'])
        # mejor desplazamiento horizontal +-20 px
        best = 0
        for dx in range(-20, 21, 4):
            s = np.roll(n, dx, axis=1)
            inter = np.logical_and(s, rn).sum(); uni = np.logical_or(s, rn).sum()
            best = max(best, inter / max(uni, 1))
        ious.append(best); wr.append(width(n) / rw); rr.append(rough(n) / rro[0]); r2.append(rough(n, 18) / rro[1])
    iou, w, r, rb = float(np.mean(ious)), float(np.median(wr)), float(np.median(rr)), float(np.median(r2))
    return dict(font=os.path.basename(font), prm=prm, iou=iou, wratio=w, rratio=r, r2ratio=rb,
                score=iou - 0.6 * abs(w - 1) - 0.4 * abs(r - 1) - 0.8 * abs(rb - 1), per=dict(zip(REFD, [round(x, 3) for x in ious])))


if __name__ == '__main__':
    B = os.path.join(os.path.dirname(D.HERE), 'basefonts')
    fonts = [f'{B}/texgyreheros-bold.otf']
    grid = [dict(thr=0.5, blur=1.4, bold=bo, warp=w, warp_len=wl, grid=gr) for bo, w, wl, gr in itertools.product([-0.6, -0.4, -0.2], [0.4, 0.8, 1.2, 1.6], [30.0, 55.0, 90.0], [0.05, 0.15, 0.3])]
    jobs = [(f, p) for f in fonts for p in grid]
    with Pool(max(2, os.cpu_count() - 1)) as pool:
        res = pool.map(evaluate, jobs, chunksize=2)
    res.sort(key=lambda r: -r['score'])
    json.dump(res, open(os.path.join(D.HERE, 'calib.json'), 'w'), indent=1)
    for r in res[:8]: print(round(r['score'], 3), r['prm'], 'iou', round(r['iou'], 3), 'w', round(r['wratio'], 2), 'r', round(r['rratio'], 3), 'r2', round(r['r2ratio'], 3))
    print('BEST', res[0]['per'])
