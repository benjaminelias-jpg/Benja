# Classroom by kunfupay — hero landing

Página estática, un solo archivo HTML (CSS y JS incluidos) más la carpeta `assets/`.
No necesita build ni dependencias: súbela tal cual a cualquier hosting estático
(Vercel, Netlify, S3, Nginx) o pégala dentro de tu stack actual.

```
classroom-landing/
├── index.html
├── PENDIENTE-CONFIRMAR.md     datos que faltan por cerrar antes de publicar
└── assets/
    ├── logo-classroom.png     logo del header (wordmark en gris oscuro + "kunfupay" morado)
    ├── sroom-lavanda.png      marca de agua diagonal, PNG transparente
    ├── icon.png               favicon
    ├── prensa/*.svg           Forbes, TechCrunch, Entrepreneur, WIRED, El País, Business Insider
    ├── demo/cx1..cx7.webp     las 7 pantallas del recorrido del alumno
    ├── fondo/aurora-*.webp    fondos de aurora generados (clara y oscura)
    ├── modulos/icono-*.webp   los 6 iconos de módulo de la presentación
    ├── testimonios/*.webp     fotos de los 6 clientes verificados
    ├── pago/*.svg             métodos de pago (Bizum, Pix, Nequi, PSE, Mercado Pago…)
    └── iconos/*.svg           iconos de las apps del ecosistema
```

## Las 5 secciones

Hero (quiz) → 1 Qué es Classroom · 2 El precio · 3 Así lo vive tu alumno · 4 Lo que cambia frente a
lo que usas hoy (comparativa + testimonios + métodos de pago) · 5 FAQ y cierre.

Todas terminan en un botón `.js-abrir-quiz`: abren el **mismo** cuestionario de 3 pasos en el modal,
desde su propia posición. No hay un segundo formulario en ninguna parte.

## Movimiento

- **Revelado al scroll** con `IntersectionObserver` y retardo escalonado (`--d` por tarjeta).
- **Titulares cinéticos**: el JS parte cada `h2.kin` en palabras y entran una detrás de otra.
- **Contador** 0 → 508 en el bloque de precio, con easing, al entrar en pantalla.
- **Recorrido del alumno**: las 7 capturas se pasan solas cada 4,2 s con barra de progreso en el paso
  activo; se pausa al pasar el ratón y solo corre mientras la sección está en pantalla.
- **Tira de métodos de pago** en bucle continuo, pausada al hover.
- **Auroras**: dos fondos generados (`assets/fondo/`) que derivan lentamente; la sección de cierre es
  oscura con la aurora violeta por debajo.
- Todo respeta `prefers-reduced-motion`, y sin JS no se oculta nada (las animaciones van bajo `html.js`).

**Regla de contenido:** la página solo afirma lo que está publicado en la presentación comercial de
Classroom o en la landing fiscal en producción. Ningún porcentaje de comisión (propio o ajeno), ningún
plazo, ninguna garantía y ninguna cifra de tracción inventada. Lo que falta por cerrar está en
`PENDIENTE-CONFIRMAR.md`.

## Detalles de implementación

- **Cinta de prensa**: los 6 logos van repetidos **4 veces** y la animación recorre
  `translateX(-25%)`, es decir, exactamente una copia. Por eso el bucle no tiene salto.
  Si cambias el número de copias, ajusta ese porcentaje (`100% / nº de copias`).
- Los logos se pintan con `filter: brightness(0) invert(.62)` para que todos queden en
  el mismo gris sobre fondo claro, independientemente de su color original.
- La cinta se pausa al pasar el ratón y se detiene con `prefers-reduced-motion`.
- **Quiz**: son `<input type="radio">` reales dentro de `<label>`, así que funcionan con
  teclado y lectores de pantalla. El `change` del formulario está enganchado al final del
  archivo: ahí metes el salto al paso 2, el envío o el evento de analítica.
- El titular parte después de "sobre" por el `max-width:13em` del `h1`; en móvil se libera.
- Punto de quiebre móvil: `max-width: 900px`.

## Pendiente antes de publicar

- Apuntar el CTA / el envío del quiz a la URL real.
- Confirmar el claim "Valorado 4.9/5" y el uso de los logos de prensa.
