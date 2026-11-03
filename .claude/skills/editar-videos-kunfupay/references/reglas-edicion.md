# Reglas de estilo de edición (vídeo hablado de Kunfupay)

Cada punto viene de una corrección real de Brayan (entre paréntesis, el vídeo donde se fijó).

## Composición y gráficos
- **Nunca recuadros ni tarjetas de cristal en las animaciones** (repetido muchas veces). Elementos sueltos: banderas con
  el emoji de Apple, logos reales de las empresas que se nombran, pastillas sueltas para textos cortos y ✓/✕, cifras
  grandes detrás de la persona, divisas dibujadas a mano.
- **Detrás de la persona** siempre que se pueda (recorte con `hyperframes remove-background`). Si no hay aire (primer
  plano), el gráfico va encima del subtítulo (top ≈ 1290 en 1080×1920), delante de la persona; nunca sobre la frente.
  Si la cabeza tapa un texto, ese texto va delante. Si una cifra no se lee entera en su valor final, va en un lateral.
- **Coloca los gráficos donde señala la persona** (con el brazo o la mirada).
- **Banderas:** sueltas, sin marco y sin el nombre del país. Un grupo de países (LATAM) se reparte por el negro del plano.
  Una bandera puede ondear (tiras verticales desplazadas en onda desde el mástil).
- **Logos:** los de empresas que se nombran (Stripe, PayPal…) con su logo real. Métodos de pago: según la regla del Brain
  (algunos solo en texto o en tile neutro). Logo de Kunfupay dentro del vídeo: solo el isotipo «ku» oficial, poca sombra.
- **Cifras:** grandes, detrás, contando 0 → n con escala creciente y golpe al aterrizar. Mantén el matiz de la voz.
- **Divisas (€ / $):** ilustración a mano — monedas en lápiz morado imperfecto que se dibujan trazo a trazo (filtro
  «lápiz» + doble pasada + línea que «hierve»). Descartados: fichas de motion a los lados y la escena estilo Ramiro.
- **Tipografía de infografías:** títulos Plus Jakarta SemiBold (600), ítems Medium (500). La ExtraBold (800) solo para la
  palabra clave grande de los subtítulos («muy agresiva» en tarjetas).
- **Sin sombras negras ni velos oscuros** para arreglar legibilidad («sombra perenne»).
- **Demos de producto** (dashboard/app): a pantalla completa, sin subtítulos encima; se pasa directo desde el plano
  anterior sin dejar ver fotogramas intermedios. Cifras de la demo coherentes (el saldo sube lo que se RECIBE).
- **Nada de textos en las esquinas** (el logo sí) ni **botones de CTA dentro del vídeo**.

## Subtítulos
- Una sola línea, Roboto Medium, blancos, sombra suave difusa, **sin borde/contorno** y **sin puntuación** (ni ¿?¡!).
- Palabra destacada en grande: sola en su renglón (nunca mezclada con pequeñas) y solo si se ve ≥ 1 s. Truco: que la
  grande abra el grupo y la frase siga debajo en pequeño. Un grupo = como mucho una línea grande y una pequeña.
- ~30 caracteres por línea; si no cabe, más grupos. Máximo 3 líneas de texto en pantalla contando los gráficos.
- Sin títulos grandes salvo que los pidan. Frases de cierre tipo eslogan: no destacarlas en grande.
- Revisa siempre marca y cifras transcritas (Kunfupay, «3.000 €» y no «13.000», nombres de producto).

## Ritmo, color y transiciones
- **Tramo dramático** (cliente que «se va», mención a la competencia): B/N con grano ligero, voz de radio
  (`highpass=350,lowpass=3200` + algo de saturación) y música en pausa; al acabar, transición suave al color y a la voz
  limpia, y entra una música más enérgica.
- **Grano/película:** solo en esos momentos de énfasis, nunca en todo el vídeo.
- **Luces de película** (pack TransFlare, en modo *screen*): solo en cortes que abren bloque, nunca a mitad de plano;
  varía la luz entre vídeos.
- **Transiciones:** no abusar; como mucho un destello con sentido. Varía el tipo (whip con desenfoque, reencuadre seco).
- **Planos largos (> 4 s):** un reencuadre de zoom a mitad de plano.
- **Hooks de suspense** (amenaza/profecía): música de tensión solo en el hook, color que se apaga a B/N, golpes de
  destello + temblor y un silencio antes del cuerpo.
- **Cierre:** solo el isotipo; cuando la voz dice «Kunfupay» al final, el isotipo late y suena un SFX positivo.
  Nada de disclaimers ni frases que no estén en el guion.

## Voz
- Mejorada SIEMPRE con Magnific `audio_isolate`.
- Nunca se cortan frases por claims sin permiso: se avisa con el segundo y el motivo, y se lista para Compliance.
- «No toques X segundos» = no se modifica nada en ese tramo.
