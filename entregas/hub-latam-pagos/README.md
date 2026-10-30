# Hub Latam Pagos · edición con motion graphics «estilo Ramiro»

Edición de `hub_latam_pagos.mp4` (carpeta de Drive del 30/10): anuncio de Kunfupay para creadores de Latam que cobran sus cursos.

| | |
|---|---|
| Fuente | 1080×1920 · 30 fps · 57,4 s (HEVC) |
| Final | 1080×1920 · 30 fps · 51,4 s · H.264 · −14 LUFS / −1,2 dBTP |

## Entregables

- `Hub_Latam_Pagos_FINAL.mp4`: se entrega aparte por su tamaño (no está en git).
- `EDL_Hub_Latam_Pagos.md` / `.csv`.
- `Hub_Latam_Pagos.srt`: todas las palabras, en bloques de 2–4.
- `Portada_Hub_Latam_Pagos.png`.
- `proyecto/`: composición (`index.html`, `comp.js`) y scripts del pipeline.

## Qué lleva

**3 escenas a pantalla completa «estilo Ramiro»**, con la receta de la skill de Brayan: persona en B/N con ojo de pez, lámina antigua en parallax, grano de TV, grotesca con tinta corrida, manuscrita naranja y flecha a mano. Cada una entra con su frase.

| Tiempo | Persona | Fondo | Texto |
|---|---|---|---|
| 11,2 s | Warren Buffett (cuerpo entero) | *El cambista y su mujer* (Massys, 1514) | Regla nº 1: no perder dinero. / y tú pierdes hasta un 27 % |
| 18,4 s | Jeff Bezos | Mapamundi de Ortelius (1572) | Obsesiónate con tu cliente: / si no ve su moneda local… |
| 31,7 s | Steve Jobs con el Macintosh (1984) | Cerebro de Vesalius, *De humani corporis fabrica* | Lo simple siempre gana: / un solo link en todo el mundo |

**Motions sencillas** sobre el hablante, en el mismo lenguaje (papel, manuscrita naranja, trazos a mano):
- «como yo» con una flecha.
- Etiquetas Hotmart / Stripe + LLC / Transferencia, que se tachan en «no es escalable».
- «irse» con una flecha que se escapa del plano.
- La etiqueta «tu enlace · kunfupay», conectada a Argentina ARS, España EUR y EE. UU. USD.
- «₿ cripto».
- € y $ a mano.
- Tarjeta «conversiones +27 %».
- Flecha del CTA.
- Tarjeta final.

**Reglas que se respetan**:
- **Gancho**: empieza con el video normal y un solo elemento.
- **Ritmo**: las escenas alternan con el hablante; nunca hay dos seguidas.
- **Famosos**: ninguno aparece junto al nombre de la marca. Se usan como metáfora de una idea, sin frases inventadas.
- **Personas siempre completas**: cuerpo entero o cuerpo que sigue fuera del encuadre. Nunca se ve un corte (ni cabeza, ni hombros, ni base del recorte). El ojo de pez se aplica con margen para no recortar la cabeza.
- **Flecha**: la punta queda fuera de la cabeza. El borde real de la cabeza se mide en el recorte.
- **Texto**: la grotesca negra es más grande que la manuscrita naranja (124/96 px frente a 92 px, comprimida en vertical).
- **Recursos**: el creador no se usa como recurso visual.
- **Subtítulos**: simples, con el énfasis en manuscrita naranja. Se ocultan durante las escenas.
- **Zonas seguras de Meta**: se respetan.

## Pipeline

1. `scripts/cut3.py`
   - Recorta silencios a −38 dB con las reglas del Anuncio 1: de 57,4 s a 49,9 s.
   - Aplica una LUT de piel (`color/skin.cube`) que corrige el magenta sin tocar la luz morada.
2. `scripts/align3.py`: alineación forzada (MMS) del guion corregido («Kung Fu Pay» → Kunfupay, «27 %»).
3. `scripts/prep_full.py`: personas de cuerpo entero con ojo de pez (lienzo con margen). Mide el borde de la cabeza para colocar la flecha.
4. `project/render.mjs all <dir> 4`: render determinista con Chromium.
5. `scripts/postpro.py`: post-proceso de la skill (lente k1 .10 / k2 .02, recorte 88 % y curva), solo en las escenas y la tarjeta.
6. `scripts/audio_mix3.py`: voz limpia, misma música (Lyria 3 Pro) con el acorde final en la tarjeta, SFX de papel y lápiz, máster a −14 LUFS.

## Créditos de imagen (incluir en el copy si se publica)

- Warren Buffett: Minda Haas Kuhlmann (CC BY 2.0).
- Jeff Bezos: Daniel Oberhaus (CC BY 4.0).
- Steve Jobs: Bernard Gotfryd (dominio público).
- Vesalius: Wellcome Collection (CC BY 4.0).
- Massys y Ortelius: dominio público.

Usar a personas famosas en un **anuncio pagado** puede sugerir que respaldan la marca. En España, el uso comercial de la imagen de alguien requiere su consentimiento. Ver `recursos/personajes/README.md`.
