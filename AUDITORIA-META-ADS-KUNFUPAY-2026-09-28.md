# Auditoría de ángulos y mensajes — Meta Ads Kunfupay (campañas encendidas)

**Cuenta:** Kunfupay (EUR) · **Fecha de lectura:** 28-09-2026 (lunes) · **Modo:** B (auditar cuenta, sin tocar nada)
**Doctrina:** testeo/escalado de Martí Gamarra (Crece Sin Límite). Etiquetas: [D] doctrina · [P] derivado · [N] no cubierto · [X] regla de marca Kunfupay.
**Ventanas:** `últimos 7 días` (21–28 sep) y `máximo` (histórico del anuncio). Todas las cifras salen de la API; nada está estimado.

**Lo que NO se leyó (y por qué):** los 12 anuncios nuevos del conjunto "FORM CREATOR BUSINESS SCORE" tienen el texto vacío en la API (son publicaciones de página) y las previews no se ejecutaron por decisión de Benjamín; los creativos de UGC Accelerator y Awareness tampoco se leyeron. Para ellos el análisis es solo numérico.

---

## 1. Resumen en 5 líneas

1. **Estructura:** 6 campañas encendidas, 10 conjuntos activos, **109 anuncios activos**. Todo está en **ABO** (presupuesto en conjunto). No existe ninguna campaña CBO de escalado ni separación testeo/escalado: cada campaña es a la vez test y escalado [T3/T5].
2. **Ángulos reales en las 4 campañas de conversión:** 4 (cobrar desde Andorra · fiscalidad/LLC · métodos de pago locales · Classroom Platinum), pero el conjunto "Optimización fiscal" mezcla 4 problemas centrales distintos [C4].
3. **Mensajes únicos vs anuncios:** Andorra 12 anuncios → 7 mensajes · Fiscal 10 → 6 · Métodos de pago **22 → 2** · Classroom Platinum (2 conjuntos) **30 → 6**. En total, **74 anuncios de conversión llevan solo 21 mensajes**; 53 son duplicados de formato [C1].
4. **Problema principal:** con 10–15 anuncios por conjunto a 10–35 €/día y copies idénticos, Meta concentra el 75–94 % del gasto en un solo anuncio por conjunto y el resto nunca alcanza 3x CPA. No hay test de mensajes: hay un "elige Meta" con un mensaje repetido en 11 imágenes.
5. **Ganadores desatendidos y ganador agotándose:** hay 5 anuncios verdes históricos casi sin entrega (PODCAST JUANEN, Hormozi Ataud, TWEET CLASSROOM, LLC RUBEN EEUU, DANI UGC VSL) [T4], y el anuncio que sostiene Classroom (VIDEOJUEGO) ha duplicado su CPL en 7 días [T6].

---

## 2. Estructura encontrada

| Campaña | Objetivo | Conjuntos activos | €/día | Audiencia | Evento de resultado | 7d gasto | 7d resultados | 7d CPR | 7d CTR | 7d frec. |
|---|---|---|---|---|---|---|---|---|---|---|
| CONVERSION / ANDORRA / Kunfupay - v2 | Ventas | ANDORRA / REGISTRO / ABIERTO | 20 | Andorra, broad Advantage+ | Registro web (píxel) | 136,27 € | 2 | 68,14 € | 1,47 % | **3,90** |
| CONVERSION / OPTIMIZACION FISCAL / Kunfupay - v2 | Ventas | OPTIMIZACION FISCAL / ESP | 20 | ES, LAL 1 % landing fiscal + Advantage+ (solo FB/IG) | Registro web | 128,43 € | 6 | 21,41 € | 2,36 % | 1,72 |
| CONVERSION / METODOS DE PAGO / KUNFUPAY | Ventas | ANDROMEDA / METODOS DE PAGO / ESP | 15 | ES broad Advantage+ | Registro web | 101,54 € | 2 | 50,77 € | 1,29 % | 2,40 |
| ídem | | Test - AUD SIMILAR REGISTRO (creado 21-09) | 10 | ES, LAL 1 % registros históricos | Registro web | 67,05 € | 0 | — | 1,52 % | 2,37 |
| V2 CLASSROOM PLATINUM LANDING PAGE | Leads | AUD HERNAN (creado 04-09) | 35 | ES, LAL 1 % "Skool excel Hernan" | Conversión personalizada "Leads_logrados_gracias" | 237,65 € | 8 | 29,71 € | 3,21 % | 1,73 |
| ídem | | ANDROMEDA CLASSROOM (creado 11-09) | 20 | ES broad | ídem | 136,97 € | 3 | 45,66 € | 2,75 % | 1,62 |
| ídem | | FORM CREATOR BUSINESS SCORE (creado **hoy 28-09 12:46**) | 30 | ES broad | **Formulario instantáneo** (evento distinto) | 0 € | — | — | — | — |
| UGC ACCELERATOR / CLASSROOM / CONVERSION | Ventas | VSL / UGC ACELERATOR | 10 | ES, LAL 1 % csv UGC | Registro web | 69,14 € | 38 | 1,82 € | 4,82 % | 1,83 |
| AWARENESS / VISITAS KUNFUPAY | Alcance | WORLDWIDE / ESP · WORLDWIDE / LATAM | 5 + 5 | Retargeting shops + LAL | Alcance | 69,03 € | 230 k alcance | 0,30 € | 0,11 % | 1,41 |

Residuo: el anuncio "9" (id 120225…820648) del conjunto "🌎 LATAM | Tarjeta" figura activo con 0,05 € de gasto total desde febrero; su campaña no aparece entre las encendidas. Revisar y archivar.

**Landing:** Métodos de pago → `kunfupay.com/landings/pagos-globales-es/v1`. Para Andorra, Fiscal y Classroom la API no devuelve `link_url` en creativos de tipo publicación; se asume una landing por campaña (a confirmar).

---

## 3. Umbrales del semáforo (provisionales, a confirmar por Benjamín)

La doctrina exige un CPL/CPA objetivo y un techo naranja [D]. No se han dado, así que uso **umbrales provisionales derivados de la propia cuenta** [P]. Si Benjamín da otros, la clasificación cambia.

| Evento | Objetivo (🟢 ≤) | Techo naranja (🟠 ≤) | 🔴 | Gasto mínimo para leer un anuncio (3x–5x) | Base |
|---|---|---|---|---|---|
| Registro web Kunfupay (Andorra, Fiscal, Métodos de pago) | 12 € | 20 € | > 20 € | 36–60 € | Fiscal histórico 9,4 €/registro; mejores anuncios sostenidos 8–12 € |
| Lead Classroom Platinum | 18 € | 30 € | > 30 € | 54–90 € | Histórico de ambos conjuntos 17–18 €/lead |
| Registro UGC Accelerator | 2 € | 3,5 € | > 3,5 € | 6–10 € | Conjunto a 1,4–1,8 € sostenido |

Regla adicional [D]: un anuncio fuera del techo con CTR ≥ 2x la media del conjunto se conserva (alimenta remarketing). Anuncios con gasto < 3x objetivo → **"sin lectura"**, nunca rojo por falta de datos.

---

## 4. Mapa ángulo × mensaje por conjunto

Coordenadas = nivel de conciencia (1–5) / tipo de mensaje / persona / emoción. Formato = `object_type` de la API (SHARE con imagen = estático; VIDEO = reel/vídeo; child_attachments = carrusel).

### 4.1 ANDORRA / REGISTRO / ABIERTO — ángulo "Cobrar desde Andorra cuando Stripe no opera"

Foco central coherente: el problema de la pasarela para residentes en Andorra. Histórico anuncios activos: 292,85 € · 4 registros · **73 €/registro**. Frecuencia 3,90 en 7 días con 57 k impresiones en un país de ~85 k habitantes: la audiencia está agotada [T6].

| Anuncio (id) | Mensaje (gancho literal) | Coord. | Formato | Gasto 7d / hist. | Reg. 7d / hist. | CPR 7d / hist. | CTR hist. | Color |
|---|---|---|---|---|---|---|---|---|
| IMG / PARED STRIPE (…655550648) | "Stripe no opera en Andorra, aunque lleves meses intentando que sí. Kunfupay, sí." | 3–4 / oferta directa / usuario de Stripe frustrado / alivio | estático | 14,77 / 45,94 € | 2 / 2 | 7,39 / 22,97 € | 0,74 % | 🟢 (7d) · 🔴 hist. por techo, se salva por tendencia |
| IMG / TWEET ANDORRA (…136800648) | **mismo copy** que PARED STRIPE | ídem | estático (visual tweet) | 9,80 € | 0 | — | 0,73 % | sin lectura · C1 |
| IMG / AVISO ANDORRA (…068300648) | **mismo copy** que PARED STRIPE; **misma imagen** que PIZARRA | ídem | estático | 7,56 € | 0 | — | 0,60 % | sin lectura · C1 |
| IMG / NOTICIA (…982300648) | "Si vendes cursos… desde Andorra… Stripe no opera aquí. PayPal… La solución que te recomiendan es abrir una LLC… Kunfupay existe para eso." | 2–3 / desmontar creencia (LLC) / creador que ya vende / frustración | estático (visual noticia) | **65,84 / 70,89 €** | **0 / 0** | — | 2,15 % | 🔴 (> 5x objetivo sin resultado) |
| IMG / PROFESOR (…146920648) | **mismo copy** que NOTICIA | ídem | estático | 0,11 / 0,19 € | 0 | — | 1,96 % | sin lectura · C1 |
| IMG / PIZARRA (…146930648) | **mismo copy** que NOTICIA | ídem | estático | 1,83 / 1,88 € | 0 | — | 0,68 % | sin lectura · C1 |
| IMG / 3 fallos cobro (…100500648) | "3 fallos que cometen los creadores al cobrar su curso desde Andorra: Stripe como si estuvieras en España / sociedad fuera / PayPal con límites" | 2 / error común / creador que ya cobra / miedo | estático | 8,36 / 58,73 € | 0 / 0 | — | 2,32 % | 🔴 (> 4x sin resultado) |
| IMG / CANDADO (…242010648) | mismo mensaje "3 fallos", copy v2 | ídem | estático | 0,89 / 3,59 € | 0 | — | 0,48 % | sin lectura · C1 |
| REEL / LLC Andorra (…934570648) | "¿En serio tienes que montar una empresa en Andorra solo para cobrar online? Gestores, trámites…" | 2 / agobio burocracia / quien aún no tiene estructura / frustración | vídeo | 3,68 / 62,48 € | 0 / 2 | — / 31,24 € | 0,84 % | 🔴 hist. (> techo) |
| MANYCHAT / Podcast Andorra (…874080648) | "«Tengo un negocio en Andorra y necesito cobrar… ¿qué opciones tengo?» No todas las pasarelas funcionan igual…" | 3 / explicación FAQ / dueño de negocio genérico / curiosidad | vídeo | 2,54 / 29,69 € | 0 / 0 | — | 0,81 % | 🔴 (> 2x sin resultado) |
| IMG / 5 PREGUNTAS (…702770648) | "Antes de elegir dónde cobrar, pregúntate: ¿especializada en pagos? ¿casos reales?… Kunfupay pasa las 5." | 3 / comparativa-criterios / quien está eligiendo pasarela / confianza | estático | 0,22 / 0,90 € | 0 | — | 0,48 % | sin lectura |
| IMG / IFOPRODUCTOR ANDORRA (…574240648) | "PayPal, Stripe o Kunfupay: no todos cobran igual desde Andorra." | 3 / comparativa / infoproductor / curiosidad | estático | 0,44 / 1,17 € | 0 | — | 1,00 % | sin lectura |

**Cobertura de la escalera:** nivel 1 (no sabe que pierde ventas) → **vacío**; nivel 2 → 3 fallos, LLC Andorra; nivel 3 → NOTICIA, Podcast, 5 PREGUNTAS, IFOPRODUCTOR; nivel 4–5 → PARED STRIPE. **Faltan:** prueba social, ejemplo gráfico del flujo (alumno en México paga con OXXO → tú recibes en Andorra), dolor concreto de checkout (rechazo de tarjeta). Personas: solo 2 sub-personas reales (usuario de Stripe, creador que vende cursos).

**Marca [X]:** el copy "sin LLC" ataca a PayPal con afirmaciones fuertes ("decide él el tipo de cambio, te retiene fondos cuando le parece"). Las afirmaciones de producto "cuenta con IBAN de Andorra" (Podcast, 3 fallos) van como `[dato a validar]`.

### 4.2 OPTIMIZACION FISCAL / ESP — ángulo declarado "optimización fiscal", ángulo real: 4 problemas mezclados [C4]

Histórico anuncios activos: 608,51 € · 65 registros · **9,36 €/registro** (el mejor conjunto de Kunfupay). 7d: 21,41 €. El ganador (Profitstride) pasa de 11,87 € histórico a 18,54 € en 7 días: agotamiento incipiente [T6].

| Anuncio (id) | Mensaje (gancho literal) | Problema central | Coord. | Formato | Gasto 7d / hist. | Reg. 7d / hist. | CPR 7d / hist. | CTR hist. | Color |
|---|---|---|---|---|---|---|---|---|---|
| REEL / Profitstride - FISCAL (…370440648) | "Tu dinero retenido por Stripe y otras pasarelas ya no tiene que esperar. Con KunfuPay lo usas al instante… Sin cuota mensual." | **Liquidez / retenciones** (no es fiscal) | 2 / dolor recurrente / vendedor con Stripe / frustración→alivio | vídeo UGC | **111,24 / 368,03 €** (87 % del conjunto) | 6 / 31 | 18,54 / 11,87 € | 2,92 % | 🟠 7d · 🟢 hist. |
| REEL PODCAST JUANEN (…858140648) | "Creas tu cuenta, haces tus ventas, y a fin de mes tienes una sola factura que cubre todos tus pagos. Sin gestoría… Te ahorras asesor, fiscalista y abogados… Flexibilidad para elegir dónde facturar" | Factura única / delegación | 3 / delegación + ahorro / creador con gestor / alivio | vídeo podcast | 0,12 / 121,13 € | 0 / 22 | — / **5,51 €** | 3,26 % | 🟢 hist. · **sin entrega** [T4] |
| REEL / LLC ESPAÑA 2 (…823500648) | "Muchos creadores forman una LLC para operar globalmente… y luego se quedan atascados en cómo cobrar. PIX, Nequi, Bizum…" | Métodos locales desde tu LLC (= ángulo métodos de pago) | 3 / error común / ya tiene LLC / frustración | vídeo | 10,94 / 24,69 € | 0 / 3 | — / 8,23 € | 2,61 % | 🟢 hist. |
| REEL / LLC ESPAÑA (…823470648) | mismo mensaje, copy v1 ("el problema no es formarla, es cómo cobras después") | ídem | ídem | vídeo | 1,05 / 43,44 € | 0 / 3 | — / 14,48 € | 2,01 % | 🟠 hist. · C1 |
| REEL / LLC RUBEN EEUU (…823420648) | "¿Has pensado en montar una LLC en EEUU? Papeleo, registered agent… Con KunfuPay consigues esos beneficios fiscales sin montar ninguna LLC" | Beneficios fiscales sin LLC | 2–3 / desmontar creencia / quien valora montar LLC / alivio | vídeo | 1,33 / 43,11 € | 0 / 4 | — / 10,78 € | 2,03 % | 🟢 hist. · sin entrega [T4] |
| IMG / CARGA FISCAL (…316620648) | **mismo copy** que LLC RUBEN EEUU | ídem | ídem | estático | 1,52 / 3,98 € | 0 | — | 3,54 % | sin lectura · C1 |
| IMG / NOTICIA FISCAL (…421660648) | "Hay quien monta una sociedad en EEUU solo para poder cobrar online… no la más simple ni la más barata" | ídem, copy v2 | ídem | estático | 0,05 / 0,27 € | 0 | — | 2,70 % | sin lectura · C1 |
| IMG / SIN RIESGO FISCAL (…348580648) | "Kunfupay es el vendedor oficial de cada venta que haces. Factura y gestiona el papeleo por ti." | **Merchant of record** (el único mensaje fiscal on-brand) | 3 / mecanismo / creador que teme el papeleo / confianza | estático | 1,76 / 2,37 € | 0 | — | 2,90 % | sin lectura |
| IMG / FACTURA FISCAL (…654290648) | "Una venta, una factura por cada gestor, cada plataforma, cada país. Con Kunfupay, una sola factura por todo." | Factura única | 2 / agobio burocracia / quien factura en varios países / alivio | estático | 0,13 / 1,00 € | 0 / 1 | — / 1,00 € | 7,41 % | sin lectura (señal positiva) |
| IMG / FACTURA 2 FISCAL (…923980648) | **mismo copy** que FACTURA FISCAL | ídem | ídem | estático | 0,29 / 0,49 € | 0 / 1 | — / 0,49 € | 2,00 % | sin lectura · C1 |

**Lectura:** el conjunto "fiscal" lo sostiene un mensaje de liquidez. Lo que Meta ha aprendido a comprar aquí es "dinero retenido por Stripe", no "optimización fiscal". Los mensajes fiscales de verdad (factura única, MoR) o están desatendidos o nunca se leyeron.

**Marca [X], riesgo alto:** "beneficios fiscales sin montar una LLC" (2 anuncios), "te ahorras asesor, fiscalista y abogados" y "flexibilidad real para elegir dónde facturar tu actividad" (PODCAST JUANEN) son afirmaciones que un asesor no firmaría y que chocan con "Kunfupay no es una asesoría fiscal / siempre legal y optimizada". Antes de escalar estos dos ganadores hay que reescribir el copy (ver §7).

### 4.3 METODOS DE PAGO (2 conjuntos) — ángulo "métodos de pago locales / un link cobra a todos"

Es el segundo ángulo madre de Kunfupay (fuga de ventas en LatAm por moneda y método). **22 anuncios, 2 mensajes**: 20 comparten literalmente el copy "🌍 Un cliente en México, otro en España, otro en Italia. Un solo link de Kunfupay los cobra a todos. Empieza gratis" (título "Vende global, cobra simple"). Solo MEDIEVAL (23-09) dice otra cosa. Los dos conjuntos llevan los **mismos 11 creativos** con audiencias distintas: es un test de audiencia con un solo mensaje, no un test de mensajes [C2/T1].

Histórico: ANDROMEDA 251,9 € · 8 registros · 31,5 €/registro. Test LAL 72,2 € · 0 registros (7 días cumplidos) → 🔴 a nivel conjunto.

| Anuncio | Mensaje | Coord. | Formato | ANDROMEDA gasto hist. / reg. / CPR / CTR | Test LAL gasto / reg. / CTR | Color |
|---|---|---|---|---|---|---|
| CARRUSEL / PAGO GLOBAL (…917690648 · …483280648) | copy común; tarjetas "Métodos de pago globales, en uno solo" | 3 / mecanismo simple / vendedor multi-país / alivio | carrusel 5 tarjetas | **202,81 € / 7 / 28,97 €** (7d: 76,34 € / 1 / **76 €**, frec. 3,21) / 1,71 % | 13,95 € / 0 / 0,70 % | 🔴 (era 🟠, se agota) |
| VID / CARRUSEL MEDIEVAL (…031890648 · …258180648) | "Tu alumno de Brasil quiere pagar con PIX. El de Colombia con Nequi. El de México con SPEI. Si no tienes su método, no te escribe. Simplemente no compra." | 1–2 / FOMO fuga silenciosa / vende a LatAm / miedo | vídeo | 9 € / 1 / 9 € / 0,93 % | 15,13 € / 0 / 1,65 % | sin lectura, **única señal nueva** |
| REEL / RAFA COBRO GLOBAL | copy común | (mensaje real = lo que diga Rafa en vídeo, no leído) | vídeo UGC | 11,17 € / 0 / — / 2,71 % | 5,75 € / 1,75 % | sin lectura |
| REEL / DANI COBRO GLOBAL - VIDEO VIEJO | copy común | ídem | vídeo UGC | 2,77 € / 0 / 3,56 % | 8,30 € / 2,03 % | sin lectura (CTR alto) |
| REEL / NEREA PAGO GLOBAL | copy común | ídem | vídeo UGC | 1,05 € / 0 / 0,91 % | 0,22 € / **0,00 %** | sin lectura, Meta la rechaza |
| REEL / TREN PAGO GLOBAL | copy común | ídem | vídeo | 2,68 € / 1,14 % | 2,18 € / 0,39 % | sin lectura, señal mala |
| IMG / NOTICIA PAGO GLOBAL | copy común | visual noticia | estático | 7,69 € / 2,79 % | 14,20 € / 2,02 % | sin lectura (CTR alto) |
| IMG / TWEET PAGO GLOBAL | copy común | visual tweet | estático | 5,96 € / 1,36 % | 1,35 € / 3,30 % | sin lectura |
| IMG / SKOOL PAGO GLOBAL | copy común | visual Skool | estático | 3,92 € / **0,00 %** | 4,44 € / 1,85 % | sin lectura, señal mala |
| IMG / NAVY PAGO GLOBAL | copy común | estático | estático | 1,39 € / 2,88 % | 0,41 € / 0,00 % | sin lectura |
| IMG / COMPARA PAYPAL | copy común (el visual compara con PayPal, el texto no) | estático | estático | 3,46 € / 1,55 % | 6,30 € / 0,91 % | sin lectura, mensaje-visual desalineado |

**Cobertura:** nivel 1–2 → solo MEDIEVAL; nivel 3 → el copy común (x20); niveles 4–5, prueba social, comparativa, ahorro, lanzamiento → **vacíos**. De los 10 mensajes del ejemplo de referencia (rechazo de tarjeta, comisiones de cambio, precio solo en USD, sin tarjeta internacional, tipo de cambio, lanzamientos, prueba social, oferta de integración) **no hay ninguno**.

### 4.4 V2 CLASSROOM PLATINUM (3 conjuntos) — ángulo "Kunfupay invierte en creadores con +10K seguidores"

Producto distinto (programa de inversión / aceleración para creadores). HERNAN y ANDROMEDA llevan **exactamente los mismos 15 creativos (mismos ids)** [C2]. Histórico: HERNAN 924 € · 52 leads · 17,8 €/lead; ANDROMEDA 338 € · 20 leads · 16,9 €/lead. Las audiencias no cambian el resultado; el mensaje sí.

| Anuncio | Mensaje (gancho literal) | Coord. | Formato | HERNAN gasto hist. / leads / CPL (7d) | ANDROMEDA gasto hist. / leads / CPL (7d) | Color |
|---|---|---|---|---|---|---|
| IMG / VIDEOJUEGO CLASSROOM | "Tu curso ya tiene alumnos. Lo que le falta es presupuesto para escalar. En Classroom Platinum lo ponemos nosotros." (M1) | 4 / oferta directa / creador con curso y alumnos / aspiración | estático (visual videojuego) | **428,09 € / 27 / 15,86 €** (7d 214,51 € / 7 / **30,64 €**) | **265,56 € / 16 / 16,60 €** (7d 128,18 € / 3 / **42,73 €**) | 🟢 hist. → 🔴 7d · agotamiento [T6] |
| IMG / Hormozi Ataud | "Mientras sigues pagando a Skool por alojar tu comunidad, en Classroom Platinum estamos invirtiendo nuestro dinero en creadores…" (M6) | 3 / comparativa vs Skool / creador con comunidad en Skool / orgullo | estático | 179,15 € / 14 / **12,80 €** (7d 6,58 €, CTR 8,5 %) | 10,65 € / 0 | 🟢 hist. · sin entrega [T4] |
| IMG / TWEET CLASSROOM | M1 | ídem | estático (tweet) | 58,32 € / 5 / 11,66 € (7d 4,80 €) | 33,28 € / 4 / **8,32 €** (7d 3,96 €) | 🟢 hist. · sin entrega [T4] |
| IMG / MOSSERI CLASSROOM | M1 | ídem | estático | 40,35 € / 3 / 13,45 € | 4,84 € / 0 | 🟢 hist. (justo) |
| IMG / ANIMADO CLASSROOM | M1 | ídem | estático | 4,74 € / 1 | 0,43 € | sin lectura · C1 |
| IMG / SKOOL CLASSROOM | M1 | ídem | estático | 11,20 € / 0 | 1,81 € | sin lectura · C1 |
| IMG / SENSEI · ISLA MOSSERI · RUBEN VS HORMOZI | M1 | ídem | estático | < 3 € cada uno | < 2,5 € | sin lectura · C1 |
| RUBEN PIZARRA / CLASSROOM (vídeo, APPLY_NOW) | "Buscamos 100 creadores… invertimos en tu crecimiento… Solo hay 100 plazas y es totalmente gratis." (M4) | 4–5 / oferta con escasez / creador +10K / urgencia | vídeo | **141,11 € / 2 / 70,56 €** | 7,66 € / 0 | 🔴 |
| RUBEN_HORMOZI (vídeo) | "¿Tienes más de 10mil seguidores? Escucha esta propuesta" (M2) | 3 / calificador sin promesa / +10K / curiosidad | vídeo | 26,51 € / 0 | 1,04 € | 🔴 (> 1x objetivo, 0 leads, no llega a 3x) → sin lectura estricta, señal roja |
| REEL / RUBEN CLASROOM (vídeo) | M2 | ídem | vídeo | 26,52 € / 0 | 0,81 € | ídem |
| REEL / RUBEN PERIODICO (vídeo) | M2 | ídem | vídeo | 0,84 € | 0,88 € | sin lectura · C1/C5 |
| REEL / RUBEN CLASROOM 3 (vídeo) | "¿Tu audiencia ya te compra y tienes +10K seguidores? Eso es justo lo que buscamos." (M3) | 4 / calificador / +10K que ya monetiza / orgullo | vídeo | 1,52 € | 5,98 € / 0 | sin lectura |
| IMG / Noticia Ruben | "Classroom Platinum es un programa de inversión para creadores de cursos que ya tienen más de 10.000 seguidores… Tú te enfocas en enseñar. Nosotros ponemos la inversión." (M5) | 3 / explicación del mecanismo / +10K / confianza | estático | 1,65 € | 0,03 € | sin lectura |
| **FORM CREATOR BUSINESS SCORE** (12 anuncios: REEL RUBEN SCORE 1–6, IMG NOTICIA/ICEBERG/LUCES/ROCKET/PUERTA/TWEET RUBEN SCORE) | texto vacío en API; ángulo inferido por nombre: lead magnet "Creator Business Score" | no leído | 6 vídeos + 6 estáticos | 0 € (creado hoy) | — | sin lectura · **no leído** |

**Cobertura:** casi todo es oferta directa (M1 en 8 visuales) o calificador; nivel 1–2 (dolor: "tu comunidad no crece porque no puedes pagar ads", "Skool te cobra y no invierte en ti") solo en Hormozi Ataud. Faltan: mecanismo claro (qué se invierte, qué se pide a cambio), prueba social (un creador que entró), objeción ("¿qué gano yo / qué pierdo?"). El evento de la nueva conjunto (formulario) no es comparable con la conversión personalizada de los otros dos.

### 4.5 Campañas secundarias (solo números; creativos no leídos)

- **UGC ACCELERATOR — VSL / UGC ACELERATOR** (10 €/día): 🟢 rotundo. MARCAS UGC 320,45 € / 233 registros / **1,38 €** (7d 55,90 € / 36 / 1,55 €) con frecuencia 3,96 → agotamiento probable en semanas. DANI UGC VSL 35,98 € / 25 / 1,44 € pero 0,37 € en 7d [T4]. PUERTAS UGC 46,49 € / 14 / 3,32 € 🟠. UGC ACELERATOR 8 (2,30 €) y 6 (1,47 €) 🟢 con poco gasto. UGC ACELERATOR 3/4/5/7/9/10 y "kunfu chico / kunfu 1": < 1,2 € cada uno, Meta no los entrega.
- **AWARENESS**: capa de marca a 10 €/día, no forma parte del test. El conjunto LATAM incluye ES en geo y solapa con el conjunto ESP.

---

## 5. Hallazgos con código, evidencia y acción

| Código | Hallazgo | Evidencia | Acción |
|---|---|---|---|
| **C1** | Mismo mensaje en varios formatos dentro del conjunto | Métodos de pago: 20/22 anuncios con el body "🌍 Un cliente en México…". Classroom: 8 estáticos con "Tu curso ya tiene alumnos…" y 3 vídeos con "¿Tienes más de 10mil seguidores?". Andorra: 3× "Deja de forzar", 3× "sin LLC", 2× "3 fallos". Fiscal: 2× LLC ESPAÑA, 2× FACTURA, 2× "beneficios fiscales sin LLC". | Dejar **un** portador por mensaje (el de mejor CPR o, sin datos, mejor CTR). El resto pasan a "variantes" para la futura CBO dinámica o se pausan. |
| **C2** | Mismos anuncios en dos conjuntos compitiendo por la misma audiencia | Classroom HERNAN y ANDROMEDA: 15 creativos con **ids idénticos**, misma landing, ambos con Advantage+ expansion en ES. Métodos de pago: 11 creativos clonados en ANDROMEDA y Test LAL. | Fusionar en un conjunto por ángulo. Si se quiere test de audiencia, hacerlo con un solo anuncio ganador, no con 15. |
| **C4** | Varios ángulos en un conjunto | OPTIMIZACION FISCAL mezcla: liquidez/retenciones (Profitstride), factura única (Podcast, FACTURA), MoR (SIN RIESGO), métodos locales desde tu LLC (LLC ESPAÑA), beneficios fiscales sin LLC (LLC RUBEN, CARGA, NOTICIA). | Separar en conjuntos-ángulo: "Liquidez/retenciones", "Fiscalidad internacional/MoR". Los de "LLC → cómo cobras" van al ángulo Métodos de pago. |
| **C5** | Misma primera frase | 20 anuncios de Métodos de pago; 8 + 3 en Classroom. | Cada anuncio nuevo abre con un problema distinto (ver §7). |
| **C6** | Huecos de la escalera | Métodos de pago sin niveles 1–2 (salvo MEDIEVAL), sin prueba social ni oferta de integración. Andorra sin nivel 1 ni prueba social ni mecanismo gráfico. Classroom sin dolor, mecanismo ni prueba. Fiscal sin FOMO fiscal verificable ni prueba social. | Lista de mensajes faltantes con gancho en §7. |
| **T1** | Testeo sin igualdad de condiciones | Classroom: 35 / 20 / 30 €/día y dos eventos de conversión distintos. Métodos de pago: 15 / 10 €/día. | Mismo presupuesto y mismo evento por campaña de test. |
| **T2** | Lectura prematura / conjunto recién nacido | FORM CREATOR BUSINESS SCORE nació hoy con 12 anuncios a 30 €/día (2,5 €/anuncio/día): Meta elegirá 1–2 y 10 no se leerán nunca. Test LAL Métodos cumple hoy 7 días: 72 € y 0 registros → ya tiene veredicto. | SCORE: no tocar hasta el 05-10, y aceptar que es un "elige Meta". Test LAL: apagar. |
| **T3 / T5** | No hay separación testeo/escalado ni CBO broad de escalado | Ninguna campaña CBO; los ganadores viven en los mismos conjuntos que los perdedores y compiten con 10–14 anuncios sin lectura. | Crear campaña de escalado CBO broad (§6). |
| **T4** | Ganadores sin entrega (no pausados, pero muertos de hambre) | PODCAST JUANEN 5,51 €/reg → 0,12 € en 7d. LLC RUBEN EEUU 10,78 € → 1,33 €. Hormozi Ataud 12,80 €/lead → 6,58 €. TWEET CLASSROOM 8,32–11,66 € → ~4 €. DANI UGC VSL 1,44 € → 0,37 €. | Un ganador nunca vuelve a perdedor [D]: subirlos a la CBO de escalado (o darles conjunto propio) donde reciban presupuesto. |
| **T6** | Agotamiento | Andorra frecuencia 3,90/7d. VIDEOJUEGO CPL 15,9 → 30,6 € (HERNAN) y 16,6 → 42,7 € (ANDROMEDA). CARRUSEL PAGO GLOBAL 29 → 76 €. Profitstride 11,9 → 18,5 €. MARCAS UGC frecuencia 3,96. | Encontrar un ganador = producir sucesores ahora [D]. Cada uno de estos necesita 2–3 mensajes nuevos del mismo ángulo entrando esta semana. |
| **Q1** | Calidad de lead por ángulo — sin dato | Benjamín no ha reportado calidad. Sospechas: Profitstride atrae "buscadores de liquidez" y no perfil fiscal; Classroom SCORE (lead magnet) bajará CPL y calidad. | Pedir tasa de calificación por anuncio antes de escalar. |
| **[X]** | Riesgo de marca | "Beneficios fiscales sin montar una LLC", "te ahorras asesor, fiscalista y abogados", "elegir dónde facturar". Ataques a PayPal en Andorra. Claims de producto: "IBAN de Andorra", "sin cuota mensual", "tarjeta Kunfupay". | Reescribir antes de escalar (§7). Validar claims. |

---

## 6. Plan de re-estructuración al sistema del vídeo

**Principio [D]:** una campaña de testeo ABO (un ángulo por conjunto, mismo presupuesto, misma landing, misma audiencia, 7 días, 3x–5x CPA) que **nunca se apaga**, y una campaña CBO broad de escalado donde viven los verdes.

### 6.1 Kunfupay España — campaña TESTEO (ABO)
- 3 conjuntos = 3 ángulos, **20 €/día cada uno** (140 €/conjunto en 7 días = > 5x un objetivo de 12 €), ES broad Advantage+, **una sola landing** para los tres (si se quiere landing por ángulo, aceptar que la comparación entre ángulos queda confundida; dentro del conjunto siempre una).
  1. **"Fuga de ventas por método/moneda"** (Métodos de pago): 10 mensajes nuevos (§7.1) + MEDIEVAL.
  2. **"Fiscalidad internacional / escudo MoR"** (fiscal on-brand): SIN RIESGO FISCAL, FACTURA FISCAL, PODCAST JUANEN *reescrito*, + 7 nuevos (§7.2).
  3. **"Liquidez: tu dinero retenido por la pasarela"** (el ángulo que Profitstride demostró): Profitstride + 9 nuevos (§7.3).
- Arranque martes 29-09 → **lectura lunes 06-10** (semana cerrada). No pausar nada antes salvo desastre evidente.
- Andorra **sale del test** (geo distinta, mercado agotado): pasa a conjunto de mantenimiento a 8–10 €/día [P] con PARED STRIPE + 3 mensajes nuevos, rotando creativos cada 14 días.

### 6.2 Kunfupay España — campaña ESCALADO (CBO broad)
- Un conjunto broad ES, **60–80 €/día** [P], con los verdes: Profitstride, PODCAST JUANEN (copy reescrito), LLC ESPAÑA 2, LLC RUBEN EEUU (copy reescrito). Opcional naranja: CARRUSEL PAGO GLOBAL.
- Montarlo como **anuncio dinámico** (−20 % a −35 % de CPL en lead gen según doctrina) o como anuncios separados; en 70–80 % de los casos gana el dinámico [D].
- Ahí no hay igualdad de condiciones: elige Meta.

### 6.3 Classroom Platinum
- **Testeo ABO**: conjunto A "Propuesta directa" (HERNAN, podado a 5 anuncios: VIDEOJUEGO, Hormozi Ataud, TWEET, MOSSERI, Noticia Ruben) y conjunto B "Creator Business Score" (el nuevo), **ambos a 30 €/día** y, si es posible, con el **mismo evento** (o leer B por leads calificados, no por CPL). ANDROMEDA se pausa: es el clon.
- **Escalado CBO Classroom** (40 €/día [P]): VIDEOJUEGO, Hormozi Ataud, TWEET, MOSSERI. Producir ya 3 sucesores de VIDEOJUEGO (mismo mensaje M1, nuevo visual y nuevo primer segundo) porque es el único que Meta compra y se está agotando.

### 6.4 UGC Accelerator
- No es de Kunfupay; se mantiene. Fase 1 de escalado: subir el conjunto de 10 a 15 €/día mientras el CPR se mantenga < 2 €, y producir 2 sucesores de MARCAS UGC antes de que la frecuencia 3,96 se coma el CPR.

---

## 7. Mensajes que faltan (ganchos propuestos, cifras como `[dato a validar]`)

### 7.1 Ángulo "Fuga de ventas por método/moneda" (10 anuncios, reparto §3.2)
1. FOMO fuga silenciosa · N1 · "Estás perdiendo casi la mitad `[dato a validar]` de tus ventas en Latinoamérica y ni te enteras. El motivo: exigir dólares o tarjeta internacional."
2. Rechazo en checkout · N2 · "Tu alumno quiere comprar y su banco le rechaza la tarjeta. No es su intención de compra: es que no le dejas pagar en su moneda."
3. Comisiones de cambio · N2 · "Cada cobro fuera pierde hasta un X % `[dato a validar]` en cambio de divisa. Tú no lo ves; tu liquidación sí."
4. Sin tarjeta internacional · N2 · "El X % `[dato a validar]` de tus alumnos en LatAm no tiene tarjeta internacional. Déjales pagar con OXXO, PIX, Nequi o Mercado Pago."
5. Error de precio en USD · desmontar · "Poner tu mentoría solo en dólares para todos los países es cerrar la puerta a la mayoría de LatAm."
6. Desmontar Stripe · "Crees que Stripe ya te cobra 'internacional'. Stripe cobra tarjeta. PIX, SPEI o Nequi no son tarjeta."
7. Ejemplo gráfico · N3 · "Un alumno de Argentina paga en pesos como en su supermercado. Tú recibes euros en tu banco de España."
8. Previsibilidad · N3 · "Que paguen en pesos, soles o reales sin que la inflación o el cambio te afecte: tú siempre recibes euros."
9. Prueba social · N4 · "Cómo este mentor español subió un X % `[dato a validar]` sus inscripciones al permitir el pago local en cada país."
10. Oferta directa · N5 · "Integra Kunfupay hoy y cobra en la divisa de cada alumno." (MEDIEVAL cubre el N1 con métodos concretos; se queda como 11.º o sustituye al 1.)

### 7.2 Ángulo "Fiscalidad internacional / escudo MoR" (on-brand [X])
1. FOMO verificable · N1 · "¿Vendes cursos a alumnos fuera de España? Cada país puede exigir su impuesto local sobre esa venta, aunque tu gestor en España no lo vea."
2. Bomba de tiempo · N1 · "El problema no es ingresar el dinero; es el día que la administración de ese país pida cuentas por un impuesto que nadie declaró."
3. Dolor del trimestre · N2 · "Si cada trimestre adivinas qué IVA aplicar a tus alumnos de México o Colombia, estás perdiendo horas y asumiendo riesgo."
4. Desmontar Stripe · "Stripe cobra la tarjeta. Saber qué impuesto declarar en el país del alumno sigue siendo tu marrón."
5. Mecanismo MoR (reescritura de SIN RIESGO) · N3 · "Kunfupay es el vendedor oficial de cada venta: cobra al alumno, liquida el impuesto de su país y te ingresa tus euros. 100 % legal."
6. Factura única (FACTURA FISCAL, ya existe) · N3.
7. Delegación (reescritura de PODCAST JUANEN) · N3 · "Tú das tus mentorías. Kunfupay factura, cobra el impuesto local y responde por la venta. Una factura al mes." **Quitar**: "te ahorras asesor, fiscalista y abogados" y "elige dónde facturar".
8. Desmontar la LLC (reescritura de LLC RUBEN EEUU) · "Montar una LLC para vender formación de 300 € es matar moscas a cañonazos. La misma operativa internacional, sin estructura fuera." **Quitar**: "beneficios fiscales".
9. Prueba social · N4 · "Esta academia vende en X países `[dato a validar]` sin añadir un papel a su gestoría."
10. Oferta directa · N5 · "Vende a alumnos de todo el mundo con tranquilidad fiscal."

### 7.3 Ángulo "Liquidez: tu dinero retenido" (nuevo, demostrado por Profitstride)
1. Profitstride (ya existe, ganador).
2. Dolor concreto · N2 · "Vendiste el lunes. Stripe te lo paga en 7 días `[dato a validar]`. Tus ads los pagas hoy."
3. Bomba de tiempo · N1 · "Un pico de ventas y la pasarela te retiene el X % `[dato a validar]` 'por seguridad'. Justo cuando más caja necesitas."
4. Desmontar · "Crees que el problema es la comisión. El problema es cuándo te pagan."
5. Mecanismo · N3 · "Cobras, el saldo entra en tu wallet Kunfupay y lo usas al instante o lo pasas a tu cuenta."
6. Comparativa · "Stripe / PayPal / Kunfupay: quién te retiene, cuánto y por cuánto tiempo `[dato a validar]`."
7. Lanzamiento · N2 · "En un lanzamiento el dinero de la semana 1 paga los ads de la semana 2. Si te lo retienen, el lanzamiento se frena."
8. Prueba social UGC · N4 · otro creador mostrando el flujo (formato Profitstride, persona distinta).
9. Sin cuota · N3 · "Sin cuota mensual: solo pagas cuando cobras `[claim a validar]`."
10. Oferta directa · N5.

### 7.4 Andorra (conjunto de mantenimiento, 4 anuncios)
PARED STRIPE (ganador) + prueba social ("creador residente en Andorra cobrando en X países `[dato a validar]`") + ejemplo gráfico ("alumno en México paga con OXXO, tú recibes en tu cuenta en Andorra") + dolor de checkout ("tu alumno argentino no puede pagarte porque tu link pide tarjeta internacional").

### 7.5 Classroom Platinum (sucesores y huecos)
3 sucesores de M1 (mismo copy, visuales nuevos, primer segundo nuevo) · dolor N1 "Tu comunidad no crece porque no puedes pagar los ads que la harían crecer" · mecanismo "Qué ponemos nosotros, qué pones tú, qué pasa con los ingresos" · prueba social "el primer creador que entró" `[dato a validar]` · objeción "No es una agencia ni un curso: es inversión". Formato de vídeo: dejar de usar "¿Tienes más de 10mil seguidores? Escucha esta propuesta" como copy; cada vídeo con su promesa escrita.

**Formato sugerido por tipo [N, criterio propio]:** mecanismo y ejemplo gráfico → vídeo corto o carrusel paso a paso; FOMO / dolor / dato → estático con titular grande; desmontar creencia → vídeo a cámara o estático "creencia vs realidad"; prueba social → UGC/testimonio/captura; oferta directa → estático limpio con CTA.

---

## 8. INFORME DE ACCIONES por conjunto y por anuncio

Leyenda: **APAGAR** · **REEMPLAZAR** (pausar y sustituir por mensaje nuevo) · **VIGILAR** (dejar, releer en fecha) · **REVIVIR** (ganador desatendido: sacarlo a escalado o darle presupuesto) · **ESCALAR** · **FUSIONAR** · **PODAR** (dejar un portador por mensaje). Ningún cambio se ejecuta sin un "sí" de Benjamín.

### 8.1 CONVERSION / ANDORRA — ANDORRA / REGISTRO / ABIERTO (20 €/día)
**Conjunto → BAJAR a 8–10 €/día y convertir en mantenimiento.** Hipótesis: 57 k impresiones/semana y frecuencia 3,9 en un país de ~85 k habitantes: el techo es el alcance, no el presupuesto; cada euro extra compra repetición, no registros (4 registros en 293 €).

| Anuncio | Acción | Hipótesis |
|---|---|---|
| IMG / PARED STRIPE | **ESCALAR dentro del conjunto / VIGILAR** | Único con registros en 7d (2 a 7,39 €). El mensaje más corto y directo ("Stripe no opera en Andorra, Kunfupay sí") convierte porque el residente en Andorra ya conoce el problema: es nivel 4, no necesita educación. |
| IMG / TWEET ANDORRA · IMG / AVISO ANDORRA | **APAGAR** | Mismo copy que PARED STRIPE con visuales que no paran el scroll (CTR 0,6–0,7 %). Son variantes de formato del ganador y le roban subasta. |
| IMG / NOTICIA | **APAGAR** | 70 € y 0 registros (> 5x objetivo). El visual "noticia" infla clics (CTR 2,2 %) pero el copy "sin LLC" pre-enmarca un problema (la LLC) que el residente andorrano no tiene: clic de curiosidad, no de intención. |
| IMG / PROFESOR · IMG / PIZARRA | **APAGAR** (PIZARRA) · **VIGILAR** (PROFESOR) | Mismo copy que NOTICIA. Dejar un solo portador (PROFESOR, 0,19 € de gasto) para comprobar si sin el visual "noticia" el mensaje aún merece leerse; si en 7 días no gasta, sustituir. |
| IMG / 3 fallos cobro · IMG / CANDADO | **APAGAR ambos** | "3 fallos" ya gastó 59 € con CTR 2,3 % y 0 registros: el listado educa pero no da razón para registrarse hoy. CANDADO es el mismo mensaje. |
| REEL / LLC Andorra | **APAGAR** | 62 € / 2 registros / 31 € (fuera del techo). Habla de "montar una empresa en Andorra" a gente que ya la tiene o no la necesita: persona equivocada. |
| MANYCHAT / Podcast Andorra | **APAGAR** | 30 € / 0 registros. Arranque tipo FAQ genérico ("¿qué opciones tengo?") sin promesa ni dolor: sin gancho. |
| IMG / 5 PREGUNTAS · IMG / IFOPRODUCTOR ANDORRA | **REEMPLAZAR** | < 1,2 € cada uno tras 17 días: Meta los descarta por CTR inicial (0,5–1 %). No esperar: sustituir por los 3 mensajes de §7.4. |

### 8.2 CONVERSION / OPTIMIZACION FISCAL — OPTIMIZACION FISCAL / ESP (20 €/día)
**Conjunto → SEPARAR en dos ángulos** (liquidez / fiscal-MoR) dentro de la campaña de testeo y **sacar ganadores a la CBO**. Hipótesis: es el mejor conjunto de la cuenta (9,4 €/registro), pero lo sostiene un mensaje de liquidez; el ángulo fiscal nunca se ha leído de verdad y los dos verdes históricos están sin entrega.

| Anuncio | Acción | Hipótesis |
|---|---|---|
| REEL / Profitstride - FISCAL | **ESCALAR (CBO) + VIGILAR + producir sucesores** | 31 registros a 11,87 €; pasa a 18,54 € en 7d con frecuencia subiendo: se agota. Es el mensaje más fuerte de Kunfupay ("dinero retenido por Stripe") y merece su propio ángulo con 9 mensajes nuevos (§7.3). |
| REEL PODCAST JUANEN | **REVIVIR (CBO) tras reescribir copy** | 22 registros a 5,51 € (el CPR más bajo de la cuenta) y 0,12 € en 7d: Meta lo dejó sin presupuesto cuando entró Profitstride el 03-09. Un ganador no vuelve a perdedor. Antes de escalar, quitar "te ahorras asesor, fiscalista y abogados" y "elegir dónde facturar" [X]. |
| REEL / LLC ESPAÑA 2 | **ESCALAR (CBO)** | 8,23 €/registro y mejor CTR que su gemelo. Pero su problema central es "cómo cobras desde tu LLC con métodos locales": pertenece al ángulo Métodos de pago, no al fiscal. |
| REEL / LLC ESPAÑA | **APAGAR** | Mismo mensaje que "2" con peor CPR (14,48 €) y CTR. Duplicado. |
| REEL / LLC RUBEN EEUU | **REVIVIR (CBO) tras reescribir copy** | 10,78 €/registro (4), 1,33 € en 7d. "Beneficios fiscales sin LLC" es la frase de mayor riesgo de marca de la cuenta: reformular como "la misma operativa internacional sin montar nada fuera" [X]. |
| IMG / CARGA FISCAL | **VARIANTE** (mover a la CBO dinámica como variante estática de LLC RUBEN) | Mismo copy que LLC RUBEN, CTR 3,5 %, sin gasto. No es un anuncio nuevo; puede sumar como variante en el dinámico. |
| IMG / NOTICIA FISCAL | **APAGAR** | Tercera versión del mismo mensaje LLC, 0,27 € en 17 días. |
| IMG / SIN RIESGO FISCAL | **REVIVIR en el nuevo conjunto fiscal-MoR** | 2,37 € de gasto: nunca se leyó. Es el único mensaje fiscal on-brand (vendedor oficial / merchant of record) y el que la marca debe poseer; compitiendo contra vídeos UGC en el mismo conjunto no recibirá presupuesto jamás. |
| IMG / FACTURA FISCAL | **VIGILAR en el conjunto fiscal-MoR** | 1 registro con 1 € y CTR 7,4 %: la mejor señal por euro del conjunto. Necesita 36–60 € de gasto para leerse. |
| IMG / FACTURA 2 FISCAL | **APAGAR** | Mismo copy que FACTURA FISCAL; dejar un portador. |

### 8.3 CONVERSION / METODOS DE PAGO (2 conjuntos)
**Test - AUD SIMILAR REGISTRO → APAGAR el conjunto.** Hipótesis: 7 días, 72 €, 0 registros (> 6x objetivo); una LAL 1 % con Advantage+ expansion es casi broad, así que solo duplica los mismos 11 anuncios y compite contra ANDROMEDA en la misma subasta.
**ANDROMEDA / METODOS DE PAGO → REEMPLAZAR el 90 % de los anuncios y convertirlo en el conjunto-ángulo "fuga de ventas".** Hipótesis: 22 anuncios con un solo copy no testean nada; el ángulo madre de Kunfupay tiene 10 mensajes conocidos (§7.1) y ninguno está en la cuenta.

| Anuncio | Acción | Hipótesis |
|---|---|---|
| CARRUSEL / PAGO GLOBAL (ANDROMEDA) | **VIGILAR 3 días → APAGAR si no vuelve a < 20 €** · opcional en CBO como naranja | 7 registros a 28,97 € histórico, 76 € en 7d con frecuencia 3,2 en broad ES: Advantage+ lo encerró en un bolsillo pequeño y lo quemó. Mensaje de mecanismo ("todos los métodos en uno") sin dolor previo: solo convierte a quien ya buscaba. |
| VID / CARRUSEL MEDIEVAL | **VIGILAR (mantener como 1.º mensaje del nuevo conjunto)** | Único copy distinto: nombra PIX, Nequi, SPEI y el coste ("no te escribe, no compra"). 1 registro a 9 € con 5 días de vida. Es el nivel 1–2 que falta. |
| REEL / RAFA · REEL / DANI · IMG / NOTICIA PAGO GLOBAL | **REESCRIBIR copy y mantener** | CTR 2,7 % / 3,6–5 % / 2,8 % sin gasto: el visual funciona y Meta no lo financia porque compite con el carrusel. Dar a cada reel su propio mensaje (la historia de cada creador es un mensaje distinto) los convierte de duplicados en anuncios. |
| IMG / TWEET PAGO GLOBAL | **REESCRIBIR copy y mantener** | CTR 3,3–3,5 % con 1–6 €: mismo caso, formato tweet vale para un "dato que sorprende". |
| IMG / COMPARA PAYPAL | **REESCRIBIR** | El visual compara con PayPal y el texto dice "un solo link": mensaje y visual desalineados. Con un copy de comparativa (retenciones / cambio de divisa `[dato a validar]`) es el mensaje 6 de §7.1. |
| REEL / NEREA · IMG / SKOOL · IMG / NAVY · REEL / TREN | **APAGAR** | CTR 0 % o < 1,2 % en ambos conjuntos con > 100 impresiones: el primer segundo o el visual no paran el scroll. Meta ya los descartó. |

### 8.4 V2 CLASSROOM PLATINUM (3 conjuntos)
**ANDROMEDA CLASSROOM → APAGAR (FUSIONAR en HERNAN).** Hipótesis: mismos 15 ids de creativo, misma landing, mismo evento; CPL histórico idéntico (16,9 vs 17,8 €). Dos conjuntos = una subasta contra ti mismo y el ganador se agota el doble de rápido.
**AUD HERNAN → PODAR a 5 anuncios y mantener a 30 €/día; sacar verdes a una CBO Classroom.**
**FORM CREATOR BUSINESS SCORE → VIGILAR sin tocar hasta el 05-10.** Hipótesis: nació hoy con 12 anuncios a 30 €/día; su evento (formulario) no es comparable con la conversión web de los otros: bajará el CPL y probablemente la calidad (Q1). Leerlo por leads calificados, no por CPL. Con 2,5 €/anuncio/día, Meta elegirá 1–2 y el resto no se leerán: aceptar que es un "elige Meta" o reducir a 5 mensajes realmente distintos (no pude leer sus textos).

| Anuncio | Acción | Hipótesis |
|---|---|---|
| IMG / VIDEOJUEGO CLASSROOM | **ESCALAR (CBO) + VIGILAR + producir 3 sucesores ya** | 43 leads a 15,9–16,6 € histórico; 30,6–42,7 € en 7d. Es el 90 % del gasto de Classroom y se agota: cuando caiga, cae la campaña entera. Un ganador se mantiene en escalado hasta que deje de performar allí, pero hay que tener sucesores antes. |
| IMG / Hormozi Ataud | **REVIVIR (CBO)** | 14 leads a 12,80 € (mejor CPL de Classroom), CTR 8,5 % en 7d y 6,58 € de gasto: VIDEOJUEGO se lo come. El mensaje comparativo "Skool te cobra, nosotros invertimos" es el único de nivel 2 y apunta a la persona correcta (ya tiene comunidad). |
| IMG / TWEET CLASSROOM | **REVIVIR (CBO)** | 9 leads a 8,32–11,66 € entre los dos conjuntos, ~4 € en 7d. Mismo copy que VIDEOJUEGO con visual distinto: como variante dentro del dinámico suma sin canibalizar. |
| IMG / MOSSERI CLASSROOM | **VIGILAR (mantener en HERNAN)** | 3 leads a 13,45 €: verde justo, poca lectura. |
| IMG / Noticia Ruben | **VIGILAR (mantener en HERNAN)** | Único mensaje de mecanismo ("programa de inversión… tú enseñas, nosotros ponemos la inversión"); 1,65 € de gasto: nunca leído. Necesita 54 € para veredicto. |
| RUBEN PIZARRA / CLASSROOM | **APAGAR** | 141 € / 2 leads / 70,56 €. La escasez "100 plazas gratis" + CTA APPLY_NOW atrae curiosos, no creadores con +10K. |
| RUBEN_HORMOZI · REEL / RUBEN CLASROOM | **APAGAR** | 26,5 € cada uno, 0 leads. El copy "¿Tienes más de 10mil seguidores? Escucha esta propuesta" no promete nada: todo el peso cae en el vídeo y el vídeo no cierra. |
| REEL / RUBEN PERIODICO | **APAGAR** | Tercer vídeo con el mismo copy vacío; < 1 € en ambos conjuntos. |
| REEL / RUBEN CLASROOM 3 | **REEMPLAZAR** | 6 € / 0 leads; "¿Tu audiencia ya te compra?" es un calificador sin dolor. Sustituir por el mensaje de objeción ("no es agencia ni curso, es inversión"). |
| IMG / ANIMADO · SENSEI · ISLA MOSSERI · RUBEN VS HORMOZI · SKOOL CLASSROOM | **APAGAR** | Cinco visuales más del mismo copy M1 con < 12 € en total y 1 lead entre todos. VIDEOJUEGO y TWEET ya son los portadores de M1. |
| 12 anuncios SCORE | **VIGILAR hasta 05-10** | Sin datos y sin texto leído. |

### 8.5 UGC ACCELERATOR — VSL / UGC ACELERATOR (10 €/día)
**Conjunto → ESCALAR fase 1: 10 → 15 €/día mientras CPR < 2 €.**

| Anuncio | Acción | Hipótesis |
|---|---|---|
| IMG / MARCAS UGC | **ESCALAR + producir 2 sucesores** | 233 registros a 1,38 €, frecuencia 3,96: rinde, pero está en la zona en que los anuncios se agotan de golpe. |
| REEL / DANI UGC VSL | **REVIVIR** | 25 registros a 1,44 € y 0,37 € en 7d: verde histórico sin entrega. |
| IMG / UGC ACELERATOR 8 · 6 | **VIGILAR** | 2,30 € y 1,47 € con 5 registros cada uno: verdes con poca lectura. |
| IMG / PUERTAS UGC | **VIGILAR** | 3,32 €: naranja, 4,77 € en 7d. |
| UGC ACELERATOR 3/4/5/7/9/10 · UGC kunfu chico · UGC kunfu 1 | **REEMPLAZAR** | < 1,2 € cada uno en 11–14 días: Meta no los entrega. Sustituir por 3 mensajes nuevos, no por 8 imágenes más. |

### 8.6 AWARENESS
**VIGILAR.** Sacar ES del conjunto LATAM (solapa con ESP). Archivar el anuncio huérfano "9" del conjunto "🌎 LATAM | Tarjeta".

---

## 9. Lista de cambios que requieren autorización de Benjamín

Nada de esto se ejecuta sin un "sí" explícito, y los cambios no reversibles (pausas de conjuntos) se confirman uno a uno.

1. **Pausar conjuntos:** "Test - AUD SIMILAR REGISTRO / METODOS DE PAGO / ESP" · "ANDROMEDA CLASSROOM PLATINIUM / UGC FOUNDER".
2. **Pausar anuncios (28):** Andorra: TWEET ANDORRA, AVISO ANDORRA, NOTICIA, PIZARRA, 3 fallos cobro, CANDADO, LLC Andorra, Podcast Andorra · Fiscal: LLC ESPAÑA, NOTICIA FISCAL, FACTURA 2 FISCAL · Métodos (ANDROMEDA): NEREA, SKOOL, NAVY, TREN · Classroom (HERNAN): RUBEN PIZARRA, RUBEN_HORMOZI, REEL RUBEN CLASROOM, REEL RUBEN PERIODICO, ANIMADO, SENSEI, ISLA MOSSERI, RUBEN VS HORMOZI, SKOOL CLASSROOM · Awareness: anuncio "9".
3. **Presupuestos:** Andorra 20 → 8–10 €/día · HERNAN 35 → 30 €/día · UGC 10 → 15 €/día.
4. **Crear:** campaña CBO broad de escalado Kunfupay ES (60–80 €/día) con Profitstride, PODCAST JUANEN*, LLC ESPAÑA 2, LLC RUBEN EEUU* (*copy reescrito) · campaña CBO Classroom (40 €/día) con VIDEOJUEGO, Hormozi Ataud, TWEET, MOSSERI · campaña de testeo ABO Kunfupay ES con 3 conjuntos a 20 €/día (fuga de ventas · fiscal-MoR · liquidez).
5. **Producir:** ~30 mensajes nuevos según §7 (10 + 10 + 9), 3 sucesores de VIDEOJUEGO, 2 de MARCAS UGC, 3 para Andorra.
6. **Reescribir copies con riesgo de marca:** PODCAST JUANEN, LLC RUBEN EEUU, CARGA FISCAL.

## 10. Datos que necesito de Benjamín para cerrar el semáforo

- CPL/CPA objetivo y techo naranja reales para: registro Kunfupay, lead Classroom, registro UGC.
- Calidad de lead por ángulo (Q1): ¿los registros de Profitstride califican igual que los de PODCAST JUANEN? ¿Los leads de Classroom tienen de verdad +10K seguidores? ¿Qué porcentaje de los registros de UGC a 1,4 € avanza?
- Landing de Andorra, Fiscal y Classroom (la API no la devuelve para publicaciones de página).
- Qué dicen los 12 anuncios SCORE (texto vacío en la API) y los vídeos de RAFA / DANI / NEREA / TREN, para asignarles mensaje real.
- Validación de claims: "IBAN de Andorra", "sin cuota mensual", "tarjeta Kunfupay", "flexibilidad para elegir dónde facturar".
