---
name: animaciones-cinematicas
description: Produce videos MP4 terminados de motion graphics cinematográficos (Reels, TikTok, Shorts en 9:16) a partir de un guion o de una lista de puntos. Cada punto tiene su tarjeta, que avanza al centro mientras las demás se alejan en 3D; de ella sale un objeto real generado con IA (facturas, llaves, productos en ultra HD). Incluye revelados de texto, tarjetas de sección, efectos de sonido reales y música sincronizados al fotograma, motion blur real y grano. Trae plantillas configurables, render con Chromium, mezcla de audio automática, verificación de sincronía y hojas de contacto. Úsala siempre que pidan generar, renderizar o exportar una animación o un video animado, animar puntos o un guion, una intro, una cortinilla o un reel con gráficos, o poner objetos o elementos reales en una animación, aunque no digan MP4. Para solo diseñar o guionizar sin renderizar basta motion-graphics-cinematico.
---

# Animaciones cinematográficas: del brief al MP4

Esta skill **produce el video terminado**. La estética es la de `motion-graphics-cinematico` (estilo Mirko Vigna). Si esa skill está disponible, sus reglas mandan; aquí va el resumen que no se negocia:

- **Una idea por momento** y como máximo **3 elementos** compitiendo por atención. El fondo, el grano y las tarjetas desenfocadas al fondo no cuentan.
- **Nada lineal.** Las llegadas van en ease-out quart (`cubic-bezier(0.25, 1, 0.5, 1)`), las salidas en ease-in y más cortas, y los elementos de un grupo se escalonan 2–4 fotogramas.
- **Vida constante.** Siempre hay push-in lento, cámara en mano sutil y motion blur real.
- **Fondo y tipografía.** Fondo oscuro con un único acento que señala la palabra clave. Una sola familia tipográfica (Inter, incluida) con tildes, ñ, ¿ y ¡.
- **Sonido orgánico.** Riser → hit en el fotograma en que el elemento **frena a la vista**, whoosh en la máxima velocidad y foley real en cada aterrizaje. Nada de pitidos ni *pops* por palabra.
- **Zonas seguras de Reels.** Sin texto en el 14 % superior, el 35 % inferior ni el 6 % lateral.

## Requisitos

Comprueba antes de empezar: `node`, el paquete `playwright` (local o global) con Chromium, `python3` con `numpy`, `scipy` y `Pillow`, y `ffmpeg`. Si falta algo:

- Playwright: `npm i -g playwright && npx playwright install chromium`.
- Python: `pip install numpy scipy pillow`.

En los entornos en la nube de Claude, Chromium ya está instalado: no ejecutes `playwright install`.

Para objetos y sonidos nuevos hace falta un generador conectado (Magnific; Higgsfield como alternativa). Sin él se trabaja con la biblioteca de sonidos incluida y con imágenes que aporte el usuario.

En adelante, `SKILL` es la carpeta de esta skill (la ruta base que aparece al cargarla).

## Flujo de trabajo

### 1. Brief y plantilla

Elige la plantilla que encaja:

| Plantilla | Para qué | Duración típica |
|---|---|---|
| `sistema-tarjetas` | De 1 a 5 puntos. Agenda → cada tarjeta avanza al centro (las demás se alejan) → sale su objeto real → frase → cambio → recap | 15–35 s |
| `tarjeta-seccion` | Abrir un capítulo: "01 · LA CONSTANCIA" (número, línea de acento, antetítulo y título) | 5 s |

Si el encargo no encaja en ninguna, construye una composición propia con el contrato de `references/composicion-propia.md`. El render, el audio y la QA funcionan igual.

**Reglas del texto**:

- Títulos de tarjeta de 2–3 palabras en mayúsculas.
- Frases de 2–6 palabras, con una sola palabra en acento (`*así*`).
- La intro debe decir de qué va el video en los primeros 3 segundos.

Los tiempos de lectura los calcula el motor (palabras ÷ 3 + 1 s). Un texto largo alarga el video o se encoge para caber, así que acórtalo antes.

Si hay una skill de marca (por ejemplo `cerebro-kunfupay`), usa sus frases aprobadas y no inventes promesas. Cuando el copy no esté validado, dilo al entregar.

### 2. Objetos reales

Sigue `references/recursos-ia.md`:

1. Consulta el saldo y estima el coste. Avisa al usuario antes de generar.
2. Pide 2 variantes de cada objeto.
3. Revisa cada imagen a tamaño real. La IA duplica teclas, deforma letras e inventa logos.
4. Regenera las que fallen.
5. Pásalas por `scripts/preparar_imagen.py`.

Un objeto que muestra texto (factura, calculadora, pantalla) necesita un modelo que escriba bien. Uno sin texto (llave, monedas, tarjeta) puede ir con un modelo fotorrealista y recorte de fondo.

### 3. Proyecto

```bash
bash SKILL/scripts/nuevo_proyecto.sh sistema-tarjetas <carpeta_del_proyecto>
```

- Edita `config.js` (contenido, paleta y objetos) y copia las imágenes a `assets/img/`.
- En `audio.json`, la biblioteca incluida (`@skill/assets/sfx/…`) cubre riser, hits, whooshes y música.
- Genera foley nuevo solo cuando el objeto lo pida (papel, monedas, cremallera…).
- La referencia completa de ambos archivos está en `references/plantillas.md`.

### 4. Vista previa antes de renderizar

Una vista previa tarda segundos; un render completo, minutos. **Revisa siempre antes:**

```bash
node SKILL/scripts/render.cjs <proyecto> <proyecto>/build/prev --only 45,150,240,300,560,600
python3 SKILL/scripts/hoja_contacto.py <proyecto>/build/prev <proyecto>/build/prev.png --cols 8 --width 240
```

`render.cjs` escribe `<proyecto>/build_info.json` con la línea de tiempo (`P`, `L`, `S`…). Úsala para elegir los fotogramas: la intro, la agenda, cada protagonista (`L+20`), cada cambio (`S+4`) y el recap. Lee los `AVISO:` de la consola: avisan de textos que no caben.

### 5. Render completo

```bash
bash SKILL/scripts/build.sh <proyecto> [salida.mp4]
```

Lánzalo en segundo plano: tarda unos 4–6 minutos por cada 20 s de video, con 3 procesos. Encadena:

1. Captura con motion blur adaptativo.
2. Grano.
3. Mezcla de audio desde las señales de la composición.
4. MP4 en BT.709 a CRF 26.
5. Hoja de contactos.
6. Verificación de sincronía.

### 6. QA (no se entrega sin ella)

Sigue `references/qa-y-lecciones.md`:

- **Transiciones:** hoja de contactos cada 4 fotogramas alrededor de cada cambio, buscando solapes, textos sobre textos y objetos que tocan otros elementos.
- **Encuadre y tipografía:** objetos que se salen de la zona segura y glifos mal renderizados.
- **Sincronía:** la salida de `verificar_sync.py`, con un desfase global de ~0 ms y todos los eventos en "OK".
- **Calidad final:** decodifica un fotograma protagonista del MP4 y comprueba que el texto del objeto se lee.

Si algo falla, corrige `config.js` (o la composición), repite la vista previa y vuelve a renderizar.

### 7. Entrega

Envía el MP4 (con `SendUserFile` si existe) y un resumen corto que incluya:

- Qué pasa en pantalla.
- Qué recursos se generaron y cuánto costaron.
- Qué se verificó y qué no. Normalmente no puedes escuchar el audio: dilo.

Si el trabajo vive en un repositorio, haz commit de las fuentes (`config.js`, `audio.json`, imágenes) y del MP4 final, pero nunca de `build/`.

## Errores que ya cometimos (y cómo evitarlos)

- **El hit va donde el elemento frena a la vista, no en el último keyframe.** Con ease-out quart de 12 f, a los 9 f ya está quieto. Las plantillas lo calculan solas.
- **Alinea cada golpe por su ataque, no por su máximo global.** La saturación aplana el inicio y el máximo puede caer en la cola. `mezcla_audio.py` ya lo hace.
- **Un bloque que sale y otro que entra no comparten zona a la vez.** La salida termina antes de que empiece la entrada.
- **En un recap, lo que cruza la pantalla pasa mientras lo demás sigue al fondo.** Si dos tarjetas en foco se cruzan, se lee como un error.
- **Objetos con texto generados por IA:** cuenta las teclas y lee cada palabra antes de usarlos.
- **Mide el layout en estado neutro.** Con transformaciones aplicadas, las medidas salen mal.
- **Precarga las máscaras CSS** (el render hace un calentamiento) o el primer brillo sale sin máscara.
- **No hagas commit de un MP4 provisional.** Ocupa decenas de MB en el historial.

## Recursos de la skill

- `templates/`: motores `sistema-tarjetas` y `tarjeta-seccion`, con contenido de ejemplo.
- `scripts/`: `nuevo_proyecto.sh`, `render.cjs`, `post.py`, `mezcla_audio.py`, `codificar.sh`, `build.sh`, `hoja_contacto.py`, `verificar_sync.py` y `preparar_imagen.py`.
- `assets/sfx/`: biblioteca de sonidos reales: hit grave, hit suave, 2 whooshes, riser corto, riser largo, papel, teclas, llave y música ambiente.
- `assets/fonts/`: Inter Medium e Inter Display SemiBold (licencia OFL).
- `references/plantillas.md`: configuración de cada plantilla, línea de tiempo, señales de audio y qué ajustar.
- `references/recursos-ia.md`: generación de objetos, foley y música (modelos, prompts, costes y revisión).
- `references/composicion-propia.md`: el contrato para crear una composición nueva y las piezas reutilizables.
- `references/qa-y-lecciones.md`: el procedimiento de revisión, con ejemplos de fallos y sus arreglos.
