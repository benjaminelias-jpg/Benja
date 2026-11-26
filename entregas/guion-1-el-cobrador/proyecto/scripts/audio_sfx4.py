# SFX de papel y lápiz sobre el audio original (que se conserva tal cual). uso: python3 -I audio_sfx4.py meta.json salida_sfx.wav duracion
import json, sys, wave, numpy as np
src = open('/home/user/Benja/entregas/hub-latam-pagos/proyecto/scripts/audio_mix3.py').read()
SR = 48000
a = src.index('rng = np.random.default_rng(7)'); b = src.index('cache = {}')
meta = json.load(open(sys.argv[1])); DUR = float(sys.argv[3]); N = int(round(DUR * SR))
exec(src[a:b])
cache = {}; sfx = np.zeros((N, 2), np.float32)
for ev in meta['sfx']:
    ty = ev['type']
    if ty not in cache: cache[ty] = GEN[ty]()
    clip = cache[ty] * (10 ** (LEVEL_DB[ty] / 20)) * ev.get('gain', 1)
    st = max(0, int(ev['t'] * SR)); en = min(N, st + len(clip)); sfx[st:en] += clip[:en - st]
w = wave.open(sys.argv[2], 'wb'); w.setnchannels(2); w.setsampwidth(4); w.setframerate(SR)
w.writeframes((np.clip(sfx, -1, 1).astype(np.float64) * (2**31 - 1)).astype(np.int32).tobytes()); w.close()
print(len(meta['sfx']), 'efectos:', sorted({e['type'] for e in meta['sfx']}))
