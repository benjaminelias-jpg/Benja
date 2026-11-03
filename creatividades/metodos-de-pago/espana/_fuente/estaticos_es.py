"""Estáticos E1–E5 de métodos de pago para España, con el mismo diseño que los de los hubs
(V2: tweet de Rubén, comparativa, páginas de pago reales, +30 % y noticia).

Genera un HTML por pieza y tamaño en el directorio que se pasa como argumento; después
render.js los pasa a PNG en ../estaticos/ (1080×1350 para feed y 1080×1920 para Stories).
Los recortes de assets/ salen de las piezas de los hubs: las páginas de pago son las reales
del vídeo de la Infografía (Colombia y México, recortada sin OXXO)."""
import os
import sys

here = os.path.dirname(os.path.abspath(__file__))
A = 'file://' + os.path.join(here, 'assets') + '/'
out = sys.argv[1]
os.makedirs(out, exist_ok=True)

NAVY, MORADO, LILA = '#260f63', '#7047ff', '#c9bdff'

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
                       css=css, body=body, a=A)
    if not ku:
        html = html.replace('<img class="ku" src="%sku.png">' % A, '')
    return html


def e1(h):
    texto = ("Si vendes cursos desde España y cobras con Stripe, estás perdiendo hasta un 27 % "
             "de tu facturación. Tus alumnos de LATAM no pueden pagarte. Existe una forma de que "
             "te pague cualquiera y recibir euros. Descúbrela haciendo clic.")
    css = """body{letter-spacing:0}
.tw{font-family:Arial,'Liberation Sans',Helvetica,sans-serif;padding:0 20px}
.hd{display:flex;align-items:center;gap:40px;margin-bottom:84px}
.hd img.av{width:134px;height:134px;border-radius:50%}
.n{font-size:44px;font-weight:700;color:#0f1419;display:flex;align-items:center;gap:12px}
.n img{width:42px;height:42px}
.u{font-size:37px;color:#536471;margin-top:6px}
.t{font-size:62px;line-height:1.28;color:#0f1419}"""
    body = f"""<div class="safe"><div class="tw"><div class="hd"><img class="av" src="{A}avatar.png">
<div><div class="n">Rubén Romero <img src="{A}check.png"></div><div class="u">@rubenromero_kunfupay</div></div></div>
<div class="t">{texto}</div></div></div>"""
    return pagina(h, body, css, ku=False)


def e2(h):
    filas = [("Alumnos de LATAM que pueden pagarte", "x", "Los que tienen tarjeta internacional", "Todos"),
             ("Ventas que se caen al pagar", "x", "Hasta un 27 %", "Pagan en el momento"),
             ("Enlaces que mandas", "x", "Uno para cada caso", "Uno"),
             ("Lo que recibes", "g", "Euros", "Euros")]
    css = """.kick{font-size:68px;line-height:1.08}
h1{font-size:80px;line-height:1.02;font-weight:800;margin:8px 0 40px}
.tb{display:grid;grid-template-columns:240px 1fr 1fr;gap:14px}
.th{border-radius:22px;color:#fff;font-weight:700;font-size:34px;display:flex;align-items:center;justify-content:center;text-align:center;height:120px;letter-spacing:-0.01em}
.lab{font-weight:700;font-size:33px;line-height:1.1;display:flex;align-items:center;letter-spacing:-0.02em}
.c{border-radius:22px;display:flex;align-items:center;gap:16px;padding:22px 22px;font-size:37px;font-weight:600;line-height:1.08;min-height:132px;letter-spacing:-0.02em}
.c .i{flex:none;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:#fff}
.x{background:#fdecee;color:#b3261e}.x .i{background:#e5262d}
.g{background:#f0eff5;color:#55536a}.g .i{background:#a4a2b4}
.k{background:#7047ff;color:#fff;box-shadow:0 10px 24px rgba(112,71,255,.22)}.k .i{background:#fff;color:#7047ff}
.cierre{font-size:50px;font-weight:800;line-height:1.1;margin-top:40px}"""
    if h == 1350:
        css += """.kick{font-size:58px}h1{font-size:72px;margin-bottom:30px}.th{height:96px;font-size:30px}
.c{min-height:108px;font-size:32px;padding:16px 20px}.lab{font-size:28px}.cierre{font-size:40px;margin-top:30px}"""
    ico = {'x': '✕', 'g': '✓'}
    celdas = ''.join(
        f'<div class="lab">{l}</div><div class="c {t}"><span class="i">{ico[t]}</span>{hoy}</div>'
        f'<div class="c k"><span class="i">✓</span>{ku}</div>' for l, t, hoy, ku in filas)
    body = f"""<div class="safe"><div class="kick">Si vendes cursos<br>desde España,</div>
<h1>esto pierdes cobrando<br><span class="m">solo con tarjeta</span>.</h1>
<div class="tb"><div></div><div class="th" style="background:#b3261e">Hoy, solo con tarjeta</div>
<div class="th" style="background:{NAVY}">Con Kunfupay</div>{celdas}</div>
<div class="cierre">Vendes lo mismo. Cobras a más alumnos.</div></div>"""
    return pagina(h, body, css)


def flecha(w, hgt, x2, y2):
    return (f'<svg width="{w}" height="{hgt}" style="position:absolute;left:0;top:0;overflow:visible">'
            f'<path d="M70 {hgt-20} C {w*0.45} {hgt+10}, {x2-60} {y2+60}, {x2} {y2}" fill="none" stroke="{MORADO}" stroke-width="5" stroke-linecap="round"/>'
            f'<path d="M{x2-30} {y2+4} L{x2} {y2} L{x2-6} {y2+30}" fill="none" stroke="{MORADO}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>')


def e3(h):
    css = """.kick{font-size:46px}
h1{font-size:62px;line-height:1.05;font-weight:800;margin:4px 0 0}
.fila{position:relative;height:%dpx;margin-top:%dpx}
.nota{position:absolute;left:0;top:30px;font-weight:700;color:#7047ff;font-size:36px;line-height:1.03}
.card{position:absolute;right:0;top:0;border-radius:24px;box-shadow:0 14px 40px rgba(38,15,99,.13)}
.fin{font-size:46px;font-weight:800;margin-top:%dpx}""" % ((380, 54, 40) if h == 1350 else (420, 80, 90))
    body = f"""<div class="safe"><div class="kick">Si vendes cursos desde España,</div>
<h1><span class="m">estás perdiendo ventas</span>. Ya no cobres a LATAM solo con tarjeta.</h1>
<div class="fila">{flecha(320, 230, 318, 135)}<div class="nota" style="width:270px">Tu alumno de Colombia paga con su moneda local</div>
<img class="card" src="{A}colombia.png" style="width:600px"></div>
<div class="fila" style="height:230px">{flecha(510, 240, 508, 140)}<div class="nota" style="width:480px;top:0">Tu alumno de México tiene sus métodos de pago</div>
<img class="card" src="{A}mexico.png" style="width:412px;top:0"></div>
<div class="fin">Y tú recibes <span class="m">euros</span>.</div></div>"""
    return pagina(h, body, css)


def e4(h):
    css = f"""body{{color:#fff}}
.big{{font-size:300px;font-weight:800;color:{LILA};line-height:.9;letter-spacing:-0.06em;margin-left:-10px}}
.big small{{font-size:150px;letter-spacing:-0.02em}}
.kick{{color:#d9d3ee;font-size:58px;margin-top:40px}}
h1{{font-size:88px;line-height:1.04;font-weight:800;margin-top:10px}}
h1 .l{{color:{LILA}}}
.sub{{font-size:38px;font-weight:500;color:#d9d3ee;margin-top:56px;letter-spacing:-0.02em}}
.cta{{position:absolute;left:80px;bottom:{330 if h == 1920 else 68}px;font-size:54px;font-weight:800;line-height:74px}}"""
    body = f"""<div class="safe"><div class="big">+30<small>%</small></div>
<div class="kick">Si vendes cursos desde España,</div>
<h1>podrías facturar<br>hasta un <span class="l">30 %</span> más<br>solo cambiando<br>cómo cobras.</h1>
<div class="sub">Que te pague cualquier alumno de LATAM.</div></div>
<div class="cta">Descubre cómo ↓</div>"""
    return pagina(h, body, css, bg=NAVY)


def e5(h, foto):
    st = h == 1920
    css = f"""body{{background:#000 url('{foto}') center top/cover no-repeat}}
.sh{{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 38%,rgba(0,0,0,.72) 62%,#000 {'82' if st else '96'}%)}}
.circ{{position:absolute;left:72px;top:{300 if st else 50}px;width:{484 if st else 400}px;height:{484 if st else 400}px;border-radius:50%;overflow:hidden}}
.circ img{{width:100%;height:100%}}
.kua{{position:absolute;right:72px;top:{290 if st else 50}px;width:84px;height:84px;border-radius:14px}}
.txt{{position:absolute;left:72px;right:72px;bottom:{380 if st else 70}px;color:#fff}}
.tag{{display:inline-block;background:#e3202b;font-weight:700;font-size:{76 if st else 64}px;padding:0 28px;line-height:1.35;letter-spacing:-0.02em}}
h1{{font-size:{80 if st else 70}px;line-height:1.08;font-weight:800;margin-top:28px;letter-spacing:-0.04em}}"""
    body = f"""<div class="sh"></div><div class="circ"><img src="{A}ruben.png"></div>
<img class="kua" src="{A}ku.png"><div class="txt"><span class="tag">Actualidad</span>
<h1>Creadores en España ya aumentan su conversión un 27 % solo cambiando cómo cobran.</h1></div>"""
    return pagina(h, body, css, ku=False)


foto = 'file://' + os.path.join(here, 'assets', 'madrid.jpg')
for h in (1350, 1920):
    for n, f in (('E1', e1), ('E2', e2), ('E3', e3), ('E4', e4)):
        open(os.path.join(out, f'ES-{n}_1080x{h}.html'), 'w', encoding='utf-8').write(f(h))
    open(os.path.join(out, f'ES-E5_1080x{h}.html'), 'w', encoding='utf-8').write(e5(h, foto))
