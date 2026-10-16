# Forced alignment of the Whisper transcript with torchaudio MMS_FA -> accurate word timings
import json, sys, re, unicodedata
import torch, torchaudio, soundfile as sf
from torchaudio.pipelines import MMS_FA as bundle

wav, sr = sf.read(sys.argv[1], dtype="float32")
assert sr == 16000
tr = json.load(open(sys.argv[2]))
SPOKEN = {"13.000": "trece mil", "3.000": "tres mil", "classroom": "clasrum", "platinum": "platinum",
          "partnerships": "partnersips", "kung": "kun", "fu": "fu", "pay": "pei", "account": "acaunt",
          "manager": "manayer", "vídeo": "video"}
def norm(w):
    raw = w.strip()
    key = raw.strip(",.¿?¡!").lower()
    if key in SPOKEN: s = SPOKEN[key]
    else:
        s = unicodedata.normalize("NFD", key)
        s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = re.sub(r"[^a-z' ]", "", s.replace("ñ", "n"))
    return s.split()

model = bundle.get_model(); tok = bundle.get_tokenizer(); aligner = bundle.get_aligner()
# merge whisper words (e.g. "13" + ".000")
words = []
for seg in tr:
    for w in seg["words"]:
        if words and re.fullmatch(r"\.\d{3}", w["w"].strip()):
            words[-1]["w"] += w["w"].strip(); words[-1]["e"] = w["e"]
        else:
            words.append(dict(w))
# chunk by whisper segments with padding
out = []
seg_bounds = [(s["start"], s["end"]) for s in tr]
wi = 0
for (a, b) in seg_bounds:
    chunk_words = []
    while wi < len(words) and words[wi]["s"] < b - 0.01:
        chunk_words.append(words[wi]); wi += 1
    if not chunk_words: continue
    pa, pb = max(0, a - 0.35), min(len(wav)/sr, b + 0.35)
    audio = torch.from_numpy(wav[int(pa*sr):int(pb*sr)]).unsqueeze(0)
    with torch.inference_mode():
        em, _ = model(audio)
    # each display word may map to several spoken tokens
    toks, owner = [], []
    for k, w in enumerate(chunk_words):
        for t in norm(w["w"]):
            toks.append(t); owner.append(k)
    spans = aligner(em[0], tok(toks))
    ratio = audio.size(1) / em.size(1) / sr
    times = {}
    for t_idx, sp in enumerate(spans):
        k = owner[t_idx]
        s0 = pa + sp[0].start * ratio; e0 = pa + sp[-1].end * ratio
        if k in times: times[k] = (times[k][0], e0)
        else: times[k] = (s0, e0)
    for k, w in enumerate(chunk_words):
        s0, e0 = times[k]
        out.append({"w": w["w"].strip(), "s": round(s0, 3), "e": round(e0, 3), "ws": w["s"], "we": w["e"]})
json.dump(out, open(sys.argv[3], "w"), ensure_ascii=False, indent=0)
for o in out:
    print(f'{o["s"]:7.3f} {o["e"]:7.3f}  (wh {o["ws"]:6.2f} {o["we"]:6.2f})  {o["w"]}')
