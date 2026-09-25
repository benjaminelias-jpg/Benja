/* Genera las medallas que usa el correo, con la MISMA tarjeta de la landing.
 *
 *   node medallas/generar-medallas.js <carpeta-de-salida>
 *
 * Requiere Playwright y un servidor estático en la raíz del repo:
 *   python3 -m http.server 8244   (desde la raíz del repo)
 *
 * Por cada par (puntaje mostrado, caso) que el motor puede producir —215,
 * sacados del oráculo de la landing publicada— salen dos archivos:
 *   cbs-<puntaje>-<caso>.jpg         la tarjeta completa, 1080 × 1920 (adjunto)
 *   cbs-<puntaje>-<caso>-correo.jpg  la cabecera del correo: la tarjeta hasta
 *                                    el reto, con el borde de la hoja blanca
 *                                    ya dibujado abajo (opción D).
 */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');

const RAIZ = path.resolve(__dirname, '..', '..');
const SALIDA = path.resolve(process.argv[2] || path.join(__dirname, 'salida'));
const URL_HARNESS = 'http://localhost:8244/2026-09-25-correo-creator-business-score/medallas/harness.html';
const FUENTES = process.env.CBS_FUENTES; // carpeta con jakarta.css + .woff2 (opcional, sin red)

const oraculo = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'pruebas', 'oraculo-landing-v1.json'), 'utf8'));
const pares = [...new Set(oraculo.combinaciones.map((c) => c.visible + '|' + c.caso))]
  .map((k) => { const [v, caso] = k.split('|'); return { v: Number(v), caso }; })
  .sort((a, b) => a.v - b.v || a.caso.localeCompare(b.caso));

(async () => {
  fs.mkdirSync(SALIDA, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext();
  if (FUENTES) {
    await ctx.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: fs.readFileSync(path.join(FUENTES, 'jakarta.css'), 'utf8') }));
    await ctx.route('https://fonts.gstatic.com/**', (r) => {
      const f = path.join(FUENTES, path.basename(new URL(r.request().url()).pathname));
      fs.existsSync(f) ? r.fulfill({ status: 200, contentType: 'font/woff2', body: fs.readFileSync(f) }) : r.abort();
    });
  }
  const p = await ctx.newPage();
  const errores = [];
  p.on('pageerror', (e) => errores.push(String(e)));
  await p.goto(URL_HARNESS, { waitUntil: 'networkidle' });

  let hechos = 0;
  for (const { v, caso } of pares) {
    const out = await p.evaluate(async ({ v, caso }) => {
      const c = await CBSTarjeta.dibujar({ puntaje: v, caso: CASOS[caso] });
      const aJpeg = (canvas, q) => canvas.toDataURL('image/jpeg', q).split(',')[1];

      // Cabecera del correo. El texto de la tarjeta termina siempre en la fila
      // 1465 (medido en las 40 combinaciones caso × metal); la hoja blanca
      // arranca en 1500, así el reto se ve entero y el pie queda tapado.
      const CORTE = 1500, HOJA = 64, RADIO = 64;
      const h = document.createElement('canvas');
      h.width = 1080; h.height = CORTE + HOJA;
      const g = h.getContext('2d');
      g.drawImage(c, 0, 0);
      g.save();
      g.shadowColor = 'rgba(36, 12, 102, .6)';
      g.shadowBlur = 90; g.shadowOffsetY = -24;
      g.fillStyle = '#ffffff';
      g.beginPath();
      g.moveTo(0, CORTE + RADIO);
      g.arcTo(0, CORTE, RADIO, CORTE, RADIO);
      g.lineTo(1080 - RADIO, CORTE);
      g.arcTo(1080, CORTE, 1080, CORTE + RADIO, RADIO);
      g.lineTo(1080, h.height + 200);
      g.lineTo(0, h.height + 200);
      g.closePath();
      g.fill();
      g.restore();
      return { completa: aJpeg(c, 0.92), correo: aJpeg(h, 0.86) };
    }, { v, caso });
    fs.writeFileSync(path.join(SALIDA, `cbs-${v}-${caso}.jpg`), Buffer.from(out.completa, 'base64'));
    fs.writeFileSync(path.join(SALIDA, `cbs-${v}-${caso}-correo.jpg`), Buffer.from(out.correo, 'base64'));
    hechos++;
    if (hechos % 25 === 0) console.log(`${hechos}/${pares.length}`);
  }
  console.log(`listo: ${hechos} pares → ${hechos * 2} archivos en ${SALIDA}`);
  if (errores.length) console.log('errores de página:', errores);
  await b.close();
})();
