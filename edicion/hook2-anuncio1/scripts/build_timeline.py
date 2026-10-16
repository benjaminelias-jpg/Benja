"""Construye la línea de tiempo del corte a partir del EDL de segmentos (frames de la fuente)
y de las palabras alineadas (alineamiento forzado MMS). Salida: timeline.json en tiempo de salida."""
import json, sys

FPS = 30
# Segmentos de vídeo/audio en frames de la fuente [inicio, fin) — cortes elegidos en silencio real.
SEGMENTS = [
    (0, 112),      # Hook: "Tú pones los cursos, nosotros ponemos el presupuesto." (se quita la respiración 3.73-4.03)
    (120, 255),    # "Si eres un creador de contenido que ya vende más de 13.000 € al mes y quiere vender más,"
    (328, 524),    # (fuera: "quédate en este vídeo y te contamos cómo conseguirlo") "Te presento Classroom Platinum…"
    (530, 1092),   # "Te apoyamos con equipo…" … "qué vendes, a cuánto, a quién," (pausa 17.47-17.67 fuera)
    (1153, 1748),  # (fuera: "y aclaro, que sea un negocio digital") "Segundo, agendamos…" … "arriesgar"
    (1757, 2198),  # "tu dinero. Es decir, solo ganamos si tú ganas." … "más de 3.000 euros." (pausa 58.27-58.57 fuera)
    (2206, 2278),  # "Si eres uno de estos, clic aquí abajo." (pausa 73.27-73.53 fuera)
]
HOLD_FRAMES = 24   # congelado final bajo el CTA (0,8 s) para que respire la música
# Adelanto de audio (s) por segmento: el audio entra unos ms antes que la imagen (micro J-cut)
AUDIO_LEAD = {2: 0.015}   # "Te presento": la oclusión de la /t/ empieza antes del cambio de plano
# Arranques de palabra corregidos con la energía de la señal (el alineador se confunde en fronteras de bloque)
ONSET_FIX = {("te", 48.71): 49.29, ("Es", 58.85): 59.20}   # (palabra, inicio del alineador) -> inicio real

def main(words_path, out_path):
    words = json.load(open(words_path))
    # mapa frame de salida -> frame fuente
    frame_map, seg_out = [], []
    for (a, b) in SEGMENTS:
        seg_out.append({"src": [a, b], "out": [len(frame_map), len(frame_map) + (b - a)]})
        frame_map.extend(range(a, b))
    frame_map.extend([SEGMENTS[-1][1] - 1] * HOLD_FRAMES)
    total = len(frame_map)

    # segmentos de audio (con adelanto opcional), continuos en la salida
    audio_segs = []
    for k, s in enumerate(seg_out):
        lead, lead_next = AUDIO_LEAD.get(k, 0.0), AUDIO_LEAD.get(k + 1, 0.0)
        a, b = s["src"]
        audio_segs.append({"src_start": a / FPS - lead, "out_start": s["out"][0] / FPS - lead,
                           "out_end": s["out"][1] / FPS - lead_next})

    def to_out(t, tol=0.05):
        for s in audio_segs:
            dur = s["out_end"] - s["out_start"]
            rel = t - s["src_start"]
            if -tol <= rel < dur:
                return s["out_start"] + max(rel, 0.0)
        return None

    out_words, prev_end = [], -1
    for i, w in enumerate(words):
        s_src, e_src = w["s"], w["e"]
        for (txt, approx), fix in ONSET_FIX.items():
            if w["w"].strip(",.¿?") == txt and abs(approx - s_src) < 0.05:
                s_src = fix
        # corrige solapes de frontera de bloque del alineador
        s_src = max(s_src, prev_end + 0.01) if prev_end > 0 else s_src
        prev_end = max(prev_end, e_src)
        so, eo = to_out(s_src), to_out(min(e_src, s_src + 1.2))
        if so is None:
            continue
        if eo is None:
            eo = so + 0.15
        out_words.append({"i": len(out_words), "w": w["w"], "s": round(so, 3), "e": round(max(eo, so + 0.06), 3),
                          "src_s": round(s_src, 3)})
    # intervalos de voz (para ducking): palabras unidas si el hueco < 0.35 s
    speech = []
    for w in out_words:
        if speech and w["s"] - speech[-1][1] < 0.35:
            speech[-1][1] = w["e"]
        else:
            speech.append([w["s"], w["e"]])
    json.dump({"fps": FPS, "frames": total, "duration": total / FPS, "segments": seg_out,
               "frame_map": frame_map, "audio_segments": audio_segs, "words": out_words, "speech": speech}, open(out_path, "w"),
              ensure_ascii=False)
    # copia para la página de motion graphics (file:// no permite fetch de JSON)
    if len(sys.argv) > 3:
        open(sys.argv[3], "w").write("window.__TIMELINE = " + open(out_path).read() + ";\n")
    print(f"frames {total}  duración {total / FPS:.2f} s  palabras {len(out_words)}")
    for s in seg_out:
        print("  seg", s)
    for w in out_words:
        print(f'  [{w["i"]:3d}] {w["s"]:6.2f}-{w["e"]:6.2f} {w["w"]}')

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])  # build_timeline.py words_aligned.json timeline.json [mg/data/timeline.js]
