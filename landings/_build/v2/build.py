"""Genera landings/vendedores/v1/index.html a partir de la plantilla de las
landings de Kunfupay (kunfupay.com/landings/fiscal/v1).

Se copia tal cual: <head> (GTM, GA4, píxel, captura de UTMs, CSS Morfeo),
topbar, hero con ondas, quiz y prensa. Cambian el copy del hero, las opciones
del quiz, el paso 3 (resultado con WhatsApp + agendar) y todo lo de debajo del
hero (equipo + calendario).
"""
import sys

src_path, out_path = sys.argv[1], sys.argv[2]
s = open(src_path, encoding='utf-8').read()


def cut(text, start, end, include_end=True):
    i = text.index(start)
    j = text.index(end, i) + (len(end) if include_end else 0)
    return text[:i], text[i:j], text[j:]


def swap(text, old, new):
    assert text.count(old) == 1, old[:60]
    return text.replace(old, new)


# ── HEAD ────────────────────────────────────────────────────────────────
head_end = s.index('</head>')
head = s[:head_end]

campaign_comment_start = head.index('<!-- ═══════════════════════════════════════════════════════════════════\n     CAMPAÑA OPTIMIZACIÓN FISCAL')
campaign_comment_end = head.index('═══════════════════════════════════════════════════════════════════ -->', campaign_comment_start) + len('═══════════════════════════════════════════════════════════════════ -->')
head = head[:campaign_comment_start] + open(sys.argv[3] + '/campaign-comment.html', encoding='utf-8').read().rstrip('\n') + head[campaign_comment_end:]

head = swap(head, '<title>Los beneficios de una LLC, sin montar la LLC | Kunfupay</title>',
            '<title>Cobra a clientes de todo el mundo, sin IVA, LLC ni asesor | Kunfupay</title>')
head = swap(head, '<meta name="description" content="Kunfupay no es una asesoría: es una plataforma que vende por ti, con la estructura ya montada. Cobra de todo el mundo facturando a una sola entidad.">',
            '<meta name="description" content="Cobra desde hoy a clientes de todo el mundo: cada uno paga en su moneda y tú recibes euros o dólares. Kunfupay es Merchant of Record: te representa en cada venta y paga sus impuestos.">')

# Config propia de esta landing (WhatsApp y calendario), junto a la del lead.
head = swap(head, "window.KF_DESTINOS_BASE = '/lp'; // páginas de destino GLOBALES del repo web\n",
            "window.KF_DESTINOS_BASE = '/lp'; // páginas de destino GLOBALES del repo web\n\n"
            + open(sys.argv[3] + '/config.js', encoding='utf-8').read())

# CSS propio, al final del bloque común.
style_close = head.rindex('</style>')
head = head[:style_close] + open(sys.argv[3] + '/extra.css', encoding='utf-8').read() + head[style_close:]

# ── BODY: lo común hasta el hero ───────────────────────────────────────
body_start = s.index('</head>')
hero_block_start = s.index('<div class="topbar">')
hero_block_end = s.index('</section>', s.index('<div class="hero-press">')) + len('</section>')
pre_hero = s[body_start:hero_block_start]
hero = s[hero_block_start:hero_block_end]

hero = swap(hero, '<p><strong>Para quien ya cobra de varios países</strong> — factura a uno solo.</p>',
            '<p><strong>Para quien ya vende cursos, mentorías o servicios online</strong></p>')
hero = swap(hero, '<h1>Los beneficios de una LLC. <span class="highlight" style="--tilt:-1.4deg">Sin montar la LLC</span>.</h1>',
            '<h1><span class="kf-l">Cobra desde hoy en todo el mundo.</span> <span class="kf-l">Y&nbsp;<span class="kf-nw"><span class="highlight" style="--tilt:-1.4deg">olvídate del IVA</span>,</span> la&nbsp;LLC y&nbsp;el&nbsp;asesor.</span></h1>')
hero = swap(hero, '<p class="hero-subtitle">Kunfupay no es una asesoría: es una plataforma que vende por ti, con la estructura fiscal ya montada. Responde 2 preguntas y te decimos si encajas.</p>',
            '<p class="hero-subtitle">Cada cliente paga en su moneda local, sin fricciones, y tú recibes euros, dólares o la moneda que prefieras. Como somos Merchant of Record, te representamos en cada venta y pagamos sus impuestos.</p>')

# Sin formulario: el quiz del patrón se sustituye por la variante de CTA
# directo (dos botones). Se recorta desde la HERO VARIANTE (c) hasta el
# microtrust, que se queda.
pre, _, post = cut(hero, '<!-- HERO VARIANTE (c)', '<p class="hero-microtrust">', include_end=False)
hero = pre + open(sys.argv[3] + '/hero-cta.html', encoding='utf-8').read().rstrip('\n') + '\n\n      ' + post

hero = swap(hero, '<p class="hero-microtrust">Sin cuota mensual · Sin permanencia · Alta en minutos</p>',
            '<p class="hero-microtrust">Sin&nbsp;cuota&nbsp;mensual&nbsp;· Sin&nbsp;permanencia&nbsp;· <span data-v="Te&amp;nbsp;responde&amp;nbsp;{nombre}">Te&nbsp;responde&nbsp;una&nbsp;persona</span></p>')

# ── DEBAJO DEL HERO: equipo + calendario + barra fija + footer ─────────
footer_start = s.index('<footer class="site-footer">')
footer_end = s.index('</footer>') + len('</footer>')
footer = s[footer_start:footer_end]

below = open(sys.argv[3] + '/below.html', encoding='utf-8').read()
script = open(sys.argv[3] + '/script.js', encoding='utf-8').read()

out = (head + pre_hero + hero + '\n\n' + below + '\n' + footer + '\n\n<script>\n' + script + '</script>\n\n</body>\n</html>\n')
open(out_path, 'w', encoding='utf-8').write(out)
print('ok', len(out))
