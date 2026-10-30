# Transcripción con faster-whisper large-v3 (audio en numpy) y marcas por palabra
import sys, json, wave, numpy as np
from faster_whisper import WhisperModel
src, out = sys.argv[1:3]
w = wave.open(src); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
m = WhisperModel('large-v3', device='cpu', compute_type='int8')
segs, info = m.transcribe(a, language='es', word_timestamps=True, beam_size=5, vad_filter=False)
res = []
for s in segs:
    res.append({'s': s.start, 'e': s.end, 't': s.text.strip(), 'w': [{'w': x.word.strip(), 's': round(x.start, 3), 'e': round(x.end, 3)} for x in s.words]})
    print(f'{s.start:6.2f}-{s.end:6.2f} {s.text.strip()}', flush=True)
json.dump(res, open(out, 'w'), ensure_ascii=False, indent=1)
