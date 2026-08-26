# Blueticks MCP

Servidor MCP de Blueticks (WhatsApp) conectado a Claude Code vía `.mcp.json`.

- **URL:** `https://api.blueticks.co/mcp`
- **Transporte:** HTTP (streamable)
- **Scope:** proyecto (`.mcp.json`, versionado en el repo)
- **Auth:** OAuth 2.1 con PKCE + registro dinámico de cliente
  (`scopes: mcp:read`, `mcp:write`)

## Activarlo

1. Abrí Claude Code en este repo. Al detectar `.mcp.json` pide aprobar el
   servidor del proyecto — aceptá.
2. Corré `/mcp`, elegí `blueticks` y `Authenticate`. Se abre el navegador
   para el login de Blueticks; al volver el estado queda en `connected`.
3. Verificá con `claude mcp list` (debe decir ✔ connected).

El token queda guardado localmente por Claude Code; no se commitea nada.
En una sesión remota/efímera hay que repetir el paso 2 en cada contenedor
nuevo, porque las credenciales no persisten.

## Herramientas expuestas (9)

| Herramienta | Para qué sirve |
|---|---|
| `audiences` | Listas de contactos reutilizables como destino de mensajes y campañas |
| `campaigns` | Programar audiencias para envío masivo pausado |
| `chats` | Buscar chats, historial de mensajes, media, participantes, read-state |
| `contacts` | Listar contactos de WhatsApp y fotos de perfil |
| `engine` | Estado y control del engine de WhatsApp (status, logout, reload) |
| `groups` | Crear y administrar grupos |
| `scheduled_messages` | Enviar, listar, editar, cancelar mensajes y ver acks |
| `utils` | Validar teléfono, link preview, fecha/hora actual |
| `webhooks` | Administrar suscripciones a webhooks |

Cada herramienta agrupa varias acciones (`action: "list"`, `"create"`, etc.);
el detalle vive en `https://api.blueticks.co/mcp/info`.

## Quitarlo

```
claude mcp remove blueticks -s project
```
