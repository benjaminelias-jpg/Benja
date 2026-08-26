# Blueticks MCP

Servidor MCP de Blueticks (WhatsApp) configurado a nivel de proyecto en `.mcp.json`.

| | |
|---|---|
| Nombre | `blueticks` |
| URL | `https://api.blueticks.co/mcp` |
| Transporte | HTTP (streamable) |
| Auth | OAuth 2.1 + PKCE con registro dinámico de cliente |
| Scopes | `mcp:read`, `mcp:write` |

## Activarlo

1. Abre Claude Code en este repo. Al detectar `.mcp.json` te pedirá aprobar el
   servidor del proyecto → **Yes, use this server**.
2. Ejecuta `/mcp`, elige `blueticks` → **Authenticate**. Se abre el navegador
   para el login de Blueticks; al volver, el estado pasa a ✔ connected.
3. Verifica con `claude mcp get blueticks`.

Los tokens quedan guardados localmente por Claude Code; este repo no contiene
ninguna credencial.

## Herramientas disponibles

| Tool | Acciones |
|---|---|
| `audiences` | list, create, get, update, delete, append_contacts, update_contact, remove_contact |
| `campaigns` | list, create, get, pause, resume, cancel |
| `chats` | list, search, get, list_messages, mark_read, get_media, get_participants, load_more_history |
| `contacts` | list, get_profile_picture |
| `engine` | status, logout, reload |
| `groups` | get, create, update |
| `scheduled_messages` | send, get, list, update, cancel, ack |
| `utils` | validate_phone, link_preview, current_date_time |
| `webhooks` | list, create, get, update, delete |

## Alternativas de alcance

`.mcp.json` comparte la configuración con quien clone el repo. Si prefieres
tenerlo solo en tu máquina y para todos tus proyectos:

```bash
claude mcp remove blueticks -s project
claude mcp add --transport http --scope user blueticks https://api.blueticks.co/mcp
```
