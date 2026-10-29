# Remarketing por vendedor · estructura en Meta

**Fecha:** 29 de octubre de 2026
**Campaña:** «🔴 REMARKETING / KUNFUPAY». Presupuesto por conjunto (ABO).
**Estado:** todo en **borrador**, sin publicar. Falta terminar la landing v2 (WhatsApp y calendario de cada vendedor) y subirla a la web.

**Configuración común a los 5 conjuntos:**
- Solo Instagram (feed, stories y reels).
- Optimización: conversiones en la web, evento **Contact** (el clic en WhatsApp de la landing).
- Solo su público, sin Advantage+.

| Conjunto | Público | €/día | Anuncio |
|---|---|---|---|
| RMK 3 / AUDIENCIA VENDEDORES (global) | Retargeting_puerta_fria_Ruben_GLOBAL | 5 | IMG / TWEET VENDEDORES / EQUIPO |
| RMK 4 / VENDEDOR TAIAB | Retargeting_puerta_fria_Taiab | 4 | IMG / TWEET VENDEDOR / TAIAB |
| RMK 4 / VENDEDOR RAFA | Retargeting_puerta_fria_Rafa | 4 | IMG / TWEET VENDEDOR / RAFA |
| RMK 4 / VENDEDOR JUAN | Retargeting_puerta_fria_Juan | 4 | IMG / TWEET VENDEDOR / JUAN |
| RMK 4 / VENDEDOR JORGE | Retargeting_puerta_fria_Jorge | 4 | IMG / TWEET VENDEDOR / JORGE |

## Cada anuncio

| Ubicación | Imagen | Texto | Título |
|---|---|---|---|
| Feed de Instagram | Tuit 4:5 | Copy largo, que filtra | «Te responde [nombre], no un bot» (global: «Te responde una persona») |
| Stories y reels | Tuit 9:16 | Copy corto | «+16.000 creadores ya cobran» |

Meta no deja dos textos en un mismo anuncio cuando cada imagen va a una ubicación distinta. Por eso cada ubicación lleva su texto y su título.

- **Botón:** «Más información».
- **Identidad:** cuenta de Instagram @kunfupay.

## URLs (landing v2)

```
https://kunfupay.com/landings/vendedores/v2/?vendedor=jorge&utm_source=meta&utm_medium=paid_social&utm_campaign=remarketing_kunfupay&utm_content=rmk4_jorge_tweet&utm_term=puerta_fria_jorge
```

- **Por vendedor:** igual para `taiab`, `rafa` y `juan`, cambiando `vendedor`, `utm_content` y `utm_term`.
- **Global:** sin `vendedor` (sale la versión de equipo), con `utm_content=rmk3_equipo_tweet` y `utm_term=puerta_fria_global`.

## Antes de publicar

1. **Borrar en Ads Manager** el anuncio «BORRAR - duplicado con error (no publicar)», que está dentro del conjunto de Jorge. Es un primer intento con error y bloquea la publicación.
2. **Subir la landing v2** a `kunfupay.com/landings/vendedores/v2/` con el WhatsApp y el calendario de cada vendedor.
3. **Revisión legal** de «nos encargamos de sus impuestos» y «olvídate del IVA».
4. **Públicos:** los `Retargeting_puerta_fria_*` se acaban de crear y salen como «inactivos» mientras se llenan. Comprobarlo antes de publicar.
