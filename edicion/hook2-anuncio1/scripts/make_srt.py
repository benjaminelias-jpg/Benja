"""Genera el .srt a partir de los mismos grupos de 2–4 palabras de la pantalla (incluye también las frases
que en el vídeo lleva la tipografía grande). Uso: make_srt.py meta.json salida.srt"""
import json, sys
meta = json.load(open(sys.argv[1]))
def ts(t):
    t = max(0.0, t); ms = int(round(t * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"
lines = []
for k, g in enumerate(meta["srt"], 1):
    text = g["text"].replace(" ,", ",")
    lines += [str(k), f"{ts(g['s'])} --> {ts(g['e'])}", text, ""]
open(sys.argv[2], "w", encoding="utf-8").write("\n".join(lines))
print(f"{len(meta['srt'])} subtítulos → {sys.argv[2]}")
