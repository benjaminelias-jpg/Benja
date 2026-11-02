"""Copys y specs de dos reels de Classroom Platinum para el conjunto
AUD HERNAN CLASSROOM PLATINIUM / UGC FOUNDER.

Cada anuncio lleva 5 textos (de muy largo a muy corto) y 5 títulos cortos y
distintos, como opciones de texto. Genera ../COPYS-REELS-VC-INVERSION.md y
reels_vc_inversion_specs.txt (lo que se sube a Meta)."""
import json
import os

here = os.path.dirname(os.path.abspath(__file__))

UTM = ("https://kunfupay.com/landings/classroom-platinum?paso=1&utm_source=instagram"
       "&utm_medium=paid_social&utm_campaign=v2_classroom_platinum_landing_page"
       "&utm_id=120248438455130648&utm_term=aud_hernan_classroom_platinium_ugc_founder"
       "&utm_content={content}&utm_source_platform=meta&utm_creative_format=video"
       "&utm_marketing_tactic=prospecting")

ANUNCIOS = [
    dict(
        nombre='REEL / VC MONEY / CRISTIAN', content='reel_vc_money_cristian',
        video='1701796134846772', portada='c82af370bee315e70519f2a3f002a13b',
        textos=[
            "¿Cómo sería tu negocio si tuvieras presupuesto ilimitado para anuncios?\n\n"
            "Piénsalo un segundo.\n\n"
            "Podrías abrir mercado en España, en Colombia, en México. Podrías lanzar cuando "
            "quisieras, sin mirar cuánto te queda en la cuenta. Podrías dejar de hacerlo todo tú "
            "y centrarte en lo único que de verdad mueve tu negocio: vender.\n\n"
            "Eso es Classroom Platinum.\n\n"
            "Así funciona:\n"
            "→ Nosotros ponemos el presupuesto para anuncios. Cuando tu oferta demuestra que vende, "
            "invertimos nuestro dinero en tus campañas.\n"
            "→ Nosotros ponemos la plataforma: tu comunidad o tu curso en Classroom y la pasarela "
            "de Kunfupay para cobrar a alumnos de cualquier país.\n"
            "→ Nosotros ponemos el equipo: estrategia, contenido y creatividades trabajando en tu "
            "negocio.\n"
            "→ Tú pones tu conocimiento y tu curso.\n\n"
            "No adelantas dinero. Ganamos una comisión por cada venta. Si tú ganas, ganamos "
            "nosotros. Si tú no ganas, nosotros tampoco.\n\n"
            "Te soy claro sobre para quién es:\n"
            "✅ Ya tienes un curso, una comunidad, un coaching o un producto digital.\n"
            "✅ Ya vendes y facturas más de 3.000 € al mes.\n"
            "✅ Quieres crecer sin hacerlo todo solo.\n\n"
            "Si todavía estás pensando en crear tu curso, esto aún no es para ti. Primero valida "
            "que vende. Después hablamos.\n\n"
            "Son solo 100 plazas. Y no entra todo el mundo: revisamos cada negocio uno por uno. "
            "Si hacemos match, empezamos a trabajar juntos.\n\n"
            "Aplica en 2 minutos y mira si tu negocio califica.",

            "Imagina tener presupuesto ilimitado para anuncios.\n\n"
            "Abrir España, Colombia o México. Lanzar cuando quieras. Y dedicarte solo a vender.\n\n"
            "Eso es Classroom Platinum, el programa de inversión de Kunfupay:\n"
            "→ Ponemos el presupuesto para anuncios cuando tu oferta demuestra que vende.\n"
            "→ Ponemos la plataforma: Classroom y la pasarela de Kunfupay.\n"
            "→ Ponemos el equipo de marketing.\n"
            "→ Tú pones tu conocimiento y tu curso.\n\n"
            "No adelantas dinero: ganamos una comisión por venta. Solo nos va bien si a ti te "
            "va bien.\n\n"
            "Es para creadores que ya facturan más de 3.000 € al mes. Si todavía no vendes, aún "
            "no es para ti.\n\n"
            "Son 100 plazas. Aplica y mira si tu negocio califica.",

            "¿Y si el presupuesto para anuncios dejara de ser tu límite?\n\n"
            "Con Classroom Platinum, nosotros ponemos el dinero para tus campañas, la plataforma "
            "y el equipo. Tú pones tu curso.\n\n"
            "Sin adelantar dinero: ganamos una comisión por venta.\n\n"
            "Para creadores que ya facturan más de 3.000 € al mes. Solo 100 plazas.\n\n"
            "Aplica en 2 minutos.",

            "Tú pones tu curso. Nosotros, el presupuesto para anuncios, la plataforma y el "
            "equipo.\n\n"
            "Si ganas tú, ganamos nosotros.\n\n"
            "Para creadores que ya facturan +3.000 €/mes. Solo 100 plazas. Aplica ahora.",

            "Presupuesto para anuncios, plataforma y equipo: lo ponemos nosotros. Solo 100 "
            "plazas. Aplica.",
        ],
        titulos=[
            "Presupuesto ilimitado para tu curso",
            "Solo 100 plazas",
            "Tú pones el curso, nosotros el dinero",
            "Si ganas tú, ganamos nosotros",
            "¿Facturas +3.000 €/mes?",
        ]),
    dict(
        nombre='REEL / INVERSION / RUBEN', content='reel_inversion_ruben',
        video='2648475552273767', portada='bb2109e5eeebf4d2423f5349de432ec7',
        textos=[
            "Kunfupay invierte más de 1.000.000 € al año en creadores. Y ahora buscamos a los "
            "siguientes.\n\n"
            "Te cuento cómo funciona, porque no es para todo el mundo.\n\n"
            "Invertimos en creadores, coaches e influencers que ya han demostrado algo muy "
            "concreto: que tienen un infoproducto que su audiencia compra. No una idea. No un "
            "curso a medio grabar. Algo que ya vende.\n\n"
            "Y lógicamente, ese dinero no se lo damos a cualquiera. Por eso pedimos que cada "
            "creador demuestre primero que su oferta funciona.\n\n"
            "¿Qué ponemos nosotros?\n"
            "→ Presupuesto para anuncios cuando tu oferta demuestra que vende.\n"
            "→ Un equipo de estrategia, contenido y creatividades trabajando en tu negocio.\n"
            "→ La tecnología: tu comunidad o tu curso en Classroom y la pasarela de Kunfupay para "
            "cobrar a alumnos de todo el mundo.\n\n"
            "¿Y tú? Tu conocimiento, tu marca y tu audiencia.\n\n"
            "No adelantas dinero. Ganamos una comisión por venta, así que solo nos va bien si a "
            "ti te va bien.\n\n"
            "¿Por qué lo hacemos? Porque cuando un creador como tú se une a Kunfupay, crece. Y "
            "cuando crece, atrae a más creadores como él.\n\n"
            "Los requisitos:\n"
            "✅ Comunidad fuerte en redes.\n"
            "✅ Eres educador o coach.\n"
            "✅ Tienes un infoproducto que ya vendes (más de 3.000 € al mes).\n\n"
            "Si todavía no vendes, esto aún no es para ti.\n\n"
            "La convocatoria está abierta durante los próximos 3 meses.\n\n"
            "Aplica ahora y mira si tu negocio califica.",

            "Kunfupay invierte más de 1.000.000 € al año en creadores.\n\n"
            "Buscamos educadores y coaches que ya tienen un infoproducto que su audiencia "
            "compra. Ponemos el presupuesto para anuncios, el equipo de marketing y la tecnología "
            "para cobrar en todo el mundo. Tú pones tu conocimiento y tu marca.\n\n"
            "No adelantas dinero: ganamos una comisión por venta.\n\n"
            "Requisitos:\n"
            "✅ Comunidad fuerte en redes.\n"
            "✅ Educador o coach.\n"
            "✅ Infoproducto que ya vendes.\n\n"
            "La convocatoria está abierta solo los próximos 3 meses. Aplica y mira si calificas.",

            "¿Ya vendes tu curso y tienes una comunidad fuerte en redes?\n\n"
            "Kunfupay invierte en creadores como tú: presupuesto para anuncios, equipo y "
            "tecnología. Tú pones tu conocimiento.\n\n"
            "Sin adelantar dinero. Solo durante los próximos 3 meses.\n\n"
            "Aplica y mira si calificas.",

            "Invertimos en creadores que ya venden. Presupuesto, equipo y tecnología. Sin "
            "adelantar dinero.\n\n"
            "Abierto solo 3 meses. Aplica ahora.",

            "Kunfupay invierte en tu curso. Mira los requisitos y aplica.",
        ],
        titulos=[
            "+1.000.000 € al año en creadores",
            "Mira los requisitos",
            "Invertimos en tu infoproducto",
            "Abierto solo 3 meses",
            "¿Educador o coach que ya vende?",
        ]),
]

FEATS = ["pac_relaxation", "image_touchups", "text_optimizations", "image_brightness_and_contrast",
         "enhance_cta", "image_animation", "adapt_to_placement", "image_uncrop", "inline_comment",
         "description_automation", "add_text_overlay", "image_templates", "site_extensions",
         "media_type_automation", "multi_photo_to_video", "reveal_details_over_time", "show_summary",
         "profile_card", "creative_stickers", "replace_media_text", "image_background_gen",
         "text_translation", "show_destination_blurbs"]

md = ["# Copys · reels de Classroom Platinum (VC MONEY e INVERSION)", "",
      "Conjunto: AUD HERNAN CLASSROOM PLATINIUM / UGC FOUNDER. Cada anuncio lleva 5 textos "
      "y 5 títulos como opciones.", ""]
specs = []
for a in ANUNCIOS:
    assert len(a['textos']) == 5 and len(a['titulos']) == 5
    largos = [len(t) for t in a['textos']]
    assert largos == sorted(largos, reverse=True), (a['nombre'], largos)
    url = UTM.format(content=a['content'])
    p = 'cp' + a['content'].replace('_', '')[:24]
    spec = {
        "object_story_spec": {"page_id": "596973030161591", "instagram_user_id": "17841473965301923"},
        "degrees_of_freedom_spec": {"creative_features_spec": {k: {"enroll_status": "OPT_OUT"} for k in FEATS}},
        "asset_feed_spec": {
            "videos": [{"video_id": a['video'], "thumbnail_hash": a['portada'], "adlabels": [{"name": p + "_v"}]}],
            "bodies": [{"text": t, "adlabels": [{"name": p + "_b"}]} for t in a['textos']],
            "titles": [{"text": t, "adlabels": [{"name": p + "_t"}]} for t in a['titulos']],
            "link_urls": [{"website_url": url, "display_url": "www.classroom.kunfupay.com"}],
            "call_to_action_types": ["SEE_DETAILS"],
            "ad_formats": ["SINGLE_VIDEO"],
            # Meta exige al menos 2 reglas: Instagram y el resto. Las dos usan los mismos
            # 5 textos y 5 títulos, así salen como opciones en todas las ubicaciones
            # (el conjunto usa ubicaciones automáticas).
            "asset_customization_rules": [
                {"customization_spec": {"publisher_platforms": plat},
                 "video_label": {"name": p + "_v"}, "body_label": {"name": p + "_b"},
                 "title_label": {"name": p + "_t"}, "priority": i}
                for i, plat in enumerate([["instagram"], ["facebook", "audience_network", "threads"]], 1)],
            "optimization_type": "PLACEMENT"},
        "contextual_multi_ads": {"enroll_status": "OPT_OUT"}}
    specs += ['### ' + a['nombre'], json.dumps(spec, ensure_ascii=False, separators=(',', ':'))]
    md += [f"## {a['nombre']}", "", f"**URL:** {url}", "", "**Títulos**", ""]
    md += [f"{i}. {t}" for i, t in enumerate(a['titulos'], 1)] + [""]
    for i, t in enumerate(a['textos'], 1):
        md += [f"**Texto {i}** ({len(t)} caracteres)", "", t, ""]

open(os.path.join(here, 'reels_vc_inversion_specs.txt'), 'w', encoding='utf-8').write('\n'.join(specs) + '\n')
open(os.path.join(here, '..', 'COPYS-REELS-VC-INVERSION.md'), 'w', encoding='utf-8').write('\n'.join(md))
