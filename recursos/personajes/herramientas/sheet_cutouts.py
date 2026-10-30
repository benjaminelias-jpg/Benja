# Hoja de QA de los recortes B/N sobre papel beige (#e4dfd2), como se verán en la escena Ramiro
# uso: python3 -I sheet_cutouts.py DIR salida.jpg [alto_celda] [zoom_cara]
import os, sys, json
from PIL import Image, ImageDraw, ImageFont
D, out = sys.argv[1:3]; CH = int(sys.argv[3]) if len(sys.argv) > 3 else 420
files = sorted(f for f in os.listdir(D) if f.endswith('.png'))
cols = 8; CW = int(CH * 0.72)
rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (cols * CW, rows * (CH + 24)), '#e4dfd2'); d = ImageDraw.Draw(sheet)
fp = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
font = ImageFont.truetype(fp, 15) if os.path.exists(fp) else ImageFont.load_default()
for i, f in enumerate(files):
    im = Image.open(os.path.join(D, f)).convert('LA').convert('RGBA'); im.thumbnail((CW - 8, CH - 8))
    x, y = (i % cols) * CW, (i // cols) * (CH + 24)
    sheet.paste(im, (x + (CW - im.width) // 2, y + CH - im.height), im)
    d.text((x + 4, y + CH + 3), f[:-4], fill='#000', font=font)
sheet.save(out, quality=88); print(out, len(files))
