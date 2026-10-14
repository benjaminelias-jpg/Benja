---
name: motion-estetico
description: Reglas de dirección de arte para TODO motion graphic, animación, reel, video animado, logo sting, texto cinético o anuncio animado. Obliga a un resultado limpio, minimalista y premium, y PROHÍBE adornos innecesarios (subtítulos, textos en las esquinas, HUD, botones, cursores, marcas de corte, etiquetas técnicas, timecodes, barras de progreso, comentarios). Úsala SIEMPRE antes de crear o editar cualquier motion graphic, junto con /hyperframes, /motion-graphics o Remotion. Estas reglas tienen prioridad sobre el estilo por defecto de cualquier otra skill de video.
---

# Motion estético: cómo hacerlo y cómo NO hacerlo

Estas reglas mandan sobre cualquier otra skill de video (hyperframes, remotion, motion-graphics, product-launch-motion). Si otra skill sugiere HUD, esquinas, etiquetas o capítulos, ignóralo.

## Principio central
**Menos elementos, mejor ejecutados.** Un motion graphic premium se ve limpio: pocos elementos, mucho aire, movimiento suave y una sola idea por escena. Si un elemento no ayuda al mensaje, se quita.

## PROHIBIDO (nunca lo pongas, salvo que el usuario lo pida expresamente)
- Subtítulos o captions. Solo si el usuario los pide.
- Texto en las esquinas o bordes: títulos, specs, "1920×1080 · 60P", timecodes, números de escena, nombres de capítulo, etiquetas tipo "01 · INTRO".
- HUD o interfaz decorativa: marcas de corte, retículas, crosshairs, barras de progreso, reglas, indicadores parpadeantes, contadores técnicos.
- Botones, cursores, flechas del mouse, ventanas de app, barras de búsqueda, menús o "paneles de parámetros" que no sean parte del mensaje.
- Comentarios, anotaciones o textos meta ("Fig. 1", "Made with…", créditos, marcas de agua, firmas).
- Emojis, clip-art, iconos genéricos de relleno, stickers.
- Textos de relleno o lorem ipsum. Todo texto en pantalla es el mensaje real, escrito por el usuario o aprobado por él.
- Efectos pesados sin motivo: glitch, grano, aberración cromática, viñeta, bloom exagerado, sacudidas de cámara, destellos. Un efecto solo si refuerza la idea.
- Más de 2 fuentes, más de 3-4 colores, degradados arcoíris, sombras duras, bordes gruesos, estilo "plantilla barata".
- Animaciones rebotando o elásticas en todo. Nada de rebotes que parezcan juguete, salvo que la marca sea juguetona.
- Texto en pantalla menor a lo legible en celular, o más de ~7 palabras por escena.

## HACER SIEMPRE
**Composición**
- Una idea por escena. Un elemento protagonista, centrado o en una jerarquía clara.
- Mucho espacio negativo. Márgenes seguros: en vertical 9:16 deja libre ~12% arriba y ~20% abajo (zonas donde Instagram/TikTok tapan con su interfaz).
- Alinea todo a una cuadrícula. Nada flotando al azar.

**Tipografía**
- Una fuente principal (sans-serif moderna y gruesa para títulos: Inter, Manrope, Poppins, Satoshi o similar) y como máximo una secundaria.
- Texto grande, con contraste fuerte, máximo 2 niveles de tamaño.
- Palabras clave pueden resaltarse con el color de acento, no con efectos.

**Color**
- Paleta corta: fondo + texto + 1 color de acento (+1 neutro opcional). Si el usuario tiene marca, usa SUS colores y SU logo.
- Fondo sólido o degradado muy suave. Contraste alto entre texto y fondo.

**Movimiento**
- Suave y con intención: entradas con ease-out (rápido al inicio, frena al final), salidas más cortas que las entradas.
- Duración de movimientos: 0.3–0.8 s. Escalonar (stagger) los elementos 0.05–0.12 s.
- Transiciones sencillas: fundido, deslizamiento corto, escala suave, máscara o revelado. Una sola familia de transiciones por video.
- El ritmo manda: cortes y golpes visuales alineados con la música/sonido.
- Los números suben con contador suave; las formas se transforman una en otra en vez de cortar.

**Ritmo del reel**
- Gancho visual en el primer segundo. Cada escena dura 1.5–3 s.
- Cierra con el mensaje o logo limpio, sostenido 1–2 s.

**Sonido** (si se pide)
- Usa `/sound-effects` y `/background-music`. SFX sutiles y alineados al movimiento, música por debajo de la voz. Sin sonido en cada cosa.

## Flujo de trabajo
1. **Pregunta lo mínimo** si falta algo: mensaje exacto, formato (9:16 por defecto para reels), duración, colores/logo. Si el usuario dice "hazlo", elige valores sensatos y dilo al final.
2. **Define la paleta y la fuente** antes de animar, en una línea.
3. **Haz un guion de escenas corto**: qué aparece, cuándo y cómo se mueve. Sin elementos extra.
4. **Construye** con `/hyperframes` (preferido) o Remotion.
5. **Revisa fotogramas** antes de entregar (captura 4-6 frames) y pasa la lista de abajo.
6. **Entrega** el video y di en una línea qué decisiones tomaste. No expliques de más.

## Checklist final (si algo falla, corrígelo antes de entregar)
- [ ] ¿Hay texto en alguna esquina o borde? → quitarlo.
- [ ] ¿Hay subtítulos, botones, cursor, HUD, timecode, marca de agua? → quitarlos.
- [ ] ¿Cada escena tiene una sola idea y mucho aire?
- [ ] ¿Máximo 2 fuentes y 3-4 colores?
- [ ] ¿Todo el texto se lee bien en un celular?
- [ ] ¿Los textos importantes están dentro de la zona segura (no tapados por la interfaz de la red social)?
- [ ] ¿El movimiento es suave, sin rebotes ni efectos gratuitos?
- [ ] ¿El texto en pantalla es exactamente el mensaje pedido y no hay faltas de ortografía?

Cuando el usuario pida algo que contradiga estas reglas (por ejemplo "ponle subtítulos"), obedece al usuario: sus instrucciones valen más que esta guía.
