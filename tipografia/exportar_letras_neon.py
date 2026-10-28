"""Exporta cada letra de Lujos Hand en neón como PNG transparente y arma el ZIP.

Todas las imágenes tienen la misma altura y la línea base en el mismo lugar,
así que se pueden poner una al lado de la otra alineadas por arriba.

Uso:  python3 exportar_letras_neon.py
Requiere: pillow, numpy, opencv-python-headless
"""

import os
import shutil
import zipfile

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

DIR = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(DIR, "LujosHand-Regular.ttf")
SIZE = 600            # tamaño de letra en px
S = SIZE / 720        # escala del brillo (calibrado para 720 px)
PAD = int(230 * S)    # margen para que el brillo no se corte

SIGNOS = {
    "!": "exclamacion", "¡": "exclamacion-abre", "?": "pregunta", "¿": "pregunta-abre",
    ".": "punto", ",": "coma", ":": "dos-puntos", ";": "punto-y-coma", "…": "puntos-suspensivos",
    "'": "apostrofo", '"': "comillas", "“": "comillas-abre", "”": "comillas-cierra",
    "(": "parentesis-abre", ")": "parentesis-cierra", "-": "guion", "+": "mas", "=": "igual",
    "@": "arroba", "#": "numeral", "$": "dolar", "%": "porcentaje", "&": "y", "€": "euro",
    "*": "asterisco", "/": "barra", "«": "comillas-angulares-abre", "»": "comillas-angulares-cierra",
}
GRUPOS = {
    "mayusculas": "ABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚÜ",
    "minusculas": "abcdefghijklmnñopqrstuvwxyzáéíóúü",
    "numeros": "0123456789",
}


def col(h):
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32) / 255


def neon(mask):
    """Brillo neón amarillo con desenfoque real; devuelve RGBA transparente."""
    g = lambda sig: cv2.GaussianBlur(mask, (0, 0), sig * S)[..., None]
    core = cv2.GaussianBlur(cv2.erode(mask, np.ones((5, 5), np.uint8)), (0, 0), 1.2)[..., None]
    rgb = (g(70) * 0.55 * col("ff9d00") + g(35) * 0.75 * col("ffb800") + g(14) * 0.9 * col("ffd000")
           + g(5) * 0.9 * col("ffe81a") + mask[..., None] * col("ffe92e") + core * 0.22 * col("fffbd0"))
    rgb = np.clip(rgb, 0, 1)
    a = rgb.max(axis=2)
    un = np.where(a[..., None] > 1e-4, rgb / np.maximum(a[..., None], 1e-4), 0)
    return Image.fromarray((np.dstack([np.clip(un, 0, 1), a]) * 255).round().astype(np.uint8), "RGBA")


def letra(font, ch, top, bottom):
    x0, _, x1, _ = font.getbbox(ch, anchor="ls")
    w = x1 - x0 + 2 * PAD
    h = bottom - top + 2 * PAD
    img = Image.new("L", (w, h), 0)
    ImageDraw.Draw(img).text((PAD - x0, PAD - top), ch, font=font, fill=255, anchor="ls")
    return neon(np.array(img, np.float32) / 255)


def main():
    font = ImageFont.truetype(FONT, SIZE)
    todos = "".join(GRUPOS.values()) + "".join(SIGNOS)
    boxes = [font.getbbox(c, anchor="ls") for c in todos]
    top, bottom = min(b[1] for b in boxes), max(b[3] for b in boxes)

    out = os.path.join(DIR, "letras-neon")
    shutil.rmtree(out, ignore_errors=True)
    for grupo, chars in list(GRUPOS.items()) + [("signos", "".join(SIGNOS))]:
        os.makedirs(os.path.join(out, grupo))
        for ch in chars:
            nombre = SIGNOS.get(ch, ch)
            letra(font, ch, top, bottom).save(os.path.join(out, grupo, f"{nombre}.png"), optimize=True)

    zpath = os.path.join(DIR, "lujos-hand-neon.zip")
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
        for root, _, files in os.walk(out):
            for f in sorted(files):
                p = os.path.join(root, f)
                z.write(p, os.path.join("lujos-hand-neon", os.path.relpath(p, DIR)))
        for f in ["LujosHand-Regular.ttf", "LujosHand-Bold.ttf", "LujosHandNeon-Regular.ttf"]:
            z.write(os.path.join(DIR, f), f"lujos-hand-neon/fuentes/{f}")
        for f in ["lujos-neon-transparente.png", "abecedario-neon.png", "muestra.png"]:
            z.write(os.path.join(DIR, f), f"lujos-hand-neon/{f}")
        z.writestr("lujos-hand-neon/LEEME.txt", LEEME)
    shutil.rmtree(out)
    print(zpath, os.path.getsize(zpath) // 1024, "KB")


LEEME = """Lujos Hand - letras en neón

letras-neon/   Cada letra, número y signo en neón amarillo, PNG con fondo transparente.
               Todas tienen la misma altura y la línea base en el mismo lugar:
               alinéalas por arriba y quedan derechas.
fuentes/       Tipografía para instalar (Regular, Bold y Neon a color).
lujos-neon-transparente.png   "Lujos..." listo para usar.
abecedario-neon.png           Todas las letras en una sola imagen.
muestra.png                   Muestra de la fuente normal y bold.

Instalar fuente: Windows -> clic derecho > Instalar. Mac -> doble clic > Instalar fuente.
"""

if __name__ == "__main__":
    main()
