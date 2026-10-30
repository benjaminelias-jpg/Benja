import json
C = json.load(open('copys_hubs.json', encoding='utf-8'))
H = {  # (feed, stories)
 'MIAMI':{'TWEET':('5455cba43ea26808186855bb723dc2c1','ea0ca2fadbd31609319d03bd36c8b4db'),'COMPARATIVA':('8385ed03911a32c552336f269d1ba2d0','5a894e7b24218b81a812d2ca94a5605d'),'PAGINA DE PAGO':('053aa17690c79a0597895cef8b8959c5','23f974e2ed1409c297c4cc70e3820349'),'DESEO':('5d4c94faac50c8b5b85b256b4f12b0c2','dd8c6eb082771f5687565f85e250eedf'),'NOTICIA':('64c5f83a71592bb803ab2409f050d2c7','6357a0820211a6779262b7db8d7d66d7')},
 'LATAM':{'TWEET':('def3c87e1e1e2f785a16ade4bcb4455a','409a792bc88ecafd427e7c8a2b88e1c4'),'COMPARATIVA':('f4dc4545f8d7058d8246bc64aabb1965','1fa92eba874c60eb3adad954c2e30e1d'),'PAGINA DE PAGO':('724be115a6747cfb1c6b686a8191035f','95a979365d7b256f6aa11a0d58380047'),'DESEO':('1591e14301422b9e3215f1a110fde338','a3a205de66beb772d114884bbc91fc7d'),'NOTICIA':('4eb5fcf0fec973bde830dea4af1b034c','5ed06d6fc9113bfbafb39c11b6675622')},
 'DUBAI':{'TWEET':('90035e7e9abc6d22ca180fd56c39b36b','85254ad8554e1c05c900a0e1d2862a06'),'COMPARATIVA':('f99e5343708bf3d9402772a081162313','4e4906adc4cdc96b8366887ecebef43b'),'PAGINA DE PAGO':('2c3b5eef06b96868f41cc83ad71406cc','5c73c6bb19e5b03ffd93c1f4166a28f1'),'DESEO':('156410ddb04864c0a1c6566bc9e34c21','39d73a4ed2b64010eebc1d9c3c87b19a'),'NOTICIA':('814ff1684cea70eb9139577af8f6ef81','f649e352c38f37e78b92e11891b2d44c')},
 'BALI':{'TWEET':('b3a5bcbc702c08afc48f3bf544b048c9','dc0859774e8b745c4c3cbad3d1df3a07'),'COMPARATIVA':('843b7badbcbbbff4795d279320f9541a','d8724458ee2643a266b16d30b316eb44'),'PAGINA DE PAGO':('f543d724f136008d16f70361f89bfed0',None),'DESEO':('7f23be5318196117885dcd54ef42a34e','a535e8886326c747641f1f4466f7d612'),'NOTICIA':('8b13d01afe35841f0fa209746d16b11d','0f5f8db9de84ced7690c47f6b04b5d5a')},
}
TERM = {'MIAMI':'hub_miami_zona_latina','LATAM':'hub_latam_similar_3_hernan','DUBAI':'hub_dubai_similar_3_hernan','BALI':'hub_bali_similar_3_hernan'}
FEATS = ["pac_relaxation","image_touchups","text_optimizations","image_brightness_and_contrast","enhance_cta","image_animation","adapt_to_placement","image_uncrop","inline_comment","description_automation","add_text_overlay","image_templates","site_extensions","media_type_automation","multi_photo_to_video","reveal_details_over_time","show_summary","profile_card","creative_stickers","replace_media_text","image_background_gen","text_translation","show_destination_blurbs"]
for hub, piezas in H.items():
  for tipo, (f, s) in piezas.items():
    name = f'ESTATICA / {tipo} / {hub}'
    c = C[name]
    slug = tipo.lower().replace(' ', '_') + '_' + hub.lower()
    url = ("https://kunfupay.com/landings/pagos-globales-es/v1?utm_source=instagram&utm_medium=paid_social&utm_campaign=hubs_metodos_de_pago_kunfupay"
           f"&utm_term={TERM[hub]}&utm_content=estatica_{slug}&utm_source_platform=meta&utm_creative_format=image&utm_marketing_tactic=prospecting")
    p = 'h' + slug[:20].replace('_','')
    imgs = [{"hash": f, "adlabels": [{"name": p+"_f"}]}]
    if s: imgs.append({"hash": s, "adlabels": [{"name": p+"_s"}]})
    spec = {"object_story_spec":{"page_id":"596973030161591","instagram_user_id":"17841473965301923"},
      "degrees_of_freedom_spec":{"creative_features_spec":{k:{"enroll_status":"OPT_OUT"} for k in FEATS}},
      "asset_feed_spec":{"images":imgs,
        "bodies":[{"text":c['largo'],"adlabels":[{"name":p+"_l"}]},{"text":c['corto'],"adlabels":[{"name":p+"_c"}]}],
        "titles":[{"text":c['t1'],"adlabels":[{"name":p+"_t1"}]},{"text":c['t2'],"adlabels":[{"name":p+"_t2"}]}],
        "link_urls":[{"website_url":url,"display_url":"kunfupay.com"}],
        "call_to_action_types":["SIGN_UP"],"ad_formats":["SINGLE_IMAGE"],
        "asset_customization_rules":[
          {"customization_spec":{"publisher_platforms":["instagram"],"instagram_positions":["stream"]},"image_label":{"name":p+"_f"},"body_label":{"name":p+"_l"},"title_label":{"name":p+"_t1"},"priority":1},
          {"customization_spec":{"publisher_platforms":["instagram"],"instagram_positions":["story","reels"]},"image_label":{"name":p+("_s" if s else "_f")},"body_label":{"name":p+"_c"},"title_label":{"name":p+"_t2"},"priority":2}],
        "optimization_type":"PLACEMENT"},
      "contextual_multi_ads":{"enroll_status":"OPT_OUT"}}
    print('###', name)
    print(json.dumps(spec, ensure_ascii=False, separators=(',',':')))
