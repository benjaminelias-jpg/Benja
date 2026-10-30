# Subtítulos .srt (todas las palabras, 2–4 por bloque) y EDL del video Hub Latam Pagos
import csv, json, os
E = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(E, 'entrega'); os.makedirs(OUT, exist_ok=True)
W = json.load(open(os.path.join(E, 'analysis', 'hub_aligned.json')))['words']
meta = json.load(open(os.path.join(E, 'analysis', 'meta.json')))
def ts(t):
    ms = int(round(t * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02}:{m:02}:{s:02},{ms:03}'
FUNC = {'y', 'de', 'que', 'a', 'el', 'la', 'los', 'un', 'una', 'en', 'con', 'tu', 'tus', 'si', 'o', 'lo', 'se', 'te', 'su', 'sus', 'al', 'es'}
groups, cur = [], []
for i, w in enumerate(W):
    cur.append(i); txt = ' '.join(W[k]['w'] for k in cur)
    if w['raw'][-1] in '.,?': groups.append(cur); cur = []
    elif len(cur) == 4 or len(txt) > 22:
        if len(cur) > 1 and W[cur[-1]]['w'].lower() in FUNC: groups.append(cur[:-1]); cur = cur[-1:]
        else: groups.append(cur); cur = []
if cur: groups.append(cur)
lines = []
for n, g in enumerate(groups):
    st = W[g[0]]['s']; nx = groups[n + 1][0] if n + 1 < len(groups) else None
    en = W[nx]['s'] if nx is not None and W[nx]['s'] - W[g[-1]]['e'] < 0.45 else W[g[-1]]['e'] + 0.25
    txt = ' '.join(W[k]['w'] for k in g)
    if g[0] == 0 or W[g[0] - 1]['raw'][-1] in '.?': txt = txt[0].upper() + txt[1:]
    lines.append(f'{n + 1}\n{ts(st)} --> {ts(en - 0.001)}\n{txt}\n')
open(os.path.join(OUT, 'Hub_Latam_Pagos.srt'), 'w').write('\n'.join(lines))
T = lambda x: f'{x:05.2f}'
s = lambda i: W[i]['s']
sc = meta['scenes']
rows = [
 (f'{T(0)}–{T(s(7))}', 'Si vendes cursos de Latinoamérica, como yo,', 'Video normal desde el primer frame (sin escenas en el gancho)',
  '«como yo» en manuscrita naranja + flecha a mano que señala al creador', 'Corte seco', 'Lápiz'),
 (f'{T(s(7))}–{T(sc[0][0])}', 'probablemente estés cobrando con Hotmart, Stripe si te hiciste una LLC, alguna que otra transferencia y déjame decirte que eso no es escalable.',
  'Video; punch-ins 100/106 % en los jump cuts', 'Etiquetas de papel «Hotmart», «Stripe» (+ LLC a mano), «Transferencia», que entran a saltos con su palabra y se tachan a mano en «no es escalable» (subtítulo en manuscrita)', 'Corte', 'Taps de papel + garabato'),
 (f'{T(sc[0][0])}–{T(sc[0][1])}', 'Es más, estás perdiendo hasta un 27 % de todas tus conversiones.', 'ESCENA RAMIRO · Warren Buffett de cuerpo entero (B/N, ojo de pez) sobre «El cambista y su mujer» (Massys, 1514)',
  '«Regla nº 1: / no perder dinero.» + a mano «y tú pierdes / hasta un 27 %» + flecha a Buffett', 'Corte seco (entrada a saltos)', 'Papel + ticks + lápiz'),
 (f'{T(sc[0][1])}–{T(sc[1][0])}', 'Tu cliente quiere pagar como paga en su país,', 'Video (cambio de plano)', 'Subtítulos', 'Corte', '—'),
 (f'{T(sc[1][0])}–{T(sc[1][1])}', 'pero entra a tu link y no ve su moneda local y él en su mente quiere comprar,', 'ESCENA RAMIRO · Jeff Bezos (cuerpo hasta fuera de plano) sobre el mapamundi de Ortelius (1572)',
  '«Obsesiónate / con tu cliente:» + a mano «si no ve / su moneda local…» + flecha a Bezos', 'Corte seco', 'Papel + ticks + lápiz'),
 (f'{T(sc[1][1])}–{T(s(80))}', 'pero jamás te lo dice y lo único que hace es irse.', 'Video', '«irse» en manuscrita + flecha naranja que se escapa del plano', 'Corte', 'Lápiz'),
 (f'{T(s(80))}–{T(sc[2][0])}', 'Pero con tu enlace de Kunfupay te paga cualquiera, de Argentina, España, Estados Unidos,', 'Video (plano cerrado)',
  'Columna derecha: etiqueta «tu enlace · kunfupay» y debajo Argentina ARS, España EUR, EE. UU. USD, unidas a mano, cada una con su palabra', 'Corte', 'Taps'),
 (f'{T(sc[2][0])}–{T(sc[2][1])}', 'todo con el mismo link. Cada alumno paga como paga en su país', 'ESCENA RAMIRO · Steve Jobs con el Macintosh (1984) sobre el cerebro de Vesalius (De humani corporis fabrica)',
  '«Lo simple / siempre gana:» + a mano «un solo link / en todo el mundo» + flecha a Jobs', 'Corte seco', 'Papel + ticks + lápiz'),
 (f'{T(sc[2][1])}–{T(s(115))}', 'y si alguno quiere con cripto, también puede.', 'Video', 'Etiqueta «también · ₿ cripto»; «cripto» en manuscrita', 'Corte', 'Tap'),
 (f'{T(s(115))}–{T(sc[3][0])}', 'Y vos recibís lo que querés, euros, dólares, la moneda que quieras.', 'Video (cambio de plano)', '€ y $ a mano en el lado libre + círculo naranja en «la moneda»', 'Corte', 'Lápiz'),
 (f'{T(s(127))}–{T(s(142))}', 'Los creadores de Latam ya aumentaron hasta un 27 % todas sus conversiones gracias a esto,', 'Video (cambio de plano)',
  'Tarjeta de papel «conversiones +27 %» en el lado libre con su palabra + subrayado naranja en «conversiones»; «27 %» en manuscrita', 'Corte', 'Tap + lápiz'),
 (f'{T(s(142))}–{T(meta["t_end"])}', 'así que hacé clic en el enlace y mirá cómo funciona.', 'Video', '«clic» y «enlace» en manuscrita + flecha naranja a mano hacia el botón', 'Corte', 'Lápiz'),
 (f'{T(meta["t_end"])}–{T(meta["duration"])}', '— (música resuelve)', 'Tarjeta final en papel con grano', '«kunfupay» + a mano «cobrá en cualquier moneda»', 'Corte seco', 'Papel + acorde final'),
]
hdr = ['Tiempo (s)', 'Lo que se dice', 'Lo que se ve', 'Texto en pantalla', 'Transición', 'Sonido']
with open(os.path.join(OUT, 'EDL_Hub_Latam_Pagos.csv'), 'w', newline='') as f:
    w = csv.writer(f); w.writerow(hdr); w.writerows(rows)
md = ['# EDL · Hub Latam Pagos', '', f'1080×1920 · 30 fps · {meta["duration"]:.1f} s (fuente 57,4 s; silencios recortados). 3 escenas «estilo Ramiro» + motions sencillas.', '',
      '| ' + ' | '.join(hdr) + ' |', '|' + '---|' * len(hdr)] + ['| ' + ' | '.join(r) + ' |' for r in rows]
open(os.path.join(OUT, 'EDL_Hub_Latam_Pagos.md'), 'w').write('\n'.join(md) + '\n')
print(len(lines), 'subtítulos')
