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

  /** Rejilla fina, como la de la referencia: da profundidad de estudio sin
      competir con nada. Se desvanece hacia los bordes con un degradado radial
      del propio fondo, para que no parezca papel cuadriculado. */
  function rejilla(ctx) {
    const PASO = 96;
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,.085)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([10, 14]);
    ctx.beginPath();
    for (let x = (W % PASO) / 2; x <= W; x += PASO) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (let y = 60; y <= H; y += PASO) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke();
    ctx.setLineDash([]);
    // Desvanecido: el centro deja ver la rejilla, los bordes la apagan.
    const fade = ctx.createRadialGradient(W / 2, 700, 200, W / 2, 700, 1150);
    fade.addColorStop(0, 'rgba(41,14,120,0)');
    fade.addColorStop(1, 'rgba(30,10,90,.92)');
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  /** Halo detrás de la medalla, del color de su metal: el oro alumbra dorado,
      el acero, frío. Es lo que hace que las cuatro se distingan desde lejos. */
  function haloMetal(ctx, cy, color) {
    const g = ctx.createRadialGradient(W / 2, cy, 40, W / 2, cy, 560);
    g.addColorStop(0, hexA(color || '#ffffff', .42));
    g.addColorStop(0.55, hexA(color || '#ffffff', .10));
    g.addColorStop(1, hexA(color || '#ffffff', 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  /** Motas de luz alrededor de la medalla. Posiciones fijas, no aleatorias:
      la misma puntuación debe dar siempre la misma imagen. */
  const MOTAS = [
    [215, 395, 3.2, .34], [875, 350, 2.4, .30], [160, 690, 2.2, .26], [920, 720, 2.8, .32], [300, 850, 2.2, .24]
  ];
  function motas(ctx, color) {
    ctx.save();
    MOTAS.forEach(([x, y, r, a]) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
      g.addColorStop(0, hexA(color || '#ffffff', a));
      g.addColorStop(0.35, hexA('#ffffff', a * .8));
      g.addColorStop(1, hexA('#ffffff', 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r * 4, 0, Math.PI * 2); ctx.fill();
    });
    ctx.restore();
  }

  /** La palabra del metal, gigante y casi transparente, detrás de la moneda:
      es lo que en la referencia hace el "Ads" tras el cohete. Da profundidad
      (la moneda la tapa) y nombra el nivel sin otro rótulo. */
  function palabraFantasma(ctx, cy, texto, color) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let tam = 340;
    ctx.font = fuente(800, tam);
    const ancho = ctx.measureText(texto).width;
    if (ancho > 1000) { tam = Math.floor(tam * 1000 / ancho); ctx.font = fuente(800, tam); }
    ctx.fillStyle = hexA(color || '#ffffff', .11);
    ctx.fillText(texto, W / 2 + 40, cy - 30);
    ctx.restore();
  }

  /** Sombra de contacto bajo la medalla, elíptica y difusa: es lo que la hace
      flotar en vez de estar pegada al fondo. */
  function sombraContacto(ctx, cy, D) {
    const y = cy + D / 2 + 58;
    ctx.save();
    ctx.translate(W / 2 + 14, y);
    ctx.scale(1, 0.30);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, D * 0.44);
    g.addColorStop(0, 'rgba(8,0,40,.62)');
    g.addColorStop(0.5, 'rgba(8,0,40,.28)');
    g.addColorStop(1, 'rgba(8,0,40,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(0, 0, D * 0.44, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  function hexA(hex, a) {
    const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    if (!m) return `rgba(255,255,255,${a})`;
    return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${a})`;
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

  /** Pie: un chip fantasma de dos líneas, marca arriba y llamada debajo.
      Antes era una pastilla blanca opaca que parecía un botón y competía con
      la súper-CTA real de la página; y quedaba bajo la interfaz de Instagram. */
  function pie(ctx, yAbajo) {
    const ALTO = 112, marca = TARJETA.marcaPie || urlVisible(), cta = TARJETA.cta;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = fuente(800, 36);
    const ancho = Math.min(W - 120, Math.max(ctx.measureText(marca).width, (ctx.font = fuente(500, 29), ctx.measureText(cta).width)) + 96);
    const x = (W - ancho) / 2, y = yAbajo - ALTO;
    rectRedondo(ctx, x, y, ancho, ALTO, 30);
    ctx.fillStyle = 'rgba(255,255,255,.11)';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255,255,255,.32)';
    ctx.stroke();
    ctx.fillStyle = TINTA;
    ctx.font = fuente(800, 36);
    ctx.fillText(marca, W / 2, y + 40);
    ctx.fillStyle = TINTA_SUAVE;
    ctx.font = fuente(500, 29);
    ctx.fillText(cta, W / 2, y + 80);
    ctx.restore();
  }

  /* ---------- La medalla 3D ---------- */

  let medallaImg = null;        // Image ya cargada, o false si falló
  let medallaCaja = null;       // caja de la moneda dentro del archivo, medida por alfa

  /** Carga el render una sola vez. Prueba el WebP y, si el navegador no lo
      traga, el PNG de respaldo. Si ninguno carga, devuelve null y la tarjeta
      dibuja el anillo plano. */
  function cargarMedalla() {
    if (medallaImg !== null) return Promise.resolve(medallaImg || null);
    const cfg = TARJETA.medalla3d;
    const intentar = (src) => new Promise((ok, ko) => {
      const im = new Image();
      im.onload = () => ok(im);
      im.onerror = () => ko(new Error('no carga ' + src));
      im.src = src;
    });
    return intentar(cfg.src)
      .catch(() => (cfg.respaldo ? intentar(cfg.respaldo) : Promise.reject()))
      .then((im) => { medallaImg = im; return im; })
      .catch(() => { medallaImg = false; return null; });
  }

  /** Mide dónde está la moneda dentro del archivo leyendo su canal alfa. Así
      no hay coordenadas a mano que se rompan al cambiar el render. */
  function medirMedalla(img) {
    if (medallaCaja) return medallaCaja;
    const w = img.naturalWidth, h = img.naturalHeight;
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d');
    g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, w, h).data;
    let x0 = w, y0 = h, x1 = 0, y1 = 0;
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        if (d[(y * w + x) * 4 + 3] > 40) {
          if (x < x0) x0 = x; if (x > x1) x1 = x;
          if (y < y0) y0 = y; if (y > y1) y1 = y;
        }
      }
    }
    medallaCaja = (x1 > x0) ? { x: x0, y: y0, w: x1 - x0, h: y1 - y0 } : { x: 0, y: 0, w, h };
    return medallaCaja;
  }

  /** Dibuja el render, teñido con el color del metal, con la moneda centrada
      en (W/2, cy) y `D` píxeles de ancho. Devuelve el centro real de la cara. */
  function medalla3D(ctx, cy, D, franja) {
    const img = medallaImg;
    const color = franja && franja.color;
    const sombra = (franja && franja.sombra) || 0;
    const caja = medirMedalla(img);
    const esc = D / caja.w;
    const cw = Math.ceil(img.naturalWidth * esc), ch = Math.ceil(img.naturalHeight * esc);

    const c = document.createElement('canvas'); c.width = cw; c.height = ch;
    const g = c.getContext('2d');
    g.drawImage(img, 0, 0, cw, ch);
    let tocado = false;
    if (color && TARJETA.medalla3d.tinte) {
      // El modo 'color' conserva la luminancia del cromo (brillos, sombras,
      // relieve) y le pone el tono y la saturación del metal.
      g.globalCompositeOperation = TARJETA.medalla3d.tinte;
      g.fillStyle = color;
      g.fillRect(0, 0, cw, ch);
      tocado = true;
    }
    if (sombra > 0) {
      // Y como 'color' no toca la luminancia, el metal que debe verse más
      // oscuro (el acero frente al plata) se oscurece aparte, con multiply.
      g.globalCompositeOperation = 'multiply';
      g.fillStyle = `rgba(0,0,0,${sombra})`;
      g.fillRect(0, 0, cw, ch);
      tocado = true;
    }
    if (tocado) {
      // Los rellenos han pintado también el fondo transparente: se recorta
      // otra vez a la silueta de la moneda.
      g.globalCompositeOperation = 'destination-in';
      g.drawImage(img, 0, 0, cw, ch);
      g.globalCompositeOperation = 'source-over';
    }

    const x = W / 2 - (caja.x + caja.w / 2) * esc;
    const y = cy - (caja.y + caja.h / 2) * esc;
    ctx.drawImage(c, x, y);
    return { cx: W / 2, cy };
  }

  /** El número, grabado en la cara: tinta morada oscura con luz arriba a la
      izquierda y sombra abajo a la derecha, que es como se lee un relieve
      sobre metal. Blanco se perdería en los brillos del cromo. */
  function numeroGrabado(ctx, cx, cy, puntaje) {
    const TINTA_GRABADO = '#2b1170';
    const num = String(puntaje);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';

    // Pulido del centro: una luz suave bajo las cifras. Sube la cara justo
    // donde va el número y atenúa los surcos del laurel que caen debajo.
    const pul = ctx.createRadialGradient(cx, cy - 10, 20, cx, cy - 10, 200);
    pul.addColorStop(0, 'rgba(255,255,255,.17)');
    pul.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = pul;
    ctx.beginPath(); ctx.arc(cx, cy - 10, 200, 0, Math.PI * 2); ctx.fill();

    ctx.font = fuente(800, 196);
    // Sombra del relieve
    ctx.fillStyle = 'rgba(20,6,60,.42)';
    ctx.fillText(num, cx + 3, cy - 10 + 4);
    // Luz del relieve
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.fillText(num, cx - 2, cy - 10 - 3);
    // Bisel claro: un trazo fino bajo la tinta que garantiza el borde de la
    // cifra sobre cualquier surco oscuro del grabado. Es lo que hace que un
    // "100" que pisa el laurel siga leyéndose limpio.
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(255,255,255,.62)';
    ctx.strokeText(num, cx, cy - 10);
    // Cifra
    ctx.fillStyle = TINTA_GRABADO;
    ctx.fillText(num, cx, cy - 10);

    ctx.font = fuente(700, 34);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255,255,255,.55)';
    ctx.strokeText('sobre 100', cx, cy + 114);
    ctx.fillStyle = hexA(TINTA_GRABADO, .85);
    ctx.fillText('sobre 100', cx, cy + 114);
    ctx.restore();
  }

  /** La pista de niveles: los cuatro metales de abajo arriba, más el Platino
      cerrado con candado. Es lo que dice "esto es un nivel, y hay uno más". */
  function pistaNiveles(ctx, y, franja) {
    const niveles = [...TARJETA.franjas].reverse();      // Acero → Oro
    const nodos = niveles.map((f) => ({ nombre: f.medalla, color: f.color }));
    nodos.push({ nombre: TARJETA.nivelBloqueado, bloqueado: true });
    const idx = niveles.findIndex((f) => f.desde === franja.desde);
    const PASO = 168, x0 = W / 2 - (nodos.length - 1) * PASO / 2;

    ctx.save();
    ctx.lineCap = 'round';
    // Carril completo, apagado. El último tramo, hacia el Platino, va
    // discontinuo: es otra puerta, no un peldaño pendiente del test.
    ctx.strokeStyle = 'rgba(255,255,255,.16)';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + (nodos.length - 2) * PASO, y); ctx.stroke();
    ctx.setLineDash([6, 9]);
    ctx.strokeStyle = 'rgba(255,255,255,.34)';
    ctx.beginPath(); ctx.moveTo(x0 + (nodos.length - 2) * PASO + 18, y); ctx.lineTo(x0 + (nodos.length - 1) * PASO - 18, y); ctx.stroke();
    ctx.setLineDash([]);
    // Tramo recorrido, del color del metal
    if (idx > 0) {
      ctx.strokeStyle = hexA(franja.color || '#ffffff', .85);
      ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + idx * PASO, y); ctx.stroke();
    }

    nodos.forEach((nd, i) => {
      const x = x0 + i * PASO;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (nd.bloqueado) {
        ctx.strokeStyle = 'rgba(255,255,255,.6)';
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(x, y, 15, 0, Math.PI * 2); ctx.stroke();
        candado(ctx, x, y, 'rgba(255,255,255,.92)');
      } else if (i < idx) {
        ctx.fillStyle = hexA(franja.color || '#ffffff', .85);
        ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.fill();
      } else if (i === idx) {
        const g = ctx.createRadialGradient(x, y, 6, x, y, 40);
        g.addColorStop(0, hexA(nd.color || '#ffffff', .55));
        g.addColorStop(1, hexA(nd.color || '#ffffff', 0));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, 40, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = nd.color || TINTA;
        ctx.beginPath(); ctx.arc(x, y, 17, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = TINTA; ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.arc(x, y, 17, 0, Math.PI * 2); ctx.stroke();
      } else {
        ctx.strokeStyle = 'rgba(255,255,255,.35)';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.stroke();
      }

      ctx.font = fuente(i === idx ? 800 : 700, i === idx ? 30 : 27);
      ctx.fillStyle = i === idx ? TINTA : (nd.bloqueado ? 'rgba(255,255,255,.8)' : TINTA_TENUE);
      textoEspaciado(ctx, nd.nombre.toUpperCase(), x, y + 50, 1.5);
    });
    ctx.restore();
  }

  function candado(ctx, x, y, color) {
    ctx.save();
    ctx.strokeStyle = color; ctx.fillStyle = color;
    ctx.lineWidth = 2.6; ctx.lineCap = 'round';
    // Arco
    ctx.beginPath(); ctx.arc(x, y - 3, 4.6, Math.PI, 0); ctx.stroke();
    // Cuerpo
    rectRedondo(ctx, x - 7, y - 3, 14, 10, 2.5); ctx.fill();
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
    await Promise.all([fuentesListas(), cargarMedalla()]);

    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    const franja = franjaDe(res.puntaje);
    const D = TARJETA.medalla3d.diametro;
    const CY_MEDALLA = 560;   // la moneda va de 310 a 810: no pisa el rótulo de arriba

    fondo(ctx);
    rejilla(ctx);
    haloMetal(ctx, CY_MEDALLA, franja.color);
    lockup(ctx, 84);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = fuente(700, 26);
    ctx.fillStyle = TINTA_TENUE;
    textoEspaciado(ctx, TARJETA.eyebrow.toUpperCase(), W / 2, 234, 6);

    palabraFantasma(ctx, CY_MEDALLA, franja.medalla.toUpperCase(), franja.color);
    motas(ctx, franja.color);

    if (medallaImg) {
      sombraContacto(ctx, CY_MEDALLA, D);
      const centro = medalla3D(ctx, CY_MEDALLA, D, franja);
      numeroGrabado(ctx, centro.cx, centro.cy, res.puntaje);
    } else {
      anillo(ctx, CY_MEDALLA, res.puntaje, franja.color);
    }

    const Y_PISTA = CY_MEDALLA + D / 2 + 130;             // 940
    pistaNiveles(ctx, Y_PISTA, franja);

    /* Todo lo que importa vive dentro de la zona segura de Instagram: por
       debajo de los 250 px de arriba y por encima de los ~280 de abajo. El pie
       termina en 1640. El bloque de texto se mide y se centra en la banda que
       queda entre los rótulos de la pista y el pie; si no cabe, primero se
       aprietan los huecos y después baja el cuerpo del titular. */
    const Y_PIE_ABAJO = 1668;
    const bandaArriba = Y_PISTA + 130, bandaAbajo = Y_PIE_ABAJO - 112 - 56;

    let tamTitular = 58, altoTitular = 74;
    let huecos = { eyebrow: 70, desbloqueo: 52, reto: 66 };
    const ALTO_DESBLOQUEO = 54, ALTO_RETO = 50;
    const textoDesbloqueo = res.caso.desbloqueo || res.caso.limitacion;
    let lTitular, lDesbloqueo, lReto, altoBloque;

    const medir = () => {
      ctx.font = fuente(800, tamTitular);
      lTitular = lineas(ctx, franja.titular, W - 150);
      ctx.font = fuente(700, 42);
      lDesbloqueo = lineas(ctx, textoDesbloqueo, W - 200);
      ctx.font = fuente(500, 38);
      lReto = lineas(ctx, franja.reto, W - 180);
      altoBloque = lTitular.length * altoTitular + huecos.eyebrow + huecos.desbloqueo
        + lDesbloqueo.length * ALTO_DESBLOQUEO + huecos.reto + lReto.length * ALTO_RETO;
    };
    medir();
    const banda = bandaAbajo - bandaArriba;
    if (altoBloque > banda) {
      const f = Math.max(0.6, banda / altoBloque);
      huecos = { eyebrow: Math.round(70 * f), desbloqueo: Math.round(52 * f), reto: Math.round(66 * f) };
      medir();
    }
    if (altoBloque > banda) { tamTitular = 52; altoTitular = 66; medir(); }

    let y = bandaArriba + Math.max(0, (banda - altoBloque) / 2);

    ctx.font = fuente(800, tamTitular);
    ctx.fillStyle = TINTA;
    lTitular.forEach((l, i) => ctx.fillText(l, W / 2, y + i * altoTitular));
    y += lTitular.length * altoTitular + huecos.eyebrow;

    ctx.font = fuente(700, 25);
    ctx.fillStyle = TINTA_TENUE;
    textoEspaciado(ctx, TARJETA.etiquetaDesbloqueo.toUpperCase(), W / 2, y, 5);
    y += huecos.desbloqueo;

    ctx.font = fuente(700, 42);
    ctx.fillStyle = TINTA;
    lDesbloqueo.forEach((l, i) => ctx.fillText(l, W / 2, y + i * ALTO_DESBLOQUEO));
    y += lDesbloqueo.length * ALTO_DESBLOQUEO + huecos.reto;

    ctx.font = fuente(500, 38);
    ctx.fillStyle = TINTA_SUAVE;
    lReto.forEach((l, i) => ctx.fillText(l, W / 2, y + i * ALTO_RETO));

    pie(ctx, Y_PIE_ABAJO);

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
