# Alineación forzada (MMS_FA) del guion sobre la voz del video; salida: analysis/aligned.json + project/words.js
import json, os, re, unicodedata
import torch, torchaudio
E = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEXT = ("Quiero mi dinero. ¿Otra vez? ¿Ya te pagué el mes pasado? Sí, pero es que son todos los meses. Dios, 200 dólares. Por enviar un puto PDF. Venga, rapidito. "
        "A ver amigos, entendamos una cosa. No estás pagando por un bot. Estás pagando literalmente por un cartero. Esto es lo que hace tu automatización en verdad. "
        "Entre una palabra, mando mensaje. Entre otra palabra, mando otro mensaje. Y eso es todo. No califica, no decide, no vende. Lleva un mensaje de una puerta a la otra. "
        "Y lo estás pagando todos los meses como si fuese un equipo de ventas. Eso hoy es gratis con Autodm. Conectás tu cuenta, elegís la palabra. Y tenés la automatización lista. "
        "Cero por mes y sin una prueba gratuita. Lo tenés gratis para siempre. Comenta la palabra money. Y te voy a enviar la aplicación cien por cien gratis. En menos de un minuto.")
PRON = {'200': 'doscientos', 'autodm': 'autodiem', 'money': 'mani', 'pdf': 'pedeefe'}
words = TEXT.split()
def norm(w):
    w = re.sub(r"[^\wáéíóúñü]", "", w.lower()); w = PRON.get(w, w)
    w = unicodedata.normalize('NFD', w); w = ''.join(c for c in w if unicodedata.category(c) != 'Mn')
    return w.replace('ñ', 'n')
bundle = torchaudio.pipelines.MMS_FA
model = bundle.get_model(with_star=False); dic = bundle.get_dict(star=None)
import wave, numpy as np
wv = wave.open(os.path.join(E, 'analysis', 'voice16k.wav')); a = np.frombuffer(wv.readframes(wv.getnframes()), np.int16).astype(np.float32) / 32768
w = torch.from_numpy(a)[None]
toks = [[dic[c] for c in norm(x) if c in dic] for x in words]
with torch.inference_mode():
    em, _ = model(w); em = torch.log_softmax(em, -1)
al, sc = torchaudio.functional.forced_align(em, torch.tensor([[t for ws in toks for t in ws]], dtype=torch.int32), blank=0)
spans = torchaudio.functional.merge_tokens(al[0], sc[0].exp())
ratio = w.shape[1] / em.shape[1] / bundle.sample_rate
res = []; i = 0
for word, t in zip(words, toks):
    sp = spans[i:i + len(t)]; i += len(t)
    res.append({'w': word.strip('.,¿?'), 'raw': word, 's': round(sp[0].start * ratio, 3), 'e': round(sp[-1].end * ratio, 3), 'c': round(float(sum(s.score for s in sp) / len(sp)), 2)})
json.dump({'words': res}, open(os.path.join(E, 'analysis', 'aligned.json'), 'w'), ensure_ascii=False, indent=0)
open(os.path.join(E, 'project', 'words.js'), 'w').write('window.WORDS=' + json.dumps([{'w': r['w'], 's': r['s'], 'e': r['e']} for r in res], ensure_ascii=False) + ';')
for n, r in enumerate(res):
    if 9.4 < r['s'] < 25 or r['s'] > 38: print(n, r['w'], r['s'], r['e'], r['c'], end=' | ')
