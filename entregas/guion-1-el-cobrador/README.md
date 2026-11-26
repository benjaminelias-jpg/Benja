# El cobrador · motions «estilo Ramiro»

Motions añadidos a `guion_1_el_cobrador_final.mp4` (46,1 s · 1080×1920 · 30 fps). El video ya traía subtítulos, iconos, el diagrama de la automatización y las transiciones. Por eso los motions entran solo donde no tapan nada de eso, y el resto del video queda **idéntico** al original (mismos fotogramas, mismo audio).

## Qué se añadió

| Tiempo | Qué | Por qué ahí |
|---|---|---|
| 12,2–15,3 s | Escena «estilo Ramiro» con **Steve Jobs** (con el Macintosh) sobre el cerebro de Vesalius: «No **pagas** / por un bot / pagas literalmente / por un cartero» | La frase «no estás pagando por un bot, estás pagando por un cartero» es la tesis del video. La escena sustituye a los iconos del bot y del sobre. |
| 22,0–24,4 s | Escena con **Robert Kiyosaki** sobre «El cambista y su mujer» (Massys, 1514): «Un **cartero** / no califica, / no decide, / no vende» | Sustituye la lista de tachones incrustada y repite sus tres «no» con la voz. |
| 40,1–41,1 s | Nota a mano sobre el hablante: «gratis para siempre» con subrayado | Es el único hueco libre antes del destello rosa de la transición. |

Las escenas siguen la receta de la skill `motion-graphic-estilo-ramiro`. Persona de cuerpo entero en B/N con ojo de pez, lámina en parallax, grano de TV, grotesca con tinta corrida, manuscrita naranja y flecha a mano. Se mantienen las reglas acordadas:
- La persona va completa, sin cortes visibles.
- La grotesca negra es más grande que la manuscrita naranja.
- La punta de la flecha no toca la cabeza.

El audio original (−14,3 LUFS, −1,7 dBTP) se conserva y solo se le suman efectos suaves de papel, lápiz y ticks. El master queda en −14,3 LUFS y −1,7 dBTP.

## Archivos

- `El_Cobrador_Motions_FINAL.mp4`: se entrega aparte por su tamaño.
- `Portada_El_Cobrador.png`.
- `proyecto/`: composición (`index.html`, `comp.js`) y scripts.

## Rehacerlo

```bash
cd proyecto/project && npm install
ffmpeg -i guion_1_el_cobrador_final.mp4 -q:v 2 -start_number 0 frames/f%05d.jpg      # fotogramas originales
python3 ../scripts/prep_db.py steve-jobs 1 assets/p-jobs.png                         # personas desde recursos/personajes
python3 ../scripts/prep_db.py robert-kiyosaki 1 assets/p-kiyosaki.png
python3 ../../../../.claude/skills/motion-graphic-estilo-ramiro/scripts/generar_grano.py assets
node render.mjs meta ../meta.json && node render.mjs range ../render 366,460         # y 659,732 y 1204,1232
python3 ../scripts/postpro4.py ../render ../render_pp ../meta.json                    # lente + recorte solo en las escenas
# copiar los fotogramas renderizados sobre los originales (r00366.jpg → f00366.jpg) y codificar con el audio mezclado
```

## Créditos de imagen (incluir en el copy si se publica)

- Steve Jobs: Bernard Gotfryd (dominio público).
- Robert Kiyosaki: Gage Skidmore (CC BY-SA 3.0).
- *El cambista y su mujer*, Massys (dominio público).
- Cerebro: Vesalius, *De humani corporis fabrica* (Wellcome Collection).

Usar a personas famosas en un **anuncio pagado** puede sugerir que respaldan la marca. En España, el uso comercial de la imagen de alguien requiere su consentimiento. Ver `recursos/personajes/README.md`.
