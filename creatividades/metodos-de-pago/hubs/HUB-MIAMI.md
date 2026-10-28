# HUBS · Métodos de pago · Miami (hispanohablantes)

**Fecha:** 28 de octubre de 2026 · **Campaña:** HUBS · **Conjunto:** Miami (hispanohablantes)

### Análisis

**Límite de la evidencia.** No hay ninguna cita de un creador hispanohablante que diga vivir en Miami. Las situaciones de cobro salen de reglas publicadas por Zelle, Stripe, PayPal y Hotmart. No salen de testimonios del hub.

**Perfil**
- **Quién es.** Un creador hispanohablante que ya vende conocimiento online: cursos, mentorías, coaching, comunidades o membresías. Vive en Miami-Dade o Broward.
- **A quién vende.** Según el brief, sobre todo a Latinoamérica, algo a EE. UU. y algo a España. No está contrastado y no hay cifras públicas de cuántos son ni de cuánto facturan.
- **Contexto del hub.** Sirve solo para entender el hub y nunca se usa como atributo de quien ve el anuncio.
  - Miami-Dade tiene 2.802.029 habitantes (estimación de 2025). El 66,5 % habla español en casa (https://en.wikipedia.org/wiki/Miami-Dade_County,_Florida).
  - En Broward, el 27,6 % habla español en casa (https://en.wikipedia.org/wiki/Broward_County,_Florida).
  - En la ciudad de Miami, el 70,0 % habla español en casa (https://en.wikipedia.org/wiki/Demographics_of_Miami).
- **Zonas con fuente**
  - Doral: 83 % hispano, junto al aeropuerto (https://en.wikipedia.org/wiki/Doral,_Florida).
  - Kendall: el 26,4 % nació en Colombia (https://en.wikipedia.org/wiki/Colombian_Americans).
  - Weston (https://en.wikipedia.org/wiki/Weston,_Florida).
  - Brickell (https://en.wikipedia.org/wiki/Brickell).
  - Wynwood, con The LAB Miami (https://thelabmiami.com/).
- **Horario**
  - Bogotá está en UTC−5 todo el año. En invierno tiene la misma hora que Miami y en verano, una hora menos: «casi tu misma hora» (https://en.wikipedia.org/wiki/Time_in_Colombia).
  - Ciudad de México está en UTC−6 y ya no cambia de hora (https://en.wikipedia.org/wiki/Time_in_Mexico).
  - Buenos Aires está en UTC−3 (https://en.wikipedia.org/wiki/Time_in_Argentina).
- **Dato de casa.** La sede de actividad de Kunfu Global, Inc. está en Hialeah, FL 33015 (https://kunfupay.com/legal/terms).

**Situaciones reales de cobro**

| # | Situación | Regla o dato | Fuente | Fuerza |
|---|---|---|---|---|
| S1 | «Te paso mi Zelle», pero el cliente está en Bogotá | Zelle exige cuenta en un banco de EE. UU. a quien paga y a quien cobra | https://www.zelle.com/faq | Fuerte para la regla. No está verificado cuánto pasa en el hub |
| S2 | Cliente en Colombia que quiere pagar con Nequi o PSE | No aparecen en la tabla de Stripe para cuentas de EE. UU. Kunfupay los lista | https://docs.stripe.com/payments/payment-methods/payment-method-support · https://www.rebill.com/es/blog/collect-payments-colombia-from-abroad-pse-nequi · https://kunfupay.com/cobros-global | Media |
| S3 | Membresía mensual a un cliente de México que paga en OXXO | OXXO en Stripe: no admite cobros recurrentes, máximo de 10.000 MXN, el comprobante caduca a los 5 días por defecto y no se puede reembolsar. El FAQ de suscripciones de Kunfupay lista SPEI y Mercado Pago, pero no OXXO | https://docs.stripe.com/payments/oxxo · https://kunfupay.com/producto/suscripciones | Fuerte |
| S4 | Cliente en Argentina que paga con Mercado Pago | No está en la tabla de Stripe y Adaptive Pricing no cubre Argentina. Kunfupay lista «Mercado Pago, Tarjeta» | https://docs.stripe.com/payments/currencies/localize-prices/adaptive-pricing.md?payment-ui=stripe-hosted · https://kunfupay.com/cobros-global | Media |
| S5 | Cobrar con tarjeta a Latinoamérica con Stripe o PayPal de EE. UU. | Stripe: 2,9 % + 30 ¢, +1,5 % por tarjeta internacional y +1 % por conversión. PayPal: 3,49 % + cargo fijo, +1,5 % y un margen de cambio del 3–4 % | https://stripe.com/pricing · https://www.paypal.com/us/business/paypal-business-fees | Fuerte. No se comparan comisiones en los anuncios, porque Kunfupay no publica las suyas (https://kunfupay.com/tarifas) |
| S6 | Cliente en México que prefiere transferencia (SPEI) | Las transferencias en MXN de Stripe son solo para cuentas de México. Hay clientes que evitan la tarjeta | https://docs.stripe.com/payments/bank-transfers · https://www.rebill.com/es/blog/spei-mexico-local-bank-transfer-foreign-companies · https://kunfupay.com/faq | Fuerte (Stripe) y media (Rebill) |
| S7 | Cliente en Chile que paga con Webpay | Stripe no tiene métodos de Chile. Kunfupay lo lista, pero no está confirmado en el checkout real | https://kunfupay.com/cobros-global | Media |
| S8 | Membresía a un cliente en España que paga con Bizum | El Bizum de Stripe funciona solo en EUR y no admite el modo suscripción de Checkout. Kunfupay lo incluye en suscripciones | https://docs.stripe.com/payments/bizum · https://kunfupay.com/producto/suscripciones | Media |

Brasil (Pix) se queda fuera a propósito: Stripe EE. UU. ya acepta Pix (https://docs.stripe.com/payments/pix).

**Citas literales.** Ninguna es de alguien que viva en Miami. Las citas 1 a 4 y la 6 son textos de empresa.
1. «In order to use Zelle®, the sender and recipient's must have U.S bank accounts.» FAQ de Zelle: https://www.zelle.com/faq
2. «Recurring payments: ✗ Not supported» · «Vouchers expire after 5 days by default». Documentación de Stripe: https://docs.stripe.com/payments/oxxo
3. «Clientes que evitan tarjeta: por hábito, por límites, por rechazo previo o por experiencia». Rebill, sobre SPEI: https://www.rebill.com/es/blog/spei-mexico-local-bank-transfer-foreign-companies
4. «el consumidor cree que pagará un monto, y luego ve en su cuenta otro». Rebill, sobre Colombia: https://www.rebill.com/es/blog/collect-payments-colombia-from-abroad-pse-nequi
5. «ya deberían haber vinculado medios de pagos adicionales para personas que estamos en países no admitidos por ustedes». Scarleth (Nicaragua), reseña de Hotmart en Trustpilot, 17-10-2026: https://es.trustpilot.com/review/hotmart.com?page=2. El texto no está cotejado con el original.
6. «El checkout de Hotmart acepta 22 monedas locales, con más de 44 métodos de pago». Hotmart: https://hotmart.com/es/herramientas/internacionalizacion

**Qué usa hoy para cobrar**

| Herramienta | Qué ya le resuelve | Qué no aparece o tiene límite | Fuente |
|---|---|---|---|
| Zelle | Pagos entre cuentas de EE. UU. | No llega al cliente sin cuenta en un banco de EE. UU. | https://www.zelle.com/faq |
| Stripe (cuenta de EE. UU.) | Tarjeta, Apple Pay, Google Pay, Link, ACH, OXXO, Pix, Bizum (pago único, en EUR) y stablecoins. Con Adaptive Pricing, precio en moneda local en MX, CO, CL, PE, BR y UY | No aparecen Nequi, PSE, Mercado Pago, SPEI ni Webpay. OXXO no renueva. Adaptive Pricing no cubre AR, VE ni EC | https://docs.stripe.com/payments/payment-methods/payment-method-support · https://docs.stripe.com/payments/stablecoin-payments |
| Hotmart | Más de 44 métodos: OXXO, SPEI, Pix, PSE y Bizum. Comisión desde el 9,9 % más un cargo fijo | Funciona dentro de su plataforma. No se ha verificado si tiene Nequi o Mercado Pago | https://hotmart.com/es/herramientas/internacionalizacion · https://hotmart.com/es/precios |
| PayPal (EE. UU.) | Cobra a quien tenga PayPal o tarjeta | +1,5 % por transacción internacional y margen de cambio del 3–4 % | https://www.paypal.com/us/business/paypal-business-fees |
| Payoneer y Wise | Recibir el dinero | No ofrecen métodos locales para quien paga | https://www.payoneer.com/es/about/pricing/ · https://wise.com/us/pricing/receive |
| Kajabi, Skool, Whop | Pago con tarjeta | Webs en inglés que no nombran métodos de Latinoamérica | https://kajabi.com/ · https://www.skool.com/pricing · https://whop.com/ |

- **No se promete como novedad:**
  - tarjeta, Apple Pay o Google Pay;
  - OXXO o Pix;
  - Bizum en pago único;
  - la cripto como diferencial;
  - «tu cliente ve el precio en su moneda»;
  - «Stripe no puede»;
  - comisiones, el porcentaje de tarjetas rechazadas o «más de 100 métodos».
- **Se puede defender, nombrando el país del cliente:**
  - Nequi (Colombia);
  - PSE (Colombia), solo si sale en una captura real. Hoy no sale en ninguna, así que no se nombra;
  - Mercado Pago (Argentina, y México en la captura real);
  - SPEI (México);
  - un enlace propio que se manda por WhatsApp para cobrar una mentoría fuera de una plataforma de cursos.

**Objeciones y respuesta verdadera**

| Objeción | Respuesta | Fuente | Dónde se usa |
|---|---|---|---|
| «Ya tengo Stripe y acepta OXXO y Pix.» | Es verdad. Pero para cuentas de EE. UU. no aparecen Nequi, PSE, Mercado Pago ni SPEI, y su OXXO no renueva solo | https://docs.stripe.com/payments/oxxo · https://docs.stripe.com/payments/payment-methods/payment-method-support | E1 y E2, siempre con un país concreto y nunca con «Stripe no puede» |
| «Hotmart ya tiene métodos locales.» | Es verdad. La diferencia es un enlace propio para cobrar lo que cierras por WhatsApp. Sin atacar a Hotmart | https://hotmart.com/es/herramientas/internacionalizacion | V1, G2 y E3 |
| «Mis clientes me pagan por Zelle.» | Solo los que tienen cuenta en EE. UU. | https://www.zelle.com/faq | V1 |
| «Mis clientes tienen tarjeta.» | Muchos sí, y aun así hay quien prefiere la transferencia. Sin comparar comisiones | https://www.rebill.com/es/blog/spei-mexico-local-bank-transfer-foreign-companies | V2 |
| «La cripto ya la acepto con Stripe.» | Es verdad (stablecoins). En Kunfupay es una opción más, en la línea común que se puede cortar | https://docs.stripe.com/payments/stablecoin-payments | G1, G2, V1, V2 y E4 |
| «¿Cuánto cuesta?» | Kunfupay no publica precios. El FAQ dice: «Tu primer mes es completamente gratis» | https://kunfupay.com/tarifas · https://kunfupay.com/faq | E4 |
| «¿Me aceptan si vivo en Miami?» | Cada cuenta se revisa a mano, y el CTA ya lo cubre | https://kunfupay.com/legal/terms | Cierre |
| «¿Tengo que dejar Stripe o PayPal?» | No: «Convive con el resto de tu stack» | https://kunfupay.com/producto/api | E2 |

**Lenguaje del hub**
- **Se usa:**
  - Doral (junto al aeropuerto), Kendall, Weston, Brickell, Aventura y Wynwood;
  - la colada en vasito desechable, el cortadito y la ventanita (https://en.wikipedia.org/wiki/Cuban_espresso);
  - «casi tu misma hora» con Bogotá;
  - Zelle como método «de casa», solo en voz o en texto;
  - «celular», no «móvil»;
  - «el 305», con cuidado: deja fuera Broward, que es 954/754 (https://en.wikipedia.org/wiki/Area_codes_305_and_786).
- **Se evita:**
  - «Doralzuela», «Westonzuela», «si eres latino», el origen o la situación bancaria de quien mira (https://es.wikipedia.org/wiki/Doral_(Florida));
  - juntar un barrio con el país que más se le asocia;
  - Ocean Drive, South Beach, yates, el lujo de Brickell, Little Havana como si fuera todo el hub y «capital de Latinoamérica»;
  - argot cubano fuera de los nombres del café de ventanita (colada, cortadito), spanglish forzado, «parquear» y «rentar»;
  - «Miami, ciudad cripto», por el precedente de MiamiCoin (https://en.wikipedia.org/wiki/Francis_X._Suarez);
  - «Kunfupay cobra por ti», «sin comisiones», «100 % seguro», «todo en uno» y el voseo.

### Ángulo del hub

**«Lo de allí no entra aquí»: tus clientes de Colombia, México o Argentina quieren pagarte con lo de su país, y tu forma de cobrar solo acepta lo de EE. UU.**

- **Hoy:** cobra con Zelle, con tarjeta y con su Stripe o PayPal de EE. UU.
- **Sus clientes:** pagan con Nequi o PSE en Colombia, con SPEI en México y con Mercado Pago en Argentina.
- **Con Kunfupay:** le cobras con tu enlace, cada cliente paga con lo suyo y a ti te llega en dólares.

**Por qué**
- El dolor de Miami no está en gastar. Está en cobrar fuera de EE. UU. con herramientas de EE. UU.
  - Zelle exige cuenta en EE. UU. a los dos lados (https://www.zelle.com/faq).
  - Nequi, PSE, Mercado Pago y SPEI no aparecen para cuentas de Stripe en EE. UU. (https://docs.stripe.com/payments/payment-methods/payment-method-support · https://docs.stripe.com/payments/bank-transfers).
  - OXXO no admite cobros recurrentes (https://docs.stripe.com/payments/oxxo).
- Kunfupay lista esos métodos por país (https://kunfupay.com/cobros-global).
- Lo que ya resuelven Stripe y Hotmart (tarjeta, OXXO, Pix, precio local y stablecoins) no es diferencial y no se promete.
- **Deseo de fondo** (interpretación, fuerza débil a media): que cobrar a Bogotá sea tan normal como cobrarle por Zelle a alguien de Doral.

**Reglas del hub para las 8 piezas**
- Siempre se nombran el lugar y la situación. Nunca el origen ni la situación bancaria de quien mira.
- Un barrio no va con el país que más se le asocia. Kendall o Weston con Colombia, no. Doral con una clienta de Bogotá, sí.
- Con Bogotá se dice «casi tu misma hora», no «tu misma hora».
- Quien no vive en Miami-Dade o Broward no dice «aquí» en primera persona.
- Zelle, Stripe, PayPal y OXXO van solo en voz o en texto, nunca con su logo. OXXO solo se nombra como dolor (E1). En E3 puede verse en la captura real, pero no se anota.
- La cripto solo va en la línea común «Y si alguno prefiere pagarte en cripto, también.», suelta para poder cortarla. Va solo en G1, G2, V1 y V2 (textos y guiones) y en el texto de E4.
- «Dólares» solo como resultado («Y a ti te llega en dólares.»). Nunca como promesa en un gancho ni en un titular.
- Si hay una flecha de dinero, entra a Miami. No se usan banderas, billetes ni logos de métodos en el diseño.
- Se dice «celular», no «móvil». Se dice «tu enlace de Kunfupay», no «link de pago».

### Lo que anuncia la competencia aquí

Foto del 28-10-2026 en la Biblioteca de anuncios de Meta: 30 anuncios en español leídos completos, de 15 anunciantes. Solo Dubai Connecting tiene 111 activos que llegan a EE. UU.
- **Quién se anuncia:**
  - estructuras para «cobrar en dólares»: Dubai Connecting, Tu Empresa en America, Nexus Society y Sunbiz;
  - remesas: Ria, MoneyGram y Pangea;
  - un solo rival directo, Higlobe LATAM, que compite por precio.
  - Hotmart, Stripe, PayPal, Payoneer y Mercado Pago no se anuncian en español en EE. UU.
- **Lo que más tiempo lleva activo:**
  - Galo Lara, [1389856556291036](https://www.facebook.com/ads/library/?id=1389856556291036), desde el 23 jun.: «¿Se puede vender en Amazon USA desde tu país? Sí — y así funciona.» Es de Amazon, no de pagos.
  - Dubai Connecting, [891547937310297](https://www.facebook.com/ads/library/?id=891547937310297), desde el 24 jun.: «un simple link de pago» y «0% IMPUESTOS».
  - Dubai Connecting, [1778098646691330](https://www.facebook.com/ads/library/?id=1778098646691330), desde el 22 jul.: «Cobrá en Dólares sin Impuestos».
  - Pangea, [1361924792200736](https://www.facebook.com/ads/library/?id=1361924792200736), desde el 17 ago.: «Envía más a tus seres queridos».
  - Dubai Connecting, [1132394649456752](https://www.facebook.com/ads/library/?id=1132394649456752), desde el 9 sept.: la imagen fija más longeva, un cartel con rascacielos.
  - Ria, [4285060625080708](https://www.facebook.com/ads/library/?id=4285060625080708), desde el 28 sept.: «¿Dinero a Nequi?», con Nequi en un celular en la mano.
- **Saturado:**
  - «cobrar en dólares» como promesa;
  - precio y comisiones: la tabla de Higlobe contra Wise, [3226749587525708](https://www.facebook.com/ads/library/?id=3226749587525708);
  - «sin fronteras», «al mundo», «100 %» y «¿Sabías que…?»;
  - flechas y banderas de dinero que sale de EE. UU.: MoneyGram, [1802782824175240](https://www.facebook.com/ads/library/?id=1802782824175240), y Higlobe, [2923474264693188](https://www.facebook.com/ads/library/?id=2923474264693188).
- **Hueco que ocupamos.** Nadie enseña:
  - cómo te paga tu cliente ni el momento de pagar;
  - a quien vende cursos o mentorías;
  - dinero que entra a Miami;
  - un producto de pagos funcionando.
- **Qué cambiamos:**
  - E2 deja la tabla «Stripe contra Kunfupay», que recuerda a la de Higlobe, y pasa a dos bandas Buenos Aires → Miami, sin el nombre de Stripe en las bandas y sin nada tachado. Su gancho ya no es una pregunta con el nombre de un método, como «¿Dinero a Nequi?».
  - E3 usa dos pantallas reales de la app: nadie en el hub enseña su producto.
  - E3 y E4 nombran «mentorías», y E3 dice «alumno», igual que G2, V2 y E2. En pagos nadie lo hace.
  - V1 cambia el celular en la mano (el plano de Ria) por un celular boca abajo. V2 abre con su gancho en rótulo, sin pregunta.
  - «Dólares» queda solo como resultado. «Tu enlace de Kunfupay» sustituye a «link de pago».
- **Se mantiene, porque nadie lo usa:** Zelle (V1), la renovación con OXXO (E1), SPEI (V2), «¿Cómo te pago?» (G1) y el tono llano.

### Los 8 anuncios

Los 4 conjuntos salen a la vez y con los mismos 8 huecos.

| Pieza | Nombre en Meta | Nivel | Tipo | Persona | Emoción | Gancho (primera frase) | Formato |
|---|---|---|---|---|---|---|---|
| G1 | `HUB-MIA-G1 \| N2 \| Dolor \| Vende-por-llamada \| VIDEO-LLAMADA` | N2 | Dolor | Cierra ventas por llamada. Su cliente de Colombia no tiene tarjeta | Frustración | «*Si cierras ventas por llamada desde Miami:* "¿Cómo te pago?"» | Vídeo de la escena de llamada (ya grabado) |
| G2 | `HUB-MIA-G2 \| N3 \| Mecanismo \| Quiere-entender-como-funciona \| VIDEO-PANTALLAS` | N3 | Mecanismo | Quiere entender cómo funciona | Curiosidad | «*Si vendes por WhatsApp desde Miami,* así paga tu alumno de Bogotá.» | Vídeo de pantallas de la app (ya grabado) |
| V1 | `HUB-MIA-V1 \| N1 \| Dolor \| Mentor1a1-WhatsApp-Zelle \| VIDEO-HISTORIA` | N1 | Dolor (historia) | Mentor o coach 1:1 que cierra por WhatsApp y cobra por Zelle | Incomodidad | «*Si vendes mentorías desde Miami,* "te paso mi Zelle" te sale solo.» | Historia UGC en 9:16. Plano de IA con rótulo solo en el gancho y subtítulos quemados |
| V2 | `HUB-MIA-V2 \| N2-N3 \| Creencia \| Programa-alumnos-MX \| REEL-CAMARA` | N2–N3 (puente) | Creencia | Vende un programa en dólares con alumnos en México que tienen tarjeta | Sorpresa que acaba en alivio | «*Si vendes programas desde Miami a México,* piensas en tarjeta.» | Reel hablado a cámara por el equipo, con subtítulos quemados |
| E1 | `HUB-MIA-E1 \| N2 \| Dolor \| Membresia-MX \| EST-TITULAR` | N2 | Dolor (la renovación) | Dueño de una membresía mensual con miembros en México | Hartazgo | «*Si cobras membresías desde Miami a México,* caaada mes, un OXXO nuevo.» | Titular grande con una tira de 12 renovaciones a dos filas |
| E2 | `HUB-MIA-E2 \| N3 \| Comparativa \| Stripe-EEUU-clientes-AR \| EST-HOY-VS-CON` | N3 | Comparativa | Ya cobra con su Stripe de EE. UU. y tiene alumnos en Argentina | Claridad | «*Si cobras con Stripe desde Miami a Argentina,* te falta Mercado Pago.» | Dos bandas Buenos Aires → Miami: «Hoy», en gris, con la tarjeta que llega y Mercado Pago que no sale; «Con tu enlace de Kunfupay», en morado y completa con Mercado Pago |
| E3 | `HUB-MIA-E3 \| N4 \| Prueba \| Quiere-ver-checkout \| EST-CAPTURA-ANOTADA` | N4 | Prueba | Conoce Kunfupay y quiere ver qué ve su alumno antes de cambiar | Confianza | «*Si vendes mentorías desde Miami,* esto ve tu alumno de Colombia.» | Dos pantallas reales anotadas: el chat de WhatsApp y la página de pago de Colombia |
| E4 | `HUB-MIA-E4 \| N5 \| Oferta \| Listo-varios-paises \| EST-LIMPIA-BOTON` | N5 | Oferta | Vende mentorías a varios países y está listo para probar | Decisión | «*Si vendes mentorías desde Miami,* cada cliente paga con lo suyo.» | Morado liso, tres píldoras, el primer mes gratis y «Registrarte ↓» en texto plano |

### Genéricos: texto del anuncio para este hub

#### G1 «¿Cómo te pago?» (el vídeo no cambia)

**Nombre en Meta:** `HUB-MIA-G1 | N2 | Dolor | Vende-por-llamada | VIDEO-LLAMADA`

**Texto principal:**
```text
Si cierras ventas por llamada desde Miami: «¿Cómo te pago?»

Tu cliente de Medellín ya dijo que sí a tu mentoría.
Tiene pesos.
Y no tiene tarjeta.

PERO le cobras con tu enlace de Kunfupay.
Te paga con Nequi.
Y si alguno prefiere pagarte en cripto, también.
Y a ti te llega en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** Ya dijo que sí. Que pueda pagarte.
- **Descripción:** Tu cliente no tiene tarjeta. Te paga con Nequi.
- **Botón:** Registrarte

#### G2 «Infografía» (el vídeo no cambia)

**Nombre en Meta:** `HUB-MIA-G2 | N3 | Mecanismo | Quiere-entender-como-funciona | VIDEO-PANTALLAS`

**Texto principal:**
```text
Si vendes por WhatsApp desde Miami, así paga tu alumno de Bogotá.

Creas el producto. Sacas tu enlace de Kunfupay.
Se lo mandas por WhatsApp a todos.
PERO cada uno te paga con lo suyo.
Tu alumno de Bogotá, con Nequi.
El de Ciudad de México, por SPEI.
El de Buenos Aires, con Mercado Pago.
Y si alguno prefiere pagarte en cripto, también.
Y a ti te llega en euros o en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** Tu alumno te paga con lo de su país
- **Descripción:** Nequi, SPEI o Mercado Pago, según su país. Te llega en euros o en dólares.
- **Botón:** Registrarte

### Vídeos personalizados

> **Versión para grabar de V1:** `GUIONES-HUBS.md`, apartado 2, con ganchos alternativos. Allí los insertos usan la página de pago real. Los avisos de «Nueva venta» (pantalla b) llevan en el vídeo original la nota «Simulación. Cifras a modo de ejemplo.». Si un guion de aquí los usa, van con esa nota visible o se cambian por la página de pago real.

#### V1 «Te paso mi Zelle»

**Nombre en Meta:** `HUB-MIA-V1 | N1 | Dolor | Mentor1a1-WhatsApp-Zelle | VIDEO-HISTORIA`

**Quién lo graba:** un creador UGC, en selfie a cámara, en una mesa de casa con luz de día.
- Habla de Kunfupay en tercera persona («tu enlace de Kunfupay»).
- No dice que vive en Miami: la historia va en segunda persona.
- Solo el gancho va sobre el plano de IA.
- Subtítulos quemados entre y 270 e y 1250.

**Guion (teleprompter):**
```text
[Plano de IA, de 0 a 3 s: ventanita de café con una colada en vasito desechable y vasitos para repartir. Un celular boca abajo sobre el mostrador. Sin logos ni caras. Rótulo encima: ‹Si vendes mentorías desde Miami: «Te paso mi Zelle»›, con el filtro en cursiva. Subtítulos quemados en todo el vídeo, entre y 270 e y 1250.]
Si vendes mentorías desde Miami, «te paso mi Zelle» te sale solo.
Tu clienta de Doral te paga en la pausa de la colada.

[A cámara.]
Hasta que te escribe una clienta con un +57.
Bogotá.
Casi tu misma hora.
Quiere entrar a tu mentoría.

Y te sale solo:
«Te paso mi Zelle.»

[Rótulo de texto, sin interfaz de chat: ‹¿Zelle? Eso no lo tengo.›]
«¿Zelle? Eso no lo tengo.»
Zelle solo funciona entre cuentas de EE. UU.

Y te pregunta:
[Rótulo de texto, sin interfaz de chat: ‹¿Te puedo pagar por Nequi?›]
«¿Te puedo pagar por Nequi?»

PERO le cobras con tu enlace de Kunfupay.
Se lo pasas por WhatsApp, igual que tu Zelle.
Ella paga con Nequi, en pesos.
Y si alguno prefiere pagarte en cripto, también.
Y a ti te llega en dólares.

Entra y mira si tu negocio encaja.
```

**Texto principal:**
```text
Si vendes mentorías desde Miami, «te paso mi Zelle» te sale solo.

Con tu clienta de Doral, Zelle y listo.
Hasta que una clienta de Bogotá quiere entrar a tu mentoría.
Le pasas tu Zelle y te dice que no lo tiene.
Zelle solo funciona entre cuentas de EE. UU.
Y ella te pregunta si puede pagarte por Nequi.

PERO le cobras con tu enlace de Kunfupay. Se lo pasas por WhatsApp, igual que tu Zelle.
Ella paga con Nequi, en pesos.
Y si alguno prefiere pagarte en cripto, también.
Y a ti te llega en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** Desde Bogotá, te paga con Nequi.
- **Descripción:** Le pasas tu enlace de Kunfupay, como tu Zelle.
- **Botón:** Registrarte

#### V2 «Piensas en tarjeta»

**Nombre en Meta:** `HUB-MIA-V2 | N2-N3 | Creencia | Programa-alumnos-MX | REEL-CAMARA`

**Quién lo graba:** el equipo de Kunfupay, a cámara en plano medio, hablando de tú a quien mira.
- El fondo es liso: una pared clara o morado oscuro #260D68. Sin decorado de oficina ni de ciudad.
- No dice «aquí».
- No nombra Stripe ni OXXO.
- Subtítulos quemados entre y 270 e y 1250.

**Guion (teleprompter):**
```text
[Subtítulos quemados en todo el vídeo, entre y 270 e y 1250. Rótulo fijo de 0 a 3 s, con el filtro en cursiva: ‹Si vendes programas desde Miami a México: piensas en tarjeta.›]
Si vendes programas desde Miami a México, piensas en tarjeta.
Así te pagan tus alumnos de Weston.

Y das por hecho:
«Si mi alumno tiene tarjeta, me paga con tarjeta.»

Tu alumno de México la tiene.
Y aun así te escribe:
[Rótulo: ‹«¿Te puedo pagar por transferencia?»›]
«¿Te puedo pagar por transferencia?»

En México, eso es SPEI.
Desde su banco.
Hay quien lo prefiere por costumbre.
Por el límite de su tarjeta.
O porque ya se la rechazaron una vez.

Y tú solo le das tarjeta.

PERO si le cobras con tu enlace de Kunfupay, elige él.
[Rótulo: ‹Tarjeta · SPEI›]
Tarjeta.
O SPEI, en pesos.
Y si alguno prefiere pagarte en cripto, también.
Y a ti te llega en dólares.

Entra y mira si tu negocio encaja.
```

**Texto principal:**
```text
Si vendes programas desde Miami a México, piensas en tarjeta.
Así te pagan tus alumnos de Weston.

Tu alumno de México la tiene.
Y aun así te pregunta si puede pagarte por transferencia.
En México, eso es SPEI, desde su banco.
Hay quien lo prefiere por costumbre. Por el límite de su tarjeta. O porque ya se la rechazaron una vez.

PERO si le cobras con tu enlace de Kunfupay, elige él.
Tarjeta o SPEI, en pesos.
Y si alguno prefiere pagarte en cripto, también.
Y a ti te llega en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** Tu alumno de México elige: tarjeta o SPEI
- **Descripción:** Con SPEI, tu alumno paga desde su banco.
- **Botón:** Registrarte

### Estáticos personalizados

> **Ya están hechos.** Los 4 estáticos de este hub están en `estaticos/`, en 1080×1350 (feed) y 1080×1920 (Stories). Las especificaciones de abajo fueron el brief de diseño. Donde el archivo final no coincide al píxel, manda el archivo. E3 cambió de pantallas: el motivo está en su apartado.

#### Especificación común de E1–E4

- **Formatos:** 1080×1350 (feed) y 1080×1920 solo en Stories, en PNG y sRGB. Los estáticos no se publican en la ubicación Reels, salvo que se rehaga su 1080×1920 con texto y logo entre y 270 e y 1250 y a 65 px o más de los lados.
- **Colores:**
  - morado de marca #734BFC;
  - morado oscuro #260D68;
  - blanco #FFFFFF;
  - gris claro #F2F1F6, para fondos de bloque;
  - gris medio #A7A4B5, para elementos apagados y bordes;
  - gris oscuro #5E5A6E, para texto secundario.
- **Tipografía:** Plus Jakarta Sans.
  - Titular en ExtraBold (800). El filtro del principio va en Bold Italic (700, cursiva).
  - Etiquetas en SemiBold (600) y notas en Regular (400).
- **Márgenes:** 72 px a los lados en los dos formatos. En 1080×1920 no va texto ni logo en los 250 px de arriba ni en los 340 px de abajo.
- **Logo de Kunfupay:** 150 px de ancho, abajo a la derecha y a 72 px del borde derecho.
  - En 1080×1350, a 64 px del borde inferior. En 1080×1920, con su borde inferior en y = 1560.
  - Blanco #FFFFFF sobre morado y morado #734BFC sobre fondo claro.
- **Prohibido en la imagen:**
  - logos de terceros, salvo lo que salga en las capturas reales de E3;
  - banderas, billetes, emojis, personas y botones dibujados;
  - flechas de dinero que salgan de Miami.
- **Recuento de palabras:** se cuenta todo el texto de la imagen menos el logo y el texto propio de las capturas de E3. Máximo 20 palabras, salvo en E2.

#### E1 «Caaada mes, un OXXO nuevo»

**Nombre en Meta:** `HUB-MIA-E1 | N2 | Dolor | Membresia-MX | EST-TITULAR`

**Composición 1080×1350**
- Fondo blanco #FFFFFF.
- **Titular:** x 72, y 96, ancho 936. Va a 76 px con interlineado 1,08, alineado a la izquierda.
  - El filtro va en Bold Italic #734BFC y el resto en ExtraBold #260D68.
  - «caaada» lleva un espaciado de letras de +0,2 em para que se lea estirado.
- **Tira de 12 renovaciones**, entre y 600 e y 1100:
  - Etiqueta «Kendall» en SemiBold 32 px #260D68, en y 600, alineada a la izquierda.
  - Fila 1, en y 650: 12 círculos de 66 px rellenos de #734BFC, con un check blanco de trazo 6 px y 12 px de separación (de x 72 a x 996).
  - Etiqueta «CDMX» en SemiBold 32 px #260D68, en y 790.
  - Fila 2, en y 840: 12 comprobantes genéricos de 66×100 px con esquinas de 8 px, relleno #F2F1F6 y borde de 2 px #A7A4B5. Llevan un código de barras #5E5A6E en la mitad inferior.
  - Cada comprobante lleva un código de barras distinto y una rotación alterna (−3°, +2°, −1°…), para que se lea «uno nuevo cada vez».
  - El comprobante 3 va al 35 % de opacidad. Debajo, una flecha fina de 2 px #5E5A6E sube hasta él desde la etiqueta «Vencido» (SemiBold 28 px #5E5A6E).
  - «Vencido» va centrada en x 261 (el centro del comprobante 3), con el borde superior en y 1000. La flecha va de y 992 a y 948.
  - Sin logo de OXXO, sin sus colores rojo y amarillo y sin números de mes.
- Logo morado abajo a la derecha.

**Adaptación 1080×1920**
- Titular a 84 px, entre y 290 e y 760.
- «Kendall» en y 860, fila 1 en y 910, «CDMX» en y 1040, fila 2 en y 1090 y «Vencido» en y 1260, centrada en x 261. La flecha va de y 1252 a y 1198.
- Los elementos miden lo mismo que en 1080×1350, y el logo va donde marca la especificación común.

**Texto literal de la imagen** (15 palabras)
- **Titular:** *Si cobras membresías desde Miami a México,* caaada mes, un OXXO nuevo.
- **Etiquetas:** «Kendall» · «CDMX» · «Vencido»

**Texto del anuncio:**
```text
Si cobras membresías desde Miami a México, caaada mes, un OXXO nuevo.

Tu miembro de Kendall renueva solo.
El de Ciudad de México te paga en OXXO.
Y quiere seguir.

Cada renovación, le mandas un cobro nuevo.
Saca el comprobante. Vence en unos días.
Si se le pasa, vuelta a empezar.
Y tú, pendiente de quién pagó y quién no.

PERO con tu enlace de Kunfupay, se suscribe una vez, por SPEI.
Renueva solo, como el de Kendall.
Y a ti te llega en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** Que renueve solo, también desde México
- **Descripción:** Se suscribe una vez y renueva solo.
- **Botón:** Registrarte

#### E2 «Hoy / con tu enlace»

**Nombre en Meta:** `HUB-MIA-E2 | N3 | Comparativa | Stripe-EEUU-clientes-AR | EST-HOY-VS-CON`

**Composición 1080×1350**
- Fondo blanco #FFFFFF.
- **Titular:** x 72, y 88, ancho 936. Va a 64 px; el filtro en Bold Italic #734BFC y el resto en ExtraBold #260D68.
- **Medidas comunes de las dos bandas**
  - Puntos de 24 px con el centro en x 180 (Buenos Aires) y x 900 (Miami).
  - Etiquetas de ciudad centradas bajo cada punto, con el borde superior 24 px por debajo de su centro.
  - Píldoras de 64 px de alto, radio de 32 px y 28 px de relleno lateral, centradas en x 540.
  - Punta de flecha de 24 px que termina en x 888.
- **Banda «Hoy»** (x 72–1008, y 380–740): fondo #F2F1F6 con esquinas de 28 px.
  - Etiqueta «Hoy» en x 112, y 412, en SemiBold 30 px #5E5A6E.
  - Arriba, la ruta de tarjeta en y 500: dos puntos #A7A4B5 y una línea continua de 4 px #A7A4B5 que sí llega a Miami, con punta de flecha. En el centro lleva la píldora «Tarjeta», con fondo blanco, borde de 2 px #A7A4B5 y texto SemiBold 30 px #5E5A6E.
  - Debajo, la ruta de Mercado Pago en y 600: dos puntos #A7A4B5 y una línea discontinua de 4 px #A7A4B5 que va de Buenos Aires hacia Miami. Se corta en el centro con la píldora «Mercado Pago» y no lleva punta de flecha, porque esta ruta no llega.
  - La píldora «Mercado Pago» lleva fondo blanco y borde de 2 px #A7A4B5. Su texto va en SemiBold 30 px #A7A4B5, sin tachar.
  - «No te sale», en Regular 24 px #5E5A6E, va centrada en x 540 con el borde superior en y 648.
  - «Buenos Aires» y «Miami» van una sola vez, bajo los puntos de la ruta de Mercado Pago, en SemiBold 30 px #5E5A6E.
- **Banda «Con tu enlace de Kunfupay»** (x 72–1008, y 760–1080): fondo #734BFC con esquinas de 28 px.
  - Etiqueta en x 112, y 792, en SemiBold 30 px blanco.
  - Ruta en y 960: los mismos dos puntos, ahora en blanco, con «Buenos Aires» y «Miami» debajo, en SemiBold 30 px blanco.
  - Una línea continua de 6 px blanca, con punta de flecha que entra en el punto de Miami.
  - En el centro va la píldora «Mercado Pago», con fondo blanco y texto ExtraBold 30 px #734BFC. Es el elemento que más destaca.
- **Fuente:** no va en la imagen. La captura fechada de la tabla de Stripe se guarda para Legal. Si Legal exige que la fuente se vea: «Fuente: métodos de Stripe para EE. UU., [fecha].», en Regular 24 px #5E5A6E, en x 72, y 1180.
- Logo morado abajo a la derecha.
- Sin logos: todas las marcas van como texto. Stripe solo sale en el filtro del titular.

**Adaptación 1080×1920**
- Titular a 76 px, entre y 270 e y 600.
- Banda «Hoy» entre y 640 e y 1000, y banda «Con tu enlace de Kunfupay» entre y 1040 e y 1400. Las dos van de x 72 a x 1008, con las etiquetas en x 112 y los mismos elementos un 10 % más grandes.
- Si Legal exige la fuente, va entre y 1440 e y 1500. El logo va donde marca la especificación común.

**Texto literal de la imagen** (E2 puede pasar de 20 palabras)
- **Titular:** *Si cobras con Stripe desde Miami a Argentina,* te falta Mercado Pago.
- **Banda 1:** «Hoy» · «Buenos Aires» · «Miami» · píldora «Tarjeta» · píldora «Mercado Pago» · «No te sale»
- **Banda 2:** «Con tu enlace de Kunfupay» · «Buenos Aires» · «Miami» · píldora «Mercado Pago»
- **Fuente** (solo si Legal la exige): Fuente: métodos de Stripe para EE. UU., [fecha].

**Texto del anuncio:**
```text
Si cobras con Stripe desde Miami a Argentina, te falta Mercado Pago.

Es verdad: tu Stripe de EE. UU. ya acepta tarjeta.
Y hay alumnos en Argentina que te pagan así.

Otros te escriben: «¿Te puedo pagar con Mercado Pago?»
En tu Stripe de EE. UU., Mercado Pago no sale.

PERO con tu enlace de Kunfupay, te paga con Mercado Pago.
No tienes que dejar tu Stripe.
Y a ti te llega en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** Tu alumno de Argentina, con Mercado Pago
- **Descripción:** No tienes que dejar tu Stripe.
- **Botón:** Registrarte

#### E3 «Esto ve tu alumno»

**Nombre en Meta:** `HUB-MIA-E3 | N4 | Prueba | Quiere-ver-checkout | EST-CAPTURA-ANOTADA`

**Archivos:** `estaticos/HUB-MIA-E3_1080x1350.png` y `estaticos/HUB-MIA-E3_1080x1920.png`

**Pantallas que se usan** (reales, sacadas del vídeo de la Infografía, sin retocar):
- (c) El chat de WhatsApp en el que se pide y se manda el enlace, sin la cabecera del contacto.
- (a) La página de pago con «Colombia»: Nequi, PSE, Bancolombia, Mercado Pago, Visa y Mastercard.
- **Por qué Colombia y no México:** en la pantalla de México el logo de OXXO sale cortado y la fila de Visa, Mastercard y PayPal no se puede dejar fuera sin cortar también OXXO. Colombia es además el primer país del ángulo de Miami (Nequi y PSE).
- **Importe:** la tarjeta del enlace en el chat enseña «450,00 €» y no se puede quitar sin cortar el mensaje. Por eso el texto dice «en euros o en dólares».

**Texto literal de la imagen** (19 palabras, sin contar el de las pantallas)
- Titular: «*Si vendes mentorías desde Miami,* esto ve tu alumno de Colombia.»
- Notas: «Tu enlace de Kunfupay» · «Elige él.»
- Pie: «Pantallas reales.»

**Texto del anuncio:**
```text
Si vendes mentorías desde Miami, esto ve tu alumno de Colombia.

Le pasas tu enlace de Kunfupay por WhatsApp.
Lo abre y le salen los métodos de Colombia.
PERO no ve solo tarjeta.
Ve Nequi.
Y PSE, para pagarte desde su banco.
Elige él.

Son las pantallas reales.
Y a ti te llega en euros o en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** Esto ve tu alumno al pagarte
- **Descripción:** La pantalla real: Nequi y PSE.
- **Botón:** Registrarte

#### E4 «Cada cliente paga con lo suyo»

**Nombre en Meta:** `HUB-MIA-E4 | N5 | Oferta | Listo-varios-paises | EST-LIMPIA-BOTON`

**Composición 1080×1350**
- Fondo morado de marca #734BFC, liso: sin fotos, sin personas y sin logos de otras marcas.
- Un bloque centrado en vertical y en horizontal, de 900 px de ancho como máximo:
  1. **Titular** blanco y centrado, a 80 px con interlineado 1,08. El filtro va en Bold Italic y el resto en ExtraBold.
  2. A 56 px, **tres píldoras en fila:** «Nequi», «SPEI» y «Mercado Pago».
     - Sin fondo, con borde de 3 px blanco y texto en SemiBold 34 px blanco.
     - 76 px de alto, esquinas de 38 px y 20 px entre ellas.
     - Relleno lateral de 28 px. Ancho según el texto. La fila de las tres píldoras queda centrada.
  3. A 40 px, el **apoyo** en SemiBold 36 px blanco.
  4. A 72 px, **«Registrarte ↓»** en SemiBold 40 px blanco. Es texto plano: sin caja, sin sombra y sin cursor, y apunta al botón real de Meta.
- Logo blanco abajo a la derecha.
- Sin precio. La oferta es el primer mes gratis.

**Adaptación 1080×1920**
- El mismo bloque, centrado entre y 250 e y 1580, con el titular a 88 px.
- «Registrarte ↓» lleva su borde inferior por encima de y 1540. El logo va donde marca la especificación común.

**Texto literal de la imagen** (20 palabras)
- **Titular:** *Si vendes mentorías desde Miami,* cada cliente paga con lo suyo.
- **Píldoras:** «Nequi» · «SPEI» · «Mercado Pago»
- **Apoyo:** Tu primer mes, gratis.
- **Indicación al botón:** Registrarte ↓

**Texto del anuncio:**
```text
Si vendes mentorías desde Miami, cada cliente paga con lo suyo.

Tu cobro está montado para EE. UU.
Y en Bogotá, Ciudad de México o Buenos Aires pagan distinto.

PERO le cobras a cada uno con tu enlace de Kunfupay.
Nequi en Bogotá, SPEI en México, Mercado Pago en Buenos Aires.
Y si alguno prefiere pagarte en cripto, también.
Y a ti te llega en dólares.
Tu primer mes es gratis.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** Cada cliente paga con lo suyo
- **Descripción:** Nequi, SPEI o Mercado Pago, según su país. Te llega en dólares.
- **Botón:** Registrarte

### Pagar y retirar dinero en el hub

Esta sección responde a una pregunta aparte. **No entra en los anuncios de métodos de pago**, porque el ángulo prohíbe hablar de la tarjeta de Kunfupay.

**Respuesta corta.** En Miami, pagar en el día a día no suele ser un problema, y sacar efectivo es una molestia pequeña. La «tarjeta en la moneda del lugar» sería un beneficio **débil** en este hub: la moneda del lugar es el dólar, la misma en la que ya reciben con Kunfupay. Solo llegaría a **medio** en dos casos concretos, y en los dos depende de lo que confirme el equipo.

**Pagar**
- En EE. UU., el efectivo es solo el 14 % de los pagos y el móvil, el 23 % (datos de 2024: https://www.frbservices.org/binaries/content/assets/crsocms/news/research/2025-diary-of-consumer-payment-choice.pdf).
- Con cuenta en EE. UU. se paga casi todo con tarjeta o con el móvil, sin fricción.
- Quien paga en Miami con una tarjeta de su país puede sufrir un recargo de hasta el 18 % si el comercio le cobra en su moneda (conversión dinámica: https://en.wikipedia.org/wiki/Dynamic_currency_conversion).

**Retirar efectivo**
- Un cajero de otra red cuesta de media 4,86 $ en EE. UU. y 5,11 $ en Miami, que es la 6.ª más cara de 25 áreas metropolitanas (https://www.bankrate.com/banking/checking/checking-account-survey/).
- Es una molestia, no un dolor.

**Dónde está la fricción de verdad: vivir allí sin cuenta en un banco de EE. UU.**
- Zelle exige cuenta en EE. UU. (https://www.zelle.com/faq).
- Venmo exige residencia y cuenta en EE. UU., y SSN o número de contribuyente para mantener saldo (https://venmo.com/legal/us-user-agreement/).
- La ley permite abrir una cuenta con pasaporte (https://www.law.cornell.edu/cfr/text/31/1020.220), pero en Miami sale caro:
  - Banesco USA pide 25.000 $ de apertura y cobra 35 $ al mes (https://banescousa.com/personal/deposits/int/).
  - Amerant pide 5.000 $, yendo en persona a una oficina (https://www.amerantbank.com/personal/international/international-checking/).

**Fuerza del beneficio, caso por caso**

| Caso | Fuerza | De qué depende |
|---|---|---|
| Vive en Miami, tiene cuenta en EE. UU. y cobra en USD | Débil | No hay nada que convertir, y Wise y Payoneer ya dan tarjeta en dólares barata |
| Cobra en euros (clientes en España) y gasta en dólares | Media | De la comisión de cambio. La web se contradice: «sin… pagar comisiones de conversión» frente a «Solo pagas cuando realizas una transacción que implique conversión de divisa» (https://kunfupay.com/faq) |
| Vive en Miami sin cuenta en un banco de EE. UU. | Media | De si puede tener la tarjeta. Gastaría sus dólares con una Visa en Apple Pay o Google Pay |
| Sacar efectivo | No se puede prometer | La tarjeta se presenta como «100% digital… sin plástico» (https://kunfupay.com/personal/card). Sobre la tarjeta física, la web dice «virtual y física» (https://kunfupay.com/faq), «100% digital» y «Tarjeta física — Próximamente» (https://kunfupay.com/producto/wallet) |

**La competencia ya ocupa ese mensaje**
- Higlobe LATAM lo anuncia en español en este hub: «Con la tarjeta Higlobe puedes usar tu saldo en dólares … donde se acepten Visa» ([1422687400006661](https://www.facebook.com/ads/library/?id=1422687400006661)).
- Wise usa en su web «La tarjeta que siempre tiene la divisa correcta» (https://wise.com/es/). Su tarjeta cuesta 9 USD en EE. UU., con cajero gratis hasta 250 USD al mes (https://wise.com/us/pricing/card-fees).
- Payoneer anuncia en su web compras en la misma moneda gratis (https://www.payoneer.com/es/about/pricing/).

**Recomendación**
- No usar la tarjeta en Miami.
- Si se quiere probar, que sea en un ángulo WALLET, en hubs donde hay fricción real:
  - **Bali:** en muchos sitios solo aceptan efectivo o QRIS, y hay recargos con tarjeta (https://www.baliholidaysecrets.com/using-australian-cards-in-bali/).
  - **Tailandia:** cada retirada en cajero cuesta 220–250 THB (https://www.superagent.co/en/blog/how-to-open-a-bangkok-bank-account-as-a-foreigner-complete-2026-guide).
- Dubái no: se parece a Miami, porque el pago sin contacto se acepta en casi todas partes (https://www.you.co/sg/blog/dubai-atm-withdrawal-guide/).
- Si algún día entra en Miami, solo para los dos casos de fuerza media y sin «saldo en dólares» ni «Visa» en el gancho, porque es el anuncio activo de Higlobe. Nunca «en la moneda local», «sin comisiones» ni nada sobre cajeros.

**Lo que falta saber de la tarjeta**
1. Si puede tener la tarjeta alguien que vive en Florida con pasaporte extranjero y sin SSN.
2. Si gasta directamente del saldo en USD sin conversión, y qué tipo de cambio y comisión se aplica cuando el saldo está en EUR.
3. Si los comercios de EE. UU. la tratan como tarjeta extranjera, con posible comisión internacional o más rechazos.
4. Si hay tarjeta física, si sirve en cajeros y qué es el retiro «En efectivo — Al instante» de la wallet.
5. Si el número de cuenta de EE. UU. de la wallet recibe ACH y si sirve para Zelle.
6. Los límites de gasto.

### Fuentes

**Métodos de pago y competencia**
- https://www.zelle.com/faq
- https://docs.stripe.com/payments/payment-methods/payment-method-support
- https://docs.stripe.com/payments/bank-transfers
- https://docs.stripe.com/payments/oxxo
- https://docs.stripe.com/payments/currencies/localize-prices/adaptive-pricing.md?payment-ui=stripe-hosted
- https://docs.stripe.com/payments/stablecoin-payments
- https://docs.stripe.com/payments/bizum
- https://docs.stripe.com/payments/pix
- https://stripe.com/pricing
- https://www.paypal.com/us/business/paypal-business-fees
- https://www.rebill.com/es/blog/collect-payments-colombia-from-abroad-pse-nequi
- https://www.rebill.com/es/blog/spei-mexico-local-bank-transfer-foreign-companies
- https://hotmart.com/es/herramientas/internacionalizacion
- https://hotmart.com/es/precios
- https://es.trustpilot.com/review/hotmart.com?page=2
- https://www.payoneer.com/es/about/pricing/
- https://wise.com/us/pricing/receive
- https://kajabi.com/
- https://www.skool.com/pricing
- https://whop.com/

**Anuncios de la competencia (Biblioteca de anuncios de Meta, consultada el 28-10-2026)**
- https://www.facebook.com/ads/library/?id=1389856556291036 (Galo Lara)
- https://www.facebook.com/ads/library/?id=891547937310297 (Dubai Connecting)
- https://www.facebook.com/ads/library/?id=1778098646691330 (Dubai Connecting)
- https://www.facebook.com/ads/library/?id=1132394649456752 (Dubai Connecting)
- https://www.facebook.com/ads/library/?id=1361924792200736 (Pangea)
- https://www.facebook.com/ads/library/?id=4285060625080708 (Ria Money Transfer)
- https://www.facebook.com/ads/library/?id=3226749587525708 (Higlobe LATAM)
- https://www.facebook.com/ads/library/?id=2923474264693188 (Higlobe LATAM)
- https://www.facebook.com/ads/library/?id=1422687400006661 (Higlobe LATAM)
- https://www.facebook.com/ads/library/?id=1802782824175240 (MoneyGram)

**Kunfupay**
- https://kunfupay.com/cobros-global
- https://kunfupay.com/faq
- https://kunfupay.com/producto/suscripciones
- https://kunfupay.com/producto/checkout
- https://kunfupay.com/producto/wallet
- https://kunfupay.com/producto/api
- https://kunfupay.com/personal/card
- https://kunfupay.com/tarifas
- https://kunfupay.com/legal/terms

**Hub (perfil, zonas y lenguaje)**
- https://en.wikipedia.org/wiki/Miami-Dade_County,_Florida
- https://en.wikipedia.org/wiki/Broward_County,_Florida
- https://en.wikipedia.org/wiki/Demographics_of_Miami
- https://en.wikipedia.org/wiki/Doral,_Florida
- https://es.wikipedia.org/wiki/Doral_(Florida)
- https://en.wikipedia.org/wiki/Colombian_Americans
- https://en.wikipedia.org/wiki/Weston,_Florida
- https://en.wikipedia.org/wiki/Brickell
- https://thelabmiami.com/
- https://en.wikipedia.org/wiki/Time_in_Colombia
- https://en.wikipedia.org/wiki/Time_in_Mexico
- https://en.wikipedia.org/wiki/Time_in_Argentina
- https://en.wikipedia.org/wiki/Cuban_espresso
- https://en.wikipedia.org/wiki/Area_codes_305_and_786
- https://en.wikipedia.org/wiki/Francis_X._Suarez

**Pagar y retirar dinero**
- https://www.frbservices.org/binaries/content/assets/crsocms/news/research/2025-diary-of-consumer-payment-choice.pdf
- https://www.bankrate.com/banking/checking/checking-account-survey/
- https://venmo.com/legal/us-user-agreement/
- https://www.law.cornell.edu/cfr/text/31/1020.220
- https://banescousa.com/personal/deposits/int/
- https://www.amerantbank.com/personal/international/international-checking/
- https://en.wikipedia.org/wiki/Dynamic_currency_conversion
- https://wise.com/es/
- https://wise.com/us/pricing/card-fees
- https://www.you.co/sg/blog/dubai-atm-withdrawal-guide/
- https://www.baliholidaysecrets.com/using-australian-cards-in-bali/
- https://www.superagent.co/en/blog/how-to-open-a-bangkok-bank-account-as-a-foreigner-complete-2026-guide

### Antes de publicar

Si una pieza no pasa estos puntos, ningún conjunto sale hasta tener su sustituta validada. La sustituta ocupa el mismo hueco en los 4 hubs.

- **Categoría especial.** Comprobar en Ads Manager si Meta pide «Productos y servicios financieros». Si la pide, declararla y segmentar por ciudad o por un radio de 15 millas o más, sin código postal, edad ni sexo.
- **Cripto.** Si Meta no la autoriza, se cortan todas las líneas de cripto en los 4 hubs y G1 se sustituye en los 4 antes de salir. V1 y V2 se montan y exportan en dos versiones, con y sin la línea de cripto (voz y subtítulo).
- **Moneda.** Confirmar que el vendedor de Miami recibe en USD. Si no, «en dólares» pasa a «en euros o en dólares» en todas las piezas.
- **Legal y fuentes, el día de publicar.** Revisión de publicidad comparativa en V1 (Zelle) y E2 (Stripe). Revisar el FAQ de Zelle y la tabla de Stripe. Guardar la captura fechada de la tabla de Stripe para Legal y, si Legal exige la fuente en la imagen de E2, rellenar [fecha].
- **E2, G2 y E4.** Abrir un checkout real de Kunfupay con el país «Argentina» y comprobar que sale Mercado Pago. Si no sale, o si Mercado Pago ya sale en la tabla de Stripe, E2 pasa a Colombia: titular «Si cobras con Stripe desde Miami a Colombia, te falta Nequi.», rutas Bogotá → Miami, píldora «Nequi» y texto reescrito con Nequi. En G2, «El de Buenos Aires, con Mercado Pago.» pasa a «El de Monterrey, con Mercado Pago.». En E4, «Buenos Aires» pasa a «Monterrey».
- **G1.** Revisar si su vídeo muestra importes en euros; si los muestra, aplicar el mismo cambio que en G2: «Y a ti te llega en euros o en dólares.».
- **E1.** Confirmar que la suscripción por SPEI se cobra sola cada mes. Si no, el giro pasa a Mercado Pago. Si tampoco, E1 se rehace con España y Bizum.
- **E3.** Comprobar que el encuadre deja fuera la cabecera del chat, las tarjetas, PayPal y cualquier importe sin tapar nada. Legal revisa los iconos de método que quedan a la vista.
- **E4.** Confirmar ese día que el FAQ mantiene el primer mes gratis; si no, el apoyo vuelve a «Te llega en dólares.» y se quita «Tu primer mes es gratis.» del texto.
- **V1 y V2.** Confirmar quién graba y dónde. Solo se dice «aquí» si se graba en la sede de Hialeah.
- **Voz real.** Antes de publicar, confirmar con creadores de Miami que pasan de verdad «¿Cómo te pago?», «te paso mi Zelle», «¿Te puedo pagar por Nequi?», «¿te puedo pagar por transferencia?» y «¿Te puedo pagar con Mercado Pago?».