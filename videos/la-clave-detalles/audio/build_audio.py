"""Build the sound for 'La clave está en los detalles' from the composition's own timing.

  python3 audio/build_audio.py            (run from the project folder)

Reads the timing JSON embedded in index.html (the same constants that drive the animation), then writes:
  audio/events.json  - SFX events for procedural-sfx's mix.py
  audio/pad.wav      - a soft sustained chord: Dsus4 that resolves to D major when the key clicks
"""
import json
import pathlib
import re

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfiltfilt

HERE = pathlib.Path(__file__).resolve().parent
PROJECT = HERE.parent
SR = 48000

html = (PROJECT / "index.html").read_text(encoding="utf-8")
T = json.loads(re.search(r'<script type="application/json" id="timing">(.*?)</script>', html, re.S).group(1))
DUR = float(T["end"])

# The glint band crosses the bow (~17% of the key's width) about 35% into its 1.1 s in-out sweep.
glint_on_bow = round(T["glint"] + 0.35 * 1.1, 3)

events = {
    "dur": DUR,
    "events": [
        {"t": round(T["keyIn"] + 0.035, 3), "type": "air", "args": {"d": 0.9, "f0": 380, "f1": 2100, "skew": 0.35},
         "gain": 0.13, "name": "the key flies in"},
        {"t": round(T["keyIn"] + 0.25, 3), "type": "shimmer", "args": {"d": 1.6, "f": 2637.0},
         "gain": 0.09, "name": "the key comes into focus"},
        {"t": T["unlock"], "type": "slide", "args": {"d": 0.3}, "gain": 0.08, "name": "the key pushes into the lock"},
        {"t": T["snap"], "type": "lock_click", "args": {}, "gain": 0.38, "name": "the key turns: click"},
        {"t": glint_on_bow, "type": "ting", "args": {"f": 1760.0}, "gain": 0.2, "pan": -0.35,
         "name": "light crosses the bow"},
    ],
}
(HERE / "events.json").write_text(json.dumps(events, indent=2) + "\n", encoding="utf-8")

# ---- pad -----------------------------------------------------------------------------------------
n = int(DUR * SR)
t = np.arange(n) / SR


def smooth(x0, x1, a, b):
    """x0 before a, x1 after b, raised-cosine in between."""
    p = np.clip((t - a) / max(b - a, 1e-9), 0, 1)
    return x0 + (x1 - x0) * (0.5 - 0.5 * np.cos(np.pi * p))


def voice(f, pan, amp, gate=None):
    """Two detuned sines (+/-3 cents) with soft harmonics, equal-power panned."""
    out = np.zeros((n, 2))
    for cents, ch_bias in ((-3, -0.15), (3, 0.15)):
        fr = f * 2 ** (cents / 1200)
        x = (np.sin(2 * np.pi * fr * t) + 0.32 * np.sin(2 * np.pi * 2 * fr * t + 0.7)
             + 0.14 * np.sin(2 * np.pi * 3 * fr * t + 1.3) + 0.06 * np.sin(2 * np.pi * 4 * fr * t + 2.1))
        if gate is not None:
            x = x * gate
        p = np.clip(pan + ch_bias, -1, 1)
        out[:, 0] += x * np.cos((p + 1) * np.pi / 4)
        out[:, 1] += x * np.sin((p + 1) * np.pi / 4)
    return out * amp


resolve = smooth(0.0, 1.0, T["snap"] - 0.04, T["snap"] + 0.16)    # sus4 -> major third, on the click
pad = (voice(146.83, -0.10, 0.40)                                   # D3
       + voice(220.00, 0.25, 0.42)                                  # A3
       + voice(293.66, -0.30, 0.36)                                 # D4
       + voice(392.00, 0.35, 0.28, gate=1 - resolve)                # G4 (the suspension)
       + voice(369.99, 0.35, 0.28, gate=resolve)                    # F#4 (the resolution)
       + voice(440.00, -0.20, 0.22))                                # A4

dark = sosfiltfilt(butter(2, 900, "low", fs=SR, output="sos"), pad, axis=0)
bright = sosfiltfilt(butter(2, 2600, "low", fs=SR, output="sos"), pad, axis=0)
mixw = smooth(0.0, 1.0, T["snap"] - 0.3, T["snap"] + 0.8)[:, None]    # opens up when the key unlocks
pad = dark * (1 - mixw) + bright * mixw

env = (smooth(0.0, 0.6, T["keyIn"], T["keyIn"] + 1.2)
       + smooth(0.0, 0.4, T["snap"] - 0.1, T["snap"] + 0.9)) * smooth(1.0, 0.0, DUR - 1.0, DUR)
pad = pad * env[:, None]
pad = pad / np.max(np.abs(pad)) * 0.5
sf.write(HERE / "pad.wav", pad.astype(np.float32), SR, subtype="FLOAT")

print(json.dumps({"timing": T, "events": [(e["type"], e["t"]) for e in events["events"]]}))
