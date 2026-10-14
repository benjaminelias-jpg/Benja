"""Mezcla de audio de "Así cobras con Kunfupay" (21,67 s, 48 kHz, estéreo).

Efectos reales generados con IA (ElevenLabs, vía Magnific) y música (Lyria),
colocados al fotograma. Cada pista se normaliza a su nivel de pico (sección 4.2
de la skill) y el master a −3 dBFS.

Uso: python3 audio.py <carpeta_salida>
"""
import subprocess
import sys
from pathlib import Path

import numpy as np
from scipy import signal
from scipy.ndimage import maximum_filter1d
from scipy.io import wavfile

SR, FPS = 48000, 30
N = int(round(650 / FPS * SR))
A = Path(__file__).parent / "assets" / "audio"
out = Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)


def load(name):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(A / f"{name}.mp3"), "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).astype(np.float64)


def db(x):
    return 10 ** (x / 20)


def peak_to(x, level_db):
    return x * db(level_db) / np.max(np.abs(x))


def fades(x, fin=0.0, fout=0.0):
    x = x.copy()
    if fin:
        n = int(fin * SR); x[:n] *= np.sin(np.linspace(0, np.pi / 2, n))[:, None] ** 2
    if fout:
        n = int(fout * SR); x[-n:] *= np.cos(np.linspace(0, np.pi / 2, n))[:, None] ** 2
    return x


def clip(x, start_s=0.0, end_s=None):
    return x[int(start_s * SR):(int(end_s * SR) if end_s else None)]


def place(track, x, at_s):
    i0 = int(round(at_s * SR))
    a, b = max(0, i0), min(N, i0 + len(x))
    if b > a:
        track[a:b] += x[a - i0:b - i0]


def peak_time(x):
    return np.argmax(np.abs(x).max(axis=1)) / SR


tracks = {k: np.zeros((N, 2)) for k in ["risers", "hits", "hushes", "foley", "musica"]}
events = []


def add(track, x, level_db, align_s, anchor_s, label):
    """Coloca x de modo que su instante anchor_s caiga en align_s."""
    x = peak_to(x, level_db)
    place(tracks[track], x, align_s - anchor_s)
    events.append((label, align_s))


f = lambda n: n / FPS

# Intro: riser que se corta en el hit del título (f30)
riser_i = load("riser_intro")
end_i = np.max(np.nonzero(np.abs(riser_i).max(axis=1) > 0.02)[0]) / SR
add("risers", fades(clip(riser_i, 0, end_i), fout=0.004), -15, f(30), end_i, "riser intro → f30")
n_in = int(0.35 * SR)  # el riser empieza a media subida en t = 0: fundido de entrada con la imagen
tracks["risers"][:n_in] *= (np.sin(np.linspace(0, np.pi / 2, n_in)) ** 2)[:, None]
hit_a = load("hit_a"); hit_b = load("hit_b")
add("hits", hit_a, -12, f(30) + 0.003, peak_time(hit_a), "hit título f30")

# Hushes: el pico cae en el fotograma de máxima velocidad de cada movimiento
wb, wc = load("whoosh_b"), load("whoosh_c")
for frame, w, lvl, label in [(116, wb, -17, "entrada de tarjetas"), (160, wc, -16, "tarjeta 01 al centro"),
                             (192, wc, -21, "sale la factura"), (293, wb, -17, "cambio a 02"),
                             (324, wc, -21, "sale la calculadora"), (435, wb, -17, "cambio a 03"),
                             (466, wc, -21, "sale la llave"), (563, wb, -18, "recap")]:
    add("hushes", w, lvl, f(frame), peak_time(w), f"hush {label} f{frame}")

# 01 · Factura: el papel se desliza durante el vuelo y se asienta al aterrizar (f210)
paper = load("paper")
paper_cut = fades(clip(paper, 0.9), fin=0.06, fout=0.15)
add("foley", paper_cut, -17, f(210), peak_time(paper) - 0.9, "papel aterriza f210")
add("hits", hit_b, -17, f(210) + 0.003, peak_time(hit_b), "hit suave f210")

# 02 · Calculadora: un clic de tecla en el aterrizaje (f342)
calc = load("calculator")
click = fades(clip(calc, 1.40, 1.58), fin=0.003, fout=0.03)
add("foley", click, -18, f(342) + 0.01, peak_time(click), "clic calculadora f342")
add("hits", hit_b, -17, f(342) + 0.003, peak_time(hit_b), "hit suave f342")

# 03 · Llave: el tintineo metálico cae en el aterrizaje (f484)
key = load("key")
add("foley", fades(key, fout=0.2), -16, f(484) + 0.005, peak_time(key), "llave f484")
add("hits", hit_b, -18, f(484) + 0.003, peak_time(hit_b), "hit suave f484")

# Recap: riser final que culmina cuando las tres tarjetas vuelven a la agenda (f584)
riser_f = load("riser_final")
end_f = np.max(np.nonzero(np.abs(riser_f).max(axis=1) > 0.02)[0]) / SR
add("risers", fades(clip(riser_f, 0, end_f), fout=0.004), -15, f(584), end_f, "riser final → f584")
add("hits", hit_a, -12, f(584) + 0.003, peak_time(hit_a), "hit final f584")

# Música: medios recortados (1–4 kHz) para dejar sitio a una voz, compresión suave
music = clip(load("music"), 0, N / SR)
mids = np.stack([signal.sosfiltfilt(signal.butter(2, [1000, 4000], "band", fs=SR, output="sos"), music[:, c]) for c in range(2)], axis=1)
music = music - 0.45 * mids
env = maximum_filter1d(np.abs(music).max(axis=1), size=int(0.01 * SR))
env = signal.lfilter([1 - np.exp(-1 / (0.15 * SR))], [1, -np.exp(-1 / (0.15 * SR))], env)
thr = 0.25 * env.max()
gain = np.where(env > thr, (thr / np.maximum(env, 1e-9)) ** (1 - 1 / 3), 1.0)
music = music * gain[:, None]
music = fades(np.vstack([music, np.zeros((max(0, N - len(music)), 2))])[:N], fin=1.5, fout=1.2)
tracks["musica"] = peak_to(music, -22)

mix = sum(tracks.values())
gain_db = -3 - 20 * np.log10(np.max(np.abs(mix)))
master = (mix * db(gain_db)).astype(np.float32)
wavfile.write(out / "audio.wav", SR, master)
for k, v in tracks.items():
    wavfile.write(out / f"stem_{k}.wav", SR, (v * db(gain_db)).astype(np.float32))

print("Picos por pista (antes del master):")
for k, v in tracks.items():
    print(f"  {k:8s} {20 * np.log10(np.max(np.abs(v))):6.1f} dBFS")
print(f"Ganancia de master {gain_db:+.1f} dB → pico {20 * np.log10(np.max(np.abs(master))):.1f} dBFS")
print("Eventos:")
for label, s in events:
    print(f"  {s:6.3f} s  f{s * FPS:6.1f}  {label}")
