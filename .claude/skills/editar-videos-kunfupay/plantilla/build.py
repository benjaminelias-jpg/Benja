#!/usr/bin/env python3
"""Kunfupay · vídeos HUB (LATAM fiscal, Dubái, Miami, Bali): subtítulos a una línea + infografías de cristal claro arriba.

Uso: python3 build.py <video>  → <video>/index.html (HyperFrames) + <video>/meta.json (eventos de SFX para final.py).

Pedido de Brayan (30/10): sin títulos grandes, SFX a volumen nada fuerte y, donde hay aire arriba, infografías o cifras.
- Subtítulos: Roboto Medium, UNA línea (≤ 30 caracteres), sin borde ni puntuación, sombra suave. Sin palabras grandes.
- Tarjetas: liquid glass claro y compacto en el aire de arriba, DETRÁS de la persona (recorte de remove-background) salvo
  las marcadas `front`. Títulos en Jakarta SemiBold, ítems en Medium. Banderas, iconos (iconos-trazo-acento), métodos de
  pago y logo salen de sistema-visual/. Isotipo oficial «ku» sin wordmark. Sin naranja: no hay súper-CTA ni botón en vídeo.
- Cifras: el «27 %» / «30 %» de la voz NO va en tarjeta (sin fuente; ops-revisor ya lo retiró en Classroom). Solo en el
  subtítulo, porque lo dice la voz.
- Cámara: empuje lento por plano, reencuadre seco a mitad de los planos largos y UNA luz de película en el corte que abre
  la solución («Pero con tu enlace de Kunfupay…»)."""
import json, pathlib, re, sys, unicodedata

V = sys.argv[1]
ROOT = pathlib.Path(__file__).resolve().parent.parent
P = ROOT / V
EV = []
def ev(kind, t): EV.append((kind, round(t, 3)))

# ------------------------------------------------------------------ fichas por vídeo
# tarjetas: (tipo, entra, sale, contenido). Tiempos sacados de la transcripción palabra a palabra (qa/<video>.json).
FLAGS_LATAM = ["mx", "co", "ar"]
if V == "latam-fiscal":
    DUR = 48.066
    CUTS = [0, 5, 6.7, 11.967, 14.467, 18.433, 24.033, 27.7, 35.333, 37.567, 45.2]
    LUZ = ("033", 11.967)                      # «Cobrá clientes de cualquier país»: empieza la solución
    FIX = {}   # «Cobre» se deja como lo transcribe la voz (ops-revisor)
    HIDE = [(29.66, 37.45), (37.55, 41.2)]       # la lista «te ahorras…» y las pills dicen lo mismo que la voz
    CARDS = [
        dict(k="chips", t0=0.78, t1=3.9, items=[(0.84, "fl:mx"), (0.98, "fl:co"), (1.12, "fl:ar"), (1.3, "tx:LATAM")]),
        dict(k="chips", t0=4.1, t1=6.62, items=[(4.2, "tx:LLC"), (5.84, "fl:us|Empresa en EE. UU.")]),
        dict(k="chips", t0=9.5, t1=11.75, items=[(9.64, "iso"), (10.16, "tx:LLC", ("x", 10.9))]),
        dict(k="chips", t0=12.75, t1=15.3, items=[(12.9 + k * .12, f"fl:{c}") for k, c in enumerate(["es", "mx", "co", "ar", "us"])]),
        dict(k="chips", t0=15.55, t1=23.95, eyebrow="DE CADA VENTA",
             items=[(15.7, "ic:factura|Factura", ("ok", 17.56)), (20.06, "ic:comision|Impuestos de la venta", ("ok", 23.04))]),   # «de la venta»: alcance MoR (ops-revisor)
        dict(k="chips", t0=24.9, t1=27.55, items=[(25.16, "cn:eu|Euros"), (25.98, "cn:us|Dólares")]),
        dict(k="chips", t0=29.75, t1=37.4, eyebrow="TE AHORRAS", wrap=True,
             items=[(30.24, "tx:LLC", ("x", 30.6)), (31.12, "tx:Renovación anual", ("x", 32.05)),
                    (36.06, "tx:Papeleo", ("x", 36.5))]),   # sin «Asesor fiscal»: el creador sigue necesitando el suyo (ops-revisor, KB)
        dict(k="chips", t0=37.5, t1=43.85, col=True,
             items=[(37.62, "pl:−|Impuestos que gestionar"), (39.46, "pl:−|Papeleo"), (40.74, "pl:+|Tiempo")]),
        dict(k="iso", t0=45.26, t1=DUR),
    ]
elif V == "dubai":
    DUR = 44.8
    CUTS = [0, 1.5, 4.4, 5.1, 14.6, 23.733, 25.867, 31.033, 35.333, 41.3]
    LUZ = ("041", 23.733)
    FIX = {"Kungfupay": "Kunfupay", "Dubai": "Dubái"}
    HIDE = []
    CARDS = [
        # Brayan 30/10: bandera sola y animada, Stripe con su logo, sin recuadro (delante: camina y la cabeza los tapaba)
        dict(k="free", t0=6.7, t1=9.6, front=True, items=[(6.86, "fl:ae", 330, 190, 150), (8.3, "mp:stripe", 720, 190, 0)]),
        dict(k="num", t0=9.95, t1=13.6, pre="HASTA UN", n=27, suf="%", count=(10.3, .7), top=110, x=380),   # 27 % detrás de él, con contador; a la izquierda: camina por la derecha
        dict(k="rows", t0=15.1, t1=23.55,                                                                # desde 0:16, sin tocar (Brayan)
             items=[(15.26, "fl:es", "España · sin su método local", ("no", 22.5)),
                    (18.8, "fl:mx,co,ar", "Latinoamérica · sin su método local", ("no", 22.78))]),
        dict(k="link", t0=23.95, t1=25.72, text="Tu enlace de Kunfupay", mark=("ok", 25.42)),
        dict(k="chips", t0=25.86, t1=30.85, items=[(26.56, "mp:bizum"), (27.14, "mp:oxxo"), (27.64, "mp:bancolombia"), (29.66, "ic:bitcoin|Cripto")]),
        dict(k="sketch", t0=31.9, t1=35.2, items=[(31.98, "usd", 250, 330), (32.78, "eur", 830, 330)]),   # dólares y euros a mano, lápiz morado (como Bali, Brayan 30/10)
        dict(k="num", t0=37.8, t1=41.2, pre="HASTA UN", n=27, suf="%", count=(38.2, .8), top=120),
        dict(k="iso", t0=41.62, t1=DUR, snd="positive"),   # «Hacé clic en el enlace»: isotipo + sonido positivo
    ]
    ZOOM = [(10.3, 1.10, .8), (19.6, 1.08, .9)]   # planos largos: un zoom suave cada uno, sin abusar (Brayan)
elif V == "miami":
    DUR = 37.633
    CUTS = [0, 1.267, 2.233, 5.333, 13.033, 16.133, 18.867, 24.133, 28.967, 35.367]
    LUZ = ("025", 13.033)
    FIX = {"ley": "link", "Imaginate": "Imagínate"}
    MERGE = {("con", "Fupay"): "Kunfupay"}
    HIDE = []
    CARDS = [
        # Brayan 30/10: menos recuadros; bandera sola y animada; logos de las compañías que se nombran
        dict(k="free", t0=0.6, t1=2.72, front=True, items=[(0.76, "wv:us", 330, 270, 260), (1.82, "mp:stripe", 720, 270, 0)]),   # bandera más grande y ondeando (Brayan 30/10)
        dict(k="num", t0=2.75, t1=5.25, pre="HASTA UN", n=27, suf="%", count=(3.0, .6), top=110),   # 27 % detrás de él; el impacto da paso a la música del cuerpo
        dict(k="free", t0=5.65, t1=8.4, items=[(5.8, "wv:mx", 200, 300, 190), (5.95, "wv:co", 480, 200, 190), (6.1, "wv:ar", 860, 300, 190)]),   # ondean como la de EE. UU. (Brayan 30/10)   # «clientes de LATAM»: sueltas por el negro
        dict(k="free", t0=8.45, t1=10.05, front=True, items=[(8.56, "lk:stripe|no@9.4", 540, 260, 0)]),        # «tu link de Stripe… no pueden»: enlace con logo + ✕
        dict(k="free", t0=13.25, t1=15.95, front=True, items=[(14.4, "lk:Tu enlace de Kunfupay|ok@15.08", 540, 260, 0)]),
        dict(k="free", t0=16.2, t1=18.75, front=True, items=[(16.78, "mp:bizum", 270, 315, 0), (17.38, "mp:oxxo", 540, 225, 0), (17.88, "mp:bancolombia", 810, 315, 0)]),
        dict(k="free", t0=19.7, t1=23.85, items=[(19.88, "wv:ar", 160, 520, 200), (20.98, "wv:co", 920, 520, 200)]),   # ondean (Brayan 30/10)   # solo banderas, a los lados de la cara
        dict(k="free", t0=25.5, t1=27.5, front=True, items=[(25.74, "ic:bitcoin|Cripto", 540, 300, 0)]),
        # (Brayan 30/10: fuera el 27 % del final)   # a la derecha: la cabeza está a la izquierda   # sin «→ Dólares»: la cripto se refleja en EUR (ops-revisor)
        dict(k="iso", t0=35.48, t1=DUR),
    ]
elif V == "latam-pagos":
    # Brayan 30/10: al estilo del vídeo LATAM (tarjetas de cristal arriba), banderas con emojis de Apple, SFX variados de Pixabay,
    # música enérgica baja y, en los planos largos, zoom suave + cámara en mano poco marcada
    DUR = 52.2
    CUTS = [0, 15.7, 18.533, 26.733, 35.067, 40.1, 43.867]
    LUZ = ("095", 26.733)                      # «Pero con tu enlace de Kunfupay»: empieza la solución
    FIX = {"Stipe": "Stripe"}
    HIDE = []
    CARDS = [
        # Brayan 30/10: NADA dentro de recuadros. Banderas sueltas (emoji de Apple), empresas con su logo, el resto en pastillas sueltas
        dict(k="free", t0=0.5, t1=2.5, items=[(0.64, "em:🇲🇽", 260, 300, 170), (0.78, "em:🇨🇴", 540, 220, 170), (0.92, "em:🇦🇷", 820, 300, 170)]),
        dict(k="free", t0=3.6, t1=9.3, front=True, items=[(3.76, "mp:hotmart", 340, 305, 0), (4.78, "mp:stripe", 740, 305, 0),
                                                            (5.70, "tx:LLC", 300, 430, 0), (7.58, "ic:banco|Transferencia", 770, 430, 0)]),
        dict(k="free", t0=9.45, t1=11.3, front=True, items=[(9.62, "tm:No es escalable|no@10.64", 540, 300, 0)]),
        dict(k="num", t0=12.3, t1=15.5, pre="HASTA UN", n=27, suf="%", count=(12.55, .7), top=110),   # detrás de él, con contador
        dict(k="free", t0=19.05, t1=21.45, front=True, items=[(19.18, "lk:Moneda local|no@20.7", 540, 210, 0)]),
        # 21,6–26,73 s «quiere comprar… lo único que hace es irse»: tramo dramático (B/N + grano, voz de radio, sin música)
        dict(k="free", t0=27.0, t1=29.8, front=True, items=[(27.1, "lk:Tu enlace de Kunfupay|ok@28.6", 540, 220, 0)]),
        dict(k="free", t0=30.0, t1=33.3, items=[(30.18, "em:🇦🇷", 250, 330, 170), (31.08, "em:🇪🇸", 540, 230, 170), (32.10, "em:🇺🇸", 830, 330, 170)]),
        dict(k="free", t0=35.45, t1=37.5, front=True, items=[(35.64, "mp:bizum", 300, 1300, 0), (36.08, "mp:oxxo", 540, 1300, 0), (36.58, "mp:bancolombia", 790, 1300, 0)]),
        dict(k="free", t0=38.2, t1=39.75, front=True, items=[(38.30, "ic:bitcoin|Cripto", 540, 1300, 0)]),
        dict(k="sketch", t0=41.3, t1=43.8, items=[(41.46, "eur", 150, 620), (42.16, "usd", 930, 620)]),   # € y $ a mano, lápiz morado
        dict(k="iso", t0=49.95, t1=DUR, snd="positive"),   # «hacé clic en el enlace»
    ]
    ZOOM = [(5.6, 1.08, .9), (12.55, 1.14, .5), (21.7, 1.08, .9), (30.1, 1.07, .9)]
    HANDHELD = [(0, 15.7, 5), (18.533, 26.733, 5), (26.733, 35.067, 4)]   # cámara en mano suave (px)
    BW = (21.6, 26.733); FILM = (21.6, 26.733)
elif V == "bali":
    DUR = 37.166
    CUTS = [0, 3.533, 6.567, 17.6, 19.667, 27.667, 33.9]
    LUZ = ("083", 17.6)
    FIX = {"Kungfupay": "Kunfupay", "Kungfupay.": "Kunfupay", "Paypal,": "PayPal,", "Hotmark": "Hotmart"}
    HIDE = []
    CARDS = [
        # Brayan 30/10: la bandera de Bali sola y fuera del recuadro; Stripe y PayPal con sus logos
        # banderas con los emojis de Apple (Brayan 30/10)
        dict(k="free", t0=0.75, t1=4.1, front=True, items=[(0.92, "em:🇮🇩", 540, 250, 150), (2.26, "mp:stripe", 290, 330, 0), (3.02, "mp:paypal", 800, 330, 0)]),   # delante: la cabeza tapaba los logos
        # cifras: animación DETRÁS de la persona, con cuenta (SFX de contador) y golpe al aterrizar
        dict(k="num", t0=4.2, t1=6.45, pre="HASTA UN", n=27, suf="%", count=(4.42, .58), top=110),   # 27 %: tamaño normal (Brayan 30/10: el gigante solo en el 30 %)
        # España y LATAM: banderas sueltas por el negro del plano, sin recuadro
        dict(k="free", t0=7.1, t1=10.9, items=[(7.2, "em:🇪🇸", 210, 420, 150), (7.62, "em:🇲🇽", 470, 250, 132), (7.78, "em:🇨🇴", 860, 330, 140), (7.94, "em:🇦🇷", 190, 760, 128)]),
        # «pinchan en el enlace… no les funciona»: encima del subtítulo
        dict(k="link", t0=11.08, t1=14.15, text="Enlace de pago", mark=("no", 13.6), top=1290, front=True, open=True),   # «pinchan en el enlace»: clic y se abre la caja (Brayan 30/10)
        dict(k="link", t0=18.05, t1=19.75, text="Tu enlace de Kunfupay", mark=("ok", 19.22), top=1290, front=True),   # sin aire arriba: sobre el subtítulo
        dict(k="chips", t0=19.9, t1=22.4, items=[(20.58, "mp:bizum"), (21.16, "mp:oxxo"), (21.6, "mp:bancolombia")]),          # 0:21–0:24 sin tocar (Brayan)
        dict(k="chips", t0=22.5, t1=24.35, items=[(22.62, "ic:al-instante|A cualquier hora"), (23.56, "tx:Sin escribirte")]),
        # € y $ dibujados a mano en morado, con trazo de lápiz imperfecto, en el negro de arriba (Brayan 30/10; sustituye a la escena Ramiro)
        dict(k="sketch", t0=26.15, t1=27.62, items=[(26.24, "eur", 250, 300), (26.86, "usd", 830, 300)]),
        dict(k="num", t0=30.18, t1=33.2, pre="MÁS DE UN", n=30, suf="%", count=(30.3, .6), top=330, size="xl"),   # 30 % gigante detrás de él (referencia de Brayan 30/10)
        dict(k="iso", t0=33.78, t1=DUR, pulse=36.2),   # «Kunfupay» final: latido del isotipo + sonido positivo
    ]
    BW = (14.28, 17.6)   # Hotmart: blanco y negro hasta la luz (y voz de radio + música en pausa en final.py)
MERGE = globals().get("MERGE", {})
TOP = 150          # el aire de arriba: bajo la barra de Reels, sobre la cabeza en los planos abiertos

# ------------------------------------------------------------------ subtítulos: una línea, sin puntuación
segs = json.load(open(ROOT / f"qa/{V}.json"))["segments"]
W = [dict(text=w["word"].strip(), start=w["start"], end=w["end"]) for s in segs for w in s["words"]]
for i in range(len(W) - 1):                                   # «27» «%» → «27 %»; «con Fupay» → «Kunfupay»
    if W[i + 1]["text"].startswith("%"): W[i]["text"] += " " + W[i + 1]["text"]; W[i]["end"] = W[i + 1]["end"]; W[i + 1]["text"] = ""
    if (W[i]["text"], W[i + 1]["text"]) in MERGE: W[i]["text"] = MERGE[(W[i]["text"], W[i + 1]["text"])]; W[i]["end"] = W[i + 1]["end"]; W[i + 1]["text"] = ""
W = [dict(w, text=FIX.get(w["text"], w["text"])) for w in W if w["text"]]
W = [dict(w, text=re.sub(r"(Kungfupay|Kunfupay)", "Kunfupay", w["text"])) for w in W]
W = [dict(w, text=re.sub(r"(\d)%", r"\1 %", w["text"])) for w in W]
clean = lambda s: re.sub(r"[.,;:¿?¡!…]", "", s)
txt = lambda ws: " ".join(clean(w["text"]) for w in ws)
# 1) cláusulas: se corta en la puntuación, en las pausas y en los tramos HIDE
CL, cur = [], []
for w in W:
    if any(a <= w["start"] < b for a, b in HIDE):
        if cur: CL.append(cur); cur = []
        continue
    if cur and w["start"] - cur[-1]["end"] > .45: CL.append(cur); cur = []
    cur.append(w)
    if re.search(r"[.,;?!]$", w["text"]): CL.append(cur); cur = []
if cur: CL.append(cur)
# 2) una cláusula larga se parte en trozos parejos (≤ 30 caracteres); 3) las muy cortas se juntan con la siguiente si caben
def split(ws):
    n = 1
    while True:
        tot = len(txt(ws)); out, cur = [], []
        for w in ws:
            if cur and len(txt(cur + [w])) > tot / n + 4 and len(out) < n - 1: out.append(cur); cur = []
            cur.append(w)
        out.append(cur)
        if all(len(txt(o)) <= 30 for o in out): return out
        n += 1
G = [p for c in CL for p in split(c)]
M = []
for g in G:
    if M and (len(txt(M[-1])) < 11 or len(txt(g)) < 9) and len(txt(M[-1] + g)) <= 30 and g[0]["start"] - M[-1][-1]["end"] < .35: M[-1] = M[-1] + g
    else: M.append(g)
SUBS = [dict(text=txt(g), start=g[0]["start"], last=g[-1]["end"]) for g in M]
for k, s in enumerate(SUBS):
    nxt = SUBS[k + 1]["start"] if k + 1 < len(SUBS) else DUR
    hide = min([a for a, _ in HIDE if a > s["start"]] + [DUR])
    s["end"] = round(min(s.pop("last") + .3, nxt - .04, hide - .03, DUR - .05), 3)
    s["start"] = round(max(0, s["start"] - .04), 3)
    assert len(s["text"]) <= 32, s

# ------------------------------------------------------------------ activos de sistema-visual (sin redibujar)
def svgfile(p, w):
    s = re.sub(r"<!--.*?-->", "", (P / p).read_text(), flags=re.S)
    vb = [float(x) for x in re.search(r'viewBox="([^"]+)"', s).group(1).split()]
    s = re.sub(r'\swidth="[\d.]+"', "", s, count=1); s = re.sub(r'\sheight="[\d.]+"', "", s, count=1)
    return s.replace("<svg ", f'<svg width="{w}" height="{w * vb[3] / vb[2]:.0f}" ', 1)
ICON = lambda n: (P / f"assets/iconos/{n}.svg").read_text()
FL = lambda c, cls="": f'<i class="fl {cls}"><img src="assets/banderas/{c}.svg"></i>'
CHECK = '<svg viewBox="0 0 30 30"><path d="M6 15.5l6 6L24 9" fill="none" stroke="var(--neutral-0)" stroke-width="4.5"/></svg>'
CROSS = '<svg viewBox="0 0 30 30"><path d="M8 8l14 14M22 8L8 22" fill="none" stroke="var(--neutral-0)" stroke-width="4.5"/></svg>'
ARROW = '<svg viewBox="0 0 40 24"><path d="M2 12h32M24 3l10 9-10 9" fill="none" stroke="var(--primary-600)" stroke-width="4"/></svg>'
ISO_S = svgfile("assets/kunfupay-logo-oficial.svg", 64)   # en línea: HyperFrames descarta un <img> repetido (el logo grande ya es <img>)
ISO_L = '<img src="assets/kunfupay-logo-oficial.svg" width="124" height="124">'
MARK = {"ok": CHECK, "no": CROSS}

def chip(spec):
    kind, _, val = spec.partition(":")
    a, _, b = val.partition("|")
    if kind == "fl": return f'<div class="chip">{FL(a)}{f"<b>{b}</b>" if b else ""}</div>' if b else f'<div class="chip bare">{FL(a, "lg")}</div>'
    if kind == "tx": return f'<div class="chip"><b>{a}</b></div>'
    if kind == "cn": return f'<div class="chip">{FL(a)}<b>{b}</b></div>'
    if kind == "ic": return f'<div class="chip"><span class="ic">{ICON(a)}</span><b>{b}</b></div>'
    if kind == "mp": return f'<div class="chip mp"><img src="assets/metodos/{a}.svg" alt="{a}"></div>'
    if kind == "ej": return f'<div class="chip bare"><img class="emo" src="assets/emoji/{a}.png" style="width:104px"></div>'   # bandera emoji de Apple
    if kind == "pl":   # − / + dibujados en SVG: centrados exactos en el círculo (el glifo de la fuente quedaba descentrado)
        sg = '<svg viewBox="0 0 24 24"><path d="M6 12h12' + ('M12 6v12' if a == "+" else '') + '" stroke="var(--neutral-0)" stroke-width="3" stroke-linecap="round" fill="none"/></svg>'
        return f'<div class="chip pl"><u>{sg}</u><b>{b}</b></div>'
    if spec == "iso": return f'<div class="chip bare iso">{ISO_S}</div>'
    if spec == "ar": return f'<div class="chip bare arrow">{ARROW}</div>'
    raise ValueError(spec)

H, HF, JS = [], [], []
def js(s): JS.append(s)
POP = {"ej": "pop", "fl": "pop", "tx": "pop", "ic": "pop", "mp": "pop", "pl": "pop", "cn": "coin", "iso": "logo_s", "ar": None}
for n, c in enumerate(CARDS):
    cid = f"c{n}"
    if c["k"] == "iso":
        H.append(f'<div id="{cid}" class="isofin">{ISO_L}</div>')
        if c.get("pulse"):
            js(f'  TL.to("#{cid}", {{ scale: 1.14, duration: .16, ease: "power2.out" }}, {c["pulse"] - .04}); TL.to("#{cid}", {{ scale: 1, duration: .45, ease: "back.out(2.5)" }}, {c["pulse"] + .12});')
            ev("positive", c["pulse"])
        js(f'  TL.fromTo("#{cid}", {{ opacity: 0, y: 26, scale: .86, filter: "blur(10px)" }}, {{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: .45, ease: "back.out(1.7)", immediateRender: false }}, {c["t0"]});')
        ev(c.get("snd", "logo"), c["t0"]); continue
    if c["k"] == "chips":
        def chipm(it):
            h = chip(it[1])
            if len(it) > 2 and it[2][0] in MARK: h = h[:-6] + f'<i class="mk {it[2][0]}">{MARK[it[2][0]]}</i></div>'
            return h
        inner = "".join(chipm(it) for it in c["items"])
        eb = f'<div class="eyebrow">{c["eyebrow"]}</div>' if c.get("eyebrow") else ""
        cls = " col" if c.get("col") else " wrap" if c.get("wrap") else ""
        H.append(f'<div id="{cid}" class="glass{cls}">{eb}<div class="chips">{inner}</div></div>')
        js(f'  cardIn("#{cid}", {c["t0"]}); cardOut("#{cid}", {c["t1"]});'); ev("card", c["t0"])
        grow = "growH" if c.get("col") else "growW"
        for k, it in enumerate(c["items"]):
            t, s_ = it[0], it[1]
            js(f'  {grow}("#{cid} .chip:nth-child({k + 1})", {t - .03:.2f}, {c["t0"]});')
            kind = POP[s_.partition(":")[0]]
            if kind: ev(kind, t)
            if len(it) > 2:
                mk, tm = it[2]
                if mk in MARK: js(f'  markIn("#{cid} .chip:nth-child({k + 1}) .mk", {tm});'); ev(mk, tm)
                else: js(f'  strike("#{cid} .chip:nth-child({k + 1}) b", {tm}); dim("#{cid} .chip:nth-child({k + 1})", {tm + .25});'); ev("strike", tm)
    elif c["k"] == "rows":
        rows = []
        for t, ic, txt, mk in c["items"]:
            lead = "".join(FL(x, "sm") for x in ic[3:].split(",")) if ic.startswith("fl:") else f'<span class="ic">{ICON(ic)}</span>'
            m = "" if not mk else (f'<i class="mk {mk[0]}">{MARK[mk[0]]}</i>' if mk[0] in MARK else "")
            rows.append(f'<div class="rw"><span class="lead">{lead}</span><b>{txt}</b>{m}</div>')
        eb = f'<div class="eyebrow">{c["eyebrow"]}</div>' if c.get("eyebrow") else ""
        H.append(f'<div id="{cid}" class="glass">{eb}<div class="rows">{"".join(rows)}</div></div>')
        js(f'  cardIn("#{cid}", {c["t0"]}); cardOut("#{cid}", {c["t1"]});'); ev("card", c["t0"])
        if c.get("eyebrow"): pass
        for k, (t, ic, txt, mk) in enumerate(c["items"]):
            js(f'  growH("#{cid} .rw:nth-child({k + 1})", {t - .04:.2f}, {c["t0"]});'); ev("pop", t)
            if mk and mk[0] in MARK:
                js(f'  markIn("#{cid} .rw:nth-child({k + 1}) .mk", {mk[1]});'); ev(mk[0], mk[1])
            elif mk and mk[0] == "x":
                js(f'  strike("#{cid} .rw:nth-child({k + 1}) b", {mk[1]}); dim("#{cid} .rw:nth-child({k + 1})", {mk[1] + .25});'); ev("strike", mk[1])
    elif c["k"] == "free":     # elementos sueltos, sin recuadro de cristal
        for k, (t, spec, x, y, w) in enumerate(c["items"]):
            kind, _, a = spec.partition(":")
            mk = None
            if kind == "fl": el = f'<i class="fl free-fl"><img src="assets/banderas/{a}.svg"></i>'
            elif kind == "wv":   # bandera que ondea (14 tiras)
                N = 14; el = '<div class="wave">' + "".join(f'<i style="background-image:url(assets/banderas/{a}.svg);background-size:{w}px {w * .75:.0f}px;background-position:{-k_ * w / N:.1f}px 0"></i>' for k_ in range(N)) + '</div>'
            elif kind == "mp": el = f'<div class="chip mp"><img src="assets/metodos/{a}.svg"></div>'
            elif kind == "em":   # emoji de Apple como imagen (el navegador del render no tiene la fuente Apple Color Emoji)
                CC = {"🇮🇩": "id", "🇪🇸": "es", "🇲🇽": "mx", "🇨🇴": "co", "🇦🇷": "ar", "🇺🇸": "us", "🇦🇪": "ae"}
                el = f'<img class="emo" src="assets/emoji/{CC[a]}.png" style="width:{w}px">'
            elif kind == "ic": ic, _, txt_ = a.partition("|"); el = f'<div class="chip"><span class="ic">{ICON(ic)}</span><b>{txt_}</b></div>'
            elif kind == "tm":   # pastilla suelta de texto con ✓/✕
                txt_, _, m = a.partition("|"); mk, _, tm = m.partition("@"); mk = (mk, float(tm))
                el = f'<div class="chip lk"><b>{txt_}</b><i class="mk {mk[0]}">{MARK[mk[0]]}</i></div>'
            elif kind == "tx": el = f'<div class="chip"><b>{a}</b></div>'
            elif kind == "lk":   # enlace suelto (chip blanco, sin cristal): icono + logo o texto + ✓/✕ que entra en su momento
                what, _, m = a.partition("|"); mk, _, tm = m.partition("@"); mk = (mk, float(tm))
                body = f'<img class="lklogo" src="assets/metodos/{what}.svg">' if (P / f"assets/metodos/{what}.svg").exists() else f"<b>{what}</b>"
                el = f'<div class="chip lk"><span class="ic">{ICON("enlace")}</span>{body}<i class="mk {mk[0]}">{MARK[mk[0]]}</i></div>'
            else: raise ValueError(spec)
            sz = f"width:{w}px;height:{w * .75:.0f}px;" if w and kind != "em" else ""
            H.append(f'<div id="{cid}-{k}" class="free" style="left:{x}px;top:{y}px;{sz}">{el}</div>')
            js(f'  freeIn("#{cid}-{k}", {t - .03:.2f}); freeOut("#{cid}-{k}", {c["t1"] - .04 * k:.2f});'); ev("pop", t)
            if mk: js(f'  markIn("#{cid}-{k} .mk", {mk[1]});'); ev(mk[0], mk[1])
            if kind == "wv": js(f'  wave("#{cid}-{k}", {t - .03:.2f}, {c["t1"]});')
    elif c["k"] == "num":      # cifra grande detrás de la persona: cuenta 0 → n y aterriza
        pos = f'left:{c["x"] - 350}px;right:auto;width:700px;' if c.get("x") else ""
        xl = " xl" if c.get("size") == "xl" else ""
        H.append(f'<div id="{cid}" class="giant{xl}" style="top:{c["top"]}px;{pos}"><div class="pre">{c["pre"]}</div><div class="nv"><span class="sq"><span class="v">0</span><small>{c["suf"]}</small></span></div></div>')
        a, d = c["count"]
        js(f'  giant("#{cid}", {c["t0"]}, {c["t1"]}, {a}, {d}, {c["n"]});'); ev("count", a); ev("hit", a + d)
    elif c["k"] == "sides":    # € y $ a ambos lados de la persona (motion graphics: scale_punch + giro 3D + hold_breath + glow)
        for k, (t, sym, side) in enumerate(c["items"]):
            sty = f' style="top:{c["top"]}px"' if c.get("top") else ""
            H.append(f'<div id="{cid}-{k}" class="token {side}"{sty}><span>{sym}</span></div>')
            js(f'  token("#{cid}-{k}", {t - .05:.2f}, {c["t1"]}, {1 if side == "left" else -1});'); ev("coin", t)
        HF.extend(H[-len(c["items"]):]); del H[-len(c["items"]):]
    elif c["k"] == "sketch":   # ilustración a mano: moneda + símbolo, se dibuja con trazo de lápiz (dashoffset) y la línea «hierve»
        GLYPH = {"eur": ["M140 62 C 126 48, 102 44, 84 52 C 62 62, 54 84, 56 102 C 58 124, 70 142, 92 148 C 110 152, 128 146, 141 133",
                         "M40 91 C 64 90, 92 89, 120 87", "M38 115 C 60 114, 88 113, 113 111"],
                 "usd": ["M136 63 C 124 48, 96 45, 80 54 C 62 64, 66 88, 87 94 C 109 100, 133 107, 131 129 C 129 149, 101 155, 82 151 C 70 149, 62 143, 57 134",
                         "M101 32 C 100 80, 99 120, 98 170"]}
        COIN = "M100 13 C 152 10, 191 48, 189 101 C 187 154, 148 191, 98 189 C 46 187, 10 151, 12 98 C 14 50, 52 14, 106 15 C 122 16, 134 20, 143 25"
        HATCH = ["M36 150 L 56 168", "M48 160 L 66 176", "M150 40 L 166 58", "M160 34 L 174 50"]
        for k, (t, sym, x, y) in enumerate(c["items"]):
            paths = [COIN] + GLYPH[sym] + HATCH
            svg = "".join(f'<path class="sk" d="{d}"/><path class="sk ghost" d="{d}"/>' for d in paths)
            H.append(f'<svg id="{cid}-{k}" class="sketch" style="left:{x - 150}px;top:{y - 150}px" viewBox="0 0 200 200"><g filter="url(#lapiz)">{svg}</g></svg>')
            js(f'  sketch("#{cid}-{k}", {t - .04:.2f}, {c["t1"]});'); ev("pencil", t)
    elif c["k"] == "clip":     # escena a pantalla completa (vídeo ya renderizado), por encima de todo salvo los subtítulos
        HF.append(f'<video id="{cid}" class="clip full" data-start="{c["t0"]}" data-duration="{c["t1"] - c["t0"]:.3f}" data-track-index="4" src="{c["src"]}" muted playsinline></video>')
        for k_, t_ in c["sfx"]: ev(k_, t_)
    elif c["k"] == "link":
        H.append(f'''<div id="{cid}" class="glass"{f' style="top:{c["top"]}px"' if c.get("top") else ""}><div class="link"><span class="ic">{ICON("enlace")}</span><b>{c["text"]}</b>
            <i class="mk {c["mark"][0]}">{MARK[c["mark"][0]]}</i></div></div>''')
        if c.get("open"):   # clic: onda en el punto de toque y la caja se abre desde ahí
            HF.append(f'<i id="{cid}-tap" class="tapring" style="top:{c["top"] + 45}px"></i>')
            js(f'  tapRing("#{cid}-tap", {c["t0"] - .06:.2f}); openIn("#{cid}", {c["t0"]}); cardOut("#{cid}", {c["t1"]}); markIn("#{cid} .mk", {c["mark"][1]});')
            ev("click", c["t0"])
        else:
            js(f'  cardIn("#{cid}", {c["t0"]}); cardOut("#{cid}", {c["t1"]}); markIn("#{cid} .mk", {c["mark"][1]});'); ev("card", c["t0"])
        ev(c["mark"][0], c["mark"][1])
        if c.get("tap"): ev("tap", c["tap"])

    if c.get("front"):
        n_el = len(c["items"]) if c["k"] == "free" else 1
        HF.extend(H[-n_el:]); del H[-n_el:]   # delante de la persona: cuando la cabeza taparía el texto

# ------------------------------------------------------------------ cámara (el recorte de la persona sigue la misma cámara)
FR = []
for k, t in enumerate(CUTS):
    nxt = CUTS[k + 1] if k + 1 < len(CUTS) else DUR
    if nxt - t > 6.5:                                         # plano largo: reencuadre seco a mitad
        m = round(t + (nxt - t) / 2, 3); FR += [(t, 1.0, 1.03, m - t), (m, 1.08, 1.11, nxt - m)]
    else: FR.append((t, 1.0, 1.035, nxt - t))
ZOOM = globals().get("ZOOM", [])
if ZOOM:   # plano largo con zoom suave: sin reencuadre seco; deriva lenta → zoom (power2.inOut) → deriva
    FR = []
    for k, t in enumerate(CUTS):
        nxt = CUTS[k + 1] if k + 1 < len(CUTS) else DUR
        z = [x for x in ZOOM if t < x[0] < nxt]
        if not z: FR.append((t, 1.0, 1.035, nxt - t)); continue
        FR.append((t, 1.0, 1.02, z[0][0] - t))
        for i, (zt, zs, zd) in enumerate(z):   # varios zooms suaves en el mismo plano: cada uno parte de donde acabó el anterior
            end = z[i + 1][0] if i + 1 < len(z) else nxt
            js(f'  TL.to("#cam, #camM", {{ scale: {zs}, duration: {zd}, ease: "power2.inOut" }}, {zt}); TL.to("#cam, #camM", {{ scale: {zs + .015}, duration: {end - zt - zd:.3f}, ease: "none" }}, {zt + zd});')
for t, a, b, d in FR: js(f'  frame({t}, {a}, {b}, {d:.3f});')
for a, b, amp in globals().get("HANDHELD", []): js(f'  handheld({a}, {b}, {amp});')
LZ = dict(n=LUZ[0], cut=LUZ[1], pk=.74, d=1.734)
HTML_LUZ = (f'<video id="luz" class="clip luz" data-start="{LZ["cut"] - LZ["pk"]:.3f}" data-duration="{LZ["d"]}" data-track-index="3" '
            f'src="assets/luz/luz-{LZ["n"]}.mp4" muted playsinline></video>')
js(f'  luz("#luz", {LZ["cut"] - LZ["pk"]:.3f}, {LZ["cut"]});'); ev("luz", LZ["cut"])
if globals().get("FILM"): js(f'  filmGrain({FILM[0]}, {FILM[1]});')
if globals().get("BW"):
    a, b = BW; js(f'  TL.to("#cam, #camM", {{ filter: "grayscale(1) contrast(1.12)", duration: .12 }}, {a}); TL.to("#cam, #camM", {{ filter: "grayscale(0) contrast(1)", duration: .1 }}, {b - .05});')
if V == "dubai":   # el salto del coche: destello del propio vídeo (5,1 s) y aterrizaje en el croma (≈5,4 s)
    ev("flash", 5.1); ev("fall", 5.42)
    # Brayan 30/10: glitch suave entre 0:01 y 0:02 (en el corte de 1,5 s) y viento cortante cuando desaparece el coche (4,4 s)
    js('  glitch(1.3, 1.78);'); ev("glitch", 1.3)
    ev("click", 14.6)   # transición de 0:14 (fundido a silueta del propio vídeo): clic (Brayan 30/10)
    ev("wind", 4.4)

MATTE = (P / "assets/matte/persona.webm").exists()
html = ((ROOT / "scripts/template.html").read_text().replace("__DUR__", str(DUR)).replace("__CARDS__", "\n".join(H)).replace("__FRONT__", "\n".join(HF)).replace("__LUZ__", HTML_LUZ)
        .replace("__MATTE__", '<video id="matte" class="clip matte" data-start="0" data-duration="__DUR__" data-track-index="2" src="assets/matte/persona.webm" muted playsinline></video>' if MATTE else "")
        .replace("__DUR__", str(DUR)).replace("__TOP__", str(TOP)).replace("__SUBS__", json.dumps(SUBS, ensure_ascii=False)).replace("__BODY__", "\n".join(JS)))
(P / "index.html").write_text(html)
json.dump(dict(video=V, dur=DUR, cut2=LZ["cut"], bw=globals().get("BW"), events=sorted(EV, key=lambda e: e[1])), open(P / "meta.json", "w"), indent=1)
print(f"OK {V} · {len(SUBS)} subtítulos · {len(CARDS)} tarjetas · {len(EV)} eventos · recorte={'sí' if MATTE else 'NO'}")
for s in SUBS: print(f"  {s['start']:6.2f}-{s['end']:6.2f} {s['text']}")
