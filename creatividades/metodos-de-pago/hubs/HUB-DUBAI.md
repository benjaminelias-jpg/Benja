# HUBS · Métodos de pago · Dubái

**Fecha:** 28 de octubre de 2026 · **Campaña:** HUBS · **Conjunto:** Dubái

### Análisis

**Perfil**
- **Quién es.** Una persona hispanohablante que ya vende conocimiento online: cursos, mentorías, coaching, comunidades o membresías. Vive en Dubái, vende a España y Latinoamérica y cobra en EUR o USD. El perfil sale del brief. No hay ninguna fuente pública sobre cuántas personas son ni cuánto facturan.
- **Españoles inscritos en EAU.** Eran 9.540 el 1-1-2026, frente a 5.959 en 2020 (un 60 % más). El 52 % tiene entre 25 y 49 años y el 27 % tiene menos de 15. Son adultos en plena etapa laboral, muchos con hijos pequeños. Fuentes: INE, PERE, https://www.ine.es/jaxiT3/Tabla.htm?t=71116&L=0 y https://www.ine.es/jaxiT3/Tabla.htm?t=71119&L=0
- **Cuántos viven en Dubái.** El 72,45 % de los españoles registrados en EAU vive en Dubái: 5.511 de 7.606 en enero de 2024. Fuente: ficha país de Exteriores, https://www.exteriores.gob.es/Documents/FichasPais/EMIRATOSARABESUNIDOS_FICHA%20PAIS.pdf. Si se mantiene ese porcentaje, hoy serían unos 6.900. Es una estimación propia.
- **Latinoamericanos.** No hay cifras fiables.
- **Contexto.** Dubái tiene unos 4 millones de habitantes y el 92 % son expatriados (https://en.wikipedia.org/wiki/Dubai).
- **Horario.** Dubái está en UTC+4 y no cambia de hora. Madrid va 3 horas por detrás (2 desde el 28-03-2027). Bogotá y Lima van 9 horas por detrás y Ciudad de México, 10. Fuente: https://en.wikipedia.org/wiki/Time_in_the_United_Arab_Emirates. En la práctica, al cliente de España lo atiende de día y al de Latinoamérica, de noche.

**Situaciones reales de cobro**

La fuerza es media: salen de la documentación oficial, pero nadie las ha visto en un panel real de Stripe de EAU.

- **S1 · El cliente de México quiere pagar en OXXO, o el de Brasil con Pix.** Ninguno de los dos figura para cuentas de Stripe de EAU. Fuentes: https://docs.stripe.com/payments/oxxo y https://docs.stripe.com/payments/pix
- **S2 · La alumna de Madrid quiere pagar con Bizum.** EAU no está entre los países cuyas cuentas lo aceptan. Bizum tiene 31,5 millones de usuarios. Fuentes: https://docs.stripe.com/payments/bizum y https://bizum.com/es/en/
- **S3 · El cliente tiene tarjeta, pero se la rechazan por ser «de otro país».** Las tarjetas emitidas en otro país tienen más rechazos, y el cliente tiene que llamar a su banco. No hay tasa publicada. Fuente: https://docs.stripe.com/declines/card
- **S4 · El cliente quiere pagar por transferencia en su moneda.** La transferencia en EUR o USD solo está disponible para cuentas de Europa y EE. UU., y en MXN solo para cuentas de México. Fuente: https://docs.stripe.com/payments/bank-transfers
- **S5 · El cliente quiere pagar con PayPal.** PayPal procesado por Stripe solo está disponible para negocios de Europa. Fuera de Europa hace falta una cuenta de PayPal aparte. PayPal EAU cobra un 4,40 % más un fijo por pago internacional y un 3,0 % por conversión. Fuentes: https://docs.stripe.com/payments/paypal y https://www.paypal.com/ae/webapps/mpp/merchant-fees
- **Solo investigación (no entra en anuncios):**
  - S6: cobros entrantes bloqueados en bancos locales, según reseñas de Wio.
  - S7: recargos de Stripe EAU. La tarifa es «2.9% + AED1.00», más un 1 % por tarjeta internacional y otro 1 % por conversión (https://stripe.com/en-ae/pricing).
  - S8: sin licencia no se puede abrir Stripe en EAU (https://support.stripe.com/questions/verification-of-businesses-in-the-uae).

**Citas literales**

No hay ninguna cita de un creador hispanohablante con residencia en Dubái. Las de Trustpilot salen de un resumen automático y no se han cotejado palabra por palabra. Las de Wio solo sirven para investigación.

1. «If your customers use cards issued in a different country than where you registered your Stripe account, they might see an increased rate of declines.»
   - Quién: Stripe, documentación oficial.
   - Fuente: https://docs.stripe.com/declines/card
2. «incoming payments were blocked despite all required documents and proofs being submitted.»
   - Quién: cliente empresa de Wio, país AE. Fecha: 01-08-2025.
   - Fuente: https://www.trustpilot.com/review/wio.io?page=3
3. «Customer payments are debited, but not reaching our Wio account.»
   - Quién: negocio, país AE. Fecha: 04-08-2025.
   - Fuente: https://www.trustpilot.com/review/wio.io?page=3
4. «Rejects small incoming transfers and you have to chase for days»
   - Quién: reseñador, país AE. Fecha: 06-03-2026.
   - Fuente: https://www.trustpilot.com/review/wio.io?page=2
5. «actually the multiple currency is not available at the moment and you've been refused to do recurring payment.»
   - Quién: cliente de Telr, una pasarela del Golfo, con país SA. Fecha: 19-11-2025.
   - Fuente: https://www.trustpilot.com/review/telr.com

**Qué usa hoy**

| Herramienta | Qué ya le resuelve | Qué no le resuelve | Fuente |
|---|---|---|---|
| Stripe con cuenta de EAU | Tarjetas, Apple Pay, Google Pay y enlaces de pago | OXXO, Pix, Bizum, transferencia y PayPal procesado por Stripe. Además, las tarjetas extranjeras tienen más rechazos | https://docs.stripe.com/payments/payment-method-support |
| Stripe de otro país | Según el país, Bizum u OXXO | No se sabe cuántos vendedores lo usan | https://docs.stripe.com/payments/bizum |
| PayPal EAU | El cliente que tiene PayPal. Recibe en USD o EUR | OXXO, Bizum, Nequi y SPEI. Cobra un 3,0 % al convertir | https://www.paypal.com/ae/webapps/mpp/merchant-fees |
| Hotmart | «+40 métodos de pago», «Medios de Pago Locales» y 22 monedas | Lo que vende fuera de Hotmart: mentoría por llamada, WhatsApp o DM | https://hotmart.com/es/pagos |
| Kajabi | Tarjetas, Apple Pay, Google Pay, Afterpay y Klarna | Métodos de LATAM y Bizum | https://kajabi.com/features/payments |
| Ziina, Mamo y Wio | Enlaces de pago con tarjeta, Apple Pay y Google Pay | Ningún método de España ni de LATAM | https://ziina.com/fees, https://www.mamopay.com/ y https://www.wio.io/business |
| Rebill, EBANX y dLocal | PIX, PSE, Nequi, SPEI y OXXO | Piden integración técnica o son de nivel empresa | https://www.rebill.com/es, https://www.ebanx.com/en/ y https://www.dlocal.com/ |

- **No hay que vender como nuevo:**
  - las tarjetas internacionales;
  - cobrar en USD o EUR;
  - los enlaces de pago;
  - Apple Pay y Google Pay;
  - Klarna;
  - los métodos locales a quien vende dentro de Hotmart.
- **Lo que Kunfupay sí añade:** un solo enlace propio en el que el cliente elige cómo pagar. Puede ser con tarjeta, por transferencia desde su banco en su moneda, con métodos locales (OXXO, SPEI, Mercado Pago, Nequi, PayPal o Bizum) o con cripto. Al vendedor le llega en euros o en dólares.
  - En la pestaña América salen OXXO, SPEI, Mercado Pago, Nequi, Yape, Pix, PayPal y Webpay (https://kunfupay.com/producto/checkout).
  - En la pestaña Europa salen Bizum y SEPA (https://kunfupay.com/).
  - La web da números distintos de métodos según la página, así que en los anuncios no se usa ninguna cifra de métodos.
- **Competencia.** Ninguno de los 20 competidores revisados se dirige al hispanohablante que vive en Dubái y vende a España y LATAM. La fuerza es media. Huecos que deja:
  - Bizum para quien vende desde Dubái;
  - OXXO, SPEI, Nequi y Mercado Pago sin integrar código;
  - la transferencia en la moneda del cliente;
  - PayPal dentro del mismo enlace.

**Objeciones y respuesta verdadera**

1. **«Ya cobro con Stripe y me va bien.»** Para la tarjeta, sí. Pero una cuenta de EAU no figura habilitada para OXXO, Pix, Bizum, transferencia ni PayPal procesado por Stripe. No tiene que dejar Stripe: Kunfupay «Convive con el resto de tu stack» (https://kunfupay.com/producto/api).
2. **«Vendo en Hotmart y ya tiene métodos locales.»** Es cierto dentro de Hotmart. Kunfupay le sirve para lo que vende fuera, con su propio enlace.
3. **«Mis clientes pagan con tarjeta.»** Muchos sí, pero las tarjetas de otro país tienen más rechazos. Además, en México y Brasil «customers prefer to pay with cash-based vouchers and bank transfers» (https://stripe.com/guides/payment-methods-guide).
4. **«Desde Dubái no me van a aceptar.»** La web dice «Abres tu cuenta y tu wallet estés donde estés» (https://kunfupay.com/sensei-prueba-gratis). Encaja con el CTA «Entra y mira si tu negocio encaja.»
5. **«Mis clientes no saben de cripto.»** La cripto es una opción, no un requisito (https://kunfupay.com/blog/retirar-ganancias-peru-chile-creadores-2026).
6. **«¿Cuánto me cuesta?»** No hay porcentaje publicado; la web habla de «precio a medida» (https://kunfupay.com/tarifas). No se comparan comisiones.
7. **«Ya tengo PayPal.»** PayPal entra como un método más dentro del mismo enlace.
8. **«Tengo Ziina o Wio con enlaces de pago.»** Esos enlaces solo cobran con tarjeta, Apple Pay o Google Pay. El hueco es el método local del cliente.

**Miedo y deseo**

Son interpretación, con fuerza débil-media: no salen de entrevistas a residentes.
- **Miedo:** que vivir lejos se note justo al cobrar.
- **Deseo:** vender desde Dubái como si estuviera en el país de cada cliente.

**Lenguaje del hub**

- **Lugares:**
  - JLT: 26 clusters de tres torres, tres lagos y metro DMCC (https://en.wikipedia.org/wiki/Jumeirah_Lake_Towers);
  - Dubai Marina y JBR (https://en.wikipedia.org/wiki/Dubai_Marina);
  - los cafés de Gate Avenue en DIFC, «over 100 cafes and restaurants» (https://en.wikipedia.org/wiki/Dubai_International_Financial_Centre);
  - Business Bay;
  - los coworkings de Letswork (https://www.letswork.io/).
- **Rutina:**
  - UTC+4 sin cambio de hora;
  - fin de semana de sábado a domingo desde 2022, con el viernes hasta mediodía;
  - objetos cotidianos: Emirates ID, Salik, la tarjeta Nol y Careem.
- **Palabras que usa el cliente para pagar:**
  - Bizum;
  - Nequi: «Cobra a más de 25millones de colombianos» (https://www.nequi.com.co/);
  - Yape: «más de 19 millones de yaperos» (https://www.yape.com.pe/);
  - PSE, OXXO, Pix, SPEI, Mercado Pago y «transferencia».
- **Qué evitar:**
  - Burj Khalifa, el desierto, superdeportivos y oro;
  - «sin impuestos» y la Golden Visa;
  - «si eres español o latino»;
  - el viernes como día libre;
  - que quien graba diga que vive en Dubái;
  - cifras de métodos como gancho;
  - «Kunfupay cobra por ti» y «sin comisiones».
- **Jerga que no entra:** «free zone», «Ejari», «yalla» y «habibi». No consta que este perfil la use.

### Ángulo del hub

**En una frase:** desde Dubái vendes a España por la mañana y a Latinoamérica por la noche. Con la pasarela que abriste en Emiratos, esos clientes no encuentran su método. Con tu enlace de Kunfupay, cada uno paga con lo suyo y a ti te llega en euros o en dólares.

**Nombre interno:** «Desde Dubái, cada cliente paga con lo suyo».

**Por qué este ángulo:**
1. **A una cuenta de Emiratos le faltan métodos.** Bizum, OXXO, la transferencia en EUR, USD o MXN y PayPal procesado por Stripe no figuran para cuentas de Stripe de EAU (S1, S2, S4 y S5). Ziina, Mamo y Wio solo cobran con tarjeta, Apple Pay o Google Pay. Fuerza media.
2. **Hay más rechazos.** Las tarjetas emitidas en otro país tienen más rechazos (S3, https://docs.stripe.com/declines/card). Fuerza media y sin cifra.
3. **El día se parte en dos.** UTC+4 frente a Madrid, Bogotá y Ciudad de México. Es el detalle de insider que solo tiene este hub, y ninguno de los 37 anuncios leídos en EAU usa horas.
4. **Nadie le habla a este perfil.** Ninguno de los 20 competidores revisados se dirige a él, y ninguno de los 37 anuncios leídos nombra un método de pago de España o de Latinoamérica. Fuerza media.

**Qué no entra:**
- impuestos, licencia, free zone, Emirates ID, visado ni Golden Visa;
- el banco local;
- comisiones, «zero», «gratis», precios y plazos («en 1 día», «en minutos»);
- los dírhams y el tipo de cambio;
- la tarjeta y la cuenta de Kunfupay;
- IBAN, SEPA o Merchant of Record;
- «si eres español o latino»;
- skyline, bandera, dorado y fondo morado liso;
- el kit de postal;
- el viernes como día libre.

**Escenarios que sí se pueden usar:** ninguno de exterior ni con ventana a la ciudad. Solo relojes, frases del cliente en pantalla y pantallas reales.

### Lo que anuncia la competencia aquí

Fuente: Biblioteca de anuncios de Meta, país EAU, anuncios activos el 28-10-2026. Se leyeron 37 anuncios de 22 anunciantes.
- **Quién se anuncia.** En español, casi solo Dubai Connecting, que vende empresa, visa y cuenta en Dubái a quien todavía no vive allí. En inglés y en árabe se anuncian fintech y bancos locales (Ziina, Wio, Mashreq, Hubpay, Network, Nomod, Paymob y Tap). Todos venden al comercio de EAU cobrar con tarjeta, Apple Pay o Google Pay.
- **Lo que más tiempo lleva activo:**
  - Tab for Business, pagos para turismo en español, desde el 08-05-2026 (173 días): [1282765327371265](https://www.facebook.com/ads/library/?id=1282765327371265).
  - Dubai Connecting, «Expandí tu empresa a Dubái sin necesidad de viajar», desde el 25-05-2026 (156 días): [1312182170282539](https://www.facebook.com/ads/library/?id=1312182170282539).
  - Mashreq, «setup in 1 day or claim AED 1,000», con unos 30 anuncios iguales desde el 13-09-2026: [2223276005122093](https://www.facebook.com/ads/library/?id=2223276005122093).
  - Ziina tiene 74 anuncios, todos de octubre. Indica volumen, pero no un ganador probado.
- **Saturado:** montar empresa, licencia o LLC; «0% impuestos»; «zero», «gratis» o el precio en el titular; plazos («en 1 día», «en 24 h»); «vende al mundo» sin decir cómo; skyline, bandera y dorado; fondo morado o lila con un móvil o una tarjeta (Wio, Ziina, Tab, Hubpay); estrellas y testimonios; voseo y «escríbenos DUBÁI».
- **El hueco que ocupamos.** Nadie explica cómo te paga tu cliente de España o de Latinoamérica una vez que ya vives allí. En los 37 anuncios leídos, ninguno nombra Bizum, OXXO, Nequi o SPEI, ni una ciudad del cliente, ni una hora del día. Solo Xflowpay (India, en inglés, 3 h activo) enseña un móvil con su pantalla de pago. En español no lo hace nadie. Xflowpay es también el único que usa el marco del método local, con UPI: [2433705547440146](https://www.facebook.com/ads/library/?id=2433705547440146).
- **Qué cambiamos por ello:**
  - V1 pierde el plano de IA de JLT. Desde una torre se ven las demás, que es el fondo de las agencias y la ventana con ciudad de Summit Filings ([1131167559862831](https://www.facebook.com/ads/library/?id=1131167559862831)). Abre con el reloj en grande.
  - V2 da la vuelta a la promesa de Ziina, «Apple Pay, Google Pay, or card» ([1131286162884183](https://www.facebook.com/ads/library/?id=1131286162884183)), dentro de los 3 primeros segundos: «Nequi y SPEI, no.» Además pierde el plano del portátil en un café, que se confundía con las fotos de estilo de vida de Hubpay, Nomod y Network.
  - E2 cambia los checks por «Aparece», para no repetir el esquema ✗/✓ de EasyFirm y de las plantillas de agencia.
  - E4 deja el morado liso: va sobre blanco, y lo primero que se ve son dos relojes grandes en morado oscuro sobre gris claro, sin franja morada.
  - E3 pasa a fondo blanco, porque el lila es de Ziina. Sus notas van en Plus Jakarta Sans y no a mano, para que no recuerden la postal de Ziina ([1112014438360733](https://www.facebook.com/ads/library/?id=1112014438360733)). El móvil del cliente es el grande, para que no se lea como el panel del vendedor de Tab y Hubpay.
  - Los rótulos y titulares empiezan por «Si vendes cursos» o «Si vendes mentorías», con más peso que «Dubái». Así no se leen como otro «Abre tu empresa en Dubái».
  - Se mantienen las horas y ciudades de V1 y E4 y el estático solo de texto de E1, porque aquí no los usa nadie, y la comparativa de E2, porque las del hub son de reseñas o precios y ninguna compara métodos.

### Los 8 anuncios

Los 4 conjuntos salen a la vez y con los mismos 8 huecos.

| Pieza | Nombre en Meta | Nivel | Tipo | Persona | Emoción | Gancho | Formato |
|---|---|---|---|---|---|---|---|
| G1 | `HUB-DXB-G1 \| N2 \| Dolor \| Vende por llamada \| VIDEO-LLAMADA` | N2 | Dolor | Vende mentorías por llamada | Frustración | «"¿Cómo te pago?" Si vendes mentorías por llamada desde Dubái, mira cómo acaba.» | Vídeo ya grabado (llamada). Solo cambia el texto |
| G2 | `HUB-DXB-G2 \| N3 \| Mecanismo \| Quiere entender cómo funciona \| VIDEO-PANTALLAS` | N3 | Mecanismo | Quiere entender cómo funciona | Curiosidad | «Si vendes cursos desde Dubái, así te pagan Sevilla, Puebla y Bogotá.» | Vídeo ya grabado (pantallas de la app). Solo cambia el texto |
| V1 | `HUB-DXB-V1 \| N1 \| Dolor \| Vende a España de día y a México de noche \| VIDEO-HISTORIA` | N1 | Dolor contado como historia | Vende a España de día y a México de noche | Impotencia | «Once de la mañana en Dubái: tu alumna de Madrid quiere pagarte.» Rótulo «Si vendes cursos desde Dubái» desde el segundo 0 | Historia con voz en off de una creadora UGC, frases del cliente en pantalla, relojes, pantallas reales (a) y (b) y subtítulos quemados. Sin plano de IA |
| V2 | `HUB-DXB-V2 \| N2-N3 \| Creencia \| Cree que tarjeta y Apple Pay bastan \| REEL-CAMARA` | N2–N3 (puente) | Creencia que desmontar | Cobra con una pasarela de Emiratos y cree que le basta | Sorpresa | «Tu pasarela de Emiratos acepta tarjeta y Apple Pay. Nequi y SPEI, no.» | Reel hablado a cámara por el equipo, sin plano de apertura, con rótulo desde el segundo 0, subtítulos quemados y pantallas reales (a) y (b) |
| E1 | `HUB-DXB-E1 \| N1 \| Dolor \| Mentor ticket alto, cliente con tarjeta \| EST-TITULAR` | N1 | Dolor distinto del de V1 | Mentor de ticket alto cuyo cliente sí tiene tarjeta | Miedo | «Si vendes mentorías desde Dubái: tu clienta de Valencia saca la tarjeta. A veces la rechazan.» | Titular tipográfico a toda la imagen, sobre gris claro |
| E2 | `HUB-DXB-E2 \| N3 \| Comparativa \| Cobra con Stripe de Emiratos \| EST-HOY-VS-CON` | N3 | Comparativa con lo que usa hoy | Cobra con una pasarela de Emiratos y cree que le basta | Descubrimiento | «Si vendes cursos con un Stripe de Emiratos, mira qué le falta.» | Tabla «Hoy / con Kunfupay» sobre blanco, en gris y morado |
| E3 | `HUB-DXB-E3 \| N4 \| Prueba \| Quiere ver qué ve su cliente \| EST-CAPTURA-ANOTADA` | N4 | Prueba | Vende a España y México. Ya conoce Kunfupay y quiere ver qué ve su cliente | Confianza | «Si vendes cursos desde Dubái, esto ve tu cliente al pagarte.» | Dos páginas de pago reales (México y España), anotadas, sobre blanco |
| E4 | `HUB-DXB-E4 \| N5 \| Oferta \| Decidido, quiere probarlo \| EST-LIMPIA-BOTON` | N5 | Oferta directa | Decidido: ya sabe qué método le falta a su cliente y quiere probar | Decisión | «Si vendes cursos desde Dubái, un enlace con Bizum y OXXO.» | Imagen limpia sobre blanco, con dos relojes grandes en #260D68 sobre gris claro y «Registrarte ↓» en texto plano hacia el botón real de Meta |

- **Reparto de niveles:**
  - N1–N2: G1, V1 y E1 (3);
  - puente N2–N3: V2;
  - N3: G2 y E2;
  - N4: E3;
  - N5: E4.
  - La regla fija pide 3/2/1/1, que suman 7. El octavo anuncio es el puente, V2.
- **Personas reales (4, justo el mínimo):**
  - vende mentorías por llamada (G1);
  - vende a España y México (V1, E3 y E4);
  - cobra con una pasarela de Emiratos y cree que le basta (V2 y E2);
  - mentor de ticket alto cuyo cliente tiene tarjeta (E1).
  - No hay dos piezas con el mismo tipo y la misma persona.
- **Pantallas reales de la app** (fotogramas del máster del vídeo de la Infografía, a resolución completa). Las usan E3, V1 y V2:
  - (a) la página de pago con el selector de país en «México» y los métodos OXXO, SPEI, Mercado Pago, Visa, Mastercard y PayPal;
  - (b) los avisos «Nueva venta» +450,00 € por Bizum y +149,00 € por OXXO, y «Suscripción activada» +29,00 € por Nequi;
  - (c) el chat de WhatsApp donde el cliente pide el enlace y se le manda.
  - No se redibujan ni se tapan. Solo se recortan y se amplían. Los importes no se señalan ni se comentan.

### Genéricos: texto del anuncio para este hub

#### G1 · «¿Cómo te pago?» (el vídeo no cambia; solo el texto)

```text
«¿Cómo te pago?» Si vendes mentorías por llamada desde Dubái, mira cómo acaba.

Diez de la noche en Dubái. En Bogotá, la una de la tarde.

Tu cliente te dice que sí. No tiene tarjeta. Tiene pesos colombianos y Nequi.

PERO le cobras con tu enlace de Kunfupay. Te paga en pesos, con Nequi.
Y si alguno prefiere pagarte en cripto, también.
Y a ti te llega en euros o en dólares.

Si todavía no vendes, no es para ti.

Entra y mira si tu negocio encaja.

Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```

- **Título:** Te paga con Nequi, desde Bogotá
- **Descripción:** Aunque no tenga tarjeta
- **Botón:** Registrarte
- **Nombre en Meta:** `HUB-DXB-G1 | N2 | Dolor | Vende por llamada | VIDEO-LLAMADA`

#### G2 · Infografía (el vídeo no cambia; solo el texto)

```text
Si vendes cursos desde Dubái, así te pagan Sevilla, Puebla y Bogotá.

Creas tu producto en Kunfupay: pago único o suscripción.
Sacas tu enlace en el metro, camino de JLT.
Tu cliente te lo pide por WhatsApp y se lo mandas.

Le cobras con tu enlace de Kunfupay. Es el mismo para todos.
PERO cada uno te paga con lo suyo.
Tu alumna de Sevilla, con Bizum.
Tu alumno de Puebla, en OXXO.
El de Bogotá, con Nequi.
Y si alguno prefiere pagarte en cripto, también.
A ti te llega en euros o en dólares.

Si todavía no vendes, no es para ti.

Entra y mira si tu negocio encaja.

Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```

- **Título:** Sevilla con Bizum, Puebla en OXXO
- **Descripción:** Y Bogotá con Nequi, en el mismo enlace
- **Botón:** Registrarte
- **Nombre en Meta:** `HUB-DXB-G2 | N3 | Mecanismo | Quiere entender cómo funciona | VIDEO-PANTALLAS`

### Vídeos personalizados

> **Versión para grabar de V1:** `GUIONES-HUBS.md`, apartado 3, con ganchos alternativos. Allí los insertos usan la página de pago real. Los avisos de «Nueva venta» (pantalla b) llevan en el vídeo original la nota «Simulación. Cifras a modo de ejemplo.». Si un guion de aquí los usa, van con esa nota visible o se cambian por la página de pago real.

#### V1 · España de día, México de noche

**Quién lo graba y set**
- **Voz.** Una creadora UGC pone la voz en off. Habla en tercera persona de Kunfupay («tu enlace de Kunfupay») y no dice ni enseña que vive en Dubái.
- **Rótulo y subtítulos.** El rótulo «Si vendes cursos desde Dubái» sale desde el segundo 0, en Plus Jakarta Sans y en blanco sobre una caja #260D68. «Si vendes cursos» va en ExtraBold y «desde Dubái» en Medium, para que pese más lo primero. Los subtítulos van quemados en todo el vídeo.
- **Plano de IA.** No hay. El primer fotograma es el reloj «Dubái 11:00» en grande, en #260D68 sobre #F2F2F5, sin logo.
- **Frases del cliente.** Van como texto grande en pantalla, junto al reloj: «¿Te hago un Bizum?» y «¿Te lo pago en el OXXO?». En Plus Jakarta Sans, sin bocadillo de chat, sin interfaz, sin respuesta escrita y sin rótulo de recreación.
- **Pantallas reales.** Se usan la (a), ampliada en la fila de OXXO con «México» a la vista, y la (b), ampliada en los avisos de Bizum y de OXXO.
- **Cripto.** La frase «Y si alguno prefiere pagarte en cripto, también.» se graba como toma aparte, con su subtítulo y su plano en un clip propio. Se exportan dos másters: con cripto y sin cripto.

**Guion (teleprompter)**

```
[Rótulo desde el segundo 0: «Si vendes cursos desde Dubái». Fondo #F2F2F5. Reloj grande: «Dubái 11:00»]
Once de la mañana en Dubái: tu alumna de Madrid quiere pagarte.

[Texto en pantalla: «¿Te hago un Bizum?». Reloj: «Madrid 8:00»]
Allí son las ocho. «¿Te hago un Bizum?»
Con la pasarela que abriste en Emiratos, le pides tarjeta.

[Texto en pantalla: «¿Te lo pago en el OXXO?». Relojes: «Dubái 22:00 · Ciudad de México 12:00»]
Diez de la noche.
En Ciudad de México, mediodía: «¿Te lo pago en el OXXO?»
Otra vez: tarjeta.

[Los dos relojes juntos]
Los dos ya te dijeron que sí.
Y ninguno puede pagar con lo suyo.

PERO…
[Pantalla real (a): página de pago con «México», ampliada en la fila de OXXO]
Les cobras con tu enlace de Kunfupay.
Y cada uno te paga con lo suyo.
[Pantalla real (b): ampliada en los avisos «Nueva venta» por Bizum y por OXXO]
Once de la mañana: Bizum. Diez de la noche: OXXO.
[Clip propio; no va en el máster sin cripto]
Y si alguno prefiere pagarte en cripto, también.
Y a ti te llega en euros o en dólares.

[Rótulo final: «Entra y mira si tu negocio encaja.»]
Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
```

**Texto del anuncio**

```text
Once de la mañana en Dubái. Tu alumna de Madrid quiere pagarte con Bizum.

Diez de la noche. Tu alumno de Ciudad de México quiere pagar en OXXO.

Y tu pasarela de Emiratos les pide tarjeta a los dos.

PERO les cobras con tu enlace de Kunfupay. Y cada uno te paga con lo suyo. Bizum, OXXO, transferencia desde su banco o tarjeta.
Y si alguno prefiere pagarte en cripto, también.
Y a ti te llega en euros o en dólares.

Si todavía no vendes, no es para ti.

Entra y mira si tu negocio encaja.

Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```

- **Título:** Bizum por la mañana, OXXO por la noche
- **Descripción:** Madrid y México, cada uno a su hora
- **Botón:** Registrarte
- **Nombre en Meta:** `HUB-DXB-V1 | N1 | Dolor | Vende a España de día y a México de noche | VIDEO-HISTORIA`

#### V2 · Tarjeta y Apple Pay no bastan

**Quién lo graba y set**
- **Voz.** El equipo de Kunfupay habla a cámara, en estudio y de tú a tú. No nombra a Ziina, Wio ni Mamo.
- **Apertura.** Abre directamente a cámara, sin plano de IA ni de estilo de vida. Si los reels de Dubai Connecting son una persona a cámara en español, se aplica la apertura alternativa de «Antes de publicar».
- **Rótulo y subtítulos.** El rótulo «Si vendes cursos desde Dubái» sale desde el segundo 0, igual que en V1. Los subtítulos van quemados en todo el reel.
- **Dato en pantalla.** «Nequi: más de 25 millones de colombianos · Fuente: nequi.com.co», en texto, sin logo.
- **Pantallas reales.** Se usan la (a), ampliada en la fila de SPEI con «México» a la vista, y la (b), ampliada en el aviso «Suscripción activada» por Nequi. Se usa SPEI porque sale en la pantalla (a); Yape no sale en ninguna.
- **Cripto.** La frase «Y si alguno prefiere pagarte en cripto, también.» se graba como toma aparte, con su subtítulo y su plano en un clip propio. Se exportan dos másters: con cripto y sin cripto.

**Guion (teleprompter)**

```
[Rótulo desde el segundo 0: «Si vendes cursos desde Dubái». A cámara]
Tu pasarela de Emiratos acepta tarjeta y Apple Pay.
Nequi y SPEI, no.

En Bogotá, tu alumno paga con Nequi.
[En pantalla: «Nequi: más de 25 millones de colombianos» · Fuente: nequi.com.co]
En Monterrey, tu alumna paga por SPEI.
Abren el enlace de tu pasarela: ni Nequi ni SPEI.
Solo tarjeta, Apple Pay o Google Pay.

PERO les cobras con tu enlace de Kunfupay.
[Pantalla real (a): página de pago con «México», ampliada en la fila de SPEI]
Y cada uno te paga con lo suyo.
[Pantalla real (b): ampliada en el aviso «Suscripción activada» por Nequi]
Él, con Nequi. Ella, por SPEI. O con tarjeta.
[Clip propio; no va en el máster sin cripto]
Y si alguno prefiere pagarte en cripto, también.
Y a ti te llega en euros o en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
```

**Texto del anuncio**

```text
Tu pasarela de Emiratos acepta tarjeta y Apple Pay. Nequi y SPEI, no.

Tu alumno de Bogotá paga con Nequi. Tu alumna de Monterrey, por SPEI. Abren el enlace de tu pasarela y no encuentran lo suyo.

PERO les cobras con tu enlace de Kunfupay. Y ahí encuentran lo suyo: Nequi, SPEI o tarjeta.
Y si alguno prefiere pagarte en cripto, también.
A ti te llega en euros o en dólares.

Si todavía no vendes, no es para ti.

Entra y mira si tu negocio encaja.

Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```

- **Título:** Nequi, SPEI y tarjeta, en un enlace
- **Descripción:** Lo que usan en Bogotá y en Monterrey
- **Botón:** Registrarte
- **Nombre en Meta:** `HUB-DXB-V2 | N2-N3 | Creencia | Cree que tarjeta y Apple Pay bastan | REEL-CAMARA`

### Estáticos personalizados

> **Ya están hechos.** Los 4 estáticos de este hub están en `estaticos/`, en 1080×1350 (feed) y 1080×1920 (Stories). Las especificaciones de abajo fueron el brief de diseño. Donde el archivo final no coincide al píxel, manda el archivo. E3 cambió de pantallas: el motivo está en su apartado.

#### Reglas comunes de E1–E4

- **Formatos.** Cada pieza se entrega en 1080×1350 (feed) y en 1080×1920 (stories y reels).
- **Zona segura en 1080×1920.** El texto, las notas y el logo van entre y=270 e y=1250, a un mínimo de 64 px de los lados. Fuera de esa franja solo hay fondo; en E3, también la parte baja de los móviles.
- **Márgenes en 1080×1350.** 80 px a los lados y 72 px arriba y abajo.
- **Colores (solo estos):**
  - morado de marca #734BFC: filtro del titular, notas, trazos de E3, filetes de los relojes de E4, «Registrarte ↓», columna «Con Kunfupay» y logo;
  - morado oscuro #260D68: resto del titular, horas de los relojes y marcos de los móviles;
  - blanco #FFFFFF: fondo de E2, E3 y E4, y texto sobre morado;
  - gris claro #F2F2F5: fondo de E1, columna «Hoy» de E2 y bloques de reloj de E4;
  - gris #6E6E80: texto secundario y pie de fuente.
- **Tipografía: Plus Jakarta Sans.**
  - Titular en ExtraBold (800), con interlineado de 1,05 a 1,1.
  - El filtro va al principio del titular, en ExtraBold Italic y en #734BFC. El resto del titular va en ExtraBold y en #260D68.
  - Los textos secundarios van en SemiBold (600) o en Medium (500).
  - Bold (700) solo en las cabeceras de E2 y en las notas de E3.
- **Flecha de «Registrarte ↓».** La ↓ se dibuja como icono vectorial de trazo de 6 px, a la altura de la mayúscula del texto que acompaña y en su color. No se escribe con la fuente.
- **Logo de Kunfupay.** 44 px de alto, en #734BFC.
- **Límite de palabras.** Como máximo 20 en toda la imagen. No cuentan el logo ni el texto propio de las pantallas reales de E3. E2 es la excepción.
- **Nunca:** skyline, Burj Khalifa, banderas, dorado, emojis, estrellas, X rojas, checks, tarjetas dibujadas, fondo morado liso ni logos de Stripe, PayPal u otras marcas. Stripe y PayPal salen solo escritos.

#### E1 · La tarjeta de tu clienta

**Concepto:** un titular tipográfico que ocupa toda la imagen, sin foto ni ilustración. Es el único estático solo de texto del hub.

**1080×1350**
- Fondo gris claro #F2F2F5, liso.
- **Titular.** Va alineado a la izquierda, de x=80 a x=1000, y empieza en y=160. Cuerpo de 96 px; si pasa de 7 líneas, se baja hasta 88 px.
- **Línea pequeña.** Abajo a la izquierda, con la base en y=1200. SemiBold de 40 px, en #260D68.
- **Logo.** Abajo a la derecha, alineado a x=1000, con la base en y=1278.

**1080×1920**
- Mismo fondo y mismos cuerpos.
- El titular empieza en y=300.
- La línea pequeña lleva la base en y=1170 y el logo, en y=1240.

**Textos literales en la imagen (20 palabras)**
- **Titular:** «*Si vendes mentorías desde Dubái:* tu clienta de Valencia saca la tarjeta. A veces la rechazan.»
- **Línea pequeña:** «Con Kunfupay, por transferencia.»

**Texto del anuncio**

```text
Tu clienta de Valencia quiere tu mentoría más cara.
Saca su tarjeta. Tu pasarela es de Emiratos.
Para su banco, es un pago a otro país.
Y a veces lo rechaza.

Stripe lo avisa en su documentación.
Con tarjetas de otro país, puede haber más rechazos.
Y ella tiene que llamar a su banco.

PERO no todo tiene que pasar por su tarjeta.
Le cobras con tu enlace de Kunfupay.
Y ella elige pagarte por transferencia desde su banco.
Paga en euros.
A ti te llega en euros o en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```

- **Título:** Te paga por transferencia desde su banco
- **Descripción:** Tu clienta elige cómo pagarte
- **Botón:** Registrarte
- **Nombre en Meta:** `HUB-DXB-E1 | N1 | Dolor | Mentor ticket alto, cliente con tarjeta | EST-TITULAR`

#### E2 · Hoy / con Kunfupay

**Concepto:** una tabla de métodos del cliente en dos columnas: gris para «Hoy» y morado para «Con Kunfupay». No lleva precios, porcentajes, logos, checks ni X rojas.

**1080×1350**
- Fondo blanco #FFFFFF.
- **Titular.** Arriba, de x=80 a x=1000, desde y=72. Cuerpo de 64 px, en 2 o 3 líneas.
- **Tabla.** Va de y=330 a y=1060 y tiene tres columnas: etiquetas (x=80–430), «Hoy» (x=450–715) y «Con Kunfupay» (x=735–1000). Lleva una cabecera de 130 px y cinco filas de 120 px.
  - **Etiquetas:** SemiBold de 34 px en #260D68, sin fondo y alineadas a la izquierda. Entre filas, un filete de 2 px en #F2F2F5.
  - **Columna «Hoy»:** un solo bloque #F2F2F5 con esquinas de 24 px. Texto Medium de 32 px en #6E6E80, centrado.
  - **Columna «Con Kunfupay»:** un solo bloque #734BFC con esquinas de 24 px. Texto SemiBold de 32 px en blanco, centrado.
  - **Cabeceras:** Bold de 28 px, en el color de texto de su columna.
- **Frase de cierre.** Debajo de la tabla, desde y=1095. SemiBold de 40 px en #260D68.
- **Pie.** Base en y=1278, Medium de 24 px en #6E6E80, de x=80 a x=820. El logo va abajo a la derecha, sobre la misma base.

**1080×1920**
- Mismo fondo y mismas columnas en horizontal.
- El titular va de y=270 a y=450, con un cuerpo de 54 px en 3 líneas.
- La tabla va de y=470 a y=1080, con una cabecera de 90 px (Bold de 28 px) y cinco filas de 104 px. Las etiquetas y las celdas van a 30 px.
- La frase de cierre va de y=1100 a y=1180, con un cuerpo de 34 px.
- El pie y el logo llevan la base en y=1245; el pie, con un cuerpo de 22 px.

**Textos literales en la imagen (E2 no tiene límite de palabras)**
- **Titular:** «*Si vendes cursos con un Stripe de Emiratos,* mira qué le falta.»
- **Cabeceras de columna:** (vacía) | «Hoy, con tu Stripe de Emiratos» | «Con tu enlace de Kunfupay»
- **Filas:**

  | Etiqueta | Hoy | Con Kunfupay |
  |---|---|---|
  | «Tarjeta» | «Aparece» | «Aparece» |
  | «Bizum (España)» | «No aparece» | «Aparece» |
  | «OXXO (México)» | «No aparece» | «Aparece» |
  | «Transferencia en su moneda» | «No aparece» | «Aparece» |
  | «PayPal» | «Con una cuenta aparte» | «En el mismo enlace» |

- **Frase de cierre:** «Mandas un enlace, como siempre. Y cada uno paga con lo suyo.»
- **Pie:** «Fuente: documentación pública de Stripe para Emiratos, octubre de 2026.»

**Texto del anuncio**

```text
Si vendes cursos con un Stripe de Emiratos, mira qué le falta.

Para la tarjeta, te va bien.

Tu alumna de Sevilla te pide Bizum.
En tu Stripe de Emiratos, no aparece.
Tu alumno de Guadalajara quiere pagar en OXXO.
Tampoco aparece.
Una empresa de Bilbao quiere pagarte por transferencia, en euros.
No aparece.
¿Y PayPal? Con una cuenta aparte.

Lo dice la documentación de Stripe para Emiratos.

PERO a esos clientes les cobras con tu enlace de Kunfupay.
Se lo mandas, como siempre.
Y ahí cada uno paga con lo suyo.
Bizum, OXXO, transferencia desde su banco o PayPal, en el mismo enlace.
A ti te llega en euros o en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```

- **Título:** Bizum, OXXO y transferencia, en un enlace
- **Descripción:** Y la tarjeta, como siempre
- **Botón:** Registrarte
- **Nombre en Meta:** `HUB-DXB-E2 | N3 | Comparativa | Cobra con Stripe de Emiratos | EST-HOY-VS-CON`

#### E3 · Lo que ve tu cliente en México y en España

**Concepto:** dos pantallas reales de la página de pago, una por cada turno del día: España por la mañana y México por la noche.

**Archivos:** `estaticos/HUB-DXB-E3_1080x1350.png` y `estaticos/HUB-DXB-E3_1080x1920.png`

**Pantallas que se usan** (reales, sacadas del vídeo de la Infografía, sin retocar):
- La página de pago con «México», recortada al selector y a las casillas de SPEI y Mercado Pago.
- La página de pago con «España»: Bizum, Visa, Mastercard, Apple Pay, Google Pay y SEPA.
- **Por qué cambia respecto al brief:** en la pantalla de México el logo de OXXO sale cortado, y la fila de Visa, Mastercard y PayPal no se puede dejar fuera sin cortarlo también. Los avisos de «Nueva venta» llevan en el vídeo la nota «Simulación. Cifras a modo de ejemplo.», así que no pueden ir como pantalla real. OXXO sigue en E2 y E4.

**Texto literal de la imagen** (19 palabras, sin contar el de las pantallas)
- Titular: «*Si vendes cursos desde Dubái,* esto ve tu cliente al pagarte.»
- Notas: «En México: SPEI» · «En España: Bizum»
- Pie: «Pantallas reales.»

**Texto del anuncio**
```text
Si vendes cursos desde Dubái, esto ve tu cliente al pagarte.
Son pantallas reales de la app de Kunfupay.

Le cobras con tu enlace de Kunfupay.
Tu clienta de Madrid lo abre y ve Bizum.
Tu cliente de México lo abre y ve SPEI y Mercado Pago.

PERO tú mandas el mismo enlace.
Cada uno elige y paga con lo suyo.
El dinero te llega en euros o en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```

- **Título:** Así ve tu cliente la página de pago
- **Descripción:** Bizum en Madrid. SPEI en México.
- **Botón:** Registrarte
- **Nombre en Meta:** `HUB-DXB-E3 | N4 | Prueba | Quiere ver qué ve su cliente | EST-CAPTURA-ANOTADA`

#### E4 · Un enlace con Bizum y OXXO

**Concepto:** una imagen limpia sobre blanco en la que lo primero que se ve son los dos relojes. Debajo va «Registrarte ↓», que apunta al botón real de Meta. No lleva foto, ni móvil, ni tarjeta, ni línea de cripto.

**1080×1350**
- Fondo blanco #FFFFFF, liso, de borde a borde.
- **Relojes.** Son dos bloques #F2F2F5 de 920×190 px, con esquinas de 32 px, en x=80: el primero en y=96 y el segundo en y=310.
  - Cada bloque se parte en dos mitades con un filete vertical de 4 px en #734BFC.
  - En cada mitad, arriba va la ciudad en SemiBold de 32 px en #6E6E80 y debajo la hora en ExtraBold de 96 px en #260D68, alineadas a la izquierda.
- **Titular.** De x=80 a x=1000, desde y=600. Cuerpo de 76 px, en 3 o 4 líneas.
- **«Registrarte ↓».** Abajo a la derecha, alineado a x=1000 y con la base en y=1278. ExtraBold de 56 px en #734BFC. Es texto plano: sin caja, sin sombra y sin cursor.
- **Logo.** Abajo a la izquierda, en x=80 y sobre la misma base.

**1080×1920**
- Los relojes van en y=270 e y=480, con los mismos bloques.
- El titular va de y=740 a y=1060, con un cuerpo de 72 px.
- «Registrarte ↓» y el logo llevan la base en y=1230.

**Textos literales en la imagen (20 palabras)**
- **Reloj 1:** «Dubái» «11:00» | «Madrid» «8:00»
- **Reloj 2:** «Dubái» «22:00» | «CDMX» «12:00»
- **Titular:** «*Si vendes cursos desde Dubái,* un enlace con Bizum y OXXO.»
- **Llamada al botón:** «Registrarte ↓»

**Texto del anuncio**

```text
Si vendes cursos desde Dubái, un enlace con Bizum y OXXO.

Once de la mañana en Dubái: te escribe tu alumna de Madrid.
Diez de la noche: tu alumno de Ciudad de México.
Ella quiere pagar con Bizum. Él, en OXXO.
Y tu pasarela de Emiratos les pide tarjeta.

PERO les cobras a los dos con tu enlace de Kunfupay.
Y cada uno paga con lo suyo.
Bizum, OXXO, SPEI, Nequi, Mercado Pago o PayPal.
O tarjeta, o transferencia desde su banco.
Y si alguno prefiere pagarte en cripto, también.
A ti te llega en euros o en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```

- **Título:** Bizum en Madrid, OXXO en México
- **Descripción:** Te llega en euros o en dólares
- **Botón:** Registrarte
- **Nombre en Meta:** `HUB-DXB-E4 | N5 | Oferta | Decidido, quiere probarlo | EST-LIMPIA-BOTON`

### Pagar y retirar dinero en el hub

Esta es la respuesta a tu pregunta aparte. **No entra en los anuncios de métodos de pago:** la tarjeta de Kunfupay está prohibida en este ángulo y meterla rompería la comparación entre hubs.

**¿Suele ser un problema pagar en Dubái? No.**
- **Tarjeta.** «El pago con tarjetas de crédito está ampliamente difundido.» Fuente: Exteriores, actualizado el 15-07-2026 (https://www.exteriores.gob.es/es/ServiciosAlCiudadano/Paginas/Detalle-recomendaciones-de-viaje.aspx?trc=Emiratos%20%C3%81rabes%20Unidos).
- **También en el día a día.** «Debit and credit cards appear to have taken over from cash in the UAE.» Fuente: Expatica, 10-12-2025 (https://www.expatica.com/ae/finance/banking/banking-in-the-united-arab-emirates-73111/).
- **Pago con el móvil.** Apple Pay, Google Pay, Samsung Pay y Beam están «well established». Fuente: https://www.expatica.com/ae/finance/banking/mobile-banking-in-the-united-arab-emirates-72232/
- **Efectivo, solo para lo pequeño.** «cash remains essential for small purchases under AED 10 and minimum-fare taxi rides», y para los zocos. La guía de YOU recomienda llevar de 200 a 500 AED (https://www.you.co/sg/blog/dubai-atm-withdrawal-guide/).

**¿Y retirar? Se puede, pero cuesta.**
- **Comisión del cajero.** «Fees on international cards can range to AED 25», según Expatica. La guía de YOU dice que los bancos no la publican, así que las dos fuentes se contradicen.
- **Comisión de tu banco.**
  - N26 Standard cobra un 1,7 % (https://support.n26.com/en-eu/payments-transfers-and-withdrawals/withdrawals/why-was-i-charged-an-atm-fee).
  - Wise España no cobra hasta 250 € al mes y cobra un 2,69 % por encima (https://wise.com/es/pricing/card-fees).
- **Conversión del cajero (DCC).** Hay que rechazarla y retirar en dírhams. El recargo puede llegar «sometimes by as much as 18%». Es un dato general, no medido en Dubái (https://en.wikipedia.org/wiki/Dynamic_currency_conversion).

**Dónde está la fricción de verdad:**
- **El cambio.** El dírham está anclado al dólar a 3,6725. Quien cobra en dólares no nota la variación; quien cobra en euros, sí (https://en.wikipedia.org/wiki/United_Arab_Emirates_dirham).
- **La cuenta local.**
  - Con Emirates ID y visado es «generally straightforward», pero suele haber saldos mínimos (https://u.ae/en/information-and-services/finance-and-investment/banking-in-uae).
  - Sin residencia, solo se puede abrir una cuenta de ahorro, con un mínimo de hasta 5.000 AED y una penalización de 50 AED si no se cumple (https://www.expatica.com/ae/finance/banking/how-to-open-a-bank-account-in-the-united-arab-emirates-71466/).
- **El dinero que llega de fuera.** Hay reseñas de Wio con cobros entrantes bloqueados. Son reseñas, no un dato oficial.
- **Las tarjetas extranjeras de siempre no llegan.**
  - La tarjeta de Wise no existe en EAU (https://wise.com/ae/card/).
  - N26 no abre cuenta a residentes en EAU.
  - Revolut solo tiene una aprobación preliminar, de septiembre de 2025 (https://en.wikipedia.org/wiki/Revolut).
- **Lo local ya cubre gran parte del gasto en otras divisas.**
  - Wio da cuentas en EUR y USD y «zero international card transaction fees» (https://www.wio.io/spend).
  - Ziina no cobra comisión por divisa hasta 3.000 AED al mes (https://ziina.com/fees).

**¿Sería interesante hablar de la tarjeta en la moneda del lugar?**
- **Para quien ya vive allí: beneficio débil.** Pagar ya es fácil, y Wio y Ziina ya permiten gastar en otras divisas sin comisión, al menos hasta ciertos límites.
- **Para quien acaba de llegar sin Emirates ID, o quiere gastar sus euros o dólares sin pasar por un banco local: beneficio medio.** Solo es creíble si el cambio y el cajero salen baratos de verdad y si la tarjeta se emite a residentes en EAU.
- **En Bali y Tailandia rendiría bastante más**, porque allí hay más fricción: cajeros caros, efectivo o QRIS y una cuenta local difícil de abrir.
- **Hoy la web no lo respalda:**
  - la KunfuCard no dice en qué moneda tiene el saldo, y las maquetas salen en USD (https://kunfupay.com/personal/card);
  - la wallet es en EUR y USD (https://kunfupay.com/producto/wallet);
  - la web no habla de cajeros de forma explícita: menciona «Efectivo en +200 países» y, en la wallet, «En efectivo — Al instante», sin decir si es retirada en cajero o en una red de pago en efectivo, ni con qué coste;
  - se contradice sobre la tarjeta física: dice «Próximamente», «virtual y física» y «100% digital… sin plástico»;
  - y se contradice sobre la comisión de cambio (https://kunfupay.com/faq).
- **A favor:** según la web, la tarjeta se puede añadir a Apple Pay o Google Pay, que en Dubái están muy implantados. No consta que funcione allí.
- **Recomendación:** no meterla en estos 8 anuncios. Si se quiere probar, que sea en un ángulo aparte de wallet o tarjeta.
  - El mensaje sería: «Pagas con tu Visa desde tu saldo, estés donde estés.»
  - Nunca «en dírhams» ni «sin comisiones».

**Lo que la web no aclara todavía sobre la tarjeta:**
1. Si se emite y se envía a personas con residencia y dirección en EAU.
2. En qué moneda tiene el saldo y si convierte al pagar en AED; con qué margen, y si el margen cambia en fin de semana.
3. Cuál es la comisión de cambio real.
4. Si se puede usar en cajeros de EAU, con qué comisión y límites, y si avisa de la DCC.
5. Qué significan «Efectivo en +200 países» y «En efectivo — Al instante».
6. Si ya existe la tarjeta física.
7. Si funciona con Apple Pay y Google Pay en EAU.
8. Si hay bloqueos antifraude o por país al usarla en EAU.
9. Si es exacto decir «en la moneda del lugar».

### Fuentes

**Perfil y hub**
- https://www.ine.es/jaxiT3/Tabla.htm?t=71116&L=0
- https://www.ine.es/jaxiT3/Tabla.htm?t=71119&L=0
- https://www.exteriores.gob.es/Documents/FichasPais/EMIRATOSARABESUNIDOS_FICHA%20PAIS.pdf
- https://www.exteriores.gob.es/es/ServiciosAlCiudadano/Paginas/Detalle-recomendaciones-de-viaje.aspx?trc=Emiratos%20%C3%81rabes%20Unidos
- https://en.wikipedia.org/wiki/Dubai
- https://en.wikipedia.org/wiki/Time_in_the_United_Arab_Emirates
- https://en.wikipedia.org/wiki/Jumeirah_Lake_Towers
- https://en.wikipedia.org/wiki/Dubai_Marina
- https://en.wikipedia.org/wiki/Dubai_International_Financial_Centre
- https://en.wikipedia.org/wiki/Workweek_and_weekend
- https://www.letswork.io/

**Stripe**
- https://docs.stripe.com/payments/payment-method-support
- https://docs.stripe.com/payments/oxxo
- https://docs.stripe.com/payments/pix
- https://docs.stripe.com/payments/bizum
- https://docs.stripe.com/payments/bank-transfers
- https://docs.stripe.com/payments/paypal
- https://docs.stripe.com/declines/card
- https://stripe.com/en-ae/pricing
- https://stripe.com/ae
- https://support.stripe.com/questions/verification-of-businesses-in-the-uae
- https://stripe.com/guides/payment-methods-guide
- https://stripe.com/en-es/newsroom/news/bridge-partners-with-visa

**Métodos de pago del cliente**
- https://bizum.com/es/en/
- https://www.nequi.com.co/
- https://www.yape.com.pe/
- https://www.pse.com.co/
- https://www.ebanx.com/en/online-payment-methods/oxxo-mexico/
- https://www.ebanx.com/en/online-payment-methods/pix-payment/

**Competencia y herramientas**
- https://www.paypal.com/ae/webapps/mpp/merchant-fees
- https://hotmart.com/es/pagos
- https://hotmart.com/es/precios
- https://kajabi.com/features/payments
- https://ziina.com/fees
- https://www.mamopay.com/
- https://www.wio.io/business
- https://www.wio.io/spend
- https://www.payoneer.com/es/
- https://www.rebill.com/es
- https://www.ebanx.com/en/
- https://www.dlocal.com/

**Biblioteca de anuncios de Meta (EAU, anuncios activos el 28-10-2026)**
- https://www.facebook.com/ads/library/?id=1282765327371265 (Tab for Business)
- https://www.facebook.com/ads/library/?id=1312182170282539 (Dubai Connecting)
- https://www.facebook.com/ads/library/?id=2223276005122093 (Mashreq)
- https://www.facebook.com/ads/library/?id=2433705547440146 (Xflowpay)
- https://www.facebook.com/ads/library/?id=1131286162884183 (Ziina, «Apple Pay, Google Pay, or card»)
- https://www.facebook.com/ads/library/?id=1112014438360733 (Ziina, «Actually zero»)
- https://www.facebook.com/ads/library/?id=1131167559862831 (Summit Filings, ventana con la ciudad detrás)

**Reseñas**
- https://www.trustpilot.com/review/wio.io
- https://www.trustpilot.com/review/wio.io?page=2
- https://www.trustpilot.com/review/wio.io?page=3
- https://www.trustpilot.com/review/telr.com

**Kunfupay**
- https://kunfupay.com/
- https://kunfupay.com/producto/checkout
- https://kunfupay.com/cobros-global
- https://kunfupay.com/producto/api
- https://kunfupay.com/sensei-prueba-gratis
- https://kunfupay.com/blog/retirar-ganancias-peru-chile-creadores-2026
- https://kunfupay.com/tarifas
- https://kunfupay.com/faq
- https://kunfupay.com/personal/card
- https://kunfupay.com/producto/wallet
- https://kunfupay.com/brand

**Pagar y retirar en Dubái**
- https://www.expatica.com/ae/finance/banking/banking-in-the-united-arab-emirates-73111/
- https://www.expatica.com/ae/finance/banking/mobile-banking-in-the-united-arab-emirates-72232/
- https://www.expatica.com/ae/finance/banking/how-to-open-a-bank-account-in-the-united-arab-emirates-71466/
- https://www.you.co/sg/blog/dubai-atm-withdrawal-guide/
- https://support.n26.com/en-eu/payments-transfers-and-withdrawals/withdrawals/why-was-i-charged-an-atm-fee
- https://wise.com/es/pricing/card-fees
- https://wise.com/ae/card/
- https://en.wikipedia.org/wiki/Dynamic_currency_conversion
- https://en.wikipedia.org/wiki/United_Arab_Emirates_dirham
- https://en.wikipedia.org/wiki/Revolut
- https://u.ae/en/information-and-services/finance-and-investment/banking-in-uae

### Antes de publicar

- **Cripto en Meta.** Si la cuenta publicitaria no tiene autorización de Meta para cripto, se cortan las líneas de cripto en los 4 hubs (en V1 y V2 se sube el máster sin cripto) y G1 se pausa en los 4, porque su vídeo la nombra.
- **Panel real de Stripe de EAU.** Comprobar que no aparecen Bizum, OXXO, SPEI, Nequi, la transferencia ni PayPal procesado por Stripe. Si aparece alguno, se quita su línea o su fila en V1, V2, E1, E2 y E4.
- **Revisión legal de E2**, porque es publicidad comparativa.
- **PayPal en E2.** Confirmar con producto que el vendedor no necesita su propia cuenta de PayPal para que PayPal salga en su enlace de Kunfupay. Si la necesita, la fila de PayPal sale de E2 y de su texto.
- **Logos de métodos en las pantallas (a) y (b).** OXXO, SPEI, Mercado Pago, Visa, Mastercard, PayPal, Bizum y Nequi pueden salir con su logo dentro de la pantalla real. Legal confirma antes de producir si pueden salir en E3, V1 y V2 como parte de la captura. Si no pueden, se cambia el recorte o la pieza, y nunca se tapan.
- **Búsquedas de competencia pendientes.** En la Biblioteca de anuncios (EAU, activos), buscar Bizum, OXXO, Nequi, Yape, SPEI, Pix, «link de pago», «mentoría», «coach» e «infoproductor», y las páginas de Telr, PayTabs, Checkout.com y Tabby. Si alguno ya dice en español que el cliente paga con su método, se revisan los ganchos de V1, V2, E2 y E4 antes de publicar.
- **Reels de Dubai Connecting.** Ver en la Biblioteca 3534594903348234, 2059534224639694 y 3475721459258537. Si son una persona a cámara en español, V2 abre con la pantalla real (a) ampliada en la fila de SPEI durante los 2 primeros segundos, con el rótulo encima, y después pasa a cámara.
- **Hora de los avisos en la pantalla (b).** Si la pantalla (b) muestra la hora de los avisos y no coincide, la línea de V1 pasa a «Por la mañana, Bizum. Por la noche, OXXO.»
- **Horas de V1 y E4.** Valen hasta el 27-03-2027. Desde el 28-03-2027 pasan a «Madrid 9:00» y «Allí son las nueve».
- **E4 sobre blanco.** El cambio de fondo y de relojes se hace a la vez en los 4 E4.
- **Pieza que no pasa.** No se lanza ningún conjunto hasta tener su sustituta aprobada en los 4 hubs. Si los conjuntos ya están activos, su hueco se pausa en los 4 a la vez y se repone en cuanto haya sustituta. Si G1 se pausa por cripto, su sustituta se decide antes del lanzamiento.