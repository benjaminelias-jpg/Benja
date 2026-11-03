# Sonido: SFX, música y mezcla

## Buscar y bajar de Pixabay (navegador integrado)
Pixabay bloquea las páginas desde terminal, pero no el CDN de audio.
1. Navega a `https://pixabay.com/es/sound-effects/search/<q>/` (música: `/es/music/search/<q>/`). Rechaza cookies opcionales.
2. Ejecuta `scripts/pixabay_buscar.js` con la herramienta de JavaScript (cambia `TERMS`): devuelve 6 resultados por término.
3. Ejecuta `scripts/pixabay_mp3.js` con `WANT = {nombre: [ruta_búsqueda, id]}`: devuelve la URL del mp3 en el CDN
   (lee `performance.getEntriesByType('resource')` tras pulsar play; antes `setResourceTimingBufferSize(5000)`).
   La música carga más lento: a veces hay que repetir.
4. Descarga con `scripts/descargar.sh lista.txt` (`nombre url` por línea; `curl -A Mozilla -e https://pixabay.com/`).
   En bucles: `while read`, no `set -- $x` (zsh), y `ffmpeg -nostdin`.
5. `scripts/envolvente.py px/*.mp3` → dónde está el golpe y cuánto dura (fija recorte y adelanto).

Búsquedas que funcionan: `swipe`, `ui pop`, `bubble pop`, `glass ping`, `marimba notification`, `typing`, `iphone
typing`, `tap touch`, `cash register`, `paper slide`, `digital glitch`, `cinematic impact`, `reverse cymbal`,
`heartbeat`, `clock ticking`. Música: `lofi study`, `chill hop`, `inspiring corporate technology`, `cinematic suspense`.

## Reglas de uso
- **Sonidos NUEVOS para cada pieza,** en una carpeta propia del proyecto. Nada de reciclar la biblioteca de otro vídeo.
- **Nunca el mismo archivo en dos eventos seguidos** (2–3 variantes por tipo que rotan; pon un `assert` en la mezcla).
  Dos golpes seguidos (dos cifras) = archivos distintos.
- **Solo cuando aparece algo en pantalla.** Colócalos desde la lista de apariciones (`scripts/apariciones.mjs`), no a ojo:
  tarjeta/bloque → whoosh corto · ítem/bandera/fila → pop o burbuja (sube de tono dentro de una lista) · check → ding ·
  cifra que cuenta → contador mientras corre + golpe al aterrizar · logo final → logo reveal · tecleo → teclado.
  Si dos coinciden en < 0,13 s, suena solo el más importante.
- **Nada sobre un zoom o un destello vacío.** Sin risers salvo antes de un golpe narrativo real.
- **Cada SFX dura lo que su animación:** recorta colas (monedas, impactos).
- **Animaciones de móvil/UI:** menos es más. En la demo de «tienda» Brayan dejó solo el teclado y UN tap en el botón clave.
- **Nada de SFX generados por IA** (suenan toscos).

## Niveles (lo que de verdad funciona)
- **Los SFX van en su PROPIA pista, sin ducking.** Si van en la cama que se comprime con la voz, desaparecen bajo la
  locución («faltan los efectos de sonido», tienda guion 4).
- Picos de mezcla por tipo, antes del máster: toques −21 · teclado −24 · checks −22 · deslizamientos −25 · tarjetas/pops
  −20 · burbujas −22 dBFS. Quedan ≈ 15 dB bajo la voz en RMS y se oyen sin molestar.
  (`scripts/nivel.py` tiene una tabla `PICO` más conservadora; si con ella no se oyen, usa estos valores.)
- Comprueba que cada SFX asoma sobre la voz en SU ventana, no solo la media global:
  `python3 scripts/nivel.py --comprobar voz.wav sfx.wav`.
- ⚠️ No es «el SFX al 60 % de la voz» (eso los sube 6–18 dB: casi tan fuertes como la voz).
- Mide picos a 48 kHz (a 8 kHz los agudos parecen 30 dB más bajos).
- Tramos sin voz y con música enérgica: mide SFX frente a música; ahí suelen quedarse cortos.

## Música
- Intro relajada (lofi/chill), nunca tensión salvo hook de suspense. La de beneficios puede ser optimista.
- Cama baja con **ducking** (sidechain) bajo la voz.
- Si una pista se hace repetitiva, cambia de tema en un corte con sentido (fundidos de potencia constante `qsin`
  solapados sobre el corte, con el «drop» en el corte).
- En los tramos dramáticos (B/N + radio), la música se pausa.

## Voz y máster
- Cadena de voz: `highpass=f=80, equalizer=f=300:g=-1.5, equalizer=f=3200:g=1.5, deesser=i=0.25,
  acompressor=threshold=0.07:ratio=2.5`; cada voz a −16 LUFS con ganancia medida.
- Mezcla: `[voz][música con ducking][sfx]amix=inputs=3:normalize=0`.
- Máster con **ganancia FIJA** a −14 LUFS + `alimiter` (−1 dBTP). **Nunca `loudnorm` dinámico** al final.
- Con más de ~40 SFX, mezcla por lotes (cama de SFX a wav → música → final): un solo `filter_complex` enorme da SIGSEGV.
  `afade` pide `d=0.4`, no `d=.4`.
- Medida final: `ffmpeg -i final.mp4 -af ebur128=peak=true -f null -` → −14 LUFS, pico ≤ −1 dB.
