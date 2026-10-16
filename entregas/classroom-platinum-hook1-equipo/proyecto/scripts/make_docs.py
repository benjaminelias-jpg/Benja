# Genera subtítulos .srt (todas las palabras, grupos de 2–4) y la EDL (Markdown + CSV)
import json, csv
import os
E = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = f'{E}/entrega'
os.makedirs(OUT, exist_ok=True)
W = json.load(open(f'{E}/analysis/words_aligned.json'))
disp = {'tres': '3', 'cien': '100'}
words = [disp.get(w['w'].strip('.,'), w['w'].strip('.,')) for w in W]
starts = [w['s'] for w in W]; ends = [w['e'] for w in W]
G = [(0, 1), (2, 5), (6, 8), (9, 12), (13, 14), (15, 17), (18, 19), (20, 21), (22, 23), (24, 27), (28, 30), (31, 34),
     (35, 38), (39, 40), (41, 43), (44, 45), (46, 46), (47, 50), (51, 52), (53, 55), (56, 58), (59, 60), (61, 63),
     (64, 65), (66, 67), (68, 69), (70, 71), (72, 75), (76, 76), (77, 77), (78, 78), (79, 80), (81, 83), (84, 84),
     (85, 87), (88, 90), (91, 92), (93, 95), (96, 98), (99, 100), (101, 104), (105, 107), (108, 109), (110, 113), (114, 116)]
assert [i for a, b in G for i in range(a, b + 1)] == list(range(len(words)))
def ts(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02}:{m:02}:{s:02},{ms:03}'
lines = []
for k, (a, b) in enumerate(G):
    st = starts[a]
    en = starts[G[k + 1][0]] if k + 1 < len(G) and starts[G[k + 1][0]] - ends[b] < 0.45 else ends[b] + 0.25
    txt = ' '.join(words[a:b + 1])
    if a in (0, 22, 61, 101): txt = txt[0].upper() + txt[1:]
    lines.append(f'{k + 1}\n{ts(st)} --> {ts(en - 0.001)}\n{txt}\n')
open(f'{OUT}/Classroom_Platinum_Hook1_Equipo.srt', 'w').write('\n'.join(lines))

T = lambda i: f'{starts[i]:.2f}'
EDL = [
 ('00.00–03.40', 'Estamos buscando a creadores de contenido que facturen más de 3 mil euros',
  'Gancho compuesto: video achicado (plano A, cara + pizarra) en marco simple redondeado con borde fino, sobre el mismo video desenfocado + orbes violeta',
  'Tarjeta glass: pill «Buscamos creadores» + «¿Facturas +3 mil € al mes?»; «+3 mil €» pasa a lavanda y se subraya en violeta al decir «3 mil» (' + T(10) + ' s)',
  'Entrada del glass (se forma) + destello de borde', 'Swell corto + aire suave; clic de vidrio en el subrayado'),
 ('03.40–03.90', '…euros / para…', 'Zoom-through en el beat: el video achicado crece hasta pantalla completa (radio → 0, el borde se desvanece)', '—', 'Zoom-through (cubic-bezier .16,1,.3,1)', 'Aire suave'),
 ('03.66–04.50', 'para ayudarlos a escalar', 'Plano A completo con push lento 100→104 %', 'Subtítulo en pill de vidrio (fondo de pizarra)', 'Corte', '—'),
 ('04.50–06.23', 'con nuestro programa Classroom Platinum', 'Plano A, punch-in 108 % en el jump cut (5.33 s)', 'Tarjeta glass: pill «Nuestro programa» + «Classroom Platinum» (cada palabra entra con su voz: ' + T(20) + ' / ' + T(21) + ' s)', 'Punch-in', 'Aire suave'),
 ('06.23–08.16', 'Nuestro playbook ya ha sido validado por más de', 'Plano B (sentado) con punch-in 112 %', 'Subtítulos en pill de vidrio (fondo claro: pantalón blanco → brightness .72)', 'Corte en L (2 frames)', '—'),
 ('07.66–09.30', '100 creadores de contenido', 'Plano B', 'Tarjeta glass: pill «Playbook validado» + cifra +0 → +100 (count-up) + «creadores de contenido»', 'Entrada glass', 'Aire + ticks del contador'),
 ('09.23–10.66', 'y todos los miembros tienen acceso', 'Plano B abierto 100 % (momento limpio, solo persona)', 'Subtítulos en pill de vidrio', 'Corte (jump cut enmascarado con cambio de escala)', '—'),
 ('10.53–11.13', 'a nuestro equipo…', 'Barrido de vidrio a pantalla completa (der → izq); el cambio a B-roll ocurre debajo, en el beat 10.83 s', 'Subtítulo simple', 'Barrido de vidrio', 'Whoosh de aire paneado der → izq'),
 ('11.00–16.20', 'equipo de lanzamientos especializado, a toda la tecnología de Kunfupay y a financiación de sus campañas de marketing',
  'B-roll: orbes violeta/lavanda en movimiento lento + video achicado del plano B en marco simple redondeado', 'Panel UI glass «Todos los miembros tienen acceso a»: 3 filas con icono de línea + check violeta que se dibuja con la voz (' + T(46) + ' / ' + T(52) + ' / ' + T(58) + ' s)', 'Entrada glass escalonada', 'Clic de vidrio en cada check'),
 ('16.20–17.37', 'Y muy importante', 'Plano C (primer plano) + punch-in 100→107 % en «muy»', 'Subtítulo; «importante» dentro de pill violeta sólida', 'Corte duro desde B-roll', 'Clic suave'),
 ('17.37–19.29', 'el programa Classroom Platinum es solamente', 'Plano C (momento limpio)', 'Subtítulos simples, palabra activa en lavanda', '—', '—'),
 ('19.29–20.29', 'para infoproductores', 'Plano C', 'Frase clave en pill de vidrio', 'Entrada glass', 'Aire suave'),
 ('20.29–21.59', 'que venden acceso a', 'Plano C', 'Subtítulo simple', '—', '—'),
 ('21.59–25.38', 'comunidades, cursos, coaching o servicios y productos digitales', 'Plano C con punch-ins alternos 100/107 % en cada jump cut (ritmo de lista)', 'Pill de vidrio que cambia de ancho con número violeta: 1 Comunidades · 2 Cursos · 3 Coaching · 4 Servicios y productos digitales', 'Cortes al ritmo de la lista', 'Clic de vidrio por ítem'),
 ('25.38–26.83', 'similares que ya tienen', 'Plano C', 'Subtítulos simples', '—', '—'),
 ('26.83–30.84', 'un producto funcionando y vendiendo por lo menos 3 mil euros al mes', 'Blur dissolve (en el beat) a B-roll de orbes', 'Panel UI glass «Tu producto»: pill «Funcionando», gráfica de línea que se dibuja, cifra 0 → 3.000 € (count-up), «al mes» entra con la voz', 'Blur dissolve', 'Aire + clic + ticks'),
 ('30.17–33.72', 'Así que ya sabes, si te interesa Classroom Platinum y cumples las condiciones', 'El B-roll sigue bajo «Así que ya sabes»; corte al plano D (de pie, 104 %) en el beat 30.84 s; punch-in 111 % en el jump cut (32.47 s)', 'Subtítulos simples', 'Corte duro', '—'),
 ('33.24–34.36', 'aplica aquí abajo', 'Plano D', 'Tarjeta CTA glass: pill «Classroom Platinum» + «Aplica aquí abajo» (palabra a palabra) + «Si ya facturas +3 mil € al mes»', 'Entrada glass', 'Aire suave'),
 ('34.36–36.20', '— (música resuelve)', 'Blur dissolve a orbes; cierre', 'Tarjeta glass: wordmark «kunfupay» + «Classroom Platinum» + pill violeta «Aplica aquí abajo»', 'Blur dissolve', 'Acorde final de la música + clic'),
]
hdr = ['Tiempo (s)', 'Lo que se dice', 'Lo que se ve', 'Texto en pantalla', 'Transición', 'Sonido']
with open(f'{OUT}/EDL_Classroom_Platinum_Hook1_Equipo.csv', 'w', newline='') as f:
    w = csv.writer(f); w.writerow(hdr); w.writerows(EDL)
md = ['# EDL · Classroom Platinum · Hook 1 Equipo', '',
      'Formato: 1080×1920, 30 fps, 36,2 s. Música: Lyria 3 Pro (generada), 103 BPM. Máster −14 LUFS / −1 dBTP.', '',
      '| ' + ' | '.join(hdr) + ' |', '|' + '---|' * len(hdr)]
md += ['| ' + ' | '.join(r) + ' |' for r in EDL]
md += ['', '## Cortes de audio (silencios recortados)', '',
       'Se recortaron 20 pausas (umbral −38 dB) dejando 80–160 ms de aire; 37,9 s → 34,6 s de voz. En los 3 cambios de plano se aplica corte en L (el plano saliente dura 1–2 frames más). Los jump cuts dentro de un plano se enmascaran alternando la escala (punch-in 4–11 %).']
open(f'{OUT}/EDL_Classroom_Platinum_Hook1_Equipo.md', 'w').write('\n'.join(md) + '\n')
print('ok', len(lines), 'subtítulos')
