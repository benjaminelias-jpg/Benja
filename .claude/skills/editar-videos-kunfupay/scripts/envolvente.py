#!/usr/bin/env python3
"""Envolvente de cada mp3 (dB por ventanas de 10 ms; 1 s si dura > 12 s): dónde está el golpe y cuánto dura.
Uso: envolvente.py assets/px/*.mp3"""
import os, subprocess, sys
import numpy as np
for f in sys.argv[1:]:
    a = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", "8000", "-f", "s16le", "-"], capture_output=True).stdout, np.int16).astype(float)
    if not len(a): print(f, "VACÍO"); continue
    st = 80 if len(a) < 8000 * 12 else 8000
    env = [int(20 * np.log10(np.sqrt((a[i:i + st] ** 2).mean()) / 32768 + 1e-6)) for i in range(0, min(len(a), st * 60), st)]
    pk = int(np.argmax(env)) * st / 8000
    print(f"{os.path.basename(f)[:28]:28s} {len(a) / 8000:5.1f}s · golpe en {pk:.2f}s · {'10ms' if st == 80 else '1s'}: {env[:60]}")
