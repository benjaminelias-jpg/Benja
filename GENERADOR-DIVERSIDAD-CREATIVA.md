# Generador de diversidad creativa

**Qué hace:** le entrás **una idea** y devuelve un árbol de conceptos de anuncio listos para producir. Abre la idea en perspectivas, cada perspectiva en tipos de comunicación, y cada tipo en formatos de reel — con hook, estructura de guion y CTA en cada hoja.

```
1 IDEA
 └─► 5 PERSPECTIVAS        (¿desde qué vector la contamos?)
      └─► 3 TIPOS          (¿con qué mecanismo la argumentamos?)
           └─► 3 FORMATOS  (¿en qué envase la filmamos?)
                └─► 1 HOOK + estructura + CTA
= 45 conceptos por idea
```

No es una lluvia de ideas. Es una **expansión con restricciones**: matrices de compatibilidad que evitan combinaciones absurdas, y cuotas de rotación que garantizan que las 45 hojas sean 45 anuncios distintos y no 45 sinónimos.

**Cómo se ejecuta:** manualmente con este documento, o invocando la skill `/diversidad-creativa "tu idea"` (ver [`.claude/skills/diversidad-creativa/SKILL.md`](.claude/skills/diversidad-creativa/SKILL.md)). El proceso estratégico que rodea al generador — testeo, lectura por capa, reciclaje — está en [`FLUJO-CREACION-ANUNCIOS.md`](FLUJO-CREACION-ANUNCIOS.md).

---

## Modos de expansión

| Modo | Perspectivas × Tipos × Formatos | Conceptos | Cuándo |
|---|---|---|---|
| **Rápido** | 3 × 2 × 2 | **12** | Sprint semanal estándar. Sale en una tarde |
| **Estándar** | 5 × 3 × 3 | **45** | Idea nueva con potencial. Alimenta 3–4 sprints |
| **Exhaustivo** | 8 × 3 × 3 | **72** | Ángulo que ya ganó y querés exprimir del todo |
| **Vertical** | 1 × 3 × 5 | **15** | Ya sabés la perspectiva ganadora, buscás el envase |

La expansión **no es el plan de producción**. Se genera de más y se prioriza al final (paso 6): de 45 conceptos salen 12 a producir esta semana y el resto queda en banco.

---

## Paso 0 — La entrada

El generador acepta tres niveles de entrada. Cuanto más pobre la entrada, más genérica la salida.

| Entrada | Ejemplo | Calidad de salida |
|---|---|---|
| **Idea suelta** (mínimo viable) | "El problema no es el alcance, es la captura" | Aceptable. El generador infiere persona |
| **Idea + persona** (recomendado) | La misma + ficha `P02` de [`bibliotecas/01-personas.md`](bibliotecas/01-personas.md) | Buena. Hooks con lenguaje real |
| **Ángulo formal + persona + pruebas** | Tesis del registro `A07` + lista de pruebas disponibles | Óptima. Los tipos que exigen prueba se asignan solo si la prueba existe |

**Lo único obligatorio:** una frase declarativa y discutible. Si la entrada es "hablar de nuestro producto", el generador no tiene de dónde agarrarse — hay que convertirla primero en tesis con la fórmula de [`bibliotecas/02-angulos.md`](bibliotecas/02-angulos.md).

---

## Paso 1 — Expansión a perspectivas (nivel 1)

Una **perspectiva** es el mismo asunto contado desde otro vector de entrada. No es un tema distinto: es la misma tesis atacada por otro lado. Las 8 disponibles (catálogo completo en la biblioteca 02):

`V1` Dolor · `V2` Deseo · `V3` Reencuadre · `V4` Objeción · `V5` Mecanismo · `V6` Enemigo · `V7` Identidad · `V8` Momento

**Prompt de expansión:**

> Tomá esta idea: *[IDEA]*. Para la persona *[PERSONA]*, reescribila como 5 tesis distintas, una por cada vector: dolor/consecuencia, deseo/resultado, reencuadre del problema, objeción convertida en titular, mecanismo único, enemigo/status quo, identidad, momento/timing. Elegí los 5 vectores más fuertes para esta idea. Cada tesis: una sola frase declarativa, discutible, con el lenguaje de la persona. Sin hooks, sin formato — solo la tesis.

**Restricciones de nivel 1:**
- Las 5 tesis deben poder **contradecirse entre sí** al menos parcialmente. Si todas dicen lo mismo con otras palabras, la expansión falló y hay que rehacerla.
- `V7` (identidad) siempre entra en la selección si hay presupuesto de alcance: es la perspectiva con más techo de views y cero conversión directa.
- `V5` (mecanismo) nunca se produce sola en frío: va a retargeting.

**Criterio de selección de los 5:** priorizar por (a) nivel de consciencia de la persona — ver tabla en biblioteca 01 —, (b) qué vectores no se usaron en los últimos 2 sprints, (c) qué pruebas hay disponibles.

---

## Paso 2 — Expansión a tipos de comunicación (nivel 2)

Cada perspectiva se abre en **3 tipos** de los 14 del catálogo ([`bibliotecas/03-tipos-persuasion.md`](bibliotecas/03-tipos-persuasion.md)), filtrados por la **matriz perspectiva × tipo** de esa biblioteca.

**Prompt:**

> Para la tesis *[PERSPECTIVA Vn]*, elegí 3 tipos de comunicación de la matriz que estén marcados ✅ para este vector. Para cada uno escribí en una línea: cuál es el argumento concreto que sostiene la tesis con ese mecanismo, y qué prueba específica necesita. Si la prueba no existe en la ficha de oferta, descartá ese tipo y elegí otro.

**Restricciones de nivel 2:**
1. Solo tipos `✅` de la matriz. Los `◐` se permiten como tercer tipo si hace falta variedad; los `✗` nunca.
2. **Rotación obligatoria:** el trío de tipos de una perspectiva debe diferir en al menos **2 de 3** del trío de cualquier otra perspectiva del mismo árbol. Sin esta regla el generador tiende a repartir `EST` + `SOC` + `AUT` en todas.
3. **Cobertura de riesgo:** máximo 1 tipo de alto riesgo de política (`EST`, `CTR`) por perspectiva.
4. **Realidad de prueba:** un tipo que exige prueba inexistente se descarta, no se produce con la prueba inventada.
5. En un árbol de 5 perspectivas, ningún tipo aparece más de **3 veces** (de 15 slots).

---

## Paso 3 — Expansión a formatos de reel (nivel 3)

Cada tipo se abre en **3 formatos** de los 14 ([`bibliotecas/04-formatos.md`](bibliotecas/04-formatos.md)), filtrados por la **matriz tipo × formato**.

**Prompt:**

> Para el argumento *[TIPO]* de la tesis *[PERSPECTIVA]*, elegí 3 formatos marcados ✅ en la matriz tipo × formato. Los 3 tienen que ser de tiers distintos o al menos incluir uno T1. Para cada formato describí en una línea la puesta en escena concreta: dónde se filma, quién aparece, qué se ve en pantalla.

**Restricciones de nivel 3:**
1. **Al menos 1 formato T1 por tipo.** Es la regla de inversión escalonada: el concepto tiene que poder probarse barato antes de producirse caro.
2. **Máximo 1 formato T3 por perspectiva** (no por tipo). El T3 es el cuello de botella de producción.
3. Los 3 formatos de un tipo deben pertenecer a **3 familias visuales distintas** — no `THL` + `THX` + `IAH` (los tres son cara hablando sobre edit).
4. En un árbol de 45 hojas, ningún formato aparece más de **6 veces**.
5. Si el inventario de activos no soporta un formato (no hay talento on-cam, no hay UGC contratado), se descarta en la generación, no en la producción.

---

## Paso 4 — Hoja: hook, estructura y CTA

Cada una de las 45 hojas se cierra con cuatro decisiones:

| Campo | De dónde sale | Regla |
|---|---|---|
| **Hook** | Familia de [`bibliotecas/05-hooks.md`](bibliotecas/05-hooks.md) | Los 3 formatos hermanos de un mismo tipo llevan **3 familias de hook distintas**. Redactado literal, no descrito |
| **Estructura** | Una de las 5 de [`bibliotecas/06-estructuras-guion.md`](bibliotecas/06-estructuras-guion.md) | La compatible con el tipo. Si el tipo es `IDE`, es `E3` y va sin CTA |
| **Guion esqueleto** | 4 líneas: apertura / desarrollo / giro / cierre | Una idea por pieza. Cifras no redondas |
| **CTA** | Único, una sola acción | `IDE` y los hooks `H03`/`H07` van sin CTA |

**Prompt de hoja:**

> Para el concepto *[perspectiva + tipo + formato]*, escribí: (1) el hook literal, de la familia [X], en las palabras de la persona; (2) el esqueleto de guion en 4 líneas siguiendo la estructura [En]; (3) el CTA en una línea, o "sin CTA" si corresponde; (4) la puesta en escena en una línea; (5) el tier de producción.

---

## Paso 5 — Nomenclatura de salida

Cada hoja recibe un ID que viaja al brief, al nombre del anuncio en la plataforma y al tracker:

```
P02_A07_V3_MIT_CNV_H10_v1
 │   │   │   │   │   │   └─ versión
 │   │   │   │   │   └───── hook: familia 10 (contraintuitivo)
 │   │   │   │   └───────── formato: conversacional 2 voces
 │   │   │   └───────────── tipo: mito derribado
 │   │   └───────────────── perspectiva: reencuadre
 │   └───────────────────── ángulo 07
 └───────────────────────── persona 02
```

Sin esto, la lectura por capa del paso 9 del flujo maestro es imposible: no se puede agregar performance por dimensión si el nombre del anuncio no contiene la dimensión.

---

## Paso 6 — Priorización: de 45 conceptos a 12 a producir

La expansión genera de más a propósito. La producción se decide con la **regla 60/30/10** del flujo maestro:

| Cuota | De dónde salen | Cuántos |
|---|---|---|
| **60% Iteración** | Hojas cuyo ángulo/hook ya tiene señal positiva | 7 |
| **30% Exploración** | Hojas de perspectivas nuevas sobre persona validada | 4 |
| **10% Apuesta** | La hoja más rara del árbol (tipo o formato nunca probado) | 1 |

**Chequeo de ortogonalidad antes de cerrar el sprint:**

- [ ] Ninguna celda `V × TIPO × FORMATO × HOOK` repetida
- [ ] Máximo 40% del sprint sobre una misma persona
- [ ] Máximo 3 conceptos por perspectiva
- [ ] Al menos 3 familias de formato y 3 tipos distintos
- [ ] Al menos 1 hoja T1 por cada hoja T3
- [ ] **Índice de diversidad** = celdas distintas / conceptos activos ≥ **0,7**

Las 33 hojas que no entran **no se tiran**: quedan en banco con estado `sin probar`. Cuando un ángulo gana, el banco ya tiene sus rotaciones escritas.

---

## Esquema de salida

**Tabla (para revisión humana):**

| ID | V | Tesis | Tipo | Argumento | Formato | Puesta en escena | Hook | Estr. | CTA | Tier |
|---|---|---|---|---|---|---|---|---|---|---|

**JSON (para automatizar producción o carga en plataforma):**

```json
{
  "idea": "El problema no es el alcance, es la captura",
  "persona": "P02",
  "angulo": "A07",
  "modo": "estandar",
  "conceptos": [
    {
      "id": "P02_A07_V3_MIT_CNV_H10_v1",
      "perspectiva": {"cod": "V3", "nombre": "Reencuadre", "tesis": "..."},
      "tipo": {"cod": "MIT", "argumento": "...", "prueba": "..."},
      "formato": {"cod": "CNV", "puesta_en_escena": "...", "tier": "T1", "duracion_s": 45},
      "hook": {"familia": "H10", "texto": "..."},
      "estructura": "E2",
      "guion": ["apertura", "desarrollo", "giro", "cierre"],
      "cta": "...",
      "riesgo_politica": "bajo",
      "estado": "sin_probar"
    }
  ]
}
```

---

## Ejemplo completo de expansión

**Entrada:** idea = *"El problema no es tu alcance, es que no tenés mecanismo de captura"* · persona = `P02` (creador con audiencia y sin ingresos, consciente del problema) · ángulo = `A07`.

### Nivel 1 — las 5 perspectivas

| Cód. | Vector | Tesis generada |
|---|---|---|
| `V1` | Dolor | Cada mes con 30k de alcance y cero conversaciones es un mes que trabajaste gratis para una plataforma |
| `V3` | Reencuadre | No tenés un problema de audiencia, tenés un problema de sistema: nadie te enseñó a convertir atención en conversación |
| `V4` | Objeción | "Ya probé embudos y no funcionaron" — probaste formularios, no probaste conversaciones |
| `V6` | Enemigo | El algoritmo no te debe nada. Lo que te debería preocupar es que tu contenido no pide nada |
| `V7` | Identidad | Hay dos tipos de creadores: el que publica para que lo vean y el que publica para que le escriban |

Se descartaron `V2` (deseo) por riesgo de claim, `V5` (mecanismo) porque en frío no funciona y `V8` (momento) por falta de un disparador real de urgencia.

### Nivel 2 y 3 — rama `V3` desarrollada completa

| ID | Tipo | Argumento | Formato | Puesta en escena | Hook (`familia`) | Estr. | Tier |
|---|---|---|---|---|---|---|---|
| `…V3_MIT_CNV_H10` | `MIT` Mito derribado | Publicar más no aumenta ingresos; el corte está en el paso que no existe | `CNV` | Dos personas en la calle junto al auto, una interpela a la otra, cero cortes | *"Publicar todos los días es lo que te está manteniendo pobre"* (`H10`) | E2 | T1 |
| `…V3_MIT_TFJ_H01` | `MIT` | Idem | `TFJ` | Monólogo al volante, titular ALL CAPS fijo los 50s | *"¿Cuánto se puede facturar con menos de 100.000 seguidores?"* (`H01`) | E1 | T1 |
| `…V3_MIT_THL_H03` | `MIT` | Idem | `THL` | Talking head de estudio, 7 cortes/10s, b-roll aspiracional, sin CTA | *"Cuidado con el creador que publica todos los días"* (`H03`) | E3 | T3 |
| `…V3_DMO_PAN_H12` | `DMO` Demostración | Se ve el CRM: 646 conversaciones abiertas desde comentarios | `PAN` | Celular filmando el monitor, dedo señalando, reflejos incluidos | *(arranca en medio)* "…mirá esto, esta venta entró hace 40 minutos" (`H12`) | E4 | T1 |
| `…V3_DMO_SPL_H11` | `DMO` | Idem | `SPL` | Split: cara arriba, pizarra con el circuito atención→conversación abajo | *"Tres cosas que tiene que hacer tu contenido y no hace ninguna"* (`H11`) | E4 | T2 |
| `…V3_DMO_CNV_H02` | `DMO` | Idem | `CNV` | Roleplay: alguien le pregunta y él abre la pantalla ahí mismo | *"Hey, me faltan agendas, ¿qué hago?"* (`H02`) | E2 | T1 |
| `…V3_EST_OTK_H04` | `EST` Estadístico | 17,8% de mensaje→agenda sobre 646 CTAs enviados | `OTK` | Selfie a brazo extendido, exterior real, 0 cortes | *"Mi perro me generó $1.500 en menos de 60 minutos"* (`H04`) | E1 | T1 |
| `…V3_EST_TXT_H08` | `EST` | Idem | `TXT` | Cifra fija en pantalla sobre 3 clips propios, 8 segundos, loop | *"Mirá este número antes de publicar otra vez"* (`H08`) | E1 | T1 |
| `…V3_EST_IAH_H05` | `EST` | Idem | `IAH` | Cara real + b-roll generado, 8 cortes/10s, look editorial | *"Así facturan los referentes que seguís y no te cuentan"* (`H05`) | E1 | T2 |

Nueve conceptos de **una** perspectiva. Nótese qué garantizan las restricciones: tres tipos distintos, nueve formatos sin repetir, nueve familias de hook sin repetir, seis piezas T1 contra una sola T3, y un solo tipo de alto riesgo de política (`EST`).

### Las otras 4 ramas (nivel 2, resumido)

| Perspectiva | Tipos asignados | Diferencia con las demás |
|---|---|---|
| `V1` Dolor | `URG` · `ABS` · `HUM` | 3/3 distintos de V3 |
| `V4` Objeción | `SOC` · `CTR` · `DMO` | 2/3 distintos de V3 |
| `V6` Enemigo | `REV` · `MIT` · `IDE` | 2/3 distintos de V3 |
| `V7` Identidad | `IDE` · `HIS` · `ANA` | 3/3 distintos de V3 |

Total del árbol: **45 conceptos**, con `MIT` apareciendo 2 veces, `DMO` 2, `IDE` 2 y el resto una sola — dentro del máximo de 3.

### Priorización del sprint (12 de 45)

- **7 iteración:** las seis T1 de `V3` (perspectiva con mejor histórico) + la T1 de `V4`
- **4 exploración:** una T1 de cada perspectiva restante (`V1`, `V6`, `V7`) + la T2 `SPL` de `V3`
- **1 apuesta:** `V7_ANA_IAT` — analogía con avatar de IA total, formato nunca probado

Índice de diversidad del sprint: 12 celdas distintas / 12 conceptos = **1,0**.

---

## Fallas típicas del generador y cómo se detectan

| Síntoma en la salida | Qué falló | Corrección |
|---|---|---|
| Las 5 perspectivas dicen lo mismo | Nivel 1: la idea de entrada era un beneficio, no una tesis | Pasar la entrada por la fórmula de ángulo primero |
| El mismo tipo en las 5 ramas | Se ignoró la rotación obligatoria (regla 2 del paso 2) | Regenerar nivel 2 forzando diferencia 2/3 |
| Todos los formatos son cara hablando | Se ignoró la regla de 3 familias visuales | Regenerar nivel 3 con el inventario de activos a la vista |
| Los hooks son descripciones ("un hook sobre X") | El paso 4 no se ejecutó de verdad | El hook se escribe literal o no existe |
| 45 conceptos y ninguno producible esta semana | Todo salió T2/T3 | Aplicar regla de al menos 1 T1 por tipo |
| Hay cifras que nadie puede verificar | Se asignó `EST` sin prueba en la ficha de oferta | Cambiar el tipo, nunca inventar el número |
