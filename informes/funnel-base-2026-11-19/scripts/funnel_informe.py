"""Informe funnel base 12-18 nov. Lee funnel/*.json(l) y escribe funnel/funnel-base.html + funnel/base.json"""
import json, glob, os, base64, html, datetime, re
from collections import Counter, defaultdict

B = '/tmp/claude-0/-home-user-Benja/cc9d708e-1f57-5b20-92ae-08d1ef4fe812/scratchpad/'
F = B + 'funnel/'
esc = html.escape

ads = json.load(open(F + 'meta_ads_utm.json'))
cruce = {}
for f in sorted(glob.glob(F + 'cruce_*.jsonl')):
    for l in open(f):
        if l.strip():
            c = json.loads(l); cruce[str(c['lead_id'])] = c
reg = {}
for f in sorted(glob.glob(F + 'reg_*.jsonl')):
    for l in open(f):
        if l.strip():
            r = json.loads(l); reg[str(r['lead_id'])] = r

def ts(s):
    if not s: return None
    try:
        return datetime.datetime.fromisoformat(str(s).replace('Z', '+00:00'))
    except Exception:
        return None

REG_TIENDA_SOL = {110041571, 110777607, 110898016, 142}
REG_TIENDA_OK = {110777607, 142}
TEST = re.compile(r'test|prueba|borrar', re.I)

leads = []
for lid, c in cruce.items():
    if any(TEST.search(x or '') for x in (c.get('notas') or [])) and 'borrar' in ' '.join(c.get('notas') or []).lower():
        continue
    if lid in ('23262202', '23468620'):
        continue
    r = reg.get(lid, {})
    created = ts(c.get('created') or r.get('created'))
    rg = c.get('registro') or {}
    rcampos = rg.get('campos') or {}
    otros = c.get('otros_leads') or []
    reg_ids = [o for o in otros if o.get('pipelineId') == 14250663]
    reg_stage = rg.get('stage_id') or (reg_ids[0].get('stageId') if reg_ids else None)
    reg_created = ts(rg.get('created')) or (ts(reg_ids[0].get('createdAt')) if reg_ids else None)
    f_reg = ts(r.get('f_registro')) or (reg_created if reg_stage else None)
    if not f_reg and (r.get('nota_registro') or c.get('pipeline', '').startswith('Kunfupay Registro')):
        f_reg = created
    if not f_reg and (c.get('campos_propios') or {}).get('Información de la tienda'):
        f_reg = created
    am = c.get('pipeline', '').startswith('ACCOUNT') or any(o.get('pipelineId') == 14731215 for o in otros)
    if am and not f_reg:
        f_reg = created
    previo = bool(f_reg and created and (created - f_reg).total_seconds() > 3600)
    sol = bool(r.get('f_solicitud_tienda') or r.get('f_activacion_tienda') or r.get('f_rechazo_tienda')
               or (reg_stage and int(reg_stage) in REG_TIENDA_SOL) or rcampos.get('Fecha solicitud tienda') or rcampos.get('Fecha rechazo tienda'))
    ok = bool(r.get('f_activacion_tienda') or (reg_stage and int(reg_stage) in REG_TIENDA_OK) or rcampos.get('Fecha activación tienda'))
    rech = bool(r.get('f_rechazo_tienda') or (reg_stage and int(reg_stage) == 110898016) or rcampos.get('Fecha rechazo tienda'))
    kyc = (r.get('kyc') or rcampos.get('Estado KYC') or '')
    llam = r.get('llamadas') or []
    out = [x for x in llam if x.get('tipo') == 'call_out']
    hablo = [x for x in llam if (x.get('duracion') or 0) >= 30]
    conecto = [x for x in llam if (x.get('duracion') or 0) > 0]
    primera = min((ts(x.get('fecha')) for x in llam if ts(x.get('fecha'))), default=None)
    form_cual = (c.get('origen_form') == 'cualificado') or c.get('pipeline', '').startswith('Kunfupay Campa') or am
    leads.append(dict(
        id=lid, src=(c.get('utm_source') or '').lower(), utm=(c.get('utm_campaign'), c.get('utm_term'), c.get('utm_content')),
        pipeline=c.get('pipeline'), stage=c.get('stage'), resp=c.get('responsable', '').split('|')[0].strip(),
        created=created, form_cual=form_cual, descartado=c.get('stage') == 'NO CUALIFICADO',
        modelo=c.get('modelo'), fact=c.get('facturacion'),
        registro=bool(f_reg), previo=previo, tienda_sol=sol, tienda_ok=ok, tienda_rech=rech,
        kyc_ok=kyc == 'Aprobado', venta=str(r.get('ventas') or rcampos.get('Nº de ventas totales') or '0') not in ('0', '', 'None'),
        llamadas=len(llam), hablo=len(hablo) > 0, conecto=len(conecto) > 0, h_primera=((primera - created).total_seconds() / 3600 if primera and created else None),
        tareas=c.get('resultados_tareas') or [], ia=(r.get('resumen_llamada_ia') or {}),
    ))

meta = [l for l in leads if l['src'] not in ('google',) and l['utm'][0]]
sin_utm = [l for l in leads if not l['utm'][0]]
por_key = defaultdict(list)
for l in meta:
    por_key[l['utm']].append(l)

def num(x):
    try: return float(x)
    except Exception: return 0.0

usadas = set(); filas = []
for a in ads:
    k = tuple(a['utm']) if a.get('utm') else None
    L = por_key.get(k, []) if k else []
    if k: usadas.add(k)
    filas.append(dict(
        id=a['id'], name=a['name'], creative=a['creative_id'], campaign=a['campaign_name'], adset=a['adset_name'], utm=k,
        gasto=num((a.get('amount_spent') or {}).get('value')), impr=int(num(a.get('impressions'))), alcance=int(num(a.get('reach'))),
        clics=int(num(a.get('link_click'))), lpv=int(num(a.get('landing_page_view'))), L=L))

def agg(L):
    return dict(leads=len(L), cual=sum(l['form_cual'] and not l['descartado'] for l in L), formcual=sum(l['form_cual'] for l in L),
                registro=sum(l['registro'] and not l['previo'] for l in L), previo=sum(l['previo'] for l in L),
                tienda_sol=sum(l['tienda_sol'] for l in L), tienda_ok=sum(l['tienda_ok'] for l in L), kyc=sum(l['kyc_ok'] for l in L))

for f in filas:
    f.update(agg(f['L']))

huerf = [l for k, v in por_key.items() if k not in usadas for l in v]
huerf_tab = Counter()
for l in huerf:
    huerf_tab[l['utm']] += 1

# ---------- datos píxel (toda la web, 12-18 nov) ----------
PIX = [('Empiezan el formulario', 1101), ('Paso 1', 1048), ('Paso 2', 1076), ('Dejan el email', 464), ('Envían sus datos', 474)]
PIX_OUT = [('Lead cualificado', 216), ('Lead no cualificado', 278)]
PIX_REG = [('Registro completado', 518), ('Solicitud de tienda', 279), ('KYC completado', 225), ('Tienda aprobada', 57)]

T = lambda k: sum(f[k] for f in filas)
TOT = dict(gasto=T('gasto'), impr=T('impr'), alcance=T('alcance'), clics=T('clics'), lpv=T('lpv'))
TOT.update(agg([l for f in filas for l in f['L']]))
ALL = agg(meta)

# ---------- respuesta ----------
q = [l for l in meta if l['form_cual']]
llamados = [l for l in q if l['llamadas'] > 0]
hablaron = [l for l in q if l['hablo']]
conectan = [l for l in q if l['conecto']]
hp = sorted(l['h_primera'] for l in llamados if l['h_primera'] is not None and l['h_primera'] >= 0)
med = hp[len(hp) // 2] if hp else None
st_q = Counter(l['stage'] for l in q)
por_resp = defaultdict(list)
for l in q:
    por_resp[l['resp'] or 'Sin asignar'].append(l)

camp_all = json.load(open(F + 'campanas_ads_todo.json'))
S = {112974867: 'Leads Landings', 112968607: 'Contacto inicial', 113200719: 'Videollamada agendada', 113097507: 'Lead frío',
     113246847: 'No cualificado', 112968611: 'Negociación', 112968615: 'Tomar decisión', 142: 'Logrado', 143: 'Ventas perdidos'}
AVANZA = {'Videollamada agendada', 'Negociación', 'Tomar decisión', 'Logrado'}
def semana(s):
    d = datetime.date.fromisoformat(s[:10]); return d - datetime.timedelta(days=d.weekday())
coh = defaultdict(Counter)
for l in camp_all:
    coh[semana(l['createdAt'])][S[l['stageId']]] += 1
snap = Counter(S[l['stageId']] for l in camp_all)

json.dump(dict(fecha='2026-11-19', periodo='2026-11-12/2026-11-18', meta=TOT, kommo_meta=ALL,
               respuesta=dict(cualificados=len(q), llamados=len(llamados), hablaron=len(hablaron), mediana_h_primera=med,
                              etapas=dict(st_q)),
               campanas_ads_snapshot=dict(snap),
               por_anuncio=[{k: v for k, v in f.items() if k != 'L'} for f in filas]),
          open(F + 'base.json', 'w'), ensure_ascii=False, indent=1, default=str)

# ---------- HTML ----------
def n(x): return f'{x:,.0f}'.replace(',', '.')
def eur(x): return f'{x:,.2f} €'.replace(',', 'X').replace('.', ',').replace('X', '.')
def pct(a, b): return f'{100*a/b:.1f} %'.replace('.', ',') if b else '–'
def pct0(a, b): return f'{100*a/b:.0f} %' if b else '–'

def img(cid):
    p = B + f'creat_img/{cid}.jpg'
    if not os.path.exists(p): return '<div class="ph">sin imagen</div>'
    return f'<img loading="lazy" alt="" src="data:image/jpeg;base64,{base64.b64encode(open(p, "rb").read()).decode()}">'

def funnel(steps, nota=None, alerta=True):
    """steps: [(label, valor)]. Barra = % que pasa desde el paso anterior."""
    out = ['<div class="fn">']
    prev = None
    for i, (lab, v) in enumerate(steps):
        if prev is None:
            w, txt = 100, 'punto de partida'
        else:
            w = max(0, min(100, 100 * v / prev)) if prev else 0
            pierde = 100 - w
            txt = f'pasa el {pct(v, prev)} · se pierde el {pierde:.1f} %'.replace('.', ',') if prev else '–'
            if v > prev: txt = f'{pct(v, prev)} del paso anterior (cuenta repeticiones)'
        cls = ' alerta' if alerta and prev and v < prev and (100 - w) >= 50 else ''
        out.append(f'<div class="fr{cls}" title="{esc(lab)}: {n(v)} · {esc(txt)}"><span class="fl">{esc(lab)}</span><b>{n(v)}</b>'
                   f'<span class="ft"><i style="width:{w:.1f}%"></i></span><span class="fp">{esc(txt)}</span></div>')
        prev = v
    out.append('</div>')
    if nota: out.append(f'<p class="nota">{nota}</p>')
    return ''.join(out)

def mini(f):
    pasos = [('Impr.', f['impr']), ('Alcance', f['alcance']), ('Clics', f['clics']), ('Visitas', f['lpv']),
             ('Leads', f['leads']), ('Cualif.', f['cual']), ('Registro', f['registro']), ('Tienda', f['tienda_sol'])]
    cells = []
    prev = None
    for lab, v in pasos:
        base = f['leads'] if lab == 'Registro' else prev
        tasa = '' if prev is None else f'<em>{pct0(v, base)}{" de leads" if lab == "Registro" else ""}</em>'
        cells.append(f'<div class="mc"><span>{lab}</span><b>{n(v)}</b>{tasa}</div>')
        prev = v
    return '<div class="mini">' + ''.join(cells) + '</div>'

kpis = [('Gasto', eur(TOT['gasto'])), ('Impresiones', n(TOT['impr'])), ('Clics al enlace', n(TOT['clics'])),
        ('Visitas a la landing', n(TOT['lpv'])), ('Leads en Kommo', n(ALL['leads'])), ('Cualificados', n(ALL['cual'])),
        ('Registrados', n(ALL['registro'])), ('Tienda solicitada', n(ALL['tienda_sol']))]
kpi_html = ''.join(f'<div class="kpi"><b>{v}</b><span>{k}</span></div>' for k, v in kpis)

f_top = funnel([('Impresiones', TOT['impr']), ('Personas alcanzadas', TOT['alcance']), ('Clics al enlace', TOT['clics']),
                ('Visitas a la landing', TOT['lpv'])],
               'Fuente: Meta, 82 anuncios activos, del 12 al 18 de noviembre. Que solo un 1-2 % haga clic es normal en Meta, por eso ese paso no se marca en rojo.', alerta=False)
f_pix = funnel(PIX, 'Fuente: píxel de Meta en toda la web (incluye tráfico de Google, Classroom y orgánico). El píxel no separa por anuncio. El paso 2 supera al paso 1 porque hay gente que vuelve atrás y lo repite.')
f_pix2 = funnel(PIX_REG, 'Fuente: píxel en la plataforma (business.kunfupay.com), toda la web, mismos días.')
f_km = funnel([('Leads de anuncios de Meta', ALL['leads']), ('Cualificados', ALL['cual']), ('Se registran', ALL['registro']),
               ('Solicitan tienda', ALL['tienda_sol']), ('Tienda aprobada', ALL['tienda_ok'])],
              f'Fuente: Kommo, leads con UTM de Meta creados del 12 al 18 de noviembre, con su estado a 19 de noviembre. «Se registran» cuenta solo registros nuevos; {ALL["previo"]} leads ya tenían cuenta antes de rellenar el formulario y no se cuentan.')

# tabla por conjunto
sets = defaultdict(list)
for f in filas:
    sets[(f['campaign'], f['adset'])].append(f)

def rowsum(fs):
    s = {k: sum(f[k] for f in fs) for k in ('gasto', 'impr', 'alcance', 'clics', 'lpv', 'leads', 'cual', 'registro', 'tienda_sol', 'tienda_ok')}
    return s

tabla = []
for (camp, aset), fs in sorted(sets.items(), key=lambda x: -rowsum(x[1])['gasto']):
    s = rowsum(fs)
    cpl = eur(s['gasto'] / s['leads']) if s['leads'] else '–'
    tabla.append(f'<tr><td><a href="#s{abs(hash(aset))}">{esc(aset)}</a><small>{esc(camp)}</small></td><td class="n">{eur(s["gasto"])}</td>'
                 f'<td class="n">{n(s["impr"])}</td><td class="n">{pct(s["clics"], s["impr"])}</td><td class="n">{n(s["clics"])}</td><td class="n">{n(s["lpv"])}</td>'
                 f'<td class="n">{n(s["leads"])}</td><td class="n">{pct(s["leads"], s["lpv"])}</td><td class="n">{n(s["cual"])}</td><td class="n">{n(s["registro"])}</td>'
                 f'<td class="n">{n(s["tienda_sol"])}</td><td class="n">{cpl}</td></tr>')

secciones = []
for camp in sorted({c for c, _ in sets}, key=lambda c: -sum(rowsum(v)['gasto'] for (cc, _), v in sets.items() if cc == c)):
    secciones.append(f'<section class="camp"><h2>{esc(camp)}</h2>')
    for (cc, aset), fs in sorted(sets.items(), key=lambda x: -rowsum(x[1])['gasto']):
        if cc != camp: continue
        s = rowsum(fs)
        secciones.append(f'<div class="set" id="s{abs(hash(aset))}"><h3>{esc(aset)}</h3>'
                         f'<p class="tot">{eur(s["gasto"])} · {n(s["impr"])} impresiones · {n(s["clics"])} clics · <b>{n(s["leads"])} leads</b> · {n(s["cual"])} cualificados · {n(s["registro"])} registros · {n(s["tienda_sol"])} con tienda solicitada</p>')
        for f in sorted(fs, key=lambda f: -f['gasto']):
            cpl = f' · CPL {eur(f["gasto"] / f["leads"])}' if f['leads'] else ''
            utm = ' / '.join(x or '–' for x in f['utm']) if f['utm'] else 'sin enlace a landing'
            secciones.append(f'<div class="ad"><div class="ad__img">{img(f["creative"])}</div><div class="ad__body"><h4>{esc(f["name"])}</h4>'
                             f'<p class="sub">{eur(f["gasto"])}{cpl} · CTR {pct(f["clics"], f["impr"])} · {esc(utm)}</p>{mini(f)}</div></div>')
        secciones.append('</div>')
    secciones.append('</section>')

huerf_rows = ''.join(f'<tr><td>{esc(" / ".join(x or "–" for x in k))}</td><td class="n">{v}</td></tr>' for k, v in huerf_tab.most_common())

# respuesta
resp_rows = []
for r, L in sorted(por_resp.items(), key=lambda x: -len(x[1])):
    ll = [l for l in L if l['llamadas']]; hb = [l for l in L if l['hablo']]
    resp_rows.append(f'<tr><td>{esc(r)}</td><td class="n">{len(L)}</td><td class="n">{len(ll)} ({pct0(len(ll), len(L))})</td>'
                     f'<td class="n">{len(hb)} ({pct0(len(hb), len(ll))})</td><td class="n">{sum(l["stage"] == "LEAD FRIO" for l in L)}</td></tr>')
ORD = ['Leads Landings', 'Contacto inicial', 'Lead frío', 'Videollamada agendada', 'Negociación', 'Tomar decisión', 'Logrado', 'No cualificado', 'Ventas perdidos']
coh_rows = []
for w in sorted(coh):
    c = coh[w]; t = sum(c.values())
    if w < datetime.date(2026, 10, 19): continue
    av = sum(c[s] for s in AVANZA)
    coh_rows.append(f'<tr><td>Semana del {w.day}/{w.month}</td><td class="n">{t}</td><td class="n">{c["Contacto inicial"] + c["Leads Landings"]} ({pct0(c["Contacto inicial"] + c["Leads Landings"], t)})</td>'
                    f'<td class="n">{c["Lead frío"]} ({pct0(c["Lead frío"], t)})</td><td class="n">{av} ({pct0(av, t)})</td>'
                    f'<td class="n">{c["No cualificado"]} ({pct0(c["No cualificado"], t)})</td><td class="n">{c["Ventas perdidos"]}</td></tr>')
snap_t = sum(snap.values())
snap_html = ''.join(f'<tr><td>{s}</td><td class="n">{snap[s]}</td><td class="n">{pct0(snap[s], snap_t)}</td></tr>' for s in ORD if snap[s])

tareas_txt = Counter()
NO = re.compile(r'sin respuesta|no contesta|no responde|no coge|buz[oó]n|no atiende', re.I)
for l in q:
    for t in l['tareas']:
        tareas_txt['sin respuesta' if NO.search(t) else 'otro resultado'] += 1

st_q_html = ''.join(f'<tr><td>{esc(s or "–")}</td><td class="n">{v}</td><td class="n">{pct0(v, len(q))}</td></tr>' for s, v in st_q.most_common())

base_rows = [
    ('CTR al enlace (anuncios activos)', pct(TOT['clics'], TOT['impr'])),
    ('Clic → visita a la landing', pct(TOT['lpv'], TOT['clics'])),
    ('Empiezan formulario → envían datos (píxel)', pct(474, 1101)),
    ('Coste por lead (anuncios activos)', eur(TOT['gasto'] / TOT['leads']) if TOT['leads'] else '–'),
    ('Leads cualificados / leads', pct(ALL['cual'], ALL['leads'])),
    ('Leads → registro nuevo', pct(ALL['registro'], ALL['leads'])),
    ('Registro → tienda solicitada', pct(ALL['tienda_sol'], ALL['registro'] + ALL['previo'])),
    ('Cualificados con al menos una llamada', pct(len(llamados), len(q))),
    ('Llamados que contestan', pct(len(hablaron), len(llamados))),
    ('Horas hasta la primera llamada (mediana)', f'{med:.0f} h' if med is not None else '–'),
    ('Cualificados en Lead frío', pct(st_q.get('LEAD FRIO', 0), len(q))),
    ('Campañas Ads en Lead frío (todo el histórico)', pct(snap['Lead frío'], snap_t)),
]
base_html = ''.join(f'<tr><td>{a}</td><td class="n"><b>{b}</b></td><td class="n vacio">—</td></tr>' for a, b in base_rows)


def fa(nombre):
    return next((f for f in filas if f['name'].startswith(nombre)), None)
pp = fa('ESTATICA / PAGINA DE PAGO / LATAM / 16112026'); b5 = fa('B-05'); pj = fa('REEL PODCAST JUANEN')
andv = sum(f['lpv'] for f in filas if f['adset'].startswith('ANDORRA')); andl = sum(f['leads'] for f in filas if f['adset'].startswith('ANDORRA'))
cero = [f for f in filas if f['leads'] == 0]
HALL = [
 f'<b>La mayor fuga está dentro de la landing.</b> De cada 100 personas que empiezan el formulario, solo {100*474/1101:.0f} terminan de dejar sus datos. Casi todos se van en el paso del email y el teléfono.',
 f'<b>Del anuncio a la landing el camino funciona.</b> CTR del {pct(TOT["clics"], TOT["impr"])} y el {pct(TOT["lpv"], TOT["clics"])} de los clics llega a cargar la página. El {pct(TOT["leads"], TOT["lpv"])} de las visitas acaba siendo lead.',
 f'<b>Un anuncio con 36 € trae más que el resto junto.</b> «Página de pago LATAM» ({esc(pp["adset"].split(" / ")[0])}): {pp["leads"]} leads, {pp["registro"]} registros y {pp["tienda_sol"]} tiendas solicitadas con {eur(pp["gasto"])}. Conviene vigilarlo, porque {pp["leads"] - pp["cual"]} de esos leads no cualifican.',
 f'<b>Andorra no convierte en la landing.</b> {andv} visitas y solo {andl} leads ({pct(andl, andv)}), frente al {pct(TOT["leads"], TOT["lpv"])} de media.',
 f'<b>Los dos anuncios que más gastan no llegan a tienda.</b> «B-05 Mecanismo» gastó {eur(b5["gasto"])} ({pct(b5["gasto"], TOT["gasto"])} del total) para {b5["leads"]} leads y {b5["tienda_sol"]} tiendas. «Podcast Juanen» gastó {eur(pj["gasto"])} para {pj["leads"]} leads y {pj["tienda_sol"]} tiendas.',
 f'<b>{len(cero)} de los 82 anuncios activos no han traído ningún lead</b> en la semana. Entre todos suman {eur(sum(f["gasto"] for f in cero))}.',
 f'<b>Casi la mitad de los leads se registra, pero pocos piden tienda.</b> {ALL["registro"]} de {ALL["leads"]} se registran en Kunfupay, {ALL["tienda_sol"]} solicitan tienda y {ALL["tienda_ok"]} la tienen aprobada.',
 f'<b>Al teléfono llegamos tarde y contestan poco.</b> De {len(q)} cualificados, {len(llamados)} tienen alguna llamada registrada. {len(conectan)} descolgaron y solo {len(hablaron)} hablaron más de 30 segundos. La primera llamada tarda unas {med:.0f} horas en mediana, y {st_q.get("LEAD FRIO", 0)} ya están en Lead frío.',
]
hall_html = ''.join(f'<li>{h}</li>' for h in HALL)

tpl = open(B + 'scripts/funnel_plantilla.html').read()
out = (tpl.replace('{{KPIS}}', kpi_html).replace('{{HALLAZGOS}}', hall_html).replace('{{F_TOP}}', f_top).replace('{{F_PIX}}', f_pix).replace('{{F_PIX2}}', f_pix2)
       .replace('{{F_KM}}', f_km).replace('{{TABLA}}', ''.join(tabla)).replace('{{SECCIONES}}', ''.join(secciones))
       .replace('{{HUERF}}', huerf_rows).replace('{{N_HUERF}}', str(len(huerf))).replace('{{N_SINUTM}}', str(len(sin_utm)))
       .replace('{{RESP}}', ''.join(resp_rows)).replace('{{COH}}', ''.join(coh_rows)).replace('{{SNAP}}', snap_html)
       .replace('{{STQ}}', st_q_html).replace('{{BASE}}', base_html)
       .replace('{{NQ}}', str(len(q))).replace('{{NLL}}', str(len(llamados))).replace('{{NHB}}', str(len(hablaron))).replace('{{NCON}}', str(len(conectan)))
       .replace('{{MED}}', f'{med:.0f}' if med is not None else '–').replace('{{SNAPT}}', str(snap_t))
       .replace('{{TAREAS_NO}}', str(tareas_txt['sin respuesta'])).replace('{{TAREAS_T}}', str(sum(tareas_txt.values())))
       .replace('{{FRIO_Q}}', str(st_q.get('LEAD FRIO', 0))).replace('{{PREVIO}}', str(ALL['previo'])))
open(F + 'funnel-base.html', 'w').write(out)

print('TOT', TOT); print('ALL', ALL); print('huerf', len(huerf), 'sin_utm', len(sin_utm), 'meta', len(meta))
print('conectan', len(conectan), 'intentos', sum(l['llamadas'] for l in q), 'previos', [l['id'] for l in meta if l['previo']]); print('q', len(q), 'llamados', len(llamados), 'hablaron', len(hablaron), 'med h', med); print(st_q)
print(tareas_txt); print({r: len(L) for r, L in por_resp.items()})
