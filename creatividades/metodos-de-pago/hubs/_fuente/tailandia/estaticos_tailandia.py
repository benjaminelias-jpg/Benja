"""Estáticos E1–E5 del hub de Tailandia (métodos de pago), con el diseño V2 de los otros hubs:
tweet de Rubén, comparativa, páginas de pago reales, +30 % y noticia.

Uso:  python3 estaticos_tailandia.py <dir_html>
      node ../../../espana/_fuente/render.js <dir_html> ../../estaticos

- Los recursos comunes (avatar, check, logo y foto de Rubén) son los de espana/_fuente/assets.
- E3 parte del E3 de Bali, que ya enseña las páginas de pago reales de México (recortada a SPEI
  y Mercado Pago, sin OXXO) y de España. Solo se sustituye la primera línea («desde Bali» pasa a
  «desde Tailandia»): las capturas no se tocan ni se tapan.
- E5 usa dos fotos en alta resolución:
  - assets/tailandia_bandera.jpg: foto real de stock con licencia (Freepik/Magnific, «Thailand flag
    and Buddhist temple», Wat Pho, Bangkok; 2867×4300). Se baja a 2160 px de ancho con la saturación
    un 18 % más alta.
  - assets/ruben_hd.jpg: recorte cuadrado de 1200 px de la foto de estudio de Rubén (4000×6000) que
    Brayan pasó por Slack el 12-11-2026.
  bangkok.jpg ya no se usa.
"""
import os
import sys

here = os.path.dirname(os.path.abspath(__file__))
HUBS = os.path.normpath(os.path.join(here, '..', '..'))
COMUN = 'file://' + os.path.normpath(os.path.join(HUBS, '..', 'espana', '_fuente', 'assets')) + '/'
PROPIO = 'file://' + os.path.join(here, 'assets') + '/'
BALI_E3 = 'file://' + os.path.join(HUBS, 'estaticos') + '/HUB-BALI-E3_1080x{h}.png'
out = sys.argv[1]
os.makedirs(out, exist_ok=True)

NAVY, MORADO, LILA = '#260f63', '#7047ff', '#c9bdff'
LUGAR = 'Tailandia'

BASE = """<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,500;0,600;0,700;0,800;1,500;1,600&display=block" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:%(h)dpx;overflow:hidden}
body{font-family:'Plus Jakarta Sans',sans-serif;background:%(bg)s;color:%(navy)s;position:relative;letter-spacing:-0.035em}
.safe{position:absolute;left:0;right:0;top:%(top)dpx;bottom:%(bot)dpx;padding:0 80px;display:flex;flex-direction:column;justify-content:center}
.ku{position:absolute;right:80px;bottom:%(kub)dpx;width:74px;height:74px;border-radius:12px}
.kick{font-style:italic;font-weight:500;color:%(morado)s}
.m{color:%(morado)s}
%(css)s
</style></head><body>%(body)s<img class="ku" src="%(a)sku.png"></body></html>"""


def pagina(h, body, css='', bg='#fff', ku=True):
    st = h == 1920
    top, bot = (270, 380) if st else (60, 60)
    kub = 330 if st else 68
    html = BASE % dict(h=h, bg=bg, navy=NAVY, morado=MORADO, top=top, bot=bot, kub=kub,
                       css=css, body=body, a=COMUN)
    if not ku:
        html = html.replace('<img class="ku" src="%sku.png">' % COMUN, '')
    return html


# ---------------------------------------------------------------- E1 · tweet de Rubén (dolor)
def e1(h):
    texto = (f"Si vendes cursos desde {LUGAR} y cobras con Stripe o PayPal, estás perdiendo hasta "
             "un 27 % de tu facturación. Tus clientes de España y LATAM no pueden pagarte. Existe "
             "una forma de que te pague cualquiera y recibir euros o dólares. Descúbrela haciendo clic.")
    css = """body{letter-spacing:0}
.tw{font-family:Arial,'Liberation Sans',Helvetica,sans-serif;padding:0 20px}
.hd{display:flex;align-items:center;gap:40px;margin-bottom:84px}
.hd img.av{width:134px;height:134px;border-radius:50%}
.n{font-size:44px;font-weight:700;color:#0f1419;display:flex;align-items:center;gap:12px}
.n img{width:42px;height:42px}
.u{font-size:37px;color:#536471;margin-top:6px}
.t{font-size:60px;line-height:1.28;color:#0f1419}"""
    body = f"""<div class="safe"><div class="tw"><div class="hd"><img class="av" src="{COMUN}avatar.png">
<div><div class="n">Rubén Romero <img src="{COMUN}check.png"></div><div class="u">@rubenromero_kunfupay</div></div></div>
<div class="t">{texto}</div></div></div>"""
    return pagina(h, body, css, ku=False)


# ---------------------------------------------------------------- E2 · comparativa
E2_KICK = f"Si vendes tu mentoría<br>desde {LUGAR},"
E2_H1 = '<span class="m">esto pierdes</span> cobrando<br>solo con tarjeta.'
E2_FILAS = [
    ("Clientes que pueden pagarte", "x", "Los que tienen tarjeta internacional", "Todos"),
    ("Ventas que se caen al pagar", "x", "Hasta un 27 %", "Pagan en el momento"),
    ("Si te compran mientras duermes", "x", "Se enfrían hasta que despiertas", "Pagan solos"),
    ("Lo que recibes", "x", "Lo que llegue", "Euros o dólares"),
]
E2_CIERRE = "Mandas un enlace.<br>Cada uno paga con lo suyo."


def e2(h):
    css = """.kick{font-size:64px;line-height:1.08}
h1{font-size:76px;line-height:1.04;font-weight:800;margin:8px 0 44px}
.tb{display:grid;grid-template-columns:240px 1fr 1fr;gap:14px}
.th{border-radius:22px;color:#fff;font-weight:700;font-size:34px;display:flex;align-items:center;justify-content:center;text-align:center;height:120px;letter-spacing:-0.01em}
.lab{font-weight:700;font-size:31px;line-height:1.1;display:flex;align-items:center;letter-spacing:-0.02em}
.c{border-radius:22px;display:flex;align-items:center;gap:16px;padding:22px 22px;font-size:35px;font-weight:600;line-height:1.08;min-height:132px;letter-spacing:-0.02em}
.c .i{flex:none;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#fff}
.x{background:#fdecee;color:#b3261e}.x .i{background:#e5262d}
.g{background:#f0eff5;color:#55536a}.g .i{background:#a4a2b4}
.k{background:#7047ff;color:#fff;box-shadow:0 10px 24px rgba(112,71,255,.22)}.k .i{background:#fff;color:#7047ff}
.cierre{font-size:46px;font-weight:800;line-height:1.1;margin-top:40px}"""
    if h == 1350:
        css += """.kick{font-size:54px}h1{font-size:70px;margin-bottom:30px}.th{height:96px;font-size:30px}
.c{min-height:106px;font-size:30px;padding:14px 20px}.lab{font-size:27px}.cierre{font-size:38px;margin-top:28px}"""
    ico = {'x': '✕', 'g': '✓'}
    celdas = ''.join(
        f'<div class="lab">{l}</div><div class="c {t}"><span class="i">{ico[t]}</span>{hoy}</div>'
        f'<div class="c k"><span class="i">✓</span>{ku}</div>' for l, t, hoy, ku in E2_FILAS)
    body = f"""<div class="safe"><div class="kick">{E2_KICK}</div>
<h1>{E2_H1}</h1>
<div class="tb"><div></div><div class="th" style="background:#b3261e">Hoy, solo con tarjeta</div>
<div class="th" style="background:{NAVY}">Con Kunfupay</div>{celdas}</div>
<div class="cierre">{E2_CIERRE}</div></div>"""
    return pagina(h, body, css)


# ---------------------------------------------------------------- E3 · páginas de pago reales (desde el E3 de Bali)
def e3(h):
    # Posición de la primera línea en el E3 de Bali: (top del parche, alto, left, tamaño de letra, baseline)
    top, alto, left, fs = (76, 70, 80, 46) if h == 1350 else (270, 80, 72, 52)
    css = f"""html,body{{background:#fff}}
.bg{{position:absolute;left:0;top:0;width:1080px;height:{h}px}}
.parche{{position:absolute;left:0;width:1080px;top:{top}px;height:{alto}px;background:#fff}}
.kick2{{position:absolute;left:{left}px;top:{top}px;height:{alto}px;display:flex;align-items:center;font-style:italic;font-weight:500;color:{MORADO};font-size:{fs}px;letter-spacing:-0.035em;white-space:nowrap}}"""
    body = f"""<img class="bg" src="{BALI_E3.format(h=h)}"><div class="parche"></div>
<div class="kick2">Si vendes cursos desde {LUGAR},</div>"""
    return pagina(h, body, css, ku=False)


# ---------------------------------------------------------------- E4 · deseo (+30 %)
E4_SUB = "De madrugada aquí, de día en LATAM: te pagan igual."


def e4(h):
    css = f"""body{{color:#fff}}
.big{{font-size:300px;font-weight:800;color:{LILA};line-height:.9;letter-spacing:-0.06em;margin-left:-10px}}
.big small{{font-size:150px;letter-spacing:-0.02em}}
.kick{{color:#d9d3ee;font-size:58px;margin-top:40px}}
h1{{font-size:88px;line-height:1.04;font-weight:800;margin-top:10px}}
h1 .l{{color:{LILA}}}
.sub{{font-size:38px;font-weight:500;color:#d9d3ee;margin-top:56px;letter-spacing:-0.02em;line-height:1.25}}
.cta{{position:absolute;left:80px;bottom:{330 if h == 1920 else 68}px;font-size:54px;font-weight:800;line-height:74px}}"""
    if h == 1350:
        css += ".big{font-size:260px}.kick{font-size:52px;margin-top:30px}h1{font-size:80px}.sub{margin-top:40px}"
    body = f"""<div class="safe"><div class="big">+30<small>%</small></div>
<div class="kick">Si vendes cursos desde {LUGAR},</div>
<h1>podrías facturar<br>hasta un <span class="l">30 %</span> más<br>solo cambiando<br>cómo cobras.</h1>
<div class="sub">{E4_SUB}</div></div>
<div class="cta">Descubre cómo ↓</div>"""
    return pagina(h, body, css, bg=NAVY)


# ---------------------------------------------------------------- E5 · noticia con foto de Bangkok
E5_TITULAR = "Creadores que venden a España y LATAM ya aumentan su conversión un 27 % solo cambiando cómo cobran."


def e5(h):
    st = h == 1920
    foto = PROPIO + 'tailandia_bandera.jpg'
    # La foto se sube para que la bandera quede entera por encima del titular; lo que sobra abajo es negro.
    tam, pos = ('1080px auto', 'center -240px') if st else ('1080px auto', 'center -400px')
    css = f"""body{{background:#000 url('{foto}') {pos}/{tam} no-repeat}}
.sh{{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) {'50' if st else '52'}%,rgba(0,0,0,.74) {'62' if st else '68'}%,#000 {'71' if st else '88'}%)}}
.circ{{position:absolute;left:72px;top:{300 if st else 50}px;width:{440 if st else 380}px;height:{440 if st else 380}px;border-radius:50%;overflow:hidden;border:14px solid #e3202b;background:{LILA}}}
.circ img{{width:100%;height:100%;object-fit:cover}}
.kua{{position:absolute;right:72px;top:{290 if st else 50}px;width:84px;height:84px;border-radius:14px}}
.txt{{position:absolute;left:72px;right:72px;bottom:{380 if st else 70}px;color:#fff}}
.tag{{display:inline-block;background:#e3202b;font-weight:700;font-size:{76 if st else 62}px;padding:0 28px;line-height:1.35;letter-spacing:-0.02em}}
h1{{font-size:{74 if st else 62}px;line-height:1.08;font-weight:800;margin-top:28px;letter-spacing:-0.04em}}"""
    body = f"""<div class="sh"></div><div class="circ"><img src="{PROPIO}ruben_hd.jpg"></div>
<img class="kua" src="{COMUN}ku.png"><div class="txt"><span class="tag">Actualidad</span>
<h1>{E5_TITULAR}</h1></div>"""
    return pagina(h, body, css, ku=False)


for h in (1350, 1920):
    for n, f in (('E1', e1), ('E2', e2), ('E3', e3), ('E4', e4), ('E5', e5)):
        open(os.path.join(out, f'HUB-TAILANDIA-{n}_1080x{h}.html'), 'w', encoding='utf-8').write(f(h))
print('ok')
