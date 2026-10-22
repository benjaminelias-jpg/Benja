# Classroom by kunfupay — hero landing

Página estática, un solo archivo HTML (CSS y JS incluidos) más la carpeta `assets/`.
No necesita build ni dependencias: súbela tal cual a cualquier hosting estático
(Vercel, Netlify, S3, Nginx) o pégala dentro de tu stack actual.

```
classroom-landing/
├── index.html
└── assets/
    ├── logo-classroom.png     logo del header (wordmark en gris oscuro + "kunfupay" morado)
    ├── sroom-lavanda.png      marca de agua diagonal, PNG transparente
    ├── icon.png               favicon
    └── prensa/*.svg           Forbes, TechCrunch, Entrepreneur, WIRED, El País, Business Insider
```

## Dónde tocar cada cosa

| Qué | Dónde |
|---|---|
| Titular, subtítulo, letra chica, rating | `<main class="hero">` en `index.html` |
| Pregunta y opciones del quiz | `<form class="quiz">` |
| Botón morado en lugar del quiz | descomenta el `<a class="cta">` y borra el `<form>` |
| Colores, tipografía, velocidad de la cinta | bloque `:root` (`--purple-1`, `--purple-2`, `--marquee-speed`) |
| Logos de prensa | `assets/prensa/` + la lista de `<img>` en `<section class="press">` |

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
