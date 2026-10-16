# Alineación forzada (MMS_FA de torchaudio) del texto correcto sobre la voz cortada
import torch, torchaudio, json, sys, unicodedata, re
wav, out = sys.argv[1], sys.argv[2]
TEXT = ("Estamos buscando a creadores de contenido que facturen más de tres mil euros "
        "para ayudarlos a escalar con nuestro programa Classroom Platinum. "
        "Nuestro playbook ya ha sido validado por más de cien creadores de contenido "
        "y todos los miembros tienen acceso a nuestro equipo de lanzamientos especializado, "
        "a toda la tecnología de Kunfupay y a financiación de sus campañas de marketing. "
        "Y muy importante, el programa Classroom Platinum es solamente para infoproductores "
        "que venden acceso a comunidades, cursos, coaching o servicios y productos digitales similares "
        "que ya tienen un producto funcionando y vendiendo por lo menos tres mil euros al mes. "
        "Así que ya sabes, si te interesa Classroom Platinum y cumples las condiciones, aplica aquí abajo.")
# pronunciación aproximada para el modelo (romanizado)
PRON = {'classroom':'clasrum','platinum':'platinum','playbook':'pleibuk','kunfupay':'kunfupei','marketing':'marketin','coaching':'couchin'}
words = TEXT.split()
def norm(w):
    w = re.sub(r"[^\wáéíóúñü]", "", w.lower())
    w = PRON.get(w, w)
    w = unicodedata.normalize('NFD', w); w = ''.join(c for c in w if unicodedata.category(c) != 'Mn')
    return w.replace('ñ','n')
bundle = torchaudio.pipelines.MMS_FA
model = bundle.get_model(with_star=False); dic = bundle.get_dict(star=None)
w, sr = torchaudio.load(wav)
w = torchaudio.functional.resample(w.mean(0, keepdim=True), sr, bundle.sample_rate)
toks = [[dic[c] for c in norm(x) if c in dic] for x in words]
with torch.inference_mode():
    em, _ = model(w)
    em = torch.log_softmax(em, -1)
flat = [t for ws in toks for t in ws]
al, sc = torchaudio.functional.forced_align(em, torch.tensor([flat], dtype=torch.int32), blank=0)
spans = torchaudio.functional.merge_tokens(al[0], sc[0].exp())
ratio = w.shape[1] / em.shape[1] / bundle.sample_rate
res = []; i = 0
for word, t in zip(words, toks):
    sp = spans[i:i+len(t)]; i += len(t)
    res.append({'w': word, 's': round(sp[0].start*ratio, 3), 'e': round(sp[-1].end*ratio, 3),
                'conf': round(float(sum(s.score for s in sp)/len(sp)), 2)})
json.dump(res, open(out, 'w'), ensure_ascii=False, indent=0)
print(' '.join(f"{r['w']}[{r['s']:.2f}-{r['e']:.2f}|{r['conf']}]" for r in res))
