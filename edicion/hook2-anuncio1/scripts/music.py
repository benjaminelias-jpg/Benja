"""Música original generada por síntesis (sin samples ni material de terceros): electrónica minimal elegante,
pad cálido + piano eléctrico FM en arpegio + bajo redondo + pulso suave. Sin voces.

La rejilla de tiempo está anclada a los cortes importantes del montaje para que caigan EN el beat:
cada tramo entre anclas tiene tempo constante (100–110 BPM) y el final hace un ritardando hacia el acorde
de resolución en "clic aquí abajo".
Uso: music.py timeline.json music.wav"""
import json, sys
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
rng = np.random.default_rng(7)
tl = json.load(open(sys.argv[1]))
DUR = tl["duration"]
N = int(DUR * SR) + int(0.05 * SR)

# (tiempo de salida, índice de beat global). Downbeat = beat % 4 == 0.
ANCHORS = [(0.0, 1), (8.2333, 16), (26.1333, 48), (33.5, 61), (42.0667, 76), (53.3333, 96), (68.0333, 122), (69.30, 124)]
LAST_BEAT = 130

def beat_time(g):
    for (t0, b0), (t1, b1) in zip(ANCHORS, ANCHORS[1:]):
        if b0 <= g <= b1:
            return t0 + (g - b0) * (t1 - t0) / (b1 - b0)
    (t0, b0), (t1, b1) = ANCHORS[-2], ANCHORS[-1]
    return t1 + (g - b1) * (t1 - t0) / (b1 - b0)

def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)

# Progresión en Re mayor: Gmaj9 – D/F# – Em9 – Asus4→A ; final en Dmaj9
CHORDS = {
    "G": dict(pad=[55, 59, 66, 69], bass=43, arp=[67, 71, 74, 78, 81]),
    "D/F#": dict(pad=[54, 57, 62, 69], bass=42, arp=[66, 69, 74, 76, 81]),
    "Em": dict(pad=[52, 55, 62, 66], bass=40, arp=[64, 67, 71, 74, 78]),
    "A": dict(pad=[57, 62, 64, 69], bass=45, arp=[64, 69, 71, 74, 76]),
    "Dmaj9": dict(pad=[50, 57, 61, 66, 69], bass=38, arp=[66, 69, 73, 76, 78]),
}
PROG = ["G", "D/F#", "Em", "A"]
def chord_of_bar(k):
    return "Dmaj9" if k >= 31 else PROG[k % 4]

t_axis = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)
pad_bus = np.zeros((2, N)); arp_bus = np.zeros((2, N)); low_bus = np.zeros(N); hat_bus = np.zeros(N)

def add(bus, sig, start, ch=None, pan=0.0):
    i0 = int(start * SR)
    if i0 >= N: return
    if i0 < 0: sig = sig[-i0:]; i0 = 0
    n = min(len(sig), N - i0)
    if bus.ndim == 2:
        gl, gr = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        bus[0, i0:i0 + n] += sig[:n] * gl * 1.4142
        bus[1, i0:i0 + n] += sig[:n] * gr * 1.4142
    else:
        bus[i0:i0 + n] += sig[:n]

def raised(n, a, r):
    e = np.ones(n)
    a, r = min(a, n // 2), min(r, n // 2)
    if a: e[:a] = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, a))
    if r: e[-r:] = 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, r))
    return e

# ---------------------------------------------------------------- pad (cálido, 4 armónicos, desafinado)
for k in range(0, 33):
    g0, g1 = 4 * k, 4 * k + 4
    if g1 <= 1: continue
    t0, t1 = beat_time(max(g0, 0)) if g0 >= 0 else 0, beat_time(g1)
    if k == 0: t0 = 0.0
    if t0 >= DUR: break
    start, end = max(0.0, t0 - 0.25), min(DUR + 0.05, t1 + 0.7)
    n = int((end - start) * SR); tt = np.arange(n) / SR
    env = raised(n, int(0.6 * SR), int(0.9 * SR))
    for j, m in enumerate(CHORDS[chord_of_bar(k)]["pad"]):
        f = midi(m)
        for det, pan in ((-6, -0.55), (5, 0.55)):
            fd = f * 2 ** (det / 1200)
            ph = rng.uniform(0, 2 * np.pi)
            wv = (np.sin(2 * np.pi * fd * tt + ph) + 0.32 * np.sin(4 * np.pi * fd * tt + ph * 1.3)
                  + 0.14 * np.sin(6 * np.pi * fd * tt) + 0.05 * np.sin(8 * np.pi * fd * tt))
            trem = 1 + 0.06 * np.sin(2 * np.pi * (0.13 + 0.03 * j) * tt + j)
            add(pad_bus, wv * env * trem * 0.06, start, pan=pan)
sos = butter(2, 2200, "low", fs=SR, output="sos")
pad_bus = sosfilt(sos, pad_bus, axis=1)

# ---------------------------------------------------------------- piano eléctrico FM (arpegio en corcheas)
PATTERN = [0, 2, 4, 2, 1, 3, 4, 3]
def epiano(f, vel, dur=1.4):
    n = int(dur * SR); tt = np.arange(n) / SR
    idx = 1.6 * np.exp(-tt / 0.22) + 0.25
    y = np.sin(2 * np.pi * f * tt + idx * np.sin(2 * np.pi * f * tt))
    y += 0.12 * np.sin(2 * np.pi * 2 * f * tt) * np.exp(-tt / 0.12)        # brillo del ataque (tine)
    env = (1 - np.exp(-tt / 0.003)) * np.exp(-tt / 0.42) * raised(n, 0, int(0.15 * SR))
    return y * env * vel
for g in range(1, LAST_BEAT):
    t_b, t_n = beat_time(g), beat_time(g + 1)
    if t_b >= DUR: break
    k = g // 4
    if g >= 124 and g != 124: continue                      # final: solo una nota de resolución
    ch = CHORDS[chord_of_bar(k)]["arp"]
    for half in (0, 1):
        if g == 124 and half == 1: continue
        e = (g % 4) * 2 + half
        t = t_b + half * (t_n - t_b) / 2
        note = ch[PATTERN[e]] + (12 if 76 <= g < 96 and e in (2, 6) else 0)   # B-roll: una octava de brillo
        vel = (0.95 if half == 0 else 0.7) * (0.75 if g < 16 else 1.0)
        if g == 124: note, vel = ch[0], 1.1
        add(arp_bus, epiano(midi(note), vel * 0.11, 1.8 if g == 124 else 1.4), t, pan=(-0.28 if e % 2 else 0.28))
# filtro que se abre en la intro (0–8 s) y queda abierto
arp_dark = sosfilt(butter(2, 1100, "low", fs=SR, output="sos"), arp_bus, axis=1)
arp_open = sosfilt(butter(2, 5200, "low", fs=SR, output="sos"), arp_bus, axis=1)
w = np.clip(t_axis / 8.2, 0, 1) ** 1.5
arp_bus = arp_dark * (1 - w) + arp_open * w
# eco estéreo (ping-pong) filtrado
def pingpong(x, d=0.42, fb=0.3, wet=0.28):
    D = int(d * SR); yl = np.zeros_like(x[0]); yr = np.zeros_like(x[1])
    src = sosfilt(butter(2, [400, 4000], "band", fs=SR, output="sos"), x.mean(0))
    for rep in range(1, 6):
        g = wet * fb ** (rep - 1); sh = rep * D
        if sh >= len(src): break
        (yl if rep % 2 else yr)[sh:] += src[:-sh] * g
    return np.stack([x[0] + yl, x[1] + yr])
arp_bus = pingpong(arp_bus)

# ---------------------------------------------------------------- bajo redondo + pulso (kick suave) + hat
def bass_note(f, dur):
    n = int(dur * SR); tt = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * tt) + 0.35 * np.sin(2 * np.pi * 2 * f * tt) + 0.5 * np.sin(np.pi * f * tt)
    y = np.tanh(1.6 * y) / np.tanh(1.6)
    return y * raised(n, int(0.012 * SR), int(0.08 * SR)) * (0.7 + 0.3 * np.exp(-tt / 0.25))
def kick():
    n = int(0.32 * SR); tt = np.arange(n) / SR
    f = 46 + 70 * np.exp(-tt / 0.03)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-tt / 0.15) * raised(n, int(0.002 * SR), int(0.03 * SR))
def hat():
    n = int(0.06 * SR); tt = np.arange(n) / SR
    y = sosfilt(butter(2, 7500, "high", fs=SR, output="sos"), rng.standard_normal(n))
    return y * np.exp(-tt / 0.016)
K = kick()
pump = np.ones(N)
for g in range(1, LAST_BEAT):
    t = beat_time(g)
    if t >= DUR: break
    k = g // 4
    if g % 2 == 0 and g >= 16 and g < 124:                  # bajo en tiempos 1 y 3 desde la presentación
        add(low_bus, bass_note(midi(CHORDS[chord_of_bar(k)]["bass"]), beat_time(g + 2) - t - 0.04) * 0.16, t)
    if g == 124:
        add(low_bus, bass_note(midi(CHORDS["Dmaj9"]["bass"]), 2.0) * 0.22, t)
    if 16 <= g < 122:                                        # pulso en negras
        add(low_bus, K * (0.24 if g % 4 == 0 else 0.18), t)
        i0 = int(t * SR); m = min(int(0.3 * SR), N - i0)
        tt_ = np.arange(m) / SR   # bombeo suave: entra en 6 ms (sin escalón → sin clic)
        pump[i0:i0 + m] = np.minimum(pump[i0:i0 + m], 1 - 0.20 * (1 - np.exp(-tt_ / 0.006)) * np.exp(-tt_ / 0.11))
    if 48 <= g < 122:                                        # hat a contratiempo (desde el bucle abierto)
        add(hat_bus, hat() * 0.035 * (1.0 if g % 2 else 0.8), (t + beat_time(g + 1)) / 2)

# ---------------------------------------------------------------- reverb (IR sintética) sobre pad + arp
def make_ir(sec=2.4):
    n = int(sec * SR); tt = np.arange(n) / SR
    ir = rng.standard_normal((2, n)) * np.exp(-tt / 0.55)
    ir = sosfilt(butter(2, 5000, "low", fs=SR, output="sos"), ir, axis=1)
    ir[:, :int(0.012 * SR)] = 0
    return ir / np.sqrt((ir ** 2).sum(axis=1, keepdims=True))
IR = make_ir()
wet_in = pad_bus * 0.8 + arp_bus
wet = np.stack([fftconvolve(wet_in[c], IR[c])[:N] for c in range(2)]) * 0.42

mix = (pad_bus * pump + arp_bus) * 1.0 + wet
mix += low_bus[None, :] + hat_bus[None, :] * np.array([[0.9], [1.1]])
# final: se apaga con el vídeo
fade = np.clip((DUR - t_axis) / 0.9, 0, 1) ** 1.6
mix *= fade[None, :]
mix = sosfilt(butter(1, 30, "high", fs=SR, output="sos"), mix, axis=1)
mix /= np.max(np.abs(mix)) / 0.5
sf.write(sys.argv[2], mix.T, SR, subtype="FLOAT")
bt = [round(beat_time(g), 3) for g in range(1, 125, 1)]
print(f"música {N / SR:.2f} s → {sys.argv[2]} · downbeats:", [round(beat_time(g), 2) for g in range(4, 125, 4)])
