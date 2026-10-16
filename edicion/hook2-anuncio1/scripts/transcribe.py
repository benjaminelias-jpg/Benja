# Transcripción palabra a palabra con Whisper large-v3 (faster-whisper, CPU int8). Uso: transcribe.py audio16k.wav transcript.json
import sys, json
from faster_whisper import WhisperModel
audio, out = sys.argv[1], sys.argv[2]
model = WhisperModel("large-v3", device="cpu", compute_type="int8", cpu_threads=4)
import soundfile as sf, numpy as np
wav, sr = sf.read(audio, dtype="float32")
assert sr == 16000
segments, info = model.transcribe(wav, language="es", word_timestamps=True, vad_filter=False, beam_size=5,
                                  condition_on_previous_text=False, initial_prompt="Kunfupay. Hola, ¿qué tal?")
res = []
for s in segments:
    res.append({"start": s.start, "end": s.end, "text": s.text,
                "words": [{"w": w.word, "s": w.start, "e": w.end, "p": w.probability} for w in s.words]})
    print(f"[{s.start:6.2f}-{s.end:6.2f}] {s.text}", flush=True)
json.dump(res, open(out, "w"), ensure_ascii=False, indent=1)
