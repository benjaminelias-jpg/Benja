# Análisis completo del estilo de edición de @alejo.munozzz

**Perfil analizado:** [instagram.com/alejo.munozzz](https://www.instagram.com/alejo.munozzz/) — Alejo Muñoz, "Rogue Creator. No tengo nada para venderte"
**Fecha del análisis:** 20 de agosto de 2026
**Corpus:** 100 reels scrapeados (Apify), 48 videos descargados y analizados frame a frame (~4.400 frames), 47 transcripciones completas de audio (Whisper), 100 captions.

---

## Resumen ejecutivo

@alejo.munozzz (62.202 seguidores, nicho dinero/marca personal/marketing en español rioplatense) opera un **sistema de contenido bimodal deliberado**: la mitad del feed son piezas crudas sin edición (0–2 cortes/10s) que generan el alcance, y la otra mitad son edits "premium" estilo Hormozi/Gadzhi (12–27 cortes/10s) que convierten a un funnel de comentario→DM automatizado con ManyChat.

**El hallazgo central es contraintuitivo: la relación entre densidad de edición y alcance es inversa.** Sus 5 reels más vistos (~2,27M views combinadas) promedian ~2 cortes/10s; su reel más editado (134 cortes en 53s) es el de peor alcance de la cuenta (1.282 views). El más visto de todos (968k) tiene **cero cortes**: una toma única estilo "consultoría en vivo". El activo real de la cuenta no es la edición — es el guion, la puesta en escena y un funnel quirúrgico.

**Números clave del corpus (scrape 20-08-2026):**

| Métrica | Valor |
|---|---|
| Reels publicados | 100 (27-may → 20-ago 2026, ~1,2/día) |
| Views totales | 2.889.464 |
| Mediana de views | 4.296 |
| Reels >100k views | 4 (concentran ~75% de las vistas) |
| Duración mediana | 41s (rango 6–178s) |
| Captions con CTA "Comentá X" | 39/100 |
| Hashtags usados | 0 en los 100 reels |

Los documentos de detalle completo están en [`anexos/sintesis-edicion-visual.md`](anexos/sintesis-edicion-visual.md) y [`anexos/sintesis-guiones.md`](anexos/sintesis-guiones.md). Abajo, el resumen integrado.

---

## 1. Los 9 formatos que usa (taxonomía)

| Familia | Cortes/10s | Views típicas | Ejemplo top |
|---|---|---|---|
| A. One-take crudo / skit callejero con auto | 0 | 306 → **968k** | DaBSv-cvDWD |
| B. Monólogo al volante + titular fijo (letterbox) | 0 | **469k** | DZz5T6GRqzs |
| C. Selfie crudo lifestyle (enduro, dique, pasillo) | 0–2 | 5k → **96k** | DaGqXOPPwkw |
| D. Clip de podcast letterboxed, subtítulo serif | 0 | 7–12k | Da0TL-Lx3Ct |
| E. Demo/clase con pantalla (dashboard, pizarra) | 0–1 | 13–29k | Dafh3bQR3Uo |
| F. Documental exposé / biopic | 1,8–2,8 | 3k → **241k** | DaoMM3IKVUG |
| G. Texto fijo sobre plano lifestyle (6–8s) | 0–3,6 | 20–34k | DakkPO-By1- |
| H. Reel-póster estático de conversión | 0 | 20k | DaSjHErxEch |
| I. Talking head + edit editorial (27 reels) | 6,8–32,7 | 1,3k → **498k** | DbqM3YCxkqI |

La familia I se divide en **I1 awareness** (sermones identitarios sin CTA — ahí están sus dos edits virales: "Cuidado con el hombre que piensa demasiado", 497k, y "El hombre que sabe estar solo", 76k) e **I2 conversión** (keyword gigante + preview blureado — techo de 3,6k views pero ratios de comentario altísimos).

---

## 2. De dónde saca los elementos de b-roll

Catálogo completo por fuente, con las pistas forenses que lo delatan:

1. **Stock cinematográfico premium (Artgrid/Artlist/Storyblocks/Pexels):** macros de ojos, montañas suizas (Matterhorn), NYC con vapor, cápsulas cayendo en agua, serpientes sobre tela dorada. Pista delatora: un libro subrayado con texto **en francés** (Dau9jvrqITz).
2. **Packs de b-roll circulantes entre editores (Telegram):** al menos 3 reels usan clips con interfaz **en cirílico/ruso** (feed de Reels ruso, botón "Подписаться", concesionaria Toyota rusa) — la firma del circuito de editores del nicho.
3. **Clips de películas** que codifican "sigma/ambición": *Nightcrawler* (2 veces), *American Psycho*, *Fight Club*, *Demolition*.
4. **Archival histórico/deportivo** (dominio público): peleas de Mike Tyson en B&N, fútbol clásico (Pelé), footage 1900s, manuscritos de Newton.
5. **Screen recordings propios:** timelines de Premiere Pro y DaVinci Resolve (su propio trabajo como prueba de autoridad), pizarras Miro/FigJam con embudos TOFU/MOFU/BOFU, su dashboard, capturas de YouTube e Instagram.
6. **"Filmar el monitor" con el celular** en vez de screen recording (reflejos y moiré incluidos, dedo señalando): decisión consciente de autenticidad en sus 2 demos más convertidoras.
7. **Material propio (el activo más grande):** estudio de podcast (SM7B, silla Corsair, rim light rojo), pickup azul, moto de enduro #99 con pechera Fox, gym, mate, campo mendocino, Bariloche, Dubái, G-Wagon/Aston Martin. Recicla sus clips entre reels.
8. **IA generativa (Midjourney + Runway/Kling):** confirmada en 2 reels — stills B&N animados de multitudes espectrales y nebulosas cósmicas.
9. **Mockups/CGI de librería (After Effects / Envato):** diarios falsos "National Confuser", iPhone explotando notificaciones 3D, cerebro 3D, render de escritorio con screen-replace.
10. **Clips de otros creadores** para el formato exposé: archivo de Jaime Higuera, eventos de Alex Hormozi, fotos de prensa de Hormozi/Gadzhi glitcheadas.

---

## 3. Tipografías

**Sistema editorial de 3 voces** (en los edits; siempre blanco, centrado, palabra-por-palabra, sin karaoke de color):
1. **Sans grotesca minúscula** de tracking apretado para el flujo hablado — parece Helvetica Now / Neue Haas Grotesk / SF Pro.
2. **CAPS extra-bold con punto final retórico** ("EXTINCIÓN", "MURIERON.", "TE DELATA.") — parece **The Bold Font** (el estándar de los editores del nicho Hormozi/Gadzhi) o Archivo Black. Con rellenos especiales: dorado, cromado, cromo Y2K, naranja, knockout con textura, masking detrás del cuerpo.
3. **Serif didone itálica de lujo** (Ogg/Playfair/Didot Italic) para remates editoriales ("al revés.", "el copywriter.") + caligráfica inglesa (Monsieur La Doulaise) para el toque luxury.

**Sistema crudo:** subtítulos auto-generados estilo CapCut/TikTok Classic (sans redondeada tipo Proxima Nova/Poppins), sentence case, con errores de transcripción **sin corregir** — la crudeza es deliberada.

**Piezas especiales:** subtítulo serif (Georgia) en barra negra para podcast confesional; titular ALL CAPS fijo los 61 segundos (DZz5T6GRqzs — quien entra en cualquier segundo ve la promesa); name-card documental "JAIME Higuera." (condensada bold + itálica editorial, código true-crime).

---

## 4. Color, efectos y ritmo

**8 looks recurrentes con función narrativa:** B&N alto contraste + grano + aberración cromática (= "verdad/archivo", unifica material ajeno); light leaks magenta sobre el talking head (firma del set); lavados monocromáticos por bloque temático (rojo=urgencia, teal=sistema, verde=dinero); teal & orange fílmico (su edit más viral); low-key cálido de podcast; whiteouts pastel como puntuación; **natural iPhone HDR sin grade** (el look de sus 4 reels más vistos); especiales (scrapbook de papel, VHS, neón de club). Regla transversal: caos cromático en el desarrollo, **claridad limpia en el CTA**.

**Efectos firma:** RGB split/aberración cromática constante (video y texto), whiteouts como transición, frames negros con solo texto como respiración, masking de texto detrás del sujeto, tarjeta PiP con **preview blureado del lead magnet** (recurso propietario), rotaciones 90°/180°. Ausencia notable: casi no usa shake ni punch-ins sobre el talking head.

**Ritmo por familia:** crudos 0–1,5 cortes/10s (13 reels con 0 cortes literales) · documental 1,8–2,8 · edits respirados 6,8–11,5 · hypercuts 12–32,7 (pico: 93 cortes en 28s). En los hypercuts la regla es 1 palabra = 1 plano.

---

## 5. Patrones de guion

**12 familias de hooks** identificadas (detalle completo en el anexo). Las que dominan el alcance: identitario-masculino ("Cuidado con el hombre que piensa demasiado" — 497k), pregunta directa con cifra ("¿Tenés dos minutos para decirme cómo facturar más de $50.000 con mi marca personal?" — 968k), name-dropping + loop (469k), exposé con nombre propio (241k), dato absurdo-específico ("Mi perro me generó $1.500 en menos de 60 minutos" — 96k).

**El "guion madre" reciclado 11 veces:** los 3 videos que venden (historia + "VSL oculto" + objeciones/"caballo de Troya"), el orden "de adentro hacia afuera", empaquetado como "ecosistema circular" y anclado a "$50.000 con tu marca personal". Se testea en múltiples formatos: el mismo framework hizo 19,3k como sketch y 1,8k como talking head — **el formato multiplica 10x el mismo mensaje**. Incluso republica guiones palabra por palabra para re-testear distribución.

**Arquitectura de conversión estándar (30–66s):** hook con cifra (0–4s) → diagnóstico del error (4–10s) → giro/absolución al 40–60% ("no es tu culpa: nadie te lo explicó") → prescripción numerada → CTA con keyword (últimos 5–7s).

**Arquitectura sketch:** "Hey Alejo, ¿tenés un minuto?" → gag → diagnóstico socrático por checklist de "no"s → prescripción → **pregunta plantada** ("¿y cómo puedo saber más?") → CTA diegético — el CTA no lo dice el vendedor, lo pide el cliente.

**Técnicas de persuasión:** cifras nunca redondas ($1.497, 17,8%, ROAS 30), naming propietario, enemigo común en 4 niveles (de "la mayoría" hasta el exposé nominal), autoridad prestada (Hormozi, Tyson, "referentes americanos"), anti-venta ("no tengo nada para venderte") y la **firma anónima** repetida en 8+ reels: *"No importa mi nombre. Posiblemente no me vuelvas a ver."*

**Dos registros que parecen cuentas distintas:** (A) conversión/marketing — views moderadas, comentarios altos; (B) identitario/espiritual — views y likes máximos (hasta 8% like/view), comentarios casi nulos, cero CTA. El registro B es la "capa viral" de su propio ecosistema; el A captura ese alcance vía ManyChat. Ratio deliberado ~50/50.

---

## 6. Sistema de CTA y funnel

**Fórmula madre:** `Comentá "KEYWORD" y te [envío/mando] [deliverable] ahora mismo` — 30+ keywords catalogadas (entrenamiento, sistema, ecosistema, Claude, plantilla, autoridad, referente...). En pantalla: lockup de 3 líneas con la **keyword gigante entre comillas** en extra-bold + tarjeta con preview blureado del lead magnet. La keyword espeja exactamente el caption; el DM lo automatiza ManyChat (visible en su propio dashboard).

**Captions:** ultra cortos (~80% una línea), **cero hashtags/menciones/emojis/links en los 100 reels**, typos sin corregir (disfraz nativo), elipsis como loop. Dato: CTA + segunda línea narrativa casi duplica views vs. CTA seco (~5.980 vs ~3.150).

---

## 7. Herramientas y equipo (inferido por evidencia en pantalla)

- **Edición:** Premiere Pro y DaVinci Resolve (timelines visibles en sus propios screen recordings), After Effects (masking, Element 3D, packs), CapCut/IG Edits para los crudos (auto-captions con errores).
- **IA:** Midjourney + Runway/Kling (b-roll generado), **Claude en modo agente** (su dashboard de métricas, conectado a ManyChat).
- **Funnel:** ManyChat (comentario→DM).
- **Pizarras:** Miro/FigJam.
- **Captura:** iPhone (crudos), mirrorless para podcast, GoPro/wide en parabrisas.
- **Equipo:** él mismo declara en pantalla "5 EDITORES + el copywriter" (Dau9jvrqITz); las plantillas compartidas entre reels confirman una operación de agencia con sistema, no un editor solo.

---

## 8. Conclusión estratégica

La cuenta ejecuta en la práctica el sistema que predica en sus guiones: piezas crudas de premisa fuerte para el alcance (el guion y la puesta en escena hacen todo el trabajo), edits cinematográficos lentos para la identidad aspiracional, y hypercuts con keyword para convertir a la audiencia ya ganada — donde el objetivo no son views sino comentarios (su mejor convertidor: 304 comentarios con 141 likes).

Para quien quiera replicar el estilo, la lección jerárquica es clara: **primero el guion** (hooks con cifra, guion madre reciclado, loops), **después la puesta en escena** (auto, mastermind, estudio), y recién al final la edición — que en esta cuenta funciona como uniforme de marca del fondo de embudo, no como motor de viralidad.

---

*Metodología: scraping de perfil y reels vía Apify (instagram-scraper / reel-scraper); descarga de los 48 videos con URL accesible; extracción de ~4.400 frames + detección de cortes de escena con ffmpeg; análisis visual frame a frame y transcripción Whisper (small) de los 47 con audio; análisis multi-agente en paralelo y síntesis. Las citas de guiones son literales de las transcripciones (con correcciones documentadas de errores fonéticos de Whisper). Views/likes/comentarios corresponden al snapshot del 20-08-2026.*
