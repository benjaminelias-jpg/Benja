# "Así cobras con Kunfupay" · 9:16 · 30 fps · 21,7 s

Segunda prueba de la skill `motion-graphics-cinematico`: un sistema de tarjetas por punto con profundidad 3D, objetos reales generados con IA, texto y diseño sonoro con efectos reales.

**Supuestos**: 1080×1920 para Reels, 30 fps, paleta base de la skill. El texto en pantalla usa frases ya aprobadas en `cerebro-kunfupay` ("la factura se la hacemos nosotros", "te olvidas del IVA de cada venta", "a tu nombre"). **Es una prueba de motion graphics, no una pieza publicable:** antes de publicarla hay que pasar el copy por el proceso de verdad fiscal del cerebro.

| Archivo | Qué es |
|---|---|
| `asi-cobras-con-kunfupay.mp4` | El video final |
| `index.html` | La composición: `render(t)` dibuja el estado exacto en el segundo `t` |
| `render.cjs` | Captura en 3 procesos; motion blur adaptativo (de 1 a 10 muestras según el movimiento) |
| `post.py` | Promedia las muestras y añade grano |
| `audio.py` | Mezcla de efectos y música, sincronizada al fotograma |
| `assets/img/` | Factura, calculadora y llave (PNG con transparencia) |
| `assets/audio/` | Efectos y música originales (MP3) |
| `build.sh` | Todo el proceso en un comando |

## Recursos generados

| Recurso | Modelo | Notas |
|---|---|---|
| Factura | GPT 2.5 (alta, 2K, fondo transparente) | Texto legible y sin datos fiscales reales: ni emisor, ni NIF, ni desglose de IVA |
| Calculadora | GPT 2.5 (alta, 2K, fondo transparente) | Se regeneró: las dos primeras versiones (Seedream) tenían teclas duplicadas |
| Llave de latón | Seedream 5 Pro (2K) y recorte de fondo | Macrofotografía con microarañazos y luz de borde cian |
| Riser ×2, hit ×2, whoosh ×3, papel, calculadora, llave | ElevenLabs SFX | Se usaron 2 de los 3 whooshes: el tercero era un golpe, no aire |
| Música | Google Lyria 3 | Ambiente oscuro sin percusión; se le recortan los medios (1–4 kHz) |

Coste total en Magnific: unos 3.000 créditos.

---

## 1. Concepto y storyboard

**La idea**: una agenda de tres puntos. Cada punto avanza hacia el espectador mientras los demás se alejan y se desenfocan. Después se "abre": de la miniatura de la tarjeta sale el objeto real, que se convierte en protagonista, y aparece la frase. Al terminar, el objeto vuelve a su tarjeta, que se aleja, y avanza la siguiente.

- **0,0 s · f0**: sale del negro. Empieza el riser.
- **0,5 s · f15**: "VENDES CURSOS ONLINE" y, escalonado, "ASÍ COBRAS / CON **KUNFUPAY**".
- **1,0 s · f30**: **hit**. El título ya está quieto y el halo da un pulso.
- **3,7 s · f112**: el título se aleja en profundidad (Z −420, desenfoque y fundido).
- **3,9 s · f116**: entran las tres tarjetas desde abajo y desde el fondo, escalonadas cada 4 f. Cada una lleva su número, su línea cian, su título y la miniatura de su objeto.
- **5,3 s · f160**: **la tarjeta 01 avanza al centro** (escala 1,15) y **las otras se alejan** (Z −520, desenfoque de 9 px, opacidad al 28 %). La cámara se acerca un 2,5 %.
- **6,3 s · f190**: la tarjeta sube a cabecera y **la factura sale de su miniatura** en arco, girando en Y hacia la cámara.
- **7,0 s · f210**: la factura aterriza con hit suave y sonido de papel. Un brillo especular la recorre.
- **7,2 s · f216**: "Se la hacemos **nosotros.**"
- **9,6 s · f288**: **cambio**. La factura vuelve a su tarjeta mientras esta se aleja al fondo, y la tarjeta 02 avanza al centro.
- **11,4 s · f342**: la calculadora aterriza con un clic. Aparece "Te olvidas de su **IVA.**"
- **14,3 s · f430**: cambio a 03.
- **16,1 s · f484**: la llave aterriza con un tintineo metálico. Aparece "A **tu nombre.**"
- **18,7 s · f562**: **recap**. Las tres tarjetas vuelven a la agenda. El riser final culmina en un hit (f584) y las líneas cian se iluminan en secuencia (f588, f592, f596).
- **21,0 s · f630**: fundido a negro.

## 2. Capas (de fondo a frente)

| # | Capa | Notas |
|---|---|---|
| 1 | Fondo `#0B111E`, degradados, halo cian y bokeh | Atmósfera; el halo da un pulso en cada hit |
| 2 | Escena 3D (perspectiva de 1800 px) | Las tarjetas que no están en foco se alejan en Z, con desenfoque y menos opacidad |
| 3 | Intro: antetítulo y título de 2 líneas | Inter Medium 32 px y Inter Display SemiBold 96 px; "KUNFUPAY" en cian |
| 4 | Tarjetas 01–03 (820 × 200 px, radio 28) | Número de 72 px, línea cian y título de 48 px; el objeto vive dentro de la tarjeta |
| 5 | Objeto real | Hijo de su tarjeta: sale de la miniatura y vuelve a ella; sombra proyectada y brillo especular enmascarado con su propia silueta |
| 6 | Frases (Inter Display SemiBold 66 px) | Revelado con máscara; una palabra en cian |
| 7 | Viñeta, fundidos y grano | Fijos, como la lente |

**Elementos que compiten por atención**: agenda, 3 tarjetas; foco, la tarjeta de cabecera, el objeto y la frase (3). Las tarjetas desenfocadas del fondo actúan como atmósfera.

**Zonas seguras**: cabecera en y = 320–480, objeto en y = 510–1090 y frase en y = 1135–1205. Todo cabe dentro de la franja libre de y = 269–1248 px.

## 3. Especificaciones de animación (tarjeta 01; las demás repiten el patrón)

| Elemento | Propiedad | De → A | Fotogramas | Curva |
|---|---|---|---|---|
| Tarjeta 01 | Y, escala | 660 → 880 px, 1 → 1,15 | f160–f178 | ease-out quart |
| Tarjetas 02 y 03 | Z, desenfoque, opacidad | 0 → −520 px, 0 → 9 px, 100 → 28 % | f160–f180 | ease-out cubic |
| Cámara | Escala extra de foco | 100 → 102,5 % | f160–f180 | ease-in-out sine |
| Tarjeta 01 | Y, escala | 880 → 400 px, 1,15 → 0,8 | f190–f210 | ease-in-out cubic |
| Factura | Desde la miniatura hasta el centro (540, 800) | escala 0,26 → 1; arco de 70 px; giro Y de hasta 30° → 0 | f190–f210 | ease-out quart |
| Fondo (tarjetas lejanas) | Opacidad y desenfoque extra con el objeto fuera | × 0,45 y +5 px | con el objeto | sigue al objeto |
| Factura | Brillo especular | barrido de izquierda a derecha | f212–f236 | ease-in-out sine |
| Factura | Flotación en reposo | ±6 px, ±0,8°, escala +3,5 % | desde f210 | senoidal |
| Frase | Y en la máscara, opacidad | +100 % → 0, 0 → 100 % | f216–f228 | ease-out quart / cubic |
| Frase | Salida | −24 px, 100 → 0 % | f288–f296 | ease-in cubic |
| Factura | Vuelta a la miniatura | inversa | f288–f304 | ease-in-out cubic |
| Tarjeta 01 | Al fondo | cabecera → Z −520 | f288–f308 | ease-in-out cubic |
| Tarjeta 02 | Al centro | fondo → centro | f292–f310 | ease-out quart |

**Motion blur**: obturador de 180°. Cada fotograma mide cuántos píxeles se mueve cada elemento dentro del obturador y toma una muestra por cada 4 px, hasta 10.

**Cámara**: push-in del 100 al 103,5 % en toda la pieza, un 2,5 % extra mientras hay foco y cámara en mano (±5 px, ±0,22°) con paralaje entre fondo y escena.

## 4. SFX e integración de audio

| Momento | SFX | Nivel (pico de pista) | Sincronía |
|---|---|---|---|
| 0–1,0 s | Riser de la intro | −15 dBFS | Se corta en f30 |
| f30 | Hit grave | −12 dBFS | Título asentado |
| f116, f293, f435, f563 | Whoosh de aire | −17/−18 dBFS | Máxima velocidad de las tarjetas |
| f160 | Whoosh | −16 dBFS | La 01 avanza |
| f192, f324, f466 | Whoosh suave | −21 dBFS | Salida de cada objeto |
| f194–f215 | Papel que se desliza y se asienta | −17 dBFS | Pico en el aterrizaje (f210) |
| f210, f342, f484 | Hit suave | −17/−18 dBFS | Aterrizaje de cada objeto |
| f342 | Clic de tecla | −18 dBFS | Aterrizaje de la calculadora |
| f484 | Tintineo de llave | −16 dBFS | Aterrizaje de la llave |
| 17,5–19,5 s | Riser final | −15 dBFS | Se corta en f584 |
| f584 | Hit grave | −12 dBFS | Las tres tarjetas vuelven a la agenda |
| 0–21,7 s | Música ambiente | −22 dBFS | Medios recortados y compresión 3:1 |

**Master**: −3 dBFS de pico.

## 5. Equivalentes en After Effects

- Las tarjetas son capas 3D bajo una cámara de 50 mm. "Alejarse" equivale a Posición Z −520, desenfoque gaussiano de 9 px y opacidad del 28 %.
- El objeto se emparenta a su tarjeta. Para que salga de ella, anima su Posición y Escala en el espacio de la composición y desemparéntalo durante el vuelo, o usa la expresión de interpolación entre dos nulos ("HUECO" y "CENTRO"):

```js
// Objeto · Posición: mezcla entre el hueco de la tarjeta y el centro
var e = effect("Salida")("Slider") / 100;          // 0 = en su tarjeta, 1 = protagonista
var a = thisComp.layer("HUECO").toComp([0, 0, 0]);
var b = thisComp.layer("CENTRO").toComp([0, 0, 0]);
var arco = -70 * Math.sin(Math.PI * e);
var p = a + (b - a) * e;
[p[0], p[1] + arco];
```

- Brillo especular: un sólido con degradado lineal y modo Trama, con el objeto como mate alfa. Anima la posición del degradado.

## 6. Checklist de la skill

- [x] Nunca hay más de 3 elementos en foco a la vez.
- [x] Sin movimiento lineal: llegadas en ease-out quart, cambios en ease-in-out cubic y salidas en ease-in.
- [x] Escalonados: tarjetas cada 4 f, intro cada 3 f.
- [x] Punto de atención fijo: cada tarjeta en foco llega al mismo sitio y cada objeto aterriza en el mismo centro.
- [x] Una familia tipográfica (Inter), con tildes verificadas ("ASÍ").
- [x] Un acento: cian en líneas, halo y la palabra clave de cada frase.
- [x] Push-in, cámara en mano con paralaje y motion blur adaptativo.
- [x] Cada hit, aterrizaje y whoosh está alineado a su fotograma; niveles dentro de rango.
- [x] Sin CTAs ni bocadillos.
- [x] Tiempos de lectura respetados: la intro dura 3,0 s; las frases, 2,4 s, 2,7 s y 2,4 s.
