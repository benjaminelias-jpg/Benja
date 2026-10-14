# Plantillas de piezas tipo

Fichas de partida, fotograma a fotograma, para las piezas más habituales. Todas asumen **1080×1920 a 30 fps**. En otro formato, conserva la composición relativa y los tiempos en segundos.

Adapta cada ficha al encargo; no la copies tal cual. Lo que no cambia son las reglas: 3 elementos como máximo, escalonado de 2 a 4 f, curva suave, un solo acento y el hit en el fotograma de impacto.

## Índice

1. Tarjeta de sección ("01. LA CONSTANCIA")
2. Gráfico de datos (líneas o barras)
3. Cifra de impacto
4. Lower third (nombre y cargo)
5. Frase destacada o cita
6. Subtítulos sobrios
7. Transición entre secciones

---

## 1. Tarjeta de sección

**Uso**: abrir cada punto de una lista o capítulo ("01. LA CONSTANCIA", "02. EL ENFOQUE").

**Composición**
- Fondo `#0B111E` con grano fino (opacidad 4–6 %) y viñeta (bordes al 40–55 % de negro).
- Grupo centrado verticalmente. Número "01" a la izquierda (≈220 px, blanco, peso Bold o solo trazo de 2 px), línea vertical fina de 2 px y 140 px de alto, título a la derecha en caja alta (≈96 px, SemiBold, tracking +40).
- Elementos: número, línea y título (3, en el límite).

**Línea de tiempo** (duración total ≈ 3 s)

| Tiempo | Qué pasa |
|---|---|
| −0,6 s · f−18 | Arranca el riser de 1 s (puede pisar la escena anterior) |
| 0,0 s · f0 | Número: Y +60 px → 0, opacidad 0 → 100 % en 10 f, máscara rectangular, ease-out quart. Hush −16 dB con pico en f2 |
| 0,1 s · f3 | Línea: escala Y 0 → 100 % desde el centro, 10 f, ease-out |
| 0,2 s · f6 | Título: revelado de abajo arriba con máscara, Y +40 px → 0, 12 f |
| 0,4 s · f12 | El número se asienta: **hit grave suave (−14 dB)**, fin del riser |
| f12 → f75 | Permanencia: zoom 100 → 103 % en todo el grupo, cámara en mano (0,6 Hz, 3 px) |
| 2,5 s · f75 | Salida: todo sube 30 px y baja a 0 % de opacidad en 8 f, ease-in, escalonado inverso de 2 f (título, línea, número) |

**Variante en abanico**: número y título entran desde el centro, uno hacia cada lado (±80 px en X), y la línea aparece primero como eje.

---

## 2. Gráfico de datos (líneas o barras)

**Uso**: métricas, evolución temporal, comparativas.

**Composición**
- Fondo oscuro con rejilla técnica al 10 % de opacidad (líneas de 1 px cada 60–80 px).
- Gráfica en el centro óptico (ligeramente por encima del centro geométrico).
- Leyenda centrada en la parte inferior, dentro de la zona segura, a 36–40 px y al 70 % de opacidad.
- Elementos: línea o barras, marcador del máximo (punto y cifra como una sola unidad) y leyenda (3).

**Línea de tiempo** (≈ 4 s)

| Tiempo | Qué pasa |
|---|---|
| 0,0 s · f0 | Rejilla y ejes: fundido de 0 → 100 % en 10 f. Arranca el hum ambiental (−18 dB) |
| 0,33 s · f10 → f55 | La línea se dibuja (Recortar trazados, Final 0 → 100 %) en 1,5 s con ease-in-out. Las barras crecen desde la base con escalonado de 3 f entre barras, 18 f cada una, ease-out |
| 0,4 s · f12 | Leyenda: Y +20 px → 0, opacidad 0 → 100 % en 10 f |
| 1,83 s · f55 | Marcador del máximo: punto con escala 0 → 100 % en 8 f, ease-out |
| 1,93 s · f58 | Cifra del máximo: entra 3 f después del punto, con revelado de máscara y en el color de acento |
| 2,1 s · f63 | El punto se fija: **clic sutil (−18 dB)** |
| f63 → f110 | Permanencia con zoom 100 → 103 % |
| ≈ 3,7 s · f110 | Salida conjunta en 9 f, ease-in. El hum se desvanece en 15 f |

**Reglas propias**: el acento solo marca el dato que importa (el máximo o la barra ganadora); el resto va en blanco al 60–80 %. Nunca aparecen todas las etiquetas de valor a la vez.

---

## 3. Cifra de impacto

**Uso**: un número hito ("+1.250.000", "87 %", "3x") que el narrador enfatiza.

**Composición**
- Número centrado, en caja alta, 200–280 px, Bold o ExtraBold, en el color de acento.
- Etiqueta debajo (≈44 px, blanco al 80 %), por ejemplo "usuarios activos".
- Elementos: número y etiqueta (2).

**Línea de tiempo**

| Tiempo | Qué pasa |
|---|---|
| −2,0 s | Arranca el riser (2 s), sincronizado para culminar en el fotograma de fijación |
| 0,0 s · f0 | Número: opacidad 0 → 100 % en 8 f, escala 96 → 100 % durante todo el conteo |
| f0 → f36 | Contador de 0 a la cifra final en 1,2 s con ease-out quart: desacelera al llegar (ver expresión en `expresiones-after-effects.md`) |
| 1,2 s · f36 | La cifra se fija: **hit / boom grave (−12 a −14 dB)**. Motion blur del conteo apagado en este fotograma |
| 1,3 s · f39 | Etiqueta: revelado de abajo arriba con máscara, 10 f |
| f39 → salida | Zoom 100 → 104 %, cámara en mano muy suave |

Separador de miles: punto en España ("1.250.000") y coma en México y EE. UU. ("1,250,000"). Pregunta o infiérelo del mercado.

---

## 4. Lower third (nombre y cargo)

**Uso**: identificar a quien habla.

**Composición**
- En 16:9: tercio inferior izquierdo, alineado a la guía de márgenes. En 9:16: centrado, justo por encima del 35 % inferior reservado.
- Línea de acento fina (2–3 px) y 140–200 px de ancho, nombre (≈56 px, SemiBold, blanco) y cargo (≈32 px, Regular, blanco al 70 %).
- Sin caja de color sólido. Si el fondo es muy claro, usa un degradado oscuro suave detrás (negro al 0 → 50 %).

**Línea de tiempo**

| Tiempo | Qué pasa |
|---|---|
| f0 | Línea de acento: escala X 0 → 100 % desde la izquierda en 10 f, ease-out. Hush muy sutil (−18 dB) |
| f3 | Nombre: revelado con máscara de abajo arriba, 12 f |
| f6 | Cargo: igual que el nombre, 12 f |
| permanencia | 3–4 s, sin zoom propio (ya se mueve el plano de fondo) |
| salida | Orden inverso: cargo, nombre y línea, 8 f, ease-in, escalonado de 2 f. Sin SFX |

No lleva hit: no es un momento de revelación y un golpe ahí distraería.

---

## 5. Frase destacada o cita

**Uso**: remarcar una idea fuerza del discurso.

**Composición**
- Texto centrado, 2–3 líneas como máximo, ≈72–88 px, Medium. Una sola palabra en el color de acento.
- Atribución opcional debajo (≈32 px, blanco al 60 %).
- Elementos: bloque de frase y atribución (2).

**Línea de tiempo**

| Tiempo | Qué pasa |
|---|---|
| f0 | Línea 1: revelado con máscara horizontal, Y +40 → 0, 12 f. Hush −16 dB |
| f4 / f8 | Líneas 2 y 3, con 4 f de desfase cada una |
| al pronunciarse | La palabra clave pasa de blanco al acento con un fundido de 6 f, sincronizada con la voz |
| todo | Zoom 100 → 104 % durante toda la permanencia |
| cierre | Si es la conclusión del video: hit grave muy contenido (−16 dB) en el fotograma en que se fija la última línea |

---

## 6. Subtítulos sobrios

**Uso**: subtítulos que acompañan sin gritar.

**Composición**
- En 9:16, a la altura del 62–68 %, dentro de la zona segura. En 16:9, en el tercio inferior.
- Bloques de 2 a 5 palabras, una línea si se puede y nunca más de dos.
- Sans de la familia del proyecto, Medium o SemiBold, ≈56–64 px, blanco, sombra suave (negro al 35 %, desenfoque de 12 px, sin contorno grueso).
- Como máximo una palabra en acento por bloque, y solo si es la idea clave.

**Animación**
- Entrada del bloque: opacidad 0 → 100 % en 3–4 f y desplazamiento de 8 px de abajo arriba, ease-out.
- Cambio de bloque por corte, sincronizado con la voz. Nada de escala tipo *pop* palabra por palabra.
- **Sin SFX.** Los subtítulos nunca llevan sonido (regla 1.3).

---

## 7. Transición entre secciones

**Uso**: pasar de un bloque o capítulo al siguiente.

**Opción A: barrido con máscara**
- Un rectángulo del color de fondo barre horizontalmente la pantalla en 10–14 f con ease-in-out y motion blur activado.
- La nueva escena se revela detrás del barrido.
- Hush con el pico en el punto medio del barrido, que es el momento de mayor velocidad.

**Opción B: empuje de cámara**
- La escena saliente escala de 100 a 112 % en 8 f con ease-in y desenfoque direccional creciente; la entrante empieza en 106 % y llega a 100 % en 12 f con ease-out.
- Hush que culmina en el corte. Si abre una sección importante, encadénalo con la tarjeta de sección (plantilla 1), cuyo riser ya prepara el hit.

Evita los *glitches*, los destellos de colores fuera de la paleta y las transiciones de plantilla (cubos, páginas que giran, zooms con distorsión de lente exagerada).
