"""Genera la tipografía manuscrita "Lujos Hand" (Regular y Bold).

Cada letra se define como trazos de centro (como si se escribiera con un
marcador) en coordenadas de fuente: línea base y=0, altura x=360,
mayúsculas=700, descendentes=-250. Al construir, cada trazo se curva y se
deforma un poco al azar, se inclina y se engruesa con punta redonda.
Cada letra sale en 3 versiones (default, .alt1, .alt2) y la función
"calt" las alterna para que las letras repetidas no salgan iguales.

"Lujos Hand Neon" es una fuente a color (COLR): cada letra lleva capas
amarillas semitransparentes que simulan el brillo del neón.

Uso:  python3 build_font.py
Requiere: fonttools, skia-pathops
"""

import math
import os
import random

import pathops
from fontTools.agl import UV2AGL
from fontTools.colorLib.builder import buildCOLR, buildCPAL
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.svgLib.path import parse_path

OUT_DIR = os.path.dirname(os.path.abspath(__file__))
FAMILY = "Lujos Hand"
UPM = 1000
XH = 360
CAP = 700
SLANT = math.tan(math.radians(5))
N_ALTS = 3


# ---------------------------------------------------------------- helpers

def ell(cx, cy, rx, ry, a0, sweep):
    """Arco de elipse como path SVG (ángulos en grados, antihorario)."""
    n = max(1, math.ceil(abs(sweep) / 90))
    seg = math.radians(sweep / n)
    k = 4 / 3 * math.tan(seg / 4)
    a = math.radians(a0)
    d = [f"M {cx + rx * math.cos(a):.2f} {cy + ry * math.sin(a):.2f}"]
    for _ in range(n):
        b = a + seg
        c1 = (cx + rx * (math.cos(a) - k * math.sin(a)), cy + ry * (math.sin(a) + k * math.cos(a)))
        c2 = (cx + rx * (math.cos(b) + k * math.sin(b)), cy + ry * (math.sin(b) - k * math.cos(b)))
        p = (cx + rx * math.cos(b), cy + ry * math.sin(b))
        d.append(f"C {c1[0]:.2f} {c1[1]:.2f} {c2[0]:.2f} {c2[1]:.2f} {p[0]:.2f} {p[1]:.2f}")
        a = b
    return " ".join(d)


def dot(x, y, scale=1.3):
    return ("dot", x, y, scale)


def to_segments(d):
    """Convierte un path SVG en lista de subpaths: [(p0, [segmentos])]."""
    pen = RecordingPen()
    parse_path(d, pen)
    subpaths = []
    for op, args in pen.value:
        if op == "moveTo":
            subpaths.append([args[0], []])
        elif op == "lineTo":
            subpaths[-1][1].append(("L", args[0]))
        elif op == "curveTo":
            subpaths[-1][1].append(("C",) + tuple(args))
        elif op == "qCurveTo":
            p0 = subpaths[-1][1][-1][-1] if subpaths[-1][1] else subpaths[-1][0]
            q, p = args
            c1 = (p0[0] + 2 / 3 * (q[0] - p0[0]), p0[1] + 2 / 3 * (q[1] - p0[1]))
            c2 = (p[0] + 2 / 3 * (q[0] - p[0]), p[1] + 2 / 3 * (q[1] - p[1]))
            subpaths[-1][1].append(("C", c1, c2, p))
    return subpaths


class Glyph:
    """Trazos de una letra: lista de subpaths y de puntos."""

    def __init__(self, items):
        self.paths = []
        self.dots = []
        for it in items:
            if isinstance(it, tuple) and it[0] == "dot":
                self.dots.append(list(it[1:]))
            else:
                self.paths.extend(to_segments(it))

    def copy(self):
        g = Glyph([])
        g.paths = [[p0, list(segs)] for p0, segs in self.paths]
        g.dots = [list(d) for d in self.dots]
        return g

    def points(self):
        for p0, segs in self.paths:
            yield p0
            for s in segs:
                yield from s[1:]
        for x, y, _ in self.dots:
            yield (x, y)

    def bbox(self):
        pts = list(self.points())
        xs = [p[0] for p in pts]
        ys = [p[1] for p in pts]
        return min(xs), min(ys), max(xs), max(ys)

    def map(self, f):
        g = Glyph([])
        g.paths = [[f(p0), [(s[0],) + tuple(f(p) for p in s[1:]) for s in segs]] for p0, segs in self.paths]
        g.dots = [[*f((x, y)), sc] for x, y, sc in self.dots]
        return g

    def affine(self, a=1, b=0, c=0, d=1, e=0, f=0):
        return self.map(lambda p: (a * p[0] + c * p[1] + e, b * p[0] + d * p[1] + f))

    def __add__(self, other):
        g = self.copy()
        g.paths += [[p0, list(s)] for p0, s in other.paths]
        g.dots += [list(d) for d in other.dots]
        return g


def G(*items):
    return Glyph(items)


# ---------------------------------------------------------------- dibujo

BOWL = ell(150, 180, 140, 175, 20, 330)
L_STEM = "M 40 720 C 38 480 37 240 40 0"
U_TAIL = "C 300 5 318 -5 348 8"

D = {}
# minúsculas
D["a"] = G(BOWL, "M 295 350 C 292 240 290 120 295 40 C 298 5 315 -5 345 8")
D["b"] = G(L_STEM, "M 42 210 C 90 320 170 365 230 360 C 300 352 335 280 335 185 C 335 70 270 -2 180 -2 C 120 -2 70 20 42 50")
D["c"] = G(ell(165, 180, 150, 180, 45, 275))
D["d"] = G(BOWL, "M 300 720 C 298 480 293 200 297 40 " + U_TAIL)
D["e"] = G("M 25 190 C 120 192 220 195 305 205 C 310 300 250 362 165 362 C 75 362 12 285 12 180 C 12 70 80 -2 170 -2 C 230 -2 280 25 310 65")
D["f"] = G("M 300 660 C 270 712 225 725 190 718 C 140 708 125 660 125 600 C 125 400 123 200 125 0",
           "M 30 355 C 110 360 190 362 270 362")
D["g"] = G(BOWL, "M 295 355 C 295 200 297 0 295 -120 C 293 -215 240 -255 170 -255 C 100 -255 55 -225 30 -185")
D["h"] = G(L_STEM, "M 42 215 C 85 320 150 362 205 362 C 275 362 305 310 305 230 C 305 150 303 80 310 30 C 315 0 330 -5 355 5")
D["dotlessi"] = G("M 55 355 C 53 240 52 120 55 30 C 57 0 72 -6 100 3")
D["i"] = D["dotlessi"] + G(dot(64, 520))
D["j"] = G("M 120 355 C 120 200 122 0 118 -130 C 115 -220 75 -258 25 -255 C -20 -252 -50 -225 -65 -195", dot(130, 520))
D["k"] = G(L_STEM, "M 285 355 C 210 300 120 230 45 165", "M 130 230 C 190 150 245 70 305 0")
D["l"] = G("M 55 720 C 52 480 50 240 55 40 C 57 5 75 -5 105 5")
D["m"] = G("M 38 360 C 37 240 37 120 38 0",
           "M 40 225 C 75 320 125 362 170 362 C 230 362 252 310 252 230 C 252 150 251 75 252 0",
           "M 254 225 C 290 320 340 362 385 362 C 445 362 468 310 468 230 C 468 150 466 80 472 30 C 476 0 490 -5 515 5")
D["n"] = G("M 38 360 C 37 240 37 120 38 0",
           "M 40 220 C 80 320 145 362 200 362 C 270 362 300 310 300 230 C 300 150 298 80 304 30 C 308 0 323 -5 348 5")
D["o"] = G(ell(165, 178, 155, 182, 95, 370))
D["p"] = G("M 40 360 C 39 160 38 -50 40 -250",
           "M 42 280 C 90 340 160 365 215 362 C 295 358 335 285 335 185 C 335 70 270 -2 180 -2 C 120 -2 70 25 42 60")
D["q"] = G(BOWL, "M 295 355 C 293 150 292 -50 295 -200 C 297 -240 315 -255 350 -245")
D["r"] = G("M 40 360 C 39 240 38 120 40 0", "M 42 210 C 80 310 140 362 200 362 C 235 362 260 350 280 330")
D["s"] = G("M 265 320 C 230 355 175 365 135 362 C 75 358 40 325 40 280 C 40 230 85 210 150 195 "
           "C 225 178 280 150 280 95 C 280 30 220 -4 150 -4 C 95 -4 50 15 20 50")
D["t"] = G("M 135 590 C 132 420 128 250 130 80 C 131 15 160 -3 200 -3 C 230 -3 255 8 270 20",
           "M 25 355 C 105 360 185 363 265 365")
D["u"] = G("M 35 360 C 33 280 30 200 32 140 C 35 45 90 -2 155 -2 C 230 -2 285 50 300 140",
           "M 302 360 C 300 260 298 150 302 40 C 305 5 322 -5 352 8")
D["v"] = G("M 10 360 L 150 0 L 290 345 C 297 362 312 368 330 362")
D["w"] = G("M 10 360 L 105 0 L 210 320 L 315 0 L 405 345 C 410 362 425 368 445 362")
D["x"] = G("M 20 360 L 300 0", "M 290 360 L 15 0")
D["y"] = G("M 10 360 L 160 30",
           "M 300 360 C 240 180 170 -20 120 -170 C 100 -230 70 -258 25 -250 C 0 -245 -20 -230 -35 -210")
D["z"] = G("M 25 355 L 290 362 L 20 5 L 305 0")

# mayúsculas
B_STEM = "M 45 700 L 42 0"
D["A"] = G("M 0 0 L 195 700 L 395 0", "M 80 265 L 325 275")
D["B"] = G(B_STEM, "M 45 700 C 180 708 300 690 300 550 C 300 430 200 385 60 385",
           "M 60 385 C 230 390 350 340 350 200 C 350 60 230 0 42 8")
D["C"] = G(ell(320, 350, 300, 358, 45, 275))
D["D"] = G(B_STEM, "M 45 700 C 300 705 420 540 420 350 C 420 140 290 5 42 8")
D["E"] = G("M 335 705 L 45 700 L 42 5 L 345 0", "M 44 365 L 270 372")
D["F"] = G("M 335 705 L 45 700 L 42 0", "M 44 375 L 270 382")
D["G"] = G(ell(320, 350, 300, 358, 50, 265), "M 405 325 L 600 322 C 602 230 580 150 532 97")
D["H"] = G(B_STEM, "M 395 700 L 392 0", "M 44 370 L 393 378")
D["I"] = G("M 70 700 L 65 0")
D["J"] = G("M 360 700 C 358 500 355 300 350 180 C 345 50 270 -5 190 -5 C 110 -5 50 40 25 110")
D["K"] = G(B_STEM, "M 360 700 L 50 320", "M 165 455 L 385 0")
D["L"] = G("M 25 640 C 40 680 62 705 85 700 C 80 480 70 250 70 60 C 70 15 90 3 130 5 C 220 8 300 12 390 25")
D["M"] = G("M 25 0 L 55 700 L 240 230 L 425 700 L 455 0")
D["N"] = G("M 42 0 L 45 700 L 395 5 L 400 700")
D["O"] = G(ell(330, 350, 315, 360, 95, 370))
D["P"] = G("M 42 0 L 45 700 C 230 710 345 660 345 525 C 345 395 230 345 50 355")
D["Q"] = D["O"] + G("M 400 150 C 470 80 540 20 640 -40")
D["R"] = D["P"] + G("M 190 360 L 395 0")
D["S"] = G("M 440 610 C 400 675 330 705 255 705 C 150 705 75 645 75 560 C 75 470 160 430 260 400 "
           "C 370 365 450 310 450 200 C 450 75 350 -5 230 -5 C 140 -5 65 30 25 95")
D["T"] = G("M 0 698 L 440 705", "M 222 702 L 215 0")
D["U"] = G("M 35 700 C 33 500 30 350 33 240 C 37 80 120 -5 225 -5 C 330 -5 410 80 412 240 C 414 400 412 550 410 700")
D["V"] = G("M 0 700 L 205 0 L 410 700")
D["W"] = G("M 0 700 L 130 0 L 275 520 L 420 0 L 550 700")
D["X"] = G("M 20 700 L 400 0", "M 395 700 L 15 0")
D["Y"] = G("M 0 700 L 205 360 L 200 0", "M 410 700 L 205 360")
D["Z"] = G("M 25 700 L 395 700 L 20 5 L 405 0")

# números
D["0"] = G(ell(200, 345, 185, 350, 95, 370))
D["1"] = G("M 60 540 C 120 600 170 650 205 695 L 195 0")
D["2"] = G("M 35 540 C 55 645 135 700 210 700 C 300 700 355 640 355 555 C 355 430 210 300 25 5 L 380 10")
D["3"] = G("M 45 610 C 90 680 160 702 225 700 C 310 698 350 640 345 570 C 340 470 260 405 150 395 "
           "C 290 395 380 330 380 205 C 380 75 290 -5 185 -5 C 110 -5 45 30 15 85")
D["4"] = G("M 285 700 L 25 225 L 395 235", "M 300 470 L 292 0")
D["5"] = G("M 350 690 L 90 685 L 65 395 C 120 430 180 445 235 442 C 330 435 385 345 385 230 "
           "C 385 90 290 -5 180 -5 C 110 -5 45 25 15 80")
D["6"] = G("M 330 650 C 285 695 230 705 185 698 C 80 680 25 520 25 330 C 25 120 100 -5 205 -5 "
           "C 315 -5 375 85 375 195 C 375 305 300 385 205 385 C 125 385 65 335 35 265")
D["7"] = G("M 20 690 L 385 700 C 290 470 200 230 145 0")
D["8"] = G("M 330 590 C 330 665 270 702 200 702 C 125 702 65 660 65 585 C 65 495 140 450 205 410 "
           "C 290 360 375 300 375 185 C 375 70 295 -5 200 -5 C 105 -5 30 65 30 180 "
           "C 30 295 120 355 200 405 C 265 445 330 505 330 590")
D["9"] = G(ell(195, 545, 160, 160, 10, 360), "M 355 640 C 358 430 352 220 340 0")

# signos
COMMA = "M 55 35 C 55 0 45 -50 15 -105"
D["."] = G(dot(40, 20))
D[","] = G(dot(52, 28), COMMA)
D[":"] = G(dot(45, 20), dot(52, 300))
D[";"] = G(dot(52, 300), dot(52, 28), COMMA)
D["!"] = G("M 65 700 C 62 530 58 360 55 200", dot(52, 20))
D["?"] = G("M 35 560 C 45 660 125 702 200 702 C 285 702 340 650 340 570 C 340 470 255 430 205 380 "
           "C 180 350 175 300 177 200", dot(178, 20))
D["¡"] = D["!"].affine(-0.9, 0, 0, -0.9, 115, 355)
D["¿"] = D["?"].affine(-0.9, 0, 0, -0.9, 380, 380)
D["'"] = G("M 60 700 L 55 530")
D['"'] = G("M 60 700 L 55 530", "M 150 700 L 145 530")
D["’"] = D[","].affine(1, 0, 0, 1, 0, 655)
D["‘"] = D["’"].affine(-1, 0, 0, -1, 80, 1270)
D["”"] = D["’"] + D["’"].affine(1, 0, 0, 1, 95, 0)
D["“"] = D["‘"] + D["‘"].affine(1, 0, 0, 1, 95, 0)
D["("] = G("M 170 740 C 60 620 20 450 20 250 C 20 80 70 -70 170 -190")
D[")"] = D["("].affine(-1, 0, 0, 1, 190, 0)
D["["] = G("M 165 740 L 50 740 L 45 -190 L 165 -190")
D["]"] = D["["].affine(-1, 0, 0, 1, 210, 0)
D["{"] = G("M 190 740 C 110 740 100 690 100 600 C 100 470 100 330 30 280 C 100 230 100 90 100 -50 C 100 -150 110 -190 190 -190")
D["}"] = D["{"].affine(-1, 0, 0, 1, 220, 0)
D["/"] = G("M 0 -150 L 330 760")
D["\\"] = G("M 0 760 L 330 -150")
D["|"] = G("M 60 760 L 55 -220")
D["-"] = G("M 30 255 L 230 262")
D["–"] = G("M 30 255 L 430 262")
D["—"] = G("M 30 255 L 830 262")
D["_"] = G("M 0 -100 L 500 -95")
D["+"] = G("M 30 300 L 360 306", "M 197 465 L 193 140")
D["="] = G("M 35 390 L 355 395", "M 35 215 L 355 220")
D["<"] = G("M 340 520 L 40 300 L 345 90")
D[">"] = D["<"].affine(-1, 0, 0, 1, 385, 0)
D["*"] = G("M 170 670 L 170 450", "M 265 615 L 75 505", "M 75 615 L 265 505")
D["#"] = G("M 145 640 L 105 60", "M 300 640 L 260 60", "M 30 450 L 380 460", "M 15 250 L 365 260")
D["$"] = D["S"].affine(0.85, 0, 0, 0.85, 0, 45) + G("M 215 760 L 205 -70")
D["%"] = G(ell(110, 560, 80, 105, 95, 365), ell(370, 145, 80, 105, 95, 365), "M 430 700 L 50 0")
D["&"] = G("M 440 0 C 350 110 230 250 160 360 C 110 440 100 520 110 590 C 120 660 170 702 230 702 "
           "C 290 702 330 660 330 600 C 330 520 250 470 170 420 C 80 365 25 290 25 200 "
           "C 25 80 110 -5 215 -5 C 320 -5 390 70 430 180")
D["@"] = G(ell(320, 320, 100, 115, 30, 330),
           "M 420 430 L 420 260 C 420 200 460 180 510 200 C 580 240 600 300 600 360 C 600 540 470 640 330 640 "
           "C 160 640 30 510 30 330 C 30 150 160 20 330 20 C 410 20 470 40 520 80")
D["^"] = G("M 40 520 L 160 700 L 280 520")
D["~"] = G("M 30 280 C 70 340 120 350 165 310 C 210 270 260 270 310 330")
D["`"] = G("M 60 700 L 130 600")
D["´"] = G("M 70 600 L 150 710")
D["¨"] = G(dot(50, 640), dot(170, 640))
D["°"] = G(ell(110, 600, 75, 80, 95, 370))
D["ª"] = D["a"].affine(0.55, 0, 0, 0.55, 20, 400) + G("M 20 330 L 220 335")
D["º"] = D["o"].affine(0.55, 0, 0, 0.55, 20, 400) + G("M 20 330 L 220 335")
D["«"] = G("M 170 400 L 40 250 L 170 100", "M 320 400 L 190 250 L 320 100")
D["»"] = D["«"].affine(-1, 0, 0, 1, 360, 0)
D["€"] = G(ell(350, 350, 280, 355, 50, 260), "M 20 430 L 360 440", "M 10 280 L 330 290")
D["·"] = G(dot(50, 280))
D["•"] = G(dot(80, 300, 2.4))
D["…"] = G(dot(40, 20), dot(170, 20), dot(300, 20))

# acentos (centrados en x=0, sobre la altura t)
ACC = {
    "acute": lambda t: G(f"M -30 {t + 60} L 50 {t + 170}"),
    "grave": lambda t: G(f"M 30 {t + 60} L -50 {t + 170}"),
    "circumflex": lambda t: G(f"M -80 {t + 70} L 0 {t + 170} L 80 {t + 70}"),
    "tilde": lambda t: G(f"M -100 {t + 90} C -70 {t + 150} -30 {t + 150} 0 {t + 120} C 30 {t + 90} 70 {t + 90} 100 {t + 150}"),
    "dieresis": lambda t: G(dot(-60, t + 110), dot(60, t + 110)),
    "cedilla": lambda t: G("M 0 0 L -5 -55 C 60 -60 75 -120 10 -150 C -15 -158 -40 -152 -55 -140"),
}
COMPOSED = {
    "á": ("a", "acute"), "é": ("e", "acute"), "í": ("dotlessi", "acute"), "ó": ("o", "acute"), "ú": ("u", "acute"),
    "à": ("a", "grave"), "è": ("e", "grave"), "ì": ("dotlessi", "grave"), "ò": ("o", "grave"), "ù": ("u", "grave"),
    "â": ("a", "circumflex"), "ê": ("e", "circumflex"), "î": ("dotlessi", "circumflex"), "ô": ("o", "circumflex"), "û": ("u", "circumflex"),
    "ä": ("a", "dieresis"), "ë": ("e", "dieresis"), "ï": ("dotlessi", "dieresis"), "ö": ("o", "dieresis"), "ü": ("u", "dieresis"),
    "ã": ("a", "tilde"), "õ": ("o", "tilde"), "ñ": ("n", "tilde"), "ç": ("c", "cedilla"),
    "Á": ("A", "acute"), "É": ("E", "acute"), "Í": ("I", "acute"), "Ó": ("O", "acute"), "Ú": ("U", "acute"),
    "À": ("A", "grave"), "È": ("E", "grave"), "Ì": ("I", "grave"), "Ò": ("O", "grave"), "Ù": ("U", "grave"),
    "Â": ("A", "circumflex"), "Ê": ("E", "circumflex"), "Î": ("I", "circumflex"), "Ô": ("O", "circumflex"), "Û": ("U", "circumflex"),
    "Ä": ("A", "dieresis"), "Ë": ("E", "dieresis"), "Ï": ("I", "dieresis"), "Ö": ("O", "dieresis"), "Ü": ("U", "dieresis"),
    "Ã": ("A", "tilde"), "Õ": ("O", "tilde"), "Ñ": ("N", "tilde"), "Ç": ("C", "cedilla"),
}
for ch, (base, acc) in COMPOSED.items():
    g = D[base]
    x0, _, x1, _ = g.bbox()
    cx = (x0 + x1) / 2
    if acc == "cedilla":
        D[ch] = g + ACC[acc](0).affine(1, 0, 0, 1, cx, 0)
    else:
        top = CAP + 20 if base.isupper() else XH + 20
        D[ch] = g + ACC[acc](top).affine(1, 0, 0, 1, cx, 0)
D["ı"] = D.pop("dotlessi")

# letras y números que alternan versiones
CYCLE = [c for c in D if c.isalnum()]


# ---------------------------------------------------------------- "hecho a mano"

class Wobble:
    """Campo de deformación suave: mueve todo el dibujo un poco, distinto en cada versión."""

    def __init__(self, rng, amp):
        self.w = [(math.cos(t := rng.uniform(0, 6.3)), math.sin(t), rng.uniform(0.006, 0.014), rng.uniform(0, 6.3), amp * rng.uniform(0.5, 1))
                  for _ in range(6)]

    def __call__(self, p):
        x, y = p
        dx = dy = 0
        for i, (ux, uy, k, ph, a) in enumerate(self.w):
            v = a * math.sin(k * (ux * x + uy * y) + ph)
            if i % 2:
                dy += v
            else:
                dx += v
        return (x + dx, y + dy)


def handmade(glyph, rng):
    """Curva un poco las rectas, deforma suavemente y rota/escala/inclina la letra."""
    g = glyph.copy()
    for sp in g.paths:
        prev = sp[0]
        segs = []
        for s in sp[1]:
            if s[0] == "L":
                p = s[1]
                dx, dy = p[0] - prev[0], p[1] - prev[1]
                length = math.hypot(dx, dy) or 1
                nx, ny = -dy / length, dx / length
                h1 = rng.gauss(0, 0.03) * length
                h2 = h1 * rng.uniform(0.4, 1.2) if rng.random() < 0.8 else -h1 * 0.6
                c1 = (prev[0] + dx / 3 + nx * h1, prev[1] + dy / 3 + ny * h1)
                c2 = (prev[0] + 2 * dx / 3 + nx * h2, prev[1] + 2 * dy / 3 + ny * h2)
                segs.append(("C", c1, c2, p))
            else:
                segs.append(s)
            prev = segs[-1][-1]
        sp[1] = segs

    wob = Wobble(rng, 7.5)
    x0, y0, x1, y1 = glyph.bbox()
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    ang = math.radians(rng.uniform(-3.5, 3.5))
    sx = rng.uniform(0.94, 1.06)
    sy = rng.uniform(0.93, 1.07)
    shift = rng.uniform(-14, 14)
    ca, sa = math.cos(ang), math.sin(ang)

    def f(p):
        x, y = wob(p)
        x, y = (x - cx) * sx, (y - cy) * sy
        x, y = x * ca - y * sa + cx, x * sa + y * ca + cy + shift
        return (x + y * SLANT, y)

    return g.map(f)


def outline(glyph, width, rng=None):
    """Engruesa los trazos con punta redonda y une todo en un contorno.

    Con rng agrega textura de marcador; sin rng da un trazo liso (capas de brillo).
    """
    builder = pathops.OpBuilder(fix_winding=True, keep_starting_points=False)
    n = 0
    passes = [(glyph.paths, 1.0)]
    if rng:
        # segunda pasada más fina y algo desplazada: bordes irregulares de marcador
        ink = Wobble(rng, width * 0.09)
        passes.append((glyph.map(ink).paths, 0.86))
    vary = (lambda a, b: rng.uniform(a, b)) if rng else (lambda a, b: 1.0)
    for p0, segs, w in [(p0, segs, w) for paths, w in passes for p0, segs in paths]:
        path = pathops.Path()
        path.moveTo(*p0)
        for s in segs:
            if s[0] == "L":
                path.lineTo(*s[1])
            else:
                path.cubicTo(*s[1], *s[2], *s[3])
        path.stroke(width * w * vary(0.95, 1.05), pathops.LineCap.ROUND_CAP, pathops.LineJoin.ROUND_JOIN, 4)
        path.convertConicsToQuads()
        path.simplify()
        builder.add(path, pathops.PathOp.UNION)
        n += 1
    for x, y, sc in glyph.dots:
        path = pathops.Path()
        path.moveTo(x, y)
        path.lineTo(x + 2, y + 3)
        path.stroke(width * sc * vary(0.92, 1.08), pathops.LineCap.ROUND_CAP, pathops.LineJoin.ROUND_JOIN, 4)
        path.convertConicsToQuads()
        path.simplify()
        builder.add(path, pathops.PathOp.UNION)
        n += 1
    if not n:
        return pathops.Path()
    return builder.resolve()


# ---------------------------------------------------------------- fuente

def glyph_name(ch):
    return UV2AGL.get(ord(ch), f"uni{ord(ch):04X}")


SIDE = {"j": (-125, 0), "f": (0, -50), "y": (-30, 0), "g": (0, 0), "T": (-15, -15), "ı": (0, 0)}


# capas de neón: 7 halos (del más ancho al más fino), el trazo y el brillo central
GLOW_STEPS = 7
PALETTE = [(1.0, 0.76, 0.0, 0.075), (1.0, 0.91, 0.1, 1.0), (1.0, 0.97, 0.66, 1.0)]


def neon_layers(gname, hm, width):
    layers = [(f"{gname}.glow{k}", outline(hm, width * (1 + 0.64 * k)), 0) for k in range(GLOW_STEPS, 0, -1)]
    return layers + [(gname, None, 1), (f"{gname}.hi", outline(hm, width * 0.38), 2)]


def build(style, width, neon=False):
    family = f"{FAMILY} Neon" if neon else FAMILY
    ps = f"{family.replace(' ', '')}-{style}"
    order = [".notdef", "space", "uni00A0"]
    colr = {}
    cmap = {0x20: "space", 0xA0: "uni00A0"}
    glyf = {}
    metrics = {}

    def add(name, path, side=(0, 0), sb=40, layers=()):
        xmin, _, xmax, _ = path.bounds
        lsb = sb + side[0]
        adv = round(xmax - xmin + 2 * sb + side[0] + side[1])
        for lname, lpath in [(name, path)] + [(n, p) for n, p, _ in layers if p is not None]:
            pen = TTGlyphPen(None)
            tp = TransformPen(Cu2QuPen(pen, max_err=0.8, reverse_direction=True), (1, 0, 0, 1, lsb - xmin, 0))
            lpath.draw(tp)
            glyf[lname] = pen.glyph()
            metrics[lname] = (adv, None)

    # .notdef: cajita
    rng = random.Random("notdef")
    add(".notdef", outline(G("M 50 0 L 450 0 L 450 700 L 50 700 L 50 0"), width * 0.6, rng))
    glyf["space"] = TTGlyphPen(None).glyph()
    glyf["uni00A0"] = TTGlyphPen(None).glyph()
    metrics["space"] = metrics["uni00A0"] = (240, 0)

    for ch, g in D.items():
        name = glyph_name(ch)
        alts = N_ALTS if ch in CYCLE else 1
        for k in range(alts):
            gname = name if k == 0 else f"{name}.alt{k}"
            rng = random.Random(f"{ch}-{k}")
            sb = 28 if ch.isupper() else 20
            hm = handmade(g, rng)
            layers = neon_layers(gname, hm, width) if neon else ()
            add(gname, outline(hm, width, rng), SIDE.get(ch, (0, 0)), sb, layers)
            order.append(gname)
            if neon:
                colr[gname] = [(n, pal) for n, _, pal in layers]
                order += [n for n, p, _ in layers if p is not None]
        cmap[ord(ch)] = name

    fb = FontBuilder(UPM, isTTF=True)
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap(cmap)
    fb.setupGlyf(glyf)
    hmtx = {}
    for name in order:
        adv, lsb = metrics[name]
        g = glyf[name]
        g.recalcBounds(fb.font["glyf"])
        hmtx[name] = (adv, getattr(g, "xMin", 0) if g.numberOfContours else 0)
    fb.setupHorizontalMetrics(hmtx)
    asc, desc = (1150, 480) if neon else (980, 330)
    fb.setupHorizontalHeader(ascent=asc, descent=-desc)
    bold = style == "Bold"
    fb.setupNameTable({
        "familyName": family,
        "styleName": style,
        "uniqueFontIdentifier": f"{ps};1.000",
        "fullName": f"{family} {style}",
        "psName": ps,
        "version": "Version 1.000",
        "copyright": "Lujos Hand. Tipografía manuscrita original.",
    })
    fb.setupOS2(
        sTypoAscender=800, sTypoDescender=-250, sTypoLineGap=250,
        usWinAscent=asc, usWinDescent=desc, sxHeight=XH, sCapHeight=CAP,
        usWeightClass=700 if bold else 400, fsSelection=0x20 if bold else 0x40,
        achVendID="NONE", fsType=0,
    )
    fb.setupPost(italicAngle=0)
    fb.font["head"].macStyle = 1 if bold else 0

    base = [glyph_name(c) for c in CYCLE]
    fea = f"""
@base = [{' '.join(base)}];
@alt1 = [{' '.join(n + '.alt1' for n in base)}];
@alt2 = [{' '.join(n + '.alt2' for n in base)}];
lookup cycle {{
    sub @alt1 @base' by @alt2;
    sub @base @base' by @alt1;
}} cycle;
feature calt {{ lookup cycle; }} calt;
"""
    fb.addOpenTypeFeatures(fea)
    if neon:
        fb.font["COLR"] = buildCOLR(colr, version=0)
        fb.font["CPAL"] = buildCPAL([PALETTE])
    path = os.path.join(OUT_DIR, f"{ps}.ttf")
    fb.save(path)
    print("ok", path, len(order), "glifos")


if __name__ == "__main__":
    build("Regular", 58)
    build("Bold", 92)
    build("Regular", 64, neon=True)
