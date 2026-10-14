# Motion en CSS y GSAP

Equivalentes web de las reglas del estilo, para piezas en navegador o composiciones HTML que se renderizan como video (por ejemplo, HyperFrames, que usa GSAP).

## Índice

1. Variables base (paleta, curvas, fotograma)
2. Revelado de texto con máscara y escalonado
3. Zoom progresivo y cámara en mano
4. Grano y viñeta
5. Movimiento reducido
6. GSAP: tarjeta de sección completa
7. Tabla de equivalencias de curvas

---

## 1. Variables base

```css
:root {
  --bg: #0B111E;
  --ink: #FFFFFF;
  --accent: #4CC9F0;

  --ease-out-cine:   cubic-bezier(0.25, 1, 0.5, 1);   /* entradas: ease-out quart */
  --ease-in-cine:    cubic-bezier(0.5, 0, 0.75, 0);   /* salidas: ease-in quart */
  --ease-inout-cine: cubic-bezier(0.65, 0, 0.35, 1);  /* barridos y dibujado: ease-in-out cubic */
  --ease-push:       cubic-bezier(0.37, 0, 0.63, 1);  /* zoom progresivo: ease-in-out sine */

  --f: calc(1000ms / 30);  /* 1 fotograma a 30 fps ≈ 33 ms */
}

body { background: var(--bg); color: var(--ink); font-family: "Inter", "Montserrat", sans-serif; }
```

## 2. Revelado de texto con máscara y escalonado

```html
<div class="tarjeta">
  <span class="mascara"><span class="item" style="--i:0">01</span></span>
  <span class="mascara"><span class="item" style="--i:1">LA CONSTANCIA</span></span>
</div>
```

```css
.mascara {
  display: inline-block;
  overflow: hidden;          /* la máscara rectangular */
  line-height: 1.1;
  padding-bottom: 0.08em;    /* que no recorte los descendentes */
}
.mascara > .item {
  display: inline-block;
  animation: emerger 0.4s var(--ease-out-cine) both;
  animation-delay: calc(var(--i, 0) * 3 * var(--f));  /* offset de 3 f entre elementos */
}
@keyframes emerger {
  from { transform: translateY(100%); opacity: 0; filter: blur(4px); }  /* el blur imita el motion blur */
  to   { transform: translateY(0);    opacity: 1; filter: blur(0); }
}
```

## 3. Zoom progresivo y cámara en mano

Usa dos contenedores anidados para que las animaciones no se pisen.

```html
<div class="camara">
  <div class="escena"><!-- contenido --></div>
</div>
```

```css
.escena { animation: push-in 6s var(--ease-push) both; }
@keyframes push-in {
  from { transform: scale(1); }
  to   { transform: scale(1.04); }
}

.camara { animation: en-mano 7s ease-in-out infinite alternate; }
@keyframes en-mano {
  0%   { translate: 0 0;        rotate: 0deg; }
  25%  { translate: 3px -2px;   rotate: 0.2deg; }
  50%  { translate: -2px 3px;   rotate: -0.15deg; }
  75%  { translate: -3px -1px;  rotate: 0.1deg; }
  100% { translate: 2px 2px;    rotate: -0.2deg; }
}
```

## 4. Grano y viñeta

```css
.escena { position: relative; }
.escena::before,
.escena::after { content: ""; position: absolute; inset: 0; pointer-events: none; }

/* Viñeta */
.escena::after {
  background: radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.55) 100%);
}

/* Grano fino */
.escena::before {
  opacity: 0.06;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}
```

## 5. Movimiento reducido

En piezas web (no en video renderizado), respeta la preferencia del sistema:

```css
@media (prefers-reduced-motion: reduce) {
  .camara, .escena, .mascara > .item { animation: none; }
}
```

## 6. GSAP: tarjeta de sección completa

`cubic-bezier(0.25, 1, 0.5, 1)` equivale a `"power3.out"` en GSAP (ease-out quart). Si necesitas la curva exacta, usa `CustomEase.create("cine", "0.25, 1, 0.5, 1")`.

```js
const F = 1 / 30;  // un fotograma a 30 fps

const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 12 * F } });

tl.from(".numero", { yPercent: 100, opacity: 0 }, 0)
  .from(".linea",  { scaleY: 0, transformOrigin: "50% 50%", duration: 10 * F }, 3 * F)
  .from(".titulo", { yPercent: 100, opacity: 0 }, 6 * F)
  // Zoom progresivo durante toda la permanencia
  .to(".grupo", { scale: 1.03, duration: 2.5, ease: "sine.inOut" }, 0)
  // Salida: más corta, ease-in y escalonado inverso de 2 f
  .to([".titulo", ".linea", ".numero"], {
    y: -30, opacity: 0, duration: 8 * F, ease: "power3.in", stagger: 2 * F
  }, 2.5);

// Cámara en mano sutil sobre el contenedor
gsap.to(".camara", {
  x: "random(-3, 3)", y: "random(-3, 3)", rotation: "random(-0.3, 0.3)",
  duration: 1.4, ease: "sine.inOut", repeat: -1, repeatRefresh: true
});
```

Los elementos que entran con `yPercent: 100` deben estar dentro de un contenedor con `overflow: hidden` (la máscara, ver sección 2).

## 7. Equivalencias de curvas

| Uso | CSS | GSAP | After Effects |
|---|---|---|---|
| Entradas | `cubic-bezier(0.25, 1, 0.5, 1)` | `power3.out` | Último keyframe con *Easy Ease In* (Mayús+F9), influencia de entrada ≈ 85 %; primer keyframe con influencia de salida ≈ 15 % |
| Salidas | `cubic-bezier(0.5, 0, 0.75, 0)` | `power3.in` | Primer keyframe con *Easy Ease Out* (Ctrl/Cmd+Mayús+F9), influencia de salida ≈ 85 % |
| Barridos y dibujado | `cubic-bezier(0.65, 0, 0.35, 1)` | `power2.inOut` | *Easy Ease* (F9) en ambos keyframes |
| Zoom progresivo | `cubic-bezier(0.37, 0, 0.63, 1)` | `sine.inOut` | *Easy Ease* (F9) con influencia ≈ 33 % |

Ojo con los nombres: en CSS y GSAP, *ease-out* describe la curva completa (frena al final). En After Effects, *Easy Ease In* y *Easy Ease Out* se aplican al lado de entrada o de salida de **un keyframe**. Por eso, para que un elemento frene al llegar, se aplica *Easy Ease In* al último keyframe.
