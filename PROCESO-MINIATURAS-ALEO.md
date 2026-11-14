# Proceso de miniaturas con IA — análisis y réplica

Fuente: «Como Hacer Miniaturas para YouTube con IA en 2026» — Aleo Designs
(https://www.youtube.com/watch?v=95ET0Y-5XQg, 13:41, vídeo patrocinado por Higgsfield).
Análisis escena a escena hecho con el analizador de vídeo de Higgsfield (YouTube bloquea la descarga directa).

---

## 1. El proceso original (3 fases + extras)

| # | Paso | Herramienta | Detalle exacto |
|---|------|-------------|----------------|
| 1 | Lienzo | Photoshop | Documento nuevo (diseña en 1080p y luego escala ×2). |
| 2 | Recorte | Photoshop | Selección de objeto → «Seleccionar sujeto» → máscara → objeto inteligente. |
| 3 | Colocación | Photoshop | Pega el sujeto **sobre lienzo blanco** en la posición/escala final de la miniatura. `Ctrl+A` + `Ctrl+Shift+C` (copiar combinado) = «comando mágico». |
| 4 | Prompter | ChatGPT | Chat nuevo «entrenado» pegando un documento de instrucciones (equivale a nuestro prompt maestro). Le pasa la imagen + idea **dictada por voz**. Devuelve un prompt largo. |
| 5 | Generación | Higgsfield → Create Image | **GPT Image 2.5 Sunburst** ×4 + **Nano Banana 2.1** ×4 = **8 imágenes** en paralelo. Ajustes: 16:9, calidad **high** (mínimo), **2K**, fondo **opaque**, batch 4. |
| 6 | Elección | — | En su prueba **GPT Image 2.5 ganó claramente** («se puede usar directamente»); Nano Banana «requiere más trabajo». |
| 7 | Bordes | Photoshop → Camera Raw → Relleno generativo | GPT deja huecos blancos a izquierda/derecha; Nano Banana arriba/abajo. Se rellenan automáticamente. |
| 8 | Variantes A/B | ChatGPT + Higgsfield | Copia la composición final y pide al prompter cambiar entorno + ropa (hielo → selva con barro y serpiente). Otra vez 4 GPT + 4 Nano Banana. |
| 9 | Retoques menores | Higgsfield **Nano Banana 2.1** | Prompt corto, 4 variantes (ej.: mano extendida pidiendo ayuda, serpiente amarilla/blanca más gruesa). |
| 10 | Protección de cara | Photoshop máscaras | Pone la versión retocada encima, máscara invertida (`Ctrl+I`) y pinta en blanco **solo** la zona cambiada → la cara original queda intacta. |
| 11 | Reiluminación | Higgsfield **Relight** | Flash frontal: posición frontal, brillo 80, color blanco, luz dura. |
| 12 | Vertical | Higgsfield | Misma imagen + prompt de conversión, aspect ratio **9:16** → versión Shorts/TikTok/Reels. |
| 13 | 4K | Higgsfield Image Upscaling | **Topaz ×2**, preset **High Fidelity V2** → 3840×2160. |

Tiempos que declara: miniatura en 10–20 min si el prompt es bueno; hasta 1 h si no.
Consejos de dictado: hablar despacio, empezar por el sujeto, luego el entorno, ropa, interacción
con el suelo/objetos, «no mover cara, expresión, tamaño ni posición», «mínimo ruido visual», «ultrarrealismo».

Ejemplo dictado (idea original): sujeto de @imagen 1 tumbado en hielo ártico, plano cenital, sin
cambiar cara/expresión/tamaño/posición, hombros rectos, chaqueta térmica naranja/amarilla, nieve en la ropa,
hielo agrietado dejando ver agua, una mano en el pecho con piolet, mínimo ruido visual, fotorrealista.

---

## 2. Nuestra réplica (sin Photoshop de escritorio)

> HyperFrames (HeyGen) es para vídeo HTML, no sirve como Photoshop. Los pasos de Photoshop se hacen
> con código local (Python/PIL, reproducible) + herramientas de Higgsfield y Magnific.

| Paso original | Nuestro equivalente |
|---|---|
| Recorte «Seleccionar sujeto» | Higgsfield `remove_background` (o Magnific) |
| Colocar sobre lienzo blanco | Script local: sujeto recortado en lienzo blanco 16:9 en la posición pedida |
| ChatGPT «entrenado» | Claude con el prompt maestro de Benja (reglas 1–8, `@imagen N`, NEGATIVE PROMPT, ≤9.000 caracteres) |
| 8 generaciones | **Nuestra versión: 2 por modelo.** Higgsfield batch: GPT Image 2.5 Sunburst ×2 + Nano Banana 2.1 ×2 (16:9, 2K, high, opaque) |
| Comparativa de modelos | Ronda opcional con GPT Image 2.6, Nano Banana Pro y FLUX 3 con el mismo prompt e imagen (2 por modelo) |
| Relleno de bordes (Camera Raw) | Higgsfield `outpaint_image` 16:9, o recorte a relleno si el hueco es mínimo |
| Retoques menores | Nano Banana 2.1 con prompt corto ×2 |
| Máscara para proteger la cara | Script local: fusión con máscara (solo la zona cambiada) sobre la versión buena |
| Relight flash frontal | Magnific `images_relight` (Higgsfield no expone Relight por API) |
| Vertical 9:16 | Misma imagen + prompt de conversión en 9:16 |
| Upscale 4K | Higgsfield `upscale_image` 4K (backend ByteDance; Topaz no disponible por API) o Magnific `images_upscale` |
| Texto/titular | Script local con tipografía, si se pide (si no, se deja espacio negativo) |

### Entradas que necesito por miniatura
1. Fotos de la persona (frontal, buena luz; idealmente 1 principal + 1–2 de apoyo de la cara).
2. La idea dictada (audio transcrito o texto).
3. Título del vídeo y si llevará texto (y dónde).

### Entregables por miniatura
- Hoja comparativa de las generaciones (2 por modelo) (modelo, fidelidad de cara, realismo, composición, créditos).
- Ganadora retocada en 16:9 a 2048×1152, más versión 4K (3840×2160).
- Versión vertical 9:16.
- Variante A/B si se pide.
