# Classroom by kunfupay — hero landing

Página estática, un solo archivo HTML (CSS y JS incluidos) más la carpeta `assets/`.
No necesita build ni dependencias: súbela tal cual a cualquier hosting estático
(Vercel, Netlify, S3, Nginx) o pégala dentro de tu stack actual.

```
classroom-landing/
├── index.html
├── gracias.html              confirmación de lead cualificado (URL propia, para los píxeles)
├── potenciales.html          la misma página para quien aún no factura
├── PENDIENTE-CONFIRMAR.md     datos que faltan por cerrar antes de publicar
└── assets/
    ├── logo-classroom.png     logo del header (wordmark en gris oscuro + "kunfupay" morado)
    ├── sroom-lavanda.png      marca de agua diagonal, PNG transparente
    ├── icon.png               favicon
    ├── prensa/*.svg           Forbes, TechCrunch, Entrepreneur, WIRED, El País, Business Insider
    ├── demo/cx1..cx7.webp     las 7 pantallas del recorrido del alumno
    ├── testimonios/*.webp     fotos de los 6 clientes verificados
    ├── pago/*.svg             métodos de pago (Bizum, Pix, Nequi, PSE, Mercado Pago…)
    └── iconos/*.svg           iconos de las apps del ecosistema
```

## Las 5 secciones

Hero (quiz) → 1 Qué es Classroom · 2 El precio · 3 Así lo vive tu alumno · 4 Lo que cambia frente a
lo que usas hoy (comparativa + testimonios + métodos de pago) · 5 FAQ y cierre.

Todas terminan en un botón `.js-abrir-quiz`: abren el **mismo** cuestionario de 3 pasos en el modal,
desde su propia posición. No hay un segundo formulario en ninguna parte.

## Lenguaje visual

Editorial y plano, sin adornos de plantilla:

- **Nada de botones de plástico**: rectángulos planos de 4 px de radio, negro tinta o morado sólido,
  sin degradados ni sombras de color. El movimiento es una flecha que avanza 3 px al pasar el ratón.
- **Nada de iconos genéricos**: los módulos van numerados (01–06) sobre una retícula de filetes de 1 px.
  Un punto morado marca el único módulo destacado.
- **Nada de fondos de IA**: se retiraron las auroras generadas. Lo que hay es una textura de grano SVG
  al 3,5 % y un halo radial muy tenue por sección.
- **El precio se lee como una factura**: lista con puntos de guía, total tachado y un 0 gigante enfrente,
  con cifras tabulares.
- **La comparativa son dos columnas de filetes**, no tarjetas; los testimonios, citas editoriales con
  foto en blanco y negro que recupera el color al pasar por encima.
- **El cierre es una sección oscura** y el footer, el logotipo «Classroom» a tamaño gigante, recortado
  por el borde inferior, con degradado que lo funde en el fondo.

## Movimiento

- **Revelado al scroll** con `IntersectionObserver` y retardo escalonado (`--d` por tarjeta).
- **Titulares cinéticos**: el JS parte cada `h2.kin` en palabras y entran una detrás de otra.
- **Contador** 0 → 508 en el total de la factura, al entrar en pantalla.
- **Recorrido del alumno**: las 7 capturas se pasan solas cada 4,2 s con un filete de progreso en el
  paso activo; se pausa al pasar el ratón y solo corre mientras la sección está en pantalla.
- **Tira de métodos de pago** en bucle continuo, pausada al hover.
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

## Qué pasa al enviar el formulario

El quiz reparte los leads en dos URLs **con la misma página**: lo que ve la persona es idéntico,
lo que cambia es la dirección y el evento, para que Meta y GA puedan separarlos.

| Respuesta | Destino | Evento |
|---|---|---|
| Ya factura y ya tiene curso o comunidad | `gracias.html` | `Lead` + `lead_gracias`, segmento `cualificado` |
| «¡Quiero crear la primera!» o «Aún no facturo» | `potenciales.html` | `Lead` + `lead_potencial`, segmento `potencial` |

Pasos:

1. El quiz guarda el lead: `localStorage.kf_lead`, cookie `kf_lead_email` en `.kunfupay.com`
   (30 min) y el `fetch` al backend, que está comentado y marcado como ENDPOINT.
2. Dispara `quiz_lead_submit` con modelo, facturación, segmento y origen del botón.
3. Navega a la página que toque llevando **todos los datos en la URL**: `nombre`, `email`,
   `whatsapp`, `tiene_comunidad`, `facturacion`, `segmento`, `origen` y los UTM de la visita.
4. Allí se dispara `Lead` (con el segmento como parámetro) y, a los **3 segundos**, salta a
   `https://classroom.kunfupay.com/signup?email=…` con todo lo anterior detrás.

Ojo: nombre, correo y WhatsApp viajan en la query string, así que quedan en los logs del servidor
y en los informes de analítica. Es lo pedido; si algún día molesta, la alternativa es pasarlos solo
por la cookie y el `localStorage`, que ya están puestos.

## Medición

La misma matriz que el resto de landings de Kunfupay, en las tres páginas:

- `noindex,nofollow` (tráfico pagado, no compite en orgánico).
- GTM **GTM-K7WQX54Z** · GA4 **G-V3BVYL1YP3** · Píxel de Meta **611181908386410**.
- Eventos propios: `start_quiz`, `quiz_step_2`, `quiz_step_3`, `quiz_lead_submit`, y en destino
  `lead_gracias` o `lead_potencial`, todos con copia en `dataLayer`.
- Regla de Meta respetada: `value` es numérico y reservado, así que modelo, facturación y segmento
  viajan como parámetros con nombre propio, nunca en `value`.
- El hueco de Google Ads está marcado en las dos páginas de destino:
  `gtag('event','conversion', {send_to:'AW-…'})`.

**Falta un cambio en el alta.** Hoy `/signup` ignora el parámetro: lo comprobé en el navegador y el
campo llega vacío. Para que el usuario solo tenga que poner contraseña, el formulario de alta tiene
que leer el correo. Cualquiera de las dos vale:

```tsx
// opción A — Server Component de Next
export default function Signup({ searchParams }) {
  const email = searchParams?.email ?? ''
  return <input name="email" type="email" defaultValue={email} readOnly={!!email} />
}

// opción B — en cliente, sirve también si llegan desde otra pestaña
const url = new URL(location.href)
const email = url.searchParams.get('email')
  || document.cookie.match(/(?:^|; )kf_lead_email=([^;]*)/)?.[1]
if (email) emailInput.value = decodeURIComponent(email)
```

## Pendiente antes de publicar

- Apuntar el CTA / el envío del quiz a la URL real.
- Confirmar el claim "Valorado 4.9/5" y el uso de los logos de prensa.
