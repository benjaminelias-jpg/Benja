# HUBS · Métodos de pago · Bali

**Fecha:** 28 de octubre de 2026 · **Campaña:** HUBS · **Conjunto:** Bali

### Análisis

**Límite de la investigación.** No hubo buscador web ni acceso a Reddit ni a grupos de Facebook. Cada fuente citada se abrió directamente por su URL, y la Biblioteca de anuncios de Meta se consultó el 28-10-2026. Si alguna URL no se llegó a abrir, su dato pasa a [dato a validar]. **No hay ni una cita de un creador hispanohablante que viva en Bali y hable de cobrar.** Todo lo que sigue son hechos de fuentes oficiales, de competidores y de plataformas de nómadas. Las interpretaciones van marcadas como tales. Ningún gancho está validado con la voz del cliente. La fuerza de cada dato va en tres niveles: fuerte, medio y débil.

**Perfil**
- **Quién es.** Un creador hispanohablante que ya vende conocimiento online (cursos, mentorías, coaching, comunidades, membresías), vive en Bali y vende a España y a Latinoamérica. Sale del brief interno y no tiene fuente pública.
- **Cuántos son.** No hay cifra de hispanohablantes en Bali. En 2021 vivían en la isla 109.801 extranjeros, sobre todo de Rusia, EE. UU. y Australia (medio, https://en.wikipedia.org/wiki/Bali). Nomads.com estima 21.600 trabajadores remotos en Canggu, 8.400 en Ubud y 3.000 en Uluwatu (débil, https://nomads.com/canggu).
- **Dónde vive y trabaja.** En Canggu (Berawa, Pererenan, Batu Bolong), Ubud, Uluwatu y Seminyak. Los coworkings mejor valorados son Bwork, en Canggu, y Outpost, en Ubud (medio, https://nomads.com/canggu · https://nomads.com/ubud).
- **Hora.** WITA, UTC+8 todo el año. Son 7 h más que en España en invierno (6 h en verano), 14 h más que en México y 13 h más que en Colombia (fuerte, https://en.wikipedia.org/wiki/Central_Indonesia_Time).
- **Con qué cobra (interpretación, medio).** Lo más probable es que use Stripe, PayPal o Hotmart abiertos en su país de origen:
  - Stripe tiene Indonesia en «Preview», sin alta directa (https://stripe.com/global).
  - Wise no da cuenta a quien vive en Indonesia (https://wise.com/id/multi-currency-account/).
- **Facturación.** No hay dato.
- **Miedo y deseo (interpretación, débil).**
  - Miedo: que el alumno que ya ha decidido pagar se quede fuera mientras él duerme, a 13 o 14 horas.
  - Deseo: que vender desde Bali se note igual que vender desde Madrid o desde Ciudad de México.

**Situaciones reales de cobro.** Son hechos documentados, no testimonios.

| # | Situación | Qué dice la fuente | Fuerza | Pieza |
|---|---|---|---|---|
| S3 | La tarjeta del cliente es de otro país y se rechaza | Stripe avisa de que pueden subir los rechazos con tarjetas de otro país (https://docs.stripe.com/declines/card) | fuerte, sin porcentajes | E1 |
| S4 | El alumno de México quiere pagar con OXXO o SPEI | En Stripe, SPEI solo existe para cuentas de México. OXXO es para cuentas de MX, US, CA y SG, y en el EEE está en preview privado. Es un vale de efectivo con tope de 10.000 MXN (https://docs.stripe.com/payments/bank-transfers · https://docs.stripe.com/payments/oxxo) | fuerte | V1, E1, E3 |
| S5 | El cliente de Colombia o Argentina paga con Nequi o Mercado Pago | No aparecen en la lista de métodos de Stripe (https://docs.stripe.com/payments/payment-methods/overview). Kunfupay los muestra (https://kunfupay.com/cobros-global) | fuerte lo que dice la documentación; medio deducir que no los ofrece | V2, E2 |
| S7 | El alumno quiere pagar mientras tú duermes | Las 14:00 en Guadalajara son las 04:00 en Bali, y las 14:00 en Bogotá son las 03:00 (https://en.wikipedia.org/wiki/Central_Indonesia_Time) | fuerte las horas; medio la escena | V1, V2 |
| S1 | Stripe no tiene alta directa en Indonesia | «Preview», con contacto a ventas (https://stripe.com/global) | fuerte | Solo contexto, porque roza la residencia |
| S2 | PayPal estuvo bloqueado en Indonesia | Del 30-07-2022 al 03-08-2022 (https://en.wikipedia.org/wiki/PayPal) | medio | Solo contexto |
| S8 | Retirar de Hotmart viviendo fuera | Solo a una cuenta propia en el domicilio de registro (https://hotmart.com/es/legal/terminos-de-uso) | fuerte | Fuera del ángulo |

**Citas literales.** Ninguna es voz del cliente.
1. "If your customers use cards issued in a different country than where you registered your Stripe account, they might see an increased rate of declines." (Stripe, https://docs.stripe.com/declines/card)
2. "Different payment methods are more dominant in certain regions, meaning not all customers have or prefer a card payment method." (Stripe, https://docs.stripe.com/payments/payment-methods/overview)
3. «Un pago rechazado se siente como una venta perdida — y muchas veces se lo atribuye al marketing o al precio, cuando el problema real está en el procesamiento.» (dLocal Go, https://dlocalgo.com/es/industria/vende-tus-cursos-online-y-mentorias-en-todo-el-mundo)
4. «Aceptamos 22 monedas, pero tú recibes en euros.» (Hotmart, https://hotmart.com/es/herramientas/internacionalizacion)
5. "cons are plentiful (dirty, cash society, scams..." (usuario de Nomads.com, https://nomads.com/canggu, débil)
6. "In general it feels like you're in traffic for hours." (usuario de Nomads.com, https://nomads.com/canggu, débil)

**Qué usa hoy y qué ya le resuelve**

| Herramienta | Ya le resuelve (no venderlo como novedad) | No cubre |
|---|---|---|
| Stripe con cuenta de España | Tarjeta, Bizum, Pix y PayPal a través de Stripe | Nequi, PSE, Yape y Mercado Pago no aparecen. SPEI solo existe para cuentas de México. Stablecoins solo en preview privado |
| Stripe con cuenta de EE. UU. | Tarjeta, OXXO, Pix, Bizum y stablecoins (USDC) | PayPal a través de Stripe, SPEI y los monederos de LATAM |
| Hotmart | 22 monedas y más de 44 métodos: OXXO, SPEI, Pix, PSE y Bizum | Frente a Hotmart, la lista de métodos no diferencia. No se sabe si acepta cripto del comprador |
| PayPal | Pagos de quien tiene PayPal o tarjeta, en «más de 200 mercados» | Métodos locales como Bizum, OXXO o Nequi |
| Wise, Payoneer, Kajabi | Recibir dinero o cobrar con tarjeta | Métodos locales del comprador. Wise no da cuenta a quien vive en Indonesia |

Fuentes: https://docs.stripe.com/payments/bizum · https://docs.stripe.com/payments/paypal · https://docs.stripe.com/payments/stablecoin-payments · https://hotmart.com/es/herramientas/internacionalizacion · https://www.paypal.com/es/business · https://kajabi.com/features/payments

**Objeciones y la respuesta verdadera**
- **«Mi Stripe de España ya acepta Bizum.»** Es verdad. Lo que no aparece es Nequi ni Mercado Pago, y SPEI solo existe para cuentas de México.
- **«Hotmart ya me da OXXO y SPEI.»** También es verdad. Con Hotmart no se compite por métodos ni por precio. En este hub no hay una respuesta fuerte: la que había, que el cliente te pague en cripto, no se usa, porque en Indonesia la cripto está prohibida como medio de pago desde 2018. Por eso ningún anuncio de Bali se compara con Hotmart.
- **«Con PayPal me paga todo el mundo.»** Te paga quien tiene PayPal o tarjeta. El bloqueo de 2022 no se usa como miedo.
- **«Con tarjeta paga todo el mundo.»** Stripe reconoce más rechazos con tarjetas de otro país, y que no todos los clientes tienen tarjeta o la prefieren. Sin porcentajes.
- **«No quiero otra pasarela.»** Kunfupay «convive con el resto de tu stack: la sumas donde te aporta» (https://kunfupay.com/producto/api).
- **«¿Cuánto cuesta?»** No hay precio público (https://kunfupay.com/tarifas). No se habla de precio.
- **«¿Me aceptan si vivo en Bali?»** Pendiente de confirmar. La web solo nombra España y Latinoamérica, y no dice que se acepten vendedores con residencia en Indonesia. Hay que confirmarlo por escrito con el equipo antes de publicar (ver «Antes de publicar»). Landing: https://kunfupay.com/sensei-prueba-gratis.

**Lenguaje del hub**
- **Lugares:** Canggu (Berawa, Pererenan, Batu Bolong), Ubud, Uluwatu y Seminyak.
- **Insider:**
  - El atasco de Canggu, ir de pasajero en el Gojek y el wifi a tirones.
  - El longboard en Batu Bolong y el coworking Outpost, en Ubud.
  - La hora WITA.
  - Fuentes: https://en.wikipedia.org/wiki/Canggu · https://nomads.com/canggu
- **Palabras del ángulo:** «tu enlace», «te paga con lo que usa», Bizum, OXXO, SPEI, Nequi, Mercado Pago, «euros o dólares», «por WhatsApp o DM».
- **Qué evitar:**
  - Clichés: «paraíso», templos o arrozales como decorado.
  - Turistas portándose mal.
  - Hablar de Bali como si fuera un país.
  - Visados, KITAS, efectivo, cajeros y QRIS.
  - La cripto, en cualquier forma: en Indonesia está prohibida como medio de pago desde 2018.
  - Que quien graba diga que vive allí.
  - Atributos del espectador.
  - «Stripe no funciona en Bali».
  - Cifras de métodos.

### Ángulo del hub

**«Desde Bali vendes a dos continentes a la vez: cada alumno te paga con lo que usa en su país y a su hora, aunque tú estés dormido.»**

Por qué:
- **Husos horarios (fuerte).** Tu noche en Bali (00:00–07:00) es la tarde en España (17:00–00:00), y el día en México (10:00–17:00) y en Colombia (11:00–18:00). Fuente: https://en.wikipedia.org/wiki/Central_Indonesia_Time. Que sea cuando más te compran es una interpretación y no se escribe como dato.
- **Lo que no cubre su herramienta (fuerte).**
  - En Stripe, SPEI solo existe para cuentas de México.
  - Nequi y Mercado Pago no aparecen en su lista de métodos.
  - Stripe reconoce más rechazos con tarjetas de otro país.
  - Fuentes: https://docs.stripe.com/payments/bank-transfers · https://docs.stripe.com/payments/payment-methods/overview · https://docs.stripe.com/declines/card
- **Hueco libre (medio).**
  - Nadie le habla a quien vende desde Bali a España y a LATAM a la vez: Hotmart le habla a quien vende «desde España» y dLocal Go no tiene España.
  - En los 35 anuncios activos leídos (de unos 105; Biblioteca de anuncios de Meta, Indonesia, 28-10-2026), ninguno habla de quien paga ni nombra sus métodos, y ninguno usa la diferencia horaria.
  - Fuentes: https://hotmart.com/es/herramientas/internacionalizacion · https://dlocalgo.com/es/pagos-internacionales · https://www.facebook.com/ads/library/

### Lo que anuncia la competencia aquí

Biblioteca de anuncios de Meta, Indonesia, solo anuncios activos, 28-10-2026: unos 105 anuncios de 25 anunciantes, de los que se leyeron 35. Stripe, PayPal, Wise, Hotmart y Mercado Pago no tienen anuncios propios aquí.
- **Quién.** Taxhackers mete volumen con el 0 % de impuestos (23 o más desde el 21-10-2026). IncorpOS y Valis venden montar una empresa en EE. UU. para cobrar con Stripe. MBiA, una empresa en Hong Kong para facturar. Karta y Varon venden tarjetas para gastar cripto. En español solo están Tab (cobros para hoteles, hablando de usted) y Keep Nomad (escuela de nomadismo).
- **Lo que lleva más tiempo.** Smiles, remesas con «el mejor tipo de cambio», desde el 9-02-2026: [3527363820735488](https://www.facebook.com/ads/library/?id=3527363820735488). Tab, testimonio sobre fondo morado con un móvil, desde el 8-05-2026: [1282765327371265](https://www.facebook.com/ads/library/?id=1282765327371265). WireNations, desde el 11-06-2026: [847910221725375](https://www.facebook.com/ads/library/?id=847910221725375). Karta está escalando desde el 22-09-2026: [997133103395346](https://www.facebook.com/ads/library/?id=997133103395346). Todos llevan una idea y una prueba.
- **Saturado en texto.** Abrir con quién eres: «Digital nomad running…?» ([1393577762762318](https://www.facebook.com/ads/library/?id=1393577762762318)), «Digital Nomads, attention» ([1453952193409818](https://www.facebook.com/ads/library/?id=1453952193409818)) o «Working remotely while living in Bali?» ([1620730646202739](https://www.facebook.com/ads/library/?id=1620730646202739)). Abrir con desde dónde trabajas y luego los clientes de todo el mundo: «Work from Southeast Asia. Invoice clients around the world.» ([4596199407313689](https://www.facebook.com/ads/library/?id=4596199407313689)). También «0 %», «free», «in minutes», «multi-currency», «global», «todo en uno», y Stripe como meta a la que llegar ([1694937338931596](https://www.facebook.com/ads/library/?id=1694937338931596)).
- **Saturado en imagen.** Fondo oscuro con neón y el móvil en la mano (Karta, [1416736439956923](https://www.facebook.com/ads/library/?id=1416736439956923)), degradado azul y morado (MBiA, [4596199407313689](https://www.facebook.com/ads/library/?id=4596199407313689)), Bali de postal (Home Visa), pantalla de bloqueo con avisos de venta (ClientZone, [29129042550067565](https://www.facebook.com/ads/library/?id=29129042550067565)) y testimonio sobre morado con móvil (Tab).
- **El hueco que ocupamos.** En lo leído, todos hablan de quien cobra. Ninguno habla de quien paga, ni nombra OXXO, SPEI, Nequi, Mercado Pago o Bizum. Ninguno usa la diferencia horaria ni enseña el enlace como lo que resuelve el cobro. Y ninguno le habla de tú al creador en español.
- **Qué cambié por ello.**
  - Los textos abren ahora con quien paga, salvo E3, que abre con «Desde Bali, un enlace» y nombra a quien paga en la misma frase (México y España). G2, V2, E2 y E4 nombran además su método en la primera línea. E1 abre con el alumno de Puebla y con Canggu en la misma frase.
  - Los titulares de E1, E2 y E3 abren con el filtro de quien vende, porque el titular de los estáticos siempre empieza por el filtro. El de E4 abre con sus clientes.
  - El titular de E4 ya no abre con «Desde Bali». Repetía la estructura de MBiA: primero desde dónde trabajas y luego los clientes de cualquier sitio.
  - E3 sí abre con «Desde Bali», pero sigue con dos países concretos y enseña sus páginas de pago, no «clientes de todo el mundo».
  - E4 ya no habla de abrir una pasarela en cada país, que es el terreno «todo en uno». Ahora dice que no todos tienen tarjeta o no la prefieren, como reconoce Stripe.
  - V2 ya no abre con tu Stripe, sino con Bogotá y Nequi. Stripe sale como lo que ya tienes y se queda, no como meta.
  - E3 deja el móvil con marco sobre lila, porque era el formato de Tab. V2 deja el fondo morado por lo mismo y pasa a gris claro. E3 tampoco usa los avisos de venta con importes, que son el formato de ClientZone. Ahora enseña dos páginas de pago reales (México y España), anotadas.
  - G2 no puede cambiar su vídeo, que enseña avisos de venta con importes, el formato de ClientZone. Su miniatura es la página de pago, no los avisos.
  - V1 ya no termina bajando con el longboard a la playa, que es la promesa de Home Visa y de Keep Nomad. Bali sale como situación, no como postal.
  - E4 pasa a morado oscuro liso, sin móvil ni degradado.
  - Ni rastro de «gratis», «fácil», «en minutos» ni «nómada». Todos los textos terminan con el cierre fijo.
  - La cripto sale de los 8 anuncios. El conjunto se entrega en Indonesia, donde está prohibida como medio de pago desde 2018. Además, Karta y Varon ya venden tarjetas para gastarla.
  - El hueco de «cobrar sin montar una empresa fuera» no se usa, porque nombrar la LLC está prohibido en los anuncios.

### Los 8 anuncios

Los 4 conjuntos salen a la vez, con los mismos 8 huecos.

| Pieza | Nombre en Meta | Nivel | Tipo | Persona | Emoción | Gancho | Formato |
|---|---|---|---|---|---|---|---|
| G1 | HUB-BALI-G1 \| N2 \| Dolor \| Vende por llamada \| VIDEO-LLAMADA | N2 | Dolor | Vende por llamada | Frustración | «Llamada de ventas con Medellín: 19:00 allí, 8:00 en Bali.» | Vídeo genérico ya grabado + texto del hub |
| G2 | HUB-BALI-G2 \| N3 \| Mecanismo \| Quiere entender cómo funciona \| VIDEO-PANTALLAS | N3 | Mecanismo | Quiere entender cómo funciona | Curiosidad | «Atasco en Canggu. Madrid te paga con Bizum. México, con OXXO.» | Vídeo genérico «Infografía», ya grabado + texto del hub |
| V1 | HUB-BALI-V1 \| N1 \| Dolor \| Mentora por DM a España y México \| VIDEO-HISTORIA | N1 | Dolor (historia del hub) | Mentora que vende por DM y WhatsApp a España y México, con Stripe de España o PayPal | Agobio de estar de guardia, luego alivio | «A tus 4:00 en Bali, un alumno de Guadalajara quiere pagarte.» | UGC con voz en off; el único plano de IA es el del gancho |
| V2 | HUB-BALI-V2 \| N2-N3 \| Creencia \| Curso grabado con Stripe ES \| REEL-CAMARA | N2-N3 (puente) | Creencia | Vende un curso grabado en automático con Stripe de España | Falsa tranquilidad, luego sorpresa | «Bogotá quiere pagarte con Nequi. Tú cobras desde Bali con Stripe de España.» | Reel a cámara del equipo, en estudio |
| E1 | HUB-BALI-E1 \| N2 \| Dolor \| Talleres en directo a México \| EST-TITULAR | N2 | Dolor (distinto del de V1) | Formador que vende plazas de talleres en directo a México | Desconcierto, luego lo entiende | «*Si vendes desde Bali a México,* «pago rechazado» no es el wifi.» | Titular grande con iconos dibujados |
| E2 | HUB-BALI-E2 \| N3 \| Comparativa \| Coach 1:1 que cobra con PayPal \| EST-HOY-VS-CON | N3 | Comparativa | Coach que cobra sus sesiones 1:1 con enlace de PayPal | Claridad | «*Si das sesiones 1:1 desde Ubud,* mira cómo puede pagarte cada cliente.» | Tabla «Hoy, con PayPal / Con tu enlace de Kunfupay» |
| E3 | HUB-BALI-E3 \| N4 \| Prueba \| Quiere ver qué ve su alumno \| EST-CAPTURA-ANOTADA | N4 | Prueba | Quiere ver qué ve su alumno antes de cambiar nada | Desconfianza, luego seguridad | «*Desde Bali, un enlace:* así te pagan en México y España.» | Dos páginas de pago reales (México y España), anotadas |
| E4 | HUB-BALI-E4 \| N5 \| Oferta \| Ya vende a España y LATAM, listo \| EST-LIMPIA-BOTON | N5 | Oferta | Ya vende a España y LATAM y está listo para decidir | Decisión | «*Tus clientes de España y LATAM:* cada uno te paga con lo suyo.» | Fondo morado oscuro liso, chips y «Registrarte ↓» |

**Reparto por nivel:** 3 anuncios en N1–N2 (G1, V1 y E1), 2 en N3 (G2 y E2), V2 como puente N2-N3, 1 en N4 (E3) y 1 en N5 (E4). Hay un solo anuncio de oferta (E4), que sale sin precio ni oferta. Las 8 personas son distintas.

**Largo de los ganchos, en palabras:** G1 10, G2 11, V1 11, V2 13 (dos frases, de 5 y 8), E1 12, E2 12, E3 11 y E4 13.

### Genéricos: texto del anuncio para este hub

**G1 · «¿Cómo te pago?»**

Texto principal:
```text
Llamada de ventas con Medellín: 19:00 allí, 8:00 en Bali.

Te dice que sí.
Y te pregunta: «¿Cómo te pago?».
Tú solo tienes un enlace de tarjeta.
Él prefiere pagar con Nequi o desde su banco, en pesos.

PERO si le cobras con tu enlace de Kunfupay, elige él.
Te paga con Nequi o por transferencia, en pesos colombianos.
A ti te llega en euros o en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** Tu cliente de Medellín paga en pesos
- **Descripción:** A ti te llega en euros o en dólares.
- **Botón:** Registrarte
- **Nombre en Meta:** HUB-BALI-G1 | N2 | Dolor | Vende por llamada | VIDEO-LLAMADA

**G2 · «Infografía»**

Texto principal:
```text
Atasco en Canggu. Madrid te paga con Bizum. México, con OXXO.

Creas el producto en Kunfupay.
Sacas tu enlace desde el asiento de atrás del Gojek.
Te lo piden por WhatsApp y lo mandas.
Como harías con cualquier enlace de pago.

PERO con tu enlace de Kunfupay, elige cada alumno.
Con lo que usa en su país.
Madrid, con Bizum.
México, con OXXO.
Bogotá, con Nequi.
Los tres, en el mismo enlace.
A ti te llega en euros o en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** Madrid con Bizum, México con OXXO
- **Descripción:** Creas el producto, sacas tu enlace y lo envías.
- **Botón:** Registrarte
- **Miniatura en Meta:** un fotograma de la página de pago real de España o de Colombia. Nunca el de México, que sale con el logo de OXXO cortado, ni el del chat, que es un montaje, ni el de los avisos de «Nueva venta» con importes, que son una simulación.
- **Nombre en Meta:** HUB-BALI-G2 | N3 | Mecanismo | Quiere entender cómo funciona | VIDEO-PANTALLAS

### Vídeos personalizados

> **Versión para grabar de V1:** `GUIONES-HUBS.md`, apartado 4, con ganchos alternativos. Allí los insertos usan la página de pago real. Del vídeo de la Infografía solo son reales las páginas de pago. El chat de WhatsApp es un montaje, y los avisos de «Nueva venta» son una simulación (llevan la nota «Simulación. Cifras a modo de ejemplo.»). Ninguno de los dos se presenta como pantalla real en V1 ni en V2. En Bali, V1 se graba sin la línea de cripto, también en la versión de `GUIONES-HUBS.md`.

#### V1 · Mentora por DM a España y México

**Quién lo graba y en qué set:**
- Una creadora UGC pone la voz en off y habla de Kunfupay desde fuera («tu enlace de Kunfupay»).
- Graba planos de manos, móvil y portátil en un escritorio neutro, con luz de mañana.
- No dice ni enseña que vive en Bali.
- El único plano de IA es el del gancho.
- Subtítulos quemados de toda la locución, frase a frase, en Plus Jakarta Sans, en el tercio central.
- Las burbujas de chat están dibujadas en el estilo gráfico de la marca: sin la interfaz ni el logo de WhatsApp, sin nombre, sin foto, sin globo rojo y sin contador.
- No se nombra la cripto: en Indonesia está prohibida como medio de pago.

**Guion (teleprompter)**
```text
[Plano de IA: habitación a oscuras en Berawa, un longboard apoyado en la pared y un móvil boca abajo en la mesilla que se ilumina. Rótulo pequeño: Si vendes desde Bali a México · 14:00 Guadalajara · 04:00 Bali. Rótulo grande: A tus 4:00 en Bali, un alumno de Guadalajara quiere pagarte.]
A tus 4:00 en Bali, un alumno de Guadalajara quiere pagarte.

Guadalajara, las 14:00.
Tu alumno ya ha decidido entrar.
Y te escribe por WhatsApp.
[Burbuja de chat dibujada]
«¿Te puedo pagar por SPEI?»
[Rótulo: Stripe de España o PayPal → sin SPEI]
En tu Stripe de España o en PayPal no está.

En Berawa son las 4:00.
Y tú, durmiendo.

A las 7:00 lo ves.
Contestas con el café en la mano.
Le das otra opción.
Y te quedas pendiente del chat.

[Burbujas dibujadas de Guadalajara y de Ciudad de México apilándose]
Porque México te escribe a tu madrugada.
[Alargando «cada»; el subtítulo dice «cada».] Y cada mañana empieza igual: con alumnos esperándote en el chat.

PERO si le cobras con tu enlace de Kunfupay, elige él.
Paga por SPEI, desde su banco, en pesos.
Sin escribirte.

[Rótulo: Guadalajara → SPEI · Madrid → Bizum]
Tu alumna de Madrid, con Bizum.
El mismo enlace.

A ti te llega en euros o en dólares.

A las 7:00 ya no hay nadie esperando.
Guadalajara ya te ha pagado.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
```

**Texto del anuncio**

Texto principal:
```text
A tus 4:00 en Bali, un alumno de Guadalajara quiere pagarte.

En Guadalajara son las 14:00.
Te pregunta si puede pagarte por SPEI, desde su banco.
En tu Stripe de España o en PayPal no está.
Tú, en Berawa, duermes.
A las 7:00 contestas.
Y cada mañana empieza igual: con alumnos esperándote en el chat.

PERO si le cobras con tu enlace de Kunfupay, elige él.
Guadalajara paga por SPEI, en pesos, sin escribirte.
Madrid, con Bizum.
El mismo enlace.
A ti te llega en euros o en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** SPEI a las 14:00 de Guadalajara
- **Descripción:** Sin escribirte. Y tú, sin chats al despertar.
- **Botón:** Registrarte
- **Nombre en Meta:** HUB-BALI-V1 | N1 | Dolor | Mentora por DM a España y México | VIDEO-HISTORIA

#### V2 · Curso grabado con Stripe de España

**Quién lo graba y en qué set:**
- El equipo de Kunfupay graba un reel a cámara en estudio y habla en plural («hemos mirado»).
- Fondo liso gris claro #F2F2F5, sin degradado. Rótulos de ciudad y método en morado #734BFC. El rótulo grande del gancho, en morado oscuro #260D68.
- No hay plano de IA, ni logos de Stripe o PayPal, ni capturas de su web. Nadie dice que vive en Bali.
- Subtítulos quemados de toda la locución, frase a frase, en Plus Jakarta Sans, en el tercio central.
- No se nombra la cripto: en Indonesia está prohibida como medio de pago.

**Guion (teleprompter)**
```text
[A cámara. Rótulo grande: BOGOTÁ QUIERE PAGARTE CON NEQUI]
Bogotá quiere pagarte con Nequi.
Tú cobras desde Bali con Stripe de España.

Tu curso grabado se vende solo.
Y tu Stripe de España acepta tarjeta, Bizum y PayPal.
Cubierto, piensas.

[Rótulo solo de texto: «Fuente: documentación pública de Stripe.». No se muestran ni la web ni el logo de Stripe.]
Hemos mirado la lista de métodos de Stripe.
[Rótulo: Lista de Stripe · Nequi: no aparece · Mercado Pago: no aparece]
Nequi no aparece.
Mercado Pago, tampoco.
Y Stripe dice: no todos los clientes tienen o prefieren tarjeta.

Tu alumno entra a comprar a las 14:00 de Bogotá.
En Seminyak son las 3:00.
Y como va en automático, nadie le ofrece otra opción.

PERO si le cobras con tu enlace de Kunfupay, elige él.

[Rótulo: Bogotá → Nequi]
Bogotá te paga con Nequi.
A ti te llega en euros o en dólares.

Tu Stripe se queda.
Y sumas Kunfupay donde te aporta.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
```

**Texto del anuncio**

Texto principal:
```text
Bogotá quiere pagarte con Nequi. Tú cobras desde Bali con Stripe de España.

Tu curso grabado se vende solo.
Y tu Stripe de España acepta tarjeta, Bizum y PayPal.
Cubierto, piensas.

Hemos mirado la lista de métodos de Stripe.
Nequi no aparece.
Mercado Pago, tampoco.
Y Stripe dice: no todos los clientes tienen o prefieren tarjeta.
Tu alumno entra a comprar a las 14:00 de Bogotá.
En Seminyak son las 3:00.
Y como va en automático, nadie le ofrece otra opción.

PERO si le cobras con tu enlace de Kunfupay, elige él.
Bogotá, con Nequi.
A ti te llega en euros o en dólares.

Tu Stripe se queda.
Y sumas Kunfupay donde te aporta.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** Tu Stripe se queda. Bogotá, con Nequi.
- **Descripción:** Tu alumno elige; a ti, euros o dólares.
- **Botón:** Registrarte
- **Nombre en Meta:** HUB-BALI-V2 | N2-N3 | Creencia | Curso grabado con Stripe ES | REEL-CAMARA

### Estáticos personalizados

> **Ya están hechos.** Los 4 estáticos de este hub están en `estaticos/`, en 1080×1350 (feed) y 1080×1920 (Stories). Las especificaciones de abajo fueron el brief de diseño. Donde el archivo final no coincide al píxel, manda el archivo. E3 cambió de pantallas: el motivo está en su apartado.

**Especificación común a E1–E4**
- **Formatos:** 1080×1350 px para el feed y 1080×1920 px para Stories. Los estáticos no van en Reels. En 1080×1920 no va ni texto ni logo en los 250 px de arriba ni en los 340 px de abajo.
- **Márgenes:** 80 px a los lados.
- **Colores:** morado de marca #734BFC, morado oscuro #260D68, blanco #FFFFFF, gris claro #F2F2F5 (fondos de celda), gris texto #6B6B78 y lila claro #CFC9DE (filtro de E4). Sin degradados, sin neón, sin fotos de stock, sin personas y sin Bali de postal.
- **Tipografía:** Plus Jakarta Sans y ninguna más.
  - El filtro va en Medium Italic.
  - El resto del titular va en ExtraBold, con interlineado de 1,05.
  - Etiquetas, chips y cabeceras en SemiBold. El texto secundario, en Regular.
- **Titular:** siempre empieza por el filtro en cursiva y sigue en la misma frase, sin punto ni salto de párrafo entre los dos.
- **Logo de Kunfupay:** mide 170×56 px y va a 64 px de los bordes. Va abajo a la derecha salvo que la pieza diga otra cosa, y en 1080×1920 siempre por encima de la franja de 340 px.
- **Marcas de terceros** (PayPal, Stripe, OXXO, SPEI, Nequi, PSE, Mercado Pago, Bizum): solo como palabra en Plus Jakarta Sans, sin su logo, su tipografía ni sus colores. La única excepción es lo que sale dentro de las páginas de pago reales de E3.
- **Sin** emojis, estrellas, móviles en la mano ni maquetas de dispositivo.

#### E1 · Talleres en directo a México

**Composición 1080×1350**
- **Fondo:** blanco #FFFFFF.
- **Titular:** a la izquierda, de y=120 a y≈650, 920 px de ancho, 100 px de cuerpo, en 4 líneas: «Si vendes desde / Bali a México, / «pago rechazado» / no es el wifi.».
  - El filtro y «pago rechazado» van en #734BFC (Medium Italic y ExtraBold); «no es el wifi.», en ExtraBold #260D68.
  - Las comillas de «pago rechazado» van en el mismo morado. No hay rojo, ni caja, ni icono de alerta: no imita el error de ninguna pasarela.
- **Iconos:** de y=720 a y=940, alineados a la izquierda. Son dos iconos dibujados a mano, de 220×220 px y separados 48 px, con trazo de 12 px en #734BFC, sin relleno y sin texto:
  - Una señal de wifi con todas las barras llenas.
  - Una tarjeta con un «?» grande.
- **Texto secundario:** a la izquierda, de y=1040 a y=1150, 600 px de ancho como máximo, Regular de 40 px en gris texto #6B6B78.
- **Logo:** en morado #734BFC, abajo a la derecha.

**Composición 1080×1920**
- Los iconos van arriba y centrados, en fila, de y=300 a y=520: los dos de 220×220 px, separados 48 px.
- El titular va de y=600 a y≈1180, con 104 px de cuerpo y alineado a la izquierda.
- El texto secundario va de y=1260 a y=1370, a la izquierda, en Regular de 40 px y gris texto #6B6B78, con 600 px de ancho como máximo.
- El logo va en morado #734BFC, abajo a la derecha, de y=1500 a y=1556.

**Texto literal de la imagen** (20 palabras)
- Titular: *Si vendes desde Bali a México,* «pago rechazado» no es el wifi.
- Texto secundario: Tarjeta de otro país: pueden subir los rechazos.

**Texto del anuncio**

Texto principal:
```text
Un alumno de Puebla te escribe a Canggu: «Me sale rechazado».

Es para tu taller en directo del jueves.
Piensas en el wifi y abres tu enlace para comprobarlo.
Carga a la primera. Todas las barras.

No es el wifi.
Su tarjeta es de México y tu pasarela, de otro país.
Si cobras con Stripe, lo dice su propia documentación.
Con tarjetas de otro país, pueden subir los rechazos.

PERO con tu enlace de Kunfupay, te paga en un OXXO.
En efectivo. O por SPEI, desde su banco.
A ti te llega en euros o en dólares.
Y él entra a tu taller.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** Puebla paga tu taller en un OXXO
- **Descripción:** Aunque su tarjeta se rechace.
- **Botón:** Registrarte
- **Nombre en Meta:** HUB-BALI-E1 | N2 | Dolor | Talleres en directo a México | EST-TITULAR

#### E2 · Coach 1:1 que cobra con PayPal

**Composición 1080×1350**
- **Fondo:** blanco #FFFFFF.
- **Titular:** a la izquierda, de y=90 a y=330, 72 px de cuerpo, en 3 líneas. El filtro va en Medium Italic #734BFC y el resto en ExtraBold #260D68.
- **Tabla:** de y=390 a y≈1110 y 920 px de ancho. Tiene tres columnas (220 px para la ciudad, 320 px para «Hoy» y 380 px para «Con tu enlace»), sin bordes y con 12 px entre filas.
  - **Cabecera (80 px de alto).** La columna de la ciudad va vacía. «Hoy, con PayPal» va en SemiBold de 28 px, en gris texto sobre gris claro. «Con tu enlace de Kunfupay» va en dos líneas («Con tu enlace / de Kunfupay»), en SemiBold de 28 px, en blanco sobre #260D68.
  - **Tres filas de 200 px.**
    - Ciudad: SemiBold de 38 px en #260D68.
    - Columna «Hoy»: fondo gris claro #F2F2F5 y «PayPal o tarjeta» en Regular de 34 px, en gris texto. Es idéntica en las tres filas, para que se vea que es igual para todos.
    - Columna «Con tu enlace»: fondo #734BFC con chips blancos en forma de píldora (60 px de alto, 22 px de relleno lateral y 12 px entre chips). El texto de los chips va en SemiBold de 28 px y en #260D68, en una o dos líneas.
  - «PayPal» siempre como palabra. Nunca con su «P», sus azules ni su tipografía.
- **Pie:** a la izquierda, de y=1170 a y=1220, en SemiBold de 36 px y #260D68, con 680 px de ancho como máximo.
- **Logo:** en morado #734BFC, abajo a la derecha.

**Composición 1080×1920**
- El titular va de y=270 a y=600, con 80 px de cuerpo.
- La tabla va de y=660 a y≈1436, con filas de 220 px.
- El pie va a la izquierda y el logo, en morado #734BFC, a la derecha, en la franja de y=1470 a y=1556.

**Texto literal de la imagen** (la tabla es la excepción al tope de 20 palabras)
- Titular: *Si das sesiones 1:1 desde Ubud,* mira cómo puede pagarte cada cliente.
- Cabeceras: Hoy, con PayPal | Con tu enlace de Kunfupay
- Fila 1: Sevilla | PayPal o tarjeta | [Bizum] [tarjeta]
- Fila 2: Querétaro | PayPal o tarjeta | [OXXO] [SPEI] [tarjeta] [PayPal]
- Fila 3: Barranquilla | PayPal o tarjeta | [Nequi] [PSE] [tarjeta]
- Pie: A ti te llega en euros o en dólares.

El chip «PayPal» solo va en la fila de Querétaro: la página de pago real solo lo enseña con «México».

**Texto del anuncio**

Texto principal:
```text
Tu clienta de Sevilla quiere pagarte con Bizum.
Tu cliente de Querétaro, con OXXO o SPEI desde su banco.
El de Barranquilla, con Nequi.

Das tus sesiones 1:1 desde Outpost, en Ubud.
Las cobras con un enlace de PayPal por WhatsApp.
En ese enlace, ninguno de esos aparece.

PERO con tu enlace de Kunfupay, la tabla cambia.
Cada uno te paga con lo suyo.
Y quien quiera, con tarjeta.
En México, también con PayPal.
A ti te llega en euros o en dólares.

Sigues mandando un enlace por WhatsApp, como ahora.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** De PayPal a Bizum, Nequi u OXXO
- **Descripción:** Mira la tabla: hoy y con Kunfupay.
- **Botón:** Registrarte
- **Nombre en Meta:** HUB-BALI-E2 | N3 | Comparativa | Coach 1:1 que cobra con PayPal | EST-HOY-VS-CON

#### E3 · Quiere ver qué ve su alumno

**Archivos:** `estaticos/HUB-BALI-E3_1080x1350.png` y `estaticos/HUB-BALI-E3_1080x1920.png`

**Pantallas que se usan** (dos páginas de pago reales, sacadas del vídeo de la Infografía, sin retocar; sin chat):
- La página de pago con «México», recortada al selector y a las casillas de SPEI y Mercado Pago.
- La página de pago con «España»: Bizum, Visa, Mastercard, Apple Pay, Google Pay y SEPA.
- **Por qué cambia:** el chat de WhatsApp del vídeo es un montaje (su fondo no es el de WhatsApp) y enseña un servicio de psicología, así que no puede ir como pantalla real. En la página de México el logo de OXXO sale cortado, y por eso va recortada a SPEI y Mercado Pago. El texto solo nombra los métodos que se ven.

**Texto literal de la imagen** (17 palabras, sin contar el de las páginas de pago)
- Titular: «*Desde Bali, un enlace:* así te pagan en México y España.»
- Notas: «México: SPEI» · «España: Bizum»
- Pie: «Pantallas reales.» Solo cubre las dos páginas de pago.

**Texto del anuncio**

Texto principal:
```text
Desde Bali, un enlace: así te pagan en México y España.

Tu alumno de Guadalajara te lo pide por WhatsApp.
Tu alumna de Madrid, también.
Les mandas el mismo enlace de Kunfupay.
PERO cada uno ve lo que usa en su país.

En México, SPEI, para pagarte desde su banco. Y Mercado Pago.
En España, Bizum.

Eligen ellos y te pagan sin escribirte otra vez.
A ti te llega en euros o en dólares.

No es una maqueta.
Son las páginas de pago reales.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** Así te pagan en México y España
- **Descripción:** SPEI en México. Bizum en España.
- **Botón:** Registrarte
- **Nombre en Meta:** HUB-BALI-E3 | N4 | Prueba | Quiere ver qué ve su alumno | EST-CAPTURA-ANOTADA

#### E4 · Ya vende a España y LATAM, listo para decidir

Sale sin precio ni oferta.

**Composición 1080×1350**
- **Fondo:** morado oscuro #260D68 liso. Sin foto, sin ilustración, sin móvil, sin degradado y sin cifras.
- **Titular:** centrado, de y=200 a y≈600, con 92 px de cuerpo y en 4 líneas («Tus clientes de / España y LATAM: / cada uno te paga / con lo suyo.»). El filtro va en Medium Italic #CFC9DE y el resto en ExtraBold blanco.
- **Chips:** tres píldoras en columna, centradas, de y=690 a y=990. Cada una mide 560×84 px, va en #734BFC con el texto en SemiBold de 38 px y blanco, y hay 24 px entre ellas.
- **«Registrarte ↓»:** centrado, de y=1080 a y=1135, en SemiBold de 44 px y blanco. Es texto plano, sin caja, sin sombra y sin cursor, y apunta al botón real de Meta.
- **Logo:** en blanco, abajo a la derecha.

**Composición 1080×1920**
- El titular va de y=300 a y≈800, con 100 px de cuerpo.
- Los chips van de y=900 a y≈1236, cada uno de 640×96 px.
- «Registrarte ↓» va de y=1320 a y=1380.
- El logo va en blanco, abajo a la derecha, de y=1500 a y=1556.

**Texto literal de la imagen** (20 palabras)
- Titular: *Tus clientes de España y LATAM:* cada uno te paga con lo suyo.
- Chips: Valencia · Bizum | Monterrey · OXXO | Cali · Nequi
- Texto: Registrarte ↓

**Texto del anuncio**

Texto principal:
```text
Bizum en Valencia. OXXO en Monterrey. Nequi en Cali. Y tú, en Uluwatu.

Ya vendes a España y a Latinoamérica.
Y cada país paga distinto.
Y no todos tienen tarjeta, o no la prefieren.

PERO con tu enlace de Kunfupay, cada cliente elige cómo pagarte.
A ti te llega en euros o en dólares.

Si todavía no vendes, no es para ti.
Entra y mira si tu negocio encaja.
Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.
```
- **Título:** Valencia, Monterrey y Cali, con lo suyo
- **Descripción:** Bizum, OXXO y Nequi en el mismo enlace.
- **Botón:** Registrarte
- **Nombre en Meta:** HUB-BALI-E4 | N5 | Oferta | Ya vende a España y LATAM, listo | EST-LIMPIA-BOTON

### Pagar y retirar dinero en el hub

**Esto no entra en los 8 anuncios.** El ángulo de métodos de pago prohíbe nombrar la tarjeta y la cuenta de Kunfupay. Lo que sigue es para decidir si se abre otro ángulo.

**¿Suele ser un problema pagar o sacar dinero en Bali?** Sí. No porque no se pueda pagar, sino por la fricción de todos los días: coste, efectivo, logística y fraude. Quien llega con la tarjeta de su banco de siempre lo nota mucho; quien ya usa Wise o N26, bastante menos. Fuerza del conjunto: media.

- **Todo se cobra en rupias, por ley, también con tarjeta** (fuerte). https://www.bi.go.id/id/publikasi/peraturan/Pages/pbi_170315.aspx · https://en.wikivoyage.org/wiki/Indonesia
- **Mucho efectivo.**
  - En los negocios pequeños se paga mucho en efectivo, y algunos cobran entre un 2 % y un 5 % más con tarjeta (medio).
  - El pago sin contacto tiene un tope de alrededor de 1.000.000 IDR.
  - https://wise.com/au/blog/money-and-banks-in-indonesia · https://www.baliholidaysecrets.com/using-australian-cards-in-bali/
- **Cajeros.**
  - Cada retirada da unos 2,5–3 millones de IDR, unos 125–150 € (medio).
  - El cajero cobra entre 50.000 y 100.000 IDR por retirada a tarjetas extranjeras (débil). Según Wikivoyage, los de Danamon no cobran.
  - La víspera de Nyepi, muchos cajeros están apagados (fuerte).
  - https://en.wikivoyage.org/wiki/Indonesia · https://www.baliholidaysecrets.com/bali-atms/ · https://www.baliholidaysecrets.com/using-malaysian-cards-in-bali/ · https://en.wikivoyage.org/wiki/Bali · https://en.wikipedia.org/wiki/Nyepi
- **Coste del cambio.**
  - Un banco tradicional cobra alrededor de un 3 %. N26 Estándar, un 1,7 %. Wise España, gratis hasta 250 € al mes y luego un 2,69 %.
  - Ejemplo (cálculo propio): sacar 10 millones de IDR (unos 494 €) son 4 retiradas. Cuesta unos 6,6 € con Wise, 8,4 € con N26 y 14,8 € con un banco al 3 %, más lo que cobre cada cajero.
  - https://wise.com/es/pricing/card-fees · https://n26.com/es-es/usar-tarjeta-en-el-extranjero · https://wise.com/es/currency-converter/eur-to-idr-rate
- **Conversión dinámica** (te ofrecen cobrarte en tu moneda en vez de en rupias). Puede encarecer hasta un 6–7 %. Siempre hay que elegir rupias (medio). https://wise.com/au/blog/best-exchange-rate-on-bali-tips · https://wise.com/es/blog/donde-cambiar-euros-por-rupias-indonesias
- **Fraude y clonación de tarjetas.** Son frecuentes. Avisan el Reino Unido, Canadá y el Ministerio de Exteriores de España (fuerte). https://www.gov.uk/foreign-travel-advice/indonesia/safety-and-security · https://travel.gc.ca/destinations/indonesia · https://www.exteriores.gob.es/es/ServiciosAlCiudadano/Paginas/Detalle-recomendaciones-de-viaje.aspx?trc=Indonesia
- **Banco local y herramientas habituales** (fuerte).
  - BCA pide KITAS o KITAP.
  - La tarjeta de Wise no se emite a quien vive en Indonesia, y si te mudas no puedes pedir una de repuesto.
  - QRIS no funciona con tarjetas de España ni de LATAM.
  - https://www.bca.co.id/id/individu/produk/simpanan/tahapan · https://wise.com/help/articles/2968915/can-i-get-the-wise-card-in-my-country · https://www.bi.go.id/en/fungsi-utama/sistem-pembayaran/ritel/kanal-layanan/qris/default.aspx
- **Retirar a un banco indonesio.**
  - PayPal Indonesia no cobra por encima de 1.500.000 IDR.
  - Wise envía rupias a bancos y a monederos (GoPay, OVO, DANA).
  - La web de Kunfupay no menciona ni rupias ni bancos indonesios.
  - https://www.paypal.com/id/webapps/mpp/paypal-fees · https://wise.com/id/send-money/ · https://kunfupay.com/

**¿Merece la pena mencionar «una tarjeta para pagar en la moneda del lugar»?**

Veredicto: **beneficio real MEDIO, diferenciación DÉBIL.** La frase «en la moneda del lugar», por sí sola, es **débil**.

- Por ley todo cargo se hace en rupias, así que cualquier Visa ya paga en rupias. Lo que duele es el coste del cambio, las retiradas pequeñas con comisión, la conversión dinámica, el efectivo y el fraude. Eso solo se puede prometer con condiciones y cifras.
- Este público suele tener ya Wise, N26 o Revolut. Sin condiciones iguales o mejores, el mensaje no destaca. Las condiciones de Revolut no se pudieron verificar.
- **Posible palanca (interpretación, medio).** La tarjeta de Wise no se emite a quien vive en Indonesia. Si Kunfupay sí la emite a esas personas, eso pesa más que «la moneda del lugar».
- **La web de Kunfupay se contradice:**
  - Dice «Visa 100% digital… sin plástico» (https://kunfupay.com/personal/card), «Tarjeta física — Próximamente» (https://kunfupay.com/producto/wallet) y «virtual y física» (https://kunfupay.com/faq).
  - La wallet es «multimoneda en EUR y USD», y las maquetas salen en USD.
  - Sobre la conversión, dice a la vez que no cobra comisiones y que sí las cobra (las dos en /faq).
  - La web no habla de cajeros de forma explícita: menciona "Efectivo en +200 países" y, en la wallet, "En efectivo — Al instante", sin decir si es retirada en cajero, en red de pago en efectivo ni con qué coste [dato a validar].
- **Si se quiere probar:**
  - En otro ángulo (wallet o tarjeta), solo para Bali y Tailandia.
  - Mensaje «pagas con tu Visa estés donde estés», con el caso de pagar Gojek o Grab, que cobran en rupias (https://wise.com/au/blog/gojek-in-bali).
  - Nunca «en rupias», «sin comisiones» (la guía de marca lo veta: https://kunfupay.com/brand) ni «saca en el cajero».
  - Y nada de gastar cripto: en Indonesia está prohibida como medio de pago desde 2018 (https://en.wikipedia.org/wiki/Legality_of_cryptocurrency_by_country_or_territory).

**Preguntas abiertas para ese ángulo:**
1. En qué moneda está la tarjeta y qué margen cobra al pasar a rupias, también en fin de semana.
2. Si funciona en Indonesia: que no esté bloqueada por país, que tenga chip y PIN, y si Apple Pay o Google Pay funcionan allí.
3. Si existe tarjeta física y si sirve en cajeros: comisión, retiradas gratis y límites.
4. Si se emite y se envía a quien vive en Indonesia, y qué socio la emite.
5. Si la aceptan GoPay, OVO, Gojek y Grab.
6. Qué protección tiene contra el fraude: congelarla desde la app, avisos y 3DS.
7. Cómo se resuelven las contradicciones de la web: si es física o virtual, y si cobra o no comisión de conversión.
8. Qué significan "Efectivo en +200 países" y "En efectivo — Al instante": si es retirada en cajero o en una red de pago en efectivo, y con qué coste.

### Fuentes

**Hub, hora y lenguaje**
- https://en.wikipedia.org/wiki/Central_Indonesia_Time
- https://en.wikipedia.org/wiki/Bali
- https://en.wikipedia.org/wiki/Canggu
- https://en.wikipedia.org/wiki/Nyepi
- https://nomads.com/canggu
- https://nomads.com/ubud

**Stripe**
- https://stripe.com/global
- https://docs.stripe.com/declines/card
- https://docs.stripe.com/payments/payment-methods/overview
- https://docs.stripe.com/payments/bank-transfers
- https://docs.stripe.com/payments/oxxo
- https://docs.stripe.com/payments/bizum
- https://docs.stripe.com/payments/paypal
- https://docs.stripe.com/payments/pix
- https://docs.stripe.com/payments/stablecoin-payments
- https://stripe.com/en-es/newsroom/news/bridge-partners-with-visa

**Competencia y herramientas actuales**
- https://hotmart.com/es
- https://hotmart.com/es/herramientas/internacionalizacion
- https://hotmart.com/es/legal/terminos-de-uso
- https://dlocalgo.com/es/industria/vende-tus-cursos-online-y-mentorias-en-todo-el-mundo
- https://dlocalgo.com/es/pagos-internacionales
- https://www.paypal.com/es/business
- https://www.paypal.com/id/webapps/mpp/paypal-fees
- https://en.wikipedia.org/wiki/PayPal
- https://wise.com/id/multi-currency-account/
- https://kajabi.com/features/payments
- https://www.payoneer.com/es/about/pricing/

**Biblioteca de anuncios de Meta (Indonesia, anuncios activos, consultada el 28-10-2026)**
- Smiles: https://www.facebook.com/ads/library/?id=3527363820735488
- Tab for Business: https://www.facebook.com/ads/library/?id=1282765327371265
- WireNations: https://www.facebook.com/ads/library/?id=847910221725375
- Karta: https://www.facebook.com/ads/library/?id=997133103395346
- Karta: https://www.facebook.com/ads/library/?id=1416736439956923
- «Digital nomad running…?»: https://www.facebook.com/ads/library/?id=1393577762762318
- Taxhackers («Digital Nomads, attention»): https://www.facebook.com/ads/library/?id=1453952193409818
- Home Visa Solutions: https://www.facebook.com/ads/library/?id=1620730646202739
- IncorpOS: https://www.facebook.com/ads/library/?id=1694937338931596
- MBiA: https://www.facebook.com/ads/library/?id=4596199407313689
- ClientZone: https://www.facebook.com/ads/library/?id=29129042550067565

**Kunfupay**
- https://kunfupay.com/
- https://kunfupay.com/cobros-global
- https://kunfupay.com/producto/api
- https://kunfupay.com/tarifas
- https://kunfupay.com/faq
- https://kunfupay.com/personal/card
- https://kunfupay.com/producto/wallet
- https://kunfupay.com/brand
- https://kunfupay.com/sensei-prueba-gratis

**Pagar y retirar dinero en Bali**
- https://www.bi.go.id/id/publikasi/peraturan/Pages/pbi_170315.aspx
- https://www.bi.go.id/en/fungsi-utama/sistem-pembayaran/ritel/kanal-layanan/qris/default.aspx
- https://en.wikivoyage.org/wiki/Indonesia
- https://en.wikivoyage.org/wiki/Bali
- https://www.baliholidaysecrets.com/bali-atms/
- https://www.baliholidaysecrets.com/using-malaysian-cards-in-bali/
- https://www.baliholidaysecrets.com/using-australian-cards-in-bali/
- https://wise.com/au/blog/money-and-banks-in-indonesia
- https://wise.com/au/blog/indonesia-qr-code-payment
- https://wise.com/au/blog/best-exchange-rate-on-bali-tips
- https://wise.com/au/blog/gojek-in-bali
- https://wise.com/es/blog/donde-cambiar-euros-por-rupias-indonesias
- https://wise.com/es/pricing/card-fees
- https://wise.com/es/currency-converter/eur-to-idr-rate
- https://wise.com/help/articles/2968915/can-i-get-the-wise-card-in-my-country
- https://wise.com/id/send-money/
- https://n26.com/es-es/usar-tarjeta-en-el-extranjero
- https://www.bca.co.id/id/individu/produk/simpanan/tahapan
- https://www.gov.uk/foreign-travel-advice/indonesia/safety-and-security
- https://travel.gc.ca/destinations/indonesia
- https://www.exteriores.gob.es/es/ServiciosAlCiudadano/Paginas/Detalle-recomendaciones-de-viaje.aspx?trc=Indonesia
- https://en.wikipedia.org/wiki/Legality_of_cryptocurrency_by_country_or_territory

### Antes de publicar

- **Biblioteca, antes de producir.** Buscar en Indonesia, solo anuncios activos: OXXO, SPEI, Nequi, Bizum, «Mercado Pago», «métodos de pago», «link de pago», «pasarela de pago», Gumroad, Stan Store, Payhip, Teachable y Circle. Si algún anuncio nombra el método de quien paga o usa la diferencia horaria, se revisan G2, V2, E2 y E4 antes de publicar. Refrescar todo el análisis antes del 27-12-2026.
- **Quién puede registrarse.** La web solo nombra España y Latinoamérica. Confirmar por escrito con el equipo que Kunfupay acepta vendedores con residencia en Indonesia. Si no se confirma, el conjunto de Bali no sale.
- **Métodos y landing.** Confirmar que quien vende desde Bali puede ofrecer Bizum, OXXO, SPEI, Nequi, PSE, Mercado Pago y PayPal (este, solo en México), y la transferencia desde su banco en pesos colombianos (G1). Confirmar también que cada país ve el método que le dan los anuncios. La landing tiene que enseñarlos y decir que se acepta a quien vive en Bali.
  - G1: si no se confirma Nequi para Colombia, o el vídeo «¿Cómo te pago?» lo contradice, se quita Nequi de sus dos líneas («Él prefiere pagar desde su banco, en pesos.» y «Te paga por transferencia, en pesos colombianos.»).
  - G1: si no se confirma la transferencia en pesos colombianos, «Él prefiere pagar con Nequi o desde su banco, en pesos.» pasa a «Él prefiere pagar con Nequi, en pesos.», y «Te paga con Nequi o por transferencia, en pesos colombianos.» pasa a «Te paga con Nequi, en pesos colombianos.».
  - G1: si no se confirma ni Nequi ni la transferencia en pesos colombianos, G1 no sale y su hueco se pausa en los 4 hubs.
  - E2: PayPal solo sale en la página de pago real de México. Confirmar con producto que el vendedor no necesita su propia cuenta de PayPal para que salga en su enlace. Si la necesita, se quita el chip «PayPal» de Querétaro (se rehacen los dos tamaños) y la línea «En México, también con PayPal.».
- **Moneda del cliente.** Confirmar con producto que el cliente paga en su moneda local con Nequi, SPEI y la transferencia desde su banco, aunque el producto esté en euros o en dólares. Si no se confirma, se quitan «en pesos» y «en pesos colombianos» de G1, y «en pesos» de V1 (guion y texto), y el título de G1 pasa a «Medellín elige cómo pagarte».
- **OXXO, tope.** Confirmar el tope de OXXO en Kunfupay. El taller de E1 tiene que costar menos.
- **OXXO, plazo.** Confirmar cuánto tarda en confirmarse un pago en OXXO con Kunfupay. Si puede pasar de unas horas, en E1 «Es para tu taller en directo del jueves.» pasa a «Es para tu taller en directo.».
- **E3, páginas de pago.** Comprobar que la página de México queda recortada al selector y a las casillas de SPEI y Mercado Pago, sin el logo cortado de OXXO, sin tarjetas ni PayPal y sin tapar nada. Legal revisa los logos y las banderas que quedan a la vista en las dos páginas (en la de España, Bizum, Visa, Mastercard, Apple Pay, Google Pay y SEPA). Si no los autoriza, E3 no pasa (ver «Piezas que no pasan»). Nunca se tapan logos.
- **Cripto.** Este conjunto se entrega en Indonesia, donde la cripto está prohibida como medio de pago desde 2018 (ver «Pagar y retirar dinero en el hub»). Por eso ningún texto, guion, locución ni subtítulo de Bali la nombra, y V1 y V2 se graban sin esa toma, también en la versión de `GUIONES-HUBS.md`, apartado 4. G1 nombra la cripto en su vídeo, así que no sale en Bali tal cual: antes de lanzar, G1 se sustituye en los 4 hubs o los 4 esperan a una versión de su vídeo sin la cripto, porque nunca se publica con menos de 8. Comprobar también si el vídeo de la Infografía (G2) nombra la cripto; si la nombra, pasa lo mismo.
- **Comparativas.** Revisión legal de G2, V1, V2, E1, E2 y E4 (las piezas que nombran Stripe, PayPal u OXXO). Comprobar las fuentes de Stripe y PayPal el día de publicar. Comprobar con una compra de prueba desde España que el checkout de PayPal no ofrece Bizum, desde México que no ofrece SPEI ni OXXO y desde Colombia que no ofrece Nequi ni PSE. Guardar las capturas con fecha. Si alguno no se comprueba, E2 no sale (su imagen y su texto dicen que con el enlace de PayPal esos métodos no están) y su hueco se pausa en los 4 hubs. Si el que falla es SPEI, en V1 se quita además PayPal del rótulo, del guion, del texto y de la persona («En tu Stripe de España no está.»), también en `GUIONES-HUBS.md`, apartado 4.
- **Logos en G2.** El vídeo de la Infografía se deja como está: sus avisos de «Nueva venta» llevan la nota «Simulación. Cifras a modo de ejemplo.». Legal revisa antes de lanzar los logos de métodos que salen en él.
- **Oferta de E4.** Ningún E4 lleva precio ni oferta. Si el equipo cierra una única oferta para los 4 hubs, va bajo «Registrarte ↓» y antes del cierre del texto, en los 4 E4 a la vez, sin «gratis» ni «0 %».
- **Piezas que no pasan.** Si una pieza no pasa en un hub, ese hueco se pausa en los 4 hubs hasta que haya sustituta. Nunca se publica con menos de 8 anuncios.