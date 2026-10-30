"""Estático «tuit» por vendedor, v2 (30/10/2026): el que tuitea es el
vendedor, con su foto de perfil, su nombre y su @. Sin la barra de
responder / retuitear / me gusta / compartir: Meta rechazó la v1 y los
botones que no funcionan son lo que su política no admite."""
import os
import sys

out_dir, fotos_dir = sys.argv[1], sys.argv[2]
here = os.path.dirname(os.path.abspath(__file__))

VENDEDORES = [('taiab', 'Taiab', 'taiab.kunfupay'), ('rafa', 'Rafa', 'rafa.kunfupay'),
              ('juan', 'Juan', 'juan.kunfupay'), ('jorge', 'Jorge', 'jorge.kunfupay')]

# El bloque va centrado en vertical: en stories queda dentro de la zona
# segura (270 arriba, 380 abajo).
FMT = {
    'feed-4x5': dict(w=1080, h=1350, pad=72, av=150, name=46, handle=33, pill=24,
                     h1=60, body=50, gap=40, safe_top=100, safe_bottom=250),
    'stories-9x16': dict(w=1080, h=1920, pad=90, av=190, name=56, handle=38, pill=28,
                         h1=74, body=60, gap=52, safe_top=270, safe_bottom=380),
}

TPL = '''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500;600;700&display=block" rel="stylesheet">
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{width:{w}px;height:{h}px;background:#fff;overflow:hidden}}
body{{font-family:Inter,sans-serif;color:#0f1419;display:flex;flex-direction:column;justify-content:center;
      padding:{safe_top}px {pad}px {safe_bottom}px}}
.emoji{{font-family:"Noto Color Emoji";}}
.head{{display:flex;align-items:center;gap:28px}}
.ring{{width:{av}px;height:{av}px;flex:none;border-radius:50%;padding:5px;
      background:conic-gradient(from 200deg,#f97316,#ec4899,#8b5cf6,#6d28d9,#f59e0b,#f97316)}}
.ring div{{width:100%;height:100%;border-radius:50%;background:#fff;padding:5px}}
.ring img{{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block}}
.who b{{font-family:"Plus Jakarta Sans";font-weight:800;font-size:{name}px;letter-spacing:-.01em}}
.pill{{display:inline-block;vertical-align:middle;margin-left:14px;background:#734bfc;color:#fff;
      font-weight:700;font-style:normal;font-size:{pill}px;padding:6px 14px;border-radius:999px;position:relative;top:-4px}}
.who span{{display:block;font-size:{handle}px;color:#536471;margin-top:4px}}
h1{{font-family:"Plus Jakarta Sans";font-weight:800;font-size:{h1}px;line-height:1.22;letter-spacing:-.02em;
    margin-top:{gap}px;text-wrap:balance}}
p{{font-size:{body}px;line-height:1.36;margin-top:{gap}px;text-wrap:balance}}
</style></head><body>
<div class="head"><div class="ring"><div><img src="{foto}" alt=""></div></div>
<div class="who"><b>{nombre}</b><i class="pill">Kunfupay</i><span>@{ig}</span></div></div>
<h1>Más de 16.000 creadores ya cobran con&nbsp;Kunfupay.</h1>
<p>¿Vendes cursos o mentorías a clientes de varios países? Escríbeme y en 15&nbsp;minutos te muestro cómo cobrarles a&nbsp;todos.</p>
<p>Te respondo yo, no un bot <span class="emoji">👇</span></p>
</body></html>'''

for vid, nombre, ig in VENDEDORES:
    for fmt, d in FMT.items():
        html = TPL.format(nombre=nombre, ig=ig, foto=os.path.join(fotos_dir, vid + '.jpg'), **d)
        path = os.path.join(here, f'{vid}-v2-{fmt}.html')
        open(path, 'w', encoding='utf-8').write(html)
        print(path, d['w'], d['h'], os.path.join(out_dir, f'vendedor-{vid}-tweet-v2-{fmt}.png'))
