# QA y lecciones aprendidas

No se entrega un video sin pasar esta revisión. Los fallos de esta lista ocurrieron de verdad en los primeros renders y se detectaron solo porque se revisó fotograma a fotograma.

## Índice

1. Procedimiento de QA
2. Fallos vistos y su arreglo
3. Rendimiento y tamaño

---

## 1. Procedimiento de QA

**a) Vista previa (antes del render completo).** Usa `render.cjs --only` con 6–10 fotogramas clave y `hoja_contacto.py`. Mira:

- **Composición:** intro, agenda, cada protagonista (`L+20`) y el recap.
- **Encuadre:** zona segura (14 % arriba, 35 % abajo y 6 % a los lados) y tamaño de los objetos.
- **Textos:** que no se toquen entre sí ni con los objetos.

**b) Transiciones (después del render).** Hoja de contactos cada 4 fotogramas alrededor de cada cambio: entrada de la agenda, cada `S` (cambio de punto) y el recap.

```bash
python3 SKILL/scripts/hoja_contacto.py <proyecto>/build/final qa.png --frames 100,104,108,112,116,120,124 --cols 7 --width 240
```

Busca:

- Dos bloques en foco que se cruzan o se solapan.
- Un texto que todavía no se ha ido cuando entra otro en la misma zona.
- Un objeto que tapa la cabecera.

El motion blur fuerte en un movimiento rápido está bien, porque se lee como barrido.

**c) Sincronía.** Ejecuta `verificar_sync.py <mp4> <proyecto>` (`build.sh` ya lo hace). El script hace dos comprobaciones:

- **Desfase global:** correlaciona el audio del MP4 con la mezcla original. Detecta retrasos de la codificación y debe dar ~0 ms.
- **Por evento:** lista dónde suena el punto clave de cada sonido frente a su fotograma.

Todo debe salir "OK", con un desfase de entre −0,5 y +1,5 fotogramas: el sonido nunca se adelanta a la imagen.

**d) Audio "a ciegas".** No puedes escuchar, así que genera una gráfica de las pistas (`build/audio/stem_*.wav`) con las señales marcadas y comprueba:

- Que cada sonido empieza donde debe.
- Que nada arranca de golpe en t = 0.
- Que la música no tiene golpes marcados.

Al entregar, di que el audio se validó con mediciones y no de oído.

**e) Calidad del MP4.** Decodifica un fotograma protagonista (`ffmpeg -i video.mp4 -vf "select=eq(n\,250)" -vframes 1 x.png`) y comprueba que el texto del objeto se lee tras la compresión.

## 2. Fallos vistos y su arreglo

| Fallo | Cómo se vio | Arreglo (ya en las plantillas) |
|---|---|---|
| El hit sonaba 3 f tarde | El golpe estaba en el último keyframe, pero con ease-out quart el elemento ya estaba quieto 3 f antes | Hit en el fotograma de parada visual: inicio + 9 f en una entrada de 12 f |
| El hit sonaba 4 f antes | La saturación aplanó el ataque y el "máximo" de la onda cayó en la cola | Alinear por el pico del ataque (primeros 15 ms) |
| La agenda entraba sobre el título | La salida de la intro (ease-in, 12 f) seguía visible cuando entraban las tarjetas | Las tarjetas entran cuando la intro ha terminado de irse |
| En el recap la 03 se cruzaba con la 02 | La 03 bajaba a su sitio mientras la 02 ya estaba en foco | La 03 baja primero; las demás esperan 12 f en el fondo y luego avanzan |
| La factura tocaba la cabecera | Objeto demasiado alto | Caja máxima del protagonista de 760 × 560 y centro en y = 810 |
| Tarjetas del fondo sucias bajo la frase | Las alejadas seguían al 28 % detrás del texto | Con el objeto fuera se alejan más (× 0,45 de opacidad y +5 px de desenfoque) |
| Calculadora con teclas duplicadas | Seedream inventó "MC" y "÷" dos veces | Generar con GPT 2.5 con la distribución exacta de teclas |
| Medidas de alineación erróneas | Se midió con la cámara y los revelados aplicados | Medir con `transform: none` y restaurar después |
| El riser entraba a media subida en t = 0 | El riser de 2 s terminaba en f30 (1 s): empezaba antes del video | Fundido de entrada de 0,35 s en la pista de risers |
| MP4 provisional de 50 MB en un commit | Se hizo `git add` de la carpeta con el MP4 a medio corregir | Commit del MP4 solo al final, tras la QA |
| Whoosh que era un golpe | Una variación de ElevenLabs salió como un transitorio de 60 ms | Revisar la forma de onda y descartar |

## 3. Rendimiento y tamaño

**Render.** Unas 2 capturas por fotograma de media con el motion blur adaptativo. Tiempos con 3 procesos en 4 núcleos:

| Duración del video | Tiempo de render |
|---|---|
| 5 s | 1 min |
| 22 s | 4 min |

Si la máquina tiene más núcleos, usa `WORKERS=4 build.sh …`.

**Calidad del motion blur.** Hasta 10 muestras por fotograma, una cada 4 px de recorrido. Para movimientos muy rápidos, sube `MAX_SAMPLES` en `render.cjs`.

**Tamaño del MP4.** El grano encarece la compresión:

| CRF | Tasa aproximada | Uso |
|---|---|---|
| 26 | ~1,2 MB/s | Por defecto |
| 23 | ~2,3 MB/s | Máster |

Por debajo de CRF 23 el archivo crece sin mejora visible en el móvil.

**Disco.** Las capturas intermedias ocupan ~0,4 MB cada una y se borran tras la postproducción. Hacen falta unos 2 GB libres para 30 s de video.
