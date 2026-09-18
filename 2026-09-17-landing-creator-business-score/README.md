# Creator Business Score · landing + auditoría funcional

Landing de captación de Classroom Platinum con la auditoría funcionando de
verdad: 5 preguntas de diagnóstico más un paso de captación de correo. Puntúa,
identifica la limitación raíz según la Teoría de las Limitaciones y devuelve un
diagnóstico hiperpersonalizado.

Implementa el Manual Maestro de Arquitectura, Algoritmo y Diagnósticos: la
jerarquía de 7 limitaciones, el cuestionario de 5 preguntas y los 10 casos de
la matriz maestra.

Sin build, sin dependencias, sin backend.

```bash
cd Entregables/2026-09-17-landing-creator-business-score && python3 -m http.server 8242
```

## Archivos

| Archivo | Qué contiene |
|---|---|
| `index.html` | Las tres vistas: landing, formulario y resultado |
| `styles.css` | Estilos. Todo el color, radio y tipografía sale de los tokens |
| `data.js` | **Contenido editable**: preguntas, los 10 casos y la jerarquía |
| `app.js` | Motor de puntuación, enrutado condicional y render |
| `tarjeta.js` | Dibuja en canvas la imagen compartible de 1080 × 1920 |
| `assets/tokens-morfeo.css` | Copia de los tokens de Morfeo |
| `assets/classroom-lockup-by-kunfupay.svg` | Lockup oficial de Classroom (copia de `sistema-visual/logo/classroom/`) |

## Marca

La cabecera lleva el **lockup oficial de Classroom**: isotipo Tatami, wordmark
"Classroom" y la firma "by Kunfupay". Vive en
`sistema-visual/logo/classroom/classroom-lockup-by-kunfupay.svg` y aquí hay una
copia en `assets/`.

**Va incrustado en línea en el HTML, no con `<img src>`.** El wordmark es un
`<text>` en Plus Jakarta Sans y, dentro de un `<img>`, el SVG no carga la fuente
del documento y caería a una tipografía de sistema. En línea hereda la fuente de
la página, verificado. La firma "by" pide `Geist`, que no está en Morfeo, así que
ahí sí cae al tipo de sistema.

Se usa tal cual, sin redibujarlo ni recolorearlo. Mide 62 px de alto en
escritorio y 46 px en móvil, dentro de una barra de 78 px.

**El lockup es un `<button>`, no un enlace.** Como `<a href="./">` daba un 404
en cualquier despliegue que no cuelgue de la raíz del dominio, ahora devuelve a
la portada dentro de la misma página, sin recargar.

El favicon es el isotipo Tatami, embebido como `data:` URI en el `<head>`. No
hay archivo suelto que servir ni ruta que se pueda romper.

## Cómo funciona el motor

### Paso 1 · Puntaje de 0 a 100

Cada respuesta aporta un valor. El total es una media ponderada.

El orden en pantalla es: **P1 comunidad · P2 situación · P3 modelo ·
P4 facturación · P5 dolor**, más el paso 6 del correo. El motor lee cada
respuesta por su `id`, nunca por su posición, así que reordenar `PREGUNTAS`
en `data.js` no toca el algoritmo.

| Variable | Origen | Peso |
|---|---|---|
| Facturación | P4 | 35 % |
| Ritmo del negocio | P2 | 25 % |
| Escalabilidad del modelo | P3 | 15 % |
| Conversión de audiencia | derivada | 15 % |
| Tamaño de comunidad | P1 | 10 % |

La conversión de audiencia es derivada, no preguntada: compara lo que factura
el negocio con el tamaño de su comunidad. Mucha audiencia y poca facturación da
conversión baja, que es justo el diagnóstico del caso 2.2.

### Paso 2 · Enrutado condicional

Se evalúa por bloques de facturación y, dentro de cada bloque, en el mismo orden
del manual: la primera regla que encaja gana. La facturación manda, así que a
quien factura más de 50.000 € nunca se le diagnostica falta de validación ni ventas
esporádicas.

| Caso | Condición | Limitación | Escalón |
|---|---|---|---|
| 1.1 | Más de 50.000 € + agencia o 1 a 1 | Operaciones | 6 |
| 1.2 | Más de 50.000 € + high-ticket o híbrido + dolor de entrega | Fulfillment | 5 |
| 1.3 | Más de 50.000 € + low ticket o e-commerce, o caja inestable | Finanzas | 7 |
| 2.1 | 15.000 €–40.000 € + cierre, o ritmo caótico o inestable | Ventas | 4 |
| 2.2 | 15.000 €–40.000 € + más de 20.000 seguidores + prospectos | Marketing | 3 |
| 2.3 | 15.000 €–40.000 € + coaching 1 a 1 + caos operativo | Fulfillment | 5 |
| 3.1 | 5.000 €–15.000 € + autoridad, o menos de 5.000 seguidores | Branding | 2 |
| 3.2 | 5.000 €–15.000 € + prospectos o cierre | Product-market fit | 3 |
| 4.1 | Menos de 5.000 € + hábitos, o ritmo caótico | Mindset | 1 |
| 4.2 | Menos de 5.000 € + cualquier otro dolor | Validación inicial | 1 |

Las combinaciones que el manual no cubre caen al caso por defecto de su bloque:
1.2 en el bloque 1, 2.1 en el bloque 2 y 3.2 en el bloque 3. El motor lo marca
como `exacto: false` para poder auditarlo, aunque en pantalla no se muestra.

### Paso 3 · Califica, no califica, o queda fuera de perfil

`califica = el modelo aplica + factura ≥ 1.000 € al mes + comunidad ≥ 5.000 seguidores`

**El puntaje no interviene en la puerta.** Es un semáforo de madurez que se
muestra siempre, no el filtro. Los dos umbrales viven en las constantes del
principio de `app.js` y se comparan con el campo `desde` de la opción elegida,
que es el suelo de su tramo: 1.000 € es la segunda opción de facturación y
5.000 seguidores la tercera de comunidad.

- **Califica**: cierre con "Aplicar a Classroom Platinum".
- **No califica**: los 3 pasos del caso más el paso 04 de Kunfupay y la
  súper-CTA "Empezar con Kunfupay", que enlaza a la URL con UTM.
- **Fuera de perfil**: ver abajo.

### Fuera de perfil · E-commerce y producto físico

P3 tiene una sexta opción, **E-commerce / Producto físico**, marcada en
`data.js` con `noAplica: true`. Quien la elige recibe su puntuación completa y
su diagnóstico, pero **nunca califica**, sea cual sea su facturación.

En pantalla eso se traduce en un cierre deliberadamente suave, sin rechazo y
sin empujón a otra oferta:

- Chip neutro `chip--neutral` con "Fuera del perfil de Platinum": ni el verde
  del aprobado ni el rojo del suspenso.
- El texto de `FUERA_DE_PERFIL` explica que lo que no encaja es el programa,
  no el negocio.
- Sin botón de aplicar, sin paso 04 y sin súper-CTA. Solo los 3 pasos y una
  nota de cierre.

En el enrutado, el e-commerce del bloque 1 va al caso 1.3 (finanzas y margen),
no al 1.2: vive del margen sobre el costo de tráfico, no de una oferta cebolla.

## El paso 6 · captación de correo

La última pregunta no puntúa ni enruta: pide el correo donde recibir la
puntuación. Se declara en `data.js` con `tipo: 'email'`, y el formulario pinta
un campo en lugar de cinco opciones.

Su botón dice "Envíame mi puntuación" y es el **único** que queda en el
formulario, porque las preguntas de opción avanzan solas. Está bloqueado hasta
que el correo tiene forma válida, y el valor se conserva si se vuelve atrás.

**El correo no se envía a ninguna parte todavía.** Queda en memoria y viaja en
el objeto de resultado (`res.email`). Para capturarlo de verdad hay que
conectar un destino en el envío del formulario: tu ESP, el CRM o un endpoint
propio. Mientras tanto, la promesa de "te la enviamos" no se cumple sola.

## Medición · el desenlace y el puntaje

Cada auditoría termina en uno de tres desenlaces, y los dos datos que importan
—cuál es y con qué puntaje— quedan registrados en **cuatro sitios**, para que se
puedan medir aunque el botón final todavía no tenga destino:

| Parámetro | Valor |
|---|---|
| `utm_content` | `calificado`, `descalificado` o `no_aplica` |
| `utm_term` | `score_<puntaje>`, por ejemplo `score_73` |

1. **En la URL del botón final**, cuando ese botón tiene destino.
2. **En la URL de la propia página**, con `history.replaceState`, al pintar el
   resultado. Solo se tocan `utm_content` y `utm_term`: `utm_source`,
   `utm_medium` y `utm_campaign` son los de la campaña que trajo la visita y
   sobreviven intactos.
3. **En atributos `data-` de la vista de resultado**: `data-desenlace`,
   `data-score` y `data-caso`.
4. **En un evento `cbs:resultado`** sobre `document`, con `desenlace`,
   `puntaje`, `caso`, `limitacion`, `califica`, `noAplica` y `email` en su
   `detail`. Es el enganche para GTM o el píxel de Meta sin tocar `app.js`:

```js
document.addEventListener('cbs:resultado', (e) => {
  gtag('event', 'auditoria_completada', e.detail);
});
```

Ejemplo real del botón cuando alguien no califica con 25 puntos:

```
https://kunfupay.com/?utm_source=CBS&utm_medium=social&utm_campaign=bio&utm_content=descalificado&utm_term=score_25
```

Los dos patrones quedan registrados en `growth-utms/registro-utms.csv`. Si el
destino ya trae esos parámetros, se sobrescriben.

**Ojo con `utm_source=CBS`:** la taxonomía exige minúsculas, porque GA4 trata
`CBS` y `cbs` como fuentes distintas. La URL viene así del encargo y no la he
cambiado, pero conviene pasarla a `cbs`.

## Cómo se responde

Al pulsar una opción se marca y, 180 ms después, pasa sola a la siguiente
pregunta: no hay botón de continuar en las preguntas de opción. Solo queda
"Atrás", que conserva lo ya elegido. El único paso con botón es el del correo,
donde no hay nada que pulsar.

La pausa de 180 ms desaparece con `prefers-reduced-motion`. Un segundo clic
durante esa pausa se ignora, así que un doble clic no salta dos preguntas.

## La tarjeta compartible

Al terminar, la auditoría genera una imagen de **1080 × 1920** —el formato de
story— con la puntuación, y ofrece compartirla o descargarla. Es la pieza que
lleva gente nueva al embudo: quien la ve quiere saber cuánto saca.

Vive en `tarjeta.js`, que dibuja sobre un canvas y expone
`CBSTarjeta.dibujar(res) → Promise<canvas>`. El contenido editable —franjas,
reto, CTA, dominio— está en `TARJETA`, dentro de `data.js`.

### Qué lleva la imagen

Una sola cifra manda. El puntaje va a 230 px con un anillo que lo refuerza, y
nada más compite con él: ni segundo número, ni barras, ni la matriz de casos.
Debajo, la franja, la limitación raíz y el reto; al pie, la llamada y el
dominio.

El **reto está escrito en primera persona** porque lo publica el usuario, no la
marca: "Mi negocio digital ya funciona como empresa. ¿El tuyo aguanta la
comparación?". Lo elige la franja de puntuación:

| Puntaje | Franja | El reto habla de |
|---|---|---|
| 75–100 | Fase de escalar | comparar con un negocio que ya funciona |
| 55–74 | Fase de ordenar | facturar sin sistema todavía |
| 35–54 | Fase de validar | tener negocio, no tener máquina |
| 0–34 | Fase de arrancar | saber ya qué te frena |

La tarjeta **no dice si califica o no**. Nadie comparte un suspenso, y el dato
que mueve al de enfrente es el número, no la puerta de Platinum.

### Decisiones técnicas

- **JPEG de calidad 0,92, no PNG.** El fondo es un degradado a pantalla
  completa: en PNG pesaba 2,2 MB y en JPEG ronda los 165 KB. Las redes lo
  recomprimen igual al subirlo.
- **El blob se genera al pintar el resultado, no al pulsar.** Safari exige que
  `navigator.share()` salga del gesto del usuario, y fabricar el archivo en
  medio rompe esa cadena.
- **`navigator.share` con `canShare({files})` cuando existe**, que abre el menú
  nativo del móvil. Donde no existe —casi todo el escritorio—, el botón de
  compartir no se pinta y descargar pasa a ser la acción principal.
- **El lockup va en negativo**: la teja en blanco y el torii en morado. La teja
  morada original desaparecería sobre el fondo. El wordmark "Kunfupay" se
  compone en Plus Jakarta Sans, no con los trazos vectorizados del lockup
  oficial, porque en canvas no hay forma de heredar el archivo.
- **Se esperan las fuentes antes de dibujar.** El canvas no espera a nadie: sin
  ese `await`, la imagen salía con la tipografía del sistema y sin avisar.
- **El dominio del pie sale de la página**, sin parámetros ni `index.html`, así
  que es correcto en cualquier despliegue. Se puede fijar en `TARJETA.url`.

## Qué muestra la pantalla de resultado

1. Anillo con el puntaje, chip de calificación y la limitación raíz.
2. **Resultados**: las cuatro variables que más pesaron, con barras animadas.
3. **Diagnóstico personalizado** y la **"X" en tu negocio**, la métrica exacta
   que está fallando.
4. **3 pasos de acción inmediatos**, y el cierre.

## Decisiones que conviene revisar

Las preguntas y los diagnósticos son del manual, literales. Estas son mías.

1. **Los pesos del puntaje y el umbral de calificación.** El manual define la
   lógica de diagnóstico, no una puntuación numérica. Están en las constantes
   del principio de `app.js`.
2. **Los casos por defecto de cada bloque**, para las combinaciones que el árbol
   condicional no cubre.
3. **El tramo 40.000 €–50.000 €** no existe en las opciones de facturación, que son
   literales del manual. Quien facture ahí elegirá una de las dos contiguas.
4. **La opción de e-commerce puntúa 55** en escalabilidad del modelo, entre el
   low ticket (45) y el high-ticket (75). El manual no la contempla.

## Probar el motor sin hacer clics

En la consola del navegador:

```js
CBS.simular([4, 3, 1, 2, 4])
```

El array son los índices de opción elegidos, en el orden de las cinco preguntas
de diagnóstico: comunidad, situación, modelo, facturación y dolor. Van de 0 a 4,
salvo el modelo, que llega a 5 porque tiene la opción de e-commerce. El paso del correo se rellena solo. Devuelve puntaje,
caso, escalón, limitación y si califica.

## Verificado

- Las 3.750 combinaciones posibles de respuesta, una por una: todas puntúan
  entre 0 y 100 y caen en un caso de la matriz. Los 10 casos son alcanzables.
- Las 625 combinaciones con e-commerce: ninguna califica.
- La regla de calificación, combinación a combinación, contra su definición:
  califican exactamente las 1.500 que facturan 1.000 €+ y tienen 5.000+
  seguidores sin ser e-commerce, el 40 % del total.
- Los 10 casos de la matriz enrutan exactamente como el manual.
- Paso de correo: valida el formato, bloquea el avance y conserva el valor al volver atrás.
- Recorrido completo con clics reales, ida y vuelta entre preguntas.
- Barras medidas en píxeles: animan de 0 al valor final, escalonadas.
- Sin scroll horizontal en móvil de 375 px ni en escritorio, y el chip del hero
  entero dentro de la pantalla: se parte en dos líneas en vez de cortarse.
- Auto-avance por las cinco preguntas sin tocar "Continuar" ni una vez, con
  "Atrás" conservando lo elegido.
- El logo devuelve a la portada sin salir de la página.
- En móvil, la acción principal del paso del correo queda por encima de "Atrás".
- Sin errores en consola.
- La tarjeta, en las cuatro franjas y en el caso de e-commerce: se genera, se
  ve en la vista previa y se descarga como JPEG válido de unos 165 KB.
- Las diez capas de texto de la tarjeta miden su contraste real contra el
  degradado del fondo: la más floja da 4,57:1, sobre un mínimo de 3:1.
- La tarjeta se dibuja con Plus Jakarta Sans, comprobado midiendo el ancho del
  texto contra el de una familia inexistente, no a ojo.
- Las dos ramas de UTM, `calificado` y `descalificado`, con el score correcto.
- El puntaje y el anillo se pintan aunque la pestaña esté en segundo plano.

## Pendiente

- No hay backend: ni el resultado ni el correo se guardan o se envían.
- Falta la URL de "Aplicar a Classroom Platinum" (`URL_CLASSROOM` en `data.js`).
  Hasta que exista, ese botón no lleva a ninguna parte. El desenlace sí queda
  registrado igualmente, por las otras tres vías de la sección de medición.
- Las cifras pasaron de dólares a euros solo en las etiquetas y en los textos:
  los tramos son los mismos números del manual, no una conversión de divisa.
- El copy de los diagnósticos viene del manual, sin pasar por `ops-revisor`.
- El caso 1.3 habla de "un negocio sano de infoproductos", que suena raro
  cuando lo lee un e-commerce. Es copy literal del manual y cambiarlo afectaría
  también a quien vende low ticket, así que queda como está.
