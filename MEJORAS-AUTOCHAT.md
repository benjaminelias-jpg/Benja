# Auto Chat: mejoras propuestas

**Objetivo:** que Auto Chat permita armar un flujo completo al estilo ManyChat, en un solo lugar: captar el lead, responder, hacer seguimiento y cargarlo en el CRM con su origen (anuncio, reel o post).

---

## Resumen de prioridades

| # | Mejora | Prioridad | Por qué |
|---|--------|-----------|---------|
| 1 | Pizarra visual (constructor de flujos) | Alta | Es la base de todo lo demás |
| 2 | Flujo continuo en una sola línea | Alta | Hoy cada respuesta obliga a crear otra automatización |
| 3 | Un trigger con varias acciones (bifurcación) | Alta | Una sola acción por trigger limita todo |
| 4 | Webhooks y envío de leads al CRM | Alta | Saber de qué anuncio viene cada lead |
| 5 | Delays y follow-ups (hasta días) | Alta | Hace falta para el seguimiento |
| 6 | Mensajes múltiples y multimedia | Media | Respuestas más naturales y más completas |
| 7 | Más triggers disponibles | Media | Cubrir más puntos de entrada |
| 8 | Fragmentos de código personalizados | Baja | Para casos avanzados |

---

## 1. Pizarra visual para diseñar flujos

**Problema:** no hay forma de ver ni diseñar la automatización completa.

**Propuesta:** una pizarra (canvas) donde cada paso es un bloque y los bloques se conectan con flechas:

- Bloques arrastrables: trigger, mensaje, condición, delay, webhook, etiqueta, acción del CRM.
- Conexiones visuales entre bloques, con ramas según la respuesta del usuario.
- Vista del flujo completo de cada chat, de principio a fin.
- Duplicar flujos y guardarlos como plantilla.

## 2. Flujo continuo, sin automatizaciones separadas

**Problema:** para seguir la conversación (por ejemplo, el lead responde "1") hoy hay que crear una automatización aparte.

**Propuesta:** que la conversación entera viva en un mismo flujo:

- Esperar la respuesta del usuario dentro del flujo y seguir según lo que conteste (botones, palabras clave o cualquier texto).
- Ramas condicionales: *si responde X → camino A; si responde Y → camino B; si no responde → camino C*.
- Guardar la respuesta en un campo del contacto (nombre, email, teléfono, interés).

## 3. Un trigger, varias acciones (bifurcación)

**Problema:** hoy un trigger dispara una sola acción.

**Propuesta:** que un mismo evento dispare varias acciones en paralelo.

**Ejemplo:** una persona comenta "ANTO" en un reel. Ese mismo trigger:
1. Envía un webhook al CRM con los datos del lead y el reel donde comentó.
2. Responde el comentario de forma pública.
3. Envía un DM con la secuencia de mensajes.
4. Agrega una etiqueta al contacto (por ejemplo, `lead-reel-anto`).

## 4. Webhooks e integración con el CRM

**Propuesta:**

- Bloque **Enviar webhook**: URL configurable, método (POST/GET), headers y cuerpo JSON con variables dinámicas (`{{nombre}}`, `{{usuario_ig}}`, `{{mensaje}}`, `{{reel_id}}`, `{{anuncio_id}}`, `{{campaña}}`).
- **Trazabilidad del origen:** cada lead llega al CRM con el anuncio, reel, post o palabra clave que lo trajo.
- Crear y actualizar el lead en el CRM (etapa, etiquetas, notas) desde el flujo.
- Webhook entrante: que el CRM pueda disparar mensajes en Auto Chat (por ejemplo, cuando el lead cambia de etapa).
- Registro de envíos con reintento si un webhook falla.

## 5. Delays y follow-ups

**Propuesta:**

- **Delay de escritura:** mostrar "escribiendo…" unos segundos antes de cada mensaje.
- **Delay aleatorio:** responder en un tiempo al azar dentro de un rango (por ejemplo, entre 2 y 7 minutos) para que la respuesta se sienta humana.
- **Delays largos:** segundos, minutos, horas o días.
- **Follow-up por inactividad:** *"si a los 5 días no respondió, enviar el mensaje X"*. Si responde antes, el follow-up se cancela solo.
- Horario de envío: mandar mensajes solo dentro de un horario permitido.

## 6. Mensajes múltiples y multimedia

**Propuesta:**

- Enviar **varias burbujas seguidas** como respuesta a un mismo mensaje (por ejemplo, tres mensajes separados en vez de uno largo), con un delay corto entre cada una.
- Adjuntar **audios** (notas de voz), **documentos PDF**, imágenes y videos.
- Botones y respuestas rápidas.
- Variaciones de texto (A/B) para no repetir siempre el mismo mensaje.

## 7. Triggers que faltan

Además de "recibir un mensaje", agregar:

- Comentario en reel o post (con palabra clave).
- Respuesta a una historia o mención en historia.
- Clic en un anuncio de Meta que lleva a mensajes (Click-to-DM), con el ID del anuncio.
- Nuevo seguidor.
- Webhook entrante (evento externo, por ejemplo desde el CRM).
- Cambio de etiqueta o de campo del contacto.

## 8. Fragmentos de código

- Bloque de código (por ejemplo, JavaScript) para transformar datos, calcular valores o formatear lo que se manda por webhook.
- Debe correr aislado y con límite de tiempo.

---

## Ejemplo de flujo completo

```
[Trigger] Comentario "ANTO" en reel
   ├─► Responder comentario públicamente
   ├─► Webhook → CRM (nombre, usuario, reel_id, anuncio_id)
   ├─► Etiqueta: lead-reel-anto
   └─► DM:
        Burbuja 1: "¡Hola {{nombre}}! 👋"            (escribiendo… 3 s)
        Burbuja 2: "Te dejo la guía que pediste"      (escribiendo… 2 s)
        Burbuja 3: [PDF adjunto]
        Pregunta: "¿Querés que te contemos más? Respondé 1"
          ├─ Responde "1" → Audio + link de agenda → CRM: etapa "Interesado"
          ├─ Responde otra cosa → Mensaje de aclaración
          └─ Sin respuesta en 5 días → Follow-up → CRM: etapa "Frío"
```

## Criterios de "listo"

- [ ] El flujo de ejemplo se puede armar de punta a punta en la pizarra, sin automatizaciones separadas.
- [ ] Cada lead llega al CRM con su origen (anuncio, reel o palabra clave).
- [ ] Los follow-ups por inactividad se envían a los N días y se cancelan si el lead responde.
- [ ] Se pueden enviar varias burbujas, audios y PDFs en una misma respuesta.
