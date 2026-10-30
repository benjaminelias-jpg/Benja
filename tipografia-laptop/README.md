# Laptop Grotesk

Tipografía que reproduce las letras de la foto de pantalla "con tu laptop trabajando desde": una sans serif gruesa, algo chueca y con los bordes comidos.

| Archivo | Qué es |
|---|---|
| `LaptopGrotesk-Regular.ttf` | La fuente para instalar (Windows, Mac, Canva, CapCut, Figma) |
| `LaptopGrotesk-Regular.woff2` | La misma fuente para usar en una página web |
| `muestra.png` | Todas las letras, números y signos |
| `muestra-texto.png` | La fuente en frases reales |
| `comparacion-con-la-foto.png` | La foto original al lado de la fuente con efecto de pantalla |
| `GUST-FONT-LICENSE.txt` | Licencia de TeX Gyre Heros, de donde salen los glifos generados |
| `src/` | Recortes de la foto y scripts para volver a generar la fuente |

## Cómo está hecha

- **14 minúsculas recortadas de la foto:** a b c d e j l n o p r s t u. Cada letra se enderezó, se recortó y se vectorizó tal cual, con sus bordes y deformaciones reales. Cuando una letra aparece varias veces en la foto, cada aparición quedó como una versión distinta: la "a", la "t" y la "d" tienen 3 versiones, y la "n" y la "e" tienen 2.
- **Todo lo demás se generó:** mayúsculas, las otras minúsculas, números, signos y acentos. Se partió de TeX Gyre Heros Bold, un clon libre de Helvetica, y se le aplicó una simulación de la foto: baja resolución de pantalla, deformación, desenfoque y textura de píxeles. La simulación se calibró midiendo contra las letras recortadas: forma (85 % de coincidencia), grosor de trazo y cantidad de desgaste.
- **Versiones que se alternan:** las letras y números generados tienen 3 versiones. La función OpenType `calt` las alterna sola, para que las letras repetidas no salgan iguales.
- **Espaciado apretado,** con las letras casi tocándose como en la foto. Incluye ajustes de pares (`kern`) para T, V, W, Y, L, A, P y F, para la í y para la puntuación.

## Instalar

- **Windows:** clic derecho en el `.ttf` → *Instalar*.
- **Mac:** doble clic → *Instalar fuente*.
- **Canva / CapCut:** subir el `.ttf` en fuentes de marca o fuentes propias.

Incluye A–Z, a–z, Ñ ñ, acentos (á é í ó ú, à, â, ä, ã, õ, ç, también en mayúscula), números y signos (¡! ¿? . , : ; " " ' ' ( ) [ ] { } / \ | - – — _ + = < > * # $ % & @ ^ ~ ° ª º « » € · • …).

## Licencia

Los glifos generados derivan de TeX Gyre Heros (© GUST e-foundry), que se distribuye bajo la GUST Font License (LPPL 1.3c, ver `GUST-FONT-LICENSE.txt`). Como pide esa licencia, la fuente derivada tiene otro nombre. Las 14 minúsculas recortadas vienen de la foto de pantalla aportada.

## Volver a generarla

Requiere `fonttools`, `skia-pathops`, `opencv-python-headless`, `numpy`, `scipy` y `scikit-image`.

```bash
cd src/full
python3 build_full.py ../../LaptopGrotesk-Regular.ttf
```

- `src/trace/letters/`: las máscaras de las letras recortadas de la foto, con sus parámetros (`*.json`).
- `src/full/params.json`: los ajustes de la simulación de foto.
