"""Copys y spec del reel DEJA DE PERDER VENTAS para METODOS DE PAGO / ESP / AUD HERNAN 1%
(campaña TESTEO / ES / ADQUISICION KUNFUPAY), solo en Instagram.

Misma metodología que los reels de optimización fiscal: 2 textos (largo y corto) y 2 títulos
como opciones, sin mejoras automáticas de Meta y sin formulario.

Genera ../COPYS-REEL-DEJA-DE-PERDER-VENTAS.md y reel_deja_de_perder_ventas_specs.txt."""
import json
import os

here = os.path.dirname(os.path.abspath(__file__))

URL = ("https://kunfupay.com/landings/pagos-globales-es/v1?utm_source=instagram"
       "&utm_medium=paid_social&utm_campaign=testeo_es_adquisicion_kunfupay"
       "&utm_id=120247895823300648&utm_term=metodos_de_pago_esp"
       "&utm_content=reel_deja_de_perder_ventas_met_pagos&utm_source_platform=meta"
       "&utm_creative_format=video&utm_marketing_tactic=prospecting")

AVISO = ("Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas "
         "las prestan partners financieros con licencia.")

NOMBRE = 'REEL / DEJA DE PERDER VENTAS / MET PAGOS'
VIDEO = '1755093192221010'
PORTADA = '6dd2657b18811d0626be880f330b9ad5'

TEXTOS = [
    "Si vendes cursos, mentorías o comunidades online, puedes estar perdiendo hasta un 30 % "
    "de tus ventas.\n\n"
    "Y no es por tu oferta. Es por cómo te pagan.\n\n"
    "Piénsalo. Tu cliente de México ya dijo que sí. Abre tu enlace de pago y le pides euros "
    "con una tarjeta internacional que no tiene. Tu cliente de Colombia quiere pagarte como "
    "paga todo en su país, y tu pasarela no se lo deja.\n\n"
    "No te escribe para quejarse. No te dice «no pude pagar». Simplemente se va. Y esa venta "
    "no vuelve.\n\n"
    "Con Kunfupay cambia una sola cosa: cómo te pagan.\n"
    "→ Mandas tu enlace de pago, como siempre.\n"
    "→ Tu cliente lo abre y le salen los métodos que usa en su país, en su moneda.\n"
    "→ Paga en el momento, sin escribirte para preguntar cómo.\n"
    "→ Y a ti te llegan euros.\n\n"
    "No cambias lo que vendes. No haces otro lanzamiento. Solo dejas de perder a los que ya te "
    "querían comprar.\n\n"
    "Esto es para ti si:\n"
    "✓ Ya vendes cursos, mentorías, membresías o comunidades online.\n"
    "✓ Tienes clientes en más de un país (o los quieres tener).\n"
    "✓ Alguna vez alguien te dijo «quiero entrar, pero no puedo pagarte».\n"
    "✕ Si todavía no vendes, esto no es para ti.\n\n"
    "Entra y mira si tu negocio encaja.\n\n" + AVISO,

    "Puedes estar perdiendo hasta un 30 % de tus ventas. Y no es por tu oferta: es por cómo "
    "te pagan.\n\n"
    "Con Kunfupay, cada cliente paga como paga en su país, en su moneda. Y tú recibes "
    "euros.\n\n"
    "Entra y deja de perder ventas.",
]
TITULOS = ["Deja de perder ventas", "No es tu oferta, es cómo te pagan"]

FEATS = ["pac_relaxation", "image_touchups", "text_optimizations", "image_brightness_and_contrast",
         "enhance_cta", "image_animation", "adapt_to_placement", "image_uncrop", "inline_comment",
         "description_automation", "add_text_overlay", "image_templates", "site_extensions",
         "media_type_automation", "multi_photo_to_video", "reveal_details_over_time", "show_summary",
         "profile_card", "creative_stickers", "replace_media_text", "image_background_gen",
         "text_translation", "show_destination_blurbs"]
# Solo Instagram. Meta pide al menos 2 reglas; las dos usan los mismos textos y títulos.
REGLAS = [["stream", "explore_home", "profile_feed", "ig_search"], ["story", "reels"]]

p = 'mpdejadeperderventas'
spec = {
    "object_story_spec": {"page_id": "596973030161591", "instagram_user_id": "17841473965301923"},
    "degrees_of_freedom_spec": {"creative_features_spec": {k: {"enroll_status": "OPT_OUT"} for k in FEATS}},
    "asset_feed_spec": {
        "videos": [{"video_id": VIDEO, "thumbnail_hash": PORTADA, "adlabels": [{"name": p + "_v"}]}],
        "bodies": [{"text": t, "adlabels": [{"name": p + "_b"}]} for t in TEXTOS],
        "titles": [{"text": t, "adlabels": [{"name": p + "_t"}]} for t in TITULOS],
        "link_urls": [{"website_url": URL, "display_url": "kunfupay.com"}],
        "call_to_action_types": ["SEE_DETAILS"],
        "ad_formats": ["SINGLE_VIDEO"],
        "asset_customization_rules": [
            {"customization_spec": {"publisher_platforms": ["instagram"], "instagram_positions": pos},
             "video_label": {"name": p + "_v"}, "body_label": {"name": p + "_b"},
             "title_label": {"name": p + "_t"}, "priority": i}
            for i, pos in enumerate(REGLAS, 1)],
        "optimization_type": "PLACEMENT"},
    "contextual_multi_ads": {"enroll_status": "OPT_OUT"}}

md = ["# Copys · " + NOMBRE, "",
      "Conjunto: METODOS DE PAGO / ESP / AUD HERNAN 1%, solo Instagram. 2 textos y 2 títulos "
      "como opciones.", "", f"**URL:** {URL}", "",
      f"**Título 1:** {TITULOS[0]}  ", f"**Título 2:** {TITULOS[1]}", ""]
for i, t in enumerate(TEXTOS, 1):
    md += [f"**Texto {i}** ({len(t)} caracteres)", "", t, ""]

open(os.path.join(here, 'reel_deja_de_perder_ventas_specs.txt'), 'w', encoding='utf-8').write(
    '### ' + NOMBRE + '\n' + json.dumps(spec, ensure_ascii=False, separators=(',', ':')) + '\n')
open(os.path.join(here, '..', 'COPYS-REEL-DEJA-DE-PERDER-VENTAS.md'), 'w', encoding='utf-8').write('\n'.join(md))
