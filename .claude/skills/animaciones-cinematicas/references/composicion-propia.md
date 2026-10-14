# Composición propia: cuando ninguna plantilla encaja

Cualquier página HTML que cumpla este contrato se renderiza, se mezcla y se verifica con los mismos scripts. Empieza copiando una plantilla, porque ya trae fondo, cámara, bokeh, viñeta, fuentes y curvas, y cambia solo la escena.

## Índice

1. El contrato
2. Piezas reutilizables (copiar de las plantillas)
3. Patrones de movimiento probados
4. Checklist de una composición nueva

---

## 1. El contrato

```js
window.render = function (t) { /* dibuja el estado exacto en el segundo t; sin animaciones CSS ni timers */ };

window.COMP = {
  fps: 30,
  frames: 450,                       // duración total en fotogramas
  cues: [                            // señales de audio (ver plantillas.md §5)
    { f: 30, type: "riser_corto" }, { f: 30, type: "hit_grave" },
    { f: 210, type: "foley", name: "papel" },
  ],
  warnings: [],                      // avisos de contenido (textos que no caben…)
  warmup: [214],                     // fotogramas a pintar antes de capturar (máscaras CSS, imágenes)
  moving: () => [/* elementos cuyo movimiento decide el motion blur */],
  timeline: { /* opcional: tiempos clave, se vuelcan en build_info.json */ },
  ready: true,                       // ponlo al final, cuando fuentes e imágenes estén cargadas
};
// Si algo falla: window.COMP = { error: "mensaje" }  → render.cjs lo muestra y se detiene.
```

**Reglas del contrato:**

- **Determinista.** `render(t)` depende solo de `t`. Nada de `Date.now()`, `Math.random()` sin semilla, animaciones CSS, `transition` ni `requestAnimationFrame` propios. Así cada fotograma y cada muestra de motion blur es exacta.
- **Carga antes de `ready`.** Espera `document.fonts.load(...)` y `img.decode()` antes de construir y medir.
- **Medidas en estado neutro.** Si mides textos para alinear, quita antes las transformaciones (de la cámara y de los revelados) y restáuralas después.
- **Lienzo de 1080×1920.** Usa un `#stage` con `overflow: hidden`. El fondo debe ser más grande que el lienzo, porque la cámara en mano lo desplaza.

## 2. Piezas reutilizables

Todas están en `templates/sistema-tarjetas/index.html`:

| Pieza | Qué hace |
|---|---|
| `kf(t, keys)` + `mix()` | Keyframes `[[fotograma, valor, curva_de_llegada], …]` con números u objetos (`{y, s, z, b, o}`) |
| `outQuart`, `outCubic`, `inCubic`, `inOutCubic`, `inOutSine` | Las curvas de la skill |
| `reveal(nodo, t, f0)` | Revelado con máscara: sube desde +100 % en 12 f y aparece en 10 f. El padre necesita `.mask { overflow: hidden }` |
| `handheld(t)` | Cámara en mano: suma de senos de 0,4–1,8 Hz, ±5 px, ±0,22° |
| Push-in | `scale(1 + 0.035 * inOutSine(f / total))` en `#world` |
| Paralaje | El fondo se mueve con 0,5 × el temblor; la escena, con 1 × |
| Bokeh, halo y viñeta | Atmósfera; el halo da un pulso con cada hit (lista `HITS`) |
| Profundidad | `#scene { perspective: 1800px }`; un elemento se aleja con `translate3d(0, y, −520px)`, `blur(9px)` y opacidad 0,28 |
| Objeto que sale de su contenedor | Hijo del contenedor; su posición se mezcla en coordenadas absolutas entre el hueco y el centro, y se convierte a relativas dividiendo por la escala del padre (ver el bloque `if (c.o)`) |
| Brillo especular | `.sweep` con degradado a 105°, `mix-blend-mode: screen` y `mask-image` igual a la imagen del objeto |
| Paleta derivada | `tone(k)` multiplica el color de fondo para ambiente y tarjetas |
| Texto con acento | `fmt("Te olvidas de su *IVA.*")` |
| Tiempo de lectura | `readF(texto)` = (palabras ÷ 3 + 1) s en fotogramas |

## 3. Patrones de movimiento probados

- **Agenda → foco → protagonista → cambio → recap.** Es el sistema de tarjetas: el que mejor explica una lista.
- **Revelado de cifra.** Contador con ease-out quart: el hit va cuando la cifra se fija y la etiqueta entra 3 f después. Ver la ficha "Cifra de impacto" de la skill de estilo.
- **Objeto que se presenta solo.** Entra desde abajo y desde el fondo (Z −300 → 0), con giro Y de 25° → 0, sombra creciente, brillo especular al llegar y flotación en reposo.
- **Transición por profundidad.** Lo que sale se aleja en Z y se desenfoca. Lo que entra viene del fondo y se enfoca. Nunca comparten la misma zona a la vez.
- **Comparativa A frente a B.** Dos tarjetas lado a lado (en 9:16, una encima de otra). La perdedora se aleja y la ganadora avanza con hit.

## 4. Checklist de una composición nueva

- [ ] `render(t)` determinista y `COMP.ready` al final.
- [ ] `frames`, `cues` y `moving()` completos: cada movimiento rápido está en `moving()`, porque si no, no tendrá motion blur.
- [ ] Hits en el fotograma de parada visual (ease-out quart de 12 f → +9 f).
- [ ] Ningún momento con más de 3 elementos en foco; zonas seguras respetadas.
- [ ] Vista previa con `--only` y hoja de contactos antes del render completo.
