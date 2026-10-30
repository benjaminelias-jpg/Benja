"""Copys y specs de los reels genéricos de la campaña HUBS / METODOS DE PAGO.

Cada anuncio lleva dos textos (uno largo, de tú a tú, que filtra, y uno corto)
y dos títulos, como opciones en todas las ubicaciones. El texto largo reutiliza
el cuerpo de cada hub de copys_hubs.py. Bali solo lleva Infografía y Tres
cosas: los otros dos nombran la cripto en el vídeo.

Genera COPYS-REELS-HUBS.md y reels_specs.txt (lo que se sube a Meta)."""
import json
import os
import sys

here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from copys_hubs import CIERRE, CUERPO, FILTRO  # noqa: E402

LUGAR = {'MIAMI': 'Miami', 'LATAM': 'Latinoamérica', 'DUBAI': 'Dubái', 'BALI': 'Bali'}
RECIBES = {'MIAMI': 'a ti te llegan dólares', 'LATAM': 'a ti te llega en euros o en dólares',
           'DUBAI': 'tú recibes euros o dólares', 'BALI': 'tú recibes euros o dólares'}
TERM = {'MIAMI': 'hub_miami_zona_latina', 'LATAM': 'hub_latam_similar_3_hernan',
        'DUBAI': 'hub_dubai_similar_3_hernan', 'BALI': 'hub_bali_similar_3_hernan'}

# Vídeo en Meta y portada (hash de la imagen subida).
VIDEO = {
    'COMO TE PAGO': '1144406804907639',
    'VENTAS QUE PIERDES': '1660427218758817',
    'INFOGRAFIA': '3788426637986683',
    'TRES COSAS': '1800700554573711',
}
PORTADA = json.load(open(os.path.join(here, 'reels_portadas.json'), encoding='utf-8'))

HUBS = {'MIAMI': list(VIDEO), 'LATAM': list(VIDEO), 'DUBAI': list(VIDEO),
        'BALI': ['TRES COSAS', 'INFOGRAFIA']}


def piezas(hub):
    lugar, recibes = LUGAR[hub], RECIBES[hub]
    return {
        'COMO TE PAGO': dict(
            gancho=(f"«¿Y cómo te pago?» Si vendes cursos desde {lugar}, esa pregunta te está "
                    "costando ventas. Cada vez que un cliente tiene que preguntártela, la compra "
                    "ya está a punto de caerse."),
            corto=(f"Si vendes cursos desde {lugar}, cada «¿y cómo te pago?» es una venta que se "
                   "puede caer.\n\nCon tu enlace de Kunfupay tu cliente paga en el momento, con lo "
                   f"que usa en su país, sin preguntarte nada. Y {recibes}.\n\n"
                   "Haz clic y descubre cómo."),
            t1="«¿Cómo te pago?» te cuesta ventas",
            t2="Que nadie vuelva a preguntártelo"),
        'VENTAS QUE PIERDES': dict(
            gancho=(f"Hay ventas que pierdes sin darte cuenta. Si vendes cursos desde {lugar} y "
                    "cobras solo con tarjeta, pueden ser hasta un 27 % de tu facturación."),
            corto=(f"Si vendes cursos desde {lugar}, hay ventas que pierdes sin verlas: hasta un "
                   "27 % se cae justo en el pago.\n\nNo es que no quieran comprarte. Es que no "
                   f"pueden pagarte.\n\nCon tu enlace de Kunfupay te pagan todos. Y {recibes}.\n\n"
                   "Haz clic y descubre cómo."),
            t1="Hasta un 27 % se cae en el pago",
            t2="Deja de perder ventas sin verlas"),
        'INFOGRAFIA': dict(
            gancho=(f"Mira en 30 segundos cómo cobras con Kunfupay desde {lugar}: creas un enlace, "
                    f"cada cliente paga con lo que usa en su país y {recibes}."),
            corto=(f"Si vendes cursos desde {lugar}, así de simple:\n\n1. Creas tu enlace de pago.\n"
                   "2. Tu cliente paga con lo que usa en su país.\n"
                   f"3. Y {recibes}.\n\nHaz clic y descubre cómo."),
            t1="Un enlace y te pagan todos",
            t2="Así cobras a cualquier país"),
        'TRES COSAS': dict(
            gancho=(f"Si vendes cursos desde {lugar} a clientes de varios países, hay tres cosas "
                    "que ya no necesitas para cobrarles. Te las cuento en el vídeo."),
            corto=(f"Si vendes cursos desde {lugar} a clientes de varios países, hay tres cosas "
                   "que ya no necesitas para cobrarles.\n\nCon un solo enlace de Kunfupay, cada "
                   f"cliente paga como paga en su país. Y {recibes}.\n\n"
                   "Haz clic y descubre cómo."),
            t1="Tres cosas que ya no necesitas",
            t2="Hasta un 30 % más, cobrando mejor"),
    }


FEATS = ["pac_relaxation", "image_touchups", "text_optimizations", "image_brightness_and_contrast",
         "enhance_cta", "image_animation", "adapt_to_placement", "image_uncrop", "inline_comment",
         "description_automation", "add_text_overlay", "image_templates", "site_extensions",
         "media_type_automation", "multi_photo_to_video", "reveal_details_over_time", "show_summary",
         "profile_card", "creative_stickers", "replace_media_text", "image_background_gen",
         "text_translation", "show_destination_blurbs"]

md = ["# Copys de los reels · HUBS / METODOS DE PAGO", "",
      "Cada anuncio lleva los 2 textos y los 2 títulos como opciones en todas las ubicaciones.", ""]
specs = []
for hub, tipos in HUBS.items():
    P = piezas(hub)
    md += [f"## {hub}", ""]
    for tipo in tipos:
        c = P[tipo]
        name = f'REEL / {tipo} / {hub}'
        largo = c['gancho'] + "\n\n" + CUERPO[hub] + "\n\n" + FILTRO + "\n\n" + CIERRE
        slug = tipo.lower().replace(' ', '_') + '_' + hub.lower()
        url = ("https://kunfupay.com/landings/pagos-globales-es/v1?utm_source=instagram"
               "&utm_medium=paid_social&utm_campaign=hubs_metodos_de_pago_kunfupay"
               f"&utm_term={TERM[hub]}&utm_content=reel_{slug}&utm_source_platform=meta"
               "&utm_creative_format=video&utm_marketing_tactic=prospecting")
        p = 'r' + slug.replace('_', '')[:24]
        spec = {
            "object_story_spec": {"page_id": "596973030161591", "instagram_user_id": "17841473965301923"},
            "degrees_of_freedom_spec": {"creative_features_spec": {k: {"enroll_status": "OPT_OUT"} for k in FEATS}},
            "asset_feed_spec": {
                "videos": [{"video_id": VIDEO[tipo], "thumbnail_hash": PORTADA[tipo], "adlabels": [{"name": p + "_v"}]}],
                "bodies": [{"text": largo, "adlabels": [{"name": p + "_b"}]},
                           {"text": c['corto'], "adlabels": [{"name": p + "_b"}]}],
                "titles": [{"text": c['t1'], "adlabels": [{"name": p + "_t"}]},
                           {"text": c['t2'], "adlabels": [{"name": p + "_t"}]}],
                "link_urls": [{"website_url": url, "display_url": "kunfupay.com"}],
                "call_to_action_types": ["SIGN_UP"], "ad_formats": ["SINGLE_VIDEO"],
                "asset_customization_rules": [
                    {"customization_spec": {"publisher_platforms": ["instagram"], "instagram_positions": ["stream"]},
                     "video_label": {"name": p + "_v"}, "body_label": {"name": p + "_b"},
                     "title_label": {"name": p + "_t"}, "priority": 1},
                    {"customization_spec": {"publisher_platforms": ["instagram"], "instagram_positions": ["story", "reels"]},
                     "video_label": {"name": p + "_v"}, "body_label": {"name": p + "_b"},
                     "title_label": {"name": p + "_t"}, "priority": 2}],
                "optimization_type": "PLACEMENT"},
            "contextual_multi_ads": {"enroll_status": "OPT_OUT"}}
        specs += ['### ' + name, json.dumps(spec, ensure_ascii=False, separators=(',', ':'))]
        md += [f"### {name}", "", f"**Título 1:** {c['t1']}  ", f"**Título 2:** {c['t2']}", "",
               "**Texto largo**", "", largo, "", "**Texto corto**", "", c['corto'], "", f"**URL:** {url}", ""]

open(os.path.join(here, 'reels_specs.txt'), 'w', encoding='utf-8').write('\n'.join(specs) + '\n')
open(os.path.join(here, '..', 'COPYS-REELS-HUBS.md'), 'w', encoding='utf-8').write('\n'.join(md))
