# 00 Cómo usar este sistema

## Paso 1 — Terminar de configurar después de importar

Notion importa todos los CSV como bases de datos, pero convierte casi todas las columnas a **Texto**. Dedicá 15 minutos a cambiar los tipos de propiedad. Es lo único manual y se hace una sola vez.

| Base de datos | Cambiar a *Select* | Cambiar a *Multi-select* | Cambiar a *Date* | Cambiar a *Number* |
|---|---|---|---|---|
| 02 Pilares de Contenido | Objetivo | Formatos ideales, Emoción | — | % del mix |
| 03 Banco de Ideas | Estado, Pilar, Formato, Plataforma | Tema | Fecha captura | Score |
| 04 Calendario de Contenido | Estado, Plataforma, Formato, Pilar, Objetivo | Tema | Fecha publicación | Duración (s) |
| 07 Objetivos y OKRs | Estado, Horizonte, Área | — | Fecha límite | Meta, Actual |
| 08 Métricas Semanales | Plataforma | — | Semana (inicio) | Views, Likes, Comentarios, Guardados, Seguidores, Leads |
| 09 Biblioteca de Hooks | Familia, Intención | Pilar sugerido | — | Potencia (1-5) |
| 10 Catálogo de Formatos | Familia, Esfuerzo, Trabajo | Plataforma | — | Cortes/10s |
| 11 Campañas y Lanzamientos | Estado, Tipo | — | Inicio, Fin | Meta ingresos |
| 12 Colaboraciones y Marcas | Estado, Tipo | — | Fecha contacto, Deadline | Fee |

**Relaciones (opcional pero recomendado).** Una vez convertidos los tipos, transformá estas columnas en *Relation*:
- `03 Banco de Ideas → Pilar` apunta a `02 Pilares de Contenido`
- `04 Calendario → Pilar` apunta a `02 Pilares de Contenido`
- `04 Calendario → Idea origen` apunta a `03 Banco de Ideas`
- `04 Calendario → Campaña` apunta a `11 Campañas y Lanzamientos`
- `04 Calendario → Formato` apunta a `10 Catálogo de Formatos`

---

## Paso 2 — Crear las vistas que realmente vas a usar

### En `04 Calendario de Contenido`

| Vista | Tipo | Configuración |
|---|---|---|
| **📅 Calendario** | Calendar | Agrupado por `Fecha publicación`. Es la vista por defecto. |
| **🚦 Tablero de producción** | Board | Agrupado por `Estado`. Arrastrás tarjetas de columna a columna. |
| **🔥 Esta semana** | Table | Filtro: `Fecha publicación` está dentro de → Semana pasada/actual. Orden: fecha ascendente. |
| **✍️ Falta guion** | Table | Filtro: `Estado` es `Ángulo` o `Guion`. Es tu cola de escritura. |
| **🎬 Falta grabar** | Gallery | Filtro: `Estado` es `Grabación`. Batch de rodaje. |
| **📊 Por pilar** | Board | Agrupado por `Pilar`. Sirve para chequear el balance del mix. |
| **✅ Publicado** | Table | Filtro: `Estado` es `Publicado` o `Analizado`. Orden: fecha descendente. |

### En `03 Banco de Ideas`
- **Bandeja de entrada**: filtro `Estado` = `Cruda`. Ordenado por fecha descendente.
- **Listas para producir**: filtro `Estado` = `Madura` y `Score` ≥ 4.
- **Por pilar**: board agrupado por `Pilar`.

### En `08 Métricas Semanales`
- **Tabla por semana** con la suma de views y comentarios al pie de cada columna (`Calculate → Sum`).

---

## Paso 3 — Los cuatro momentos de la semana

| Cuándo | Qué | Dónde |
|---|---|---|
| **Todos los días, 2 min** | Tirar ideas crudas sin filtrar | Banco de Ideas |
| **Lunes, 45 min** | Elegir las piezas de la semana, asignar Ángulo + Formato + fecha | Calendario |
| **Martes/Miércoles, bloque de 3 h** | Grabar todo junto | Vista *Falta grabar* |
| **Viernes, 30 min** | Cargar métricas, marcar ganadores, decidir qué se recicla | Métricas Semanales |

El detalle completo está en [15 Ritual Semanal](15%20Ritual%20Semanal.md).

---

## Paso 4 — Reglas para que no se pudra

1. **Nada entra al Calendario sin fecha.** Si no tiene fecha, es una idea, no una pieza.
2. **El Banco de Ideas se poda.** Idea con más de 60 días en `Cruda` y Score ≤ 2 → `Archivada`. Sin culpa.
3. **Una pieza publicada no se cierra hasta estar `Analizado`.** Sin ese paso, el sistema no aprende.
4. **Todo lo que superó el promedio se marca `Recicla = Sí`** y vuelve al banco como idea nueva con otro formato.
5. **No agregues bases de datos nuevas el primer mes.** Si algo falta, primero probá si es una vista.
