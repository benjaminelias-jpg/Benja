---
name: editar-videos-kunfupay
description: >
  Editar vídeos hablados de Kunfupay ya grabados (reels/TikTok/Shorts de una persona a cámara) con el método del
  departamento: voz mejorada con Magnific, transcripción en español, subtítulos de una línea, infografías y cifras DETRÁS
  de la persona (sin recuadros), banderas y logos reales, tramos dramáticos en B/N con voz de radio, luces de película,
  música y SFX nuevos de Pixabay en pista aparte, máster a −14 LUFS y revisores de imagen y sonido. Úsala SIEMPRE que
  llegue un vídeo bruto o pidan «edita este vídeo», «mejora la voz», «ponle subtítulos y gráficos», «añade efectos de
  sonido», «edítalo como los de Kunfupay», aunque no la nombren.
---

# Editar vídeos hablados de Kunfupay

Método destilado de las ediciones reales del departamento (MOR, Classroom, IGNIA, Jorge, Rubén, Hubs, Tienda…).
Cada regla viene de una corrección de Brayan: respétalas por defecto y no las «mejores» sin preguntar.

- Reglas de estilo completas → `references/reglas-edicion.md`
- Sonido (Pixabay, niveles, mezcla) → `references/sonido.md`
- Revisión antes de entregar → `references/revision.md`
- Errores técnicos ya resueltos → `references/errores-conocidos.md`
- Pipeline de ejemplo completo (HyperFrames + ffmpeg) → `plantilla/` · utilidades → `scripts/`

## Requisitos
- `ffmpeg`, `node`/`npx` (HyperFrames: `npx hyperframes …`), `python3` con `numpy`, `uv` (para mlx-whisper; Mac con Apple Silicon).
- Conector MCP de **Magnific/Freepik** (voz, TTS). Navegador integrado de Claude (búsqueda en Pixabay).
- Opcional: pack de luces «Light Leaks Transitions – 4K» (TransFlare). `plantilla/luz.py` lo busca en
  `~/Movies/Light Leaks Transitions - 4K` o en `$LUCES_DIR`.
- Sistema visual de Kunfupay (Morfeo: tokens, logo oficial, banderas, métodos de pago) del repo del departamento.

## Orden de trabajo
1. **Mira antes de decidir.** Hoja de fotogramas (`ffmpeg -i v.mp4 -vf "fps=1/2,scale=270:-1,tile=6x4" hoja.jpg`) y cortes
   (`select='gt(scene,0.2)'`). Anota dónde hay aire (arriba, a los lados) y hacia dónde señala la persona.
2. **Voz con Magnific (OBLIGATORIO en todos los vídeos).**
   1. `ffmpeg -i v.mp4 -vn -ac 1 -ar 48000 -c:a pcm_s16le voz/v-original.wav` (sube SIEMPRE wav: con m4a falla el finalize).
   2. `creations_request_upload` (`audio/wav`) → `curl -X PUT --data-binary @archivo` a cada `proxyUploadUrl` →
      `creations_finalize_upload` (`visible: false`).
   3. `audio_isolate` (aislamiento de voz). `audio_clean_speech` no está disponible en la cuenta de Kunfupay.
   4. `creations_wait` → `creations_register_download` → `curl` a `voz/v-magnific.mp3`.
   - ≈150–200 créditos por 40 s: avisa del gasto. Comprueba el desfase con correlación cruzada (≈ 0 ms).
   - El aislamiento quita también el ambiente de los B-roll; si un plano necesita su sonido, mézclalo aparte.
3. **Transcripción** con mlx-whisper (`plantilla/transcribe.py`): `uv run -q --with mlx-whisper python transcribe.py DIR v1 v2`.
   Modelo `whisper-large-v3-turbo`, `language="es"`, `word_timestamps=True` e `initial_prompt` con la marca y los nombres
   propios. NO uses `npx hyperframes transcribe` (Parakeet destroza el español). Corrige marca y cifras a mano
   (Confu/Confuy → Kunfupay). El primer timestamp de whisper puede salir a 0,00: para cortes exactos usa la envolvente
   (`scripts/envolvente.py`) o `silencedetect`.
4. **Recorte de la persona** para poner gráficos detrás: `npx hyperframes remove-background video.mp4 -o persona.webm
   --quality best` (≈6 min por 40 s; `plantilla/matte.sh`). Lánzalo pronto y en segundo plano.
5. **Composición HyperFrames** (`plantilla/build.py` + `template.html`): subtítulos, infografías, cifras, banderas, logos,
   luces → `index.html` + `meta.json` con la lista de eventos de SFX `[["tipo", segundo], …]`.
6. **Render + mezcla** (`plantilla/render.sh` → `final.py`): voz con cadena suave, música con ducking, **SFX en pista aparte
   sin ducking**, máster con ganancia FIJA a −14 LUFS + limitador −1 dBTP. Detalle en `references/sonido.md`.
7. **Revisión** (`references/revision.md`): revisor de diseño (esquinas/CTA), errores visuales cada 5 s, sonido ↔ pantalla,
   y medición final. Entrega con un README de decisiones y la lista de claims de la voz para Compliance.
8. **Nada se publica** sin el OK de una persona.

## Las 12 reglas que más se olvidan
1. **Sin recuadros ni tarjetas de cristal en las animaciones.** Todo suelto: banderas emoji de Apple, logos reales,
   pastillas sueltas, cifras grandes. Comprueba que el HTML no tenga `class="glass"`.
2. **Gráficos y cifras DETRÁS de la persona** (con el recorte). Si no hay aire arriba: encima del subtítulo
   (top ≈ 1290), delante de la persona; **nunca sobre la frente ni sobre la cara**.
3. **Subtítulos:** una línea, sin puntuación, blancos, Roboto Medium, sombra suave difusa, **sin borde ni velos oscuros**.
   La palabra grande va sola en su renglón y solo si se ve ≥ 1 s. Máximo 3 líneas en pantalla contando gráficos.
4. **Sin sobreinformación:** si un gráfico dice lo mismo que la voz, el subtítulo se calla. En demos de producto a
   pantalla completa, sin subtítulos.
5. **País nombrado → solo su bandera** (sin escribir el nombre), entrada «blup» + burbuja. Grupos (LATAM) repartidos.
6. **Cifra que dice la voz →** gigante detrás, cuenta 0 → n con SFX de contador y golpe al aterrizar; respeta el matiz
   («HASTA», «MÁS DE»).
7. **Competencia o momento dramático →** B/N con grano ligero + voz de radio (banda 350–3200 Hz + algo de saturación) +
   música en pausa; vuelve al color con una transición suave.
8. **Luces de película solo en cortes que abren bloque,** variando la luz entre vídeos. Nada de destellos en cada corte.
9. **SFX nuevos de Pixabay para CADA pieza,** nunca el mismo dos veces seguidas, solo cuando aparece algo, en pista aparte
   con picos de −20 a −25 dBFS. Nada de SFX generados por IA.
10. **Nunca cortes frases de la voz** por claims sin permiso: avisa con el segundo y el motivo.
11. **No inventes textos:** ni disclaimers, ni frases de cierre, ni CTA en botón dentro del vídeo, ni textos en esquinas.
    Cierre = solo el isotipo «ku» (late con un SFX positivo cuando la voz dice «Kunfupay»).
12. **«No toques X segundos» es sagrado.** Y si mandan varios vídeos con el mismo cuerpo, se monta una vez.

## Reglas añadidas por Benjamin (prioridad sobre las anteriores si chocan)
- **Recursos: SIEMPRE primero de la carpeta de Drive de recursos**
  <https://drive.google.com/drive/folders/1T56ip3m1t4sTH9obJq-0V7JDLwpJ22aW> (MUSICA, SONIDOS, EMOJIS, CLIPS, FONDOS,
  FILM BURNS, GREEN SCREEN, TEXTURAS). Listar con el MCP de Google Drive (`parentId = '<id>'`); descargar archivos
  grandes con `curl "https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t"`.
- **Música:** de la carpeta MUSICA, preferentemente la **música viral**. No generar música con IA (gasta muchos créditos:
  una pista de 70 s en Magnific costó 1.400 créditos).
- **SFX:** de la carpeta SONIDOS. Todo lo que aparece animado lleva su sonido (p. ej. «99$» que carga → sonido de
  contador + golpe al aterrizar; entradas → pop/whoosh).
- **Cuidado con los volúmenes:** voz siempre clara por encima, música de fondo con ducking, SFX audibles sin molestar;
  máster a −14 LUFS.
- **Logos SIEMPRE que se nombre una marca** (Hotmart, Skool, Stripe… y sobre todo **Kunfupay**). Logos reales: primero
  la carpeta de Drive, si no, la web oficial de la marca o Wikimedia. Nunca dibujar sustitutos.
- **Banderas:** emojis de Apple de la carpeta EMOJIS.
- **Cada vez que la persona hace una pregunta:** ese tramo en **blanco y negro con efecto TV** (scanlines, ruido,
  ligera aberración) y **subtítulos amarillos** durante la pregunta.
- **Más efectos y transiciones:** usar las transiciones de la carpeta de Drive (FILM BURNS, etc.) con su whoosh.
- **Composiciones:** a veces **pantalla dividida**, y a veces una **«presentación arriba»** (panel/diapositiva en la
  mitad superior con la persona debajo).
- **Hook hecho aparte + vídeo completo:** si el cuerpo trae repetido el contenido del hook, recortar el inicio del
  cuerpo justo donde termina el hook (casar última frase y fotograma) para que se una sin que se note la transición
  ni se repitan palabras.

## TTS (cuando haya que regrabar o arreglar una palabra)
- «La voz de Sergio» = ElevenLabs **Sergio Morales** (`voiceId` 558 del catálogo de Magnific), `audio_tts` con `eleven_v3`.
  Texto dicho normal: sin puntos suspensivos ni suspiros; emoción con una sola etiqueta suave.
- En el texto que va al TTS, escribe **«Kunfupéi»** para que suene «kun-fu-péi»; en pantalla siempre «Kunfupay».
- Para corregir una palabra mal dicha: genera solo esa frase, iguala nivel (LUFS) y empalma con crossfades de 15 ms en
  silencios reales. Verifica transcribiendo el resultado y, si puedes, escuchándolo.
