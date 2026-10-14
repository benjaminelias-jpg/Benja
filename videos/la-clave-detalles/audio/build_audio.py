"""Build the sound for 'La clave está en los detalles' (v3) from the composition's own timing.

  python3 audio/build_audio.py            (run from the project folder)

Sources (audio/src/, generated with Magnific and edited with ffmpeg):
  music.wav  Google Lyria 3 underscore (felt piano, upright bass, light percussion), first 6.6 s, faded out
  swish.wav  ElevenLabs SFX: a key thrown past the mic
  clink.wav  ElevenLabs SFX: brass key hitting paper on a desk (impact only, trimmed)
  slide.wav  ElevenLabs SFX: the same take's paper slide, moved to right after the impact
  swell.wav  ElevenLabs SFX: soft cinematic transition swell
  air.wav    ElevenLabs SFX: airy transition swish
  tink.wav   ElevenLabs SFX: a light metal tink (trimmed)

Writes audio/events.json for procedural-sfx's mix.py (music goes in with --music). Every time comes from
the timing JSON in index.html; the visual hits sit on the music's bass downbeats.
"""
import json
import pathlib
import re

HERE = pathlib.Path(__file__).resolve().parent
PROJECT = HERE.parent

html = (PROJECT / "index.html").read_text(encoding="utf-8")
T = json.loads(re.search(r'<script type="application/json" id="timing">(.*?)</script>', html, re.S).group(1))

# Reference points inside each source file (seconds): where its loudest moment / attack is.
SWISH_PEAK, CLINK_ONSET, SLIDE_PEAK, SWELL_PEAK, AIR_PEAK = 0.195, 0.010, 0.185, 0.539, 0.406


def file_event(t, name, gain, label, pan=0.0, bus="vo"):
    """Hero sounds go on the 'vo' bus so mix.py dips the music a little under them (--duck-db)."""
    return {"t": round(t, 3), "type": "file", "file": f"src/{name}.wav", "bus": bus, "gain": gain, "pan": pan,
            "name": label}


slide_mid = T["impact"] + (T["stop"] - T["impact"]) * 0.55
glint2_on_bow = T["glint2"] + 0.35 * 0.8

events = {
    "dur": T["end"],
    "events": [
        file_event(T["impact"] - 0.095 - SWISH_PEAK, "swish", 0.6, "the key flies in", pan=0.15),
        file_event(T["impact"] - CLINK_ONSET, "clink", 0.8, "the key hits the paper"),
        file_event(slide_mid - SLIDE_PEAK, "slide", 0.34, "the key slides to a stop"),
        file_event(3.115 - SWELL_PEAK, "swell", 0.95, "the camera rises (on the downbeat)"),
        file_event(T["words"] + 0.18 - AIR_PEAK, "air", 0.42, "the words arrive"),
        file_event(glint2_on_bow, "tink", 3.6, "light on the key, far away", pan=-0.2, bus="sfx"),
    ],
}
(HERE / "events.json").write_text(json.dumps(events, indent=2) + "\n", encoding="utf-8")
print(json.dumps([(e["name"], e["t"]) for e in events["events"]], ensure_ascii=False))
