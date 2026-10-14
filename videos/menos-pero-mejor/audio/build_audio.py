"""Build the sound for 'Menos, pero mejor' from the composition's own timing.

  python3 audio/build_audio.py            (run from the project folder)

Reads the timing JSON embedded in index.html (the same constants that drive the animation), then writes:
  audio/events.json  - SFX events for procedural-sfx's mix.py
  audio/pad.wav      - a soft sustained chord: Csus4 that resolves to C major when the period lands
"""
import json
import pathlib
import re

import numpy as np
import soundfile as sf

HERE = pathlib.Path(__file__).resolve().parent
PROJECT = HERE.parent
SR = 48000
DUR = 5.0

html = (PROJECT / "index.html").read_text(encoding="utf-8")
T = json.loads(re.search(r'<script type="application/json" id="timing">(.*?)</script>', html, re.S).group(1))

# The dot's drop is a quart in-out: it is visually at rest ~85% of the way through. That is the full stop.
settle = round(T["drop"] + 0.85 * (T["land"] - T["drop"]), 3)

# Motion peaks (fastest frame) for the two lines' swishes.
stretch_peak = T["stretch"] + 0.85 / 2   # width tween: 0.85 s, symmetric in-out
retract_peak = T["retract"] + 0.85 / 2   # retract tween: 0.85 s, symmetric in-out

G6, C5 = 1567.98, 523.25
events = {
    "dur": DUR,
    "events": [
        {"t": T["dotIn"], "type": "soft_tap", "args": {"f": G6}, "gain": 0.26, "name": "the dot appears"},
        {"t": round(stretch_peak - 0.5 * 0.8, 3), "type": "air",
         "args": {"d": 0.8, "f0": 450, "f1": 2400, "skew": 0.5}, "gain": 0.15, "name": "the dot stretches into a line"},
        {"t": round(retract_peak - 0.55 * 0.75, 3), "type": "air",
         "args": {"d": 0.75, "f0": 2200, "f1": 520, "skew": 0.55}, "gain": 0.10, "pan": 0.2,
         "name": "the line pulls back into the dot"},
        {"t": settle, "type": "tock", "args": {"f": C5}, "gain": 0.36, "pan": 0.25, "name": "the period lands"},
    ],
}
(HERE / "events.json").write_text(json.dumps(events, indent=2) + "\n", encoding="utf-8")

# ---- pad -----------------------------------------------------------------------------------------
n = int(DUR * SR)
t = np.arange(n) / SR


def smooth(x0, x1, a, b):
    """0 before a, 1 after b, raised-cosine in between."""
    p = np.clip((t - a) / max(b - a, 1e-9), 0, 1)
    return x0 + (x1 - x0) * (0.5 - 0.5 * np.cos(np.pi * p))


def voice(f, pan, amp, gate=None):
    """Two detuned sines (+/-3 cents) with soft 2nd/3rd harmonics, equal-power panned."""
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


resolve = smooth(0.0, 1.0, settle - 0.06, settle + 0.18)       # sus4 -> major third
pad = (voice(130.81, -0.10, 0.40)                               # C3
       + voice(196.00, 0.25, 0.42)                              # G3
       + voice(261.63, -0.30, 0.38)                             # C4
       + voice(349.23, 0.35, 0.30, gate=1 - resolve)            # F4 (the suspension)
       + voice(329.63, 0.35, 0.30, gate=resolve)                # E4 (the resolution)
       + voice(392.00, -0.20, 0.24))                            # G4

# Brightness: dark at first, opens when the words appear.
from scipy.signal import butter, sosfiltfilt  # noqa: E402

dark = sosfiltfilt(butter(2, 900, "low", fs=SR, output="sos"), pad, axis=0)
bright = sosfiltfilt(butter(2, 2600, "low", fs=SR, output="sos"), pad, axis=0)
mixw = smooth(0.0, 1.0, T["rise1"] - 0.2, T["rise1"] + 0.9)[:, None]
pad = dark * (1 - mixw) + bright * mixw

# Level: swells in with the dot, blooms with the words, fades to silence at the end so the loop is clean.
env = (smooth(0.0, 0.62, T["dotIn"], T["dotIn"] + 1.0)
       + smooth(0.0, 0.38, T["rise1"] - 0.1, T["rise1"] + 0.9)) * smooth(1.0, 0.0, 4.0, DUR)
pad = pad * env[:, None]
pad = pad / np.max(np.abs(pad)) * 0.5
sf.write(HERE / "pad.wav", pad.astype(np.float32), SR, subtype="FLOAT")

print(json.dumps({"timing": T, "settle": settle, "events": [(e["type"], e["t"]) for e in events["events"]]}))
