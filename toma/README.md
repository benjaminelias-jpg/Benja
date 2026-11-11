# Toma — grabador de pantalla y cámara para tu equipo

App de escritorio personal para grabar la pantalla, la cámara o ambas, con biblioteca y editor básico. Funciona **100 % en local**: nada se sube a internet. Los videos se guardan en la carpeta de videos de tu usuario, dentro de `Toma` (en Mac: `Películas/Toma`).

## Qué hace

**Grabar**
- Tres modos: **Pantalla + Cámara**, **Solo pantalla** y **Solo cámara**.
- Eliges qué pantalla o qué ventana grabar, con miniaturas.
- **Burbuja de cámara** circular y sin borde, siempre encima de todo y en todos los escritorios. Se arrastra y tiene tres tamaños. Opción de espejo.
- Al grabar **una sola ventana**, la cámara se dibuja dentro del video (esquina inferior izquierda), porque la burbuja flotante no forma parte de esa captura.
- Micrófono con medidor de nivel. Audio del sistema en Windows y en macOS 13 o posterior.
- **Aislar voz**: reduce el ruido de fondo constante y nivela la voz. Se puede aplicar al grabar o después, a cualquier video.
- Calidad 720p, 1080p, 1440p o nativa. Cuenta regresiva de 3 segundos en pantalla.
- **Barra flotante** a la izquierda con detener, cronómetro y pausa. En Windows 10/11 y macOS no aparece en la grabación.
- **Icono en la barra de menús** (Mac) o bandeja (Windows): cronómetro en vivo y menú para detener, pausar o descartar.
- Atajos globales:
  - `Alt+Shift+R` (Mac: `⌥⇧R`) — abrir, iniciar o terminar la grabación
  - `Alt+Shift+P` (Mac: `⌥⇧P`) — pausar o reanudar
  - `Alt+Shift+C` (Mac: `⌥⇧C`) — descartar

**iPhone como cámara (Mac)**
- Con la Cámara de Continuidad de Apple, el iPhone aparece en la lista de cámaras, sin cable o por USB. Requiere macOS 13 o posterior, iPhone XR o posterior con iOS 16, la misma cuenta de Apple en ambos y Wi-Fi y Bluetooth activados.
- El botón "Usar mi iPhone como cámara" del panel de grabación muestra los pasos, comprueba si tu Mac es compatible y selecciona el iPhone en cuanto aparece.

**Guardar**
- Las grabaciones se guardan directamente en **MP4 (H.264 + AAC)**, listas para enviar por WhatsApp o correo. Si el equipo no puede codificar H.264, se guardan en WebM.
- El video se escribe en disco cada segundo: las grabaciones largas no llenan la memoria.
- Si la app se cierra a mitad de una grabación, al volver a abrirla **recupera** lo que se alcanzó a grabar.

**Biblioteca**
- Barra lateral con filtros (todos, favoritos, pantalla, cámara), búsqueda por título y notas, y orden.
- Tarjetas con miniatura y duración. Clic derecho o botón `⋯` para abrir, renombrar, marcar favorito, exportar, mostrar en carpeta o eliminar.
- Importar videos existentes (mp4, webm, mov, mkv, m4v).

**Reproductor**
- Velocidad de 0.75× a 2×. Teclado: `Espacio`/`K` reproducir, `J`/`L` ±5 s, `F` pantalla completa, `M` marcador.
- Título editable, notas que se guardan solas y marcadores con tiempo.
- Recortar inicio y final con tiradores y vista previa.
- Exportar MP4, crear GIF (primeros 30 s), ver en carpeta, copiar ruta, abrir con otra app, eliminar (va a la papelera).

## Usar desde el código

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

### Crear la app empaquetada

```bash
npm run dist:mac
```

```bash
npm run dist:win
```

El resultado queda en `toma/dist/`. Cada sistema debe compilarse en ese mismo sistema para obtener el instalador completo.

## Notas para macOS

- La app no está firmada con una cuenta de desarrollador de Apple. Tras copiarla hay que quitarle la cuarentena y firmarla localmente:

```bash
xattr -cr ~/Applications/Toma.app && codesign --force --deep --sign - ~/Applications/Toma.app
```

- La primera vez pide permiso de **Grabación de pantalla**, **Cámara** y **Micrófono**. Tras conceder el de pantalla hay que reiniciar la app.
- Al **actualizar** a una versión nueva, macOS trata la app como distinta y el permiso de pantalla anterior deja de valer. Se borra con:

```bash
tccutil reset ScreenCapture local.toma.recorder
```

- Cerrar la ventana no cierra la app (sigue en la barra de menús). Para salir del todo: `⌘Q` o "Salir de Toma" en el icono de la barra de menús.

## Cómo está hecho

- `src/main.js` — proceso principal de Electron: ventanas (principal, burbuja, barra, cuenta regresiva), menú, icono de bandeja, captura, guardado en disco y edición con ffmpeg (incluido vía `ffmpeg-static`).
- `src/preload.js` — puente seguro entre la interfaz y el sistema.
- `src/renderer/app.js` — biblioteca, panel de grabación, motor de grabación y reproductor.
- `src/renderer/bubble.*`, `controls.*`, `countdown.*` — ventanas flotantes.
- `src/assets/`, `build/` — iconos.
