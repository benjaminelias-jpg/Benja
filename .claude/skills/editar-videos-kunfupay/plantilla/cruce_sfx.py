#!/usr/bin/env python3
"""revisor-sonido-video, paso de apariciones: cada SFX de meta.json debe caer ≤ 0,2 s de algo que aparece (apariciones.json)
o de un corte/luz del propio vídeo. Uso: cruce_sfx.py <video>"""
import json, sys
v = sys.argv[1]
a = [t for t, _ in json.load(open(f"qa/{v}/apariciones.json"))["apariciones"]]
m = json.load(open(f"{v}/meta.json"))
mal = 0
for k, t in m["events"]:
    if k in ("luz", "flash", "fall"): print(f"{t:6.2f} {k:6s} corte/luz del vídeo (revisar a ojo)"); continue
    d = min(abs(t - x) for x in a); ok = d <= .2; mal += not ok
    print(f"{t:6.2f} {k:6s} {'OK' if ok else '⚠'} (aparición a {d:.2f} s)")
print(f"== {v}: {len(m['events'])} SFX, {mal} sin aparición cerca")
