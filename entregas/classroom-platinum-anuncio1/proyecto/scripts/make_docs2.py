# Subtítulos .srt (todas las palabras, 2–4 por bloque) y EDL por versión
import csv, json, os, sys
E = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(E, 'entrega'); os.makedirs(OUT, exist_ok=True)

def ts(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02}:{m:02}:{s:02},{ms:03}'

for V in ['hook1', 'hook2']:
    A = json.load(open(os.path.join(E, 'analysis', f'{V}_aligned.json')))
    W, B = A['words'], A['body_start']
    meta = json.load(open(os.path.join(E, 'analysis', f'{V}_meta.json')))
    disp = lambda w: w['w']
    # tokens para el .srt: «tres mil» se une en «3.000»
    TK = []
    i = 0
    while i < len(W):
        if W[i]['w'] == 'tres' and i + 1 < len(W) and W[i + 1]['w'] == 'mil':
            TK.append({'w': '3.000', 'raw': W[i + 1]['raw'], 's': W[i]['s'], 'e': W[i + 1]['e']}); i += 2
        else: TK.append(W[i]); i += 1
    # grupos: corta en puntuación o cada 4 palabras / 24 caracteres
    WW = W; W = TK
    FUNC = {'y', 'de', 'que', 'a', 'el', 'la', 'los', 'un', 'una', 'en', 'con', 'tu', 'tus', 'si', 'o', 'lo', 'se', 'te', 'mi', 'al', 'nos'}
    groups, cur = [], []
    for i, w in enumerate(W):
        cur.append(i)
        txt = ' '.join(disp(W[k]) for k in cur)
        if w['raw'][-1] in '.,?': groups.append(cur); cur = []
        elif len(cur) == 4 or len(txt) > 22:
            # no cerrar un bloque con una palabra funcional: pasa al siguiente
            if len(cur) > 1 and W[cur[-1]]['w'].lower() in FUNC: groups.append(cur[:-1]); cur = cur[-1:]
            else: groups.append(cur); cur = []
    if cur: groups.append(cur)
    lines = []
    for n, g in enumerate(groups):
        st = W[g[0]]['s']; nx = groups[n + 1][0] if n + 1 < len(groups) else None
        en = W[nx]['s'] if nx is not None and W[nx]['s'] - W[g[-1]]['e'] < 0.45 else W[g[-1]]['e'] + 0.25
        txt = ' '.join(disp(W[k]) for k in g).replace('3 mil', '3.000')
        if g[0] == 0 or W[g[0] - 1]['raw'][-1] in '.?': txt = txt[0].upper() + txt[1:]
        lines.append(f'{n + 1}\n{ts(st)} --> {ts(en - 0.001)}\n{txt}\n')
    open(os.path.join(OUT, f'Classroom_Platinum_Anuncio1_{V.capitalize()}.srt'), 'w').write('\n'.join(lines))
    W = WW

    b = lambda r: W[B + r]['s']; h = lambda i: W[i]['s']
    T = lambda x: f'{x:05.2f}'
    if V == 'hook1':
        hook = [
            (f'{T(0)}–{T(b(0))}', 'Vendes cursos y ya facturas más de 3.000 euros. Te voy a enseñar un programa… Quédate en este vídeo y te contamos cómo conseguirlo.',
             'Video normal a pantalla completa desde el primer frame (sin máscara); punch-ins 100/106 % en cada jump cut',
             f'Único elemento: notificación de pago glass «Kunfupay · Pago recibido» sobre el pecho; la cifra cuenta 0 → +3.000 € con «tres mil euros» ({T(h(7))} s). Subtítulos simples; «3 mil euros» y «cuota de mercado» en pill violeta sólida',
             'Corte seco', 'Swell corto + aire + ticks de la cifra'),
        ]
    else:
        hook = [
            (f'{T(0)}–{T(h(8))}', 'Tú pones los cursos, nosotros ponemos el presupuesto.', 'Video normal a pantalla completa desde el primer frame (sin máscara)',
             f'Único elemento: tarjeta glass que se arma con la voz — «Tú pones / los cursos» ({T(h(0))} s) y «Nosotros ponemos / el presupuesto» ({T(h(4))} s); hace de subtítulo', 'Corte seco', 'Swell corto + clics suaves'),
            (f'{T(h(8))}–{T(b(0))}', 'Si eres un creador de contenido que ya vende más de 3.000 euros al mes y quiere vender más, quédate en este vídeo…',
             'Video normal; punch-ins 100/106 % en cada jump cut', 'Subtítulos simples; «3 mil euros al mes» en pill violeta sólida', 'Corte', 'Clic suave'),
        ]
    body = [
        (f'{T(b(0))}–{T(b(18))}', 'Te presento Classroom Platinum, nuestro programa de partnerships de Kunfupay, mediante el cual invertimos en tu negocio digital.',
         'El video se achica en una máscara (marco simple redondeado); fuera, el mismo video desenfocado',
         f'Tarjeta glass debajo: «Classroom Platinum» (palabra a palabra) + «Nuestro programa de partnerships de Kunfupay» + pill «Invertimos en tu negocio digital» ({T(b(13))} s)', 'Zoom a máscara / zoom hacia la imagen', 'Aire'),
        (f'{T(b(18))}–{T(b(38))}', 'Te apoyamos con equipo, con presupuesto para anuncios y un sistema ya probado…', 'Pantalla completa, speaker reencuadrado arriba (punch-in anclado abajo)',
         'Panel glass «Te apoyamos con» que crece fila a fila: Equipo · Presupuesto para anuncios · Un sistema ya probado (check violeta con cada palabra)', 'Zoom hacia la imagen', 'Clic por check'),
        (f'{T(b(38))}–{T(b(61))}', 'Y todo esto mientras tú haces lo que se te da bien, cuidar a tu comunidad y enseñar a través de tus cursos.', 'Plano limpio (solo persona)',
         'Subtítulos simples; «comunidad» en pill violeta', 'Corte', '—'),
        (f'{T(b(61))}–{T(b(70))}', 'Pero ¿cómo puedes saber si esto es para ti?', 'Pantalla completa', 'Tarjeta glass (loop abierto): pill «En 3 pasos» + «¿Es para ti?» + 1 Tu negocio · 2 Reunión · 3 Programa', 'Entrada glass', 'Aire'),
        (f'{T(b(70))}–{T(b(90))}', 'Primero, nos cuentas cómo funciona tu negocio, qué vendes, a cuánto, a quién… que sea un negocio digital.', 'Pantalla completa',
         'Tarjeta «Paso 1 · Nos cuentas tu negocio» + chips Qué vendes / A cuánto / A quién (con su palabra) + «Solo negocios digitales»', 'Entrada glass', 'Clic por chip'),
        (f'{T(b(90))}–{T(b(110))}', 'Segundo, agendamos una reunión con uno de nuestros consultores. Veremos si tu negocio realmente encaja…', 'Máscara sobre el video desenfocado',
         'Panel «2 · Reunión con un consultor»: ¿Tu negocio encaja? · Estrategia a medida (checks con su palabra)', 'Zoom a máscara / zoom hacia la imagen antes del corte', 'Aire + clics'),
        (f'{T(b(110))}–{T(b(140))}', 'Y tercero, comenzamos con el programa. Crearás tu comunidad… account manager… oferta validada… proceso de escalado', 'Pantalla completa',
         'Panel «3 · Comenzamos el programa» que crece: Tu comunidad en Classroom · Account manager · Oferta validada · Escalado', 'Entrada glass', 'Clic por check'),
        (f'{T(b(140))}–{T(b(152))}', 'donde nosotros pagaremos todos los anuncios, sin que tengas que arriesgar tu dinero.', 'Pantalla completa',
         'Tarjeta glass: pill «Escalado» + «Nosotros pagamos / todos los anuncios» + «Sin arriesgar tu dinero»', 'Entrada glass', 'Aire'),
        (f'{T(b(152))}–{T(b(159))}', 'Es decir, solo ganamos si tú ganas.', 'Plano limpio con punch-in', 'Subtítulos simples; «tú ganas» en pill violeta', 'Corte', 'Clic suave'),
        (f'{T(b(159))}–{T(b(183))}', 'Y muy importante, este programa no es para todo el mundo, solamente para infoproductores que venden acceso a una comunidad, suscripciones o educación online.',
         'Máscara sobre el video desenfocado', 'Panel: «No es para todo el mundo» → «Solo para infoproductores que venden» + 1 Acceso a una comunidad · 2 Suscripciones · 3 Educación online', 'Zoom a máscara / zoom hacia la imagen', 'Aire + clics'),
        (f'{T(b(183))}–{T(b(194))}', 'Y además, tienes que estar facturando más de 3.000 euros.', 'Pantalla completa', 'Tarjeta glass «Requisito»: +0 → +3.000 € (count-up) + «de facturación al mes»', 'Entrada glass', 'Ticks'),
        (f'{T(b(194))}–{T(meta["t_end"])}', 'Si eres uno de estos, clic aquí abajo.', 'Pantalla completa', 'Tarjeta CTA: pill «Classroom Platinum» + «Clic aquí abajo» (palabra a palabra)', 'Entrada glass', 'Aire'),
        (f'{T(meta["t_end"])}–{T(meta["duration"])}', '— (música resuelve)', 'Focus pull al video desenfocado', 'Tarjeta final: kunfupay · Classroom Platinum · pill «Clic aquí abajo»', 'Focus pull', 'Acorde final + clic'),
    ]
    rows = hook + body
    hdr = ['Tiempo (s)', 'Lo que se dice', 'Lo que se ve', 'Texto en pantalla', 'Transición', 'Sonido']
    with open(os.path.join(OUT, f'EDL_Anuncio1_{V.capitalize()}.csv'), 'w', newline='') as f:
        w = csv.writer(f); w.writerow(hdr); w.writerows(rows)
    md = [f'# EDL · Classroom Platinum · Anuncio 1 · {V.capitalize()}', '',
          f'1080×1920 · 30 fps · {meta["duration"]:.1f} s · fuente 4K (2160×3840). Cuerpo idéntico en las dos versiones (desplazado {b(0):.2f} s).', '',
          '| ' + ' | '.join(hdr) + ' |', '|' + '---|' * len(hdr)] + ['| ' + ' | '.join(r) + ' |' for r in rows]
    open(os.path.join(OUT, f'EDL_Anuncio1_{V.capitalize()}.md'), 'w').write('\n'.join(md) + '\n')
    print(V, len(lines), 'subtítulos')
