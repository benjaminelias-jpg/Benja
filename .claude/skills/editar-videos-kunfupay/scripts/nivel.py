#!/usr/bin/env python3
"""Nivel de los SFX (regla de Brayan: SIEMPRE un 40 % MÁS BAJOS).

OJO (error ya cometido, 2026-10-28): NO es «poner el SFX al 60 % del nivel de la voz»: eso lo deja a −4,4 dB de la voz y
suena MUCHO más fuerte (6–18 dB) que una mezcla normal. La regla es:
  1) pico de mezcla equilibrado por tipo (tabla PICO, dBFS antes del máster), que deja los SFX ~10–22 dB por debajo de la voz;
  2) y, encima, ×0,6 (−4,4 dB).
Resultado típico: la cama de SFX (partes que suenan) ≈ 20 dB por debajo de la voz en RMS. Compruébalo con `--comprobar`.

Uso como módulo:  from nivel import ganancia_sfx;  g_db = ganancia_sfx(["-i", "px/swipe.mp3"], "swipe", a=0, b=.5)
Comprobar:        nivel.py --comprobar voz.wav cama_sfx.wav"""
import math, re, subprocess, sys
import numpy as np

MENOS_40 = 20 * math.log10(0.6)          # −4,44 dB
PICO = {   # pico de mezcla por tipo de momento (dBFS, antes del máster a −14 LUFS)
    "tick": -29, "tick2": -28, "drop": -24, "impact": -21, "impact_s": -27, "stamp": -24, "bubble": -25, "glass": -24,
    "done": -24, "glitch": -22, "rise": -20, "rise_s": -28, "braam": -17, "heart": -21, "burn": -23, "swipe": -26,
    "whoosh_soft": -28, "coin": -29, "kaching": -22, "marimba": -27, "register": -22, "typing": -29, "paper": -23,
}

def pico(cmd_in, a=None, b=None):
    flt = (f"atrim={a}:{b}," if a is not None else "") + "aresample=48000,volumedetect"
    r = subprocess.run(["ffmpeg", *cmd_in, "-af", flt, "-f", "null", "-"], capture_output=True, text=True).stderr
    return float(re.search(r"max_volume: (-?[\d.]+)", r).group(1))

def rms_activo(cmd_in, a=None, b=None):
    """RMS (dBFS) de la parte que suena: ventanas de 20 ms a menos de 30 dB del máximo."""
    flt = (f"atrim={a}:{b}," if a is not None else "") + "aresample=48000"
    raw = subprocess.run(["ffmpeg", "-v", "error", *cmd_in, "-af", flt, "-ac", "1", "-f", "s16le", "-"], capture_output=True).stdout
    x = np.frombuffer(raw, np.int16).astype(float) / 32768
    w = np.array([np.sqrt((x[i:i + 960] ** 2).mean()) for i in range(0, max(1, len(x) - 960), 960)]) + 1e-9
    act = w[w > w.max() * 10 ** (-30 / 20)]
    return 20 * math.log10(math.sqrt((act ** 2).mean()))

def ganancia_sfx(cmd_in, tipo, a=None, b=None):
    """dB a aplicar (volume=…dB) para que el SFX quede en su pico de mezcla y además un 40 % más bajo."""
    return PICO.get(tipo, -26) - pico(cmd_in, a, b) + MENOS_40

if __name__ == "__main__":
    if sys.argv[1] == "--comprobar":
        v, s = rms_activo(["-i", sys.argv[2]]), rms_activo(["-i", sys.argv[3]])
        print(f"voz {v:.1f} dBFS RMS · SFX {s:.1f} → {s - v:+.1f} dB respecto a la voz "
              f"({'OK' if s - v <= -15 else 'DEMASIADO FUERTE: deberían quedar ≈ 20 dB por debajo'})")
