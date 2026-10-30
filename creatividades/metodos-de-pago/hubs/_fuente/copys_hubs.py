"""Copys de los 20 anuncios estáticos de la campaña HUBS / METODOS DE PAGO.

Cada anuncio: un texto LARGO (feed, de tú a tú, filtra) y uno CORTO
(stories y reels), y dos títulos. Genera COPYS-ANUNCIOS-HUBS.md y
copys_hubs.json (lo que se sube a Meta)."""
import json
import os

here = os.path.dirname(os.path.abspath(__file__))

CIERRE = ("Si todavía no vendes, esto no es para ti.\n\n"
          "Entra y mira si tu negocio encaja.\n\n"
          "Kunfupay es una empresa de tecnología financiera, no un banco. "
          "Las cuentas y tarjetas las prestan partners financieros con licencia.")

FILTRO = ("Esto es para ti si:\n"
          "✅ Ya vendes cursos, mentorías, comunidades o sesiones online.\n"
          "✅ Tienes clientes en más de un país (o los quieres tener).\n"
          "✅ Alguna vez alguien te dijo «quiero entrar, pero no puedo pagarte».")

# Cuerpo común de cada hub: dolor real, cómo funciona y a quién va.
CUERPO = {
    'LATAM': (
        "Te cuento algo que seguro te ha pasado.\n\n"
        "Alguien te escribe, le encanta lo que haces, le mandas el enlace de pago… y ahí se queda.\n"
        "No es que no quiera tu curso. Es que su tarjeta no pasa, no tiene tarjeta internacional "
        "o en su país se paga de otra forma.\n"
        "Al día siguiente ya se le pasó la emoción. Y esa venta no vuelve.\n\n"
        "Cuando cobras solo con tarjeta, hasta un 27 % de las ventas se cae justo en el pago. "
        "Y casi nunca te enteras, porque no te dicen «no pude pagar»: simplemente desaparecen.\n\n"
        "Con Kunfupay cambia una sola cosa: cómo te pagan.\n"
        "Creas tu enlace de pago y lo mandas como siempre.\n"
        "Tu alumno lo abre y le salen los métodos que usa en su país, en su moneda.\n"
        "Paga en el momento, sin escribirte para preguntar cómo.\n"
        "Y a ti te llega en euros o en dólares.\n\n"
        "No cambias lo que vendes. No haces otro lanzamiento. No persigues a nadie por WhatsApp.\n"
        "Solo dejas de perder a los que ya te querían comprar."),
    'MIAMI': (
        "Te lo digo de tú a tú, porque si vendes desde Miami esto te pasa más de lo que crees.\n\n"
        "Tu cliente de Colombia, de México o de Perú te escribe. Quiere entrar.\n"
        "Le mandas tu enlace de Stripe y llega el momento de pagar.\n"
        "Y no puede: no tiene tarjeta internacional, su banco la rechaza o allí se paga de otra forma.\n"
        "Te dice «mañana lo intento». Y mañana ya no está.\n\n"
        "Cobrar a LATAM solo con Stripe te puede costar hasta un 27 % de tu facturación. "
        "No porque no quieran comprarte. Porque no pueden pagarte.\n\n"
        "Con Kunfupay cambia una sola cosa: cómo te pagan.\n"
        "Le mandas tu enlace, como siempre.\n"
        "Tu cliente lo abre y le salen los métodos que usa en su país, en su moneda.\n"
        "Paga en el momento.\n"
        "Y a ti te llegan dólares.\n\n"
        "Mismo producto. Mismo precio. Más clientes de LATAM que por fin pueden pagarte."),
    'DUBAI': (
        "Te lo cuento como es, porque desde Dubái esto pasa todos los días.\n\n"
        "Por la mañana te escriben de España. Por la noche, de LATAM.\n"
        "Le mandas tu enlace de pago y a tu cliente le sale tarjeta… y poco más.\n"
        "Si no le sirve, no te paga. Te dice «luego lo miro». Y luego no vuelve.\n\n"
        "Con una pasarela de Emiratos puedes estar perdiendo hasta un 27 % de tus ventas. "
        "No es tu oferta. Es que tu cliente no encuentra cómo pagarte.\n\n"
        "Con Kunfupay cambia una sola cosa: cómo te pagan.\n"
        "Mandas un solo enlace, como siempre.\n"
        "Tu cliente de España paga como paga allí.\n"
        "Tu cliente de LATAM, como paga allí, en su moneda.\n"
        "Y tú recibes euros o dólares.\n\n"
        "Sigues vendiendo lo mismo, desde donde estás. Solo que ahora te pueden pagar todos."),
    'BALI': (
        "Te lo digo claro, porque desde Bali esto pasa mientras duermes.\n\n"
        "Tus clientes de España y LATAM te escriben cuando aquí es de madrugada.\n"
        "Quieren reservar tu sesión o entrar a tu curso.\n"
        "Pero tu enlace solo acepta tarjeta o PayPal, y no todos lo tienen.\n"
        "Te despiertas con chats sin contestar. Y a esa hora, la mitad ya se enfrió.\n\n"
        "Cobrando solo con Stripe o PayPal puedes estar perdiendo hasta un 27 % de tus ventas.\n\n"
        "Con Kunfupay cambia una sola cosa: cómo te pagan.\n"
        "Mandas un solo enlace.\n"
        "Cada cliente lo abre y paga con lo que usa en su país, en su moneda.\n"
        "Solo, sin escribirte, a la hora que sea.\n"
        "Y tú recibes euros o dólares.\n\n"
        "Tú duermes. Tus clientes pagan. Y por la mañana te despiertas con ventas cobradas."),
}

# Por pieza: gancho que abre el texto largo (debe casar con la imagen),
# texto corto y los dos títulos.
P = {}

P['MIAMI'] = {
    'TWEET': dict(
        gancho="Si vendes cursos desde Miami y cobras con Stripe, estás perdiendo hasta un 27 % de tu facturación. Y lo peor es que casi nunca lo ves.",
        corto="Si vendes cursos desde Miami y cobras con Stripe, pierdes hasta un 27 % de tu facturación.\n\nTus clientes de LATAM quieren comprarte. Y no pueden pagarte.\n\nPERO con tu enlace de Kunfupay, sí. Y a ti te llegan dólares.\n\nHaz clic y descubre cómo.",
        t1="Stripe te hace perder hasta un 27 %", t2="Que te pague todo LATAM"),
    'COMPARATIVA': dict(
        gancho="Pon lado a lado cómo cobras hoy con Stripe y cómo podrías cobrar. Mismos dólares para ti. Pero la diferencia en ventas es de hasta un 27 %.",
        corto="Si vendes cursos desde Miami, cobrar solo con Stripe te cuesta hasta un 27 % de tu facturación.\n\nCon Stripe solo te pagan los clientes de LATAM con tarjeta.\nCon tu enlace de Kunfupay te pagan todos. Y te llegan dólares.\n\nHaz clic y descubre cómo.",
        t1="Lo que te cuesta cobrar solo con Stripe", t2="Mismo enlace, más clientes"),
    'PAGINA DE PAGO': dict(
        gancho="Mira la imagen: eso es lo que ve tu cliente de LATAM cuando abre tu enlace de Kunfupay. Cada uno, con lo que usa en su país.",
        corto="Si vendes cursos desde Miami, ya no cobres a LATAM solo con Stripe.\n\nLe mandas tu enlace de Kunfupay.\nLo abre y paga con lo que usa en su país.\nY tú recibes dólares.\n\nHaz clic y descubre cómo.",
        t1="Así te paga cada cliente de LATAM", t2="Un enlace y tú recibes dólares"),
    'DESEO': dict(
        gancho="¿Y si pudieras facturar hasta un 30 % más desde Miami sin vender ni un curso más? Solo cambiando cómo cobras.",
        corto="Si vendes cursos desde Miami, podrías facturar hasta un 30 % más solo cambiando cómo cobras.\n\nTus clientes de LATAM ya quieren comprarte. Solo falta que puedan pagarte.\n\nCon tu enlace de Kunfupay, pueden. Y te llegan dólares.\n\nHaz clic y descubre cómo.",
        t1="Hasta un 30 % más desde Miami", t2="Cambia cómo cobras"),
    'NOTICIA': dict(
        gancho="Creadores en Miami ya aumentan su conversión un 27 % solo cambiando cómo cobran. No venden más: cobran mejor.",
        corto="Creadores en Miami ya aumentan su conversión un 27 % solo cambiando cómo cobran.\n\nNo venden más. Cobran mejor.\nCon un solo enlace, cada cliente paga como paga en su país.\nY ellos reciben dólares.\n\nHaz clic y descubre cómo.",
        t1="Un 27 % más de conversión", t2="No venden más, cobran mejor"),
}

P['LATAM'] = {
    'TWEET': dict(
        gancho="Si vendes cursos desde Latinoamérica y cobras solo con tarjeta, estás perdiendo hasta un 27 % de tus ventas. Y casi nunca te enteras.",
        corto="Si vendes cursos desde Latinoamérica, pierdes hasta un 27 % de tus ventas al cobrar.\n\nTu alumno de otro país quiere entrar. Llega al pago y no puede pagarte.\n\nPERO con tu enlace de Kunfupay te paga cualquiera. Y a ti te llega en euros o en dólares.\n\nHaz clic y descubre cómo.",
        t1="Pierdes hasta un 27 % al cobrar", t2="Que te pague cualquier alumno"),
    'COMPARATIVA': dict(
        gancho="Pon lado a lado cómo cobras hoy, solo con tarjeta, y cómo podrías cobrar. Vendes lo mismo. Pero cobras a muchos más alumnos.",
        corto="Si vendes cursos desde Latinoamérica y solo cobras con tarjeta, pierdes hasta un 27 % de tus ventas.\n\nNo es que no quieran comprarte. Es que no pueden pagarte.\n\nCon tu enlace de Kunfupay pagan todos. Un enlace. Euros o dólares para ti.\n\nHaz clic y descubre cómo.",
        t1="Vendes lo mismo, cobras a más alumnos", t2="Un enlace, pagan todos"),
    'PAGINA DE PAGO': dict(
        gancho="Mira la imagen: eso es lo que ve tu alumno cuando abre tu enlace de Kunfupay. El de España con sus métodos, el de LATAM con los suyos.",
        corto="Si vendes cursos desde LATAM, ya no cobres a España y LATAM solo con tarjeta.\n\nMandas un solo enlace de Kunfupay.\nCada alumno paga con lo que usa en su país.\nY tú recibes euros o dólares.\n\nHaz clic y descubre cómo.",
        t1="Así te paga cada alumno", t2="Cobra a todos con un solo enlace"),
    'DESEO': dict(
        gancho="¿Y si pudieras facturar hasta un 30 % más sin vender más, sin otro lanzamiento? Solo cambiando cómo cobras.",
        corto="Si vendes cursos desde Latinoamérica, podrías facturar hasta un 30 % más.\n\nSin vender más. Sin otro lanzamiento. Solo cambiando cómo cobras.\n\nCon tu enlace de Kunfupay te paga cualquier alumno, esté donde esté. Y te llega en euros o en dólares.\n\nHaz clic y descubre cómo.",
        t1="Hasta un 30 % más, sin vender más", t2="Cambia cómo cobras"),
    'NOTICIA': dict(
        gancho="Creadores en LATAM ya aumentan su conversión un 27 % solo cambiando cómo cobran. No venden más: cobran mejor.",
        corto="Creadores en LATAM ya aumentan su conversión un 27 % solo cambiando cómo cobran.\n\nNo venden más. Cobran mejor.\nCon un solo enlace, cada alumno paga como paga en su país.\nY ellos reciben euros o dólares.\n\nHaz clic y descubre cómo.",
        t1="Un 27 % más de conversión", t2="No venden más, cobran mejor"),
}

P['DUBAI'] = {
    'TWEET': dict(
        gancho="Si vendes cursos desde Dubái a España y LATAM y cobras con una pasarela de Emiratos, estás perdiendo hasta un 27 % de tus ventas.",
        corto="Si vendes cursos desde Dubái a España y LATAM, tu pasarela de Emiratos te hace perder hasta un 27 % de tus ventas.\n\nKunfupay es un solo enlace de pago.\nTu cliente de España paga como paga allí. El de LATAM, como paga allí.\nY tú recibes euros o dólares.\n\nHaz clic y descubre cómo.",
        t1="Hasta un 27 % se queda en el pago", t2="Que te paguen España y LATAM"),
    'COMPARATIVA': dict(
        gancho="Mira la tabla: esto es lo que le sale a tu cliente con un Stripe de Emiratos y lo que le sale con tu enlace de Kunfupay.",
        corto="Si cobras con un Stripe de Emiratos, pierdes hasta un 27 % de tus ventas.\n\nA tu cliente le sale tarjeta y poco más. Si no le sirve, no compra.\n\nCon tu enlace de Kunfupay cada uno paga con lo suyo. Y tú recibes euros o dólares.\n\nHaz clic y descubre cómo.",
        t1="Lo que no aparece en tu Stripe", t2="Cada uno paga con lo suyo"),
    'PAGINA DE PAGO': dict(
        gancho="Mira la imagen: eso es lo que ve tu cliente cuando abre tu enlace de Kunfupay. El de España con sus métodos, el de LATAM con los suyos.",
        corto="Si vendes cursos desde Dubái, ya no cobres a España y LATAM con Stripe.\n\nMandas un solo enlace de Kunfupay.\nCada cliente paga con lo que usa en su país.\nY tú recibes euros o dólares.\n\nHaz clic y descubre cómo.",
        t1="Esto ve tu cliente al pagarte", t2="España y LATAM, en un solo enlace"),
    'DESEO': dict(
        gancho="España te compra por la mañana. LATAM, por la noche. ¿Y si todos pudieran pagarte? Podrías facturar hasta un 30 % más.",
        corto="Si vendes cursos desde Dubái, podrías facturar hasta un 30 % más solo cambiando cómo cobras.\n\nEspaña te compra por la mañana. LATAM, por la noche.\nCon tu enlace de Kunfupay, todos pueden pagarte. Y recibes euros o dólares.\n\nHaz clic y descubre cómo.",
        t1="Hasta un 30 % más desde Dubái", t2="Mañana España, noche LATAM"),
    'NOTICIA': dict(
        gancho="Creadores en Dubái ya aumentan su conversión un 27 % solo cambiando cómo cobran. No venden más: cobran mejor.",
        corto="Creadores en Dubái ya aumentan su conversión un 27 % solo cambiando cómo cobran.\n\nNo venden más. Cobran mejor.\nCon un solo enlace, cada cliente paga como paga en su país.\nY ellos reciben euros o dólares.\n\nHaz clic y descubre cómo.",
        t1="Un 27 % más de conversión", t2="No venden más, cobran mejor"),
}

P['BALI'] = {
    'TWEET': dict(
        gancho="Si vendes cursos desde Bali y cobras con Stripe o PayPal, estás perdiendo hasta un 27 % de tu facturación. Mientras duermes.",
        corto="Si vendes cursos desde Bali y cobras con Stripe o PayPal, pierdes hasta un 27 % de tu facturación.\n\nTus clientes de España y LATAM quieren comprarte. Y no pueden pagarte.\n\nPERO con tu enlace de Kunfupay, sí. Y recibes euros o dólares.\n\nHaz clic y descubre cómo.",
        t1="Stripe o PayPal: hasta un 27 % menos", t2="Que te pague cualquiera"),
    'COMPARATIVA': dict(
        gancho="Si das sesiones 1:1 desde Bali, mira la tabla: hoy te despiertas con chats sin contestar. Con Kunfupay, con ventas cobradas.",
        corto="Si das sesiones 1:1 desde Bali y cobras solo con PayPal, pierdes hasta un 27 % de tus ventas.\n\nHoy te despiertas con chats sin contestar. Con Kunfupay, con ventas cobradas.\n\nUn enlace. Cada cliente paga solo. Y recibes euros o dólares.\n\nHaz clic y descubre cómo.",
        t1="Despiértate con ventas cobradas", t2="Tú duermes, ellos pagan"),
    'PAGINA DE PAGO': dict(
        gancho="Mira la imagen: eso es lo que ve tu cliente cuando abre tu enlace de Kunfupay. Paga solo, con lo que usa en su país, sin escribirte.",
        corto="Si vendes cursos desde Bali, ya no cobres a España y LATAM con Stripe.\n\nTu cliente abre tu enlace y paga con lo que usa en su país. Sin escribirte.\nY tú recibes euros o dólares.\n\nHaz clic y descubre cómo.",
        t1="Así te paga cada cliente", t2="Pagan solos, sin escribirte"),
    'DESEO': dict(
        gancho="Mientras duermes en Bali, España y LATAM siguen comprando. ¿Y si también pudieran pagarte? Podrías facturar hasta un 30 % más.",
        corto="Si vendes desde Bali, podrías facturar hasta un 30 % más solo cambiando cómo cobras.\n\nMientras duermes, España y LATAM siguen comprando.\nCon tu enlace de Kunfupay, también pagan. Y recibes euros o dólares.\n\nHaz clic y descubre cómo.",
        t1="Hasta un 30 % más, mientras duermes", t2="Cambia cómo cobras"),
    'NOTICIA': dict(
        gancho="Creadores en Bali ya aumentan su conversión un 27 % solo cambiando cómo cobran. No venden más: cobran mejor.",
        corto="Creadores en Bali ya aumentan su conversión un 27 % solo cambiando cómo cobran.\n\nNo venden más. Cobran mejor.\nCon un solo enlace, cada cliente paga como paga en su país.\nY ellos reciben euros o dólares.\n\nHaz clic y descubre cómo.",
        t1="Un 27 % más de conversión", t2="No venden más, cobran mejor"),
}

out = {}
md = ["# Copys de los anuncios · HUBS / METODOS DE PAGO", "",
      "Un texto largo (feed) y uno corto (stories y reels) por anuncio, y dos títulos.", ""]
for hub, piezas in P.items():
    md += [f"## {hub}", ""]
    for tipo, d in piezas.items():
        nombre = f"ESTATICA / {tipo} / {hub}"
        largo = f"{d['gancho']}\n\n{CUERPO[hub]}\n\n{FILTRO}\n\n{CIERRE}"
        out[nombre] = dict(largo=largo, corto=d['corto'], t1=d['t1'], t2=d['t2'])
        md += [f"### {nombre}", "", f"**Título 1 (feed):** {d['t1']}  ", f"**Título 2 (stories):** {d['t2']}", "",
               "**Texto largo (feed)**", "", "```text", largo, "```", "",
               "**Texto corto (stories y reels)**", "", "```text", d['corto'], "```", ""]

json.dump(out, open(os.path.join(here, 'copys_hubs.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
open(os.path.join(here, '..', 'COPYS-ANUNCIOS-HUBS.md'), 'w', encoding='utf-8').write('\n'.join(md))
print(len(out), 'anuncios;', max(len(v['largo']) for v in out.values()), 'caracteres el largo más largo')
