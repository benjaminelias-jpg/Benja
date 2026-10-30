# Alineación forzada (MMS_FA) del guion corregido sobre la voz ya cortada
# «veintisiete por ciento» se alinea como se dice y se muestra como «27 %»
import json, os, re, unicodedata
import torch, torchaudio
E = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEXT = ("Si vendes cursos de Latinoamérica, como yo, probablemente estés cobrando con Hotmart, Stripe si te hiciste una LLC, "
        "alguna que otra transferencia y déjame decirte que eso no es escalable. Es más, estás perdiendo hasta un veintisiete por ciento "
        "de todas tus conversiones. Tu cliente quiere pagar como paga en su país, pero entra a tu link y no ve su moneda local y él en su "
        "mente quiere comprar, pero jamás te lo dice y lo único que hace es irse. Pero con tu enlace de Kunfupay te paga cualquiera, de "
        "Argentina, España, Estados Unidos, todo con el mismo link. Cada alumno paga como paga en su país y si alguno quiere con cripto, "
        "también puede. Y vos recibís lo que querés, euros, dólares, la moneda que quieras. Los creadores de Latam ya aumentaron hasta un "
        "veintisiete por ciento todas sus conversiones gracias a esto, así que hacé clic en el enlace y mirá cómo funciona.")
PRON = {'hotmart': 'jotmar', 'stripe': 'estraip', 'llc': 'eleelece', 'kunfupay': 'kunfupei', 'link': 'link', 'clic': 'clik'}
words = TEXT.split()
def norm(w):
    w = re.sub(r"[^\wáéíóúñü]", "", w.lower()); w = PRON.get(w, w)
    w = unicodedata.normalize('NFD', w); w = ''.join(c for c in w if unicodedata.category(c) != 'Mn')
    return w.replace('ñ', 'n')
bundle = torchaudio.pipelines.MMS_FA
model = bundle.get_model(with_star=False); dic = bundle.get_dict(star=None)
w, sr = torchaudio.load(os.path.join(E, 'base', 'hub_voice.wav'))
w = torchaudio.functional.resample(w.mean(0, keepdim=True), sr, bundle.sample_rate)
toks = [[dic[c] for c in norm(x) if c in dic] for x in words]
with torch.inference_mode():
    em, _ = model(w); em = torch.log_softmax(em, -1)
al, sc = torchaudio.functional.forced_align(em, torch.tensor([[t for ws in toks for t in ws]], dtype=torch.int32), blank=0)
spans = torchaudio.functional.merge_tokens(al[0], sc[0].exp())
ratio = w.shape[1] / em.shape[1] / bundle.sample_rate
res = []; i = 0
for word, t in zip(words, toks):
    sp = spans[i:i + len(t)]; i += len(t)
    res.append({'w': word.strip('.,¿?'), 'raw': word, 's': round(sp[0].start * ratio, 3), 'e': round(sp[-1].end * ratio, 3),
                'c': round(float(sum(s.score for s in sp) / len(sp)), 2)})
# «veintisiete por ciento» -> «27 %»
out = []; k = 0
while k < len(res):
    if res[k]['w'] == 'veintisiete' and k + 2 < len(res) and res[k + 2]['w'] == 'ciento':
        out.append({'w': '27 %', 'raw': '27 %' + res[k + 2]['raw'][len('ciento'):], 's': res[k]['s'], 'e': res[k + 2]['e'], 'c': res[k]['c']}); k += 3
    else: out.append(res[k]); k += 1
json.dump({'words': out}, open(os.path.join(E, 'analysis', 'hub_aligned.json'), 'w'), ensure_ascii=False, indent=0)
open(os.path.join(E, 'project', 'words.js'), 'w').write('window.WORDS=' + json.dumps([{'w': r['w'], 'raw': r['raw'], 's': r['s'], 'e': r['e']} for r in out], ensure_ascii=False) + ';')
print(len(out), 'palabras | baja confianza:', [(r['w'], r['s'], r['c']) for r in out if r['c'] < 0.3])
for n, r in enumerate(out): print(n, r['w'], r['s'], r['e'], end=' | ')
