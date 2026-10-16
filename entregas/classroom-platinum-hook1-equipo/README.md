# Classroom Platinum · Hook 1 Equipo — edición final

Edición completa del video `Classroom Planitnum Hook 1 - Equipo.mp4` (carpeta Drive «Platinum»): corte, ritmo, subtítulos, motion graphics en vidrio translúcido, B-roll, transiciones, color y audio.

| | |
|---|---|
| Formato | 9:16 · 1080×1920 · 30 fps · H.264 High (CRF 15) + AAC 320 kbps |
| Duración | 36,2 s (fuente: 37,9 s) |
| Audio | −14,1 LUFS integrados · −1,1 dBTP · música 17 dB bajo la voz |
| Zona segura | Anuncio de Meta: texto fuera del 14 % superior y del 35 % inferior |

## Entregables

| Archivo | Qué es |
|---|---|
| `Classroom_Platinum_Hook1_Equipo_FINAL.mp4` | Video final (se entrega aparte por su tamaño, 44 MB; no está en git) |
| `Prueba_de_estilo_glass.png` | Referencia, la receta sobre blanco y 3 frames clave del video |
| `EDL_Classroom_Platinum_Hook1_Equipo.md` / `.csv` | Plan de edición: tiempo, voz, imagen, texto, transición y sonido |
| `Classroom_Platinum_Hook1_Equipo.srt` | Subtítulos: 45 bloques de 2–4 palabras, alineados por forced alignment |
| `Portada_Classroom_Platinum_Hook1_Equipo.png` | Portada: tarjeta glass con el titular del gancho |
| `proyecto/` | Código de los motion graphics y scripts del pipeline |

## Cómo está hecho

1. **Transcripción**: Whisper large-v3 y luego alineación forzada (MMS de torchaudio) del texto correcto. Whisper fallaba hasta 0,4 s en algunas palabras.
2. **Corte** (`scripts/cut.py`): se recortan 20 pausas detectadas a −38 dB, dejando 80–160 ms de aire. En los cambios de plano hay corte en L (1–2 frames). Los jump cuts se enmascaran alternando la escala (punch-in de 4–11 %).
3. **Color** (`scripts/make_lut.py` → `color/skin.cube`): una LUT selectiva por tono lleva la piel magenta (295–335°) hacia un rosado natural y deja intacta la luz violeta de la pared (255–285°). Encima, contraste medio y negros profundos sin aplastar.
4. **Motion graphics** (`project/index.html` + `comp.js`, GSAP): todos los elementos glass están en la misma escena que el metraje, y `backdrop-filter` desenfoca el video real. Una sola receta para todo el video; solo se ajusta el `brightness` (.72–.92) según el fondo. El video achicado (PiP) va en un marco simple redondeado con borde fino, sin vidrio ni volumen.
5. **Render** (`project/render.mjs`): Chromium headless, determinista, frame a frame, con 4 procesos (unos 2,5 min).
6. **Audio** (`scripts/audio_mix.py`):
   - Voz: HPF, limpieza suave, EQ, de-esser y compresión.
   - Música: Lyria 3 Pro (Magnific), 103 BPM, con el acorde final en la tarjeta de cierre.
   - Ducking de 23 dB. SFX sintetizados (aire, clic de vidrio, tick, swell).
   - Máster en dos pasadas de loudnorm más limitador.

## Re-render

```bash
cd proyecto/project && npm install
# insumos: fuente/Classroom Planitnum Hook 1 - Equipo.mp4 (Drive) y music_dl/music.mp3 (Magnific)
python3 ../scripts/cut.py                        # base/base_video.mp4 + base/voice_raw.wav
mkdir -p frames && ffmpeg -i ../base/base_video.mp4 -q:v 1 -start_number 0 frames/f%05d.jpg
node render.mjs meta ../analysis/meta.json       # eventos de SFX
node render.mjs all ../render 4                  # frames finales
node render.mjs frames ../tests 48,432,1070      # frames sueltos para revisar
python3 ../scripts/audio_mix.py                  # audio/master.wav
ffmpeg -framerate 30 -i ../render/r%05d.jpg -i ../audio/master.wav -c:v libx264 -crf 15 -pix_fmt yuv420p -c:a aac -b:a 320k final.mp4
```

Los tiempos de cada gráfico están en `comp.js` y referencian palabras por índice (`ws(i)`, ver `words.js`). Si mueves una palabra, el gráfico la sigue.

## Checklist final

- [x] Cada glass se ve como la referencia (ver la prueba de estilo): translúcido, con el video desenfocado detrás, borde blanco, lavanda interno, esquina violeta y sombra violeta.
- [x] Ningún glass tiene fondo sólido. El único relleno es el oscurecimiento por `brightness`, que la receta exige para la legibilidad.
- [x] El texto se lee en todos los frames. Sobre fondo claro (pantalón blanco) los subtítulos van dentro de una pill de vidrio con brightness .72.
- [x] Sin sonido, el gancho funciona en los primeros 2 s: el titular «¿Facturas +3 mil € al mes?» está visible desde 0,5 s.
- [x] No hay tramos de más de 4 s sin cambio visual: hay un cambio cada 1–2,5 s.
- [x] Nada tapa la cara (posiciones verificadas con detección de rostro) y todo el texto queda dentro de la zona segura de Meta.
- [x] SFX y transiciones: solo aire, clic de vidrio, ticks, zoom-through, barrido de vidrio y blur dissolve.
- [x] Las palabras resaltadas coinciden con la voz (alineación forzada, al frame).
- [x] Máster en −14,1 LUFS y −1,1 dBTP, con la música 17 dB bajo la voz.
