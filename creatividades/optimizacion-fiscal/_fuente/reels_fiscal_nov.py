"""Copys y specs de 4 reels para OPTIMIZACION FISCAL / AUD HERNAN 3% / LANDING / ESP
(campaña TESTEO / ES / ADQUISICION KUNFUPAY), solo en Instagram.

Cada anuncio lleva 2 textos (largo y corto) y 2 títulos como opciones. Sigue la regla
de GUIONES-CUERPOS-MODULARES.md: no se promete «ahorrar impuestos»; se dice que los
impuestos de cada venta ya no son tuyos y que la renta sigue siendo tuya.

Genera ../COPYS-REELS-FISCAL-NOV.md y reels_fiscal_nov_specs.txt."""
import json
import os

here = os.path.dirname(os.path.abspath(__file__))

UTM = ("https://kunfupay.com/landings/fiscal/v1?utm_source=instagram&utm_medium=paid_social"
       "&utm_campaign=testeo_es_adquisicion_kunfupay&utm_id=120247895823300648"
       "&utm_term=optimizacion_fiscal_esp&utm_content={content}&utm_source_platform=meta"
       "&utm_creative_format=video&utm_marketing_tactic=prospecting")

AVISO = ("Kunfupay es una empresa de tecnología financiera, no un banco. Las cuentas y tarjetas "
         "las prestan partners financieros con licencia.")
RENTA = "Tu renta, eso sí, sigue siendo tuya. Lo que pagas por lo que ganas no cambia."
MOR = ("Kunfupay es la única pasarela de España que funciona como Merchant of Record. Es decir: "
       "somos tus representantes en cada venta.")
COMO = ("Le cobras a tu alumno con Kunfupay, igual que con Stripe.\n"
        "PERO la factura se la hacemos nosotros.\n"
        "Y los impuestos de esa venta son cosa nuestra.")

ANUNCIOS = [
    dict(
        nombre='REEL / JORGE GPT / FISCAL', content='reel_jorge_gpt_fiscal',
        video='1784762722578877', portada='46115f2ea353eb55dad67d26401c2e07',
        textos=[
            "Le pregunté a ChatGPT: «Si vendo un producto digital y tengo clientes en varios "
            "países, ¿tengo que gestionar los impuestos de cada venta en cada país?». Su "
            "respuesta: «Utiliza un Merchant of Record».\n\n"
            "Te explico por qué.\n\n"
            "Si cobras con Stripe o PayPal, la venta es tuya. Y con ella, el IVA de cada país "
            "donde tengas un alumno: Alemania, Francia, Italia… Registros, OSS, declaraciones. "
            "Todo para ti.\n\n"
            "Con un Merchant of Record cambia una cosa: de quién es la venta.\n\n"
            + MOR + "\n"
            "✓ Calculamos el IVA de cada venta.\n"
            "✓ Lo cobramos.\n"
            "✓ Lo declaramos.\n"
            "✓ Y lo liquidamos.\n"
            "En nuestro nombre. Tú recibes tus ganancias netas.\n\n"
            "Para ti, el día a día es igual que con Stripe: le cobras a tu alumno con tu enlace "
            "de Kunfupay. Y te olvidas del IVA de cada venta y del estrés de gestionarlo.\n\n"
            + RENTA + "\n\n"
            "Para quién es:\n"
            "✓ Ya vendes cursos, mentorías, membresías o comunidades online.\n"
            "✓ Tienes alumnos en más de un país.\n"
            "✕ Si vendes productos físicos o todavía no vendes, no es para ti.\n\n"
            "Entra y mira si tu negocio encaja.\n\n" + AVISO,

            "Le pregunté a ChatGPT qué hacer con el IVA de cada país cuando vendes cursos "
            "online. Respuesta: «Utiliza un Merchant of Record».\n\n"
            "Kunfupay es la única pasarela de España que funciona como Merchant of Record: "
            "calculamos, cobramos, declaramos y liquidamos el IVA de tus ventas. Tú recibes tus "
            "ganancias netas.\n\n"
            "Entra y mira si tu negocio encaja.",
        ],
        titulos=["Se lo pregunté a ChatGPT", "El IVA de cada venta ya no es tuyo"]),
    dict(
        nombre='REEL / BENJA 30 % MOR / FISCAL', content='reel_benja_30_mor_fiscal',
        video='1650970433373619', portada='3997dde73b2e4404c3e9623240314dc1',
        textos=[
            "¿Eres autónomo y vendes cursos, mentorías o comunidades online? Entonces esto te "
            "interesa.\n\n"
            "Te lo explico como en una pizarra.\n\n"
            "Hoy, cuando vendes, la venta es tuya. La factura de cada alumno, tuya. Los "
            "impuestos de esa venta, tuyos. Y cada trimestre, el miedo de haberte equivocado.\n\n"
            + MOR + "\n\n"
            "Tú le cobras a tu alumno con Kunfupay, igual que con Stripe, esté donde esté tu "
            "cliente.\n"
            "PERO la factura se la hacemos nosotros.\n"
            "Y los impuestos de esa venta son cosa nuestra.\n\n"
            "Sin LLC. Sin mudarte. Sin asesor fuera.\n\n"
            + RENTA + "\n\n"
            "Antes que nada, para quién es:\n"
            "✓ Productos digitales: cursos, mentorías, membresías o comunidades online.\n"
            "✕ Productos físicos.\n"
            "✕ Negocios presenciales, como una peluquería.\n"
            "✕ Si todavía no vendes.\n\n"
            "Si cumples esos requisitos, entra y empieza a cobrar.\n\n" + AVISO,

            "¿Eres autónomo y vendes productos digitales?\n\n"
            "Kunfupay es la única pasarela de España que funciona como Merchant of Record: la "
            "factura de cada venta la hacemos nosotros y los impuestos de esa venta son cosa "
            "nuestra.\n\n"
            "Solo para productos digitales. Entra y mira si tu negocio encaja.",
        ],
        titulos=["¿Eres autónomo y vendes online?", "Tus representantes en cada venta"]),
    dict(
        nombre='REEL / RUBEN AHORRO IMP / FISCAL', content='reel_ruben_ahorro_imp_fiscal',
        video='5528848950672842', portada='60b9a1aa2a474c3d707f4131448a08b9',
        textos=[
            "¿Eres infoproductor en España y te has planteado montar una LLC o mudarte a Dubái "
            "o Andorra?\n\n"
            "Antes de hacer las maletas, mira esto.\n\n"
            "Lo que buscas con todo eso, en realidad, es dejar de cargar con la factura y los "
            "impuestos de cada venta. Y para eso no hace falta irse.\n\n"
            "Con Kunfupay vendes tus servicios digitales desde España, sin mudarte:\n"
            + COMO + "\n\n"
            "Podemos porque somos la única pasarela de España que funciona como Merchant of "
            "Record. Es decir: somos tus representantes en cada venta.\n\n"
            "Te ahorras la LLC, su renovación, su asesor y su papeleo. Y te quedas en tu casa, "
            "con tu gente.\n\n"
            + RENTA + "\n\n"
            "Ojo: solo sirve si vendes un servicio o producto digital (cursos, mentorías, "
            "membresías o comunidades). Si vendes productos físicos o todavía no vendes, no es "
            "para ti.\n\n"
            "Entra y mira si tu negocio encaja.\n\n" + AVISO,

            "¿Pensando en una LLC o en mudarte a Andorra?\n\n"
            "Con Kunfupay vendes tus servicios digitales desde España: la factura de cada venta "
            "la hacemos nosotros y los impuestos de esa venta son cosa nuestra.\n\n"
            "Solo para servicios digitales. Entra y mira si tu negocio encaja.",
        ],
        titulos=["Sin LLC y sin mudarte a Andorra", "Vende desde España, sin maletas"]),
    dict(
        nombre='REEL / RUBEN PRODUCTO / FISCAL', content='reel_ruben_producto_fiscal',
        video='1533899771844688', portada='45facc9427ce5e118b38cbb6433bfcf6',
        textos=[
            "Si eres infoproductor en España, seguro que esto te suena: el IVA de cada venta, "
            "la factura de cada alumno, el IRPF y la sensación de que cada trimestre se complica "
            "más.\n\n"
            "Y seguro que conoces a alguien que, por eso, se montó una LLC o se mudó fuera.\n\n"
            "Lo que quizá no sabías: hay otra forma, sin irte de España.\n\n"
            + MOR + "\n"
            + COMO + " Tú te olvidas del IVA de cada venta.\n\n"
            "Sin LLC. Sin mudarte. Sin asesor fuera.\n\n"
            + RENTA + "\n\n"
            "Para quién es:\n"
            "✓ Ya vendes cursos, mentorías, membresías o comunidades online desde España.\n"
            "✕ Si vendes productos físicos o todavía no vendes, no es para ti.\n\n"
            "Cada día más infoproductores cobran con Kunfupay. Entra y mira si tu negocio "
            "encaja.\n\n" + AVISO,

            "Infoproductor en España: el IVA de cada venta, la factura de cada alumno, el "
            "trimestre…\n\n"
            "Con Kunfupay, la factura la hacemos nosotros y los impuestos de cada venta son cosa "
            "nuestra. Sin LLC y sin mudarte.\n\n"
            "Entra y mira si tu negocio encaja.",
        ],
        titulos=["IVA, facturas, trimestres… ¿te suena?", "Sin LLC y sin irte de España"]),
]

FEATS = ["pac_relaxation", "image_touchups", "text_optimizations", "image_brightness_and_contrast",
         "enhance_cta", "image_animation", "adapt_to_placement", "image_uncrop", "inline_comment",
         "description_automation", "add_text_overlay", "image_templates", "site_extensions",
         "media_type_automation", "multi_photo_to_video", "reveal_details_over_time", "show_summary",
         "profile_card", "creative_stickers", "replace_media_text", "image_background_gen",
         "text_translation", "show_destination_blurbs"]
# Solo Instagram (el conjunto también queda solo en Instagram). Meta pide al menos 2 reglas;
# las dos usan los mismos textos y títulos, así salen como opciones en todas.
REGLAS = [["stream", "explore_home", "profile_feed", "ig_search"], ["story", "reels"]]

md = ["# Copys · 4 reels de optimización fiscal (noviembre)", "",
      "Conjunto: OPTIMIZACION FISCAL / AUD HERNAN 3% / LANDING / ESP, solo Instagram. "
      "Cada anuncio lleva 2 textos y 2 títulos como opciones.", ""]
specs = []
for a in ANUNCIOS:
    assert len(a['textos']) == 2 and len(a['titulos']) == 2
    url = UTM.format(content=a['content'])
    p = 'fi' + a['content'].replace('_', '')[:24]
    spec = {
        "object_story_spec": {"page_id": "596973030161591", "instagram_user_id": "17841473965301923"},
        "degrees_of_freedom_spec": {"creative_features_spec": {k: {"enroll_status": "OPT_OUT"} for k in FEATS}},
        "asset_feed_spec": {
            "videos": [{"video_id": a['video'], "thumbnail_hash": a['portada'], "adlabels": [{"name": p + "_v"}]}],
            "bodies": [{"text": t, "adlabels": [{"name": p + "_b"}]} for t in a['textos']],
            "titles": [{"text": t, "adlabels": [{"name": p + "_t"}]} for t in a['titulos']],
            "link_urls": [{"website_url": url, "display_url": "kunfupay.com"}],
            "call_to_action_types": ["SEE_DETAILS"],
            "ad_formats": ["SINGLE_VIDEO"],
            "asset_customization_rules": [
                {"customization_spec": {"publisher_platforms": ["instagram"], "instagram_positions": pos},
                 "video_label": {"name": p + "_v"}, "body_label": {"name": p + "_b"},
                 "title_label": {"name": p + "_t"}, "priority": i}
                for i, pos in enumerate(REGLAS, 1)],
            "optimization_type": "PLACEMENT"},
        "contextual_multi_ads": {"enroll_status": "OPT_OUT"}}
    specs += ['### ' + a['nombre'], json.dumps(spec, ensure_ascii=False, separators=(',', ':'))]
    md += [f"## {a['nombre']}", "", f"**URL:** {url}", "",
           f"**Título 1:** {a['titulos'][0]}  ", f"**Título 2:** {a['titulos'][1]}", ""]
    for i, t in enumerate(a['textos'], 1):
        md += [f"**Texto {i}** ({len(t)} caracteres)", "", t, ""]

open(os.path.join(here, 'reels_fiscal_nov_specs.txt'), 'w', encoding='utf-8').write('\n'.join(specs) + '\n')
open(os.path.join(here, '..', 'COPYS-REELS-FISCAL-NOV.md'), 'w', encoding='utf-8').write('\n'.join(md))
