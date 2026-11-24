# Wallet LATAM + MoneyGram España · copys

Formatos de los hubs (noticia con foto real, tweet de Rubén, cifra/símbolo grande, pasos), en 4:5 y 9:16. Hablan de lo que hace Kunfupay, no del problema.

## Hechos verificados (Daneris, 24-11-2026: código, Slack y Linear)

- **Wallet Personal:** EUR, USD y GBP. Recibe pagos del extranjero en una cuenta a tu nombre.
- **Tarjeta Visa Kunfu Kard** en EUR y USD, con Apple Pay y Google Pay. Para pedirla hacen falta 50 € de ingresos acumulados.
- **Cripto:** solo **USDC y EURC**, no USDT. Para gastarlo se recarga la tarjeta con un 4 % de comisión; no se convierte solo al pagar.
- **Envío a otra persona:** entre usuarios de Kunfupay con su **Kunfutag**, sin comisión.
- **MoneyGram:** es **retirar en efectivo el saldo propio** en un agente, con un 6 % de comisión. No es una remesa a un tercero. Por eso el flujo España → LATAM es: envías a su Kunfutag → lo retira en efectivo en MoneyGram. El receptor necesita cuenta de Kunfupay con KYC.
- **Hotmart y prop firms:** no hay integración. Lo que hay es una cuenta que recibe su transferencia o sus USDC.

## Antes de lanzar

- **MoneyGram:** hay un fallo abierto en los retiros en efectivo (KUN-3936, 24-11). No publicar los anuncios de MoneyGram hasta que esté resuelto. Hay que confirmar también en qué países de LATAM está activo en producción (Meta comprobó 27 el 6-11).
- **Fondeo (LA3):** solo vale si la prop firm paga por transferencia o en USDC. El 19-11 el equipo corrigió un anuncio de fondeo; que lo valide Rubén.
- **Tarjeta:** no se ha comprobado que funcione en todos los países de LATAM. Por eso no se dice «en toda LATAM».

---

## LATAM

**LA1 · Noticia «Recibe dólares o euros»** (Bogotá de noche)
- Títulos: Recibe dólares o euros del extranjero · Gasta lo que cobras de fuera
- Texto: Si vives en Latinoamérica y cobras del extranjero, con Kunfupay recibes dólares o euros en una cuenta a tu nombre y los gastas con tu tarjeta, online o en tiendas. Abre tu cuenta y pide tu tarjeta. Kunfupay no es un banco. Las cuentas y tarjetas las prestan partners financieros con licencia.

**LA2 · Noticia «Ya no necesitas tenerlo todo en Binance»** (Obelisco de Buenos Aires)
- Títulos: Tus USDC, a tu tarjeta · Gasta tus USDC con tarjeta
- Texto: Deposita tus USDC (o EURC) en Kunfupay, pásalos a tu tarjeta y paga online o en tiendas. La recarga de la tarjeta tiene comisión. Solo USDC y EURC; USDT no. Kunfupay no es un banco…

**LA3 · Noticia «Payout de tu cuenta de fondeo»** (puesto de trading)
- Títulos: Tu payout, listo para gastar · De tu cuenta de fondeo a tu tarjeta
- Texto: Si tu cuenta de fondeo te paga por transferencia o en USDC, recíbelo en tu cuenta Kunfupay a tu nombre y gástalo con tu tarjeta. Kunfupay no es un banco…

**LA4 · Tweet de Rubén**
- Títulos: Cobra de fuera, gasta con tu tarjeta · Dólares o euros, a tu nombre
- Texto: igual que el del tweet.

**LA5 · «Envía dinero con su Kunfutag»**
- Títulos: Envía dinero con su Kunfutag · Sin números de cuenta
- Texto: Con Kunfupay envías dinero a otra persona que use Kunfupay solo con su Kunfutag, sin pedirle números de cuenta. Le llega a su cuenta a su nombre. Kunfupay no es un banco…

## España · MoneyGram

**ES1 · Noticia «Envía desde España y que lo retire en efectivo»** (Cartagena de Indias)
- Títulos: Que lo retiren en efectivo en MoneyGram · Envía dinero a tu familia en Latinoamérica
- Texto: Si vives en España y tu familia está en Latinoamérica: se lo envías desde tu Kunfupay con su Kunfutag y lo retira en efectivo en un agente MoneyGram de su país. Retirar en efectivo tiene un 6 % de comisión. Quien lo recibe necesita su cuenta de Kunfupay. Kunfupay no es un banco…

**ES2 · Tres pasos** (envías → le llega → lo retira en MoneyGram, con la nota del 6 %)
- Títulos: Tres pasos y lo tienen en efectivo · De España a Latinoamérica, en efectivo

**ES3 · Tweet de Rubén** con el mismo mensaje.

UTM: `utm_term=wallet_latam_aud_hernan_3` o `moneygram_esp_…`; `utm_content` = el nombre de la pieza en minúsculas.
