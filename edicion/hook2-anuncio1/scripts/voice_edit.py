"""Monta la pista de voz con los mismos cortes que el vídeo (segmentos de audio de timeline.json).
Los cortes caen en silencio real; cada unión lleva fundidos de 6 ms para que no haya clics.
Uso: voice_edit.py audio48k.wav timeline.json voice_edit.wav"""
import json, sys
import numpy as np, soundfile as sf

src, sr = sf.read(sys.argv[1], dtype="float64")
src = src.mean(axis=1) if src.ndim > 1 else src
tl = json.load(open(sys.argv[2]))
total = int(round(tl["duration"] * sr))
out = np.zeros(total)
fade = int(0.006 * sr)
for s in tl["audio_segments"]:
    a = int(round(s["src_start"] * sr))
    o0, o1 = int(round(s["out_start"] * sr)), int(round(s["out_end"] * sr))
    n = min(o1 - o0, len(src) - a)
    chunk = src[a:a + n].copy()
    ramp = np.linspace(0, 1, fade)
    chunk[:fade] *= ramp
    chunk[-fade:] *= ramp[::-1]
    out[o0:o0 + n] += chunk
sf.write(sys.argv[3], out, sr, subtype="PCM_24")
print(f"voz editada {total / sr:.2f} s → {sys.argv[3]}")
