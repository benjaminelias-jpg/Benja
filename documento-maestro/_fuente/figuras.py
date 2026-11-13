"""Figuras dibujadas a mano (HTML/SVG) para los documentos. Cada función devuelve HTML.

Colores: solo tinta, grises y el azul oscuro de marca (#260f63). Nada más.
"""

MARCA = '#260f63'
GRIS = '#5f5f5f'
LINEA = '#dcdad5'
SUAVE = '#f5f4f1'


def _fig(cuerpo, pie=''):
    cap = f'<figcaption>{pie}</figcaption>' if pie else ''
    return f'<figure><div class="fig">{cuerpo}</div>{cap}</figure>'


def embudo():
    """Embudo en tres tramos: a quién habla cada pieza."""
    filas = [
        ('Parte alta', 'No sabe que tiene el problema, o lo acaba de notar', 'Niveles 1 y 2',
         'El dolor, dicho con una cifra. Tiene que parar el dedo.',
         'Noticia · Cifra «+30 %» · Vídeo de dolor con filtro al inicio'),
        ('Parte media', 'Sabe que tiene el problema y busca cómo arreglarlo', 'Nivel 3',
         'Cómo funciona y contra qué se compara lo que usa hoy.',
         'Tweet · Comparativa · Vídeo de mecanismo («Infografía»)'),
        ('Parte baja', 'Ya conoce Kunfupay o está listo para actuar', 'Niveles 4 y 5',
         'La prueba: cómo se ve por dentro. Y qué hacer ahora.',
         'Página de pago con flechas · Oferta · Remarketing con la cara del vendedor'),
    ]
    anchos = [(0, 150), (20, 130), (40, 110), (58, 92)]
    svg = '<svg width="150" height="336" viewBox="0 0 150 336">'
    for i, (nombre, *_r) in enumerate(filas):
        x1, x2 = anchos[i]
        x3, x4 = anchos[i + 1]
        y = i * 112
        op = (0.92, 0.6, 0.32)[i]
        svg += (f'<path d="M{x1} {y + 4}L{x2} {y + 4}L{x4} {y + 104}L{x3} {y + 104}z" fill="{MARCA}" fill-opacity="{op}"/>'
                f'<text x="75" y="{y + 60}" text-anchor="middle" font-size="11.5" font-weight="700" '
                f'fill="{"#fff" if i < 2 else MARCA}" font-family="Inter,Arial">{nombre}</text>')
    svg += '</svg>'
    cajas = ''
    for nombre, quien, nivel, que, piezas in filas:
        cajas += (f'<div style="height:104px;margin-bottom:8px;border:1px solid {LINEA};border-radius:5px;padding:9px 12px;'
                  f'display:flex;flex-direction:column;justify-content:center">'
                  f'<div style="font-size:9.6pt;font-weight:700;color:{MARCA};line-height:1.3">{quien} '
                  f'<span style="font-weight:500;color:{GRIS};font-size:8.4pt">· {nivel}</span></div>'
                  f'<div style="font-size:8.8pt;color:#333;margin-top:3px;line-height:1.4"><b>Qué le decimos:</b> {que}</div>'
                  f'<div style="font-size:8.8pt;color:#333;margin-top:2px;line-height:1.4"><b>Piezas:</b> {piezas}</div></div>')
    cuerpo = f'<div style="display:flex;gap:16px;align-items:flex-start"><div style="flex:none">{svg}</div><div style="flex:1">{cajas}</div></div>'
    return _fig(cuerpo, 'El embudo y la pieza que le habla a cada persona. Los niveles son los «niveles de conciencia» del procedimiento de 8 anuncios.')


def linea_video():
    """Línea de tiempo de un reel de 35 s con los dos puntos de medida."""
    tramos = [
        (17, '0–3 s', 'Filtro', 'El rótulo está en pantalla desde el primer fotograma: dice para quién es.'),
        (21, '3–10 s', 'Dolor', 'La frase con la cifra y el momento que ya vivió.'),
        (34, '10–25 s', '«PERO…» y la prueba', 'Cómo se arregla, con la pantalla real a la vista.'),
        (28, '25–35 s', 'Resultado y cierre', 'Lo que recibe, quién ya lo hace y qué hacer ahora.'),
    ]
    barra = ''
    for i, (w, t, nombre, _d) in enumerate(tramos):
        op = (0.95, 0.7, 0.45, 0.25)[i]
        barra += (f'<div style="width:{w}%;background:rgba(38,15,99,{op});color:{"#fff" if i < 2 else MARCA};'
                  f'padding:8px 6px;font-size:8.2pt;font-weight:700;text-align:center;line-height:1.25">{nombre}'
                  f'<div style="font-weight:500;font-size:7.6pt;opacity:.9">{t}</div></div>')
    notas = ''
    for w, _t, _n, d in tramos:
        notas += f'<div style="width:{w}%;font-size:8pt;color:#444;line-height:1.35;padding:6px 6px 0 2px">{d}</div>'
    medidas = (f'<div style="position:relative;height:54px;margin-top:10px;border-top:1px dashed {LINEA}">'
               f'<div style="position:absolute;left:17%;top:0;height:14px;border-left:1.5px solid {MARCA}"></div>'
               f'<div style="position:absolute;left:17%;top:14px;margin-left:-4px;font-size:8.2pt;line-height:1.35;color:#222;width:270px">'
               f'<b style="color:{MARCA}">Hook rate</b>: de cada 100 personas que ven el anuncio, cuántas siguen a los 3 segundos.</div>'
               f'<div style="position:absolute;right:0;top:0;height:14px;border-left:1.5px solid {MARCA}"></div>'
               f'<div style="position:absolute;right:0;top:14px;font-size:8.2pt;line-height:1.35;color:#222;width:250px;text-align:right">'
               f'<b style="color:{MARCA}">Retención</b>: de los que pasaron de 3 segundos, cuántos llegan al final.</div></div>')
    cuerpo = (f'<div style="display:flex;border-radius:5px;overflow:hidden">{barra}</div>'
              f'<div style="display:flex">{notas}</div>{medidas}')
    return _fig(cuerpo, 'Un reel de unos 35 segundos, por tramos, y los dos puntos donde se mide.')


def copy_bloques():
    """Los dos textos y los dos títulos de un anuncio."""
    def pila(titulo, sub, bloques):
        h = (f'<div style="flex:1"><div style="font-size:9.6pt;font-weight:700;color:{MARCA}">{titulo}</div>'
             f'<div style="font-size:8.3pt;color:{GRIS};margin-bottom:6px">{sub}</div>')
        for b, d in bloques:
            h += (f'<div style="border:1px solid {LINEA};border-radius:4px;padding:6px 9px;margin-bottom:5px;background:#fff">'
                  f'<div style="font-size:8.7pt;font-weight:650;color:#1c1c1c;line-height:1.3">{b}</div>'
                  f'<div style="font-size:8pt;color:#555;line-height:1.35">{d}</div></div>')
        return h + '</div>'
    largo = pila('Texto 1 · el largo', 'Unos 1.250–1.500 caracteres. De tú a tú.', [
        ('Gancho', 'Casa con la imagen o con el vídeo y repite su cifra.'),
        ('Cuerpo', 'El problema explicado despacio, como a un amigo.'),
        ('«Esto es para ti si:»', 'Tres puntos que filtran: quién sí.'),
        ('Cierre fijo', '«Si todavía no vendes, esto no es para ti.» «Entra y mira si tu negocio encaja.»'),
        ('Aviso legal', '«Kunfupay es una empresa de tecnología financiera, no un banco…»'),
    ])
    corto = pila('Texto 2 · el corto', 'Unos 200–300 caracteres.', [
        ('Filtro + dolor con la cifra', '«Si vendes cursos desde…» y lo que pierde.'),
        ('La salida', 'Una frase: un enlace, cada uno paga con lo suyo.'),
        ('Cierre', '«Haz clic y descubre cómo.»'),
    ])
    titulos = pila('2 títulos', 'Máximo 40 caracteres. Muy distintos entre sí.', [
        ('Título 1', 'El dolor o la cifra. «Deja de perder ventas con Stripe»'),
        ('Título 2', 'Otro camino: el mecanismo o el resultado. «Un enlace y tú recibes dólares»'),
    ])
    cuerpo = f'<div style="display:flex;gap:14px;align-items:flex-start">{largo}<div style="flex:1;display:flex;flex-direction:column;gap:12px">{corto}{titulos}</div></div>'
    return _fig(cuerpo, 'Lo que lleva cada anuncio: dos textos y dos títulos. Meta enseña una combinación u otra a cada persona.')


def barras(items, titulo='', unidad=' €', pie=''):
    """Barras horizontales sencillas. items = [(etiqueta, valor, nota)]."""
    mx = max(v for _e, v, _n in items)
    h = f'<div style="font-size:9.6pt;font-weight:700;color:{MARCA};margin-bottom:8px">{titulo}</div>' if titulo else ''
    for e, v, n in items:
        w = max(1.5, v / mx * 100)
        val = f'{v:,.2f}'.replace(',', 'X').replace('.', ',').replace('X', '.')
        h += (f'<div style="display:flex;align-items:center;gap:10px;margin-bottom:7px">'
              f'<div style="width:118px;font-size:8.9pt;font-weight:600;text-align:right;flex:none">{e}</div>'
              f'<div style="flex:1;display:flex;align-items:center;gap:8px"><div style="width:{w * 0.62:.1f}%;height:17px;background:{MARCA};opacity:.85;border-radius:2px"></div>'
              f'<div style="font-size:8.9pt;font-weight:700;white-space:nowrap">{val}{unidad}</div>'
              f'<div style="font-size:8.1pt;color:{GRIS};white-space:nowrap">{n}</div></div></div>')
    return _fig(h, pie)


def hubs_coste():
    return barras([
        ('LATAM', 2.29, '53 leads'),
        ('Bali', 23.43, '5 leads'),
        ('Dubái', 39.90, '3 leads'),
        ('Miami', 106.51, '1 lead'),
    ], 'Lo que cuesta un lead en cada hub', ' €',
        'Meta Ads, del 28 de octubre al 11 de noviembre de 2026. Mismos anuncios y 10 € al día en cada hub. Con 1, 3 y 5 leads, Miami, Dubái y Bali son muestras muy pequeñas.')


def semaforo():
    filas = [
        ('#2e7d4f', 'Verde', 'Coste por registro igual o menor que el objetivo.', 'Pasa a escalado. Ese mismo día se encarga su relevo.'),
        ('#c9862a', 'Naranja', 'Entre el objetivo y el techo.', 'Se queda solo si su clic dobla la media del conjunto.'),
        ('#b3261e', 'Rojo', 'Por encima del techo, con 7 días y 3 veces el objetivo gastado.', 'Fuera. Se reemplaza por otro mensaje; no se retoca.'),
        ('#9a9a9a', 'Sin lectura', 'Menos de 36 € gastados.', 'No se juzga: Meta no lo enseñó lo suficiente.'),
    ]
    h = ''
    for c, n, cuando, que in filas:
        h += (f'<div style="display:flex;gap:12px;align-items:flex-start;border-bottom:1px solid {LINEA};padding:7px 0">'
              f'<div style="width:11px;height:11px;border-radius:50%;background:{c};margin-top:3px;flex:none"></div>'
              f'<div style="width:86px;font-size:9.2pt;font-weight:700;flex:none">{n}</div>'
              f'<div style="flex:1;font-size:8.8pt;color:#333;line-height:1.4">{cuando}</div>'
              f'<div style="flex:1;font-size:8.8pt;color:#333;line-height:1.4">{que}</div></div>')
    return _fig(h, 'El semáforo se lee el día 9, por anuncio. Objetivo: 12 € por registro; techo: 18 € (en Classroom, 15 € y 22 €).')


def prueba():
    return _fig('<div class="caja"><b>Figura de prueba</b><span>Texto</span></div>')


def _datos():
    import json
    import os
    return json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'datos', 'patrones.json'), encoding='utf-8'))


def patrones():
    """Patrones que se repiten, contados sobre los copys reales (ver patrones.py)."""
    d = _datos()
    n, c = d['total'], d['cuenta']
    filas = [
        (c['cierre'], 'Cierra con «Entra y mira si tu negocio encaja»', 'La misma frase de cierre en casi todos.'),
        (c['no_vendes'], 'Descarta a quien no vende: «Si todavía no vendes, esto no es para ti»', 'Se dice sin miedo: filtra antes del clic.'),
        (c['paraTi'], 'El texto largo lista «Esto es para ti si:»', 'Tres puntos que dicen quién sí.'),
        (c['filtro'], 'Abre con el filtro: «Si vendes cursos desde…»', 'En la imagen, en el rótulo del vídeo o en el texto.'),
        (c['clic'], 'El texto corto acaba con «Haz clic y descubre cómo»', 'Una sola acción.'),
        (c['hasta'], 'La cifra va con «hasta» delante', '«hasta un 27 %», «hasta un 30 % más».'),
        (c['cifra27'], 'Usa el 27 %', 'Pierdes hasta un 27 %; ya aumentan un 27 %.'),
        (c['stripe'], 'Nombra la herramienta que usa hoy: Stripe', 'Y PayPal en %d; Hotmart solo en %d.' % (c['paypal'], c['hotmart'])),
        (c['recibes'], 'Cierra con lo que recibe quien vende: «recibes euros o dólares»', 'Después de enseñar cómo paga el cliente.'),
        (c['cifra30'], 'Usa el 30 %', 'Solo en la pieza de la cifra y en «Tres cosas».'),
        (c['impuestos'], 'Habla de impuestos', 'Solo los reels de fiscal. Es un ángulo aparte.'),
    ]
    h = (f'<div style="font-size:9.6pt;font-weight:700;color:{MARCA};margin-bottom:8px">'
         f'Cuántos de nuestros {n} anuncios con copy lo hacen</div>')
    for k, t, ej in filas:
        w = k / n * 100
        h += (f'<div style="display:flex;gap:10px;align-items:center;margin-bottom:6px;break-inside:avoid">'
              f'<div style="flex:none;width:58px;text-align:right"><b style="font-size:12.5pt;color:{MARCA}">{k}</b>'
              f'<span style="font-size:7.8pt;color:{GRIS}"> de {n}</span></div>'
              f'<div style="flex:1"><div style="height:7px;background:{LINEA};border-radius:3px;margin-bottom:3px">'
              f'<div style="width:{w:.0f}%;height:7px;background:{MARCA};border-radius:3px"></div></div>'
              f'<div style="font-size:8.9pt;font-weight:650;line-height:1.3">{t}</div>'
              f'<div style="font-size:8pt;color:{GRIS};line-height:1.3">{ej}</div></div></div>')
    pie = ('Cuenta hecha sobre los textos de %d anuncios: 25 estáticos y 21 reels de hubs, 5 estáticos de España, 4 reels de fiscal, '
           '2 de Classroom y 1 de métodos de pago en España. Datos de la carpeta de copys, a 13 de noviembre de 2026.' % n)
    return _fig(h, pie)


def mor():
    """El vehículo: cómo pasa la venta por Kunfupay."""
    def caja(tt, sub, fuerte=False):
        st = (f'border:1.5px solid {MARCA};background:{SUAVE}' if fuerte else f'border:1px solid {LINEA}')
        return (f'<div style="flex:1;{st};border-radius:6px;padding:9px 10px;min-width:0">'
                f'<div style="font-size:9.4pt;font-weight:700;color:{MARCA};line-height:1.25">{tt}</div>'
                f'<div style="font-size:8.3pt;color:#444;line-height:1.4;margin-top:3px">{sub}</div></div>')
    fl = f'<div style="flex:none;align-self:center;font-size:15pt;color:{MARCA}">&#8594;</div>'
    arriba = ('<div style="display:flex;gap:6px">'
              + caja('1 · Tu alumno paga', 'Entra en tu enlace de Kunfupay y paga con lo que usa en su país.')
              + fl
              + caja('2 · Kunfupay vende', 'Le hace la factura al alumno. De los impuestos de esa venta nos encargamos nosotros.', True)
              + fl
              + caja('3 · Tú recibes', 'Euros o dólares. Tú le facturas a Kunfupay: tu venta es con nosotros.')
              + '</div>')
    abajo = (f'<div style="margin-top:8px;border:1px dashed {GRIS};border-radius:6px;padding:8px 11px;font-size:8.6pt;line-height:1.4">'
             f'<b style="color:{MARCA}">Lo que no cambia:</b> tu renta. Quien vive en España tributa por lo que gana, esté donde esté el dinero. '
             f'Por eso cada frase de impuestos acaba con «Tu renta, eso sí, sigue siendo tuya».</div>')
    return _fig(arriba + abajo, 'El vehículo detrás de las frases de impuestos: Kunfupay funciona como Merchant of Record, es decir, representa a quien vende en cada venta. Pendiente de revisión legal.')


def ocho():
    """Los 8 anuncios de un conjunto nuevo y el nivel de cada uno."""
    casillas = [
        ('Dolor 1', 'Una pérdida con su cifra', '1–2'), ('Dolor 2', 'Otro momento del mismo dolor', '1–2'),
        ('Dolor 3', 'Un peligro que no había visto', '1–2'), ('Creencia', 'Algo que cree y no es verdad', '2–3'),
        ('Comparativa', 'Hoy, con X / Con Kunfupay', '2–3'), ('Cómo funciona', 'El mecanismo, paso a paso', '3'),
        ('Prueba', 'Cómo se ve por dentro', '4'), ('Oferta', 'Qué hacer ahora', '5'),
    ]
    h = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">'
    for i, (t, d, n) in enumerate(casillas):
        op = (0.95, 0.95, 0.95, 0.7, 0.7, 0.5, 0.3, 0.15)[i]
        fg = '#fff' if i < 5 else MARCA
        h += (f'<div style="border:1px solid {LINEA};border-radius:5px;overflow:hidden;break-inside:avoid">'
              f'<div style="background:rgba(38,15,99,{op});color:{fg};font-size:8.4pt;font-weight:700;padding:5px 8px">{t}'
              f'<span style="float:right;font-weight:500">nivel {n}</span></div>'
              f'<div style="font-size:8.4pt;color:#333;padding:7px 8px;line-height:1.35">{d}</div></div>')
    h += '</div>'
    return _fig(h, 'Reparto de partida de un conjunto nuevo. Las 8 primeras frases son distintas; hay un solo anuncio de oferta.')


def hooks():
    return barras([
        ('LLC España 2', 30.7, 'reel fiscal'), ('MoR no es magia', 28.7, 'reel fiscal'),
        ('Podcast Juanen', 26.0, '25–27 %'), ('Profitstride', 24.9, 'reel fiscal'),
        ('Infografía España', 14.7, 'pantallas'), ('Infografía Dubái', 12.2, 'pantallas'),
        ('Infografía Bali', 9.2, 'pantallas'),
    ], 'Hook rate: de cada 100 que ven el vídeo, cuántos siguen a los 3 s', ' %',
        'Objetivo: 25–30 % o más. Datos de Meta, 90 días hasta el 12 de noviembre de 2026.')


def estvid():
    filas = [('Testeo España · por registro', 38.65, 17.04, 'Vídeo'), ('Andorra · por registro', 91.64, 39.87, 'Vídeo'),
             ('Hubs · por lead', 4.31, 11.76, 'Estático'), ('Classroom · por lead', 42.81, 85.27, 'Estático')]
    h = (f'<div style="font-size:9.6pt;font-weight:700;color:{MARCA};margin-bottom:8px">Coste por resultado: cuanto más corta la barra, mejor</div>')
    for t, e, v, g in filas:
        mx = max(e, v)
        def b(val, lab, fuerte):
            return (f'<div style="display:flex;align-items:center;gap:6px;margin:2px 0"><div style="width:52px;font-size:8pt;color:{GRIS}">{lab}</div>'
                    f'<div style="width:{val / mx * 52:.0f}%;height:11px;background:{MARCA};opacity:{1 if fuerte else .35};border-radius:2px"></div>'
                    f'<div style="font-size:8.4pt;font-weight:700">{str(val).replace(".", ",")} €</div></div>')
        h += (f'<div style="display:flex;gap:12px;align-items:center;border-top:1px solid {LINEA};padding:6px 0">'
              f'<div style="width:150px;font-size:8.8pt;font-weight:650">{t}</div><div style="flex:1">'
              + b(e, 'Estático', g == 'Estático') + b(v, 'Vídeo', g == 'Vídeo') + f'</div><div style="width:74px;font-size:8.8pt;font-weight:700;color:{MARCA}">Gana {g.lower()}</div></div>')
    return _fig(h, 'Mismo público, campaña y evento. Últimos 90 días hasta el 12 de noviembre de 2026.')


def crm():
    return barras([('Testeo España', 258, '61 leads · 74 % descartados'), ('Hubs', 44, '63 leads · 56 % descartados'),
                   ('Classroom', 251, '21 leads · 71 % descartados')],
                  'Coste por lead cualificado', ' €', 'Meta cruzado con el CRM, 3 a 9 de noviembre de 2026. Los hubs gastaron el 19 % y dieron 5 de los 9 leads cualificados.')


def matriz():
    """Matriz de lanzamiento: qué cubre cada hueco y qué lanzamos hoy en un hub."""
    filas = [
        ('Dolor', '3', 'Un peligro, una pérdida, una escena que ya vivió', 'Reel «Ventas que pierdes» · Reel «¿Cómo te pago?» · Cifra «+30 %»', '1–2'),
        ('Creencia / comparativa', '2', 'Algo que cree y no es verdad; contra qué se compara', 'Tweet · Comparativa «Hoy, con Stripe / Con Kunfupay»', '2–3'),
        ('Mecanismo', '1', 'Cómo funciona, con el producto delante', 'Reel «Infografía» · Reel «Tres cosas»', '3'),
        ('Prueba', '1', 'Cómo se ve por dentro, quién ya lo hace', 'Página de pago con flechas · Noticia', '4'),
        ('Oferta', '1', 'Qué hacer ahora', 'Hoy no hay pieza propia en los hubs: la llamada va dentro de cada texto', '5'),
    ]
    h = (f'<div style="display:grid;grid-template-columns:118px 34px 1.1fr 1.2fr 40px;gap:0;font-size:8.4pt;border:1px solid {LINEA};border-radius:5px;overflow:hidden">'
         + ''.join(f'<div style="background:{MARCA};color:#fff;font-weight:700;padding:6px 8px;font-size:7.8pt">{c}</div>'
                   for c in ('Hueco', 'Nº', 'Qué cubre', 'Lo que lanzamos hoy en un hub', 'Nivel')))
    for i, (a, n, q, l, nv) in enumerate(filas):
        bg = '#fff' if i % 2 == 0 else SUAVE
        h += (f'<div style="padding:7px 8px;font-weight:700;color:{MARCA};background:{bg}">{a}</div>'
              f'<div style="padding:7px 8px;font-weight:700;background:{bg}">{n}</div>'
              f'<div style="padding:7px 8px;line-height:1.4;background:{bg}">{q}</div>'
              f'<div style="padding:7px 8px;line-height:1.4;background:{bg}">{l}</div>'
              f'<div style="padding:7px 8px;background:{bg}">{nv}</div>')
    h += '</div>'
    return _fig(h, 'Matriz de lanzamiento: 8 anuncios que cubren todos los ángulos desde el primer día. Después se sofistica con la investigación.')


def kommo():
    """Mezcla de etapas en Kommo por origen (15 oct a 12 nov 2026)."""
    filas = [('Hubs (Meta)', 126, 52, 6), ('Testeo España (Meta)', 160, 69, 5),
             ('Classroom, landing (Meta)', 40, 78, 18), ('Google Ads (búsqueda)', 231, 44, 15)]
    h = (f'<div style="font-size:9.6pt;font-weight:700;color:{MARCA};margin-bottom:4px">De cada 100 leads, cuántos acaban descartados y cuántos avanzan</div>'
         f'<div style="font-size:8pt;color:{GRIS};margin-bottom:8px"><span style="display:inline-block;width:10px;height:8px;background:{MARCA};opacity:.35"></span> no cualificados &nbsp; '
         f'<span style="display:inline-block;width:10px;height:8px;background:{MARCA}"></span> avanzan (videollamada, negociación, decisión o cerrado)</div>')
    for n, tot, nc, av in filas:
        h += (f'<div style="display:flex;align-items:center;gap:10px;margin-bottom:7px"><div style="width:150px;font-size:8.8pt;font-weight:600;text-align:right">{n}'
              f'<div style="font-weight:400;font-size:7.6pt;color:{GRIS}">{tot} leads</div></div><div style="flex:1">'
              f'<div style="display:flex;align-items:center;gap:6px;margin:2px 0"><div style="width:{nc * .8}%;height:11px;background:{MARCA};opacity:.35;border-radius:2px"></div><b style="font-size:8.4pt">{nc} %</b></div>'
              f'<div style="display:flex;align-items:center;gap:6px;margin:2px 0"><div style="width:{max(av * .8, 1)}%;height:11px;background:{MARCA};border-radius:2px"></div><b style="font-size:8.4pt">{av} %</b></div></div></div>')
    return _fig(h, 'Kommo, leads creados del 15 de octubre al 12 de noviembre de 2026, por etapa del embudo. El resto está en lead frío o en contacto. Cuenta aproximada por etapas; la atribución a campaña en Kommo es incompleta.')


def platinum():
    return barras([('Rubén «3 22»', 9.02, 'UGC Founder'), ('Tweet Rubén Score', 9.90, 'formulario con puntuación'),
                   ('Rubén pizarra (similar)', 19.06, 'UGC Founder'), ('Videojuego', 20.12, 'Andrómeda'),
                   ('Videojuego', 30.00, 'Audiencia Hernán'), ('Tweet', 43.37, 'Audiencia Hernán'),
                   ('Hormozi ataúd', 50.45, 'Audiencia Hernán'), ('Skool + Stripe', 83.78, 'reel'),
                   ('Tweet', 118.53, 'Andrómeda'), ('Reel inversión Rubén', 166.90, 'reel')],
                  'Coste por lead de los anuncios de Classroom Platinum con más gasto', ' €',
                  'Meta, 15 de agosto a 12 de noviembre de 2026. El resultado no es el mismo evento en todos los conjuntos: úsalo para ver el orden, no para compararlo con otros negocios.')


def verticales():
    filas = [('Kunfupay (Meta)', 'Métodos de pago, fiscal, cuenta a tu nombre, hubs', 'Meta + Kommo', 'Maestro'),
             ('Classroom Platinum', 'Creadores que ya facturan', '7.575 € · 168 leads · 45 €', 'Maestro'),
             ('UGC Accelerator', 'UGC', '940 € · 412 res. · 2,3 €', 'Maestro'),
             ('Google Ads', 'Búsqueda', 'Kommo: 231 leads', 'Maestro'),
             ]
    h = (f'<div style="display:grid;grid-template-columns:130px 1.1fr 1.1fr 78px;border:1px solid {LINEA};border-radius:5px;overflow:hidden;font-size:8.4pt">'
         + ''.join(f'<div style="background:{MARCA};color:#fff;font-weight:700;padding:6px 8px;font-size:7.8pt">{c}</div>' for c in ('Vertical', 'A quién', 'Meta, 90 días', 'Dónde')))
    for i, r in enumerate(filas):
        bg = '#fff' if i % 2 == 0 else SUAVE
        h += ''.join(f'<div style="padding:6px 8px;background:{bg};{"font-weight:700;color:" + MARCA if j == 0 else ""}">{c}</div>' for j, c in enumerate(r))
    return _fig(h + '</div>', 'Resultados de Meta: el evento que se cuenta no es el mismo en todas las verticales (registro, lead o formulario).')
