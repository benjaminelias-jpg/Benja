"""Diseño sonoro de "01 · LA CONSTANCIA" (5 s, 48 kHz, estéreo).

Todo se sintetiza a partir de ruido filtrado y senos graves con reverb de
convolución, buscando texturas orgánicas (aire, cuerpo, sala) y no pitidos
sintéticos (regla 1.3 de la skill).

Pistas y niveles de pico por pista (sección 4.2 de la skill):
  riser        0,00–1,00 s  −15 dBFS  culmina en el hit
  hit          1,00 s (f30) −12 dBFS  el pico cae dentro del fotograma 30
  hush entrada pico 0,70 s (f21)  −16 dBFS  máxima velocidad del "01"
  hush salida  pico 4,47 s (f134) −18 dBFS  salidas con ease-in
  música (pad) 0–5 s         −22 dBFS  graves, sin medios de 1–4 kHz
Master: normalizado a −3 dBFS de pico.

Uso: python3 audio.py <carpeta_salida>
"""
import sys
from pathlib import Path

import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
FPS = 30
DUR = 5.0
N = int(SR * DUR)
out_dir = Path(sys.argv[1])
out_dir.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(20261014)


def db(x):
    return 10 ** (x / 20)


def sos(kind, f, order=2):
    return signal.butter(order, f, kind, fs=SR, output="sos")


def to_peak(x, peak_db):
    return x * (db(peak_db) / np.max(np.abs(x)))


def place(track, clip, start_s):
    """Suma un clip estéreo en la pista a partir de start_s (recorta lo que sobre)."""
    i0 = int(round(start_s * SR))
    a, b = max(0, i0), min(N, i0 + len(clip))
    if b > a:
        track[a:b] += clip[a - i0:b - i0]


def reverb_ir(seconds, rt60, damp_hz, predelay=0.015):
    """Respuesta al impulso estéreo: ruido con caída exponencial; los agudos caen antes."""
    n = int(seconds * SR)
    t = np.arange(n) / SR
    env = 10 ** (-3 * t / rt60)
    ir = np.zeros((n, 2))
    for ch in range(2):
        noise = rng.standard_normal(n)
        lo = signal.sosfilt(sos("low", damp_hz), noise)
        hi = noise - lo
        ir[:, ch] = lo * env + hi * env ** 2.5
    ir = np.vstack([np.zeros((int(predelay * SR), 2)), ir])
    return ir / np.sqrt(np.sum(ir ** 2, axis=0))


def convolve(x, ir):
    """x mono o estéreo, ir estéreo → estéreo de la misma longitud que x + cola."""
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    return np.stack([signal.fftconvolve(x[:, c], ir[:, c]) for c in range(2)], axis=1)


def svf_bandpass(x, fc, q):
    """Filtro de estado variable (TPT) con frecuencia de corte variable en el tiempo."""
    y = np.zeros_like(x)
    s1 = s2 = 0.0
    k = 1.0 / q
    g_all = np.tan(np.pi * np.clip(fc, 20, SR * 0.45) / SR)
    for i in range(len(x)):
        g = g_all[i]
        hp = (x[i] - (k + g) * s1 - s2) / (1 + k * g + g * g)
        bp = g * hp + s1
        s1 = g * hp + bp
        lp = g * bp + s2
        s2 = g * bp + lp
        y[i] = bp
    return y


def fade(x, fade_in=0.0, fade_out=0.0):
    x = x.copy()
    if fade_in:
        n = int(fade_in * SR)
        x[:n] *= np.sin(np.linspace(0, np.pi / 2, n))[:, None] ** 2
    if fade_out:
        n = int(fade_out * SR)
        x[-n:] *= np.cos(np.linspace(0, np.pi / 2, n))[:, None] ** 2
    return x


# ---------------------------------------------------------------- hit (f30)
def make_hit():
    L = int(2.6 * SR)
    t = np.arange(L) / SR
    # Boom grave con caída de tono (100 → 44 Hz)
    f = 44 + (100 - 44) * np.exp(-t / 0.055)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(t / 0.002, 1) * np.exp(-t / 0.55)
    # Cuerpo (120–190 Hz) para que se perciba también en altavoces de móvil
    f2 = 118 + (190 - 118) * np.exp(-t / 0.03)
    body = 0.45 * np.sin(2 * np.pi * np.cumsum(f2) / SR) * np.minimum(t / 0.0015, 1) * np.exp(-t / 0.11)
    # Transitorio suave: ruido filtrado, sin brillo (hit "grave suave")
    trans = 0.3 * signal.sosfilt(sos("band", [150, 2000]), rng.standard_normal(L)) * np.exp(-t / 0.012)
    # Retumbo de sala: ruido marrón muy grave
    brown = np.cumsum(rng.standard_normal(L))
    brown = signal.sosfilt(sos("low", 170, 4), signal.sosfilt(sos("high", 22), brown))
    rumble = 0.25 * brown / np.max(np.abs(brown)) * np.minimum(t / 0.01, 1) * np.exp(-t / 0.9)
    dry = sub + body + trans + rumble
    dry = np.tanh(dry * 1.1) / np.tanh(1.1)  # saturación cálida: armónicos audibles en el móvil
    # El primer ciclo debe ser el pico máximo: el golpe se siente en el ataque, no en la cola
    dry *= 0.55 + 0.45 * np.exp(-t / 0.06)
    wet = convolve(dry, reverb_ir(2.4, 1.7, 2200))[:L]
    hit = np.stack([dry, dry], axis=1) + 0.32 * wet / np.max(np.abs(wet)) * np.max(np.abs(dry))
    return fade(hit, fade_out=0.4)


# ---------------------------------------------------------------- riser (0–1 s)
def make_riser(T=1.0):
    L = int(T * SR)
    x = np.arange(L) / L
    # Capa de aire: ruido con filtro de banda que sube de 250 Hz a 6 kHz
    fc = 250 * (6000 / 250) ** (x ** 1.25)
    air = np.stack([svf_bandpass(rng.standard_normal(L), fc, 1.1) for _ in range(2)], axis=1)
    air *= (x ** 2.4)[:, None]
    # Capa de "succión": reverb invertida de un golpe de aire, crece hasta el hit
    burst_t = np.arange(int(0.05 * SR)) / SR
    burst = signal.sosfilt(sos("band", [200, 4000]), rng.standard_normal(len(burst_t))) * np.exp(-burst_t / 0.015)
    swell = convolve(burst, reverb_ir(1.6, 1.4, 5000, predelay=0.0))[::-1][-L:]
    swell /= np.max(np.abs(swell))
    # Cuerpo tonal grave que sube una octava (55 → 110 Hz), muy filtrado
    f = 55 * 2 ** (x ** 1.5)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * np.sin(4 * np.pi * np.cumsum(f) / SR)
    tone = signal.sosfilt(sos("low", 400), tone) * x ** 2.0
    riser = (0.55 * air / np.max(np.abs(air)) + 0.6 * swell + 0.35 * np.stack([tone, tone], axis=1))
    return fade(riser, fade_in=0.05, fade_out=0.004)  # se corta justo en el hit


# ---------------------------------------------------------------- hushes
def make_hush(attack, release, f_from, f_to, T):
    """Ráfaga de aire: envolvente asimétrica con pico en t = attack."""
    L = int(T * SR)
    t = np.arange(L) / SR
    u = t / attack
    env = np.where(t < attack, u ** 2 * np.exp(2 * (1 - u)), np.exp(-(t - attack) / release))
    fc = f_from * (f_to / f_from) ** (t / T)
    h = np.stack([svf_bandpass(rng.standard_normal(L), fc, 0.8) for _ in range(2)], axis=1)
    body = signal.sosfilt(sos("low", 500), rng.standard_normal(L))
    h = h / np.max(np.abs(h)) + 0.25 * np.stack([body, body], axis=1) / np.max(np.abs(body))
    h *= env[:, None]
    wet = convolve(h, reverb_ir(0.9, 0.6, 4000))[:L]
    return fade(h + 0.25 * wet / np.max(np.abs(wet)) * np.max(np.abs(h)), fade_out=0.02), attack


# ---------------------------------------------------------------- música (pad)
def make_pad():
    t = np.arange(N) / SR
    # Quintas abiertas en Re (D2, A2, D3, A3): neutras y cinematográficas
    notes = [(73.42, 1.0), (110.0, 0.7), (146.83, 0.42), (220.0, 0.16)]
    pad = np.zeros((N, 2))
    for i, (f0, a) in enumerate(notes):
        for ch, cents in enumerate((-4, 4)):  # dos voces desafinadas, una por canal
            f = f0 * 2 ** (cents / 1200)
            ph = 2 * np.pi * f * t + i * 1.3 + ch * 0.7
            wave = np.sin(ph) + 0.22 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)
            lfo = 1 + 0.1 * np.sin(2 * np.pi * (0.11 + 0.03 * i) * t + i)
            pad[:, ch] += a * wave * lfo
    pad = np.stack([signal.sosfilt(sos("low", 900, 4), pad[:, c]) for c in range(2)], axis=1)
    # Tras el hit la música se abre ligeramente (+2 dB)
    lift = 1 + (db(2) - 1) * np.clip((t - 1.0) / 0.8, 0, 1)
    pad *= lift[:, None]
    wet = convolve(pad, reverb_ir(3.0, 2.4, 1800))[:N]
    pad = pad + 0.5 * wet / np.max(np.abs(wet)) * np.max(np.abs(pad))
    return fade(pad, fade_in=1.2, fade_out=0.9)


# ---------------------------------------------------------------- mezcla
tracks = {}

riser = to_peak(make_riser(1.0), -15)
tracks["riser"] = np.zeros((N, 2)); place(tracks["riser"], riser, 0.0)

hit = to_peak(make_hit(), -12)
# Alinear por el pico del ataque (primeros 15 ms), que es el máximo de toda la onda
hit_peak_idx = int(np.argmax(np.abs(hit[: int(0.015 * SR)]).max(axis=1)))
assert hit_peak_idx == int(np.argmax(np.abs(hit).max(axis=1))), "el pico del hit no está en el ataque"

HIT_PEAK_S = 30 / FPS + 0.003  # dentro del fotograma 30 (1,000–1,033 s)
tracks["hit"] = np.zeros((N, 2)); place(tracks["hit"], hit, HIT_PEAK_S - hit_peak_idx / SR)

h_in, a_in = make_hush(attack=0.07, release=0.13, f_from=2400, f_to=700, T=0.6)
h_in = to_peak(h_in, -16)
tracks["hush_entrada"] = np.zeros((N, 2)); place(tracks["hush_entrada"], h_in, 21 / FPS - a_in)

h_out, a_out = make_hush(attack=0.26, release=0.07, f_from=600, f_to=1900, T=0.6)
h_out = to_peak(h_out, -18)
tracks["hush_salida"] = np.zeros((N, 2)); place(tracks["hush_salida"], h_out, 134 / FPS - a_out)

tracks["musica"] = to_peak(make_pad(), -22)

mix = sum(tracks.values())
gain_db = -3 - 20 * np.log10(np.max(np.abs(mix)))
master = mix * db(gain_db)

# Informe de control
print("Picos por pista (antes del master):")
for name, tr in tracks.items():
    pk = np.max(np.abs(tr))
    idx = int(np.argmax(np.abs(tr).max(axis=1)))
    print(f"  {name:13s} {20 * np.log10(pk):6.1f} dBFS   pico en {idx / SR:.3f} s (f{idx / SR * FPS:.1f})")
print(f"Ganancia de master: {gain_db:+.1f} dB → pico {20 * np.log10(np.max(np.abs(master))):.1f} dBFS")

master = master.astype(np.float32)
wavfile.write(out_dir / "audio.wav", SR, master)
for name, tr in tracks.items():
    wavfile.write(out_dir / f"stem_{name}.wav", SR, (tr * db(gain_db)).astype(np.float32))
