# Creator Business Score · landing + auditoría funcional

Landing de captación de Classroom Platinum con la auditoría funcionando de
verdad: 5 preguntas de diagnóstico más un paso de captación de correo. Puntúa,
identifica la limitación raíz según la Teoría de las Limitaciones y devuelve un
diagnóstico hiperpersonalizado.

Implementa el Manual Maestro de Arquitectura, Algoritmo y Diagnósticos: la
jerarquía de 7 limitaciones, el cuestionario de 5 preguntas y los 10 casos de
la matriz maestra.

Sin build, sin dependencias, sin backend.

**La página es solo clara, a propósito.** `tokens-morfeo.css` trae un juego de
tokens para `[data-theme="dark"]`/`.dark`, pero nada en este proyecto pone
nunca ese atributo o esa clase: es letra muerta, no un modo oscuro real. Sin
`color-scheme: light` en `styles.css`, algunos navegadores (el oscuro forzado
de Chrome en Android, por ejemplo) intentaban adivinar un tema oscuro por su
cuenta e invertían el título del hero a blanco, sobre una foto que sigue
siendo clara — cero contraste. `color-scheme: light` les dice que no hace
falta adivinar nada, y el título del hero además fija su color a
`--neutral-900` en vez de a `--text` (que sí cambiaría si algún día se activa
el tema oscuro), para que ese titular en concreto sea negro siempre, claro u
oscuro, pase lo que pase con el resto.

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
| `assets/medalla-3d.webp` | Render 3D de la medalla en cromo neutro, 1200 px, 192 KB. La tarjeta lo tiñe por metal |
| `assets/medalla-3d.png` | El mismo render en PNG de 8 bits, 1000 px, 153 KB. Solo lo ve un navegador sin WebP |
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

## La medalla · la pantalla de resultado

Al terminar, la auditoría genera una imagen de **1080 × 1920** —el formato de
story— y **esa imagen es la pantalla**. No es una miniatura debajo del
resultado: ocupa la columna principal, con los botones de compartir y descargar
justo bajo ella. El diagnóstico, las barras y los pasos vienen después.

Vive en `tarjeta.js`, que dibuja sobre un canvas y expone
`CBSTarjeta.dibujar(res) → Promise<canvas>`. El contenido editable —franjas,
medalla, titular, reto, llamada, dominio— está en `TARJETA`, dentro de
`data.js`.

**Si el canvas falla, el anillo ocupa su sitio.** El puntaje no puede depender
de que el navegador sepa dibujar: `#ringFallback` está oculto y solo aparece si
la imagen no se pudo generar. Verificado rompiendo `getContext` a propósito.

Mientras se genera, un esqueleto con la proporción `1080 / 1920` ya reservada
evita que la página pegue un salto de 600 px cuando la imagen aterriza.

### La escalera de metales, y por qué se detiene en el oro

| Puntaje | Metal | Titular (lo publica el usuario) | Reto |
|---|---|---|---|
| 75–100 | **Oro** | Mi negocio no depende de mi estado de ánimo | ¿Cuánto aguanta el tuyo sin ti? |
| 55–74 | **Plata** | Mi desorden factura bien. Mi sistema no existe | ¿Tu número le gana al mío? |
| 35–54 | **Bronce** | Hago mucho y todavía no sé qué funciona | ¿Vendes por sistema o por suerte? |
| 0–34 | **Acero** | Prefiero un número incómodo que otro año a ciegas | ¿Te atreverías a publicar el tuyo? |

**El test entrega como máximo ORO. El PLATINO es lo que vende Classroom
Platinum.** Si el test regalara la cima, el programa se quedaría sin peldaño
que ofrecer. Por eso la tarjeta y el programa comparten la misma escalera en
vez de competir con dos.

Cada metal tiñe **el arco del anillo y la cinta**, y nada más: la cifra y el
resto del texto siguen en blanco. Es lo que hace que las cuatro se distingan de
un vistazo cuando circulan juntas en un feed. Para volver al blanco de antes
basta con quitar los `color` de `TARJETA.franjas`.

La franja baja se llama **Acero**, no Hierro ni Principiante. El estatus de esa
tarjeta sale del coraje de publicar un número incómodo, no de un logro: es la
única forma de que la mitad inferior del embudo comparta en vez de esconderse,
y sin esa mitad no hay bucle viral.

### Lo que hay detrás de cada metal

Los titulares afirman cosas en boca del usuario, así que ninguno puede decir
algo que el motor no respalde. Recorriendo las 3.750 combinaciones:

| Metal | Facturación mínima que cae ahí | Ritmos posibles |
|---|---|---|
| Oro | 15.000 € – 40.000 € | nunca "atrapado" ni "inestable" |
| Plata | 5.000 € – 15.000 € | todos |
| Bronce | menos de 1.000 € | todos |
| Acero | menos de 1.000 € | todos |

De ahí salen dos decisiones:

- **"Mi desorden factura bien" se sostiene** en Plata: por debajo de 5.000 € al
  mes nadie llega a esa franja.
- **En Bronce cabe quien factura menos de 1.000 €**, así que su titular no
  puede afirmar ventas. El primer candidato, "Vendo todos los meses y todavía
  no sé por qué", habría hecho mentir a esa parte de la franja delante de su
  propia audiencia. Por eso dice "Hago mucho y todavía no sé qué funciona".

### El render 3D

El encargo fue "una imagen súper cool, como una medalla, animada en 3D tipo la
nave espacial [de la referencia], un nivel, con cosas cool". La referencia era
un vídeo de motion 3D: objetos cromados fotorealistas flotando sobre un fondo
con rejilla sutil, sombra de contacto suave, tipografía grande.

La moneda es un **render fotorealista generado con IA** (Seedream 5 Pro, vía
Magnific), pedido así: vista frontal perfecta, cromo espejo, aro biselado con
estrías, corona de laurel grabada en el borde interior y **la cara central
completamente vacía**, sin texto ni emblema, para superponer el número. Fondo
gris plano para que el recorte fuera limpio; después, `images_remove_background`.
Se generaron dos variantes y se eligió la frontal: la otra, en ángulo, dejaba la
cara elíptica y el número habría parecido pegado. Ese ángulo dinámico lo aporta
la inclinación 3D en la página, no la imagen.

**Un solo archivo, cuatro metales.** El render es cromo neutro y la tarjeta lo
tiñe en canvas con el color de cada franja, en modo de fusión `color`: conserva
la luminancia del cromo (brillos, sombras, relieve del laurel) y le pone el tono
del metal. Se probó también `multiply` y apaga el metal: el oro se vuelve latón
sucio y el bronce, marrón. Están las ocho pruebas en la sesión; `color` gana sin
discusión. El acero se oscureció un punto respecto al plata (`#b4bdd2`) para que
los dos grises se distingan de un vistazo.

**El asset se autocalibra.** `medirMedalla()` lee el canal alfa del render una
vez y encuentra la caja de la moneda. No hay coordenadas a mano: si se cambia el
render por otro, la tarjeta lo centra igual. La caja mide 1196 × 1224 en el
archivo original de 2048; la moneda se dibuja a 540 px de ancho en la tarjeta.

**Peso.** El recorte original pesaba 4,9 MB. Se sirve en WebP de 1200 px (192
KB) con un PNG de 8 bits como respaldo (153 KB). El JPEG final de la tarjeta
pasa de ~170 a ~260 KB: es el detalle del metal, y sigue siendo ligero para una
story. El HTML de un solo archivo embebe el WebP y sube a 1,93 MB.

**Si el render no carga, la tarjeta cae al anillo plano de antes.** Verificado
bloqueando las dos rutas del asset: la imagen se genera igual, con su número.

### El número grabado

Va en morado oscuro (`#2b1170`), no en blanco: el blanco desaparecería en los
brillos del cromo. Se lee como un grabado por tres capas: sombra desplazada
abajo-derecha, luz desplazada arriba-izquierda, y un **bisel claro**, un trazo
fino blanco bajo la tinta.

El bisel no es decoración. Al medir el contraste de la tinta contra la cara
desnuda bajo los dígitos, el peor píxel daba 1,7:1: son los surcos grabados del
laurel, que un número ancho como "100" llega a pisar. Un dígito que cruza una
línea de 3 px no se vuelve ilegible, pero en vez de defenderlo con una métrica
se le puso el bisel: el borde real de cada cifra es tinta contra blanco, **9,9:1
en los cuatro metales**, pise lo que pise. La cara en sí queda en 9:1 de media
y por encima de 5:1 en el percentil 5, que es la medida honesta para un fondo
con textura. Además, un pulido suave (luz radial al 17 %) sube la cara justo
bajo el número.

### La pista de niveles

Bajo la moneda, cinco nodos: **ACERO → BRONCE → PLATA → ORO → PLATINO**. El
tramo recorrido y el nodo actual llevan el color del metal; los que faltan van
en contorno; el Platino va cerrado con un candado, más claro que los nodos sin
ganar, y el tramo que lleva a él es **discontinuo**: es otra puerta, no un
peldaño pendiente del test. Los rótulos van a 27–30 px para leerse en un
teléfono (a 21 px eran manchas grises). Es lo que dice "esto es un
nivel, y hay uno más": el test entrega como máximo oro, y el platino es lo que
vende Classroom Platinum. La pista hace visible ese peldaño sin prometerlo.

### Lo que cambió el panel de crítica

Cuatro jueces (wow frente a la referencia, legibilidad a tamaño de story,
marca y honestidad) miraron los cinco renders, la página y la referencia, y
tres escépticos por hallazgo intentaron refutar cada uno. 52 escépticos cayeron
por un límite de uso; los hallazgos sin verificar se triaron con su evidencia
numérica. Lo que se aplicó:

- **Zona segura de Instagram** (verificado). El logo quedaba bajo la barra de
  progreso y la pastilla y la llamada bajo la barra de respuesta: en la story
  no sobrevivía ni una mención a la marca. Ahora todo lo que importa termina en
  y = 1668. El chip del pie lleva la marca y la llamada en dos líneas.
- **Plata y acero eran la misma moneda** (verificado con muestreo de píxel: 2 a
  11 puntos de diferencia solo en el canal azul). Causa: el tinte `color`
  conserva la luminancia, así que un gris más oscuro no oscurece nada. El acero
  lleva ahora una pasada de `multiply` al 20 % (`sombra` en su franja), el
  valor más alto que deja la cara por encima de 3,5:1 en el percentil 5.
- **Composición plana** (verificado). Falta el solape que da profundidad en la
  referencia: ahora la palabra del metal va gigante y al 11 % detrás de la
  moneda, que la tapa, como el "Ads" tras el cohete.
- **La cinta**: plana junto a un objeto fotorreal (verificado) y la tercera vez
  que se decía el nivel en 250 px. Se quitó. La palabra fantasma y el rótulo
  activo de la pista ya lo nombran, y el espacio se lo lleva la zona segura.
- **Pastilla blanca que parecía un botón** y competía con la súper-CTA de la
  página: ahora es un chip fantasma, relleno al 11 % y borde al 32 %.
- **Bronce demasiado rosa**: el tinte baja hacia el cobre (`#dd9a62`).
- **Copy**: "Mi sistema no existe" pasa a "Mi sistema, todavía no" (a tres
  puntos del oro, un absoluto se desmiente solo); la tarjeta de acero nombra
  "Hábitos y sistema de trabajo" en vez de "Mindset y optimización personal"
  (al negocio, no a la persona; el manual no se toca: es un campo `desbloqueo`
  propio de la tarjeta); "conciencia" pasa a "visibilidad"; y el párrafo de la
  página deja de decir "ya funciona como empresa" a quien la tarjeta le dice
  que su sistema todavía no está, y nombra el programa de una sola forma.
- **Rejilla más visible** (verificado que no se veía) y **motas de doce a
  cinco**, cerca de la moneda y nunca sobre la interfaz.

Se refutaron cuatro: que el número parezca una pegatina, que la sombra no
ancle, que las motas ensucien la sombra y que el bronce sea oro rosa en su
conjunto.

### El fondo de estudio

Rejilla fina de trazo discontinuo, como la de la referencia, que se desvanece
hacia los bordes para no parecer papel cuadriculado. Un halo detrás de la
moneda **del color de su metal**: el oro alumbra dorado, el acero, frío. Cinco
motas de luz en posiciones fijas (la misma puntuación da siempre la misma
imagen). Y la sombra de contacto: una elipse difusa 58 px bajo la moneda, algo
desplazada a la derecha, que es lo que la hace flotar en vez de estar pegada.

### Por qué se lee como una medalla

1. **Una sola cifra manda.** El puntaje a 196 px grabado en la cara de la
   moneda. Ni segundo número, ni barras, ni la matriz de casos.
2. **El metal, en la moneda y en la palabra fantasma.** La cinta con el nombre
   del metal se quitó tras el panel de crítica: era plana junto a un objeto
   fotorreal y redundante con la pista.
3. **El titular, en primera persona.** Lo publica el usuario, no la marca.
4. **"Mi próximo desbloqueo" + la limitación raíz.** La debilidad enmarcada
   como el siguiente nivel de un juego, que es lo que se puede enseñar sin
   quedar mal.
5. **El reto**, que interpela a quien la ve.
6. **El pie, un chip fantasma de dos líneas**: `TARJETA.marcaPie` arriba y la
   llamada debajo. Ni dominio (delataba el entorno) ni pastilla blanca (parecía
   un botón).

La tarjeta **no dice si califica o no**. Nadie comparte un suspenso, y el dato
que mueve al de enfrente es el número, no la puerta de Platinum.

El bloque inferior —titular, desbloqueo y reto— **se mide y se centra** en la
banda que queda entre la cinta y el pie. Con coordenadas fijas, un titular de
dos líneas se comía el pie y uno corto dejaba un agujero de 250 px.

### Animada en 3D, en la página

La imagen compartida es estática (las stories son imágenes), pero en la vista
de resultado la medalla **se mueve al interactuar**:

- **Se inclina en 3D dentro de su marco**, no el marco. La imagen va un 6 % más
  grande que el marco y `overflow: hidden` la recorta: así en móvil, donde la
  medalla va de borde a borde, nunca asoma el fondo por los lados al inclinarse.
  Con puntero (escritorio) sigue al cursor hasta ±8°; en móvil, al giroscopio.
  En iOS el giroscopio solo se concede desde un gesto: el primer toque en el
  resultado lo pide, y si se niega, no pasa nada. Las variables `--rx/--ry/
  --px/--py` van registradas con `@property` para que el navegador las
  interpole con una transición suave, no de golpe.
- **Sin puntero ni sensor, se queda quieta.** Llevaba un vaivén automático
  (`medalla--idle`) y, en escritorio, una levitación de la tarjeta entera; los
  dos se quitaron por encargo — "el balanceo" resultaba molesto. Lo que queda
  es puramente reactivo: no se mueve nada hasta que alguien la toca o la
  inclina.
- **Un destello cruza la moneda** cada 6,5 s, como el reflejo que recorre un
  objeto cromado al girarlo. Este sí se queda: no es balanceo, es brillo.
- Con `prefers-reduced-motion` no se mueve nada: ni inclinación, ni destello.

Verificado en el navegador: quieta sin tocarla (el `transform` no cambia solo
pasado 1,5 s), sigue al puntero con una `matrix3d`, y al soltarlo vuelve a
quedarse quieta y se queda ahí — no reanuda ningún vaivén. En móvil la imagen
inclinada sigue cubriendo el marco por los cuatro lados. El giroscopio no se
puede probar sin sensores: queda para el móvil real.

### El puntaje que se ve no es el puntaje real

Por encargo explícito: el número del anillo, el que anima el contador, y el
que queda grabado en la moneda de la tarjeta compartible son un **puntaje
mostrado**, distinto del real. La petición, textual: que muchos negocios que
facturan poco no se desilusionen con un número bajo, y que el que sí sale bien
lo quiera presumir.

`puntajeVisible()`, en `app.js`, le suma relleno al puntaje real — más cuanto
más bajo es, cada vez menos conforme se acerca a 100, así ningún tramo alto
queda pegado en un bloque idéntico de "100":

```js
puntajeVisible(interno) = round(interno + (100 - interno) * 0.67)
```

Con esa fracción, un 55 real muestra un 85 (el ejemplo exacto del encargo); un
21 real, un 74; un 90 real, un 97. Verificado sobre las 3.750 combinaciones:
monótono (a más real, nunca menos mostrado), y ningún resultado fuera de
0–100.

**A nivel interno no cambia absolutamente nada**, como se pidió:

- La calificación para Classroom Platinum ya dependía solo de facturación y
  comunidad, nunca del puntaje — sigue igual.
- El caso de diagnóstico (`resolverCaso`) tampoco depende del puntaje.
- `registrarDesenlace()` — la UTM, el `data-score` de la vista y el evento
  `cbs:resultado` — recibe siempre el `res` **sin tocar**: lo que viaja a
  medición es siempre el real, nunca el mostrado. Verificado en el navegador:
  con un real de 63 mostrando un 88, la UTM lleva `score_63`, el
  `data-score` es `63` y el evento trae `puntaje: 63`.

Lo único que recibe el mostrado es la copia de `res` que se le pasa a
`prepararTarjeta()`/`CBSTarjeta.dibujar()`: así el metal de la medalla (Oro,
Plata…) y el número grabado en ella coinciden siempre con el número del
anillo — nadie ve "88" en la pantalla y una medalla de un nivel distinto.

### Decisiones técnicas

- **JPEG de calidad 0,92, no PNG.** El fondo es un degradado a pantalla
  completa: en PNG pesaba 2,2 MB y en JPEG ronda los 260 KB con el render 3D.
  Las redes lo recomprimen igual al subirlo.
- **El blob se genera al pintar el resultado, no al pulsar.** Safari exige que
  `navigator.share()` salga del gesto del usuario, y fabricar el archivo en
  medio rompe esa cadena.
- **`navigator.share` con `canShare({files})` cuando existe**, que abre el menú
  nativo del móvil. Donde no existe —casi todo el escritorio—, el botón de
  compartir no se pinta y descargar pasa a ser la acción principal.
- **Los botones de la medalla son morados, no naranjas.** La súper-CTA es única
  por pieza y en esta pantalla le toca al botón de conversión del final.
- **El lockup va en negativo**: la teja en blanco y el torii en morado. La teja
  morada original desaparecería sobre el fondo. El wordmark "Kunfupay" se
  compone en Plus Jakarta Sans, no con los trazos vectorizados del lockup
  oficial, porque en canvas no hay forma de heredar el archivo.
- **Se esperan las fuentes antes de dibujar**, pidiendo la familia sola. El
  canvas no espera a nadie: sin ese `await`, la imagen salía con la tipografía
  del sistema y sin avisar.
- **El texto del pie es fijo**, no el dominio de la página. `urlVisible()` sigue
  sabiendo derivarlo (queda como red de seguridad si se borra `TARJETA.url`),
  pero por defecto se usa un texto de marca que no cambia entre entornos.

## En móvil, la medalla es la pantalla entera

Antes, en móvil, la medalla vivía dentro de la tarjeta blanca de
`.result__score` —bordes, sombra y padding propios— y la propia medalla tenía
otra vez bordes y sombra: una burbuja dentro de otra burbuja para una sola
pieza, con la imagen reducida a 330 px de ancho.

Ahora, por debajo de 860 px, `.medalla` sale a todo el ancho del viewport y
`.result__score` pierde su chrome de tarjeta (fondo, borde, sombra, radio). El
ancho completo se consigue con el truco clásico de *full-bleed*:

```css
.medalla { width: 100vw; margin: 0 calc(50% - 50vw); }
```

Esa fórmula no depende de cuánto valga el padding de `.result` —hoy un
`clamp()`—, así que sigue funcionando si ese valor cambia. En escritorio nada
de esto se activa: ahí la medalla sigue siendo una columna de 380 px como
antes, dentro de su tarjeta.

**Sangra por arriba, pero abajo cierra.** Arranca pegada al borde superior
(`padding-top: 0` en `.result`), y termina con las dos esquinas de abajo
redondeadas y una sombra morada que la despega del blanco:

```css
border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
box-shadow: 0 20px 38px -14px rgba(115, 75, 252, .48),
            0 8px 16px -8px rgba(13, 16, 24, .16);
```

Sin eso, la imagen terminaba en una línea plana contra el blanco, que se leía
como un fallo de render y no como un borde. El `padding-top: 0` va atado a
`vista-resultado`: si el canvas falla y sale el anillo, la cabecera vuelve y el
contenido recupera su respiro superior.

### En móvil, el recorte es el mínimo que deja ver los botones

Antes, `.medalla` fijaba su alto con `aspect-ratio: 1080/1920`: la imagen
entera —proporcionalmente 1920 px de alto— ocupaba ella sola toda la pantalla
en un teléfono bajo, y había que hacer scroll para llegar a "Descargar mi
medalla". La regla, por encargo: recortar **lo mínimo posible**, solo lo que
haga falta para que los botones entren sin scroll, y nunca más que eso.

El alto ya no depende del ancho, depende de lo que sobra bajo los botones:

```css
height: calc(100vh - 150px);
height: min(calc(100dvh - 150px), 177.78vw);
```

150 px es lo que miden los botones con su margen en el caso más ancho —
compartir y descargar juntos, medido en el navegador: 30 px de margen + 116 px
de los dos botones. `100dvh` (con `100vh` de respaldo) es el alto real de la
pantalla del navegador, sin el salto que da `100vh` en Safari al aparecer o
esconderse la barra de direcciones. Y el `min()` con `177.78vw` —el alto
natural de la imagen a ese ancho— evita pasarse en un teléfono alto: ahí nunca
se recorta nada, la imagen se ve entera.

Medido en tres teléfonos: en el más bajo (iPhone SE, 667 px) se recorta al
78 % y los botones caben justo; en uno normal (844 px) y en uno alto (926 px)
la imagen se ve al 100 %, sin recortar nada. En los tres, el ancho sigue a
pantalla completa, sin huecos laterales.

El corte no es seco: `.medalla` lleva una máscara que difumina solo el último
tramo del recorte —el 16 % final— hacia transparente, así se ve el blanco de
la página detrás en vez de un borde duro. Cae justo donde el contenido deja de
ser el titular y empieza "MI PRÓXIMO DESBLOQUEO", que es lo que se repite (con
más detalle) en el panel de diagnóstico de más abajo — no se pierde
información, solo la repetición.

**El recorte y el difuminado son puramente visuales.** Van en `.medalla`, el
contenedor; el `<img>` de dentro, y el blob que se descarga o se comparte,
siguen siendo el archivo de 1080 × 1920 completo, sin tocar. Verificado
leyendo las dimensiones reales del JPEG descargado desde la vista más
recortada (el iPhone SE al 78 %): 1080×1920, igual que siempre.

### La cabecera desaparece en móvil, solo en el resultado

La medalla ya lleva el logo de Classroom dentro de la propia imagen (ver
`lockup()` en `tarjeta.js`). Repetirlo en la cabecera de la página era ruido,
así que en móvil se oculta mientras se ve el resultado.

**En móvil, el resultado no tiene vuelta al inicio.** La cabecera era la única,
y se retiró también el enlace de texto que la sustituía, por encargo: la
pantalla se queda solo con la medalla. Si alguna vez hace falta recuperarla, el
sitio natural es el pie de página, que ya está ahí y no compite con la imagen.

**La cabecera solo se oculta cuando la medalla existe de verdad.** Si el canvas
falla y se cae al anillo (`caerAlAnillo()`), la clase `vista-resultado` que
activa la regla se retira: sin medalla, la cabecera es el único logo que queda
en pantalla, así que se queda visible. `mostrarVista()` la limpia siempre al
salir del resultado, y solo `prepararTarjeta()` la vuelve a poner, una vez la
imagen se generó con éxito.

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
- La medalla, en los cuatro metales y en el caso de e-commerce: se genera, se
  ve a tamaño completo y se descarga como JPEG válido de unos 260 KB.
- Con las dos rutas del render 3D bloqueadas, la tarjeta cae al anillo plano y
  el número se sigue viendo.
- El número grabado, contra la cara desnuda bajo los dígitos (medida con un
  puntaje que conserva su valor pero se imprime vacío): 9:1 de media, más de
  5:1 en el percentil 5, y 9,9:1 en el borde tinta/bisel en los cuatro metales.
- La animación 3D: puntero, respiración, destello, levitación en escritorio,
  cobertura del marco en móvil y movimiento reducido.
- Las once capas de texto de la medalla miden su contraste real contra el
  degradado del fondo: la más floja da 4,61:1, sobre un mínimo de 3:1. Los
  cuatro metales miden además el suyo contra el relleno de su propia cinta, y
  el más justo, el bronce, da 4,17:1.
- Lo que afirma cada titular, contrastado contra las 3.750 combinaciones: ver
  la tabla de arriba. Así se descartó el titular de Bronce que hablaba de
  vender todos los meses.
- La medalla se dibuja con Plus Jakarta Sans, comprobado midiendo el ancho del
  texto contra el de una familia inexistente, no a ojo.
- Con `getContext` roto a propósito, el anillo ocupa el sitio de la medalla, el
  puntaje se sigue viendo, los botones de compartir desaparecen, y en móvil la
  cabecera se queda visible en vez de ocultarse.
- En móvil: la medalla arranca en `y = 0`, toca los dos bordes laterales,
  cierra abajo con 24 px de radio y sombra, y no hay scroll horizontal. En el
  caso del anillo de respaldo, `.result` recupera sus 24 px de padding
  superior. En escritorio la cabecera nunca se oculta, la medalla se queda en
  su columna de 380 px y mantiene el radio en las cuatro esquinas.
- Las dos ramas de UTM, `calificado` y `descalificado`, con el score correcto.
- El puntaje y el anillo se pintan aunque la pestaña esté en segundo plano.

## Lo que conviene mirar antes de publicar

La copy salió de un panel de cinco redactores y quince jueces, y dos de sus
avisos ya están resueltos arriba con datos del motor. Quedan estos, que
necesitan ojo humano:

1. **Enseña las cuatro medallas juntas a cinco personas** y pregunta cuál es la
   más baja. Acero contra Bronce no se ordena con la misma evidencia que oro,
   plata y bronce entre sí; la cifra gigante ordena, pero conviene confirmarlo.
2. **"¿Te atreverías a publicar el tuyo?"** es a la vez lo mejor y lo más
   arriesgado del lote: entre iguales funciona, en otros nichos puede sonar a
   pique adolescente. Pásalo por dos o tres creadores del perfil objetivo.
3. **Sostén la escalera en todo el embudo.** Si en un correo o en una llamada
   se dice que el test da "platino", se rompe el argumento comercial.
4. **Mide la tasa de compartido por franja** las dos primeras semanas. Si Acero
   no comparte, el problema no es la frase: es pedirle la story a quien acaba
   de empezar.

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
