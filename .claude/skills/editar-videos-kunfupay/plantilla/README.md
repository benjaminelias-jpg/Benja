# Plantilla: pipeline del proyecto «Hubs» (5 vídeos, oct-2026)

Es un proyecto REAL, no genérico: úsalo de referencia y adapta nombres, tiempos y pools de SFX a cada vídeo.

Estructura que espera: `<proyecto>/scripts/` (estos archivos), `<proyecto>/<video>/assets/video.mp4`, `<proyecto>/px/`
(SFX de Pixabay), `<proyecto>/luces/`, `<proyecto>/voz/`.

| Archivo | Qué hace |
|---|---|
| `transcribe.py` | mlx-whisper en español con palabras y `initial_prompt` (`uv run -q --with mlx-whisper python …`) |
| `matte.sh` | recorte de la persona con `hyperframes remove-background` |
| `luz.py` | recorta una luz TransFlare a 1080×1920 con el pico a 0,74 s (`LUCES_DIR`) |
| `build.py` + `template.html` | genera la composición HyperFrames (subtítulos, gráficos, banderas, cifras, luces) y `meta.json` |
| `render.sh` | build → `hyperframes render` (reintenta si se cancela) → `final.py` |
| `final.py` + `nivel.py` | mezcla: voz Magnific, música con ducking, SFX en cama aparte, máster −14 LUFS |
| `cruce_sfx.py` | comprueba que cada SFX cae junto a algo que aparece |
| `hoja.sh` | hoja de QA con fotogramas en los segundos indicados |
| `emoji_png.swift` | rasteriza emojis de Apple a PNG (fuera del sandbox) |
