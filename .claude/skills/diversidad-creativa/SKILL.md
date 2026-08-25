---
name: diversidad-creativa
description: Expande una idea de anuncio en un árbol de conceptos con diversidad creativa garantizada — perspectivas → tipos de comunicación → formatos de reel → hook y guion. Usar cuando el usuario da una idea, ángulo o tema y quiere variantes de anuncios/reels para producir, o cuando pide "abrir" una idea en ángulos, perspectivas, tipos de comunicación o formatos.
---

# Generador de diversidad creativa

Expande **una idea** en un árbol de conceptos de anuncio listos para producir.

```
1 IDEA → N PERSPECTIVAS → M TIPOS → K FORMATOS → hook + guion + CTA
```

La especificación completa está en `GENERADOR-DIVERSIDAD-CREATIVA.md`. Las matrices y catálogos están en `bibliotecas/`. **Leé los archivos que necesites antes de generar** — las restricciones viven en las matrices, no en este resumen.

---

## Procedimiento

### 1. Leer los catálogos
Leé siempre `bibliotecas/03-tipos-persuasion.md` (14 tipos + matriz perspectiva×tipo) y `bibliotecas/04-formatos.md` (14 formatos + matriz tipo×formato). Leé `bibliotecas/05-hooks.md` y `bibliotecas/06-estructuras-guion.md` para el nivel de hoja. Si el usuario nombra una persona (`P0X`) o un ángulo (`A0X`), leé también `bibliotecas/01-personas.md` y `02-angulos.md`.

### 2. Validar la entrada
La entrada tiene que ser una **frase declarativa y discutible**. Si el usuario da un tema ("hablar de nuestro producto") o un beneficio genérico ("somos más rápidos"), convertilo primero en tesis con la fórmula de la biblioteca 02 y **mostrá la conversión** antes de expandir.

Si no hay persona definida, inferí una en 3 líneas (identidad, creencia bloqueante, nivel de consciencia) y **decilo explícitamente** — la calidad de los hooks depende de eso.

### 3. Elegir modo
Por defecto **estándar** (5 × 3 × 3 = 45). Si el usuario pide "rápido" o dice el número de piezas que necesita, ajustá: rápido 3×2×2 = 12 · exhaustivo 8×3×3 = 72 · vertical 1×3×5 = 15.

### 4. Nivel 1 — perspectivas
Reescribí la idea como N tesis, una por vector (`V1` Dolor · `V2` Deseo · `V3` Reencuadre · `V4` Objeción · `V5` Mecanismo · `V6` Enemigo · `V7` Identidad · `V8` Momento). Elegí los vectores más fuertes para esta idea y **decí cuáles descartaste y por qué**.

Chequeo: si las tesis no pueden contradecirse entre sí al menos parcialmente, la expansión falló — rehacela.

### 5. Nivel 2 — tipos
Por cada perspectiva, 3 tipos marcados ✅ en la matriz perspectiva×tipo (los ◐ solo como tercero). Reglas duras:
- El trío de una perspectiva difiere en **≥2 de 3** del trío de cualquier otra.
- Máximo **1 tipo de alto riesgo de política** (`EST`, `CTR`) por perspectiva.
- Ningún tipo aparece más de **3 veces** en todo el árbol.
- Si un tipo exige una prueba que no existe, descartalo. **Nunca inventes cifras, testimonios ni credenciales.**

### 6. Nivel 3 — formatos
Por cada tipo, 3 formatos marcados ✅ en la matriz tipo×formato. Reglas duras:
- **≥1 formato T1 por tipo** (regla de inversión escalonada).
- Máximo **1 formato T3 por perspectiva**.
- Los 3 formatos de un tipo deben ser de **3 familias visuales distintas** (no `THL`+`THX`+`IAH`).
- Ningún formato más de **6 veces** en un árbol de 45.

### 7. Hoja
Por cada concepto: hook **literal** (no "un hook sobre X"), estructura (`E1`–`E5`) compatible con el tipo, esqueleto de guion en 4 líneas, CTA único, puesta en escena en una línea, tier.
- Los 3 formatos hermanos de un tipo llevan **3 familias de hook distintas**.
- Tipo `IDE` y hooks `H03`/`H07` van **sin CTA** (estructura `E3`).
- Cifras nunca redondas. Una sola idea por pieza.

### 8. ID y salida
ID por concepto: `P{persona}_A{angulo}_V{vector}_{TIPO}_{FORMATO}_{HOOK}_v1`.

Entregá:
1. **Tabla de perspectivas** (nivel 1) con las descartadas y el motivo.
2. **Tabla completa de conceptos**: ID · V · Tipo · Formato · Puesta en escena · Hook literal · Estr. · CTA · Tier.
3. **Sprint priorizado** con la regla 60/30/10 (iteración / exploración / apuesta) y el **índice de diversidad** (celdas distintas ÷ conceptos ≥ 0,7).
4. **Chequeo de restricciones**: una línea confirmando cada regla dura, o señalando la que se relajó y por qué.

Si el árbol es de 45+ conceptos, entregá el detalle completo de las hojas priorizadas y las demás en formato compacto (una línea por concepto).

---

## Antipatrones a evitar

| No hagas | Hacé |
|---|---|
| 5 perspectivas que dicen lo mismo | Vectores que puedan contradecirse |
| El mismo tipo en todas las ramas | Rotación 2/3 obligatoria |
| Todo cara hablando sobre b-roll | 3 familias visuales por tipo |
| Hooks descritos en abstracto | Hooks escritos literales, en la voz de la persona |
| Todo T2/T3 | ≥1 T1 por tipo: nada se produce caro sin haber ganado barato |
| Inventar un número para que cierre el `EST` | Cambiar de tipo |
| Entregar 45 conceptos sin priorizar | Sprint de 12 con 60/30/10 |

## Datos del corpus que valen como reglas

- La densidad de edición correlaciona **inversamente** con el alcance: los 5 reels más vistos promedian ~2 cortes/10s; los hiper-editados topan en ~3,6k views.
- El mismo guion hizo **19.300 views como sketch y 1.800 como talking head editado**: el formato multiplica por 10 el mensaje.
- Dos tomas casi idénticas del mismo sketch: **19.278 vs 306 views**. La apertura y la premisa dominan todo lo demás.
- El crudo no gana por crudo, gana por premisa: los clones tardíos de un sketch que hizo 19k tres veces cayeron a ~350 views.
