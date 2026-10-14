"""Comprueba que el audio del MP4 final está sincronizado con la imagen.

1. Desfase global: correlaciona el audio del MP4 con la mezcla original (build/audio/audio.wav).
   Detecta retrasos introducidos al codificar o multiplexar (debe ser ~0).
2. Por evento: compara el fotograma de cada señal con el instante en que mezcla_audio.py colocó
   el punto clave del sonido (ataque del hit, pico del foley, final del riser), más el desfase global.
   Tolerancia: de −0,5 a +1,5 fotogramas (el sonido nunca debe adelantarse a la imagen).

Uso: python3 verificar_sync.py <video.mp4> <proyecto> [carpeta_build]
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
video, project = sys.argv[1], Path(sys.argv[2])
build = Path(sys.argv[3]) if len(sys.argv) > 3 else project / "build"
place = json.loads((build / "audio" / "colocacion.json").read_text())
fps = place["fps"]

raw = subprocess.run(["ffmpeg", "-v", "error", "-i", video, "-vn", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
                     capture_output=True, check=True).stdout
got = np.frombuffer(raw, dtype=np.float32)
sr, ref = wavfile.read(build / "audio" / "audio.wav")
ref = ref.mean(axis=1) if ref.ndim > 1 else ref
n = min(len(got), len(ref))
max_lag = int(0.2 * SR)
corr = signal.correlate(got[:n], ref[:n], mode="full", method="fft")
mid = n - 1
lag = int(np.argmax(corr[mid - max_lag: mid + max_lag + 1])) - max_lag
off_f = lag / SR * fps
print(f"Desfase global MP4 frente a la mezcla: {lag / SR * 1000:+.1f} ms ({off_f:+.2f} fotogramas)")

ok = abs(off_f) <= 1.0
print(f"{'evento':22s} {'señal':>7s} {'suena':>9s} {'desfase':>8s}")
for e in place["eventos"]:
    t = e["ancla_s"] * fps + off_f
    d = t - e["f"]
    flag = "OK" if -0.5 <= d <= 1.5 else "REVISAR"
    ok &= flag == "OK"
    print(f"{e['tipo']:22s} {'f' + str(e['f']):>7s} {'f%.2f' % t:>9s} {d:+8.2f}  {flag}")

loud = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", video, "-af", "ebur128=peak=true", "-f", "null", "-"],
                      capture_output=True, text=True).stderr
for line in loud.splitlines()[-12:]:
    if line.strip().startswith(("I:", "Peak:")):
        print(line.strip())
sys.exit(0 if ok else 1)
