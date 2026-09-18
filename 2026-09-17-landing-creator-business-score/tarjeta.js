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

  /** Anillo de un solo valor. La pista es el mismo blanco a menor opacidad,
      no un gris ajeno, para que el estado se lea en toda la circunferencia. */
  function anillo(ctx, cy, puntaje) {
    const R = 252, GROSOR = 46;

    ctx.save();
    ctx.lineWidth = GROSOR;
    ctx.strokeStyle = PISTA_ANILLO;
    ctx.beginPath();
    ctx.arc(W / 2, cy, R, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = TINTA;
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
    ctx.font = fuente(800, 230);
    ctx.textBaseline = 'middle';
    ctx.fillText(String(puntaje), W / 2, cy - 18);

    ctx.font = fuente(600, 34);
    ctx.fillStyle = TINTA_SUAVE;
    ctx.fillText('sobre 100', W / 2, cy + 132);
    ctx.restore();
  }

  function pie(ctx, y, url) {
    const ALTO = 172, MARGEN = 96;

    ctx.save();
    rectRedondo(ctx, MARGEN, y, W - MARGEN * 2, ALTO, 40);
    ctx.fillStyle = 'rgba(255,255,255,.10)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,.26)';
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = TINTA;
    ctx.font = fuente(700, 39);
    ctx.fillText(TARJETA.cta, W / 2, y + 66);

    ctx.font = fuente(500, 32);
    ctx.fillStyle = TINTA_SUAVE;
    ctx.fillText(url, W / 2, y + 116);
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
      return (u.host + ruta).replace(/\/$/, '') || u.host;
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
    lockup(ctx, 104);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = fuente(700, 27);
    ctx.fillStyle = TINTA_TENUE;
    textoEspaciado(ctx, TARJETA.eyebrow.toUpperCase(), W / 2, 296, 6);

    anillo(ctx, 720, res.puntaje);

    ctx.font = fuente(800, 62);
    ctx.fillStyle = TINTA;
    ctx.fillText(franja.etiqueta, W / 2, 1090);

    ctx.font = fuente(700, 26);
    ctx.fillStyle = TINTA_TENUE;
    textoEspaciado(ctx, 'MI LIMITACIÓN RAÍZ', W / 2, 1194, 5);

    ctx.font = fuente(700, 44);
    ctx.fillStyle = TINTA;
    const finLimitacion = bloque(ctx, res.caso.limitacion, 1256, W - 200, 58);

    ctx.font = fuente(500, 42);
    ctx.fillStyle = TINTA_SUAVE;
    bloque(ctx, franja.reto, finLimitacion + 92, W - 180, 58);

    pie(ctx, H - 292, urlVisible());

    return canvas;
  }

  window.CBSTarjeta = { dibujar, franjaDe, urlVisible };
})();
