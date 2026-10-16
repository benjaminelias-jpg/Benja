"""SFX sintetizados (aire suave, clic de vidrio, tick, swell) + ducking de la música bajo la voz + suma.
Las pistas de SFX salen de la propia escena (render.mjs --dump), así que caen al frame con cada gráfico.
Uso: mix.py voice_proc.wav music.wav meta.json timeline.json premaster.wav"""
import json, sys
import numpy as np, soundfile as sf
import pyloudnorm as pyln
from scipy.signal import butter, sosfilt

SR = 48000
rng = np.random.default_rng(11)
voice, sr = sf.read(sys.argv[1]); assert sr == SR
voice = voice.mean(1) if voice.ndim > 1 else voice
music, sr = sf.read(sys.argv[2]); assert sr == SR
meta = json.load(open(sys.argv[3])); tl = json.load(open(sys.argv[4]))
N = int(round(tl["duration"] * SR))
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
music = np.pad(music, ((0, max(0, N - len(music))), (0, 0)))[:N].T

db = lambda x: 10 ** (x / 20)
def env_ar(n, a, r, curve=2.0):
    t = np.linspace(0, 1, n); pk = max(1, int(n * a / (a + r)))
    e = np.empty(n); e[:pk] = (t[:pk] / t[pk - 1]) ** curve if pk > 1 else 1
    e[pk:] = (1 - (t[pk:] - t[pk - 1]) / (1 - t[pk - 1])) ** (curve * 1.3)
    return e
def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)

# ---------------------------------------------------------------- diseño de SFX (todo muy sutil)
def air(dur=0.42, lo=500, hi=3600, dark=900):
    n = int(dur * SR); nz = rng.standard_normal((2, n))
    bright = np.stack([bp(c, lo, hi) for c in nz]); low = np.stack([bp(c, 180, dark) for c in nz])
    e = env_ar(n, 0.16, 0.26)
    w = e ** 1.2                                   # el brillo sigue a la envolvente → barrido de aire
    return (low * (1 - w) * 0.8 + bright * w) * e
def air_long():
    return air(0.78, 300, 2400, 700)
def glass():
    n = int(0.22 * SR); t = np.arange(n) / SR
    y = np.zeros(n)
    for f, a, d in ((2350, 1.0, 0.085), (3530, 0.55, 0.06), (4720, 0.32, 0.045), (6180, 0.16, 0.03)):
        y += a * np.sin(2 * np.pi * f * t + rng.uniform(0, 6.28)) * np.exp(-t / d)
    y *= 1 - np.exp(-t / 0.0015)
    click = sosfilt(butter(2, 4000, "high", fs=SR, output="sos"), rng.standard_normal(n)) * np.exp(-t / 0.002) * 0.35
    y = y + click
    return np.stack([y * 0.92, y * 1.0])
def tick():
    n = int(0.06 * SR); t = np.arange(n) / SR
    y = (np.sin(2 * np.pi * 2900 * t) + 0.4 * np.sin(2 * np.pi * 5800 * t)) * np.exp(-t / 0.011) * (1 - np.exp(-t / 0.0008))
    return np.stack([y, y])
def swell(dur=0.58):
    n = int(dur * SR); t = np.arange(n) / SR
    tone = sum(np.sin(2 * np.pi * f * t) for f in (293.66, 440.0, 587.33)) / 3
    nz = bp(rng.standard_normal(n), 400, 5000)
    e = (t / dur) ** 2.6 * (1 - np.clip((t - dur + 0.03) / 0.03, 0, 1))
    y = (tone * 0.6 + nz * 0.5) * e
    return np.stack([y, y])
LEVEL = {"air": -33, "air_long": -31, "glass": -34, "tick": -40, "swell": -31}   # pico en dBFS antes del máster
GEN = {"air": air, "air_long": air_long, "glass": glass, "tick": tick, "swell": swell}
sfx = np.zeros((2, N))
for cue in meta["sfx"]:
    s = GEN[cue["type"]]()
    s = s / (np.max(np.abs(s)) + 1e-9) * db(LEVEL[cue["type"]] + cue.get("gain", 0))
    i0 = int(cue["t"] * SR) - (int(0.04 * SR) if cue["type"] == "air" else 0)
    i0 = max(0, i0); n = min(s.shape[1], N - i0)
    sfx[:, i0:i0 + n] += s[:, :n]

# ---------------------------------------------------------------- niveles y ducking
meter = pyln.Meter(SR)
LV = meter.integrated_loudness(voice)
LM = meter.integrated_loudness(music.T)
music *= db((LV - 10.0) - LM)              # sin voz: 10 LU por debajo de la voz
speech = np.zeros(N)
for a, b in tl["speech"]:
    speech[max(0, int((a - 0.10) * SR)):int((b + 0.06) * SR)] = 1
duck_db = -6.0                             # con voz: 16 LU por debajo (dentro del rango 15–20 dB pedido)
target = speech * duck_db
g = np.empty(N); cur = 0.0
att, rel = np.exp(-1 / (0.06 * SR)), np.exp(-1 / (0.45 * SR))
for i in range(N):                         # bajar rápido, subir despacio
    k = att if target[i] < cur else rel
    cur = target[i] + (cur - target[i]) * k
    g[i] = cur
music *= db(g)[None, :]

mix = voice[None, :] * 1.0 + music + sfx
sf.write(sys.argv[5], mix.T, SR, subtype="FLOAT")
mu = music[:, speech > 0.5].T
print(f"voz {LV:.1f} LUFS · música sin voz {LV - 10:.1f} · música bajo voz ≈ {meter.integrated_loudness(mu) if len(mu) > SR else float('nan'):.1f} LUFS · "
      f"SFX {len(meta['sfx'])} → {sys.argv[5]}")
