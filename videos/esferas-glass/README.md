# Esferas de vidrio (HyperFrames)

3 esferas de Liquid Glass estilo iOS ("Clear") sobre `assets/video/fragmento-apra.mp4` (720x1280, 30 fps, 7,3 s): **1**, **2** y **?** en amarillo `#FFD60A`. La refracción es real: el fondo del video se curva dentro de cada esfera, frame por frame. No lleva SFX; el audio original del video queda intacto.

- `renders/fragmento-apra-esferas.mp4`: con el audio original del video.
- `renders/fragmento-apra-esferas-mudo.mp4`: el mismo, sin audio.
- `renders/esferas-overlay-alpha.webm`: solo las esferas, fondo transparente (1080x1920, 5,8 s, entran en t=0). Para superponer en otro video.
- `renders/esferas-overlay-alpha.mov`: lo mismo en ProRes 4444 con alfa (no se sube al repo por peso; se regenera con `npx hyperframes render -c overlay.html --format mov -o renders/esferas-overlay-alpha.mov`).

Ojo: en el overlay transparente no hay refracción, porque no hay video detrás para curvar. El vidrio queda con aro, brillos, sombreado y sombra. Para la refracción real, el video tiene que entrar en la composición (`index.html`).

## Usarlo con tu video

1. Copiá el video a `assets/video/` y cambiá el `src` de `<video id="fondo">` en `index.html`. Ajustá `data-duration` del video y del `#root` a su duración.
2. Tiempos: las esferas entran en el `data-start` de `#orbs` (hoy 1 s) y salen 5 s después. Si cambia la resolución, ajustá `data-width`/`data-height` y los tamaños `--d`, `--gap` y `--lens` de `compositions/orbs.html`, y regenerá el mapa con `node tools/make-lens-map.mjs <diámetro> <caja>`.
3. `npx hyperframes check` y `npx hyperframes render -o renders/final.mp4`.

## Cómo está hecho

- `compositions/orbs.html`: las esferas. La refracción es `backdrop-filter: url(#orbs-lens)` con un `feDisplacementMap` (3 pasadas con escala apenas distinta = aberración cromática leve). Ningún ancestro de `.orb-lens` puede tener `opacity`, `filter`, `mask` o `clip-path`, porque eso corta lo que el vidrio ve detrás. Por eso cada capa hace su propio fade.
- `tools/make-lens-map.mjs`: genera `assets/glass/lens-map.png`, el mapa tipo lente: centro levemente magnificado y borde que curva el fondo.
- `tools/make-sfx.sh` y `assets/sfx/`: SFX opcionales (pop de vidrio que sube de tono y swoosh de salida). Hoy no se usan; para sumarlos, agregá `<audio>` en `index.html`.
