"""Estático con la foto del vendedor (sin fondo); mismo diseño que el de Taiab, aprobado por Meta, feed 4:5 y stories 9:16.
Mismo lenguaje visual que el hero de la landing: fondo oscuro morado,
titular blanco con subrayado morado y la persona a un lado."""
import os
import sys

foto, logo, out_dir, vid, nombre, avatar = sys.argv[1:7]
here = os.path.dirname(os.path.abspath(__file__))

FMT = {
    'feed-4x5': dict(w=1080, h=1350, pad=72, top=86, h1=78, sub=36, foto_h=1040, foto_r=-150, foto_b=0,
                     txt_w=640, gap=34, cta_b=86),
    'stories-9x16': dict(w=1080, h=1920, pad=80, top=270, h1=84, sub=38, foto_h=1150, foto_r=-190, foto_b=380,
                         txt_w=700, gap=38, cta_b=420),
}

TPL = '''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500;600&display=block" rel="stylesheet">
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
html,body{{width:{w}px;height:{h}px;overflow:hidden}}
body{{position:relative;font-family:Inter,sans-serif;color:#fff;
  background:radial-gradient(ellipse 80% 60% at 75% 30%,#3a2486 0%,#1d1446 45%,#0c0c10 100%)}}
.waves{{position:absolute;left:0;right:0;top:{wave_top}px;height:260px;opacity:.55}}
.foto{{position:absolute;right:{foto_r}px;bottom:{foto_b}px;height:{foto_h}px;
  -webkit-mask-image:linear-gradient(to left,#000 60%,transparent 100%),linear-gradient(to bottom,#000 70%,transparent 100%);
  -webkit-mask-composite:source-in;mask-composite:intersect}}
.txt{{position:absolute;left:{pad}px;top:{top}px;width:{txt_w}px;z-index:2}}
.marca{{display:flex;align-items:center;gap:16px;font-family:"Plus Jakarta Sans";font-weight:800;font-size:34px}}
.marca img{{width:64px;height:64px;border-radius:12px}}
h1{{font-family:"Plus Jakarta Sans";font-weight:800;font-size:{h1}px;line-height:1.08;letter-spacing:-.03em;margin-top:{gap2}px;text-wrap:balance}}
.hl{{background:linear-gradient(100deg,#5c21e0,#734bfc);padding:0 .14em;border-radius:6px;box-decoration-break:clone;-webkit-box-decoration-break:clone}}
p{{font-size:{sub}px;line-height:1.4;color:rgba(255,255,255,.82);margin-top:{gap}px;text-wrap:balance}}
.tag{{position:absolute;left:{pad}px;bottom:{tag_b}px;z-index:2;display:flex;flex-direction:column;gap:6px}}
.tag b{{font-family:"Plus Jakarta Sans";font-weight:800;font-size:44px}}
.tag span{{font-size:28px;color:rgba(255,255,255,.7)}}
.ctarow{{position:absolute;left:{pad}px;bottom:{cta_b}px;z-index:2;display:flex;align-items:center;gap:20px}}
/* Foto de perfil pequeña y redonda junto al botón: se reconoce a la persona de un vistazo. */
.av{{width:96px;height:96px;border-radius:50%;padding:4px;flex:none;
  background:conic-gradient(from 200deg,#f97316,#ec4899,#8b5cf6,#6d28d9,#f59e0b,#f97316)}}
.av img{{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;border:4px solid #1d1446}}
.cta{{background:#f97316;color:#fff;
  font-family:"Plus Jakarta Sans","Noto Color Emoji";font-weight:800;font-size:36px;padding:26px 44px;border-radius:999px;
  box-shadow:0 14px 40px -10px rgba(249,115,22,.65)}}
</style></head><body>
<svg class="waves" viewBox="0 0 1000 100" preserveAspectRatio="none">
<path d="M0,40 C125,18 250,18 375,40 S625,62 750,40 S1000,18 1000,40" fill="none" stroke="rgba(115,75,252,.55)" stroke-width="1.2"/>
<path d="M0,55 C160,36 320,38 500,55 S820,72 1000,55" fill="none" stroke="rgba(156,135,254,.4)" stroke-width="0.9"/>
<path d="M0,66 C150,48 330,50 520,66 S860,84 1000,66" fill="none" stroke="rgba(115,75,252,.6)" stroke-width="2"/>
</svg>
<img class="foto" src="{foto}" alt="">
<div class="txt">
  <div class="marca"><img src="{logo}" alt="">Kunfupay</div>
  <h1>Cobra a clientes de todo el mundo. <span class="hl">Desde hoy.</span></h1>
  <p>Cada cliente paga en su moneda y tú recibes euros o dólares. En 15&nbsp;minutos te enseño cómo.</p>
</div>
<div class="tag"><b>{nombre}</b><span>Te responde {nombre}, no un bot</span></div>
<div class="ctarow"><div class="cta">Agenda tu llamada 👇</div><div class="av"><img src="{avatar}" alt=""></div></div>
</body></html>'''

for fmt, d in FMT.items():
    html = TPL.format(foto=foto, logo=logo, nombre=nombre, avatar=avatar, gap2=d['gap'] + 10, wave_top=int(d['h'] * .42),
                      tag_b=d['cta_b'] + 130, **d)
    path = os.path.join(here, f'{vid}-foto-{fmt}.html')
    open(path, 'w', encoding='utf-8').write(html)
    print(path, d['w'], d['h'], os.path.join(out_dir, f'{vid}-foto-{fmt}.png'))
