# Creator Business Score · resultado por correo

Sustituye a la landing (`landings/classroom-platinum-score/v1`). Las 5 preguntas
se hacen en un **formulario instantáneo de Meta**; las respuestas caen en una
**hoja de Google**, y un **Apps Script** vinculado a la hoja calcula el puntaje
con el mismo motor de la landing y **envía por correo la página de gracias**:
puntaje en un dial, medalla, cuello de botella, calificación, barras,
diagnóstico y pasos. El correo es **100 % HTML** (estética de la serie
transaccional de Classroom): no lleva imágenes, así que se ve igual aunque el
cliente de correo las bloquee y no hace falta subir nada a Drive. (El modo
con la medalla como imagen sigue disponible: `CONFIG.MODO_CORREO: 'medalla'`.)

```
Formulario instantáneo (Meta)
        │  lead nuevo → integración nativa de Meta con Google Sheets (gratis, sin Make)
        ▼
Hoja de Google ──"al cambiar la hoja"──▶ Apps Script (vinculado a la hoja)
                                            │  1 · puntaje + caso + calificación (motor de la landing)
                                            │  2 · correo HTML por la API de Brevo (o por Gmail)
                                            │  3 · escribe el resultado en la fila
                                            └─ 4 · (opcional) manda todo a un webhook de salida (CRM, Notion…)
Reloj cada 1 min ── respaldo: recoge lo que quedara pendiente
(Opción B) Make ──POST──▶ webhook del script: si prefieres no usar la integración Meta → Sheets
```

## Qué hay en esta carpeta

| | |
|---|---|
| `apps-script/Codigo.gs` | Todo el sistema: motor, hoja, disparadores, correo (Brevo o Gmail), webhook opcional, menú. Es lo único que se pega en Apps Script. |
| `apps-script/appsscript.json` | Manifiesto opcional (fija los permisos). No hace falta para que funcione. |
| `hoja/creator-business-score-leads.xlsx` | Plantilla de la hoja: pestañas **Leads**, **Formulario Meta** (textos exactos) y **Cómo funciona**. |
| `medallas/img/` | Solo para `MODO_CORREO: 'medalla'`: las 430 imágenes (215 pares puntaje × diagnóstico). El script las importa solo a Drive. |
| `muestras/` | Los tres correos de muestra (califica · fase de ordenar · fuera de perfil): `correo-html-*` es el correo actual (100 % HTML); `correo-*` el modo con medalla. HTML, texto y capturas. |
| `pruebas/` | Paridad con la landing (3.750 combinaciones), 58 pruebas de integración (hoja tal cual la deja Meta, envío por Brevo, disparador al cambiar la hoja) y generadores de muestras. |

## Instalación (una sola vez, ~20 minutos)

### 1 · El formulario instantáneo de Meta

Administrador de anuncios → campaña de **Clientes potenciales** → formulario
instantáneo nuevo. Tipo **Mayor volumen** o **Mayor intención** (añade una
pantalla de revisión y filtra curiosos).

- **Preguntas de contacto** (predefinidas): *Nombre completo*, *Correo
  electrónico*, *Número de teléfono*.
- **Preguntas personalizadas** → *Opción múltiple*, en este orden y con estos
  textos (también en la pestaña **Formulario Meta** de la hoja, para copiar y
  pegar):

| # | Pregunta | Opciones |
|---|---|---|
| 1 | ¿De qué tamaño es tu comunidad o audiencia activa? | Menos de 1.000 seguidores / Sin comunidad · 1.000 a 5.000 seguidores · 5.000 a 20.000 seguidores · 20.000 a 100.000 seguidores · Más de 100.000 seguidores |
| 2 | ¿Qué opción describe mejor tu situación actual y la de tu negocio digital? | Atrapado en las tareas del día a día · Inestable, con meses altos y bajones · Estancado en la misma facturación de siempre · Estoy creciendo pero necesito equipo · Tengo crecimiento predecible y controlado |
| 3 | ¿Qué producto o servicio vendes principalmente? | Cursos low ticket / Infoproductos grabados · Servicios freelance / Agencia entregada 1 a 1 · Coaching / Consultoría 1 a 1 por tiempo · Mentoría grupal High-Ticket · Modelo híbrido / Programa escalable · E-commerce / Producto físico |
| 4 | ¿Cuál es tu facturación mensual aproximada? | Menos de 1.000 € · 1.000 € – 5.000 € · 5.000 € – 15.000 € · 15.000 € – 40.000 € · Más de 50.000 € |
| 5 | Si pudieras resolver UN solo problema hoy, ¿cuál sería? | Hábitos, rutinas y enfoque del fundador · Autoridad, diferenciación y posicionamiento · Atracción de prospectos calificados · Cierre de llamadas y tasa de conversión · Caos en la entrega, equipo y operaciones |

  El script tolera diferencias de tildes, mayúsculas, signos, puntos de miles
  ("1000 €" = "1.000 €") y el formato en_clave que a veces usa Meta, pero
  **no adivina**: si cambias una opción por otro texto, añádela en
  `CONFIG.ALIAS` (hay un ejemplo en el propio código) o la fila quedará como
  *incompleto*.
- **Pantalla de finalización**: título "¡Listo! Revisa tu correo", texto "En
  unos segundos te llega tu Creator Business Score con tu medalla y tu
  diagnóstico. Si no lo ves, mira en Promociones o Spam.", botón a
  `https://kunfupay.com`.
- Meta exige una **URL de política de privacidad**: la de Kunfupay.

### 2 · Conectar Meta con la hoja de Google (integración nativa, sin Make)

Meta escribe cada lead directamente en una hoja de Google, gratis y en
segundos. En **Meta Business Suite → Todas las herramientas → Formularios
instantáneos** (o *Centro de clientes potenciales*) → tu formulario →
**Configuración del CRM** (*Conectar CRM*) → busca **Google Sheets** →
inicia sesión con la cuenta de Google → crea una hoja nueva (o elige una) y
asigna el formulario. A partir de ahí Meta añade una fila por lead con sus
columnas (`id`, `created_time`, `ad_id`, …, `platform`, las cinco preguntas
con su texto completo, `nombre_completo`, `correo_electrónico`,
`phone_number`, `lead_status`). El script las reconoce tal cual: **no
renombres nada**; él añade al final sus columnas de resultado.

Si prefieres una hoja tuya, `hoja/creator-business-score-leads.xlsx` es la
plantilla (súbela a Drive y ábrela con Hojas de cálculo de Google).

> ⚠ **Quien pueda EDITAR esta hoja puede cambiar el script** y hacer que se
> ejecute como la cuenta que envía los correos (su Gmail y su Drive). Comparte
> la hoja con el equipo solo como *Lector* o *Comentador*. Si alguien tiene que
> trabajar los leads, dale una hoja aparte (una copia o `IMPORTRANGE` de la
> pestaña Leads).

### 3 · El Apps Script

1. En la hoja: **Extensiones → Apps Script**. Borra lo que haya y pega
   `apps-script/Codigo.gs` entero.
2. Arriba, en `CONFIG`, revisa `BREVO_REMITENTE` (`hola@kunfupay.com`: tiene
   que ser un remitente verificado en Brevo, paso 4) y `RESPONDER_A`. Guarda
   (⌘/Ctrl + S).
3. Vuelve a la hoja y recárgala: aparece el menú **Creator Business Score**.
   - **1 · Configurar (una sola vez)** → acepta los permisos (Google avisará
     de que la app no está verificada: *Configuración avanzada → Ir a…*; es tu
     propio script). Crea el disparador **"al cambiar la hoja"** (envía en
     cuanto Meta añade la fila) y el reloj de 1 minuto de respaldo.
   - **2 · Configurar Brevo (clave API)** → pega la clave del paso 4.
   - **Enviarme los 3 correos de prueba** → te llegan los tres desenlaces por
     Brevo. Si no llegan, mira *Estado* y *Detalle* en la hoja: el script
     escribe ahí lo que responde Brevo.
   - *Importar medallas a Drive* solo hace falta si cambias a
     `MODO_CORREO: 'medalla'` (y con Brevo, además `URL_BASE_MEDALLAS`).

### 4 · Brevo (remitente y clave API)

1. Cuenta en [brevo.com](https://www.brevo.com) (plan gratuito: **300 correos
   al día**; si un día entran más leads, las filas esperan y salen al día
   siguiente sin gastar intentos, o subes de plan).
2. **Remitentes, dominios e IP → Dominios → Añadir dominio** `kunfupay.com` y
   **autentícalo** (Brevo te da 2–3 registros DNS: DKIM y DMARC; se publican
   en el DNS del dominio). Es lo que evita que el correo caiga en Spam. Como
   mínimo, en **Remitentes**, añade y verifica `hola@kunfupay.com`.
3. **Tu nombre (arriba a la derecha) → SMTP y API → Claves API → Generar una
   nueva clave API**. Cópiala (empieza por `xkeysib-`) y pégala en la hoja:
   menú **2 · Configurar Brevo**. Queda guardada en las propiedades del script
   (no en el código); el script la comprueba al momento contra Brevo.

> **Alternativa sin Brevo:** `PROVEEDOR_CORREO: 'gmail'` envía desde la cuenta
> de Google que instaló el script (100 destinatarios/día en @gmail.com, 1.500
> en Workspace). En ese caso activa DKIM en Google Workspace (*Aplicaciones →
> Gmail → Autenticar correo*).

### 5 · Probar de punta a punta

En la **Lead Ads Testing Tool** de Meta (developers.facebook.com → herramientas
→ *Lead Ads Testing Tool*): elige la página y el formulario. Si ya hay un lead
de prueba, pulsa **Eliminar lead** (Meta solo permite uno por formulario).
Luego **Vista previa del formulario**, rellénalo con **tu propio correo** y
opciones reales, y envíalo. En segundos aparece la fila en la hoja, el script
la atiende (Estado **enviado**) y te llega el correo.

> *Crear lead* (sin la vista previa) rellena las respuestas con
> `<test lead: dummy data for …>` y el correo `test@meta.com`: el script
> reconoce esa fila como lead de prueba y la deja en *omitido* sin enviar
> nada. Es normal y se puede borrar.

---

## Opción B · con Make (si no usas la integración Meta → Sheets)

El script también expone un webhook: Make recibe el lead de Meta y se lo
manda; el script añade la fila y envía igual. Solo hace falta para esta
opción.

### B1 · Publicar el webhook

En Apps Script: **Implementar → Nueva implementación → ⚙ → Aplicación web**.
*Ejecutar como*: **Yo**. *Quién tiene acceso*: **Cualquier persona**.
**Implementar**. Copia la **URL de la aplicación web** que muestra el diálogo
(termina en `/exec`) y añádele `?token=` y el token que muestra **menú → Ver
token del webhook**:

```
https://script.google.com/macros/s/AKfy…/exec?token=1a2b3c…
```

- Comprobación: abre la URL **sin** el token en una ventana de incógnito; debe
  mostrar `{"ok":true,"servicio":"creator-business-score"}`.
- Trátala como una contraseña: quien la tenga puede hacer que el script envíe
  correos. Si se filtra: *Configuración del proyecto → Propiedades del script →*
  borra `WEBHOOK_TOKEN`, vuelve a ejecutar **Configurar** y pon el token nuevo
  en Make.

> ⚠ **Cada vez que cambies algo en `Codigo.gs`** (también en `CONFIG` o en
> `ALIAS`): Guardar → **Implementar → Gestionar implementaciones → ✏ → Versión:
> Nueva versión → Implementar**. Si no, el webhook sigue con el código
> anterior (el reloj y el menú sí usan el nuevo). La URL no cambia.

### B2 · Conectar Meta con el webhook (Make)

Antes de nada, **envía un lead de prueba real** (paso 5) para que Make tenga
datos que mapear. Luego, escenario nuevo en Make:

1. **Facebook Lead Ads → New Lead** (disparador instantáneo): conecta la
   página y elige el formulario. Quien conecte Facebook debe ser admin o
   editor de la página.
2. **Facebook Lead Ads → Get Lead Details**, con *Lead ID* = el del módulo 1
   (es el que trae las respuestas; si tu módulo 1 ya las trae, puedes
   saltártelo).
3. **HTTP → Make a request**:
   - URL: la de B1 (con `?token=…`). Method: `POST`.
   - Body type: **`application/x-www-form-urlencoded`** (así una comilla en
     una respuesta no rompe el envío).
   - Fields — uno por fila, mapeando desde el módulo 2:

   | Key | Valor |
   |---|---|
   | `id_lead` | ID del lead |
   | `fecha` | Created time |
   | `nombre` | Full name |
   | `email` | Email |
   | `telefono` | Phone number |
   | `comunidad` | respuesta de la pregunta 1 |
   | `situacion` | respuesta de la pregunta 2 |
   | `producto` | respuesta de la pregunta 3 |
   | `facturacion` | respuesta de la pregunta 4 |
   | `problema` | respuesta de la pregunta 5 |
   | `origen` | Platform (fb / ig), opcional |

   - *Parse response*: **Sí**. En *Show advanced settings*: *Timeout* **120**.
4. **Aviso si algo falla**: el script siempre responde con HTTP 200 (Apps
   Script no permite otro código), así que Make pinta la ejecución en verde
   aunque el script diga que no. Añade tras el módulo HTTP una ruta con el
   filtro *Data → ok* **no es igual a** `true` y un módulo de correo que te
   avise con el campo *error* de la respuesta.
5. En los ajustes del escenario, activa **Allow storing of incomplete
   executions** y ponlo en *Immediately*. Si Make reintenta un lead, el ID
   evita el correo doble.

> **Si "New Lead" no se dispara nunca:** en *Configuración del negocio →
> Integraciones → Acceso a clientes potenciales*, si la página tiene acceso
> personalizado (por otro CRM), elige la página → *CRM* → asigna **Make**.
> Revisa también el estado del envío en la herramienta de prueba (paso 5).

**Otras formas de cargar la hoja** (el disparador y el reloj las recogen igual):
Make → *Google Sheets → Add a Row* en la pestaña de leads (si el módulo ofrece
*Value input option*, elige **Raw**, para que un texto que empiece por `=` no
se convierta en fórmula); Zapier → *Facebook Lead Ads (New Lead)* → *Google
Sheets (Create Spreadsheet Row)* o *Webhooks by Zapier (POST)* a la misma URL;
o pegar filas a mano.

> ¿Y el webhook de Meta directo al script, sin Make? No es recomendable: exige
> una app de Meta revisada con el permiso `leads_retrieval` y gestionar tokens
> de página, y la app web de Apps Script responde con una redirección en lugar
> de un 200 limpio, algo que los webhooks de Meta no esperan.

---

## La hoja, fila por fila

| Estado | Qué significa | Qué hacer |
|---|---|---|
| *(vacío)* | Pendiente | Nada: sale al momento (disparador) o en la próxima pasada del reloj (1 min). Si *Detalle* dice "Brevo sin créditos", espera al día siguiente o sube de plan |
| `enviando` | Enviándose ahora | — |
| `enviado` | Correo enviado (hora en *Enviado*) | — |
| `error` | Falló el envío (ver *Detalle*: lo que respondió Brevo, p. ej. remitente no verificado o clave mala) | Se reintenta solo hasta 3 veces; corrige la causa y vacía *Estado* |
| `incompleto` | Una respuesta no coincide con ninguna opción | Corregirla (o un `ALIAS` + nueva versión) y vaciar *Estado* |
| `omitido` | Correo vacío o no válido, o lead de prueba de Meta | Corregirlo y vaciar *Estado* (el de prueba, borrarlo) |
| `duplicado` | Ese ID de lead ya recibió su correo | — |
| `revisar` | Se cortó a mitad de envío: pudo salir | Mirar en *Enviados* y, si no salió, vaciar *Estado* |

Para reenviar cualquier fila: vaciar su *Estado* (o **menú → Reenviar la fila
seleccionada**). *Puntaje* es el que ve el lead; *Puntaje real* es el que decide
calificación, caso y UTMs, como en la landing. El script solo escribe las
columnas de resultado (las oscuras): nunca toca lo que rellenó el lead.

## Qué es igual que en la landing, y qué cambia

**Igual, comprobado:** el puntaje real, el mostrado (relleno de +16 %), el caso,
la calificación (≥ 1.000 €/mes y ≥ 5.000 seguidores, nunca e-commerce), las
barras, el diagnóstico, los pasos, el paso 04 de Kunfupay para quien no
califica, y las UTMs de los botones (`utm_term=calificado_si|calificado_no`,
`utm_content=score_N`; en el correo además `utm_medium=email`).
`pruebas/paridad.js` compara las 3.750 combinaciones contra la landing publicada.

**Cambia, por ser un correo:**
- La medalla no va como imagen: el puntaje se dibuja en HTML (dial, pastilla
  del metal, barras), con la estética de los correos transaccionales de
  Classroom. Así se ve completo aunque el cliente bloquee imágenes. En
  `MODO_CORREO: 'medalla'` la cabecera es la imagen y la tarjeta 1080 × 1920
  va adjunta para la story.
- *Aplicar a Classroom Platinum* ya no abre el formulario puente: lleva
  directo al VSL (`CONFIG.URL_APLICAR`). Nombre y teléfono ya los trae Meta.
- Se saluda por el nombre (solo si es un nombre de verdad) y el asunto lleva
  el puntaje y el metal.
- El pie dice quién envía y cómo darse de baja (`CONFIG.CORREO_BAJA`, o
  `RESPONDER_A`). Las bajas que lleguen, añádelas a la lista de supresión de
  las demás herramientas de envío.
- El seguimiento `ps_evento` de la landing no aplica: Meta ya cuenta el lead.
  Para guardar el resultado en otro sitio (el CRM, la base de Notion de la
  landing…), pon su URL en `WEBHOOK_SALIDA`: recibe los mismos campos que la
  landing mandaba a `/api/classroom-platinum/score` más el resultado.

## Mantenimiento

- **Textos del correo o de los diagnósticos:** en `Codigo.gs` (secciones 1,
  6 y 6b), y después **nueva versión** de la implementación. Si usas el modo
  `'medalla'` y cambias un titular de metal, un `desbloqueo` o la escala de
  puntaje, además hay que
  **regenerar las medallas** (las imágenes llevan esos textos), subirlas al
  repo, actualizar `ORIGEN_MEDALLAS` con el commit nuevo, vaciar la carpeta de
  Drive y volver a **Importar medallas**.
- **Regenerar las medallas:** desde la raíz del repo,
  `python3 -m http.server 8244` y en otra terminal
  `node 2026-09-25-correo-creator-business-score/medallas/generar-medallas.js 2026-09-25-correo-creator-business-score/medallas/img`.
- **Pruebas:** `node pruebas/paridad.js medallas/img` y
  `node pruebas/integracion.js`; `node pruebas/correo-html.js` regenera los
  correos de muestra del modo HTML (y `node pruebas/muestras.js medallas/img`
  los del modo con medalla).
- **Plantilla de la hoja:** `python3 hoja/generar-hoja.py` (lee las preguntas
  del propio `Codigo.gs`).
