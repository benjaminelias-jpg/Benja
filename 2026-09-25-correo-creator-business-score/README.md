# Creator Business Score · resultado por correo

Sustituye a la landing (`landings/classroom-platinum-score/v1`). Las 5 preguntas
se hacen en un **formulario instantáneo de Meta**; las respuestas caen en una
**hoja de Google**, y un **Apps Script** vinculado a la hoja calcula el puntaje
con el mismo motor de la landing y **envía por correo la página de gracias**:
medalla, puntaje, calificación, barras, diagnóstico y pasos, con la medalla
adjunta para la story.

```
Formulario instantáneo (Meta)
        │  lead nuevo
        ▼
Make  ──POST──▶  Webhook (app web del Apps Script)
                        │  1 · añade la fila a la hoja "Leads"
                        │  2 · puntaje + caso + calificación (motor de la landing)
                        │  3 · correo HTML con la medalla (Gmail del script)
                        │  4 · escribe el resultado en la fila
                        └─ 5 · (opcional) manda todo a un webhook de salida (CRM, Notion…)
Reloj cada 5 min ── recoge cualquier fila que otra herramienta haya escrito directamente
```

## Qué hay en esta carpeta

| | |
|---|---|
| `apps-script/Codigo.gs` | Todo el sistema: motor, lectura de la hoja, webhook, correo, menú. Es lo único que se pega en Apps Script. |
| `apps-script/appsscript.json` | Manifiesto opcional (permisos más acotados). No hace falta para que funcione. |
| `hoja/creator-business-score-leads.xlsx` | Plantilla de la hoja: pestañas **Leads**, **Formulario Meta** (textos exactos) y **Cómo funciona**. |
| `medallas/` | Generador de las 430 imágenes (215 pares puntaje × diagnóstico, cada uno con cabecera de correo + tarjeta completa). |
| `muestras/` | Los tres correos de muestra (califica · fase de ordenar · fuera de perfil) en HTML, texto y capturas. |
| `pruebas/` | Paridad con la landing (3.750 combinaciones), integración simulada y generador de muestras. |

## Instalación (una sola vez, ~20 minutos)

### 1 · El formulario instantáneo de Meta

Administrador de anuncios → campaña de **Clientes potenciales** → formulario
instantáneo nuevo. Tipo **Mayor volumen** o **Mayor intención** (esta añade
una pantalla de revisión y filtra curiosos).

- **Preguntas de contacto** (predefinidas): *Nombre completo*, *Correo
  electrónico*, *Número de teléfono*.
- **Preguntas personalizadas** → *Opción múltiple*, en este orden y con estos
  textos (están también en la pestaña **Formulario Meta** de la hoja, para
  copiar y pegar):

| # | Pregunta | Opciones |
|---|---|---|
| 1 | ¿De qué tamaño es tu comunidad o audiencia activa? | Menos de 1.000 seguidores / Sin comunidad · 1.000 a 5.000 seguidores · 5.000 a 20.000 seguidores · 20.000 a 100.000 seguidores · Más de 100.000 seguidores |
| 2 | ¿Qué opción describe mejor tu situación actual y la de tu negocio digital? | Atrapado en las tareas del día a día · Inestable, con meses altos y bajones · Estancado en la misma facturación de siempre · Estoy creciendo pero necesito equipo · Tengo crecimiento predecible y controlado |
| 3 | ¿Qué producto o servicio vendes principalmente? | Cursos low ticket / Infoproductos grabados · Servicios freelance / Agencia entregada 1 a 1 · Coaching / Consultoría 1 a 1 por tiempo · Mentoría grupal High-Ticket · Modelo híbrido / Programa escalable · E-commerce / Producto físico |
| 4 | ¿Cuál es tu facturación mensual aproximada? | Menos de 1.000 € · 1.000 € – 5.000 € · 5.000 € – 15.000 € · 15.000 € – 40.000 € · Más de 50.000 € |
| 5 | Si pudieras resolver UN solo problema hoy, ¿cuál sería? | Hábitos, rutinas y enfoque del fundador · Autoridad, diferenciación y posicionamiento · Atracción de prospectos calificados · Cierre de llamadas y tasa de conversión · Caos en la entrega, equipo y operaciones |

  El script tolera diferencias de tildes, mayúsculas, signos y puntos de miles
  ("1000 €" = "1.000 €"), pero **no adivina**: si cambias una opción por otro
  texto, añádela en `CONFIG.ALIAS` (ver el ejemplo en el propio código) o la
  fila quedará como *incompleto*.
- **Pantalla de finalización**: título "¡Listo! Revisa tu correo", texto "En
  unos segundos te llega tu Creator Business Score con tu medalla y tu
  diagnóstico. Si no lo ves, mira en Promociones o Spam.", botón a
  `https://kunfupay.com`.
- Meta exige una **URL de política de privacidad**: la de Kunfupay.

### 2 · La hoja de Google

Usa la hoja **Creator Business Score · Leads** (ya creada en tu Drive, carpeta
*Creator Business Score · correo*) o sube `hoja/creator-business-score-leads.xlsx`
a Drive y ábrela con Hojas de cálculo de Google (*Archivo → Guardar como Hojas de
cálculo de Google*). No renombres los encabezados de **Leads**: el script busca
las columnas por su nombre.

### 3 · Las medallas en Drive

Descomprime `medallas-creator-business-score.zip` y sube **los 430 .jpg** a la
carpeta *medallas* (dentro de *Creator Business Score · correo*). Copia el ID de
la carpeta: es lo que va después de `/folders/` en la URL. Si los archivos no
están, el correo sale igual, con una cabecera de texto en lugar de la medalla.

> Alternativa: si publicas los .jpg en una URL (p. ej. junto a las landings de
> kunfupay.com), pon esa URL en `URL_BASE_MEDALLAS` y deja `CARPETA_MEDALLAS_ID`
> vacío. Así el correo lleva además un botón *Descargar mi medalla*.

### 4 · El Apps Script

1. En la hoja: **Extensiones → Apps Script**. Borra lo que haya y pega
   `apps-script/Codigo.gs` entero.
2. Arriba, en `CONFIG`, rellena al menos `CARPETA_MEDALLAS_ID` y, si quieres,
   `RESPONDER_A` (p. ej. `hola@kunfupay.com`). Guarda (⌘/Ctrl + S).
3. Vuelve a la hoja y recárgala: aparece el menú **Creator Business Score**.
   Pulsa **1 · Configurar (una sola vez)** y acepta los permisos (Google avisará
   de que la app no está verificada: *Configuración avanzada → Ir a…*; es tu
   propio script). Esto crea el token del webhook y el reloj de 5 minutos.
4. **Menú → Enviarme los 3 correos de prueba**. Te llegan los tres desenlaces.

> **Desde qué cuenta sale el correo:** desde la cuenta de Google que hace el
> paso 3. Para que salga de `hola@kunfupay.com`, haz la instalación con esa
> cuenta (la hoja puede estar compartida con ella). Límite de Google: 100
> destinatarios al día con una cuenta @gmail.com, 1.500 con Google Workspace.

### 5 · Publicar el webhook

En Apps Script: **Implementar → Nueva implementación → ⚙ → Aplicación web**.
*Ejecutar como*: **Yo**. *Quién tiene acceso*: **Cualquier persona**. Implementar.
Luego, en la hoja, **menú → Ver URL del webhook**: es la URL `/exec` con
`?token=…` al final. Trátala como una contraseña: quien la tenga puede hacer
que el script envíe correos.

Si más adelante cambias el código: **Implementar → Gestionar implementaciones →
✏ → Versión: nueva versión**. Así la URL no cambia.

### 6 · Conectar Meta con el webhook (Make)

Escenario nuevo en Make:

1. **Facebook Lead Ads → Watch New Leads**: conecta la página y elige el
   formulario.
2. **HTTP → Make a request**:
   - URL: la del paso 5 (con `?token=…`).
   - Method: `POST`.
   - Body type: **`application/x-www-form-urlencoded`** (evita que una
     comilla en una respuesta rompa el envío).
   - Fields — un campo por fila, mapeando lo que sale del módulo 1:

   | Key | Valor (del módulo 1) |
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
   | `origen` | Platform (fb / ig) |

3. Activa el escenario (*Immediately*). Cada lead entra en la hoja y recibe el
   correo en segundos. Si Make reintenta un lead, el ID evita el duplicado.

**Otras formas de cargar la hoja** (el reloj de 5 minutos las recoge igual):
Make → *Google Sheets → Add a Row* en la pestaña Leads; Zapier → *Facebook
Lead Ads (New Lead)* → *Google Sheets (Create Spreadsheet Row)* o *Webhooks by
Zapier (POST)* a la misma URL; o incluso pegar filas a mano.

> ¿Y el webhook de Meta directo al script, sin Make? No es fiable: la app web de
> Apps Script responde con una redirección (302) en vez de un 200, Meta lo toma
> como fallo, reintenta y acaba desactivando la suscripción; además exige una
> app de Meta revisada con el permiso `leads_retrieval`.

### 7 · Probar de punta a punta

Herramienta de prueba de anuncios para clientes potenciales de Meta
(developers.facebook.com → *Lead Ads Testing Tool*): elige la página y el
formulario → **Crear lead**. En segundos debe aparecer la fila con Estado
**enviado** y llegar el correo.

## La hoja, fila por fila

| Estado | Qué significa | Qué hacer |
|---|---|---|
| *(vacío)* | Pendiente | Nada: sale en la próxima pasada |
| `enviado` | Correo enviado (hora en *Enviado*) | — |
| `error` | Falló el envío (ver *Detalle*) | Se reintenta solo hasta 3 veces |
| `incompleto` | Una respuesta no coincide con ninguna opción | Corregirla (o un `ALIAS`) y vaciar *Estado* |
| `omitido` | Correo no válido | Corregirlo y vaciar *Estado* |
| `duplicado` | Ese ID de lead ya recibió su correo | — |
| `revisar` | Se cortó a mitad de envío: pudo salir | Mirar en *Enviados* y, si no salió, vaciar *Estado* |

Para reenviar cualquier fila: vaciar su *Estado* (o **menú → Reenviar la fila
seleccionada**). *Puntaje* es el que ve el lead; *Puntaje real* es el que decide
calificación, caso y UTMs, como en la landing.

## Qué es igual que en la landing, y qué cambia

**Igual, comprobado:** el puntaje real, el mostrado (relleno de +16 %), el caso,
la calificación (≥ 1.000 €/mes y ≥ 5.000 seguidores, nunca e-commerce), las
barras, el diagnóstico, los pasos, el paso 04 de Kunfupay para quien no
califica, y las UTMs de los botones (`utm_term=calificado_si|calificado_no`,
`utm_content=score_N`; en el correo además `utm_medium=email`).
`pruebas/paridad.js` compara las 3.750 combinaciones contra la landing publicada.

**Cambia, por ser un correo:**
- *Compartir* no existe en un correo: la tarjeta completa (1080 × 1920) va
  **adjunta**, lista para la story.
- *Aplicar a Classroom Platinum* ya no abre el formulario puente: lleva
  directo al VSL (`CONFIG.URL_APLICAR`). Nombre y teléfono ya los trae Meta.
- Se saluda por el nombre y el asunto lleva el puntaje y el metal.
- El seguimiento `ps_evento` de la landing no aplica: Meta ya cuenta el lead.
  Si quieres guardar el resultado en otro sitio (el CRM, la base de Notion de
  la landing…), pon su URL en `WEBHOOK_SALIDA`: recibe los mismos campos que
  la landing mandaba a `/api/classroom-platinum/score` más el resultado.

## Mantenimiento

- **Textos del correo o de los diagnósticos:** en `Codigo.gs` (secciones 1 y
  6). Si cambias un titular de metal, un `desbloqueo` o la escala de
  puntaje, **regenera las medallas** (las imágenes llevan esos textos).
- **Regenerar las medallas:** desde la raíz del repo,
  `python3 -m http.server 8244` y en otra terminal
  `node 2026-09-25-correo-creator-business-score/medallas/generar-medallas.js salida/`.
- **Pruebas:** `node pruebas/paridad.js [carpeta-de-medallas]` y
  `node pruebas/integracion.js`. `node pruebas/muestras.js <carpeta-de-medallas>`
  regenera los correos de muestra.
- **Plantilla de la hoja:** `python3 hoja/generar-hoja.py` (lee las preguntas
  del propio `Codigo.gs`).
