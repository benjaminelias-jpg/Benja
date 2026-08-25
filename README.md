# Sistema de creación de anuncios con diversidad creativa

Un proceso definido para producir anuncios en volumen sin producir *el mismo anuncio doce veces*. Separa la decisión creativa en seis capas independientes, las expande de forma combinatoria a partir de una sola idea, y lee los resultados por capa para saber qué iterar.

## Empezar por acá

| Documento | Qué contiene |
|---|---|
| **[GENERADOR-DIVERSIDAD-CREATIVA.md](GENERADOR-DIVERSIDAD-CREATIVA.md)** | **El motor.** Una idea → perspectivas → tipos de comunicación → formatos de reel → hook y guion. Con matrices de compatibilidad, cuotas anti-redundancia y un ejemplo completo |
| [FLUJO-CREACION-ANUNCIOS.md](FLUJO-CREACION-ANUNCIOS.md) | **El proceso alrededor del motor.** Insumos, tiers de producción, estructura de test, lectura por capa, reciclaje de ganadores, calendario y roles |
| [ANALISIS-REELS-ALEJO-MUNOZZZ.md](ANALISIS-REELS-ALEJO-MUNOZZZ.md) | **La base de evidencia.** 100 reels analizados: formatos, hooks, b-roll, ritmo, funnel y la correlación edición↔performance |

## Ejecutar el generador

```
/diversidad-creativa "el problema no es tu alcance, es que no tenés mecanismo de captura"
```

Devuelve el árbol de conceptos, el sprint priorizado con la regla 60/30/10 y el índice de diversidad. Definición de la skill en [`.claude/skills/diversidad-creativa/`](.claude/skills/diversidad-creativa/SKILL.md).

## Catálogos

| Biblioteca | Qué enumera |
|---|---|
| [01 · Personas](bibliotecas/01-personas.md) | Ficha operativa (creencia bloqueante, nivel de consciencia, banco de voz) |
| [02 · Ángulos](bibliotecas/02-angulos.md) | Fórmula de tesis, las 8 perspectivas, test de calidad, registro |
| [03 · Tipos de comunicación](bibliotecas/03-tipos-persuasion.md) | 14 mecanismos + matriz perspectiva × tipo |
| [04 · Formatos de reel](bibliotecas/04-formatos.md) | 14 formatos + matriz tipo × formato + reglas de tier |
| [05 · Hooks](bibliotecas/05-hooks.md) | 12 familias con ejemplos medidos |
| [06 · Estructuras de guion](bibliotecas/06-estructuras-guion.md) | 5 arquitecturas y reglas de escritura |

## Plantillas

- [Brief creativo](plantillas/brief-creativo.md) — el contrato entre estrategia y producción
- [Tracker de creativos](plantillas/tracker-creativos.csv) — una fila por pieza, con todas las capas como columnas para poder agregar performance por dimensión

## Las tres reglas que sostienen el sistema

1. **Una capa por vez cuando querés atribuir.** Cambiar ángulo y formato juntos gana un dato y pierde la causa.
2. **El ángulo se prueba barato antes de producirse caro.** Ningún concepto entra en producción premium sin haber ganado en crudo.
3. **El formato es una variable de test, no una decisión estética.** El mismo guion del corpus hizo 19.300 views como sketch y 1.800 como talking head editado.
