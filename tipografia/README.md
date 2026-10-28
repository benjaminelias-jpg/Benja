# Lujos Hand

Tipografía manuscrita original, con trazo redondo de marcador. Se inspira en el estilo del letrero "Lujos...".

| Archivo | Qué es |
|---|---|
| `LujosHand-Regular.ttf` | Trazo normal |
| `LujosHand-Bold.ttf` | Trazo grueso |
| `LujosHandNeon-Regular.ttf` | Versión a color con el brillo neón amarillo dentro de la fuente |
| `lujos-neon-transparente.png` | "Lujos..." en neón, fondo transparente, listo para poner sobre un video o foto |
| `abecedario-neon.png` | Todas las letras en neón sobre fondo oscuro |
| `muestra.png` | Muestra de la fuente normal y bold |
| `build_font.py` | Script que genera las fuentes (`python3 build_font.py`, requiere `fonttools` y `skia-pathops`) |

## Para que se vea hecha a mano

- Cada letra tiene 3 versiones ligeramente distintas. Se alternan solas al escribir (función OpenType `calt`), así que "aaa" o "lll" nunca salen iguales.
- Las rectas están un poco curvas.
- La inclinación, el tamaño y la línea base varían un poco en cada letra.
- El borde del trazo es irregular, como el de un marcador.

## Instalar

- **Windows:** clic derecho en el `.ttf` → *Instalar*.
- **Mac:** doble clic → *Instalar fuente*.
- **Canva / CapCut:** subir el `.ttf` en la sección de fuentes de marca o fuentes propias.

Incluye A–Z, a–z, Ñ ñ, acentos (á é í ó ú, à, â, ä, ã, ç), números y signos (¡! ¿? @ # $ % & € « » …).

## Sobre la versión Neon

`LujosHandNeon-Regular.ttf` es una fuente a color (COLR). El brillo está armado con capas amarillas semitransparentes.

- Se ve con brillo en Chrome, Edge, Firefox y en apps que soportan fuentes a color.
- Donde no hay soporte, se ve como letra lisa del color del texto.

Para el brillo más realista conviene usar:

- los PNG incluidos, o
- la fuente normal con un efecto de *resplandor exterior* amarillo (`#FFE92E`).
