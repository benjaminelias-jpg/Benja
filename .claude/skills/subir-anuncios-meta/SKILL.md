---
name: subir-anuncios-meta
description: Sube anuncios (reels o estáticos) a Meta Ads en la cuenta de Kunfupay con el método del equipo. Escribe los textos y títulos, saca la portada, apaga todas las mejoras automáticas de Meta, monta el anuncio sin formulario, lo deja en borrador y lo publica solo si se pide. Úsala cuando pidan «sube este anuncio», «sube este reel/estático al conjunto X», «súbelo con esta UTM» o pasen un Drive con creatividades para Meta.
---

# Subir anuncios a Meta (Kunfupay)

Con esta skill, quien pide un anuncio solo tiene que dar **4 cosas**. Todo lo demás lo hace Claude.

| Dato | Ejemplo |
|---|---|
| **1. La creatividad** | Enlace de Drive (archivo o carpeta), archivo en Slack o en el repo |
| **2. El nombre del anuncio** | `REEL / DEJA DE PERDER VENTAS / MET PAGOS` |
| **3. Dónde va** | Nombre (o ID) del conjunto y, si hace falta, de la campaña: `METODOS DE PAGO / ESP` en `TESTEO ES ADQUISICION KUNFUPAY` |
| **4. La UTM** | La URL completa de destino con sus parámetros, tal cual |

Si falta alguno de los cuatro, pregúntalo **una sola vez** y todo junto. No preguntes nada más: el resto tiene un valor por defecto, más abajo.

Las indicaciones extra del mensaje mandan sobre los valores por defecto. Por ejemplo: «solo Instagram», «5 copys», «súbelo ya» o «déjalo en borrador».

Responde siempre en español.

---

## Datos fijos de la cuenta

| Qué | Valor |
|---|---|
| Cuenta publicitaria | `1087693978270730` |
| Página de Facebook | `596973030161591` |
| Cuenta de Instagram (`instagram_user_id`) | `17841473965301923` |
| Píxel Kunfupay | `611181908386410` |
| Píxel Ignia | `1574993770781104` |
| Herramientas | Conector **Meta** (`mcp__Meta__ads_*`). Si no están cargadas, búscalas con ToolSearch. |

Manda en todas las llamadas a Meta el mismo `client_conversation_id`, el que devuelva la primera llamada.

---

## Valores por defecto (lo que NO hay que preguntar)

- **Sin ayudas de Meta.** Todas las mejoras de Advantage+ creativo van en `OPT_OUT` (lista completa en `scripts/build_spec.py`). `contextual_multi_ads` también en `OPT_OUT`.
- **Sin formulario.** El destino es siempre la web de la UTM. Nunca formulario instantáneo.
- **Textos:** 2 textos y 2 títulos como opciones del mismo anuncio.
  - **Texto 1:** MUY largo, unas 5 veces el corto.
  - **Texto 2:** corto.
  - **Los 2 títulos:** cortos (≤ 40 caracteres) y muy distintos entre sí, no la misma idea reescrita.
  - Si piden otro número («5 copys de muy largo a corto»), se respeta y se ordenan de más largo a más corto.
- **Botón:**
  - Copia el que lleven los anuncios activos de ese conjunto.
  - Si no hay referencia: reels con `SEE_DETAILS` («Ver más») y estáticos con `SIGN_UP` («Registrarte»).
- **URL visible:** `kunfupay.com` (en Classroom, `www.classroom.kunfupay.com`).
- **Ubicaciones:** las que tenga el conjunto.
  - **No cambies las ubicaciones del conjunto salvo que lo pidan.**
  - Si piden «solo Instagram» y el conjunto tiene otros anuncios activos, avisa antes de tocarlo (ver «Avisos»).
- **Estado:** se crea en **borrador**. Solo se publica si el mensaje dice «súbelo ya», «publícalo» o similar. Si no lo dice, se deja en borrador y se ofrece publicar.
- **Idioma de los textos:** español de España, de tú (nunca «vos»), salvo que el conjunto sea para otro mercado.

---

## Paso a paso

### 1. Localiza el conjunto y lee su contexto

1. Busca el conjunto con `ads_get_ad_entities` (`level: adset`, filtro `name` `CONTAIN`).
2. Pide estos campos: `id, name, campaign_id, effective_status, targeting, promoted_object, optimization_goal, daily_budget`.
3. Lee también sus anuncios activos (`level: ad`, filtro `adset.id`) y abre 1 o 2 creativos con `ads_get_creatives` para copiar:
   - el **botón**;
   - la **URL visible**;
   - el **tono** de los textos (cierres, aviso legal, lista «para quién es»).
4. Apunta si el conjunto ya es solo Instagram (`publisher_platforms: ["instagram"]`) o tiene ubicaciones automáticas. De eso dependen las reglas del paso 5.

### 2. Consigue la creatividad

- **Drive:**
  - Para listar una carpeta pública, usa `scripts/drive.py ls <ID_CARPETA>`. Funciona aunque el buscador del conector de Drive no la encuentre.
  - Para bajar un archivo: `scripts/drive.py get <ID_ARCHIVO> <destino>`. Bájalo **en un directorio vacío propio**.
  - Cualquier Python que lea lo descargado se ejecuta con `python3 -I`.
- **Slack:** `slack_read_file` solo baja hasta 10 MB. Si pesa más, pide el enlace de Drive.
- **Revisa el archivo:** `ffprobe` para medidas y duración. Reel: 1080×1920. Feed: 1080×1350 (4:5). Stories: 1080×1920.

### 3. Entiende lo que dice el anuncio (no escribas a ciegas)

- **Reels:** genera una hoja de fotogramas con `scripts/hoja.sh <video> <salida_dir>`. Saca:
  - `hook.jpg`: los primeros 8 s a 2 fps, para leer el gancho exacto;
  - `subs.jpg`: un fotograma cada 1,5 s, para leer los subtítulos;
  - `portada.jpg`: el fotograma de 0,6 s.

  Míralas y apunta el gancho, las cifras y el cierre. El copy tiene que contar lo mismo que el vídeo y repetir su cifra tal cual (si dice «hasta un 30 %», el texto dice «hasta un 30 %»).
- **Estáticos:** mira la imagen. El titular de la imagen abre el texto largo.
- **Portada del reel:** usa un fotograma con el gancho visible, normalmente entre 0,5 y 1 s. Si `portada.jpg` no sirve, saca otro con `ffmpeg -ss <seg>`.
- PIL puede fallar en este entorno. Para montar imágenes usa `ffmpeg` (`tile`, `hstack`).

### 4. Escribe los textos y títulos

**Estructura del texto largo:**
1. **Gancho:** el mismo del vídeo o de la imagen.
2. **Dolor concreto:** una escena real, por ejemplo «tu alumno ya dijo que sí, abre tu enlace y no puede pagarte».
3. **Mecanismo:** «Con Kunfupay cambia una sola cosa: …», en 3 o 4 líneas con →.
4. **Para quién es y para quién no:** con ✓ y ✕, o ✅.
5. **Cierre:** «Entra y mira si tu negocio encaja.»
6. **Aviso fijo:** «Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.»

**Texto corto:** gancho, una línea de mecanismo y el cierre, en 3 a 6 líneas.

**Reglas de contenido (no negociables):**
- **Fiscal:**
  - Nunca prometer «ahorrar impuestos» ni «pagar menos impuestos».
  - Se dice «los impuestos de cada venta ya no son tuyos / son cosa nuestra», «la factura de cada venta la hacemos nosotros» y «Tu renta, eso sí, sigue siendo tuya».
- **Cifras:** solo las que ya usa la marca, siempre con «hasta» («hasta un 27 % de tu facturación», «hasta un 30 % más»). No inventes cifras nuevas.
- **Cripto:** no aparece en Bali, que se entrega en Indonesia.
- **Sin promesas de resultados garantizados**, sin «gratis» ni «0 %» si no hay oferta cerrada.
- **Competidores:** se pueden nombrar Stripe, PayPal, Hotmart y Skool en el texto, pero nunca sus logos en piezas nuevas.

Guarda los textos en un `.py` en `creatividades/<tema>/_fuente/` que genere:
- `COPYS-<NOMBRE>.md`, legible para el equipo;
- `<nombre>_specs.txt`, con lo que se manda a Meta.

Copia el patrón de `creatividades/metodos-de-pago/_fuente/reel_deja_de_perder_ventas.py`. Haz commit y push.

### 5. Sube los archivos a Meta y monta el creativo

**Subir:** usa `ads_creative_upload_media` con `upload_source: URL`.
- **Vídeo:** `media_url` = `https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t`. Meta lo acepta directo.
- **Imagen o portada:**
  - Haz commit al repo y usa la URL raw de GitHub: `https://raw.githubusercontent.com/<owner>/<repo>/<rama>/<ruta>`.
  - Guarda el `hash`.
- **Si el vídeo vuelve con `processing`:** espera a que esté listo (`ads_get_ad_videos`) antes de crear el anuncio.

**Montar el creativo:** con `scripts/build_spec.py` (entrada JSON → creativo JSON listo para `ads_create_ad`). Pon `solo_instagram` según las ubicaciones **del conjunto**. El formato cambia según eso:

**A. Conjunto solo Instagram** (`solo_instagram: true`): personalización por ubicación.
- `asset_feed_spec` con **una etiqueta compartida por tipo**: todos los textos llevan `<p>_b` y todos los títulos `<p>_t`. Así salen todas las opciones en todas las ubicaciones. Con etiquetas distintas solo se ve una.
- **Reglas por ubicación:** Meta exige **al menos 2**: `[stream, explore_home, profile_feed, ig_search]` y `[story, reels]`.
- **Estático con dos tamaños:** el 4:5 (`_f`) en la regla de feed y el 9:16 (`_s`) en la de stories y reels.
- `optimization_type: "PLACEMENT"`.
- Vídeo con `thumbnail_hash` (la portada) y `ad_formats: ["SINGLE_VIDEO"]`. Imagen con `["SINGLE_IMAGE"]`.

**B. Conjunto con ubicaciones automáticas** (Facebook, Instagram, Audience Network, Threads; `solo_instagram: false`): **nunca reglas por ubicación.**
- Con reglas, Meta limita el anuncio a menos ubicaciones y casi no lo entrega. Pasó con los reels de Classroom Platinum: 0 impresiones en 3 días.
- Se monta como un vídeo o imagen normal (`video_data` o `link_data`) con el primer texto y el primer título. El enlace va dentro de `call_to_action.value.link`.
- Los demás textos y títulos van como opciones en `asset_feed_spec` (`bodies` y `titles` sin etiquetas, `optimization_type: "DEGREES_OF_FREEDOM"`).
- Sin `video_data`/`link_data`, DEGREES_OF_FREEDOM da «link field required».
- En imagen solo va el 4:5.

### 6. Crea el anuncio en borrador

1. Crea el anuncio con `ads_create_ad`: `ad_set_id`, `ad_name` (exacto, como lo dieron) y `creative` (la salida de `build_spec.py`). Pasa `hide_ui: true` si subes varios.
2. **Mira siempre `active_errors`** en la respuesta. Si no está vacío, corrige y vuelve a crear.
3. Si el resultado es demasiado grande, se guarda en un archivo. Extrae `ad_id` y `active_errors` con `python3 -I`.

### 7. Publica (solo si lo piden)

1. Publica con `ads_activate_entity`:
   - `entity_id`: el ID del anuncio;
   - `object_ids`: el anuncio, más el conjunto si tiene cambios en borrador;
   - `publish_as_active: true`.
2. Hazlo de **un conjunto en uno**: si falla, falla en silencio.
3. Comprueba que se publicó con `ads_get_ad_entities` (`level: ad`, filtro por nombre). Lo normal justo después es `IN_PROCESS` o `PENDING_REVIEW`, y en unos minutos u horas pasa a `ACTIVE`.

### 8. Informa

Dilo corto:
- dónde quedó (campaña, conjunto, ID del anuncio);
- si está en borrador o publicado;
- los 2 títulos;
- la UTM;
- lo que haya que vigilar.

Si quedó en borrador, ofrece publicarlo.

---

## Avisos que hay que dar (antes de actuar)

- **Pasar un conjunto a solo Instagram:**
  - Hay que reenviar el `targeting` **completo**: el campo se sustituye entero. Copia edad, `age_range`, `geo_locations` con `location_types`, `custom_audiences`, `targeting_relaxation_types` y `targeting_automation`, y añade `publisher_platforms` e `instagram_positions`.
  - Meta vuelve a revisar **todos** los anuncios del conjunto y reinicia el aprendizaje. Si el conjunto tiene anuncios activos, avísalo y deja que el usuario decida.
- **«En preparación» en el Administrador:** es normal tras publicar o tras cambiar el conjunto. No edites nada mientras tanto, porque cada edición lo reinicia. Si sigue igual 24 h después, revísalo.
- **Categoría especial (financiera, por ejemplo Miami o EE. UU.):** no admite públicos similares, solo edad 18–65 y sin código postal. Si el conjunto la necesita, va en otra campaña.
- **Conversión «Leads_logrados_gracias»:** en el `promoted_object` va como `{"pixel_id":"611181908386410","custom_event_type":"OTHER","pixel_rule":"{\"and\":[{\"event\":{\"eq\":\"PageView\"}},{\"or\":[{\"URL\":{\"i_contains\":\"\\/gracias\"}},{\"URL\":{\"i_contains\":\"gracias\"}}]}]}"}`, no con `custom_conversion_id`. Si no, da «Promoted Object Invalid».
- **No pongas un anuncio en DELETED si solo existe en borrador:** queda un borrador basura que hay que descartar a mano. Para quitar un borrador, usa `discard_draft_changes`, que es un paso de vista previa más confirmación del usuario.
- **Subir a Google Drive:** el conector no sirve para imágenes ni vídeos. Entrega un zip por carpeta de destino para arrastrar a mano.

## Errores conocidos

| Error | Causa | Solución |
|---|---|---|
| «link field required» | `DEGREES_OF_FREEDOM` sin `video_data`/`link_data` | Formato B del paso 5 (o `PLACEMENT` con reglas si es solo Instagram) |
| El anuncio está activo, sin errores y con 0 impresiones; el Administrador avisa de «ubicaciones limitadas» | Reglas por ubicación en un conjunto con ubicaciones automáticas | Edita el creativo del mismo anuncio al formato B (`ads_update_entity` con `creative`, luego `ads_activate_entity` con sus `object_ids`). No crees anuncios duplicados. |
| «at least 2 rules» | Una sola regla de ubicación | Añade la segunda regla (ver paso 5) |
| Solo sale 1 texto o 1 título | Etiquetas distintas por texto | Una etiqueta compartida por tipo |
| «Promoted Object Invalid» | Conversión personalizada mal puesta | Formato `pixel_rule` (ver arriba) |
| «lookalike not allowed» | Campaña con categoría especial | Campaña sin categoría o sin similares |
| Se publica la campaña y no los conjuntos | Error silencioso | Lee `active_errors` y publica conjunto a conjunto |
| «Invalid adgroup status» | Borrador puesto en DELETED | Descarta el borrador a mano en el Administrador |

## Archivos de esta skill

- `scripts/build_spec.py`: arma el creativo (reel o estático) desde un JSON de entrada. Lee el ejemplo en su cabecera.
- `scripts/drive.py`: lista carpetas públicas de Drive y descarga archivos (`ls` / `get`).
- `scripts/hoja.sh`: hojas de fotogramas (gancho, subtítulos) y portada de un reel con ffmpeg.
