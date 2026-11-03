#!/usr/bin/env python3
"""Mezcla de un vídeo HUB: render de HyperFrames + voz original + música de Pixabay + SFX de Pixabay (eventos de meta.json).

Uso: python3 final.py <video>
- Música propia de cada vídeo (tranquila, lofi/chill), baja y con ducking bajo la voz.
- SFX nuevos de Pixabay (px/), SOLO donde aparece algo (tarjeta → swipe, chip/bandera/fila → pop, euros/dólares → moneda,
  ✓ → ding, ✕ → aviso suave, tachado → rotulador, isotipo → logo, luz → whoosh). Cada vídeo tiene sus variantes y rotan;
  un assert impide el mismo archivo en dos eventos seguidos (regla de Brayan, 29/10).
- Nivel: pico de mezcla por tipo (nivel.PICO) y un 40 % más bajo (×0,6). Van en una cama SIN ducking (con ducking quedaban
  ~30 dB bajo la voz, lección de Jorge), así que quedan ≈ 20 dB por debajo de la voz: se oyen, pero nada fuertes.
- Voz con compresión suave y máster con ganancia FIJA a −14 LUFS + limitador sobremuestreado (−1 dBTP); nunca loudnorm."""
import json, subprocess, sys, pathlib
import numpy as np

V = sys.argv[1]
ROOT = pathlib.Path(__file__).resolve().parent.parent
P, PX, R = ROOT / V, ROOT / "px", ROOT / V / "renders"
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))  # nivel.py va junto a este script
from nivel import PICO, MENOS_40, rms_activo

MUSIC = {"latam-pagos": ("mu-lp", 0.0), "latam-fiscal": ("mu-latam", 0.0), "dubai": ("mu-dubai", 0.0), "miami": ("mu-miami", 0.0), "bali": ("mu-bali", 0.0)}[V]
MUSIC_DB = -22
# tramos: (archivo, segundo de inicio en el archivo, entra, sale, dB extra)
# tramos: (archivo, inicio en el archivo, entra, sale, dB, fundido de entrada, fundido de salida). Fundidos de potencia constante (qsin)
# solapados sobre el corte de plano, para que el cambio de música caiga en el corte (Brayan 30/10: «cuida las transiciones»)
TRACKS = {
    # Dubái: enérgica al principio → «Nissan Altima» (Doechii, instrumental) desde el 14 s
    "dubai": [("mu-dubai-energetic", 8.0, 0.0, 14.6, 0.0, .6, 1.0), ("mu-dubai-nissan", 16.5, 13.6, None, 0.0, 1.0, 1.6)],
    # Bali (Brayan 30/10): 3 músicas. Principio tranquilo → se apaga antes de Hotmart (pausa) → cuerpo desde la luz de 17,6 s →
    # final más animado con el «drop» justo en el corte de 33,9 s. Fundidos de potencia constante (qsin) solapados en los cortes.
    # Miami (Brayan 30/10): hook animado → cuerpo estable → final enérgico; cambios solapados sobre los cortes de 5,33 s y 28,97 s
    # Brayan 30/10: el impacto del 27 % (3,6 s) da paso a la música del cuerpo, que sigue hasta el final (sin la 3.ª pieza)
    "miami": [("mu-miami-hook", 1.5, 0.0, 3.72, 0.0, .3, .14),        # hook: Hip Hop Beat (atlasaudio), se corta con el impacto
              ("mu-miami", 0.0, 3.55, None, -1.0, .2, 1.6)],          # cuerpo y CTA: Chill Hop (zephiramusic)
    # Bali (Brayan 30/10): la música de la segunda parte (Indie Rock, atlasaudio) en todo el vídeo; sigue en pausa durante Hotmart
    # LATAM pagos (Brayan 30/10): una música enérgica, baja para que se oiga la voz
    # (Brayan 30/10: la primera se hacía repetitiva) → se corta antes del tramo dramático y vuelve otra más enérgica tras él,
    # con su «drop» en el corte de 26,73 s (la luz)
    "latam-pagos": [("mu-lp", 0.0, 0.0, 21.7, -4.0, .6, .3), ("mu-miami-final", 16.32, 26.55, None, -4.0, .2, 1.6)],
    "bali": [("mu-bali-cuerpo", 1.0, 0.0, None, -3.0, .6, 1.6)],   # −3 dB: música algo más baja (Brayan 30/10)
}.get(V)
POOLS = {
    "latam-fiscal": dict(card=["sw-quick", "sw-132"], pop=["bp-406", "pop-subtle", "pop-433"], coin=["cn-digital", "cn-get"],
                         logo_s=["pop-bubbleui"], logo=["lg-piano141"], ok=["ok-friendly", "ok-ding570"], no=["no-err04"],
                         strike=["mk-scribble", "mk-highlight", "mk-marker"], luz=["sw-fast02"]),
    "dubai": dict(card=["sw-236", "sw-confirm"], pop=["bp-04", "pop-light", "bp-424"], coin=["cn-collect", "cn-drop"], logo=["lg-gentle"],
                  ok=["ok-correct356"], no=["no-err04", "no-err05"], luz=["sw-swoosh015"], flash=["sw-264"], fall=["fall-259"],
                  count=["ct-money432", "ct-banknote"], hit=["hit-soft67", "hit-boom"], positive=["pos-badge1"],
                  glitch=["dx-glitch"], wind=["dx-wind1"], pencil=["dx-pencil1", "dx-pencil2"], click=["tap-click0"]),
    "miami": dict(card=["sw-255", "sw-264"], pop=["bp-293", "pop-bubbleui", "bp-05"], coin=["cn-get", "cn-digital"], logo=["lg-short"],
                  ok=["ok-bright"], no=["no-warning"], luz=["sw-fast02"], count=["mi-count1", "mi-count2"], hit=["mi-impact1", "mi-impact2"]),
    "latam-pagos": dict(card=["lp-sw04", "lp-sw05", "lp-sw02"], pop=["lp-pop1", "lp-pop2", "lp-pop3", "lp-pop4"], ok=["lp-ok", "lp-ok2"], no=["lp-no"],
                        count=["lp-count"], hit=["lp-hit"], pencil=["lp-pen1", "lp-pen2"], positive=["lp-pos"], luz=["lp-whoosh"]),
    "bali": dict(card=["sw-swoosh015", "sw-fast02"], pop=["bp-424", "pop-subtle", "bp-293"], coin=["cn-drop", "cn-collect"], logo=["lg-calm"],
                 ok=["ok-simple"], no=["no-negative"], luz=["sw-quick"], count=["ct-banknote", "ct-money95"], hit=["hit-elec", "hit-boom"],
                 positive=["pos-magic"], tap=["tap-short"], click=["tap-soft"], pencil=["rm-pencil1", "rm-pencil2"]),
}[V]
# tipo de evento → (tipo de pico de nivel.PICO, duración del recorte, fundido de salida, ¿el golpe es el pico? (whoosh) o el arranque)
KIND = {"card": ("whoosh_soft", .6, .12, True), "pop": ("bubble", .35, .08, False), "coin": ("coin", .7, .2, False),
        "logo_s": ("bubble", .4, .1, False), "logo": ("glass", 1.8, .9, False), "ok": ("done", .8, .25, False), "no": ("glass", .6, .2, False),
        "strike": ("paper", .4, .1, False), "luz": ("whoosh_soft", .8, .2, True), "flash": ("whoosh_soft", .7, .2, True), "fall": ("impact_s", .8, .25, False),
        "count": ("tick", .66, .12, False), "glitch": ("glitch", .5, .15, False), "click": ("tick", .3, .08, False), "wind": ("whoosh_soft", .9, .3, True), "pencil": ("paper", .65, .15, False), "rm_glitch": ("glitch", .25, .06, False), "rm_whoosh": ("whoosh_soft", .55, .12, True),
        "rm_pen1": ("paper", .5, .12, False), "rm_pen2": ("paper", .6, .12, False), "rm_arrow": ("paper", .45, .1, False), "hit": ("impact_s", .9, .4, False), "positive": ("done", 1.1, .5, False), "tap": ("tick", .25, .06, False)}
# Bali (Brayan 30/10): la frase de Hotmart con voz de radio y la música en pausa hasta la luz de película
RADIO = {"bali": (14.25, 17.4), "latam-pagos": (21.6, 26.2)}.get(V)
MUSIC_OFF = {"bali": (14.1, 17.6), "latam-pagos": (21.45, 26.6)}.get(V)
VOICE_DB = {"bali": 2.0}.get(V, 0.0)   # Brayan 30/10: «eleva un poquito la voz» en Bali
# Dubái (Brayan 30/10): el glitch, el viento, el destello, la caída y el clic del principio no se oían bajo la música enérgica → más altos
BOOST = {"luz": 6, "flash": 10, "strike": -3, "pencil": -3, "glitch": 12, "wind": 11, "click": 9, "fall": 7}

def run(args): subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)
def env(f):
    a = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", str(PX / f"{f}.mp3"), "-ac", "1", "-ar", "48000", "-f", "s16le", "-"],
                                     capture_output=True).stdout, np.int16).astype(float) / 32768
    e = 20 * np.log10(np.array([np.sqrt((a[i:i + 480] ** 2).mean()) for i in range(0, len(a) - 480, 480)]) + 1e-9)
    return a, e
def cut(f, d, is_peak):
    """inicio del recorte y adelanto: el golpe (arranque, o el pico en los whoosh) cae justo en el momento del evento"""
    a, e = env(f)
    on = int(np.argmax(e > e.max() - 14)) / 100
    pk = int(np.argmax(e)) / 100
    st = max(0, on - .02)
    if is_peak: st = max(0, pk - .35)
    seg = a[int(st * 48000): int((st + d) * 48000)]
    return st, (pk - st if is_peak else on - st), 20 * np.log10(np.abs(seg).max() + 1e-9)

meta = json.load(open(P / "meta.json")); DUR = meta["dur"]
SRC = ROOT / f"fuente/{V}.mp4"
# voz mejorada con Magnific (aislamiento de voz) si existe; si no, la del vídeo original
MAG = ROOT / f"voz/{V}-magnific.mp3"
VSRC = MAG if MAG.exists() else SRC
VOZ = rms_activo(["-i", str(VSRC)]); OFF = VOZ - (-20.0)       # niveles pensados para una voz a −20 dBFS RMS

# 1) cama de SFX (sin ducking) con rotación de variantes
ins, fc, mix, used = [], [], [], []
def inp(p): ins.extend(["-i", str(p)]); return len(ins) // 2 - 1
nxt = {}
for k, (kind, t) in enumerate(meta["events"]):
    pool = POOLS[kind]; i0 = nxt.get(kind, 0)
    f = pool[i0 % len(pool)]
    if used and used[-1][0] == f and len(pool) > 1: i0 += 1; f = pool[i0 % len(pool)]
    nxt[kind] = i0 + 1
    used.append((f, kind, t))
    tipo, d, fade, is_peak = KIND[kind]
    st, lead, pk = cut(f, d, is_peak)
    g = PICO.get(tipo, -26) - pk + MENOS_40 + OFF + BOOST.get(kind, 0)
    j = inp(PX / f"{f}.mp3")
    ms = int(max(0, t - lead) * 1000)
    fc.append(f"[{j}:a]aresample=48000,aformat=channel_layouts=stereo,atrim={st:.3f}:{st + d:.3f},asetpts=PTS-STARTPTS,volume={g:.2f}dB,"
              f"afade=t=out:st={max(0, d - fade):.3f}:d={fade},adelay={ms}:all=1[s{k}]"); mix.append(f"[s{k}]")
for (a, ka, ta), (b, kb, tb) in zip(used, used[1:]):
    assert a != b, f"mismo SFX seguido: {a} ({ka} {ta}) → ({kb} {tb})"
fc.append(f"{''.join(mix)}amix=inputs={len(mix)}:normalize=0:duration=longest,apad=whole_dur={DUR},atrim=0:{DUR}[sfx]")
run([*ins, "-filter_complex", ";".join(fc), "-map", "[sfx]", "-c:a", "pcm_s24le", str(R / "sfx.wav")])

# 2) voz comprimida + música con ducking + SFX → premezcla
mf, m0 = MUSIC
if RADIO:   # voz de radio: banda 350–3200 Hz, algo de saturación, solo en ese tramo (fundido de 40 ms)
    a, b = RADIO
    env = f"clip(min((t-{a})/0.04,({b}-t)/0.04),0,1)"
    VOICE = (f"[0:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{DUR},asplit[vn][vr];"
             f"[vr]highpass=f=350,highpass=f=350,lowpass=f=3200,lowpass=f=3200,acompressor=threshold=0.05:ratio=6:attack=2:release=80,"
             f"asoftclip=type=tanh,volume=4dB,volume='{env}':eval=frame[r];[vn]volume='1-{env}':eval=frame[n];[n][r]amix=inputs=2:normalize=0,")
else:
    VOICE = f"[0:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{DUR},"
VOICE = VOICE.replace("atrim=0:" + str(DUR) + ",", "atrim=0:" + str(DUR) + f",volume={VOICE_DB}dB,", 1)
MOFF = ""
if MUSIC_OFF:
    a, b = MUSIC_OFF
    MOFF = f",volume='clip(({a}-t)/0.3,0,1)+clip((t-{b})/0.15,0,1)':eval=frame"
if TRACKS:   # varios temas encadenados con fundido cruzado de 1 s, ya mezclados en una sola pista de música
    tin, tfc = [], []
    for k, (f, st, a, b, db, fi, fo) in enumerate(TRACKS):
        b = DUR if b is None else b
        tin += ["-i", str(PX / f"{f}.mp3")]
        lvl = rms_activo(["-i", str(PX / f"{f}.mp3")], st, st + b - a)   # cada tema a −15 dBFS RMS: los cambios no saltan de volumen
        tfc.append(f"[{k}:a]aresample=48000,aformat=channel_layouts=stereo,atrim={st}:{st + b - a:.3f},asetpts=PTS-STARTPTS,"
                   f"afade=t=in:d={fi}:curve=qsin,afade=t=out:st={b - a - fo:.3f}:d={fo}:curve=qsin,"
                   f"volume={-15 - lvl + db:.2f}dB,adelay={int(a * 1000)}:all=1[t{k}]")
    tfc.append(f"{''.join(f'[t{k}]' for k in range(len(TRACKS)))}amix=inputs={len(TRACKS)}:normalize=0:duration=longest,apad=whole_dur={DUR},atrim=0:{DUR}[m]")
    run([*tin, "-filter_complex", ";".join(tfc), "-map", "[m]", "-c:a", "pcm_s24le", str(R / "music.wav")])
    MUS_IN = R / "music.wav"; m0 = 0
    MUSIC_FC = f"[1:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{DUR},asetpts=PTS-STARTPTS,volume={MUSIC_DB + OFF:.2f}dB{MOFF}[mu];"
else:
    MUS_IN = PX / f"{mf}.mp3"
    MUSIC_FC = (f"[1:a]aresample=48000,aformat=channel_layouts=stereo,atrim={m0}:{m0 + DUR},asetpts=PTS-STARTPTS,volume={MUSIC_DB + OFF:.2f}dB{MOFF},"
                f"afade=t=in:d=0.6,afade=t=out:st={DUR - 1.6:.3f}:d=1.6[mu];")
run(["-i", str(VSRC), "-i", str(MUS_IN), "-i", str(R / "sfx.wav"), "-filter_complex",
     VOICE +
     f"acompressor=threshold={10 ** ((VOZ + 7) / 20):.4f}:ratio=4:attack=1:release=150:knee=6,asplit[v][vk];" +
     MUSIC_FC +
     "[mu][vk]sidechaincompress=threshold=0.04:ratio=4:attack=20:release=380[duck];"
     "[v][duck][2:a]amix=inputs=3:normalize=0[a]", "-map", "[a]", "-c:a", "pcm_s24le", str(R / "premix.wav")])
r = subprocess.run(["ffmpeg", "-i", str(R / "premix.wav"), "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
I = float(r.rsplit("I:", 1)[1].split("LUFS")[0])

# 3) máster: ganancia fija a −14 LUFS + limitador sobremuestreado (−1 dBTP)
OUT = ROOT / f"renders/kunfupay-hub-{V}.mp4"
run(["-i", str(R / "hf.mp4"), "-i", str(R / "premix.wav"), "-filter_complex",
     f"[0:v]fps=30,format=yuv420p[v];[1:a]volume={-14 - I:.2f}dB,aresample=192000,alimiter=limit=0.8:attack=5:release=150:level=disabled,aresample=48000[a]",
     "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p",
     "-c:a", "aac", "-b:a", "192k", "-t", f"{DUR}", "-movflags", "+faststart", str(OUT)])
run(["-i", str(OUT), "-c:v", "libx264", "-crf", "26", "-preset", "slow", "-vf", "scale=720:1280", "-c:a", "aac", "-b:a", "128k",
     "-movflags", "+faststart", str(ROOT / f"renders/kunfupay-hub-{V}-ligero.mp4")])
json.dump([dict(sfx=f, tipo=k, t=t) for f, k, t in used], open(P / "sfx-usados.json", "w"), ensure_ascii=False, indent=1)
print(f"OK {OUT.name} · voz {VOZ:.1f} dBFS RMS (cama {OFF:+.1f} dB) · premezcla {I:.1f} LUFS · {len(used)} SFX")
