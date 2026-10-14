# Plantillas: configuración, línea de tiempo y ajustes

Las dos plantillas son 9:16 (1080×1920) a 30 fps. Cada proyecto tiene tres archivos:

- `index.html`: el motor. No se edita para cambiar contenido.
- `config.js`: el contenido.
- `audio.json`: qué suena y a qué nivel.

## Índice

1. sistema-tarjetas: `config.js`
2. sistema-tarjetas: línea de tiempo que calcula el motor
3. tarjeta-seccion: `config.js` y tiempos
4. `audio.json` (las dos plantillas)
5. Señales de audio que emite cada plantilla
6. Ajustes finos dentro del motor
7. Otros formatos (16:9, 1:1)

---

## 1. sistema-tarjetas: `config.js`

```js
window.CONFIG = {
  fps: 30,
  palette: { bg: "#0B111E", accent: "#4CC9F0" },     // fondo oscuro + un acento
  intro: {
    kicker: "VENDES CURSOS ONLINE",                  // antetítulo (opcional)
    lines: ["ASÍ COBRAS", "CON *KUNFUPAY*"],         // 1–3 líneas; *x* = acento
  },
  points: [                                          // 1 a 5 puntos
    { title: "LA FACTURA",                           // 2–3 palabras, mayúsculas
      caption: "Se la hacemos *nosotros.*",          // 2–6 palabras, una palabra en acento
      image: "assets/img/factura.webp",              // PNG/WebP con fondo transparente (opcional)
      rot: -5,                                       // inclinación del objeto (grados)
      foley: "papel",                                // sonido al aterrizar (clave de audio.json → foley)
      glow: false },                                 // halo de acento: útil en objetos oscuros
  ],
};
```

**Paleta.** El ambiente y el fondo de las tarjetas se derivan del color `bg` multiplicando su luminosidad, así que conservan su tono. Usa fondos oscuros: luminosidad de 8 a 20 en cada canal. El acento se usa en la línea de cada tarjeta, el halo, el bokeh y la palabra marcada.

**Puntos sin imagen.** La frase aparece grande (84 px) en el centro y no hay vuelo ni aterrizaje. Sirve para un punto conceptual, pero el sistema luce cuando cada punto tiene su objeto.

**Textos que no caben.** El motor reduce el título de la tarjeta, las líneas de la intro y la frase hasta que caben, y avisa (`AVISO:` en `render.cjs`) si quedan demasiado pequeños. Acorta el texto en vez de aceptar letra diminuta.

## 2. sistema-tarjetas: línea de tiempo

Todo en fotogramas (30 fps). `lectura(texto) = ceil((palabras ÷ 3 + 1) × 30)`.

| Momento | Fórmula | Ejemplo (3 puntos) |
|---|---|---|
| Intro: antetítulo / líneas | f15 / f21, f24, f27… (cada 3 f) | f15, f21, f24 |
| Hit de la intro | f30 (la primera línea frena) | f30 |
| Intro se aleja | `max(90, 15 + lectura(intro) − 12)`, 12 f | f103 |
| Entran las tarjetas | intro + 12, escalonadas cada 4 f, 16 f cada una | f115 |
| Agenda quieta | 24 f | hasta f163 |
| Punto k: avanza al centro (`P`) | 18 f, ease-out quart; las demás se alejan en 20 f | P = 163 |
| Título en el centro | P+18 → P+30 | |
| Sube a cabecera y sale el objeto | P+30 → P+50 | |
| Aterrizaje (`L`) | P+50: hit suave + foley + brillo | L = 213 |
| Frase | L+6, revelado de 12 f | f219 |
| Cambio (`S`) | frase + max(lectura(frase), 72 f) | S = 291 |
| Siguiente punto | S+4 | P = 295 |
| Recap | la última tarjeta baja (S → S+16); las demás avanzan (S+12 → S+32) | |
| Hit final | S+30, con riser largo | |
| Pulsos de las líneas | S+34, +4 f por tarjeta | |
| Fundido a negro | último pulso + 36 f, 19 f | |

Las duraciones salen solas: 3 puntos ≈ 22 s y 5 puntos ≈ 32 s. Para acortar, recorta las frases: cada palabra son unos 10 f.

**Estados de una tarjeta** (posición Y, escala, Z, desenfoque, opacidad):

| Estado | Valores |
|---|---|
| `LIST(i)` | en su sitio de la agenda, 1, 0, 0, 1 |
| `CENTER` | y = 880, 1,15, 0, 0, 1 |
| `HEADER` | y = 400, 0,8, 0, 0, 1 |
| `REC(j, foco)` | y = 880 + (j − foco) × 260, 1, −520, 9 px, 0,28 |

Con un objeto en primer plano, las del fondo se alejan aún más (× 0,45 de opacidad y +5 px de desenfoque).

## 3. tarjeta-seccion

```js
window.CONFIG = {
  fps: 30,
  palette: { bg: "#0B111E", accent: "#4CC9F0" },
  numero: "01",
  antetitulo: "LA",          // opcional
  titulo: "CONSTANCIA",
  // permanenciaMin: 3,      // segundos mínimos con la tarjeta completa (opcional)
};
```

**Tiempos**:

- El número entra en f21, la línea en f24, el antetítulo en f27 y el título en f30.
- El hit cae en f30.
- La tarjeta se mantiene `max(lectura, 82 f)`.
- Sale en orden inverso cada 2 f y termina con un fundido de 12 f.

Con el ejemplo dura 5 s.

**Alineación.** La línea base del título coincide con la del número y la línea de acento mide lo mismo que las cifras. Si el grupo supera 860 px de ancho, el motor lo reduce.

## 4. `audio.json`

```json
{
  "niveles": { "hit_grave": -12, "hit_suave": -17, "whoosh": -17, "whoosh_suave": -21,
               "riser_corto": -15, "riser_largo": -15 },
  "sonidos": {
    "hit_grave": "@skill/assets/sfx/hit_grave.mp3",
    "whoosh": ["@skill/assets/sfx/whoosh_1.mp3", "@skill/assets/sfx/whoosh_2.mp3"]
  },
  "foley": {
    "papel": { "archivo": "@skill/assets/sfx/papel.mp3", "recorte": [0.9, null], "nivel": -17 },
    "tecla": { "archivo": "@skill/assets/sfx/teclas.mp3", "recorte": [1.40, 1.58], "nivel": -18 }
  },
  "musica": { "archivo": "@skill/assets/sfx/musica_ambiente.mp3", "nivel": -22, "recortar_medios": true },
  "master": -3
}
```

- **Rutas:** relativas al proyecto, absolutas o `@skill/…`.
- **Listas:** si un tipo tiene varios archivos, se alternan para que los whooshes no suenen idénticos.
- **Niveles:** son de pico de cada sonido, según la sección 4.2 de la skill de estilo. El master se normaliza al final.
- **`recorte`:** `[inicio, fin]` en segundos, con `null` para "hasta el final". Úsalo para quedarte con un solo clic de un archivo de varios o para quitar el arranque de un roce.
- **Música:** se le recortan los medios (1–4 kHz, para dejar sitio a una voz) y se comprime 3:1, con fundidos de 1,5 s y 1,2 s. Pon `"musica": null` si va a llevar locución con su propia música.
- **Biblioteca incluida:** `hit_grave`, `hit_suave`, `whoosh_1`, `whoosh_2`, `riser_corto` (2 s), `riser_largo` (3 s), `papel`, `teclas` (varios clics: recorta uno), `llave` y `musica_ambiente` (27 s, oscura y sin percusión). Para videos más largos de 27 s, genera música más larga.

## 5. Señales de audio

**sistema-tarjetas**:

| Señal | Cuándo |
|---|---|
| `riser_corto` | Termina en el hit de la intro |
| `hit_grave` | Intro y recap |
| `whoosh` | Entran las tarjetas, cada tarjeta avanza al centro, cada cambio y el recap |
| `whoosh_suave` | Salida de cada objeto |
| `hit_suave` + `foley` | Aterrizaje de cada objeto |
| `riser_largo` | Termina en el hit del recap |

**tarjeta-seccion**:

| Señal | Cuándo |
|---|---|
| `riser_corto` | Termina en f30 |
| `hit_grave` | f30 |
| `whoosh` | f21 |
| `whoosh_suave` | En la salida |

`render.cjs` vuelca las señales en `build_info.json` y `mezcla_audio.py` las convierte en audio.

## 6. Ajustes finos (constantes del motor)

En `index.html` de `sistema-tarjetas`:

| Constante | Qué controla | Valor |
|---|---|---|
| `HERO` | centro y caja máxima del objeto protagonista | (540, 810), 760 × 560 |
| `CAP_Y` | altura de la frase | 1170 |
| `CENTER`, `HEADER`, `REC` | estados de las tarjetas | ver arriba |
| `THUMB`, `SLOT_X` | miniatura en la tarjeta | 175 × 150, x = +300 |
| arco del vuelo | `-70 * sin(π·e)` | 70 px |
| giro Y en el vuelo | `30 * sin(π·e) * (1 − e) * 1.5` | hasta ~30° |
| flotación en reposo | ±6 px, 0,28 Hz; escala +3,5 % | |
| cámara en mano | ±5 px, ±0,22° | |

Si tocas posiciones, revisa la zona segura:

- La cabecera ocupa de y = 320 a 480.
- El objeto, de 530 a 1090.
- La frase, de 1135 a 1205.

## 7. Otros formatos

Las plantillas están maquetadas para 9:16. Para 16:9 (1920×1080) o 1:1:

- Cambia el tamaño de `#stage` y el viewport de `render.cjs` (`viewport` en `openPage`).
- Recoloca las constantes de geometría. En 16:9 la agenda puede ir en horizontal (tarjetas en fila) y el protagonista a la izquierda con la frase a la derecha.
- Recalcula las zonas seguras para la plataforma.
