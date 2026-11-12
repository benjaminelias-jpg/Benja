# Kunfupay · Funnel self-service con apps gratis (v1)

Método: Ramiro Cubria (Content Capital), adaptado a producto self-service + cerebro de comunicación Kunfupay.
Estado: borrador v1 · 12/11/2026 · todo dato no confirmado va como `[PENDIENTE]`.

---

## 0. Lo primero: 5 avisos antes de construir

1. **Ramiro usa humanos en el DM. Vosotros queréis quitarlos.** El método funciona porque un setter diagnostica. Si se quita, ese trabajo lo tienen que hacer tres cosas: la pregunta de calificación en el DM automático, el onboarding dentro de la app y la secuencia de nutrición. Si no, entran registros que nunca cobran.
2. **No apaguéis el funnel de ventas actual.** Se mantiene en paralelo y recibe los leads "grandes" que detecte el self-service (ver §3, paso 4). Se mide 90 días y se decide con datos (regla 70-20-10), no antes.
3. **Una app gratis atrae cazadores de gratis.** El filtro antipodridos aquí no es esconder el cómo, es **elegir apps que solo usa quien ya vende online**. Un automatizador de DMs lo usa cualquiera; uno que manda el link de pago del curso, solo el infoproductor. Cada app tiene que tener un "siguiente paso natural" que es cobrar con Kunfupay.
4. **Self-service choca con "revisamos cada caso".** La web dice que se revisa cada caso antes de activar la cuenta, y hay KYC. La app gratis puede ser 100% self-service; **la activación del cobro no**. Hay que decidir si la revisión es automática o tarda horas. `[PENDIENTE: tiempo y criterio de aprobación]`
5. **No digáis "ManyChat gratis" en los anuncios.** Es marca de terceros (comparar sí, usar su marca como nombre de vuestro producto no). Se dice: "automatiza tus DMs gratis" / "comentan y les llega solo". En orgánico, "una alternativa a ManyChat" en el texto es aceptable; en el gancho, no.

**Lo mejor que tenéis:** el propio funnel se hace con la app que regaláis. Cada DM que recibe el lead dice "este mensaje te llegó con la app que te vamos a dar". El producto se demuestra en el mismo momento en que se entrega. Eso es la narrativa de autoridad de Ramiro hecha producto.

---

## 1. Las apps como carnada (lead magnets)

| App | Quién la usa (filtro) | Viralidad | Puente a cobrar con Kunfupay | Prioridad |
|---|---|---|---|---|
| **Auto-DM por comentario** (la "alternativa a ManyChat") | Creadores que venden por Instagram | Muy alta: demo en vivo en el propio Reel | En el DM puedes mandar tu link de pago de Kunfupay | 1 · lanzamiento |
| Link de pago en 1 minuto (sin web) | Quien vende cursos/mentorías por DM | Alta | Es directamente el producto | 2 |
| Calculadora "¿cuánto de esta venta es tuyo?" | Quien ya vende y no sabe qué le queda | Media-alta (se comparte el resultado) | Muestra el resultado con y sin Kunfupay `[PENDIENTE: validar cuentas con regla 9]` | 3 |
| Página de venta / link-in-bio con checkout | Infoproductores | Media | Checkout de Kunfupay integrado | 4 |

`[PENDIENTE: qué apps tiene ya el equipo de desarrollo y fechas reales]`

---

## 2. El funnel completo

```
[Reel nicho, orgánico + Follow Me Ads]
        ↓ "Comenta APP y te la paso"
[DM automático — enviado con la propia app de Kunfupay]
   "Este mensaje te llegó solo. Lo hace la app que te voy a dar."
   Pregunta 1 (botones): ¿Ya vendes algo online?  Sí / Todavía no
        ↓                                   ↓
   [Sí] ¿Qué vendes? Curso · Mentoría ·    [Todavía no] → link a la app igual,
        Comunidad · Otro                      etiqueta "No_vende" (nutrición
        ↓                                     larga, no se empuja a cobrar)
[Link de registro directo a la app]  (UTM + etiqueta de origen)
        ↓
[Onboarding in-app: activar la app gratis en < 5 min]   ← métrica de activación
        ↓
[Momento puente: dentro de la app]
   "¿Y cuando te escriban para comprar? Mándales tu link de pago."
        ↓
[Activar cobro: KYC + revisión]  → primera venta
        ↓
[Si "vende" + volumen alto declarado] → alerta al equipo de ventas actual (híbrido)
```

**Nutrición sin setter (sustituye al humano de Ramiro):**
- Día 0: DM con link + vídeo de 30 s "cómo activarla".
- Día 1: si no activó → DM "¿te atascaste? Responde con una palabra y te ayudamos" (aquí sí puede contestar una persona: es barato y salva registros).
- Día 3, 7, 14: emails/DMs de valor (un caso, un truco de la app, un error típico al cobrar). Uno de cada tres menciona cobrar con Kunfupay.
- Ciclo de maduración esperable (Ramiro): 90-127 días. No juzgar el canal en el mes 1.

**Comunidad gratuita (opcional, fase 2):** canal o grupo de usuarios de las apps (Telegram/WhatsApp/Skool): un truco semanal, novedades de apps, debate. No es necesaria para arrancar porque el lead magnet ya es la app, pero es la que madura a los 90-127 días.

---

## 3. Trazabilidad (lo que manda sobre las corazonadas)

- **Etiqueta por Reel** (en la app de DMs y en la UTM): `Inbound_Reel_S1_D03_AutoDM_Demo`
  - S = semana, D = día, después app y concepto.
- **Panel único** (Notion o Sheets) con, por Reel:
  - Vistas · comentarios con palabra clave · DMs enviados · registros · activaciones de la app · cuentas con cobro activado · primera venta.
- **Métricas de objetivo** (no son promesas):

| Paso | Métrica | Objetivo inicial |
|---|---|---|
| Anuncio | Coste por seguidor calificado (Follow Me Ads) | ≤ 1 € `[PENDIENTE: confirmar que "1 €" se refiere a esto]` |
| Reel | Comentario con palabra clave / vistas | `[PENDIENTE: medir 2 semanas]` |
| DM | Clic al registro / DM enviado | ≥ 40 % |
| App | Activación / registro | ≥ 50 % |
| Negocio | Cobro activado / activación | `[PENDIENTE]` — es la que decide si el canal vale |

- **Tres fuentes cualitativas semanales:** respuestas a la pregunta del DM, mensajes de soporte de la app, y los "¿te atascaste?" contestados.
- **70-20-10** a partir del mes 3: 70 % ángulos validados, 20 % variaciones, 10 % apuestas.

---

## 4. Anuncios: Follow Me Ads a ~1 €

1. **Semanas 1-2 solo orgánico.** Se publica todo el calendario sin pauta. Sin eso no sabes qué amplificar (el anuncio es turbo, no salvavidas).
2. **Desde la semana 3:** se eligen los 2-3 Reels con más comentarios de palabra clave de los últimos 15 días.
3. Objetivo: tráfico al perfil de Instagram (o interacción si el objetivo es que comenten). 5-10 €/día por Reel.
4. Métrica única: coste por seguidor calificado y por registro. Se apaga lo que Meta no quiere gastar; no se toca un conjunto en 7 días.
5. **El perfil tiene que estar impecable antes** (ver §5).
6. Público: amplio + España/LATAM `[PENDIENTE: países objetivo]`. Sin segmentar por intereses al principio.

---

## 5. Optimización del perfil

- **Nombre (campo buscable):** `Kunfupay | Apps gratis para creadores` `[PENDIENTE: decidir]`
- **Bio (3 líneas):**
  ```
  Apps gratis para quien vende cursos y mentorías.
  Automatiza tus DMs. Cobra sin web.
  👇 Pruébala gratis
  ```
- **Link:** directo al registro de la app con UTM `utm_source=ig_bio`.
- **3 Reels fijados:**
  1. Demo del auto-DM ("comenta APP y mira cómo te llega").
  2. "Qué es Kunfupay en 30 segundos" (el guion "Nueva venta" ya aprobado sirve).
  3. Caso real `[PENDIENTE: caso con datos y permiso]`.
- **Destacadas:** Apps · Cómo funciona · Casos · Preguntas.
- **Respuesta automática a "info", "precio", "app"** en DM con la misma app.
- Feed: ritmo mínimo de 4-5 Reels/semana antes de pautar.

---

## 6. Calendario de contenido (4 semanas)

Mezcla: 50 % TOFU/apps · 20 % problema · 15 % solución (demo) · 10 % producto/caso · 5 % mentalidad y autoridad. Una palabra clave por Reel. Un CTA por pieza.

| Sem | Día | Ángulo | Pieza | Palabra clave | Etiqueta |
|---|---|---|---|---|---|
| 1 | L | Solución (demo) | G1 · "Comenta y mira cómo te llega" | APP | S1_D01_AutoDM_Demo |
| 1 | M | TOFU | G2 · "Te escriben 40 personas y contestas a 6" | APP | S1_D02_AutoDM_40 |
| 1 | X | Problema | G3 · "Olor a venta en tus DMs" | APP | S1_D03_OlorAVenta |
| 1 | J | Autoridad | G6 · "Lo construimos para nosotros" | APP | S1_D04_Laboratorio |
| 1 | V | TOFU | G4 · "Las 3 apps que te cobran por algo que puede ser gratis" | APP | S1_D05_3Apps |
| 2 | L | Solución | Demo: configurar la palabra clave en 60 s (pantalla) | APP | S2_D08_Config60 |
| 2 | M | TOFU | Variación de G2 con otro nicho (coach) | APP | S2_D09_AutoDM_Coach |
| 2 | X | Mentalidad | G5 · "No tienes tiempo de contestar. Por eso pierdes ventas" | APP | S2_D10_Tiempo |
| 2 | J | Problema | "Te piden el link y tardas 3 horas" (link de pago) | LINK | S2_D11_Link3h |
| 2 | V | Producto | "Nueva venta" (guion aprobado, ya existe) | — (CTA: entra y mira si encaja) | S2_D12_NuevaVenta |
| 3 | L | TOFU | Reel ganador de S1, iteración "caleidoscopio" | APP | S3_D15_Iter1 |
| 3 | M | Solución | Demo app 2: link de pago en 1 minuto | LINK | S3_D16_LinkDemo |
| 3 | X | Problema | Variación del mejor de problema | APP | S3_D17_Iter2 |
| 3 | J | Autoridad | Experimento de la semana con el error incluido (datos reales del panel) | APP | S3_D18_Bitacora |
| 3 | V | TOFU | Respuesta a un comentario real (green screen) | APP | S3_D19_Comentario |
| 4 | L–V | 70-20-10 | Repetir los 2 ángulos con más registros + 1 variación + 1 apuesta nueva | — | S4_… |

Follow Me Ads: desde S3, con los 2-3 mejores de S1-S2.

---

## 7. Guiones (formato teleprompter)

Voz: equipo ("nosotros"). Ninguno usa claims fiscales: el TOFU vende la app, no el MoR. Duración 20-40 s.

### G1 · Demo en vivo (Solución)

```
Vendes cursos por Instagram.
Mira lo que pasa si comentas APP en este vídeo.

Te llega un mensaje.
Solo.
En segundos.

Ese mensaje no lo escribió nadie.
Lo mandó una app que hicimos nosotros.

Y te la vamos a dar.
Gratis.

Alguien comenta.
Le llega tu mensaje.
Y si quiere comprar, le llega tu link de pago.
Sin que tú estés despierto.

Comenta APP.
Y mira cómo te llega.
```

### G2 · "40 te escriben, contestas a 6" (TOFU)

```
Si vendes por Instagram, esto te ha pasado.

Subes un reel.
Funciona.
Te escriben cuarenta personas.

Y contestas a seis.
Porque estabas grabando.
O durmiendo.
O viviendo, que también.

Los otros treinta y cuatro no esperan.
Se van.

PERO hay otra forma.
Que cada comentario reciba tu mensaje al momento.
Solo.

Esa app la hicimos nosotros.
Y es gratis.

Comenta APP y te la paso.
```

### G3 · "Olor a venta" (Problema — da el qué, no el cómo)

```
Si vendes cursos y tus DMs no convierten, puede que sea esto.

Tus mensajes huelen a venta.

Alguien te pregunta algo.
Y tú le contestas con el precio.
Y el link.
Y "plazas limitadas".

Huele.
Y se va.

Los que más venden por DM no empiezan vendiendo.
Empiezan preguntando.

Nosotros automatizamos justo esa primera pregunta.
Para que nadie se quede sin respuesta.
Y nadie huela a venta.

Comenta APP y te la paso.
```

### G4 · Las 3 apps (TOFU, lista)

```
Vendes cursos online.
Y probablemente pagas tres apps cada mes.
La tercera puede ser gratis.

Una para tu web.
Otra para cobrar.
Y otra para contestar los DMs solos.

Esa última, la de los DMs, la hicimos nosotros.
Comentan una palabra.
Les llega tu mensaje.
Y tu link de pago.

Gratis.
Sin truco de prueba de siete días.

Comenta APP y te la paso.
```
`[PENDIENTE: confirmar que la app es gratis sin límite de tiempo; si hay límite, se quita "sin truco de prueba"]`

### G5 · Mentalidad: "no tienes tiempo"

```
"No tengo tiempo de contestar los DMs."
Si vendes cursos, lo has dicho.

Y es verdad.
No tienes tiempo.

PERO el problema no es el tiempo.
Es que contestas tú.
A cada uno.
Lo mismo.
Cuarenta veces.

Lo que se repite, se automatiza.
Lo que es tuyo, la conversación de verdad, lo haces tú.

La primera parte te la regalamos.

Comenta APP y te la paso.
```

### G6 · Narrativa de autoridad: el laboratorio

```
Somos una pasarela de pago para quien vende cursos.
Y nos pasaba lo mismo que a ti.

Nos escribía gente.
No llegábamos.
Perdíamos ventas.

Así que nuestro equipo hizo una app.
Comentan una palabra.
Les llega el mensaje.
Solo.

Funcionó.
Por eso este mensaje que te va a llegar ahora lo manda ella.

Y la vas a tener tú.
Gratis.

Comenta APP.
```
`[PENDIENTE: confirmar que la historia es real — si no lo es, este guion no se graba]`

---

## 8. DM automático (texto)

**Mensaje 1 (al comentar):**
> ¡Aquí la tienes! 👇
> Por cierto: este mensaje te llegó solo. Lo mandó la app que te vamos a dar.
> Antes de pasarte el acceso: ¿ya vendes algo online?
> [Sí] [Todavía no]

**Si "Sí":**
> ¿Qué vendes?
> [Curso] [Mentoría] [Comunidad] [Otro]
> → "Perfecto. Aquí tienes tu acceso gratis: [link registro + UTM]. En 5 minutos la tienes funcionando."

**Si "Todavía no":**
> "Te la paso igual: [link]. Cuando empieces a vender, te va a ahorrar horas."

**Día 1 sin activar:**
> "¿Te atascaste con la app? Contesta AYUDA y te echamos una mano."

---

## 9. Pendientes para el equipo

1. Qué apps existen ya y cuándo sale la primera (fecha real de lanzamiento del auto-DM).
2. ¿La app gratis es gratis para siempre o tiene límite? (afecta a G4).
3. Qué significa "1 euro o menos": ¿coste por seguidor, por registro o CPM?
4. ¿La activación del cobro tiene revisión manual? ¿Cuánto tarda?
5. Países objetivo de los anuncios.
6. ¿Graba el equipo/fundador o UGC? (cambia "nosotros" por "ellos").
7. ¿La historia de G6 es real?
8. Caso real con datos y permiso para el Reel fijado nº 3.
9. Umbral para pasar un lead "grande" al equipo comercial.
