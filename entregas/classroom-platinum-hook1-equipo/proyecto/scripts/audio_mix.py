# Audio: voz procesada + música con ducking + SFX premium sintetizados -> máster -14 LUFS / -1 dBTP
import json, subprocess, sys, numpy as np, wave
import os
E = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
meta = json.load(open(f'{E}/analysis/meta.json'))
os.makedirs(f'{E}/audio', exist_ok=True)
DUR = meta['duration']
N = int(round(DUR * SR))
MUSIC_OFF = json.load(open(f'{E}/analysis/music_beats.json'))['offset']
VOICE_END = 34.36

def run(cmd): subprocess.run(cmd, check=True)
def read_wav(p):
    w = wave.open(p); n = w.getnframes(); ch = w.getnchannels(); sw = w.getsampwidth()
    raw = w.readframes(n)
    if sw == 2: a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    elif sw == 4: a = np.frombuffer(raw, np.int32).astype(np.float32) / 2**31
    else: raise ValueError(sw)
    return a.reshape(-1, ch)
def write_wav(p, a):
    a = np.clip(a, -1, 1); w = wave.open(p, 'wb'); w.setnchannels(a.shape[1]); w.setsampwidth(4); w.setframerate(SR)
    w.writeframes((a * (2**31 - 1)).astype(np.int32).tobytes()); w.close()
def fit(a):
    out = np.zeros((N, 2), np.float32); n = min(N, len(a)); out[:n] = a[:n]; return out

# ---------- 1. voz: HPF, limpieza suave, EQ, de-esser, compresión suave
run(['ffmpeg', '-v', 'error', '-y', '-i', f'{E}/base/voice_raw.wav', '-af',
     'pan=mono|c0=0.5*c0+0.5*c1,highpass=f=80,afftdn=nr=8:nf=-52:tn=1,'
     'equalizer=f=250:t=q:w=1.2:g=-2,equalizer=f=3600:t=q:w=1.0:g=1.5,equalizer=f=11000:t=h:w=0.7:g=1,'
     'deesser=i=0.35:m=0.5:f=0.5:s=o,'
     'acompressor=threshold=-22dB:ratio=2.8:attack=8:release=140:knee=6:makeup=2.5,'
     'pan=stereo|c0=c0|c1=c0',
     '-ar', str(SR), '-c:a', 'pcm_s32le', f'{E}/audio/voice_proc.wav'])
voice = fit(read_wav(f'{E}/audio/voice_proc.wav'))

# ---------- 2. música: tramo elegido para que el acorde final caiga en la tarjeta de cierre
run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{MUSIC_OFF:.3f}', '-t', f'{DUR + 0.5:.3f}', '-i', f'{E}/music_dl/music.mp3',
     '-ar', str(SR), '-ac', '2', '-c:a', 'pcm_s32le', f'{E}/audio/music_cut.wav'])
music = fit(read_wav(f'{E}/audio/music_cut.wav'))
t = np.arange(N) / SR
# ducking: 18 dB bajo la voz mientras habla; sube en la tarjeta de cierre; fades
env = np.ones(N)
duck_db = np.where(t < VOICE_END, -23.0, -4.0)
# transición suave de 0.5 s al terminar la voz
ramp = (t >= VOICE_END) & (t < VOICE_END + 0.5)
duck_db[ramp] = -23 + 19 * ((t[ramp] - VOICE_END) / 0.5)
g = 10 ** (duck_db / 20)
g *= np.clip(t / 0.25, 0, 1)                       # fade in
g *= np.clip((DUR - t) / 0.9, 0, 1) ** 1.5           # fade out final
music *= g[:, None]

# ---------- 3. SFX sintetizados (sutiles, siempre bajo la voz)
rng = np.random.default_rng(7)
def bp_noise(n, f0, f1, q=1.6):
    # ruido filtrado con barrido de frecuencia (resonador de 2 polos variable)
    x = rng.standard_normal(n); y = np.zeros(n); y1 = y2 = 0.0
    fs = np.geomspace(f0, f1, n)
    for i in range(n):
        w0 = 2 * np.pi * fs[i] / SR; r = np.exp(-w0 / (2 * q))
        a1 = -2 * r * np.cos(w0); a2 = r * r
        yi = (1 - r) * x[i] - a1 * y1 - a2 * y2; y2, y1 = y1, yi; y[i] = yi
    return y / (np.max(np.abs(y)) + 1e-9)
def env_ad(n, a, d):
    e = np.zeros(n); na = int(a * SR); e[:na] = np.linspace(0, 1, na) ** 2
    e[na:] = np.exp(-np.linspace(0, 1, n - na) * d); return e
def sfx_air(dur=0.42):
    n = int(dur * SR); s = bp_noise(n, 900, 4200, 1.2) * env_ad(n, 0.14, 5.0)
    return np.stack([s * 0.9, np.roll(s, 90) * 0.9], 1)
def sfx_whoosh(dur=0.7):
    n = int(dur * SR); s = bp_noise(n, 350, 3200, 1.0) * env_ad(n, 0.28, 4.0)
    pan = np.linspace(0.85, 0.15, n)                 # el barrido va de derecha a izquierda
    return np.stack([s * pan, s * (1 - pan)], 1) * 1.4
def sfx_click(dur=0.16):
    n = int(dur * SR); tt = np.arange(n) / SR
    s = (np.sin(2 * np.pi * 2650 * tt) * np.exp(-tt * 55) + 0.45 * np.sin(2 * np.pi * 5320 * tt) * np.exp(-tt * 80)
         + 0.25 * np.sin(2 * np.pi * 1320 * tt) * np.exp(-tt * 40))
    tr = rng.standard_normal(n) * np.exp(-tt * 900) * 0.15
    s = (s + tr) * np.clip(tt / 0.0015, 0, 1)
    return np.stack([s, s], 1) * 0.55
def sfx_tick(dur=0.05):
    n = int(dur * SR); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * 3900 * tt) * np.exp(-tt * 160) * np.clip(tt / 0.0008, 0, 1)
    return np.stack([s, s], 1) * 0.35
def sfx_swell(dur=0.55):
    n = int(dur * SR); tt = np.arange(n) / SR
    pad = sum(np.sin(2 * np.pi * f * tt + k) for k, f in enumerate([220, 277.2, 329.6, 440]))  # A mayor suave
    s = (pad / 4 * 0.6 + bp_noise(n, 600, 2600, 1.0) * 0.4) * (tt / dur) ** 2.2 * np.clip((dur - tt) / 0.06, 0, 1)
    return np.stack([s, s], 1) * 0.8
GEN = {'air': sfx_air, 'whoosh': sfx_whoosh, 'click': sfx_click, 'tick': sfx_tick, 'swell': sfx_swell}
LEVEL_DB = {'air': -29, 'whoosh': -26, 'click': -28, 'tick': -35, 'swell': -29}
cache = {}
sfx = np.zeros((N, 2), np.float32)
for ev in meta['sfx']:
    ty = ev['type']
    if ty not in cache: cache[ty] = GEN[ty]()
    clip = cache[ty] * (10 ** (LEVEL_DB[ty] / 20)) * ev.get('gain', 1)
    st = int(ev['t'] * SR)
    if ty == 'whoosh': st -= int(0.1 * SR)
    st = max(0, st); en = min(N, st + len(clip)); sfx[st:en] += clip[:en - st]

# ---------- 4. mezcla y máster
write_wav(f'{E}/audio/stem_voice.wav', voice); write_wav(f'{E}/audio/stem_music.wav', music); write_wav(f'{E}/audio/stem_sfx.wav', sfx)
mix = voice + music + sfx
write_wav(f'{E}/audio/mix_pre.wav', mix * 0.7)
# loudnorm en dos pasadas (lineal) + limitador true-peak
p = subprocess.run(['ffmpeg', '-hide_banner', '-i', f'{E}/audio/mix_pre.wav', '-af', 'loudnorm=I=-14:TP=-1.2:LRA=11:print_format=json', '-f', 'null', '-'],
                   capture_output=True, text=True).stderr
j = json.loads(p[p.rindex('{'):p.rindex('}') + 1])
af = (f"loudnorm=I=-14:TP=-1.2:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}:"
      f"measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true,alimiter=limit=0.87:attack=2:release=60:level=false")
run(['ffmpeg', '-v', 'error', '-y', '-i', f'{E}/audio/mix_pre.wav', '-af', af, '-ar', str(SR), '-c:a', 'pcm_s24le', f'{E}/audio/master.wav'])
print('ok')
