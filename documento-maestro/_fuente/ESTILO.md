# Cómo se escriben estos documentos

Lo lee el equipo de marketing de Kunfupay (Benja, Juanjo, Brayan) y gente nueva que no sabe nada del sistema. Tiene que poder leerse rápido y sin esfuerzo.

## Lenguaje

- Español de España, de tú. Frases cortas: casi todas de menos de 20 palabras.
- Palabras corrientes. Si hace falta un término técnico, se explica la primera vez con una frase (ejemplo: «hook rate: de cada 100 personas que ven el anuncio, cuántas se quedan más de 3 segundos»).
- Primero la idea, luego el detalle. Cada apartado empieza diciendo lo importante.
- Cada regla lleva su porqué. El porqué va en una cita (línea que empieza por `>`), así: `> **Por qué:** …`
- Nada de emojis. Nada de relleno ni de frases de adorno. No repitas lo mismo en dos sitios.
- Párrafos de 1 a 3 frases. Listas para cosas paralelas. Tablas para comparar.
- Cifras exactas con su unidad y su fecha. Decimales con coma y espacio antes de € y de %: «2,29 €», «27 %».
- Comillas latinas «» para textos de anuncios y citas.
- No inventes nada. Si un dato no consta en las notas, se escribe «pendiente de confirmar» o no se pone.
- No uses nombres internos de archivos de código ni identificadores de Meta en el texto, salvo en el inventario.
- Lo que dijo Benja manda (archivo `CRITERIO-BENJA.md`). Si un documento antiguo del repositorio dice otra cosa, se sigue a Benja y, si aporta, se menciona en una línea que la regla cambió.

## Formato de los archivos (`contenido/<nombre>.md`)

La primera línea es `pie-pdf: Texto del pie de página`.

Después:

```
::portada Antetítulo | Título | Subtítulo | Línea de pie
::indice

## Título del capítulo || Resumen de una línea para el índice

{lead} Párrafo de entrada con la idea principal del capítulo.

### Apartado
#### Subapartado

Texto con **negrita** y *cursiva*.

- lista
  - sublista (2 espacios)

1. lista numerada

> **Por qué:** texto del porqué.

| Columna | Columna |
|---|---|
| celda | celda |

::salto                (salto de página)
```

Cada `##` empieza en página nueva y se numera solo («Parte 1», «Parte 2»…). No uses `#` de un solo nivel.

### Pizarra: un anuncio con flechas

```
::pizarra creatividades/ruta/imagen.png w=236
L 0.10,0.23 | Etiqueta corta | Por qué está, en una o dos frases.
R 0.90,0.66 | Otra etiqueta | Otro porqué.
pie: Qué anuncio es.
::fin
```

- `L` pone la nota a la izquierda y `R` a la derecha. Las coordenadas `x,y` van de 0 a 1 sobre la imagen (0,0 es arriba a la izquierda) y marcan a dónde apunta la flecha.
- Las notas de la izquierda apuntan a cosas de la mitad izquierda del anuncio, y las de la derecha a la mitad derecha. Se escriben de arriba abajo.
- Apunta al borde de la cosa (justo antes de donde empieza el texto), no al centro, para que la flecha no tape nada.
- Entre 5 y 7 notas por pizarra. Etiqueta de 3 a 6 palabras. Porqué de menos de 25 palabras.
- Ancho: `w=236` para imágenes 4:5 con notas a los dos lados. Para verticales 9:16, `w=190`.
- Si todas las notas son `R` (sin `L`), usa `w=290`.

Pizarra sobre un texto (por ejemplo, el copy de un anuncio):

```
::pizarratexto w=250
<p>Primer párrafo del copy…</p>
<p>Segundo párrafo…</p>
--
R 0.95,0.08 | El gancho | Por qué.
pie: Texto largo del anuncio X.
::fin
```

### Otras piezas (HTML directo; cada bloque sin líneas en blanco dentro)

```
::galeria creatividades/a.png = Pie A ; creatividades/b.png = Pie B ; creatividades/c.png = Pie C

<div class="dos"><div class="si"><h4>Sí</h4><ul><li>…</li></ul></div><div class="no"><h4>No</h4><ul><li>…</li></ul></div></div>

<ol class="pasos"><li><strong>Título del paso</strong> Explicación.</li><li><strong>Otro paso</strong> Explicación.</li></ol>

<div class="tres"><div class="caja"><b>Título</b><span>Texto</span></div><div class="caja"><b>Título</b><span>Texto</span></div><div class="caja"><b>Título</b><span>Texto</span></div></div>
```

- No edites `build.py`, `estilo.css`, `render.js` ni `figuras.py`.
- Colores: no añadas ninguno. El documento usa negro, gris y un azul oscuro. Los anuncios ya traen su color.

## Cómo generar y revisar el PDF

```
cd /home/user/Benja/documento-maestro/_fuente
python3 build.py <nombre>          # crea ../pdf/<nombre>.pdf
pdftoppm -r 60 -png ../pdf/<nombre>.pdf /ruta/de/trabajo/p    # una imagen por página para revisarla
```

Revisa siempre las páginas (con Read sobre los PNG): que ninguna pizarra se corte, que las flechas apunten a lo que dice la nota, que no haya páginas casi vacías ni tablas partidas de mala manera, y que no salga «IMAGENES ROTAS» al construir. Corrige y vuelve a generar.
