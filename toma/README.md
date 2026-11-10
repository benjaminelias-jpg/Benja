# Toma — grabador de pantalla y cámara para tu PC

App de escritorio personal, al estilo de Loom, que funciona **100 % en local**: nada se sube a internet. Los videos se guardan en `Videos/Toma` de tu usuario.

## Qué hace

**Grabar**
- 3 modos: **Pantalla + Cámara**, **Solo pantalla**, **Solo cámara**.
- Eliges qué pantalla o qué ventana grabar (con miniaturas).
- **Burbuja de cámara flotante** circular, siempre encima, que puedes arrastrar por la pantalla y cambiar de tamaño (S / M / L). Queda grabada en el video, igual que en Loom.
- Micrófono con medidor de nivel, y **audio del sistema** opcional (Windows y macOS).
- Calidad 720p, 1080p, 1440p o nativa.
- Cuenta regresiva de 3 s.
- **Barra de control flotante**: terminar, pausar/reanudar, reiniciar y descartar, con cronómetro. En Windows 10/11 y macOS esta barra **no sale en la grabación**.
- Atajos globales (funcionan aunque la app esté oculta):
  - `Alt+Shift+R` — abrir / iniciar / detener grabación
  - `Alt+Shift+P` — pausar / reanudar
  - `Alt+Shift+C` — descartar

**Biblioteca**
- Cuadrícula con miniaturas, duración y tamaño. Búsqueda por título y notas, orden y favoritos.
- Importar videos que ya tengas (mp4, webm, mov, mkv).

**Reproductor**
- Velocidad 0.75× a 2×. Teclado: `Espacio`/`K` reproducir, `J`/`L` ±5 s, `F` pantalla completa.
- Renombrar, notas (se guardan solas) y **marcadores** con tiempo (clic para saltar).
- **Recortar** el inicio y el final arrastrando los tiradores, con vista previa.
- Exportar a **MP4** (para enviar por WhatsApp, correo, etc.) o **GIF** (primeros 30 s).
- Mostrar en carpeta, copiar ruta, abrir con otro reproductor, eliminar (va a la papelera).

## Instalar y usar

Necesitas [Node.js](https://nodejs.org) 18 o superior.

```bash
cd toma
```

```bash
npm install
```

```bash
npm start
```

### Crear un instalador (.exe para Windows)

```bash
npm run dist:win
```

El instalador queda en `toma/dist/`. Para Mac usa `npm run dist:mac` y para Linux `npm run dist:linux` (hay que ejecutarlo en ese sistema).

## Notas por sistema

- **Windows**: funciona todo, incluido audio del sistema. La primera vez Windows puede pedir permiso de cámara/micrófono en *Configuración → Privacidad*.
- **macOS**: la primera vez pide permiso de *Grabación de pantalla*, *Cámara* y *Micrófono* en *Ajustes del Sistema → Privacidad y seguridad*. Tras darlo, reinicia la app.
- **Linux**: en X11 funciona; en Wayland depende del portal del escritorio. Sin audio del sistema, y la barra de control sí aparece en la grabación.

## Cómo está hecho

- `src/main.js` — proceso principal de Electron: ventanas (principal, burbuja, barra), captura de pantalla, guardado en disco y edición con ffmpeg (incluido vía `ffmpeg-static`).
- `src/preload.js` — puente seguro entre la interfaz y el sistema.
- `src/renderer/` — interfaz: `app.js` (biblioteca, configuración, grabación, reproductor), `bubble.*` (burbuja de cámara), `controls.*` (barra flotante).

La grabación se escribe en disco cada segundo, así que las grabaciones largas no llenan la memoria. Al terminar, ffmpeg la reempaqueta para que tenga duración y se pueda adelantar. Los recortes se guardan como MP4 (H.264).
