"""Estático «tuit» por vendedor, en el mismo formato que
vendedores-tweet-blanco (feed 4:5 y stories 9:16), con UNA persona."""
import os
import sys

out_dir, fotos_dir = sys.argv[1], sys.argv[2]
here = os.path.dirname(os.path.abspath(__file__))

VENDEDORES = [('taiab', 'Taiab', 'taiab.kunfupay'), ('rafa', 'Rafa', 'rafa.kunfupay'),
              ('juan', 'Juan', 'juan.kunfupay'), ('jorge', 'Jorge', 'jorge.kunfupay')]

# Medidas copiadas del estático de equipo: feed con margen 66 y arranque
# en 127; stories con margen 117 y arranque en 250 (zona segura).
FMT = {
    'feed-4x5': dict(w=1080, h=1350, pad=66, top=110, av=110, name=40, handle=31,
                     h1=48, body=42, gap=26, ringsz=232, pname=36, phandle=26),
    'stories-9x16': dict(w=1080, h=1920, pad=117, top=250, av=104, name=37, handle=28,
                         h1=44, body=42, gap=30, ringsz=330, pname=40, phandle=27),
}

TPL = '''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500;600;700&display=block" rel="stylesheet">
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{width:{w}px;height:{h}px;background:#fff;overflow:hidden}}
body{{font-family:Inter,sans-serif;color:#0f1419;padding:{top}px {pad}px 0}}
.emoji{{font-family:"Noto Color Emoji";}}
.head{{display:flex;align-items:center;gap:26px}}
.head img{{width:{av}px;height:{av}px}}
.head b{{display:block;font-family:"Plus Jakarta Sans";font-weight:800;font-size:{name}px;letter-spacing:-.01em}}
.head span{{font-size:{handle}px;color:#536471}}
h1{{font-family:"Plus Jakarta Sans";font-weight:800;font-size:{h1}px;line-height:1.3;letter-spacing:-.015em;margin-top:{gap}px}}
p{{font-size:{body}px;line-height:1.35;margin-top:{gap}px;color:#0f1419;text-wrap:balance}}
.card{{margin-top:{gap}px;border:2px solid #e7e9ee;border-radius:30px;padding:28px 30px 26px;text-align:center}}
.card small{{display:block;font-weight:700;font-size:25px;letter-spacing:.12em;color:#536471}}
.ring{{width:{ringw}px;height:{ringw}px;margin:20px auto 14px;border-radius:50%;padding:7px;
      background:conic-gradient(from 200deg,#f97316,#ec4899,#8b5cf6,#6d28d9,#f59e0b,#f97316)}}
.ring div{{width:100%;height:100%;border-radius:50%;background:#fff;padding:6px}}
.ring img{{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block}}
.card b{{display:block;font-family:"Plus Jakarta Sans";font-weight:800;font-size:{pname}px}}
.card em{{display:block;font-style:normal;font-size:{phandle}px;color:#536471;margin-top:4px}}
.acts{{margin-top:{gap}px;border-top:2px solid #e7e9ee;padding:26px 18px 0;display:flex;justify-content:space-between}}
.acts svg{{width:38px;height:38px;stroke:#536471;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}}
</style></head><body>
<div class="head"><img src="ku-avatar.png" alt=""><div><b>Kunfupay</b><span>@kunfupay</span></div></div>
<h1>Más de 16.000 creadores ya cobran con&nbsp;Kunfupay.</h1>
<p>¿Vendes cursos o mentorías a clientes de varios países? Escríbele a {nombre} y en 15&nbsp;minutos te muestra cómo cobrarles a&nbsp;todos.</p>
<p>Te responde {nombre}, no un bot <span class="emoji">👇</span></p>
<div class="card"><small>TU CONTACTO EN KUNFUPAY</small>
<div class="ring"><div><img src="{foto}" alt=""></div></div>
<b>{nombre}</b><em>@{ig}</em></div>
<div class="acts">
<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/></svg>
<svg viewBox="0 0 24 24"><path d="M7 4 4 7l3 3"/><path d="M4 7h11a3 3 0 0 1 3 3v2"/><path d="m17 20 3-3-3-3"/><path d="M20 17H9a3 3 0 0 1-3-3v-2"/></svg>
<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>
<svg viewBox="0 0 24 24"><path d="M12 15V4"/><path d="m7 9 5-5 5 5"/><path d="M5 14v6h14v-6"/></svg>
</div></body></html>'''

for vid, nombre, ig in VENDEDORES:
    for fmt, d in FMT.items():
        html = TPL.format(nombre=nombre, ig=ig, foto=os.path.join(fotos_dir, vid + '.jpg'),
                          ringw=d['ringsz'], **d)
        path = os.path.join(here, f'{vid}-{fmt}.html')
        open(path, 'w', encoding='utf-8').write(html)
        print(path, d['w'], d['h'], os.path.join(out_dir, f'vendedor-{vid}-tweet-blanco-{fmt}.png'))
