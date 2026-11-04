"""Arma el creativo de Meta (asset_feed_spec) con el método de Kunfupay.

Uso:  python3 build_spec.py entrada.json > creativo.json
Después: el contenido de creativo.json va tal cual en el parámetro `creative` de ads_create_ad.

Entrada (JSON):
{
  "etiqueta": "mpdejadeperderventas",          # prefijo corto, solo letras y números
  "tipo": "video",                              # "video" o "imagen"
  "video_id": "1755093192221010",               # si es vídeo
  "portada_hash": "6dd2657b18811d0626be880f330b9ad5",   # si es vídeo
  "imagen_feed_hash": "...",                    # si es imagen: 4:5 (1080x1350)
  "imagen_vertical_hash": "...",                # si es imagen: 9:16 (1080x1920), opcional
  "textos": ["texto muy largo", "texto corto"],
  "titulos": ["Título 1", "Título 2"],
  "url": "https://kunfupay.com/...?...utm...",  # la UTM exacta
  "display_url": "kunfupay.com",
  "cta": "SEE_DETAILS",                         # o "SIGN_UP", etc.
  "solo_instagram": true                        # según las ubicaciones del conjunto
}
"""
import json
import sys

PAGE_ID = "596973030161591"
IG_ID = "17841473965301923"

# Todas las mejoras automáticas de Advantage+ creativo, apagadas.
FEATS = ["pac_relaxation", "image_touchups", "text_optimizations", "image_brightness_and_contrast",
         "enhance_cta", "image_animation", "adapt_to_placement", "image_uncrop", "inline_comment",
         "description_automation", "add_text_overlay", "image_templates", "site_extensions",
         "media_type_automation", "multi_photo_to_video", "reveal_details_over_time", "show_summary",
         "profile_card", "creative_stickers", "replace_media_text", "image_background_gen",
         "text_translation", "show_destination_blurbs"]

e = json.load(open(sys.argv[1], encoding="utf-8"))
p = e["etiqueta"]
assert p.isalnum(), "la etiqueta solo puede tener letras y números"
assert len(e["textos"]) >= 2 and len(e["titulos"]) >= 2, "mínimo 2 textos y 2 títulos"

# Reglas por ubicación (Meta exige al menos 2).
if e.get("solo_instagram", True):
    reglas = [{"publisher_platforms": ["instagram"],
               "instagram_positions": ["stream", "explore_home", "profile_feed", "ig_search"]},
              {"publisher_platforms": ["instagram"], "instagram_positions": ["story", "reels"]}]
else:
    reglas = [{"publisher_platforms": ["instagram"]},
              {"publisher_platforms": ["facebook", "audience_network", "threads"]}]

afs = {
    "bodies": [{"text": t, "adlabels": [{"name": p + "_b"}]} for t in e["textos"]],
    "titles": [{"text": t, "adlabels": [{"name": p + "_t"}]} for t in e["titulos"]],
    "link_urls": [{"website_url": e["url"], "display_url": e.get("display_url", "kunfupay.com")}],
    "call_to_action_types": [e.get("cta", "SEE_DETAILS")],
    "optimization_type": "PLACEMENT",
}
rules = []
if e["tipo"] == "video":
    afs["videos"] = [{"video_id": e["video_id"], "thumbnail_hash": e["portada_hash"],
                      "adlabels": [{"name": p + "_v"}]}]
    afs["ad_formats"] = ["SINGLE_VIDEO"]
    for i, r in enumerate(reglas, 1):
        rules.append({"customization_spec": r, "video_label": {"name": p + "_v"},
                      "body_label": {"name": p + "_b"}, "title_label": {"name": p + "_t"}, "priority": i})
else:
    imgs = [{"hash": e["imagen_feed_hash"], "adlabels": [{"name": p + "_f"}]}]
    vert = e.get("imagen_vertical_hash")
    if vert:
        imgs.append({"hash": vert, "adlabels": [{"name": p + "_s"}]})
    afs["images"] = imgs
    afs["ad_formats"] = ["SINGLE_IMAGE"]
    for i, r in enumerate(reglas, 1):
        es_vertical = vert and "story" in r.get("instagram_positions", [])
        rules.append({"customization_spec": r, "image_label": {"name": p + ("_s" if es_vertical else "_f")},
                      "body_label": {"name": p + "_b"}, "title_label": {"name": p + "_t"}, "priority": i})
afs["asset_customization_rules"] = rules

creativo = {
    "object_story_spec": {"page_id": PAGE_ID, "instagram_user_id": IG_ID},
    "degrees_of_freedom_spec": {"creative_features_spec": {k: {"enroll_status": "OPT_OUT"} for k in FEATS}},
    "asset_feed_spec": afs,
    "contextual_multi_ads": {"enroll_status": "OPT_OUT"},
}
print(json.dumps(creativo, ensure_ascii=False, separators=(",", ":")))
