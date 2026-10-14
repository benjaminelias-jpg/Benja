"""Build the sound for 'La clave está en los detalles' from the composition's own timing.

  python3 audio/build_audio.py            (run from the project folder)

Reads the timing JSON embedded in index.html (the same constants that drive the animation) and writes
audio/events.json for procedural-sfx's mix.py. Only air and contact sounds: no pad, no sustained tones.
"""
import json
import pathlib
import re

HERE = pathlib.Path(__file__).resolve().parent
PROJECT = HERE.parent

html = (PROJECT / "index.html").read_text(encoding="utf-8")
T = json.loads(re.search(r'<script type="application/json" id="timing">(.*?)</script>', html, re.S).group(1))

# The swoosh-in is an expo-out slide: fastest right after it starts. A whoosh is loudest at its middle.
swoosh_in_peak = T["keyIn"] + 0.09
# The handoff: the text rushes in from the camera while the key recedes; loudest ~0.3 s in.
handoff_peak = T["shift"] + 0.3
# The key is visually at rest ~0.3 s after it starts (98% of the slide).
key_rests = round(T["keyIn"] + 0.3, 3)

events = {
    "dur": T["end"],
    "events": [
        {"t": round(swoosh_in_peak - 0.45 / 2, 3), "type": "whoosh", "args": {"d": 0.45, "lo": 700, "hi": 3800},
         "gain": 0.36, "pan": -0.25, "name": "the key swooshes in"},
        {"t": key_rests, "type": "clink", "args": {}, "gain": 0.22, "name": "the key comes to rest on the paper"},
        {"t": round(handoff_peak - 0.6 / 2, 3), "type": "whoosh", "args": {"d": 0.6, "lo": 350, "hi": 2000},
         "gain": 0.32, "name": "the sentence rushes in, the key steps back"},
    ],
}
(HERE / "events.json").write_text(json.dumps(events, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"timing": T, "events": [(e["type"], e["t"]) for e in events["events"]]}))
