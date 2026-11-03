"""Spec de Meta para los estáticos de España que ya se han subido (mismo formato que los hubs:
4:5 en el feed de Instagram y 9:16 en Stories y Reels, 2 textos y 2 títulos, sin mejoras de
Meta). Uso: python3 specs_es.py > specs_es.txt"""
import json

from copys_es import CIERRE, CUERPO, FILTRO, PIEZAS

# pieza: (nombre del anuncio, slug, hash 1080x1350, hash 1080x1920)
SUBIDAS = {
    'ES-E3': ('ESTATICA / PAGINA DE PAGO / ESP', 'pagina_de_pago_esp',
              '6b6176974938a3d96f4bf712975e2c6a', '3b5af6798a3543393cf83636016cfbdf'),
}
FEATS = ["pac_relaxation", "image_touchups", "text_optimizations", "image_brightness_and_contrast",
         "enhance_cta", "image_animation", "adapt_to_placement", "image_uncrop", "inline_comment",
         "description_automation", "add_text_overlay", "image_templates", "site_extensions",
         "media_type_automation", "multi_photo_to_video", "reveal_details_over_time", "show_summary",
         "profile_card", "creative_stickers", "replace_media_text", "image_background_gen",
         "text_translation", "show_destination_blurbs"]

for pz in PIEZAS:
    if pz['pieza'] not in SUBIDAS:
        continue
    nombre, slug, f, s = SUBIDAS[pz['pieza']]
    largo = pz['gancho'] + "\n\n" + CUERPO + "\n\n" + FILTRO + "\n\n" + CIERRE
    url = ("https://kunfupay.com/landings/pagos-globales-es/v1?utm_source=instagram"
           "&utm_medium=paid_social&utm_campaign=testeo_es_adquisicion_kunfupay"
           "&utm_id=120247895823300648&utm_term=metodos_de_pago_esp"
           f"&utm_content=estatica_{slug}&utm_source_platform=meta&utm_creative_format=image"
           "&utm_marketing_tactic=prospecting")
    p = 'es' + slug.replace('_', '')[:20]
    spec = {
        "object_story_spec": {"page_id": "596973030161591", "instagram_user_id": "17841473965301923"},
        "degrees_of_freedom_spec": {"creative_features_spec": {k: {"enroll_status": "OPT_OUT"} for k in FEATS}},
        "asset_feed_spec": {
            "images": [{"hash": f, "adlabels": [{"name": p + "_f"}]}, {"hash": s, "adlabels": [{"name": p + "_s"}]}],
            "bodies": [{"text": t, "adlabels": [{"name": p + "_b"}]} for t in (largo, pz['corto'])],
            "titles": [{"text": t, "adlabels": [{"name": p + "_t"}]} for t in pz['titulos']],
            "link_urls": [{"website_url": url, "display_url": "kunfupay.com"}],
            "call_to_action_types": ["SIGN_UP"], "ad_formats": ["SINGLE_IMAGE"],
            "asset_customization_rules": [
                {"customization_spec": {"publisher_platforms": ["instagram"],
                                        "instagram_positions": ["stream", "explore_home", "profile_feed", "ig_search"]},
                 "image_label": {"name": p + "_f"}, "body_label": {"name": p + "_b"},
                 "title_label": {"name": p + "_t"}, "priority": 1},
                {"customization_spec": {"publisher_platforms": ["instagram"], "instagram_positions": ["story", "reels"]},
                 "image_label": {"name": p + "_s"}, "body_label": {"name": p + "_b"},
                 "title_label": {"name": p + "_t"}, "priority": 2}],
            "optimization_type": "PLACEMENT"},
        "contextual_multi_ads": {"enroll_status": "OPT_OUT"}}
    print('###', nombre)
    print(json.dumps(spec, ensure_ascii=False, separators=(',', ':')))
