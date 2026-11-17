# Kunfupay · Estrategia 90 días, calendario y SOPs (v1)

17/11/2026 · Objetivo a 90 días: que la app sea 100 % self-service.
Fuentes: Daneris (SQL de producción, 19/08–17/11/2026), Kommo (pipelines 17/08–16/11), Meta Ads (cuenta Kunfupay, últimos 90 días).

---

## 1. Lo que dicen los datos (punto de partida)

### Activación (Daneris)
| Dato | Valor |
|---|---|
| Cuentas de vendor nuevas en 90 días | 4.619 |
| Hicieron su primera venta | 216 (4,7 %) |
| Activación real a 30 días (cohorte madura) | 4,6 % |
| Mediana registro → primera venta | 6,8 días |
| Altas con KYC y país | 1.381 (30 %) |
| Activan si tienen KYC con país | España 20,9 % · LATAM 9,1 % · resto 9,9 % |
| Activan si NO tienen KYC | 1 % |

| Grupo | Altas | Activan | Volumen cobrado | Volumen por vendor activo |
|---|---|---|---|---|
| España | 473 | 99 | 147.215 € | ≈ 1.487 € |
| LATAM | 615 | 56 | 279.387 € | ≈ 4.989 € |

- Ticket medio 32 €, mediana 12 €. Primera venta: media 84 €, mediana 10 €.
- LATAM que más activa: Perú (15 de 86), Venezuela (7), Colombia y Ecuador (6 cada uno).
- Ojo: el país solo se conoce en el 30 % de las altas (sale del KYC). El volumen es cobro bruto de los vendors, no ingreso de Kunfupay.

**Conclusión 1. El cuello de botella del self-service es el KYC, no el registro.** Quien completa la verificación activa entre 9 y 21 veces más que quien no. Todo el funnel tiene que empujar a "verificarse", no a "registrarse".
**Conclusión 2. LATAM activa la mitad que España, pero cada vendor activo factura más de 3 veces más.** LATAM merece presupuesto, con filtro fuerte.
**Conclusión 3. Quien activa lo hace en la primera semana.** La nutrición fuerte va en los días 0-7.

### Funnel directo (Kommo, pipeline "Kunfupay Registro", 4.414 leads)
- Logrado con éxito: 1.325 · Email marketing: 671 · Lead frío: 511 · Lead basura: 276 · Ventas perdidas: 292.
- **Tienda rechazada: 481 · Tienda aprobada: 209.** De las tiendas revisadas, ~70 % se rechazan. Es tráfico que no encaja y que en self-service no habría ni vendedor que lo filtrara.
- Pipeline "Contacto Redes" (DMs de Instagram): solo 42 leads. **El canal de DM está casi sin usar.** Es la oportunidad del Auto-DM.

### Meta Ads (últimos 90 días, coste por registro completado)
| Campaña | Gasto | Registros | Coste por registro |
|---|---|---|---|
| Hubs · métodos de pago | 516 € | 51 | 10,11 € |
| Tipsters v2 (pausada) | 466 € | 25 | 18,65 € |
| Conversión · métodos de pago (pausada) | 636 € | 24 | 26,51 € |
| Testeo ES · adquisición (fiscal + métodos de pago) | 5.046 € | 170 | 29,68 € |
| EU fiscal (pausada) | 429 € | 7 | 61,23 € |
| Adquisición 12/11 | 447 € | 6 | 74,43 € |
| Andorra v2 (pausada) | 1.866 € | 25 | 74,63 € |
| Remarketing Kunfupay | 108 € | 1 | 107,91 € |

- Con ~30 € por registro y ~4,6 % de activación, **cada vendor activo cuesta del orden de 650 € en el funnel directo** (estimación, cruza dos fuentes distintas).
- "Métodos de pago" es el ángulo más barato por registro. Fiscal y Andorra, los más caros.
- El remarketing actual casi no convierte: hay que rehacerlo (ver §5).

---

## 2. Decisiones de estrategia

1. **Métrica norte: cuentas que completan el KYC y hacen la primera venta sin hablar con nadie.** Medir cada semana: registros → KYC completado → primera venta en 7 días → % sin contacto humano.
2. **Todo el contenido termina empujando a un solo siguiente paso.** TOFU: comenta por la herramienta. MOFU: usa la herramienta y conecta tu link de pago. BOFU: verifícate y cobra.
3. **El Auto-DM es la puerta.** Todos los anuncios de esta fase son del Auto-DM. Kunfupay entra después, dentro del funnel (DM, email, retargeting).
4. **Público: quien ya vende cursos o mentorías y cobra con Stripe.** Fuera: e-commerce, negocios locales, productos físicos, contenido para adultos.
5. **Países:** España + LATAM con filtro. LATAM solo con mensajes que filtran ("si ya vendes", "si cobras con Stripe") y empezando por los países con activación probada: Perú, Colombia, Ecuador y México [México sin dato propio aún: medir].
6. **Perfil de Instagram congelado** (decisión de la empresa): no se toca bio, nombre ni destacadas. Lo que sí se hace: comentario fijado en cada Reel, captions con palabras clave, historias y link sticker.
7. **El MVP del Auto-DM es básico:** antes de pautar, probar el flujo completo 10 veces (comentario → DM → link → registro). Si el DM falla, el anuncio quema dinero.

---

## 3. Presupuesto

| Funnel | €/día | Estructura |
|---|---|---|
| Follow Me Ads (Auto-DM) | 100 | 1 campaña tráfico al perfil · 2 conjuntos: ES 50 € · LATAM 50 € · 3-5 Reels por conjunto |
| Remarketing | 20 | 1 campaña · audiencias de §5 · excluir vendors activos |
| Funnel directo | 300 | Se mantiene. Reasignar dentro hacia "métodos de pago" (10-30 € por registro) frente a fiscal/Andorra (61-75 €) |

Reglas de pauta (Follow Me Ads):
- Cada Reel corre 48-72 h en orgánico. Se pauta si está en el tercio superior de la cuenta en comentarios con palabra clave por cada 1.000 vistas.
- No tocar un conjunto en 7 días. Se apaga lo que Meta no quiere gastar.
- Métrica: coste por seguidor y coste por comentario con palabra clave. Después, cuántos de esos llegan a KYC.

---

## 4. Calendario (4 semanas · 1 pieza al día, de lunes a viernes)

Semanas 1-2: los 10 guiones de `GUIONES-TOFU-AUTODM-V1.md`. Semanas 3-4: iteraciones de los ganadores + MOFU/BOFU para empujar a KYC.

| Sem | Día | Pieza | Etapa | CTA | Graba |
|---|---|---|---|---|---|
| 1 | L | G1 · Cierras el carrito y 60 DMs | TOFU problema | Comenta DM | Tú |
| 1 | M | G3 · Así se llena la agenda desde un reel | MOFU solución | Comenta AGENDA | Tú |
| 1 | X | G5 · Tu closer filtra en vez de cerrar | TOFU problema | Comenta DM | 2 personas del equipo |
| 1 | J | G8 · Somos una pasarela de pago | Autoridad | Comenta DM | Founder o equipo |
| 1 | V | G9 · ¿Un ManyChat gratis? ¿Dónde está el truco? | Filtro / objeción | Comenta DM | Tú |
| 2 | L | G2 · La factura sube cuando te haces viral | TOFU problema | Comenta DM | Tú |
| 2 | M | G10 · Los 3 mensajes que llenan una agenda | MOFU lista | Comenta DM | Equipo |
| 2 | X | G4 · Tus DMs huelen a venta | TOFU problema | Comenta DM | Tú |
| 2 | J | G6 · Lunes abres carrito… | TOFU historia | Comenta DM | Equipo |
| 2 | V | G7 · "Ya probé ManyChat y no me funcionó" | Mentalidad | Comenta DM | Tú |
| 3 | L | Iteración del ganador de S1-S2 (otra persona, otro set) | TOFU | Comenta DM | Equipo |
| 3 | M | "Del comentario a la venta sin salir del DM": tu link de pago dentro del mensaje | MOFU solución | Comenta DM | Tú (pantalla) |
| 3 | X | "Por qué te pedimos verificarte (y cuánto tarda)" [PENDIENTE: tiempo real] | BOFU activación | Entra y verifícate (link en comentario fijado) | Equipo |
| 3 | J | "Por qué una pasarela regala herramientas" (equipo, oficina) | Autoridad / humano | Síguenos | Founder |
| 3 | V | Respuesta a un comentario real de la semana | Objeción | Comenta DM | Tú |
| 4 | L | Iteración del 2.º ganador | TOFU | Comenta DM | Equipo |
| 4 | M | G3 adaptado a LATAM (país con más registros) | MOFU | Comenta AGENDA | Persona LATAM del equipo si la hay |
| 4 | X | "Nueva venta" (guion aprobado) | BOFU Kunfupay | Entra y mira si tu negocio encaja | UGC / equipo |
| 4 | J | Caso real con datos [PENDIENTE: caso con permiso] | BOFU prueba social | Escríbenos AGENDA | Cliente / equipo |
| 4 | V | Lo que aprendimos en un mes regalando un auto-DM (datos reales del panel) | Autoridad | Comenta DM | Tú |

Historias (todos los días, de lunes a viernes):
- L: encuesta "¿Cuántos DMs se te quedan sin contestar?" → a quien vota, DM con la app.
- M: sticker "Responde DM y te paso la app".
- X: captura real de un usuario (con permiso) o del panel de la app.
- J: detrás de cámaras del equipo.
- V: caja de preguntas → las respuestas son el Reel de respuesta a comentario de la semana siguiente.

---

## 5. Recuperación (remarketing 20 €/día + email)

Audiencias, por prioridad:
1. **Registrados sin KYC completado** (lista de clientes, actualizar cada semana). Mensaje: "te falta un paso para cobrar". Es la audiencia que más mueve la métrica norte.
2. Comentaron por la herramienta y no se registraron (interacción con Instagram, 30 días).
3. Vieron el 75 % de un Reel (30 días). Mensaje: qué es Kunfupay ("Nueva venta").
- Excluir siempre a los vendors con primera venta.

Email a registrados (los días 0-7 son los que deciden):
- Día 0: bienvenida y cómo usar el Auto-DM.
- Día 1: "te falta verificarte para mandar tu link de pago".
- Día 3: quiénes somos, por y para el creador.
- Día 5: las otras herramientas gratis (landings, email).
- Día 7: cobrar con Kunfupay: te olvidas de los impuestos de cada venta.
- Día 14: tu account manager: responde y te ayudamos.

---

## 6. SOPs

### SOP 1 · Lanzar una herramienta nueva (se hereda a landings, email y lo que venga)
1. Definir en una línea el dolor del gremio que resuelve, dicho con su jerga (carrito, closer, lanzamiento, Hotmart).
2. Comprobar que solo le sirve a quien ya vende. Si le sirve a cualquiera, buscar el ángulo que la ata a vender.
3. Elegir la palabra clave (nombra la herramienta: DM, LANDING, EMAIL). Una por herramienta.
4. Crear el flujo del Auto-DM: entrega inmediata → recurso extra + 1 pregunta en segundo plano → etiqueta.
5. Escribir el kit de 10 piezas: 5 TOFU problema · 2 MOFU solución · 1 autoridad · 1 objeción/filtro · 1 mentalidad.
6. Nomenclatura de etiqueta: `Inbound_Reel_S{semana}_D{día}_{Herramienta}_{Concepto}`.
7. Probar el flujo 10 veces antes de publicar.

### SOP 2 · Guion TOFU (atrae al que ya vende)
- Objetivo: comentario con palabra clave de alguien que ya vende.
- Estructura: situación del gremio (0-3 s) → coste del problema (3-15 s) → giro con "PERO" (15-25 s) → la estrategia en una frase, el qué y no el cómo (25-35 s) → herramienta gratis → CTA.
- Reglas: jerga del gremio en el primer segundo · "gratis" solo al final · nada de "comenta y mira qué pasa" ni "te responde un robot" · ManyChat como referencia conocida, nunca como algo nuevo · 20-40 s · ≤ 20 líneas.
- Test: ¿lo entendería alguien que no vende? Si sí, reescribir.

### SOP 3 · Guion MOFU (enseña la estrategia y lleva a usar la herramienta)
- Objetivo: que use la herramienta y conecte su link de pago.
- Estructura: promesa con bucle abierto ("y el tercero casi nadie lo pone") → pasos numerados en pantalla → el paso que nadie hace al final → CTA.
- Aquí sí se enseña el cómo (ángulo solución). Pantalla real de la app, nunca de terceros.
- 35-60 s.

### SOP 4 · Guion BOFU (Kunfupay, KYC y primera venta)
- Objetivo: verificarse y cobrar.
- Se rige por el cerebro de Kunfupay: "le cobras con Kunfupay", bloque de credibilidad ("la única pasarela de España que funciona como Merchant of Record… somos tus representantes en cada venta"), línea de honestidad cuando se nombra Hacienda, sin claims 🔴.
- Tipos: guiones aprobados (Nueva venta, Tres motivos…), activación ("por qué verificarte"), caso real con datos.
- CTA: "Entra y mira si tu negocio encaja" o "Escríbenos AGENDA".

### SOP 5 · CTAs (uno por pieza, siempre en la última línea)
| Tipo | Frase | Cuándo |
|---|---|---|
| Herramienta | "Comenta DM y te la paso." | TOFU / MOFU |
| Conversación | "Escríbenos AGENDA." | BOFU, casos, cuando hay vendedor disponible |
| Registro | "Entra y mira si tu negocio encaja." (link en comentario fijado / historia) | BOFU |
| Seguir | "Síguenos, que esto sigue." | Autoridad, series |
Nunca dos CTAs en la misma pieza.

### SOP 6 · Producción semanal
- Lunes: se cierran los 5 guiones de la semana (revisión con el cerebro de Kunfupay).
- Lunes-martes: grabación en bloque (rotar entre las 6 caras: tú, 5 del equipo, founder esporádico).
- Claude edita el mismo día. Subtítulos, palabra clave en mayúsculas, corte cada 1,5-3 s, se entiende sin sonido.
- Publicación diaria a la misma hora + comentario fijado con el CTA + etiqueta en el Auto-DM.
- Viernes: revisión de métricas (§7) y elección de qué Reels pasan a pauta.

### SOP 7 · Seteo por DM (fase 1 humana, fase 2 Auto-DM)
- Fase 1: el vendedor contesta a quien respondió la pregunta en segundo plano. Preguntas propuestas [PENDIENTE: validar con los comerciales]:
  1. ¿Qué vendes y dónde lo cobras hoy?
  2. ¿Cuánto vendes al mes, más o menos?
  3. ¿Qué te frena ahora mismo para cobrar o vender más?
- Registrar en Kommo (pipeline Contacto Redes) qué respuestas acaban en KYC y primera venta.
- Fase 2: cuando una secuencia de preguntas demuestre que predice la activación, pasa al Auto-DM tal cual.

---

## 7. Panel semanal (viernes)

| Métrica | Fuente | Base hoy |
|---|---|---|
| Comentarios con palabra clave por cada 1.000 vistas | Instagram / Auto-DM | [medir semana 1] |
| Coste por seguidor y por comentario (Follow Me Ads) | Meta | [medir] |
| Registros desde Auto-DM | UTM / Kommo | [medir] |
| % registros que completan KYC | Daneris | ≈ 30 % (proxy: altas con país en KYC) |
| % que vende en 7 días | Daneris | 2,6 % |
| % que vende en 30 días | Daneris | 4,6 % |
| % activados sin contacto humano | Kommo + Daneris | [medir: es el objetivo de 90 días] |

Regla 70-20-10 a partir del mes 3. Nunca decidir con una sola semana.

---

## 8. Pendientes
1. Las 20 frases literales de leads (las pasa el equipo).
2. Preguntas de seteo y objeciones reales de los comerciales.
3. Tiempo real del KYC y de la revisión de tienda (para el Reel de activación).
4. Caso real con permiso para la semana 4.
5. Confirmar el modelo de precios actual de ManyChat antes del guion 2.
6. Confirmar que la historia del guion 8 es real.
