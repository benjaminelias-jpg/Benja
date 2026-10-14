# Objetos reales, foley y música con IA

Cómo generar los elementos "reales" (objetos fotorrealistas, sonidos de contacto y música) con los conectores disponibles, cuánto cuestan y cómo revisarlos.

## Índice

1. Antes de gastar
2. Qué modelo para cada objeto
3. Prompts de objetos (plantillas)
4. Revisión de imágenes y errores típicos
5. Preparar la imagen para el motor
6. Efectos de sonido y foley
7. Música
8. Higgsfield como alternativa

---

## 1. Antes de gastar

1. Consulta el saldo: `account_balance` en Magnific o `balance` en Higgsfield.
2. Estima cada llamada con `simulate_cost` (mismos argumentos que la llamada real).
3. Dile al usuario en una línea qué vas a generar y el coste aproximado, y sigue: el encargo ya lo autoriza. Si el coste es alto respecto al saldo, pregunta.
4. Lanza todas las generaciones a la vez, en paralelo, y espera con `creations_wait`.

Costes de referencia en Magnific (octubre de 2026; compruébalos siempre):

| Operación | Créditos |
|---|---|
| GPT 2.5 (`gpt-2-mini`), calidad alta, 2K, fondo transparente | 600 por imagen |
| Seedream 5 Pro, 2K | 100 por imagen |
| Recorte de fondo | 3 |
| Efecto de sonido (ElevenLabs), 1–3 s | 5–15 |
| Música Google Lyria 3 (30 s) | 80 |

Un video de 3 puntos con objetos nuevos, foley y música cuesta unos 2.000–3.000 créditos.

## 2. Qué modelo para cada objeto

| Objeto | Modelo | Por qué |
|---|---|---|
| **Con texto o símbolos** (factura, recibo, calculadora, pantalla de móvil, etiqueta, contrato) | GPT 2.5 (`mode: "gpt-2-mini"`, `quality: "high"`, `resolution: "2k"`, `transparentBackground: true`) | Escribe texto legible y saca el fondo transparente sin recorte |
| **Sin texto** (llave, monedas, tarjeta sin marca, candado, reloj, planta) | Seedream 5 Pro (`resolution: "2k"`) sobre fondo negro o gris liso, más `images_remove_background` | Más fotorrealista y barato; el fondo liso se recorta limpio |

Pide siempre `count: 2` y elige la mejor.

- **Formato:** retrato (`3:4`) para documentos y aparatos, cuadrado (`1:1`) para objetos alargados como una llave.
- **Fondo según el objeto:** los oscuros (calculadora, móvil negro) van mejor sobre gris claro, porque sobre negro el recorte se come los bordes. Los claros o metálicos, sobre negro.

## 3. Prompts de objetos

Estructura: **qué es + vista + material y detalle + luz + contenido exacto (si tiene texto) + qué no debe aparecer + aislamiento**.

**Documento con texto (factura):**

```
Photorealistic studio photograph of one printed paper invoice, A4 portrait, seen straight-on,
very slightly curled paper with subtle natural shading, ultra-detailed paper fibre texture,
soft diffused studio light from the upper left. Clean modern minimal layout in Spanish, black
text on bright white paper: a large heading 'FACTURA' top left with a thin cyan line beneath
it; to the right 'Nº 2026-0143' and 'Fecha: 14/10/2026'; a block 'Cliente: Alumno'; a simple
table with columns 'Concepto' and 'Importe' and a single row 'Curso online — acceso
completo' / '297,00 €'; at the bottom right 'TOTAL 297,00 €' in bold. No logos, no company
names, no addresses, no tax ID numbers, no signatures, no stamps. Every word crisp, correctly
spelled and legible. Isolated object on a transparent background, no ground shadow.
```

**Aparato con teclas (calculadora).** Hay que dar la distribución exacta, porque si no la IA duplica teclas:

```
… A slim grey LCD display at the top showing only the digit '0' on the right. Simple standard
key layout of 19 dark graphite keys with crisp white labels, exactly: first row 'C', '±',
'%', '÷'; second row '7', '8', '9', '×'; third row '4', '5', '6', '−'; fourth row '1', '2',
'3', '+'; fifth row a wide '0' key, then '.', then '='. Each label appears only once. No brand
name, no logo, no extra text. Isolated object on a transparent background, no ground shadow.
```

**Objeto sin texto (llave):**

```
Ultra high definition macro product photograph of a single modern brass house key lying
horizontally with the bow on the left and the blade pointing right, polished metal with fine
micro-scratches and crisp sharp bitting cuts, warm golden reflections, a cool cyan rim light
along the top edge, isolated on a pure seamless black background, sharp focus across the
whole key, studio product photography, 8k detail.
```

Pon una luz de borde del color de acento ("cool cyan rim light"): integra el objeto con la paleta del video.

**Reglas de contenido.** Nada de logos ni marcas reales. Tampoco datos fiscales reales (NIF, RFC, direcciones), firmas, sellos oficiales ni documentos que imiten a una administración. Los importes y las fechas son de ejemplo y deben parecerlo. Si el objeto representa a la marca del usuario, que sea genérico.

## 4. Revisión de imágenes

Compón las variantes sobre el color de fondo del video (no sobre blanco) y míralas a buen tamaño. Busca:

- **Texto:** letras inventadas, palabras mal escritas o cifras que no cuadran.
- **Teclas y botones:** duplicados (dos "MC", dos "÷") o símbolos que no existen.
- **Geometría:** dientes de la llave fundidos, esquinas imposibles, sombras dentro del recorte.
- **Recorte:** halos claros o oscuros en el borde, partes del objeto comidas.

Si hay fallos, **regenera** con un prompt más explícito (distribución exacta, "each label appears only once") o cambia de modelo. Un objeto con errores visibles arruina la sensación de "real".

## 5. Preparar la imagen

```bash
python3 SKILL/scripts/preparar_imagen.py descarga.png <proyecto>/assets/img/objeto.webp --max 1400
```

El script recorta al contenido (alfa), deja un margen de 12 px para la sombra, reduce a 1400 px como máximo y guarda en WebP (calidad 92). Si la imagen no tiene transparencia, falla con un aviso: recórtale el fondo primero.

Las URLs de descarga de Magnific llevan un token: descárgalas con `curl -L -o archivo "URL"` en una carpeta propia.

## 6. Efectos de sonido y foley

Herramienta: `audio_sfx_generate` de Magnific (ElevenLabs). La duración es un entero, de 1 a 30 s. Describe la fuente, la superficie y la perspectiva, no un estilo musical:

| Uso | Prompt | Duración |
|---|---|---|
| Hit grave | Deep cinematic sub boom impact, soft and warm low-end thump with a short dark room reverb tail, no metallic crack, no high frequencies, single hit. | 3 s, `variations: 2` |
| Whoosh | Soft fast air whoosh of a card swiping past close to the camera, smooth and subtle, clean, no tonal sound. | 1 s, `variations: 3` |
| Riser corto | Cinematic tension riser: airy reverse whoosh swelling up and ending abruptly at its loudest point, smooth and clean, no melody, no beeps, no tonal synth. | 2 s, `promptInfluence: 0.5` |
| Riser largo | Slow cinematic riser building tension over three seconds, airy whoosh with a low rumble underneath, ending abruptly at its peak, no melody, no beeps. | 3 s |
| Papel | A single sheet of paper slides across a wooden desk and settles, crisp soft paper rustle, close microphone, quiet room. | 2 s |
| Tecla | Three quick soft button presses on a desktop calculator, muted plastic clicks, close microphone, quiet room. | 2 s |
| Llave | A single metal key is set down gently on a wooden desk, one short soft metallic clink, close microphone, quiet room. | 2 s |
| Monedas | A few coins dropped gently onto a wooden table, short bright metallic chime, close microphone, quiet room. | 2 s |
| Tarjeta | A plastic bank card placed down on a glass table, single soft click, close microphone. | 1 s |

**Revisa cada sonido antes de usarlo.** No podrás escucharlo, así que analiza la forma de onda: duración, dónde está el pico y si hay varios golpes. Por ejemplo, de los whooshes de 1 s, uno salió como un golpe seco de 60 ms y no como aire, y se descartó. Para los sonidos con varios eventos (clics de teclas), mira dónde cae cada uno y recorta uno con `recorte` en `audio.json`.

Guarda los MP3 originales en `<proyecto>/assets/audio/` y refiérelos desde `audio.json` con ruta relativa.

## 7. Música

`audio_music_generate` con `model: "google-lyria-3"` genera 30 s fijos por 80 créditos. Para más de 27 s usa `google-lyria-3-pro` (30–180 s). Prompt de referencia:

```
Minimal dark cinematic ambient underscore for a premium explainer video: warm low analog synth
pad, soft sustained sub bass, subtle airy texture, slowly evolving, calm and confident, no
drums, no percussion, no melody, no vocals, around 70 BPM.
```

`mezcla_audio.py` le recorta los medios y la comprime. Aun así, comprueba en la forma de onda que no tenga golpes rítmicos marcados que choquen con los hits.

## 8. Higgsfield como alternativa

Si Magnific no está conectado o no tiene saldo:

- **Imágenes:** `generate_image` (el modelo por defecto es `gpt_image_2_5`, bueno con texto) y `remove_background`. Consulta los modelos con `models_explore`.
- **Coste:** con `get_cost: true` obtienes el coste antes de generar.
- **Sonido:** Higgsfield no genera efectos de sonido ni música de uso general. En ese caso usa la biblioteca incluida en `assets/sfx/`.
