# Corte de silencios por reglas (mismas que en el Anuncio 1) + grade con corrección de piel
# uso: python3 cut3.py
import json, os, re, subprocess, sys
E = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
V = 'hub'
SRC = os.path.join(E, 'src', 'hub_latam_pagos.mp4')
FPS = 30
SHOTS = [17.267, 20.4, 29.433, 38.6, 44.133, 48.267]
for d in ('base', 'analysis'): os.makedirs(os.path.join(E, d), exist_ok=True)

# silencios a -38 dB (>= 0.12 s)
p = subprocess.run(['ffmpeg', '-hide_banner', '-i', os.path.join(E, 'analysis', 'voice16k.wav'), '-af', 'silencedetect=noise=-38dB:d=0.12', '-f', 'null', '-'],
                   capture_output=True, text=True).stderr
st = [float(x) for x in re.findall(r'silence_start: ([0-9.]+)', p)]
en = [float(x) for x in re.findall(r'silence_end: ([0-9.]+)', p)]
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', SRC], capture_output=True, text=True).stdout)
gaps = list(zip(st, en))
last_speech = gaps[-1][0] if gaps and gaps[-1][1] >= dur - 0.05 else dur
END = min(dur, last_speech + 0.3)
f = lambda t: round(t * FPS)
segs = []; cur = 0
for s, e in gaps:
    if e >= dur - 0.05: break
    d = e - s
    if d < 0.17: continue                       # pausa natural corta: se respeta
    k = 0.12 if d < 0.3 else 0.15               # aire que se conserva entre frases
    a, b = f(s + k * 0.4), f(e - k * 0.6)
    if b <= a: continue
    segs.append([cur, a]); cur = b
segs.append([cur, f(END)])
# corte en L en los cambios de plano (el plano saliente se queda 1–2 frames más)
vsegs = [list(x) for x in segs]
for i in range(len(segs) - 1):
    o, n = segs[i][1] / FPS, segs[i + 1][0] / FPS
    sc = [x for x in SHOTS if o < x < n + 0.05]
    if sc:
        lc = max(0, min(2, round(sc[0] * FPS) - segs[i][1]))
        vsegs[i][1] += lc; vsegs[i + 1][0] += lc
tot = sum(b - a for a, b in segs)
out = []; o = 0
for (a, b), (va, vb) in zip(segs, vsegs):
    out.append({'src_in': a, 'src_out': b, 'v_in': va, 'v_out': vb, 'out_in': o}); o += b - a
def remap(t):
    fr = t * FPS
    for s in out:
        if s['src_in'] <= fr <= s['src_out']: return (s['out_in'] + fr - s['src_in']) / FPS
    for s in out:
        if fr < s['src_in']: return s['out_in'] / FPS
    return tot / FPS
json.dump({'fps': FPS, 'segments': out, 'frames': tot, 'shots_out': [round(remap(x), 3) for x in SHOTS],
           'joins_out': [round(s['out_in'] / FPS, 3) for s in out[1:]]}, open(os.path.join(E, 'analysis', f'{V}_cuts.json'), 'w'), indent=1)
print(V, 'segmentos', len(out), 'frames', tot, 'dur', round(tot / FPS, 2), 'de', round(dur, 2))
# video 1440x2560 con grade suave + voz
grade = ("lut3d=file={}/color/skin.cube,eq=contrast=1.06:brightness=-0.01:saturation=0.97,"
         "curves=master='0/0 0.06/0.035 0.5/0.5 0.94/0.96 1/1',scale=1440:2560:flags=lanczos,format=yuv420p").format(E)
# streaming: select por frames (video, con cortes en L) y por tiempo (audio); sin buffers grandes
vsel = '+'.join(f"between(n,{s['v_in']},{s['v_out'] - 1})" for s in out)
af = [f"[0:a]atrim=start={x['src_in'] / FPS:.6f}:end={x['src_out'] / FPS:.6f},asetpts=PTS-STARTPTS,afade=t=in:d=0.008,afade=t=out:st={max(0, (x['src_out'] - x['src_in']) / FPS - 0.008):.6f}:d=0.008[a{i}]" for i, x in enumerate(out)]
fcp = os.path.join(E, 'analysis', f'{V}_filter.txt')
open(fcp, 'w').write(f"[0:v]select='{vsel}',setpts=N/{FPS}/TB,{grade}[vout];" + ';'.join(af) + ';' + ''.join(f'[a{i}]' for i in range(len(out))) + f"concat=n={len(out)}:v=0:a=1,aresample=48000[aout]")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', SRC, '-filter_complex_script', fcp,
                '-map', '[vout]', '-c:v', 'libx264', '-crf', '12', '-preset', 'fast', '-r', '30', '-an', os.path.join(E, 'base', f'{V}_video.mp4'),
                '-map', '[aout]', '-vn', '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s24le', os.path.join(E, 'base', f'{V}_voice.wav')], check=True)
