# Errores técnicos ya resueltos

- **Emojis de Apple (banderas):** el Chrome del render de HyperFrames no tiene «Apple Color Emoji», PIL no los dibuja y
  Swift falla en el sandbox. Funciona: dibujarlos en un canvas en el navegador integrado, enviarlos por POST a un
  servidor local que guarda los PNG, y usarlos como `<img>` (`plantilla/emoji_png.swift` es la vía alternativa fuera
  del sandbox).
- **`<img>` repetido con la misma `src`** se descarta en el render de HyperFrames: si el logo sale dos veces, mete uno
  en línea (SVG).
- **Cifras con degradado** (`background-clip: text`) con `line-height` < 1 cortan los bajos: añade padding en el elemento
  con degradado, y pon el degradado en el mismo elemento que escalas (`scaleX`).
- **No reutilices nombres de clase** entre elementos (un `.iso { opacity: 0 }` ocultó otro chip).
- **Animar anchos midiendo el texto** falla porque las fuentes aún no han cargado: anima `max-width` (0 → 760 px) con
  `min-width: 0` y `flex: none`.
- **SVG de gráfico con ancho fijo** mayor que su hueco: usa `width:100%` + `viewBox`.
- **Trazos a lápiz con remate redondo** dejan un punto suelto si el trazo no está oculto hasta su turno.
- **Transcripción:** Parakeet (`hyperframes transcribe`) inventa en español → mlx-whisper vía `uv`. Timestamps de la
  primera palabra poco fiables → envolvente/silencedetect.
- **Magnific:** `creations_finalize_upload` falla con m4a → convierte a wav. `audio_clean_speech` no disponible en la
  cuenta → `audio_isolate`.
- **SFX inaudibles** por ir en la cama con ducking o a −32 dBFS → pista aparte y picos −20…−25.
- **Mezcla gigante en un solo `filter_complex`** → SIGSEGV; por lotes.
- **`sleep` en primer plano** puede estar bloqueado en Claude Code: espera renders con un bucle `time.sleep` en python o
  lanza en segundo plano.
- **Subida a Instagram desde el navegador:** límite de 10 MB por archivo → versión ligera a dos pasadas (~1950 kbps).
