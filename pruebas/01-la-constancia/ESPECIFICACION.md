# Tarjeta de sección "01 · LA CONSTANCIA" · 9:16 · 30 fps · 5,0 s

Prueba de la skill `motion-graphics-cinematico` (plantilla 1 de `references/plantillas.md`).

**Supuestos**: 1080×1920 para Reels, 30 fps, sin branding propio (se usa la paleta base de la skill). Se renderiza desde una composición HTML a MP4; la sección 5 da los equivalentes para After Effects.

Archivos de esta carpeta:

| Archivo | Qué es |
|---|---|
| `01-la-constancia.mp4` | El video final (H.264 + AAC 48 kHz) |
| `index.html` | La composición: `render(t)` dibuja el estado exacto en el segundo `t` |
| `render.cjs` | Captura fotograma a fotograma; toma 16 muestras de obturador en los tramos rápidos |
| `post.py` | Promedia las muestras (motion blur real) y añade grano fino |
| `audio.py` | Diseño sonoro sintetizado: riser, hit, dos hushes y música |
| `build.sh` | Todo el proceso en un comando |

---

## 1. Concepto y storyboard

**La idea**: abrir un capítulo con peso. El espectador debe leer "01 · LA CONSTANCIA" sin buscarlo y sentir que empieza algo importante. Toda la tensión sonora y lumínica se concentra en un instante, el hit de f30.

- **0,0 s · f0**: negro. Empieza el riser y la imagen sale del negro hacia un fondo azul noche con halo central, bokeh desenfocado y viñeta. La mirada va al centro del halo, donde aparecerá todo.
- **0,63 s · f19**: arranca el hush, 2 f antes del movimiento.
- **0,7 s · f21**: el "01" emerge desde una línea invisible a la altura de su línea base, con motion blur.
- **0,8 s · f24**: la línea cian crece desde su centro: el acento señala el inicio del capítulo.
- **0,9 s · f27**: aparece "LA".
- **1,0 s · f30**: **hit**. El "01" ya está quieto, el riser se corta en ese fotograma y el halo responde con un pulso de luz. Empieza a subir "CONSTANCIA".
- **1,4 s · f42**: la tarjeta está completa. La permanencia dura 2,7 s, el doble del tiempo mínimo de lectura (2 palabras ÷ 3 + 1 s ≈ 1,7 s), con push-in continuo y cámara en mano.
- **4,13 s · f124**: salida en orden inverso, escalonada cada 2 f, con hush de salida.
- **4,6 s · f138**: fundido a negro, completo en f149.

## 2. Capas y tiempos (de fondo a frente)

| # | Capa | Entra | Sale | Notas |
|---|---|---|---|---|
| 1 | Fondo `#0B111E` y degradados ambientales | f0 | f149 | Sobredimensionado 60 px por lado para la cámara en mano |
| 2 | Halo cian (`#4CC9F0` al 5 %) | f0 | f149 | Pulso al 11 % en el hit; decae con τ = 0,55 s |
| 3 | Bokeh (6 discos desenfocados al 2,5–5 %) | f0 | f149 | Atmósfera y profundidad; deriva senoidal lenta |
| 4 | Cámara (nulo): fondo y primer plano | f0 | f149 | Push-in y cámara en mano; paralaje entre fondo y texto |
| 5 | "01": Inter Display SemiBold, 204 px, blanco | f21 | f138 | Máscara rectangular en su línea base |
| 6 | Línea: 3 × 151 px, cian, con brillo | f24 | f136 | Mide exactamente la altura de las cifras |
| 7 | "LA": Inter Medium, 32 px, tracking +340, blanco al 62 % | f27 | f134 | Con máscara |
| 8 | "CONSTANCIA": Inter Display SemiBold, 80 px, tracking +30, blanco | f30 | f132 | Su línea base coincide con la del "01" |
| 9 | Viñeta | f0 | f149 | Fija, como la lente: no se mueve con la cámara |
| 10 | Grano (posproducción) | f0 | f149 | σ ≈ 3/255 de luminancia, distinto en cada fotograma; evita el banding |

Elementos que compiten por atención a la vez: "01", línea y bloque de título (3). Fondo, halo, bokeh, viñeta y grano son atmósfera.

Jerarquía: "01" frente a "CONSTANCIA", 2,55:1; "CONSTANCIA" frente a "LA", 2,5:1.

Zonas seguras: el grupo ocupa de x = 116 a 969 px (852 px de ancho, centrado). Con el push-in máximo queda entre x ≈ 97 y 983, dentro del margen del 6 % (65–1015 px). En vertical queda centrado en y = 880, dentro de la franja libre (269–1248 px).

## 3. Especificaciones de animación

| Capa | Propiedad | De → A | Fotogramas | Curva |
|---|---|---|---|---|
| Negro | Opacidad | 100 → 0 % | f0–f12 | ease-out cubic |
| "01" | Posición Y (dentro de la máscara) | +100 % → 0 | f21–f33 | ease-out quart, `cubic-bezier(0.25, 1, 0.5, 1)` |
| "01" | Opacidad | 0 → 100 % | f21–f31 | ease-out cubic |
| Línea | Escala Y desde el centro | 0 → 100 % | f24–f34 | ease-out quart |
| "LA" | Posición Y y opacidad | +100 % → 0 / 0 → 100 % | f27–f39 | ease-out quart / cubic |
| "CONSTANCIA" | Posición Y y opacidad | +100 % → 0 / 0 → 100 % | f30–f42 | ease-out quart / cubic |
| Halo | Opacidad | 5 → 11 % → 5 % | sube f28–f30 y decae después | exponencial, τ = 0,55 s |
| Cámara | Escala del fondo | 100 → 103 % | f0–f149 | ease-in-out sine |
| Primer plano | Escala adicional (paralaje) | 100 → 101,2 % | f0–f149 | ease-in-out sine |
| Cámara | Cámara en mano | ±5 px, ±0,22° (fondo al 40 %) | continuo | suma de senos de 0,41–1,83 Hz |
| "CONSTANCIA" | Posición Y y opacidad | 0 → −30 px / 100 → 0 % | f124–f132 | ease-in cubic |
| "LA" | Igual | Igual | f126–f134 | ease-in cubic |
| Línea | Escala Y y opacidad | 100 → 0 % | f128–f136 | ease-in cubic |
| "01" | Posición Y y opacidad | 0 → −30 px / 100 → 0 % | f130–f138 | ease-in cubic |
| Negro | Opacidad | 0 → 100 % | f138–f149 | ease-in-out sine |

Motion blur: obturador de 180° con fase de −90°, 16 muestras por fotograma en f19–f44 y f122–f140.

Por qué el hit va en f30 y no en f33, aunque la curva "termine" en f33: con ease-out quart, en f30 al "01" le queda menos de 1 px por recorrer, así que a la vista ya ha frenado. Un golpe en f33 se sentiría 3 fotogramas tarde.

## 4. SFX e integración de audio

| Momento | SFX | Nivel (pico de la pista) | Sincronía |
|---|---|---|---|
| 0,00–1,00 s · f0–f30 | Riser: aire con filtro ascendente de 250 Hz a 6 kHz, reverb invertida y cuerpo grave que sube una octava | −15 dBFS | Se corta en f30 |
| 0,63 s · f19 (pico en f21) | Hush de entrada: aire con filtro descendente de 2,4 kHz a 700 Hz | −16 dBFS | Pico en el fotograma de máxima velocidad del "01" |
| **1,00 s · f30** | **Hit grave suave**: boom de 100 → 44 Hz, cuerpo de 120–190 Hz, transitorio sin brillo y cola de sala | −12 dBFS | Ataque en f30,04 y pico en f30,09 |
| 4,20 s · f126 (pico en f134) | Hush de salida: aire con filtro ascendente de 600 Hz a 1,9 kHz | −18 dBFS | Pico en el centro de las salidas con ease-in |
| 0–5 s | Música: quintas abiertas en Re (D2, A2, D3, A3), filtrada por debajo de 900 Hz y con reverb | −22 dBFS | Se abre +2 dB tras el hit |

**Master**: normalizado a −3 dBFS de pico, sin ningún pico por encima de 0 dB.

## 5. Equivalentes en After Effects

Expresiones de `references/expresiones-after-effects.md` aplicadas a esta pieza (cada capa empieza en su `inPoint`):

```js
// "01" · Posición (capa con mate alfa rectangular en su línea base). Para "LA" y "CONSTANCIA", lo mismo.
var dur = framesToTime(12), dist = 204;   // dist = alto de la caja del texto
var t = clamp((time - inPoint) / dur, 0, 1);
var e = 1 - Math.pow(1 - t, 4);
[value[0], value[1] + dist * (1 - e)];
```

```js
// Línea · Escala (ancla en el centro)
var t = clamp((time - inPoint) / framesToTime(10), 0, 1);
[value[0], value[1] * (1 - Math.pow(1 - t, 4))];
```

```js
// Nulo "CAM" · Escala: push-in de toda la pieza
mul(value, ease(time, inPoint, outPoint, 1, 1.03));
```

```js
// Nulo "CAM" · Posición y Rotación: cámara en mano
wiggle(0.7, 5, 2, 0.5);   // Posición
wiggle(0.5, 0.22);        // Rotación
```

Capas de texto en el orden "01", línea, "LA", "CONSTANCIA", desplazadas 3 f entre sí (f21, f24, f27, f30). Motion blur activado en capa y composición, con obturador de 180°.

## 6. Checklist de la skill

- [x] Nunca hay más de 3 elementos gráficos simultáneos ("01", línea y título).
- [x] Ningún movimiento es lineal: entradas ease-out quart, salidas ease-in cubic, cámara ease-in-out sine y bokeh senoidal.
- [x] Escalonado de 3 f en las entradas y de 2 f en las salidas.
- [x] Punto de atención único en el centro y zonas seguras respetadas.
- [x] Una sola familia (Inter, cortes Text y Display), con soporte completo para español; escala título:cuerpo de 2,5:1.
- [x] Paleta constante; el cian solo aparece en la línea y en el halo.
- [x] Push-in, cámara en mano con paralaje y motion blur real.
- [x] El hit cae en f30, el riser termina en f30, el hush llega a su pico en la máxima velocidad y todas las pistas están en rango.
- [x] Sin CTAs, bocadillos ni *pops* por palabra.
