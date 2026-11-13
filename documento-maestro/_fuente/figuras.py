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
