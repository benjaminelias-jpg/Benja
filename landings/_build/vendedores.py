"""Genera una landing por vendedor a partir de la principal
(landings/vendedores/v1/index.html). Misma página; cambia quién sale: su cara
en el hero, su nombre en los CTA, su tarjeta sola debajo y su calendario.
Cada una tiene su propio KF_WHATSAPP y KF_CALENDAR_URL.
"""
import os
import shutil
import sys

main_path, landings_dir = sys.argv[1], sys.argv[2]
base = open(main_path, encoding='utf-8').read()

VENDEDORES = [
    # id, nombre, usuario de Instagram
    ('taiab', 'Taiab', 'taiab.kunfupay'),
    ('rafa', 'Rafa', 'rafa.kunfupay'),
    ('juan', 'Juan', 'juan.kunfupay'),
    ('jorge', 'Jorge', 'jorge.kunfupay'),
]


def swap(text, old, new):
    assert text.count(old) == 1, old[:70]
    return text.replace(old, new)


def swap_block(text, start, end, new):
    i = text.index(start)
    j = text.index(end, i) + len(end)
    assert text.count(start) == 1, start[:70]
    return text[:i] + new + text[j:]


for vid, nombre, ig in VENDEDORES:
    s = base
    carpeta = 'vendedor-' + vid

    s = swap_block(s, '<!-- ═══════════════════════════════════════════════════════════════════\n     CAMPAÑA REMARKETING · VENDEDORES · v1',
                   '═══════════════════════════════════════════════════════════════════ -->', f'''<!-- ═══════════════════════════════════════════════════════════════════
     CAMPAÑA REMARKETING · VENDEDOR {nombre.upper()} · v1
     ======================================
     Copia de /landings/vendedores/v1 (la principal, con todo el equipo)
     para UN vendedor: {nombre} (@{ig}). Misma página; cambia quién sale.
     {nombre} aparece en el hero (su foto y «Te atiende {nombre}»), en los
     dos CTA, en la tarjeta de debajo y en el calendario.

     POR QUÉ UNA POR VENDEDOR. Cada vendedor genera su propia audiencia
     (quien visita SU perfil de Instagram) y su propio anuncio. Ese
     prospecto ya conoce a {nombre}: si le saliera otra cara, el anuncio
     perdería la confianza ganada. Aquí le responde la misma persona, por
     su WhatsApp o su calendario, y la venta se queda con quien la abrió.

     MEDICIÓN. Igual que la principal (Contact al pulsar WhatsApp, Schedule
     al reservar), con el parámetro `vendedor: '{vid}'` en los eventos.

     PENDIENTE ANTES DE LANZAR: el WhatsApp y el calendario de {nombre}
     (KF_WHATSAPP y KF_CALENDAR_URL, en la config del <head>).

     ⚠️ Mismo aviso que la principal: legal valida «olvídate del IVA» y
     «pagamos sus impuestos» antes de lanzar.

     El resto del cuerpo se arregla en la principal y se vuelve a generar
     con landings/_build/vendedores.py, no a mano aquí.
     ═══════════════════════════════════════════════════════════════════ -->''')

    s = swap(s, '// ── CONFIG DE ESTA LANDING (vendedores/v1)', f'// ── CONFIG DE ESTA LANDING ({carpeta}/v1)')
    s = swap(s, "// Número de WhatsApp de ventas, en formato", f"// WhatsApp de {nombre}, en formato")
    s = swap(s, "// URL del calendario para agendar la llamada", f"// URL del calendario de {nombre} para agendar la llamada")
    s = swap(s, "window.KF_VENDEDOR = '';", f"window.KF_VENDEDOR = '{vid}';")
    s = swap(s, "window.KF_VENDEDOR_NOMBRE = '';", f"window.KF_VENDEDOR_NOMBRE = '{nombre}';")

    # Hero: su cara en vez de las cuatro.
    s = swap_block(s, '<div class="kf-equipo-mini" aria-hidden="true">', '</div>',
                   f'''<div class="kf-vendedor-hero">
        <img src="equipo/{vid}.jpg" alt="{nombre}">
        <span><strong>Te atiende {nombre}</strong>@{ig} · equipo de Kunfupay</span>
      </div>''')
    s = swap(s, '>Escríbenos por WhatsApp</a>', f'>Escríbele a {nombre} por WhatsApp</a>')
    s = swap(s, '>Prefiero agendar una llamada</a>', f'>Agenda una llamada con {nombre}</a>')
    s = swap(s, '· Te&nbsp;responde&nbsp;una&nbsp;persona</p>', f'· Te&nbsp;responde&nbsp;{nombre}</p>')

    # Debajo: su tarjeta sola.
    s = swap_block(s, '<section class="section kf-equipo">', '</section>', f'''<section class="section kf-equipo">
  <div class="wrap section-head reveal">
    <span class="eyebrow">Tu contacto en Kunfupay</span>
    <h2 class="section-title">Te responde {nombre}, <span class="highlight" style="--tilt:1.2deg">no un bot</span></h2>
    <p class="section-lead">Más de 16.000 creadores ya cobran con Kunfupay. Escríbele a {nombre} y en 15 minutos te enseña cómo cobrar a todos tus clientes.</p>
  </div>
  <div class="wrap">
    <div class="kf-equipo__grid kf-equipo__grid--uno">
      <div class="kf-persona reveal"><img src="equipo/{vid}.jpg" alt="{nombre}"><strong>{nombre}</strong><span>@{ig}</span></div>
    </div>
  </div>
</section>''')

    # Calendario: el suyo.
    s = swap(s, '<h2 class="section-title">Elige tu hueco de <span class="highlight" style="--tilt:-1deg">15 minutos</span></h2>',
             f'<h2 class="section-title">Elige tu hueco de <span class="highlight" style="--tilt:-1deg">15 minutos</span> con {nombre}</h2>')
    s = swap(s, '<p class="section-lead">Te llama una persona del equipo y te enseña cómo cobrar a tus clientes de cualquier país. Sin compromiso.</p>',
             f'<p class="section-lead">{nombre} te llama y te enseña cómo cobrar a tus clientes de cualquier país. Sin compromiso.</p>')
    s = swap(s, 'El calendario se está configurando. Mientras tanto, escríbenos por WhatsApp y te damos hora.',
             f'El calendario de {nombre} se está configurando. Mientras tanto, escríbele por WhatsApp y te da hora.')
    s = swap(s, "iframe.title = 'Agenda una llamada con el equipo de Kunfupay';",
             f"iframe.title = 'Agenda una llamada con {nombre}, de Kunfupay';")

    dest = os.path.join(landings_dir, carpeta, 'v1')
    os.makedirs(os.path.join(dest, 'equipo'), exist_ok=True)
    open(os.path.join(dest, 'index.html'), 'w', encoding='utf-8').write(s)
    shutil.copy(os.path.join(os.path.dirname(main_path), 'equipo', vid + '.jpg'),
                os.path.join(dest, 'equipo', vid + '.jpg'))
    print('ok', carpeta, len(s))
