"""Copys de los 5 estáticos de métodos de pago para España (ES-E1 a ES-E5).

Igual que en los hubs: cada pieza lleva un texto MUY largo (feed, de tú a tú, filtra) y uno
corto, y dos títulos muy distintos. Genera ../COPYS-ESTATICOS-ESPANA.md."""
import os

here = os.path.dirname(os.path.abspath(__file__))

CIERRE = ("Si todavía no vendes, esto no es para ti.\n\n"
          "Entra y mira si tu negocio encaja.\n\n"
          "Kunfupay es una empresa de tecnología financiera, no un banco. "
          "Las cuentas y tarjetas las prestan partners financieros con licencia.")

FILTRO = ("Esto es para ti si:\n"
          "✅ Ya vendes cursos, mentorías, comunidades o sesiones online desde España.\n"
          "✅ Tienes alumnos en LATAM (o los quieres tener).\n"
          "✅ Alguna vez alguien te dijo «quiero entrar, pero no puedo pagarte».")

CUERPO = (
    "Te cuento algo que seguro te ha pasado.\n\n"
    "Un alumno de México, de Colombia o de Perú te escribe. Le encanta lo que haces. Quiere "
    "entrar.\n"
    "Le mandas tu enlace de pago… y ahí se queda.\n"
    "No es que no quiera tu curso. Es que su tarjeta no pasa, no tiene tarjeta internacional "
    "o en su país se paga de otra forma.\n"
    "Te dice «mañana lo intento». Y mañana ya no está.\n\n"
    "Cuando cobras a LATAM solo con Stripe, hasta un 27 % de las ventas se cae justo en el "
    "pago. Y casi nunca te enteras, porque no te dicen «no pude pagar»: simplemente "
    "desaparecen.\n\n"
    "Con Kunfupay cambia una sola cosa: cómo te pagan.\n"
    "Creas tu enlace de pago y lo mandas como siempre.\n"
    "Tu alumno lo abre y le salen los métodos que usa en su país.\n"
    "Paga en el momento, sin escribirte para preguntar cómo.\n"
    "Y a ti te llega en euros.\n\n"
    "No cambias lo que vendes. No haces otro lanzamiento. No persigues a nadie por WhatsApp.\n"
    "Solo dejas de perder a los que ya te querían comprar.")

PIEZAS = [
    dict(pieza='ES-E1', nombre='Tweet de Rubén (dolor)',
         gancho=("Si vendes cursos desde España y cobras con Stripe, estás perdiendo hasta un "
                 "27 % de tu facturación."),
         corto=("Si vendes cursos desde España y cobras con Stripe, pierdes hasta un 27 % de "
                "tu facturación.\n\n"
                "Tus alumnos de LATAM quieren comprarte.\n"
                "Y no pueden pagarte.\n\n"
                "PERO con tu enlace de Kunfupay, sí.\n"
                "Y a ti te llegan euros.\n\n"
                "Haz clic y descubre cómo."),
         titulos=["Stripe te hace perder hasta un 27 %", "Tu alumno de LATAM sí quiere pagarte"]),
    dict(pieza='ES-E2', nombre='Comparativa',
         gancho=("Si vendes cursos desde España, deja de perder ventas cobrando solo con Stripe."),
         corto=("Si vendes cursos desde España y solo cobras con Stripe, pierdes hasta un "
                "27 % de tus ventas.\n\n"
                "No es que no quieran comprarte.\n"
                "Es que no pueden pagarte.\n\n"
                "PERO con tu enlace de Kunfupay pagan todos.\n"
                "Un enlace. Euros para ti.\n\n"
                "Haz clic y descubre cómo."),
         titulos=["Deja de perder ventas con Stripe", "Hoy con Stripe vs. con Kunfupay"]),
    dict(pieza='ES-E3', nombre='Así te paga cada alumno (páginas reales)',
         gancho=("Si vendes cursos desde España, deja de perder ventas cobrando a LATAM solo con "
                 "Stripe."),
         corto=("Si vendes cursos desde España, deja de perder ventas cobrando a LATAM solo con "
                "Stripe.\n\n"
                "Mandas un solo enlace de Kunfupay.\n"
                "Cada alumno lo abre y paga con lo que usa en su país.\n"
                "Y tú recibes euros.\n\n"
                "Haz clic y descubre cómo."),
         titulos=["Así te paga cada alumno", "Esto ve tu alumno de LATAM al pagarte"]),
    dict(pieza='ES-E4', nombre='+30 % (deseo)',
         gancho=("Si vendes cursos desde España, podrías facturar hasta un 30 % más. Sin "
                 "vender más. Solo cambiando cómo cobras."),
         corto=("Si vendes cursos desde España, podrías facturar hasta un 30 % más.\n\n"
                "Sin vender más.\n"
                "Sin otro lanzamiento.\n"
                "Solo cambiando cómo cobras.\n\n"
                "Con tu enlace de Kunfupay te paga cualquier alumno de LATAM.\n"
                "Y a ti te llegan euros.\n\n"
                "Haz clic y descubre cómo."),
         titulos=["Hasta un 30 % más, sin vender más", "Cambia cómo cobras, no lo que vendes"]),
    dict(pieza='ES-E5', nombre='Noticia (Madrid)',
         gancho=("Creadores en España ya aumentan su conversión un 27 % solo cambiando cómo "
                 "cobran."),
         corto=("Creadores en España ya aumentan su conversión un 27 % solo cambiando cómo "
                "cobran.\n\n"
                "No venden más.\n"
                "Cobran mejor.\n"
                "Con un solo enlace, cada alumno paga como paga en su país.\n"
                "Y ellos reciben euros.\n\n"
                "Haz clic y descubre cómo."),
         titulos=["Un 27 % más de conversión", "No venden más: cobran mejor"]),
]

md = ["# Copys · estáticos de métodos de pago para España", "",
      "Conjunto: METODOS DE PAGO / ESP. Cada pieza lleva 2 textos (muy largo y corto) y 2 "
      "títulos. Imágenes en `estaticos/ES-E{1-5}_1080x1350.png` (feed) y `_1080x1920.png` "
      "(Stories). Botón: Ver más / Registrarte.", ""]
for p in PIEZAS:
    largo = p['gancho'] + "\n\n" + CUERPO + "\n\n" + FILTRO + "\n\n" + CIERRE
    assert len(largo) > 4 * len(p['corto']), p['pieza']
    md += [f"## {p['pieza']} · {p['nombre']}", "",
           f"**Título 1:** {p['titulos'][0]}  ", f"**Título 2:** {p['titulos'][1]}", "",
           f"**Texto largo** ({len(largo)} caracteres)", "", "```text", largo, "```", "",
           f"**Texto corto** ({len(p['corto'])} caracteres)", "", "```text", p['corto'], "```", ""]

open(os.path.join(here, '..', 'COPYS-ESTATICOS-ESPANA.md'), 'w', encoding='utf-8').write('\n'.join(md))
