# Alineación forzada (MMS_FA) del guion correcto sobre la voz cortada de cada versión
# uso: python3 align2.py hook1
import json, os, re, sys, unicodedata
import torch, torchaudio
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from texts import HOOK, BODY
E = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = sys.argv[1]
TEXT = HOOK[V] + ' ' + BODY
PRON = {'classroom': 'clasrum', 'kunfupay': 'kunfupei', 'partnerships': 'partnerchips', 'account': 'acaunt',
        'manager': 'maneyer', 'online': 'onlain', 'vídeo': 'video'}
words = TEXT.split()
def norm(w):
    w = re.sub(r"[^\wáéíóúñü]", "", w.lower()); w = PRON.get(w, w)
    w = unicodedata.normalize('NFD', w); w = ''.join(c for c in w if unicodedata.category(c) != 'Mn')
    return w.replace('ñ', 'n')
bundle = torchaudio.pipelines.MMS_FA
model = bundle.get_model(with_star=False); dic = bundle.get_dict(star=None)
w, sr = torchaudio.load(os.path.join(E, 'base', f'{V}_voice.wav'))
w = torchaudio.functional.resample(w.mean(0, keepdim=True), sr, bundle.sample_rate)
toks = [[dic[c] for c in norm(x) if c in dic] for x in words]
with torch.inference_mode():
    em, _ = model(w); em = torch.log_softmax(em, -1)
al, sc = torchaudio.functional.forced_align(em, torch.tensor([[t for ws in toks for t in ws]], dtype=torch.int32), blank=0)
spans = torchaudio.functional.merge_tokens(al[0], sc[0].exp())
ratio = w.shape[1] / em.shape[1] / bundle.sample_rate
DISP = {'tres': '3', 'mil': 'mil'}
res = []; i = 0
for word, t in zip(words, toks):
    sp = spans[i:i + len(t)]; i += len(t)
    core = word.strip('.,¿?')
    res.append({'w': core, 'raw': word, 's': round(sp[0].start * ratio, 3), 'e': round(sp[-1].end * ratio, 3),
                'c': round(float(sum(s.score for s in sp) / len(sp)), 2)})
# índice donde empieza el cuerpo («Te presento»)
body_start = len(HOOK[V].split())
json.dump({'words': res, 'body_start': body_start}, open(os.path.join(E, 'analysis', f'{V}_aligned.json'), 'w'), ensure_ascii=False, indent=0)
open(os.path.join(E, 'project', f'words_{V}.js'), 'w').write(
    f'window.WORDS_{V.upper()}=' + json.dumps({'w': [{'w': r['w'], 's': r['s'], 'e': r['e']} for r in res], 'b': body_start}, ensure_ascii=False) + ';')
low = [r for r in res if r['c'] < 0.3]
print(V, len(res), 'palabras; cuerpo desde', body_start, res[body_start]['w'], res[body_start]['s'], '| baja confianza:', [(r['w'], r['s'], r['c']) for r in low])
