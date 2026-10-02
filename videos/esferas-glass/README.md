# Esferas de vidrio (HyperFrames)

3 esferas de Liquid Glass estilo iOS ("Clear") sobre un video vertical: **1**, **2** y **?** en amarillo `#FFD60A`, con un blur cuadrado sobre el "?". La refracción es real: el fondo del video se curva dentro de cada esfera, frame por frame.

- `renders/prueba-grilla.mp4`: prueba sobre grilla (se ve clara la refracción).
- `renders/prueba-foto.mp4`: prueba sobre una foto en movimiento.

## Usarlo con tu video

1. Copiá el video a `assets/video/` y cambiá el `src` de `<video id="fondo">` en `index.html`. Ajustá `data-duration` del video y del `#root` a su duración.
2. Tiempos: las esferas entran en el `data-start` de `#orbs` (hoy 1 s) y salen 5 s después. Si lo movés, mové en la misma cantidad los `data-start` de los `<audio>` de SFX.
3. `npx hyperframes check` y `npx hyperframes render -o renders/final.mp4`.

## Cómo está hecho

- `compositions/orbs.html`: las esferas. La refracción es `backdrop-filter: url(#orbs-lens)` con un `feDisplacementMap` (3 pasadas con escala apenas distinta = aberración cromática leve). Ningún ancestro de `.orb-lens` puede tener `opacity`, `filter`, `mask` o `clip-path`, porque eso corta lo que el vidrio ve detrás. Por eso cada capa hace su propio fade.
- `tools/make-lens-map.mjs`: genera `assets/glass/lens-map.png`, el mapa tipo lente: centro levemente magnificado y borde que curva el fondo.
- `tools/make-sfx.sh`: sintetiza los SFX con FFmpeg. Las entradas son un pop de vidrio que sube de tono (Do6, Re6, Mi6) y la salida es un swoosh suave de ruido rosa.
