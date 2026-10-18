# Classroom Platinum · Anuncio 1 — Hook 1 y Hook 2

Edición completa de los dos videos de la carpeta Drive «6»: `hook 1 (anuncio 1).mp4` y `hook 2 ( anuncio 1).mp4`. El gancho de cada uno es distinto y el cuerpo es el mismo: el material es idéntico desde «Te presento Classroom Platinum», con un desfase de 1,00 s.

| | Hook 1 | Hook 2 |
|---|---|---|
| Fuente | 4K 2160×3840 · 74,6 s | 4K 2160×3840 · 76,0 s |
| Final | 1080×1920 · 30 fps · 72,9 s | 1080×1920 · 30 fps · 73,8 s |
| Gancho | «Vendes cursos y ya facturas más de 3.000 euros…» | «Tú pones los cursos, nosotros ponemos el presupuesto…» |

## Entregables

- `Classroom_Platinum_Anuncio1_Hook1_FINAL.mp4` y `..._Hook2_FINAL.mp4`: se entregan aparte por su tamaño (no están en git).
- `EDL_Anuncio1_Hook1.md` / `.csv` y `EDL_Anuncio1_Hook2.md` / `.csv`.
- `Classroom_Platinum_Anuncio1_Hook1.srt` y `..._Hook2.srt`: todas las palabras, en bloques de 2–4.
- `Portada_Anuncio1_Hook1.png` y `Portada_Anuncio1_Hook2.png`.
- `proyecto/`: motion graphics (`index.html`, `comp.js`) y scripts del pipeline.

## Reglas de edición

- **Gancho**: video normal a pantalla completa desde el primer frame, sin máscara y con un solo elemento.
  - Hook 1: notificación de pago «Kunfupay · Pago recibido» cuya cifra cuenta hasta +3.000 € con la voz.
  - Hook 2: tarjeta «Tú pones / los cursos · Nosotros ponemos / el presupuesto» que se arma con la voz.
- **Subtítulos**: siempre simples (texto blanco con sombra suave y palabra activa en lavanda). El énfasis va en pill violeta sólida. El vidrio queda solo en elementos aparte: tarjetas y paneles.
- **Máscaras** (presentación del programa, paso 2 y «solo para infoproductores»):
  - El video se achica en un marco simple redondeado con borde fino.
  - Fuera de la máscara se ve el mismo video desenfocado.
  - Entra con un zoom que la achica y sale con zoom hacia la imagen, siempre antes de un corte de plano.
- **Reencuadre**: la fuente es 4K. En los planos con tarjetas, un punch-in anclado abajo (110–112 %) sube al speaker y deja la camiseta libre para las tarjetas, que nunca tapan la cara. Los jump cuts alternan la escala (×1,06).
- **Paneles**: crecen fila a fila con la voz; los checks y chips entran con su palabra.

## Pipeline

1. `scripts/cut2.py <hook1|hook2>`
   - Recorta silencios a −38 dB con las mismas reglas en ambas versiones, para que el cuerpo quede idéntico.
   - Video: `select` en streaming con cortes en L. Audio: `atrim` con precisión de muestra; la sincronía queda por debajo de 1 ms.
   - Escala a 1440×2560 y aplica un grade suave.
2. Transcripción con Whisper large-v3 y alineación forzada del guion correcto con MMS (`scripts/align2.py`).
   - «13.000» → «3.000»: verificado acústicamente, «tres mil» puntúa mejor que «trece mil».
   - «aprobado» → «probado»: el audio del cuerpo es el mismo en las dos versiones.
3. `project/render.mjs <v> all <dir> 4`: render determinista con Chromium headless.
4. `scripts/audio_mix2.py <v>`:
   - Voz: limpieza suave, EQ, de-esser y compresión.
   - Música: misma pista Lyria 3 Pro del anuncio anterior, con el acorde final en la tarjeta de cierre. Ducking de 23 dB.
   - SFX sintetizados. Máster a −14 LUFS / −1 dBTP.

### Re-render

```bash
cd proyecto/project && npm install
# insumos: ../src/hook1.mp4 y ../src/hook2.mp4 (Drive), ../music_dl/music.mp3 (Magnific) o MUSIC=/ruta/music.mp3
python3 ../scripts/cut2.py hook1                       # base/hook1_video.mp4 + base/hook1_voice.wav
mkdir -p frames_hook1 && ffmpeg -i ../base/hook1_video.mp4 -q:v 2 -start_number 0 frames_hook1/f%05d.jpg
python3 ../scripts/align2.py hook1                     # words_hook1.js
node render.mjs hook1 meta ../analysis/hook1_meta.json
node render.mjs hook1 all ../render_hook1 4
python3 ../scripts/audio_mix2.py hook1                 # audio/hook1_master.wav
ffmpeg -framerate 30 -i ../render_hook1/r%05d.jpg -i ../audio/hook1_master.wav -c:v libx264 -crf 16 -pix_fmt yuv420p -c:a aac -b:a 320k hook1.mp4
```

`scripts/cut2.py` necesita `analysis/<v>_16k.wav`, que se obtiene con `ffmpeg -i src/<v>.mp4 -vn -ac 1 -ar 16000 analysis/<v>_16k.wav`.
