# Hojas de contacto de candidatas: una fila por persona, las N mejores con su índice.
# uso: python3 -I sheet_candidates.py CANDS_DIR OUT_PREFIX [N] [personas_por_hoja] [ids...]
import json, os, sys
from PIL import Image, ImageDraw, ImageFont
D, PRE = sys.argv[1:3]
N = int(sys.argv[3]) if len(sys.argv) > 3 else 10
PER = int(sys.argv[4]) if len(sys.argv) > 4 else 4
C = json.load(open(os.path.join(D, 'candidatas.json')))
ids = sys.argv[5:] or list(C)
TW, TH = 200, 260
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 18) if os.path.exists('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf') else ImageFont.load_default()
for s in range(0, len(ids), PER):
    grp = ids[s:s + PER]
    sheet = Image.new('RGB', (N * TW, len(grp) * (TH + 30)), '#222')
    d = ImageDraw.Draw(sheet)
    for r, pid in enumerate(grp):
        d.text((6, r * (TH + 30) + 5), pid, fill='#ffd24a', font=font)
        for i, c in enumerate(C[pid][:N]):
            im = Image.open(os.path.join(D, pid, c['thumb'])).convert('RGB'); im.thumbnail((TW - 6, TH - 6))
            x, y = i * TW + 3, r * (TH + 30) + 30
            sheet.paste(im, (x, y))
            d.rectangle([x, y, x + 34, y + 22], fill='#000'); d.text((x + 4, y + 1), str(i), fill='#fff', font=font)
            d.text((x + 40, y + 1), f"{c['score']:.1f} {c['orig_face_px']}", fill='#0f0', font=font)
    sheet.save(f'{PRE}_{s // PER + 1}.jpg', quality=85)
    print(f'{PRE}_{s // PER + 1}.jpg', grp)
