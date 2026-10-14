"""Mezcla de audio sincronizada al fotograma a partir de las señales de la composición.

Lee <proyecto>/build_info.json (lo escribe render.cjs: fps, fotogramas y señales) y
<proyecto>/audio.json (qué archivo y a qué nivel suena cada tipo de señal).

Anclajes (qué instante del sonido cae en el fotograma de la señal):
  riser_*   → su final (el riser se corta justo en el hit)
  hit_*     → el pico del ataque (no el máximo global: la cola puede ser igual de alta)
  whoosh*   → su pico (el aire suena más fuerte en el momento de máxima velocidad)
  foley     → su pico (el contacto del objeto con la superficie)

Rutas en audio.json: relativas al proyecto, absolutas o "@skill/..." (dentro de la skill).

Uso: python3 mezcla_audio.py <proyecto> <carpeta_salida>
"""
import json
import subprocess
import sys
from itertools import cycle
from pathlib import Path

import numpy as np
from scipy import signal
from scipy.io import wavfile
from scipy.ndimage import maximum_filter1d

SR = 48000
SKILL = Path(__file__).resolve().parent.parent
project, out = Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve()
out.mkdir(parents=True, exist_ok=True)
info = json.loads((project / "build_info.json").read_text())
cfg = json.loads((project / "audio.json").read_text())
FPS, N = info["fps"], int(round(info["frames"] / info["fps"] * SR))


def resolve(p):
    if p.startswith("@skill/"):
        return SKILL / p[len("@skill/"):]
    q = Path(p)
    return q if q.is_absolute() else project / q


_cache = {}


def load(p):
    if p not in _cache:
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(resolve(p)), "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"],
                             capture_output=True, check=True).stdout
        _cache[p] = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).astype(np.float64)
    return _cache[p]


def db(x):
    return 10 ** (x / 20)


def fades(x, fin=0.0, fout=0.0):
    x = x.copy()
    if fin:
        n = min(len(x), int(fin * SR)); x[:n] *= np.sin(np.linspace(0, np.pi / 2, n))[:, None] ** 2
    if fout:
        n = min(len(x), int(fout * SR)); x[-n:] *= np.cos(np.linspace(0, np.pi / 2, n))[:, None] ** 2
    return x


def anchor(x, kind):
    a = np.abs(x).max(axis=1)
    if kind.startswith("riser"):
        return np.max(np.nonzero(a > 0.02 * a.max())[0]) / SR
    if kind.startswith("hit"):
        return np.argmax(a[: int(0.015 * SR)]) / SR if a[: int(0.015 * SR)].max() > 0.6 * a.max() else np.argmax(a) / SR
    return np.argmax(a) / SR


tracks = {k: np.zeros((N, 2)) for k in ["risers", "hits", "hushes", "foley", "musica"]}
report = []
pools = {k: cycle(v if isinstance(v, list) else [v]) for k, v in cfg.get("sonidos", {}).items()}


def place(track, x, start_s):
    i0 = int(round(start_s * SR))
    a, b = max(0, i0), min(N, i0 + len(x))
    if b > a:
        tracks[track][a:b] += x[a - i0:b - i0]


for cue in sorted(info["cues"], key=lambda c: c["f"]):
    kind, t_cue = cue["type"], cue["f"] / FPS
    if kind == "foley":
        spec = cfg.get("foley", {}).get(cue.get("name"))
        if not spec:
            print(f"AVISO: no hay foley '{cue.get('name')}' en audio.json; se omite")
            continue
        x = load(spec["archivo"])
        rec = spec.get("recorte") or [0, None]
        r0, r1 = rec[0], (rec[1] if len(rec) > 1 else None)
        x = x[int((r0 or 0) * SR):(int(r1 * SR) if r1 else None)]
        x = fades(x, fin=0.004 if r0 else 0, fout=0.03)
        level, track, offset = spec.get("nivel", -17), "foley", 0.005
    else:
        if kind not in pools:
            print(f"AVISO: no hay sonido para '{kind}' en audio.json; se omite")
            continue
        x = load(next(pools[kind]))
        if kind.startswith("riser"):
            end = anchor(x, kind)
            x = fades(x[: int(end * SR) + 1], fout=0.004)
        level = cfg.get("niveles", {}).get(kind, -17)
        track = "risers" if kind.startswith("riser") else "hits" if kind.startswith("hit") else "hushes"
        offset = 0.003 if kind.startswith("hit") else 0.0
    x = x * db(level) / np.max(np.abs(x))
    at = t_cue + offset - anchor(x, kind)
    place(track, x, at)
    report.append((cue["f"], kind if kind != "foley" else f"foley:{cue['name']}", level))

# Un riser que empieza antes de t = 0 entraría a media subida: fundido de entrada con la imagen
n_in = int(0.35 * SR)
tracks["risers"][:n_in] *= (np.sin(np.linspace(0, np.pi / 2, n_in)) ** 2)[:, None]

# Música: medios recortados (1–4 kHz) para dejar sitio a una voz, compresión suave 3:1
m = cfg.get("musica")
if m:
    x = load(m["archivo"])[:N]
    if m.get("recortar_medios", True):
        mids = np.stack([signal.sosfiltfilt(signal.butter(2, [1000, 4000], "band", fs=SR, output="sos"), x[:, c]) for c in range(2)], axis=1)
        x = x - 0.45 * mids
    env = maximum_filter1d(np.abs(x).max(axis=1), size=int(0.01 * SR))
    env = signal.lfilter([1 - np.exp(-1 / (0.15 * SR))], [1, -np.exp(-1 / (0.15 * SR))], env)
    thr = 0.25 * env.max()
    x = x * np.where(env > thr, (thr / np.maximum(env, 1e-9)) ** (2 / 3), 1.0)[:, None]
    x = np.vstack([x, np.zeros((max(0, N - len(x)), 2))])[:N]
    x = fades(x, fin=1.5, fout=1.2)
    tracks["musica"] = x * db(m.get("nivel", -22)) / np.max(np.abs(x))

mix = sum(tracks.values())
gain_db = cfg.get("master", -3) - 20 * np.log10(np.max(np.abs(mix)))
master = (mix * db(gain_db)).astype(np.float32)
wavfile.write(out / "audio.wav", SR, master)
for k, v in tracks.items():
    if np.any(v):
        wavfile.write(out / f"stem_{k}.wav", SR, (v * db(gain_db)).astype(np.float32))

print(f"Audio: {N / SR:.2f} s, master {gain_db:+.1f} dB → pico {20 * np.log10(np.max(np.abs(master))):.1f} dBFS")
for f, kind, level in report:
    print(f"  f{f:4d}  {f / FPS:6.2f} s  {kind:22s} {level} dBFS")
