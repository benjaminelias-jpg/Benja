# HUBS · Métodos de pago · LATAM en general

**Fecha:** 28 de octubre de 2026 · **Campaña:** HUBS · **Conjunto:** LATAM en general

### Análisis

**Perfil**
- **Quién es.** Un creador o creadora que vive en un país de Latinoamérica y ya vende conocimiento online: cursos, mentorías, coaching, comunidades o membresías. Vive allí; no es un nómada de paso.
- **De dónde es.** Entre los productores de Hotmart de la América Latina hispana, Colombia es el primer país de origen. Le siguen México, Argentina y Perú. Con Chile, Ecuador y Bolivia suman el 85 % de la base (dplnews, fuerza media).
- **Tamaño.** Tiene una audiencia pequeña: el 74 % de los productores principiantes, los que facturan menos de 250.000 USD al año, tiene «hasta 50,000 seguidores» (El Cronista, medio). Cierra por llamada, DM o WhatsApp, a menudo con setter y closer (Workana, débil).
- **Vende fuera de su país.**
  - «más del 50% de las transacciones de productos digitales ocurre entre distintos países» (dplnews, medio).
  - «El 70 por ciento de los creadores de la región vende en el extranjero» (dplnews 2024, medio).
  - En México, «cerca de una de cada cinco» ventas va a EE. UU. (El Financiero). Qué! publica «una de cada 50». Las dos cifras se contradicen y no se ha aclarado cuál vale.
  - También vende a España (Expansión).
- **Comprador.** Suele tener entre 40 y 59 años. El 78 % compra desde el móvil y el 89,9 % de las ventas son compras únicas (dplnews 2024).
- **Picos de venta.** Jueves y viernes, y octubre y noviembre por el Black Friday (débil).

**Situaciones reales de cobro**

| # | Situación | Evidencia | Fuerza |
|---|---|---|---|
| S1 | El creador vive donde Stripe no existe | En Latinoamérica, Stripe solo admite cuentas de México y Brasil (stripe.com/global). Argentina, Chile, Colombia, Perú y Uruguay no lo tienen (dev.to) | Fuerte |
| S2 | El alumno no tiene tarjeta o se la rechazan | Compradores en Domestika: «denegado», «RECHAZADO». Adultos con tarjeta de crédito: Colombia 8,7 %, Perú 12,6 %, México 14,2 % (Findex 2025, vía Localpayment) | Fuerte (son voces de compradores) |
| S3 | El cliente de México paga en efectivo en el OXXO | «el 10% de las compras online todavía se liquida en efectivo» (Xataka y BBVA). Se paga con una referencia de 14 a 16 dígitos (Tiendanube) | Medio |
| S4 | El cliente de Colombia paga por PSE o con Nequi | PSE concentra el 63,9 % de las transacciones del e-commerce (Forbes Colombia, CCCE). Nequi tiene 25 M de usuarios (El Colombiano) | Fuerte |
| S5 | El alumno de Perú pregunta «¿te yapeo?» | Yape tiene unos 15,9 M de usuarios activos al mes (Perú Retail) y «yapear» ya es verbo (UDEP). La web de Kunfupay lista Yape para Perú (kunfupay.com/cobros-global) | Medio |
| S6 | El link de Mercado Pago no cobra a clientes de otro país | La cuenta solo acepta compradores «that have an account in the same country» (Mercado Pago Developers) | Medio |
| S7 | Cliente en España que quiere pagar con Bizum | Bizum funciona solo con cuentas españolas o andorranas y tiene 31,5 M de usuarios (bizum.com/es/en/). Stripe no lo acepta en ninguna cuenta latinoamericana (docs.stripe.com) | Medio (dolor deducido de los requisitos, sin citas de creadores) |
| S8 | Hotmart limita los métodos locales | Excluye Mercado Pago de suscripciones, order bump y embudos. A compradores de Brasil solo les ofrece tarjeta y Pix, y en Venezuela solo tarjeta extranjera en USD (centro de ayuda de Hotmart) | Fuerte |

**Citas literales**
1. «No hay manera de usar Stripe desde argentina ¿no?». Irina Sternik (@Ladob), creadora, Argentina, 24-12-2023. https://x.com/Ladob/status/1739003225745879320 (vista en el índice del buscador).
2. «La historia de Stripe, con su lista de países limitados, me frustraba.» Jonathan Rengifo, creador de comunidades en Skool, Colombia, 22-03-2026. https://jrengifo.com/skool-stripe-express-pagos-latinoamerica
3. «En mi País aun no esta disponible Stripe y llevo mas de 3 años con la esperanza que lo habiliten». Charry, ForoBeta, 24-05-2018. https://forobeta.com/temas/alternativas-de-pagos-online-stripe-y-payoneer.650464/
4. «no cuento con tarjeta de crédito ni débito». galanzav19, comprador, México, 01-08-2020. https://www.domestika.org/es/forums/2-domestika/topics/99177-pagar-un-curso-de-domestika
5. «No he podido realizar el pago porque me dice que es "RECHAZADO".» pauul2801, comprador que intentaba pagar con Nequi, Colombia, 12-05-2020. Misma URL de Domestika.
6. «Integrar pasarelas de pago siempre es un tema en Argentina». Mauro Casas (@maurohouseless), 07-10-2025. https://x.com/maurohouseless/status/1975371281311609175 (índice del buscador).

No hay testimonios recientes de creadores que cuenten una venta perdida al cobrar. Por eso ningún anuncio usa testimonios.

**Qué usa hoy**

| Herramienta | Qué ya le resuelve | Qué no le resuelve | Fuente |
|---|---|---|---|
| Hotmart | Dice tener «más de 30» o «más de 40» métodos: OXXO, SPEI, Mercado Pago, PSE, Nequi, Yape, Pix y Bizum. «Cada comprador paga como está acostumbrado» | Mercado Pago no funciona en suscripciones, order bump ni embudos. SPEI y PSE no funcionan en order bump, embudo ni combo. Brasil: solo tarjeta y Pix. Venezuela: solo tarjeta extranjera. Tampoco cubre lo que se vende fuera de su checkout (DM, llamada) | help.hotmart.com ; hotmart.com/mx/herramientas/internacionalizacion |
| Stripe | Solo en México y Brasil. La cuenta mexicana ya acepta OXXO | No existe en el resto de la región. La cuenta mexicana no acepta Bizum ni Pix | stripe.com/global ; docs.stripe.com |
| PayPal | Cobrar a quien tiene PayPal | No es OXXO, Nequi ni Yape. Cobra un 3,5 % sobre el tipo de cambio base | paypal.com/mx |
| Link de Mercado Pago | Cobro local por WhatsApp | Solo en moneda local y a compradores del mismo país | mercadopago.com.mx ; mercadopago.com.ar/developers |
| Payoneer | Cobrar a empresas | «No puedes solicitar pagos a consumidores… no está pensado para usarse como pasarela de pago» | payoneer.com/es/get-paid-by-clients/payment-request/ |
| Wise | Que te pague una empresa | El cobro con tarjeta está cerrado a nuevos clientes de empresa y no tiene métodos locales latinoamericanos | wise.com/es/business/accept-card-payments/ |
| Skool, Kajabi, dLocal Go | Comunidades y cursos; dLocal Go dice tener «más de 250 métodos» | Skool: «Members pay in USD». Kajabi: sin métodos locales. dLocal Go: paga en la moneda del país de tu empresa y no cubre España | help.skool.com ; kajabi.com ; dlocalgo.com |

Lo que **no se promete** en estos anuncios:
- A quien vende con Hotmart: OXXO, SPEI, PSE, Nequi, Yape, Mercado Pago ni Bizum como novedad.
- A quien tiene Stripe en México: «por fin OXXO».
- Ventaja por número de métodos: la web de Kunfupay da cuatro cifras distintas (+100, +180, 8+ y «15+ países»).

**Objeciones y respuesta verdadera**
- **«Ya vendo con Hotmart».** Es cierto que ya tiene métodos locales. Kunfupay le da un enlace propio para lo que vende por DM o por llamada.
- **«Con PayPal me basta».** PayPal es un método más, pero no es el de quien paga con OXXO o Nequi. Con Kunfupay, el cliente puede seguir pagando con PayPal.
- **«Para cobrar fuera necesito Stripe».** En Latinoamérica solo existe en México y Brasil. El ancla «igual que con Stripe» solo funciona en piezas para México.
- **«Mis clientes pagan con tarjeta».** En el e-commerce de Colombia manda PSE (63,9 %). Las billeteras y los pagos de cuenta a cuenta suman el 46 % del e-commerce de la región (PCMI, vía Revista EyN).
- **«Con el link de Mercado Pago ya cobro».** Solo le cobra a clientes de su propio país.
- **«Ya tengo Payoneer o Wise».** Le sirven para cobrar a empresas, no para que un alumno pague con su método local.
- **«Mis alumnos no saben de cripto».** No hace falta: la cripto es una opción, no un requisito.
- **«¿Cuánto cobra?».** No hay un porcentaje público («precio a medida»). Nada de «más barato» ni «sin comisiones».
- **«¿Es un banco?».** No. Se responde en el cierre fijo de cada anuncio.
- **«¿Funciona en mi país?».** La web dice «Presencia activa en España y toda América Latina» y revisa cada cuenta antes de activarla.

**Lenguaje del hub**
- **Detalles de insider:**
  - México: la referencia del OXXO, que se paga en caja y deja ticket; SPEI.
  - Perú: «¿te yapeo?» (no sale en estas piezas).
  - Colombia: PSE y Nequi.
  - Argentina: el pago con QR (lo usa el 84 %) y Mercado Pago.
  - España: Bizum.
- **Jerga del gremio:** lanzamiento, carrito abierto, evergreen, setter, closer, high ticket, productor y afiliado.
- **Escenas que suenan de allí:** el cliente que manda la foto del ticket del OXXO; el comprador de Texas o Madrid que le compra a un creador mexicano; el pico del Black Friday.
- **Qué evitar:**
  - Postales de nómada (laptop en la playa, Tulum).
  - Regionalismos como plata, lana, varo, guita, parce, güey, che o el voseo: mejor «dinero».
  - «LATAM» como palabra de consumo: mejor nombrar países.
  - «Dólar blue» y «cepo».
  - Clichés de pobreza: no «no tiene dinero», sino «paga con lo que usa».
  - Día sin IVA, Hot Sale y meses sin intereses.
  - La maqueta de chat «te mando el link / listo».
  - «Un pago rechazado es una venta perdida» (lo usa dLocal Go).
  - «Sin comisiones», «100 % seguro» y «Kunfupay cobra por ti».
  - Bre-B, Efecty, Zelle y Venmo, que no están en Kunfupay.
  - Lo que repite la competencia del hub: «0 %», «gratis», «del exterior», «freelancer», «sin fronteras», «más formas de pagar», «más alumnos», «métodos locales» sin decir cuáles, «alumnos en varios países», «se complican para pagarte», «tu cliente te paga» (sin nombrar el método), «dólares o euros» y los títulos del tipo «Cobra a … del exterior / sin fronteras».

### Ángulo del hub

**Vendes desde tu país a clientes de otros países. Cada uno paga con lo que se usa en el suyo, y tus herramientas de cobro no pasan de la frontera. Con un solo enlace de Kunfupay, cada cliente paga con su método y a ti te llega en euros o en dólares.**

Por qué (evidencia):
- **Vende fuera.** Más del 50 % de las transacciones son entre países y el 70 % de los creadores vende en el extranjero (dplnews).
- **Sus herramientas se paran en la frontera.**
  - Stripe solo existe en México y Brasil (stripe.com/global).
  - El link de Mercado Pago solo cobra a compradores del mismo país.
  - Payoneer «no está pensado para usarse como pasarela de pago».
  - Ninguna cuenta latinoamericana de Stripe acepta Bizum (docs.stripe.com/payments/bizum).
- **El cliente paga en local.** PSE tiene el 63,9 % del e-commerce colombiano y Nequi, 25 M de usuarios. En México, el 10 % de las compras online se paga en efectivo, con la referencia del OXXO.
- **Queda un hueco libre.** Nadie ofrece un mismo enlace para clientes de Latinoamérica, España y EE. UU. Hotmart solo lo cubre dentro de su checkout y dLocal Go no cubre España.
- **Límites.**
  - A quien vende con Hotmart no se le promete OXXO, Nequi ni Bizum como novedad.
  - A quien tiene Stripe en México no se le promete OXXO.
  - No se compite por número de métodos.
  - La moneda va solo como apoyo, nunca como gancho.

### Lo que anuncia la competencia aquí

Biblioteca de anuncios de Meta, 28-10-2026: 50 anuncios activos de 14 anunciantes en México, Colombia, Argentina, Perú, Chile y Ecuador.
- **Quién se anuncia.** 38 anuncios son de billeteras o cuentas en USD (Takenos, Global66, Wallbit, ARQ, GrabrFi, Higlobe y Polar). Hay 5 de dLocal Go, 5 de consultoras de LLC con Stripe (Zenda, Lazo, Legal Zelo y Nexus) y 2 de plataformas de cursos. Hotmart, Payoneer, Wise, PayPal y Stripe no tienen anuncios activos en estos países.
- **Lo que más tiempo lleva activo** (se mide por días y versiones, porque la Biblioteca no muestra el gasto):
  - Wallbit, 76 días, vídeo de app: «No hace falta ser un experto ni entender de finanzas». ID 1521446519290484, https://www.facebook.com/ads/library/?id=1521446519290484
  - ARQ, 56 días, relanzado con el mismo texto: «Con ARQ, solo 3USDc fijos». ID 27760625053633092, https://www.facebook.com/ads/library/?id=27760625053633092
  - GrabrFi, 48 días, el estático que más dura: un pósit escrito a mano. ID 4180912678875904, https://www.facebook.com/ads/library/?id=4180912678875904
  - Takenos, 43 días: «Facturaste USD 2.000. ¿Cuánto te llegó?». ID 1052965464390781, https://www.facebook.com/ads/library/?id=1052965464390781
- **Qué está saturado.**
  - Las promesas «0 % comisión», «gratis», «cobra en dólares», «cuenta en EE. UU. a tu nombre» y «sin intermediarios».
  - Las tablas de comisiones con logos de otras marcas (Global66 e Higlobe).
  - «¿Recibís pagos en Payoneer?»: Global66 tiene más de 10 anuncios con ese gancho.
  - «Stripe no está disponible en tu país», con una LLC como solución (Legal Zelo).
  - La foto de una persona sonriendo con portátil, y el morado con pegatina de «0 %» (Takenos).
- **El que más se acerca.** dLocal Go publica desde hoy «Más formas de pagar, más alumnos» (ID 1639884637883776, https://www.facebook.com/ads/library/?id=1639884637883776). No nombra ningún método y usa una foto de banco de imágenes.
  - También: dLocal Go «Tenés tu LLC, tus alumnos en varios países y una reputación que cuidar» (1433287178199921); dLocal Go «Vendiste tu mentoría. El cliente pagó. ¿Y si la plataforma te congela el cobro justo ahí?» (1639884637883776); dLocal Go «Ofrece los métodos de pago en los que tus clientes ya confían» (1107810341873164); Takenos Perú «¿Tus clientes del exterior se complican para pagarte?» (887661997669937).
- **El hueco que ocupamos.** Entre los 50 anuncios leídos, nadie nombra OXXO, Nequi ni Mercado Pago. No se buscaron por nombre y la búsqueda no cubre España, así que Bizum está sin comprobar. Nadie pone en el centro al alumno que paga ni enseña la pantalla de pago real. Nadie junta varios países en una pieza. Casi todos le hablan al freelancer, no a quien vende cursos o mentorías.
- **Qué cambié por eso:**
  - V1: ya no nombra Stripe. El gancho es la pregunta del alumno, «¿Te puedo pagar en el OXXO?», y la lista de países es la de un tutorial cualquiera.
  - V2: quité Payoneer, que es terreno de Global66. Ahora desmonta con datos la idea de que el alumno paga con tarjeta.
  - E1 y E2: fondo blanco y sin bloques morados con texto blanco. Quité la pegatina sobre morado (recuerda a Takenos) y los checks sobre fondo crema (recuerdan a Zenda).
  - E3: dos pantallas reales de la app. Las flechas señalan el método y el país, nunca el importe, porque Takenos ya usa el aviso «$500 recibidos».
  - E4 y los títulos de G1, G2, V1, V2, E1, E2 y E4 nombran los métodos y nunca dicen «métodos locales» en abstracto, que es lo que hace dLocal Go. E3 se queda con «pantallas reales», otro hueco.

### Los 8 anuncios

Los 4 conjuntos salen a la vez, con los mismos 8 huecos y nunca con menos de 8 anuncios.

| Pieza | Nombre en Meta | Nivel | Tipo | Persona | Emoción | Gancho | Formato |
|---|---|---|---|---|---|---|---|
| G1 | HUB-LATAM-G1 \| N2 \| Dolor \| Vende por llamada \| VIDEO-LLAMADA | N2 | Dolor | Coach o mentor que cierra por llamada | Frustración | «Tu cliente de Bogotá ya dijo que sí. Y te pregunta: «¿Te pago con Nequi?».» | Vídeo ya grabado (llamada), sin cambios; solo cambia el texto del anuncio |
| G2 | HUB-LATAM-G2 \| N3 \| Mecanismo \| Quiere entender cómo funciona \| VIDEO-PANTALLAS | N3 | Mecanismo | Creador que vende por WhatsApp y quiere entender cómo funciona | Curiosidad | «Así cobras por WhatsApp a alumnos de Guadalajara, Medellín o Sevilla.» | Vídeo ya grabado (pantallas de la app), sin cambios; solo cambia el texto del anuncio |
| V1 | HUB-LATAM-V1 \| N2 \| Dolor \| Creador en CO, AR o PE con alumno en MX \| VIDEO-HISTORIA | N2 | Dolor (historia) | Creador que vende por su cuenta desde Colombia, Argentina o Perú y tiene alumnos en México | Impotencia → alivio | «Si vendes cursos desde Colombia, Argentina o Perú, esto ya lo viviste.» En pantalla: «Si vendes cursos desde Colombia, Argentina o Perú» / «¿Te puedo pagar en el OXXO?» | UGC en tercera persona, ≤ 240 palabras, un plano de IA en el gancho, subtítulos quemados |
| V2 | HUB-LATAM-V2 \| N2-N3 \| Creencia \| Cree que su alumno paga con tarjeta \| REEL-CAMARA | N2–N3 (puente) | Creencia | Mentor que vende a México y Colombia y da por hecho que su alumno paga con tarjeta | Sorpresa | «Si vendes cursos a México o Colombia, quizá pienses esto: "Si de verdad lo quiere, me paga con tarjeta."» | Reel a cámara, equipo en estudio («nosotros»), datos en tipografía, subtítulos quemados, ≤ 200 palabras |
| E1 | HUB-LATAM-E1 \| N2 \| Dolor \| Creador MX con Stripe que vende a ES \| EST-TITULAR | N2 | Dolor distinto | Creador en México que cobra con Stripe y vende a España | Incomodidad | «*Si cobras con Stripe desde México,* Madrid no puede pagarte con Bizum.» | Pregunta de la alumna en tipografía y titular, sobre blanco |
| E2 | HUB-LATAM-E2 \| N3 \| Comparativa \| Productor Hotmart con mentoría por DM \| EST-HOY-VS-CON | N3 | Comparativa | Productor de Hotmart que cierra la mentoría por DM | Alivio (no tiene que dejar Hotmart) | «*Si vendes en Hotmart,* cobra tu mentoría por DM como el curso.» | «Hoy / con Kunfupay» en dos niveles, sobre blanco |
| E3 | HUB-LATAM-E3 \| N4 \| Prueba \| Mentor con alumnos en CO y ES \| EST-CAPTURA-ANOTADA | N4 | Prueba | Mentor con alumnos en Colombia y España | Confianza | «*Alumnos en Colombia y España:* así te pagan con tu enlace.» | Dos páginas de pago reales (Colombia y España), anotadas |
| E4 | HUB-LATAM-E4 \| N5 \| Oferta \| Infoproductor que vende a varios países \| EST-LIMPIA-BOTON | N5 | Oferta | Infoproductor que vende a varios países | Decisión | «*¿Alumnos en Monterrey, Bogotá o Madrid?* Un enlace: OXXO, Nequi o Bizum.» | Imagen limpia con «Registrarte ↓» hacia el botón real |

### Genéricos: texto del anuncio para este hub

#### G1 · «¿Cómo te pago?» (vídeo ya grabado)

**Nombre en Meta:** `HUB-LATAM-G1 | N2 | Dolor | Vende por llamada | VIDEO-LLAMADA`

Texto principal:
```text
Tu cliente de Bogotá ya dijo que sí.
Y te pregunta: «¿Te pago con Nequi?».

Si cierras mentorías por llamada, te suena:
No tiene tarjeta de crédito.
Lo que tiene son pesos en su banco.
Y la llamada termina sin pago.

PERO le cobras con un solo enlace de Kunfupay.
Y cada cliente elige cómo pagarte:
→ en Colombia, con transferencia desde su banco, en pesos, o con Nequi
→ en México, por SPEI o en el OXXO

Y si alguno prefiere pagarte en cripto, también.

A ti te llega en euros o en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** Tu cliente de Bogotá te paga con Nequi
- **Descripción:** Transferencia, Nequi, SPEI u OXXO.
- **Botón:** Registrarte

#### G2 · «Infografía» (vídeo ya grabado)

**Nombre en Meta:** `HUB-LATAM-G2 | N3 | Mecanismo | Quiere entender cómo funciona | VIDEO-PANTALLAS`

Texto principal:
```text
Así cobras por WhatsApp a alumnos de Guadalajara, Medellín o Sevilla.

Cada uno paga distinto en su país.
PERO tú solo necesitas un enlace:
→ Creas tu producto en Kunfupay.
→ Sacas tu enlace.
→ Te lo piden por WhatsApp y se lo mandas.
→ Tu alumno de Guadalajara te paga en el OXXO o por SPEI.
→ El de Medellín, con Nequi.
→ La de Sevilla, con Bizum.

Y si alguno prefiere pagarte en cripto, también.

A ti te llega en euros o en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** OXXO en Guadalajara, Bizum en Sevilla
- **Descripción:** Creas el producto, sacas el enlace y lo mandas.
- **Botón:** Registrarte

### Vídeos personalizados

> **Versión para grabar de V1:** `GUIONES-HUBS.md`, apartado 1, con ganchos alternativos. Allí los insertos usan la página de pago real. Los avisos de «Nueva venta» (pantalla b) llevan en el vídeo original la nota «Simulación. Cifras a modo de ejemplo.». Si un guion de aquí los usa, van con esa nota visible o se cambian por la página de pago real.

#### V1 · El OXXO y la lista de países

**Nombre en Meta:** `HUB-LATAM-V1 | N2 | Dolor | Creador en CO, AR o PE con alumno en MX | VIDEO-HISTORIA`

**Quién lo graba y set:**
- **Quién:** un creador o creadora UGC que no dice dónde vive y habla de Kunfupay en tercera persona.
- **Dónde:** graba a cámara en el escritorio de su casa.
- **Plano de IA:** uno solo, en el gancho. Es una calle normal de Bogotá, Buenos Aires o Lima por la mañana (se elige una), sin postal turística.
- **Texto en pantalla desde el segundo 0,** en dos líneas: «Si vendes cursos desde Colombia, Argentina o Perú» / «¿Te puedo pagar en el OXXO?». La pregunta va en tipografía grande, sin burbuja de chat ni interfaz.
- **Subtítulos:** quemados en todo el vídeo, frase a frase, con «PERO» y «bajaaas» resaltados.
- **Marcas:** no salen el logo ni la web de Stripe, y el OXXO no sale con logo. El desplegable del inserto es genérico, sin marca.

**Guion (teleprompter)**
```text
[Plano de IA: calle cotidiana del hub. Texto en pantalla desde el segundo 0]
Si vendes cursos desde Colombia, Argentina o Perú, esto ya lo viviste.

[A cámara]
Un alumno de Monterrey te escribe: «¿Te puedo pagar en el OXXO?».
Quiere entrar hoy.
Y tú no sabes cómo aceptarlo.

Ves un tutorial para cobrar a otros países.
Minuto dos: «elige tu país».
Abres la lista.
[Inserto: un dedo baja por un desplegable de países sin marca; el suyo no aparece]
Bajas.
Y bajaaas.
El tuyo no está.

Preguntas en un grupo de creadores.
Siempre la misma respuesta: en tu país, no.

Y mientras, tu alumno de Monterrey espera.
Su compañera de Guadalajara quiere pagarte por SPEI.
Y tú no aceptas ni lo uno ni lo otro.

PERO para cobrarles no necesitas estar en esa lista.
Les cobras con un solo enlace de Kunfupay.

El de Monterrey te paga en el OXXO, con su referencia.
La de Guadalajara, por SPEI.
Y el que quiera, con tarjeta o transferencia desde su banco.
[Toma aparte, con pausa antes y después, y subtítulo propio que no enlace con la frase anterior ni con la siguiente, para poder cortarla sin rehacer el vídeo]
Y si alguno prefiere pagarte en cripto, también.
A ti te llega en euros o en dólares.

Entra y mira si tu negocio encaja.
```

**Texto del anuncio**

Texto principal:
```text
Si vendes cursos desde Colombia, Argentina o Perú, esto ya lo viviste.
Un alumno de Monterrey te escribe: «¿Te puedo pagar en el OXXO?».

Buscas cómo aceptarlo.
El tutorial que ves te pide elegir tu país.
Y el tuyo no está en la lista.

Mientras, tu alumno espera.
Y su compañera de Guadalajara quiere pagarte por SPEI.

PERO para cobrarles no necesitas estar en esa lista.

Les cobras con un solo enlace de Kunfupay.
Y cada uno paga con lo que usa en su país:
→ México: OXXO o SPEI
→ España: Bizum
→ y quien prefiera, tarjeta o transferencia desde su banco

Y si alguno prefiere pagarte en cripto, también.

A ti te llega en euros o en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** Que tu alumno de Monterrey te pague en OXXO
- **Descripción:** OXXO, SPEI, Bizum, tarjeta o transferencia.
- **Botón:** Registrarte

---

#### V2 · «Me paga con tarjeta»

**Nombre en Meta:** `HUB-LATAM-V2 | N2-N3 | Creencia | Cree que su alumno paga con tarjeta | REEL-CAMARA`

**Quién lo graba y set:**
- **Quién:** el equipo de Kunfupay en estudio, a cámara, hablando en «nosotros». Es un reel vertical.
- **Texto en pantalla desde el segundo 0:** «Si vendes cursos a México o Colombia».
- **La creencia:** «Si de verdad lo quiere, me paga con tarjeta.», entre comillas, en tipografía grande sobre fondo blanco.
- **Los datos:** en tipografía grande sobre fondo liso, con la cifra en morado #734BFC y la fuente en pequeño debajo. Las fuentes son «Global Findex 2025, Banco Mundial» para las tarjetas, «Xataka» para el efectivo en México y «CCCE» para los pagos desde el banco en Colombia.
- **Subtítulos:** quemados en todo el reel, frase a frase, con «PERO» resaltado.
- **Marcas:** OXXO, SPEI y Nequi solo en voz y subtítulo, sin logos. No se habla de comisiones de nadie.

**Guion (teleprompter)**
```text
[Texto en pantalla desde el segundo 0]
Si vendes cursos a México o Colombia, quizá pienses esto:
«Si de verdad lo quiere, me paga con tarjeta.»

[Datos en tipografía a pantalla completa, con la fuente debajo]
En México, 14 de cada 100 adultos tienen tarjeta de crédito.
En Colombia, menos de 9 de cada 100.

[A cámara]
Tu alumno sí quiere el curso.
Paga con lo que usa en su país.
En México, 1 de cada 10 compras online se paga en efectivo.
En Colombia, casi 2 de cada 3 se pagan desde su banco.

PERO le puedes cobrar con un solo enlace de Kunfupay.
Lo hicimos justo para eso.
Y cada alumno elige cómo pagarte.

En México, en el OXXO o por SPEI.
En Colombia, con transferencia desde su banco o con Nequi.
Y quien la tenga, con tarjeta.
[Toma aparte, con pausa antes y después, y subtítulo propio que no enlace con la frase anterior ni con la siguiente, para poder cortarla sin rehacer el vídeo]
Y si alguno prefiere pagarte en cripto, también.

A ti te llega en euros o en dólares.

Entra y mira si tu negocio encaja.
```

**Texto del anuncio**

Texto principal:
```text
Si vendes cursos a México o Colombia, quizá pienses esto:
«Si de verdad lo quiere, me paga con tarjeta.»

En México, 14 de cada 100 adultos tienen tarjeta de crédito.
En Colombia, menos de 9 de cada 100.
Fuente: Global Findex 2025, Banco Mundial.

Tu alumno paga con lo que usa en su país.
En México, 1 de cada 10 compras online se paga en efectivo.
En Colombia, casi 2 de cada 3 se pagan desde su banco.
Fuentes: Xataka y CCCE.

PERO le puedes cobrar con un solo enlace de Kunfupay.
Y cada alumno elige cómo pagarte:
→ en México, en el OXXO o por SPEI
→ en Colombia, con transferencia desde su banco o con Nequi
→ y quien la tenga, con tarjeta

Y si alguno prefiere pagarte en cripto, también.

A ti te llega en euros o en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** Tu alumno paga en el OXXO o con Nequi
- **Descripción:** OXXO, SPEI, Nequi, transferencia o tarjeta.
- **Botón:** Registrarte

### Estáticos personalizados

> **Ya están hechos.** Los 4 estáticos de este hub están en `estaticos/`, en 1080×1350 (feed) y 1080×1920 (Stories). Las especificaciones de abajo fueron el brief de diseño. Donde el archivo final no coincide al píxel, manda el archivo. E3 cambió de pantallas: el motivo está en su apartado.

Común a E1–E4: tipografía Plus Jakarta Sans. Paleta: morado de marca #734BFC, morado oscuro #260D68, blanco #FFFFFF y grises #F1F1F4 (claro), #E4E4EA (bordes), #8A8A99 (medio) y #4A4A57 (oscuro). En 1080×1920 no va texto en los 250 px de arriba ni en los 340 px de abajo. El logo de Kunfupay no cuenta como palabra.

#### E1 · La alumna de Madrid y el Bizum

**Nombre en Meta:** `HUB-LATAM-E1 | N2 | Dolor | Creador MX con Stripe que vende a ES | EST-TITULAR`

**Especificación para diseño**
- **Formatos:** 1080×1350 y 1080×1920.
- **Colores:**
  - Fondo blanco #FFFFFF.
  - Pregunta en gris #8A8A99, con las comillas latinas en #734BFC.
  - Titular en #260D68, con el filtro en #734BFC.
  - Cierre sin banda: «Con Kunfupay, sí.» en #734BFC sobre blanco, con una línea de 6 px #734BFC encima, y el logo de Kunfupay en #260D68.
- **Tipografía:**
  - Pregunta en Bold, 72 px.
  - Titular en ExtraBold, 88 px, con interlineado 1,1 y alineado a la izquierda.
  - Filtro en ExtraBold Italic, 76 px.
  - Cierre en ExtraBold, 64 px.
- **Composición en 1080×1350** (márgenes laterales de 80 px):
  1. Arriba (y 140–330): la pregunta de la alumna, con comillas latinas a 1,4 veces el tamaño del texto. Sin burbuja, sin avatar y sin hora.
  2. Centro (y 400–960): el titular, en cuatro líneas como máximo, ocupando todo el ancho útil.
  3. Abajo (y 1130–1290): línea de 6 px #734BFC a todo el ancho útil y, debajo, «Con Kunfupay, sí.» a la izquierda y el logo de Kunfupay en #260D68, de 120 px de ancho, a la derecha.
- **Composición en 1080×1920:** el mismo orden. La pregunta va en y 280–480 y el titular en y 560–1180. La línea y el cierre van entre y 1400 y 1540; de y 1540 hasta abajo, blanco.
- **Texto literal de la imagen** (22 palabras):
  - Pregunta: «¿Te hago un Bizum por el curso?»
  - Titular: «*Si cobras con Stripe desde México,* Madrid no puede pagarte con Bizum.»
  - Cierre: «Con Kunfupay, sí.»
- **No lleva:** logos de Bizum ni de Stripe, interfaz de chat, pegatinas inclinadas, fotos de personas, fondo morado entero ni bloques morados con texto blanco.

**Texto del anuncio**
```text
Si cobras con Stripe desde México, Madrid no puede pagarte con Bizum.

Tu alumna de Madrid te escribe: «¿Te hago un Bizum por el curso?».
En España, Bizum lo usan más de 30 millones de personas.
Buscas la opción en tu Stripe.
Y no está.

No es un ajuste que te falte.
Stripe no acepta Bizum en ninguna cuenta de Latinoamérica.
Fuente: documentación pública de Stripe sobre Bizum, [fecha].

Así que le pides que pague con tarjeta.
Y ahora tiene que levantarse a buscarla.

PERO le puedes cobrar con Kunfupay, igual que con Stripe.
Le mandas tu enlace.
Ella elige Bizum.
Y a ti te llega en euros o en dólares.

Tu alumno de Bogotá usa ese mismo enlace, con Nequi.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** Bizum para tu alumna de Madrid
- **Descripción:** Le mandas tu enlace, como con Stripe.
- **Botón:** Registrarte

---

#### E2 · Hotmart y la mentoría por DM

**Nombre en Meta:** `HUB-LATAM-E2 | N3 | Comparativa | Productor Hotmart con mentoría por DM | EST-HOY-VS-CON`

**Especificación para diseño**
- **Formatos:** 1080×1350 y 1080×1920.
- **Colores:**
  - Fondo blanco #FFFFFF.
  - Titular en #260D68, con el filtro en #734BFC.
  - Franja en #F1F1F4, con texto en #4A4A57.
  - Columna «Hoy» en #F1F1F4, con texto en #8A8A99.
  - Columna «Con Kunfupay» en blanco, con borde de 4 px #734BFC, encabezado en #734BFC y filas en #260D68, y pie en una banda #260D68.
- **Tipografía:**
  - Titular en ExtraBold, 64 px, con el filtro en ExtraBold Italic.
  - Franja en SemiBold, 36 px.
  - Encabezados de columna en Bold, 30 px.
  - Filas en ExtraBold, 44 px.
  - Pie en SemiBold, 32 px.
- **Composición en 1080×1350** (márgenes de 72 px):
  1. Titular arriba (y 72–300), alineado a la izquierda.
  2. Nivel 1 (y 340–430): franja a todo el ancho útil, con esquinas de 20 px y el texto «Tu curso: que siga en Hotmart.». Sin icono de check.
  3. Nivel 2 (y 470–1180): dos columnas separadas por 24 px.
     - A la izquierda, «Hoy»: ocupa el 38 % del ancho y lleva el encabezado arriba y una sola línea centrada en vertical.
     - A la derecha, «Con Kunfupay»: ocupa el 62 % del ancho, tiene esquinas de 24 px y lleva el encabezado, tres filas separadas por líneas de 2 px #E4E4EA y el pie en su banda #260D68, dentro de la tarjeta.
  4. Logo de Kunfupay en #260D68, de 120 px, abajo a la derecha (y 1230).
- **Composición en 1080×1920:** el mismo orden y las mismas dos columnas, con más aire entre filas. El titular va en y 260–520, la franja en y 560–660, las columnas en y 700–1500 y el logo en y 1530.
- **Texto literal de la imagen** (45 palabras):
  - Titular: «*Si vendes en Hotmart,* cobra tu mentoría por DM como el curso.»
  - Franja: «Tu curso: que siga en Hotmart.»
  - Columna «Hoy»: encabezado «Hoy, por DM» y línea «Un solo método: el tuyo.»
  - Columna «Con Kunfupay»: encabezado «Con tu enlace de Kunfupay» y filas «México: OXXO o SPEI» / «Colombia: Nequi» / «España: Bizum»
  - Pie: «Te llega en euros o dólares.»
- **No lleva:** logos de PayPal, de Hotmart ni de métodos de pago, checks, fondo crema ni cifras de comisión.

**Texto del anuncio**
```text
Si vendes en Hotmart, cobra tu mentoría por DM como el curso.

Tu curso, déjalo en Hotmart.
Ahí tu alumno ya paga con lo que usa en su país.

¿La mentoría que cierras por DM la cobras con PayPal?
Solo te paga quien lo tiene.

PERO también le puedes cobrar con tu enlace de Kunfupay.
Tu alumno de México te paga en el OXXO o por SPEI.
La de Colombia, con Nequi.
La de España, con Bizum.
Quien use PayPal, con PayPal.

A ti te llega en euros o en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** Mentoría por DM: OXXO, Nequi o Bizum
- **Descripción:** Tu curso, que siga en Hotmart.
- **Botón:** Registrarte

---

#### E3 · Dos pantallas reales, dos países

**Nombre en Meta:** `HUB-LATAM-E3 | N4 | Prueba | Mentor con alumnos en CO y ES | EST-CAPTURA-ANOTADA`

**Archivos:** `estaticos/HUB-LATAM-E3_1080x1350.png` y `estaticos/HUB-LATAM-E3_1080x1920.png`

**Pantallas que se usan** (reales, sacadas del vídeo de la Infografía, sin retocar):
- La página de pago con «Colombia»: Nequi, PSE, Bancolombia, Mercado Pago, Visa y Mastercard.
- La misma página con «España»: Bizum, Visa, Mastercard, Apple Pay, Google Pay y SEPA.
- **Por qué no México ni los avisos de venta:** en la pantalla de México el logo de OXXO sale cortado, y los avisos de «Nueva venta» llevan en el vídeo la nota «Simulación. Cifras a modo de ejemplo.», así que no pueden ir como «pantallas reales». México ya sale en E1, E2 y E4.

**Texto literal de la imagen** (18 palabras, sin contar el de las pantallas)
- Titular: «*Alumnos en Colombia y España:* así te pagan con tu enlace.»
- Notas: «Colombia: Nequi o PSE» · «España: Bizum»
- Pie: «Pantallas reales.»

**Texto del anuncio**
```text
Alumnos en Colombia y España: así te pagan con tu enlace.

Dos países. Dos formas de pagar.
PERO tú mandas un solo enlace de Kunfupay.

Estas son dos pantallas reales de la app.

En la primera, tu enlace abierto con Colombia elegido.
Tu alumna ve Nequi, PSE, Bancolombia o Mercado Pago.

En la segunda, el mismo enlace con España.
Tu alumno ve Bizum, Apple Pay o Google Pay.

Y los dos, también tarjeta.
A ti te llega en euros o en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** Dos pantallas reales de la app
- **Descripción:** Nequi y PSE en Colombia. Bizum en España.
- **Botón:** Registrarte

---

#### E4 · Oferta con botón

**Nombre en Meta:** `HUB-LATAM-E4 | N5 | Oferta | Infoproductor que vende a varios países | EST-LIMPIA-BOTON`

**Especificación para diseño**
- **Formatos:** 1080×1350 y 1080×1920.
- **Colores:**
  - Fondo blanco #FFFFFF.
  - Titular en #260D68, con el filtro en #734BFC.
  - «Registrarte ↓» en #734BFC.
  - Línea secundaria en #8A8A99.
- **Tipografía:**
  - Titular en ExtraBold, 76 px, alineado a la izquierda, con el filtro en ExtraBold Italic.
  - Línea secundaria en SemiBold, 38 px.
  - «Registrarte ↓» en ExtraBold, 68 px.
- **Composición en 1080×1350** (columna de 900 px, de x 90 a x 990, y mucho aire):
  1. Titular (y 300–640), alineado a la izquierda en x 90, en tres o cuatro líneas.
  2. Línea secundaria (y 690–740).
  3. «Registrarte ↓» (y 1040–1120): texto plano sin caja, sombra ni cursor, apuntando al botón real de Meta.
  4. Logo de Kunfupay, de 120 px, abajo a la derecha (y 1250).
- **Composición en 1080×1920:** la misma columna.
  - Titular en y 420–860.
  - Línea secundaria en y 910–960.
  - «Registrarte ↓» en y 1400–1490, a la altura del pulgar.
  - Logo abajo a la derecha, en y 1520–1560.
- **Texto literal de la imagen** (17 palabras):
  - Titular: «*¿Alumnos en Monterrey, Bogotá o Madrid?* Un enlace: OXXO, Nequi o Bizum.»
  - Línea secundaria: «Tarjeta y PayPal, también.»
  - Indicación: «Registrarte ↓»
- **No lleva:** botón dibujado, personas, móvil, logos de terceros, Hotmart ni precio.

**Texto del anuncio**
```text
¿Alumnos en Monterrey, Bogotá o Madrid? Un enlace: OXXO, Nequi o Bizum.

Cada país paga a su manera.
PERO tú les mandas el mismo enlace de Kunfupay.
El de México paga en el OXXO.
La de Colombia, con Nequi.
El de España, con Bizum.
Y quien prefiera, con tarjeta o PayPal.

Y si alguno prefiere pagarte en cripto, también.

A ti te llega en euros o en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** OXXO, Nequi o Bizum con un solo enlace
- **Descripción:** OXXO, Nequi, Bizum, tarjeta o PayPal.
- **Botón:** Registrarte

### Pagar y retirar dinero en el hub

**Esto no entra en los anuncios de métodos de pago.** El brief de este ángulo prohíbe la tarjeta de Kunfupay y la cuenta como producto. Si se quiere probar, tiene que ir en un ángulo aparte de wallet o tarjeta.

**¿Suele ser un problema?** Sí, pero no donde se suele pensar. Pagar con tarjeta en comercios formales de ciudad funciona bien:
- En Colombia, Visa y Mastercard «se aceptan en toda Colombia en centros comerciales, restaurantes, supermercados y la mayoría de hoteles» (Colombia Move, medio).
- En Buenos Aires se aceptan en Palermo, Recoleta, Puerto Madero y Microcentro «at essentially the market rate» (Travel Currency Guide, medio).

Lo que duele está en tres sitios:

1. **Retirar efectivo con tarjeta extranjera.** Los datos salen de guías de viaje y foros (fuerza media), y las quejas son de viajeros y expatriados, no de creadores.

| País | Coste y límite |
|---|---|
| Colombia | Entre COP 15.000 y unos 30.000 por retiro, frente a COP 4.100–6.500 con tarjeta local. Los topes no coinciden entre fuentes |
| México | Entre 23 y 180 MXN por retiro (BBVA, 197,20 MXN), con límite de 5.000–9.000 MXN |
| Argentina | Tope de unos 100–200 USD por retiro, más 5–11 USD fijos |
| Chile | Tope de 200.000 CLP por retiro |
| Perú | En el Banco de la Nación, normalmente sin comisión para tarjetas extranjeras |
| Ecuador y El Salvador | Entre 0 y 5 USD por retiro, con tope diario de 300–500 USD |

   La conversión dinámica (DCC) suma entre un 5 % y un 12 % (Colombia Move). En Europa, el consumidor paga más en el 99,7 % de los casos, un 7 % de media (BEUC, 2017).

2. **Pasar los dólares a moneda local.**
   - PayPal México cobra un «3.50% por encima del tipo de cambio base» (fuerte).
   - De PayPal a Nequi: un 5 % más IVA, con tope de 12 USD (Xataka Colombia, dato de 2023).
   - Payoneer en Argentina: hasta un 2 % al retirar a banco y 3,15 USD + 1,8 % en cajero (fuerte).
   - En Argentina, los freelancers pierden entre un 3 y un 8,7 % de sus ingresos en tarifas (iProfesional, medio).
3. **El efectivo y los QR, que ninguna tarjeta cubre.**
   - El efectivo es el 40 % del valor en tienda en México, el 32 % en Colombia y el 30 % en Perú (Global Payments Report, vía Publimetro, fuerte).
   - En Colombia, los pequeños comercios cobran con QR de Nequi y Daviplata.
   - En Argentina, «El efectivo sigue siendo el medio de pago preferido» (Wise, medio).

Al residente, que es la mayoría del hub, le duele sobre todo el cambio. Al extranjero o nómada sin cuenta local le duelen el cajero y el cambio.

**¿Sería interesante comunicar la tarjeta en la moneda del lugar?** En conjunto es un beneficio **MEDIO**, y hoy no se puede decir así.

| Para quién | Fuerza | Por qué |
|---|---|---|
| Creador que vive en su país (la mayoría del hub) | Débil a medio | Ya tiene tarjeta local y alternativas: ARQ (antes DolarApp), Revolut (banco en México desde enero de 2026 y con licencia en Colombia), Takenos y la tarjeta de Mercado Pago. Le pesa más pasar los dólares a su moneda |
| Extranjero o nómada sin cuenta local | Medio a fuerte | Retirar es caro y tiene topes, y Wise no da tarjeta en México, Argentina ni Colombia |
| Ecuador, El Salvador y Panamá | Encajaría mejor «gastas tus dólares tal cual» | Solo si la tarjeta es en USD y se emite allí; la web no lo dice |
| Argentina | Medio | Sin hablar de «blue» ni de «cepo» |
| Venezuela | Sin confirmar | Las sanciones impiden nombrarla mientras no haya una respuesta clara |

Por qué hoy no se puede decir «en la moneda del lugar»:
- **Moneda:** la web de Kunfupay presenta una Visa «100% digital» para pagar online y, con Apple Pay o Google Pay, en tienda. Las maquetas salen en USD, pero no dice en qué moneda está la tarjeta.
- **Tarjeta física:** la página de la wallet dice «Próximamente» y el FAQ dice «virtual y física». Se contradicen.
- **Cajeros:** la web no habla de cajeros de forma explícita. Menciona «Efectivo en +200 países» y, en la wallet, «En efectivo — Al instante», pero no dice si se retira en cajero o en una red de pago en efectivo, ni con qué coste.
- **Comisión de cambio:** el FAQ dice «sin… pagar comisiones de conversión» y, en otra parte, «Solo pagas cuando realizas una transacción que implique conversión de divisa».
- **Cómo funciona por dentro (interpretación, fuerza media):** uno de los partners es Bridge, cuyas Visa con saldo en stablecoins convierten a moneda local en cada pago. Lo más probable es que la tarjeta gaste desde un saldo en USD y convierta al pagar, y no que sea una tarjeta en pesos o soles.

Lo único que respalda hoy la web es esta frase: «Pagas con tu Visa digital desde tu saldo: online y, con Apple Pay o Google Pay, en tienda.». La web no dice en qué países se emite la tarjeta ni si se bloquea fuera del país emisor. Para el residente conviene probar también «Retiras a tu banco local, en la moneda de tu país», como lo dice el FAQ, aunque no detalla países, vía ni coste.

**Lo que la web no aclara:**
- Si el partner emisor da la tarjeta a residentes de cada país de la región.
- En qué moneda está la tarjeta y qué margen de cambio aplica en MXN, COP, ARS, CLP y PEN.
- Si existe la tarjeta física, si permite sacar dinero en cajero y con qué coste.
- Si funciona con Apple Pay y Google Pay en cada país.
- Si se bloquea fuera del país emisor.
- Si se puede retirar a una cuenta local en moneda local (SPEI, PSE o una cuenta argentina), en qué países y con qué coste.

### Fuentes

**Perfil y mercado**
- https://dplnews.com/colombia-lidera-la-economia-de-creadores-en-hispanoamerica-en-un-mercado-que-entra-en-fase-de-escala/
- https://dplnews.com/?p=228050
- https://www.cronista.com/mexico/finanzas-economia/no-necesitas-millones-de-seguidores-el-negocio-que-se-multiplicara-por-9-en-latinoamerica-hotmart/
- https://www.cronista.com/mexico/finanzas-economia/de-influencers-a-microempresas-mexico-ya-exporta-conocimiento-digital-al-mundo/
- https://expansion.mx/tecnologia/2026/02/05/creadores-sin-millones-de-fans-ya-facturan-hasta-250-000-dolares-al-ano
- https://www.elfinanciero.com.mx/opinion/colaborador-invitado/2026/06/01/la-economia-de-creadores-se-consolida-como-motor-economico-en-america-latina/
- https://www.que.es/2026/06/19/economia-creadores-latam-hotmart/
- https://www.workana.com/es/job/contratacion-de-setters-para-lanzamientos-de-infoproductos
- https://escuelanomadadigital.com/formula-de-lanzamiento/

**Situaciones de cobro y métodos locales**
- https://stripe.com/global
- https://dev.to/panchei/stripe-isnt-available-in-37-of-85-countries-we-checked-here-is-who-pays-out-there-2026-data-lpd
- https://docs.stripe.com/payments/bizum
- https://docs.stripe.com/payments/oxxo
- https://www.domestika.org/es/forums/2-domestika/topics/99177-pagar-un-curso-de-domestika
- https://localpayment.com/en/resources/market-data/
- https://www.bbvaresearch.com/wp-content/uploads/2026/08/2026-08-25_Tenencia_Deb_y_Cred_Endutih.pdf
- https://www.xataka.com.mx/comercio-electronico/tiendas-online-mexico-pueden-perder-ventas-algo-que-no-consideraron-no-aceptar-pagos-efectivo
- https://www.tiendanube.com/mx/blog/como-cobrar-en-oxxo/
- https://forbes.co/2025/08/22/economia-y-finanzas/e-commerce-en-colombia-estadisticas-clave-2025/
- https://www.elcolombiano.com/negocios/nequi-resumen-financiero-2025-como-mueven-plata-25-millones-usuarios-HH28857022
- https://www.peru-retail.com/credicorp-destaca-crecimiento-de-yape-tras-llegar-a-mas-de15-millones-de-usuarios-activos-mensuales/
- https://www.udep.edu.pe/castellanoactual/yape-y-yape/
- https://www.mercadopago.com.ar/developers/en/docs/resources-faqs/payments
- https://www.eleconomista.es/actualidad/noticias/11430085/10/21/Puedo-usar-Bizum-fuera-de-Espana-Estos-son-los-requisitos-para-enviar-o-recibir-dinero-en-el-extranjero.html
- https://bizum.com/es/en/press-area-2/
- https://bizum.com/es/en/
- https://www.revistaeyn.com/finanzas/billeteras-digitales-representan-46-del-volumen-del-comercio-electronico-en-latinoamerica-LE31420920
- https://www.forbesargentina.com/negocios/cambio-habito-masivo-55-e-commerce-argentino-ya-paga-billeteras-digitales-n90789

**Citas**
- https://x.com/Ladob/status/1739003225745879320
- https://jrengifo.com/skool-stripe-express-pagos-latinoamerica
- https://forobeta.com/temas/alternativas-de-pagos-online-stripe-y-payoneer.650464/
- https://x.com/maurohouseless/status/1975371281311609175

**Competencia y herramientas actuales**
- https://help.hotmart.com/es/article/25588460435085/
- https://help.hotmart.com/es/article/20545369199117/
- https://hotmart.com/mx/herramientas/internacionalizacion
- https://hotmart.com/mx/herramientas/pasarela-de-pagos
- https://www.paypal.com/mx/webapps/mpp/merchant-fees
- https://www.mercadopago.com.mx/herramientas-para-vender/link-de-pago
- https://www.payoneer.com/es/get-paid-by-clients/payment-request/
- https://wise.com/es/business/accept-card-payments/
- https://help.skool.com/article/86-subscriptions-faq
- https://kajabi.com/features/payments
- https://dlocalgo.com/es/industria/venta-de-infoproductos
- https://dlocalgo.com/es/cobertura

**Biblioteca de anuncios de Meta (anuncios activos en MX, CO, AR, PE, CL y EC, consultada el 28-10-2026)**
- https://www.facebook.com/ads/library/?id=1521446519290484 (Wallbit, 76 días)
- https://www.facebook.com/ads/library/?id=27760625053633092 (ARQ, 56 días)
- https://www.facebook.com/ads/library/?id=4180912678875904 (GrabrFi, pósit, 48 días)
- https://www.facebook.com/ads/library/?id=1052965464390781 (Takenos, 43 días)
- https://www.facebook.com/ads/library/?id=1639884637883776 (dLocal Go, «Más formas de pagar, más alumnos» y «Vendiste tu mentoría. El cliente pagó…»)
- https://www.facebook.com/ads/library/?id=1433287178199921 (dLocal Go, «Tenés tu LLC, tus alumnos en varios países…»)
- https://www.facebook.com/ads/library/?id=1107810341873164 (dLocal Go, «Ofrece los métodos de pago en los que tus clientes ya confían»)
- https://www.facebook.com/ads/library/?id=887661997669937 (Takenos Perú, «¿Tus clientes del exterior se complican para pagarte?»)
- https://www.facebook.com/ads/library/?id=29024012243896044 (Global66, «¿Recibís pagos en Payoneer?»)
- https://www.facebook.com/ads/library/?id=1759536175132689 (Legal Zelo, Stripe no disponible y LLC)
- https://www.facebook.com/ads/library/?id=1110946148302893 (Consultora Zenda, lista con checks)
- https://www.facebook.com/ads/library/?id=1894783095001107 (Takenos Ecuador, aviso «$500 recibidos»)

**Kunfupay**
- https://kunfupay.com/cobros-global
- https://kunfupay.com/sensei-prueba-gratis
- https://kunfupay.com/producto/suscripciones
- https://kunfupay.com/producto/checkout
- https://kunfupay.com/tarifas
- https://kunfupay.com/brand
- https://kunfupay.com/mor-europa
- https://kunfupay.com/blog/retirar-ganancias-peru-chile-creadores-2026
- https://kunfupay.com/personal/card
- https://kunfupay.com/producto/wallet
- https://kunfupay.com/faq
- https://kunfupay.com/blog/cambio-divisa-cobros-internacionales

**Lenguaje del hub**
- https://www.bbva.com/es/economia-y-finanzas/yolollamo-guita-varo-parne-lana-plata-asi-llaman-dinero-mundo/
- https://www.iprofesional.com/management/451512-empresas-extranjeras-contratan-freelancers-argentinos-es-negocio-con-dolar-planchado
- https://forbes.com.mx/?p=1326237

**Pagar y retirar dinero en el hub**
- https://colombiamove.com/blog/es/credit-cards-colombia-guide-foreigners/
- https://colombiamove.com/blog/es/atm-fees-card-withdrawals-colombia-foreigners/
- https://travelcurrencyguide.com/guides/atm/buenos-aires/
- https://www.argentinavisalaw.com/guides/money
- https://wise.com/ar/blog/como-pagar-en-argentina-siendo-extranjero
- https://www.publimetro.com.mx/noticias/2026/06/02/mexico-avanza-hacia-pagos-digitales-aunque-el-efectivo-concentra-40-de-transacciones/
- https://latamtravellers.com/blogs/news/atms-in-latin-america-2026-fees-limits-card-scams
- https://www.nomadicbackpacker.com/lowest-atm-withdrawal-fees-mexico.html
- https://expatsba.com/goto/post?id=5022
- https://www.beuc.eu/press-releases/commission-plans-tackle-high-unfair-fees-cross-border-and-currency-conversion
- https://www.paypal.com/mx/digital-wallet/paypal-consumer-fees
- https://www.xataka.com.co/aplicaciones/como-pasar-dolares-paypal-a-nequi-colombia-requisitos-costos-explicacion-paso-a-paso
- https://www.payoneer.com/es/resources/business/estrategias-para-usar-y-mover-tus-fondos-en-argentina/
- https://www.iprofesional.com/tecnologia/460003-como-cobrar-en-dolares-desde-argentina-pagando-menos-comisiones
- https://es.wikipedia.org/wiki/Dolarizaci%C3%B3n
- https://www.lexis.com.ec/blog/otros/veinte-anos-de-dolarizacion-marco-juridico
- https://www.takenos.com/
- https://www.dolarapp.com/es-MX
- https://www.valoraanalitik.com/?p=536296
- https://dplnews.com/?p=331896
- https://wise.com/mx/card/
- https://wise.com/ar/card/
- https://wise.com/co/blog/tarjeta-wise-colombia
- https://stripe.com/en-es/newsroom/news/bridge-partners-with-visa

### Antes de publicar

- **Cripto:** si la cuenta no tiene la autorización de Meta, se cortan las líneas de cripto en los 4 hubs; si G1 lleva cripto en la voz, se sustituye G1 en los 4 antes de lanzar.
- **Huecos:** si una pieza no pasa en un hub, no sale ningún conjunto hasta tener su sustituta, para que los 4 salgan siempre con 8.
- **Hueco de métodos:** buscar en la Biblioteca de anuncios (MX, CO, AR, PE, CL y EC, solo activos) «OXXO», «Nequi», «Bizum», «paga con Mercado Pago», «sin tarjeta» y «link de pago», y revisar con ese filtro los anuncios de «Hotmart». Si un anunciante de cobros ya pone el método en el gancho, cambiar el gancho de G1, E1 o E4, según el método.
- **Legal:** revisión de publicidad comparativa en E1 y E2, que nombran Stripe, Hotmart y PayPal.
- **Fuentes del día:** releer docs.stripe.com/payments/bizum (E1) y poner la fecha donde dice «[fecha]».
- **Datos de V2:** comprobar las cifras en Global Findex 2025 y CCCE, y confirmar que el 10 % de compras online pagadas en efectivo lo publica el artículo de Xataka, antes de rotularlas. Si ese 10 % no se confirma antes de rotular, la cifra se sustituye por «[dato a validar]».
- **Logos en E3:** si legal no autoriza los logos de métodos que salen en la pantalla A, E3 se sustituye en los 4 hubs; nunca se tapan logos.
- **Mercado Pago en Argentina:** G1 y G2 ya no lo nombran. Rosario y Argentina solo vuelven si se confirma que el checkout ofrece Mercado Pago a compradores de allí.
- **Oferta de E4:** si el equipo confirma una, entra a la vez en los 4 E4, sin «gratis» ni «0 %».