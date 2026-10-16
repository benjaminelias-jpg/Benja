# Edición · Hook 2 (anuncio 1) — Kunfupay Classroom Platinum

Edición completa del vídeo `hook 2 ( anuncio 1).mp4` (Drive) para un anuncio de Meta en 9:16: corte, ritmo, subtítulos, motion graphics en vidrio, B-roll, color, música original, SFX y máster.

| Entregable | Dónde |
|---|---|
| Vídeo final 1080×1920 · 30 fps · H.264 | No va en el repo por su peso: se entrega aparte (`hook2_anuncio1_final.mp4`) |
| Tabla EDL del plan de edición | [`entregables/EDL.md`](entregables/EDL.md) |
| Subtítulos | [`entregables/subtitulos.srt`](entregables/subtitulos.srt) |
| Portada | [`entregables/portada.png`](entregables/portada.png) |
| Proyecto de motion graphics (HTML/CSS + GSAP) | [`mg/`](mg/) |
| Pipeline (transcripción, alineado, audio, render) | [`scripts/`](scripts/) |

## Cómo funciona

Los gráficos **no** son overlays pre-renderizados. Cada frame del metraje real (ya con el grade) se pinta en la misma página HTML que el vidrio, así que el `backdrop-filter` desenfoca el píxel de vídeo que tiene detrás. Chromium headless captura frame a frame y ffmpeg lo codifica.

- `mg/index.html` + `mg/styles.css`: el sistema GLASS (vidrio al 8–14 %, blur 32 px con saturación +20 %, borde de 1 px más brillante arriba a la izquierda, refracción interior, barrido especular, sombra difusa, radio de 28 px) y la tipografía.
- `mg/scene.js`: las 17 escenas, sincronizadas con las palabras. Cada animación se ancla al inicio de una palabra (`S(i)`), con la curva `cubic-bezier(0.16, 1, 0.3, 1)`. Un único timeline de GSAP en pausa: `renderFrame(i)` posiciona el frame `i`.
- `mg/data/timeline.js`: el corte (frames fuente → salida) y las 223 palabras con sus tiempos de salida.

Para retocar un gráfico, edita su bloque en `scene.js`; cada escena lleva un comentario con su frase. Para verlo, abre `mg/index.html?frames=<carpeta_de_frames>&debug=1` (marca la zona segura) o saca capturas con `scripts/render.mjs --stills`.

## Rehacer el vídeo desde cero

Requisitos: ffmpeg, Python 3 (faster-whisper, torch/torchaudio, numpy, scipy, soundfile, pyloudnorm), Node 22 con Playwright/Chromium, y `npm install` en este directorio (GSAP e Inter ya van copiados en `mg/assets`).

```bash
SRC="hook 2 ( anuncio 1).mp4"; W=work
ffmpeg -i "$SRC" -vn -ac 1 -ar 16000 $W/audio16k.wav
ffmpeg -i "$SRC" -vn -ac 2 -ar 48000 -c:a pcm_s24le $W/audio48k.wav
python3 scripts/transcribe.py $W/audio16k.wav $W/transcript.json        # Whisper large-v3, palabra a palabra
python3 scripts/align.py $W/audio16k.wav $W/transcript.json $W/words.json  # alineado forzado (MMS) → tiempos al frame
python3 scripts/build_timeline.py $W/words.json $W/timeline.json mg/data/timeline.js
scripts/extract_frames.sh "$SRC" $W/frames                               # frames con el grade, a 1,1x
node scripts/render.mjs --frames $W/frames --dump $W/meta.json           # pistas de SFX + grupos de subtítulos
python3 scripts/make_srt.py $W/meta.json entregables/subtitulos.srt
python3 scripts/voice_edit.py $W/audio48k.wav $W/timeline.json $W/voice_edit.wav
ffmpeg -i $W/voice_edit.wav -af "$(cat scripts/voice_chain.txt)" -c:a pcm_f32le $W/voice_proc.wav
python3 scripts/music.py $W/timeline.json $W/music.wav
python3 scripts/mix.py $W/voice_proc.wav $W/music.wav $W/meta.json $W/timeline.json $W/premaster.wav
scripts/master.sh $W/premaster.wav $W/master.wav                         # −14 LUFS / −1 dBTP
node scripts/render.mjs --frames $W/frames --out $W/video.mp4           # admite --from/--to para trocear en paralelo
ffmpeg -i $W/video.mp4 -i $W/master.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest final.mp4
node scripts/cover.mjs $W/frames/00120.jpg entregables/portada.png
```

Los cortes están en `scripts/build_timeline.py` (`SEGMENTS`, en frames de la fuente). Para cambiar un corte, edítalo ahí y vuelve a ejecutar desde ese paso.

## Licencias de terceros

- Inter (SIL Open Font License): `mg/assets/fonts/LICENSE-Inter-OFL.txt`.
- GSAP 3.13 (licencia estándar de GSAP, uso gratuito).
- Íconos de Lucide (ISC), en `mg/icons.js`.
- Logos de Kunfupay, del kit de marca oficial (kunfupay.com/brand).
- Música y SFX: originales, generados por síntesis en `scripts/music.py` y `scripts/mix.py`.
