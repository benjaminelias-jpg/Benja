---
name: motion-graphic-estilo-ramiro
description: >
  Motion graphic vertical 9:16 "estilo Ramiro": una persona recortada en blanco y negro (con ojo de pez en la cara)
  sobre papel beige, con una ilustración tenue detrás que se mueve en parallax contrario, ondulación líquida muy leve,
  textura de TV de los 90 (scanlines + semitono + grano), desenfoque en las esquinas y viñetas. Encima, dos líneas de
  grotesca negra con tinta corrida y RGB split que entran desde fuera de plano, dos líneas manuscritas naranjas que suben
  de abajo arriba (la segunda pasa POR DETRÁS de la persona) y una flecha dibujada a mano que sale de la última palabra y
  señala a la persona. La persona entra "a saltos" (A → 80 % → B, sin movimiento visible) para que parezca animación hecha
  a mano. Úsala SIEMPRE que pidan "motion graphic estilo Ramiro", "como el de Hormozi y el cerebro", "persona con
  ilustración detrás y flecha", "parallax B/N con grano y texto naranja a mano", o cuando quieran replicar ese tipo de
  escena con otra persona, otra ilustración u otra frase. Sin sonido por defecto. Construye con HyperFrames.
---

# Motion Graphic · estilo Ramiro

Escena de ~5 s, 1080×1920, 30 fps, sin audio. Nació replicando la parte de Hormozi (s. 27-30) del reel
`instagram.com/reels/De-zrR2T8v9/` y se afinó en 18 iteraciones con Brayan
(`Entregables/2026-10-28-replica-escena-cerebro/`). Todo lo que hay aquí son decisiones ya aprobadas: **no las
"mejores" por tu cuenta**.

Mira `referencia/frame-final.jpg` (resultado aprobado) y `referencia/entrada-a-saltos.jpg` (los 5 primeros frames).

## Qué pedir antes de empezar (solo lo que falte)

1. **Foto de la persona** (plano medio, mejor fondo liso; brazos cruzados funciona muy bien).
2. **Ilustración de fondo** (lámina tipo anatomía/grabado; se usará tenue y en multiply).
3. **Las 4 líneas de texto**: L1 grotesca grande (una palabra en negrita), L2 grotesca más pequeña,
   L3 y L4 manuscritas naranjas (L4 es la que pasa por detrás de la persona; su final es de donde sale la flecha).

Si la pieza es para **Kunfupay**, avisa: este estilo es editorial B/N con naranja `#f0601f` y NO es Morfeo. Pregunta si
se entrega tal cual (prueba/referencia) o si hay que pasarlo por la PUERTA VISUAL de `CLAUDE.md`. Para las agencias
satélite aplica su `BRAND.md`.

## Flujo

1. **Proyecto**: copia `plantilla/` entera a `Entregables/AAAA-MM-DD-nombre/` y genera el grano dentro:
   `python3 scripts/generar_grano.py <proyecto>/assets` (8 texturas; no se versionan porque pesan 11 MB).
2. **Recorte de la persona**:
   - `npx hyperframes remove-background foto.jpg -o assets/persona-cut.png` (o el MCP de remove-bg que haya).
   - Si la foto es pequeña, súbela antes (×2) para que el recorte salga fino.
   - `python3 scripts/recorte_ojo_pez.py foto-upscaled.png assets/persona-cut.png assets/persona-fish.png`
     (sin `-I`, necesita numpy/PIL). Hace: des-contaminación del fondo en los bordes, limpia los huecos blancos del
     pelo, erosiona 1 px el alfa, pasa a B/N con contraste y aplica el ojo de pez centrado en la cara
     (`cx 0.47W, cy 0.27H, k 0.22`; ajusta `cx/cy` si la cara no está ahí).
   - **Revisa el pelo y los bordes con zoom**: Brayan rechaza cualquier halo blanco.
3. **Fondo**: la ilustración a `assets/fondo.jpg`, en B/N (puede ir con su papel; el multiply la funde).
4. **Texto**: sustituye `{{LINEA_1}}…{{LINEA_4}}` en `index.html`. En L1 marca la palabra fuerte con `<b>`.
5. **Ajusta posiciones** (siempre con un frame de prueba, no a ciegas):
   - `#persona-wrap` (left/bottom/width/height): la persona a la izquierda, más pequeña que el texto, con la gorra/
     cabeza justo bajo L4 de modo que una palabra de L4 asome por detrás (ej. «lo» sobre la gorra).
   - `#l4` es absoluta (`top`), `#l3` va en el flujo con `margin-top`: L3 y L4 juntas, sin aire de más.
   - **Flecha**: `#flecha-trazo` arranca justo debajo de la última letra de L4, curva hacia la derecha/abajo y vuelve
     a la izquierda; la punta (`#flecha-punta`) queda **antes** de la cara, sin tocarla. Si mueves el trazo, mueve la
     punta con el mismo desplazamiento.
   - Coordenadas: mide en el render BASE (antes del post-proceso); el post-proceso amplía ~1/0.88 desde el centro.
6. **Render**: `npx hyperframes lint` → `npx hyperframes render --fps 30 --output render/base.mp4`.
7. **Post-proceso**: `bash scripts/postproceso.sh render/base.mp4 render/final.mp4`
   (ojo de pez de lente `k1 .10 k2 .02`, recorte 88 %, curva que hunde un poco los negros).
8. **Revisión**: frame a ~4,5 s + tira de los 5 primeros frames. Pasa `revisor-errores-visuales` antes de entregar.

## Receta (lo que NO se toca sin que lo pidan)

| Capa | Ajuste aprobado |
|---|---|
| Papel | fondo `#e4dfd2` |
| Ilustración | top 330 / left 420, 1000×1250, opacity .32, `multiply`, máscara radial; deriva x +60 → −60 y scale 1 → 1.04 en 5 s, `ease none` |
| Persona | deriva x 0 → +50, scale 1 → 1.02 (parallax contrario al fondo); `contrast(.85) brightness(1.06)`; fundido inferior con máscara (0→12 %) |
| Entrada a saltos | `tl.set` x −330 en f0, −150 en f2 (~80 % visible), 0 en f4. Nunca tween: no se debe ver el movimiento |
| Glitch persona | SOLO un borde azul `#00b4ff` .38 desplazado −3 px a la izquierda (nada de rojo, nada de distorsión) |
| Sombra persona | `drop-shadow(14px 4px 16px rgba(0,0,0,.32))` en el **contenedor** `#persona-wrap` (en `#persona` la máscara la corta) |
| Viñeta persona | degradado negro inferior enmascarado con su silueta, hasta las manos |
| Ondulación | turbulencia 0.004/0.006, desplazamiento 6 → 11 → 6; aplicada a la escena **y** al texto |
| Grotesca negra | Helvetica Neue, tracking −0.055em, L1 104 px (400 + `<b>` 600), L2 80 px; filtro `tinta`: deformación leve (turbulencia 0.035, scale 7) → blur 4 → umbral alfa (slope 9, −3.7) + RGB split rojo/cian ±5 px + estela 12 px. Entra con `x −1200 → 0`, `expo.out` 0.9 s (L1 0.2 s, L2 0.38 s) |
| Manuscrita naranja | fuente **Manuscrita** (`fonts/manuscrita.otf`), `#f0601f`, 128 px, rotate −2°, **sin** text-stroke, filtro `fino` (erode 1.3) + `boli` + `rgb-mano`. Entra de abajo arriba (`yPercent 105 → 0`, `power4.out` 0.7 s; L3 1.35 s, L4 1.6 s) |
| Flecha | negra `#0b0b0b`, stroke 7, filtro `boli` (trazo a mano); se dibuja con dashoffset 2.85 → 3.4 s y la punta 3.38 → 3.58 s; `opacity 0` hasta su `tl.set` (si no, salen puntos sueltos en f0) |
| Esquinas | blur 20 px en 3 esquinas (sup-izq, inf-izq, inf-der) **por encima del texto**; la sup-der va sin blur |
| Viñetas | arriba negro .42 → 0 en 17 %; abajo .82 → .45 (9 %) → 0 (22 %) |
| TV 90 | scanlines 1/4 px multiply, semitono 6 px .2, grano overlay .55 ciclando 8 texturas a 12 fps |

## Lo que Brayan ya descartó (no volver a proponer)

- Persona entrando con barrido o deslizando: entra a saltos y ya está en pantalla.
- Fuentes manuscritas "escolares" (Nanum Pen Script, Caveat), neón (Lujos Hand Neon) o rotulador en mayúsculas
  (Permanent Marker). La buena es Manuscrita, fina.
- Texto con revelado/máscara: la grotesca se **desplaza** desde fuera de plano con curva de movimiento.
- Glitch rojo o glitch con distorsión visible sobre la persona.
- Flecha que toca a la persona o que nace lejos del texto.
- Blur en la esquina superior derecha.

## Prompt para pedirla (para quien la use)

> «Haz un motion graphic estilo Ramiro de 5 s con [foto de la persona] y [ilustración de fondo]. Texto: L1 "[...]" (negrita
> en "[...]"), L2 "[...]", y en naranja a mano L3 "[...]" y L4 "[...]". La flecha sale de "[última palabra]" y señala a
> la persona.»
