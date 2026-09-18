/* ============================================================
   CREATOR BUSINESS SCORE · tarjeta compartible
   ------------------------------------------------------------
   Dibuja en un canvas de 1080 × 1920 la imagen que el usuario
   comparte al terminar la auditoría. Sin dependencias.

   La pieza es un NÚMERO PROTAGONISTA: un solo valor, el puntaje,
   con un anillo que lo refuerza. Nada más compite con él.

   Expone window.CBSTarjeta.dibujar(res) → Promise<canvas>
   ============================================================ */
(function () {
  'use strict';

  const { ancho: W, alto: H } = TARJETA;

  /* Paleta de la tarjeta. Fondo morado de marca, tinta blanca encima.
     El anillo es de un solo valor, así que no hay paleta categórica que
     validar: lo que importa es el contraste de cada capa de texto. */
  const TINTA        = '#ffffff';
  const TINTA_SUAVE  = 'rgba(255,255,255,.78)';
  const TINTA_TENUE  = 'rgba(255,255,255,.62)';
  const PISTA_ANILLO = 'rgba(255,255,255,.16)';
  const MORADO_700   = '#5c21e0';

  const FUENTE = `'${TARJETA.fuente}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`;
  const fuente = (peso, tam) => `${peso} ${tam}px ${FUENTE}`;

  /* ---------- Utilidades de dibujo ---------- */

  /** Texto con tracking manual: canvas no tiene letter-spacing en todos
      los navegadores, así que se dibuja carácter a carácter. */
  function textoEspaciado(ctx, texto, x, y, espacio) {
    const chars = [...texto];
    const total = chars.reduce((a, c) => a + ctx.measureText(c).width, 0) + espacio * (chars.length - 1);
    let cx = x - total / 2;
    chars.forEach((c) => {
      ctx.fillText(c, cx + ctx.measureText(c).width / 2, y);
      cx += ctx.measureText(c).width + espacio;
    });
  }

  /** Parte el texto en líneas que quepan en `max` y las devuelve. */
  function lineas(ctx, texto, max) {
    const out = [];
    let linea = '';
    texto.split(' ').forEach((palabra) => {
      const prueba = linea ? linea + ' ' + palabra : palabra;
      if (ctx.measureText(prueba).width > max && linea) { out.push(linea); linea = palabra; }
      else linea = prueba;
    });
    if (linea) out.push(linea);
    return out;
  }

  /** Dibuja las líneas centradas y devuelve la y siguiente. */
  function bloque(ctx, texto, y, max, alto) {
    const ls = lineas(ctx, texto, max);
    ls.forEach((l, i) => ctx.fillText(l, W / 2, y + i * alto));
    return y + ls.length * alto;
  }

  function rectRedondo(ctx, x, y, w, h, r) {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
    else {
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);         ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }
  }

  /* ---------- Piezas ---------- */

  function fondo(ctx) {
    const g = ctx.createLinearGradient(0, 0, W * .6, H);
    g.addColorStop(0, '#4a1ab8');
    g.addColorStop(1, '#190852');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Halo detrás del anillo: dirige la vista al número.
    const halo = ctx.createRadialGradient(W / 2, 720, 60, W / 2, 720, 820);
    halo.addColorStop(0, 'rgba(147,109,255,.60)');
    halo.addColorStop(1, 'rgba(147,109,255,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, W, H);
  }

  /** Lockup de Classroom en negativo: la teja va en blanco y el torii en
      morado, porque la teja morada original desaparecería sobre el fondo. */
  function lockup(ctx, y) {
    const LADO = 104, ESCALA = LADO / 512;

    ctx.save();
    ctx.font = fuente(800, 62);
    const wordmark = 'Classroom';
    const anchoTexto = ctx.measureText(wordmark).width;
    const hueco = 26;
    const x0 = (W - (LADO + hueco + anchoTexto)) / 2;

    ctx.fillStyle = TINTA;
    rectRedondo(ctx, x0, y, LADO, LADO, 24);
    ctx.fill();

    ctx.save();
    ctx.translate(x0, y);
    ctx.scale(ESCALA, ESCALA);
    ctx.fillStyle = MORADO_700;
    // Mismas rutas que el isotipo Tatami del SVG oficial.
    ctx.fill(new Path2D('M104 150C104 150 162 124 256 124C350 124 408 150 408 150L408 178C408 178 350 160 256 160C162 160 104 178 104 178Z'));
    ctx.fill(new Path2D('M168 178L200 178L208 392L160 392Z'));
    ctx.fill(new Path2D('M312 178L344 178L352 392L304 392Z'));
    rectRedondo(ctx, 138, 206, 236, 34, 6);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = TINTA;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(wordmark, x0 + LADO + hueco, y + 56);

    ctx.font = fuente(500, 27);
    ctx.fillStyle = TINTA_TENUE;
    ctx.fillText('by Kunfupay', x0 + LADO + hueco + 3, y + 92);
    ctx.restore();
  }

  /** Anillo de un solo valor: la cara de la medalla. La pista es el mismo
      blanco a menor opacidad, no un gris ajeno, para que el estado se lea en
      toda la circunferencia. */
  function anillo(ctx, cy, puntaje, color) {
    const R = 208, GROSOR = 40;
    // El arco lleva el metal; la cifra se queda en blanco, que es la que
    // tiene que leerse a tamaño miniatura en un feed.
    const tinta = color || TINTA;

    ctx.save();
    ctx.lineWidth = GROSOR;
    ctx.strokeStyle = PISTA_ANILLO;
    ctx.beginPath();
    ctx.arc(W / 2, cy, R, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = tinta;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(W / 2, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (puntaje / 100));
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = TINTA;
    // Cifra protagonista: una sola por pieza, con las cifras proporcionales
    // de la fuente, que a este tamaño se ven mucho mejor que las tabulares.
    ctx.font = fuente(800, 194);
    ctx.textBaseline = 'middle';
    ctx.fillText(String(puntaje), W / 2, cy - 14);

    ctx.font = fuente(600, 31);
    ctx.fillStyle = TINTA_SUAVE;
    ctx.fillText('sobre 100', W / 2, cy + 112);
    ctx.restore();
  }

  /** La cinta del rango: una banderola con las puntas mordidas hacia dentro,
      que es lo que hace que esto se lea como una medalla y no como un chip.

      Sin adorno dentro: probé laurel a ambos lados y a este tamaño se leía
      como una pluma. La banderola sola ya dice premio. */
  function cinta(ctx, cy, texto, color) {
    const ALTO = 98, MUESCA = 34, TRACKING = 9, ANCHO_MINIMO = 430;
    const tinta = color || TINTA;

    ctx.save();
    ctx.font = fuente(800, 40);
    const chars = [...texto];
    const anchoTexto = chars.reduce((a, c) => a + ctx.measureText(c).width, 0) + TRACKING * (chars.length - 1);
    // El ancho mínimo evita que "ORO" salga con una banderola diminuta y
    // "BRONCE" con una enorme: las cuatro medallas tienen que pesar igual.
    const ancho = Math.min(W - 140, Math.max(ANCHO_MINIMO, anchoTexto + 200));
    const x = (W - ancho) / 2, y = cy - ALTO / 2;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + ancho, y);
    ctx.lineTo(x + ancho - MUESCA, y + ALTO / 2);
    ctx.lineTo(x + ancho, y + ALTO);
    ctx.lineTo(x, y + ALTO);
    ctx.lineTo(x + MUESCA, y + ALTO / 2);
    ctx.closePath();
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = tinta;
    ctx.fill();
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = tinta;
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.fillStyle = tinta;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    textoEspaciado(ctx, texto, W / 2, cy + 2, TRACKING);
    ctx.restore();
  }

  /** Pie: la llamada y, debajo, el dominio en una pastilla blanca. En una
      story nada es pulsable, así que el enlace tiene que leerse de un vistazo
      y quedarse en la cabeza: por eso invierte el color en vez de ser un
      gris pequeño al fondo. */
  function pie(ctx, yCta, url) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = fuente(600, 36);
    ctx.fillStyle = TINTA_SUAVE;
    ctx.fillText(TARJETA.cta, W / 2, yCta);

    const ALTO = 104;
    ctx.font = fuente(800, 42);
    const ancho = Math.min(W - 120, ctx.measureText(url).width + 96);
    const x = (W - ancho) / 2, y = yCta + 58;

    rectRedondo(ctx, x, y, ancho, ALTO, ALTO / 2);
    ctx.fillStyle = TINTA;
    ctx.fill();

    ctx.fillStyle = MORADO_700;
    ctx.fillText(url, W / 2, y + ALTO / 2 + 2);
    ctx.restore();
  }

  /* ---------- Composición ---------- */

  function franjaDe(puntaje) {
    return TARJETA.franjas.find((f) => puntaje >= f.desde) || TARJETA.franjas[TARJETA.franjas.length - 1];
  }

  /** Dominio que se imprime al pie: el configurado, o el de la página sin
      parámetros ni index.html, que es lo correcto allá donde se despliegue. */
  function urlVisible() {
    if (TARJETA.url) return TARJETA.url;
    try {
      const u = new URL(window.location.href);
      const ruta = u.pathname.replace(/index\.html?$/i, '');
      // Sin `www.`: en una story el dominio se lee de un vistazo o no se lee.
      const host = u.host.replace(/^www\./i, '');
      return (host + ruta).replace(/\/$/, '') || host;
    } catch (err) {
      return 'kunfupay.com';
    }
  }

  /** Fuerza la descarga de los pesos que usa la tarjeta antes de dibujar. El
      canvas no espera a nadie: si la webfont no está, pinta con la del sistema
      y la imagen sale con otra cara, sin avisar.

      Se piden con la familia SOLA, no con toda la pila de respaldo:
      `FontFaceSet.load()` casa contra la primera familia y una lista larga
      hace que algunos motores no resuelvan nada. */
  async function fuentesListas() {
    if (!document.fonts) return;
    const pesos = [800, 700, 600, 500];
    try {
      await Promise.all(pesos.map((w) => document.fonts.load(`${w} 100px "${TARJETA.fuente}"`)));
      await document.fonts.ready;
    } catch (err) { /* sin webfont se dibuja con la del sistema */ }
  }

  async function dibujar(res) {
    await fuentesListas();

    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    const franja = franjaDe(res.puntaje);

    fondo(ctx);
    lockup(ctx, 90);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = fuente(700, 26);
    ctx.fillStyle = TINTA_TENUE;
    textoEspaciado(ctx, TARJETA.eyebrow.toUpperCase(), W / 2, 258, 6);

    const Y_CINTA = 1000;
    anillo(ctx, 610, res.puntaje, franja.color);
    cinta(ctx, Y_CINTA, franja.medalla.toUpperCase(), franja.color);

    /* El bloque de texto se mide antes de pintarlo y se centra en la banda que
       queda entre la cinta y el pie. Con coordenadas fijas, un titular de dos
       líneas o una limitación larga se comían el pie, y uno corto dejaba un
       agujero de 250 px. */
    const ALTO_TITULAR = 74, ALTO_DESBLOQUEO = 54, ALTO_RETO = 50;
    const HUECO_EYEBROW = 78, HUECO_DESBLOQUEO = 58, HUECO_RETO = 74;

    ctx.font = fuente(800, 58);
    const lTitular = lineas(ctx, franja.titular, W - 150);
    ctx.font = fuente(700, 42);
    const lDesbloqueo = lineas(ctx, res.caso.limitacion, W - 200);
    ctx.font = fuente(500, 38);
    const lReto = lineas(ctx, franja.reto, W - 180);

    const altoBloque = lTitular.length * ALTO_TITULAR + HUECO_EYEBROW + HUECO_DESBLOQUEO
      + lDesbloqueo.length * ALTO_DESBLOQUEO + HUECO_RETO + lReto.length * ALTO_RETO;

    const Y_CTA = H - 244;
    const bandaArriba = Y_CINTA + 90, bandaAbajo = Y_CTA - 80;
    let y = bandaArriba + Math.max(0, (bandaAbajo - bandaArriba - altoBloque) / 2);

    // El titular es la frase que publica el usuario: lo segundo que se lee
    // después del número, y lo que decide si el de enfrente se mide.
    ctx.font = fuente(800, 58);
    ctx.fillStyle = TINTA;
    lTitular.forEach((l, i) => ctx.fillText(l, W / 2, y + i * ALTO_TITULAR));
    y += lTitular.length * ALTO_TITULAR + HUECO_EYEBROW;

    ctx.font = fuente(700, 25);
    ctx.fillStyle = TINTA_TENUE;
    textoEspaciado(ctx, TARJETA.etiquetaDesbloqueo.toUpperCase(), W / 2, y, 5);
    y += HUECO_DESBLOQUEO;

    ctx.font = fuente(700, 42);
    ctx.fillStyle = TINTA;
    lDesbloqueo.forEach((l, i) => ctx.fillText(l, W / 2, y + i * ALTO_DESBLOQUEO));
    y += lDesbloqueo.length * ALTO_DESBLOQUEO + HUECO_RETO;

    ctx.font = fuente(500, 38);
    ctx.fillStyle = TINTA_SUAVE;
    lReto.forEach((l, i) => ctx.fillText(l, W / 2, y + i * ALTO_RETO));

    pie(ctx, Y_CTA, urlVisible());

    return canvas;
  }

  /** El texto que acompaña a la imagen en el menú nativo de compartir. */
  function textoParaCompartir(puntaje) {
    const url = urlVisible();
    return typeof puntaje === 'number'
      ? `${puntaje}/100 en mi Creator Business Score. ${TARJETA.cta}: ${url}`
      : `${TARJETA.cta}: ${url}`;
  }

  window.CBSTarjeta = { dibujar, franjaDe, urlVisible, textoParaCompartir };
})();
