import numpy as np, cv2, json
from PIL import Image
im = np.array(Image.open('../../images/2.webp').convert('RGB')).astype(np.float32)
G = im[..., 1]
dark = (G < 95).astype(np.uint8)
dark[:, 745:] = 0
dark[:30, :] = 0
n, lab, st, _ = cv2.connectedComponentsWithStats(dark, 8)
LINES = {1: (40, 215), 2: (195, 360), 3: (362, 538)}
info = {}
UP = 6
big = cv2.resize(im, None, fx=UP, fy=UP, interpolation=cv2.INTER_CUBIC)
for k, (ya, yb) in LINES.items():
    keep = np.zeros_like(dark)
    for i in range(1, n):
        x, y, w, h, a = st[i]
        cy = y + h / 2
        if a > 150 and ya <= cy <= yb:
            keep[lab == i] = 1
    ys, xs = np.nonzero(keep)
    cx, cyc = xs.mean(), ys.mean()
    best = None
    for ang in np.arange(-15, 5, 0.1):
        M = cv2.getRotationMatrix2D((float(cx), float(cyc)), float(ang), 1)
        r = cv2.warpAffine(keep * 255, M, (im.shape[1], im.shape[0]))
        prof = (r > 127).sum(1).astype(float)
        score = (np.diff(prof) ** 2).sum()
        if best is None or score > best[0]:
            best = (score, ang)
    ang = best[1]
    # rotate the upscaled photo around the same center
    M = cv2.getRotationMatrix2D((float(cx * UP), float(cyc * UP)), float(ang), 1)
    rot = cv2.warpAffine(big, M, (big.shape[1], big.shape[0]), borderMode=cv2.BORDER_REPLICATE)
    Mk = cv2.getRotationMatrix2D((float(cx), float(cyc)), float(ang), 1)
    rk = cv2.warpAffine(keep * 255, Mk, (im.shape[1], im.shape[0]))
    prof = (rk > 127).sum(1).astype(float)
    rows = np.nonzero(prof > 0.45 * prof.max())[0]
    top, base = rows.min(), rows.max()
    xh = base - top
    y0 = int(max(0, (top - 1.1 * xh)) * UP); y1 = int(min(im.shape[0], base + 0.75 * xh) * UP)
    xs_r = np.nonzero(rk.sum(0))[0]
    x0 = int(max(0, xs_r.min() - 10) * UP); x1 = int(min(im.shape[1], xs_r.max() + 10) * UP)
    crop = rot[y0:y1, x0:x1]
    Image.fromarray(np.clip(crop, 0, 255).astype(np.uint8)).save(f'line{k}.png')
    info[k] = dict(angle=round(float(ang), 2), baseline=float(base * UP - y0), xheight_top=float(top * UP - y0),
                   size=[crop.shape[1], crop.shape[0]], scale=UP)
    print(k, info[k])
json.dump(info, open('lines.json', 'w'), indent=1)
