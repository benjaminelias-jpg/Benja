# Expresiones de After Effects listas para pegar

Todas funcionan con el motor JavaScript y con el ExtendScript heredado. Para pegarlas, haz Alt/Opción + clic en el cronómetro de la propiedad indicada.

Las entradas se calculan desde `inPoint` (el inicio de la capa), así que son reutilizables: si mueves la capa en la línea de tiempo, la animación la acompaña. Los valores ajustables están arriba de cada expresión, con nombres en español.

## Índice

1. Entrada desde abajo con ease-out (Posición)
2. Fundido de opacidad en la entrada
3. Escalonado automático (keyframe offset)
4. Zoom progresivo (Escala)
5. Cámara en mano (Posición y Rotación)
6. Contador numérico (Texto de origen)
7. Dibujado de línea (Recortar trazados)
8. Crecimiento de barras (Escala)
9. Loops ambientales (`loopOut`)
10. Suavizado (`smooth`)
11. Revelado de texto con animador y máscara
12. Ajustes de motion blur

---

## 1. Entrada desde abajo con ease-out

**Propiedad**: Posición (sin separar dimensiones).

```js
// Entra desde abajo y desacelera al llegar (≈ cubic-bezier(0.25, 1, 0.5, 1))
var dur     = framesToTime(12);  // 0,4 s a 30 fps
var dist    = 60;                // px que recorre desde abajo
var retraso = framesToTime(0);   // suma 2–4 f por elemento para escalonar
var t = clamp((time - inPoint - retraso) / dur, 0, 1);
var e = 1 - Math.pow(1 - t, 4);  // ease-out quart
var y = value[1] + dist * (1 - e);
value.length > 2 ? [value[0], y, value[2]] : [value[0], y];
```

Con las dimensiones separadas, pégala en **Posición Y** y cambia las tres últimas líneas por `value + dist * (1 - e);`.

## 2. Fundido de opacidad en la entrada

**Propiedad**: Opacidad.

```js
var fotogramas = 10;               // entre 8 y 12
var retraso    = framesToTime(0);
ease(time - inPoint - retraso, 0, framesToTime(fotogramas), 0, 100);
```

## 3. Escalonado automático (keyframe offset)

**Opción A: capas con los mismos keyframes.** Anima el primer elemento, copia sus keyframes a los demás y pega esta expresión en la misma propiedad de cada uno. Ordena las capas en el panel según el orden de entrada.

```js
var paso    = framesToTime(3);  // separación entre elementos: 2–4 f
var primera = 1;                // índice de la primera capa del grupo
valueAtTime(time - paso * (index - primera));
```

**Opción B: entradas por expresión (1 y 2).** Sustituye la línea de `retraso` por:

```js
var retraso = framesToTime(3) * (index - 1);  // ajusta el 1 al índice de la primera capa
```

## 4. Zoom progresivo

**Propiedad**: Escala. Multiplica la escala que ya tenga la capa.

```js
// Push-in continuo del 100 % al 104 % durante toda la permanencia
var zoomFinal = 1.04;   // entre 1.03 y 1.05
mul(value, ease(time, inPoint, outPoint, 1, zoomFinal));
```

Para todo un grupo, aplícala a un **nulo de cámara** situado en el centro de la composición y emparenta los elementos a él. Así escalan juntos alrededor del centro.

## 5. Cámara en mano

**Propiedad**: Posición del nulo de cámara (el mismo del zoom) o de una cámara 3D.

```js
// Cámara en mano sutil: baja frecuencia (respiración, no temblor) y baja amplitud
var frecuencia = 0.7;   // oscilaciones por segundo: 0,5–1
var amplitud   = 4;     // px: 2–6
wiggle(frecuencia, amplitud, 2, 0.5);
```

**Propiedad**: Rotación del mismo nulo.

```js
wiggle(0.5, 0.3);   // ±0,3°
```

Con zoom y cámara en mano en el mismo nulo, todos los elementos emparentados se mueven como si fueran una sola toma.

## 6. Contador numérico

**Propiedad**: Texto de origen (Source Text).

```js
// Cuenta hasta la cifra final y desacelera al llegar
var desde    = 0;
var hasta    = 1250000;
var dur      = 1.2;     // segundos
var sep      = ".";     // separador de miles: "." en España, "," en México y EE. UU.
var prefijo  = "+";     // p. ej. "+", "$" o ""
var sufijo   = "";      // p. ej. " %" o "x"
var t = clamp((time - inPoint) / dur, 0, 1);
var e = 1 - Math.pow(1 - t, 4);
var n = Math.round(desde + (hasta - desde) * e);
prefijo + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep) + sufijo;
```

Para que el texto no "baile" durante el conteo, usa cifras tabulares si la fuente las tiene, o alinea el párrafo al centro con un ancho fijo.

## 7. Dibujado de línea

**Propiedad**: Recortar trazados → Final (Trim Paths → End).

```js
// La línea se dibuja con una rampa progresiva: acelera y luego frena
var inicio = framesToTime(10);
var dur    = 1.5;   // segundos
var t = clamp((time - inPoint - inicio) / dur, 0, 1);
var e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;  // ease-in-out cubic
e * 100;
```

## 8. Crecimiento de barras

**Propiedad**: Escala de cada barra, con el **punto de anclaje en la base**.

```js
// Cada barra crece 3 f después de la anterior y desacelera al llegar
var paso    = framesToTime(3);
var primera = 1;                 // índice de la primera barra
var dur     = framesToTime(18);
var t = clamp((time - inPoint - paso * (index - primera)) / dur, 0, 1);
var e = 1 - Math.pow(1 - t, 4);
[value[0], value[1] * e];
```

## 9. Loops ambientales

**Propiedad**: cualquiera que tenga keyframes (por ejemplo, la opacidad de un brillo de fondo).

```js
loopOut("pingpong");   // ida y vuelta: "respiración" de una luz ambiental
```

```js
loopOut("cycle");      // repite el ciclo de keyframes tal cual
```

En un loop ambiental mantén la amplitud mínima: opacidad entre 60 y 80 %, nunca de 0 a 100.

## 10. Suavizado

**Propiedad**: Posición, Rotación o cualquier propiedad con datos de tracking o keyframes temblorosos.

```js
smooth(0.3, 7);   // ancho de 0,3 s y 7 muestras
```

## 11. Revelado de texto con animador y máscara

No es una expresión sino una receta para que las letras emerjan de una línea invisible:

1. En la capa de texto: **Animar → Posición**, con valor `0, 100`. Dentro del mismo animador, **Añadir → Propiedad → Opacidad** al 0 %.
2. En el **Selector de rango → Avanzado**: *Basado en*: Palabras (o Líneas para frases); *Forma*: **Rampa hacia arriba** (Ramp Up).
3. Anima el **Desplazamiento** (Offset) del selector de −100 % a 100 % en 12–15 f, con *Easy Ease Out*.
4. **La máscara**: crea encima una capa de forma rectangular cuyo borde inferior coincida con la línea base del texto y úsala como **mate alfa** (Alpha Matte) del texto. Las letras subirán desde detrás de ese borde.
5. Activa el motion blur en la capa.

## 12. Ajustes de motion blur

- Activa el interruptor de motion blur en cada capa que se mueva y también el de la composición. Sin el segundo, no se renderiza.
- **Composición → Configuración → Avanzado**: ángulo de obturador de 180°, fase de −90°, 16 muestras por fotograma y límite adaptativo de 128.
- Para movimientos muy rápidos que se vean "a saltos", sube las muestras a 32 antes de tocar el ángulo de obturador.
