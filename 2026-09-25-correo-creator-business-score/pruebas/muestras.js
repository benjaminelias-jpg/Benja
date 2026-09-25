/* Genera los tres correos de muestra (los tres desenlaces) como HTML
 * autocontenido —la medalla va incrustada en base64— y sus capturas.
 *
 *   node pruebas/muestras.js <carpeta-de-medallas> [carpeta-de-fuentes]
 */
const fs = require('fs'), path = require('path');
const { crearEntorno } = require('./entorno');

const MEDALLAS = process.argv[2];
const FUENTES = process.argv[3];
const SALIDA = path.join(__dirname, '..', 'muestras');
const { api } = crearEntorno();

const MUESTRAS = [
  { archivo: 'correo-califica', nombre: 'Ana López', i: { audiencia: 3, ritmo: 3, modelo: 4, facturacion: 3, limitacion: 4 } },
  { archivo: 'correo-fase-de-ordenar', nombre: 'Luis Pérez', i: { audiencia: 1, ritmo: 0, modelo: 1, facturacion: 0, limitacion: 0 } },
  { archivo: 'correo-fuera-de-perfil', nombre: 'Eva Ruiz', i: { audiencia: 2, ritmo: 2, modelo: 5, facturacion: 2, limitacion: 2 } }
];

(async () => {
  fs.mkdirSync(SALIDA, { recursive: true });
  const hechos = [];
  for (const m of MUESTRAS) {
    const r = {};
    api.PREGUNTAS.forEach((p) => { r[p.id] = p.opciones[m.i[p.id]]; });
    const res = api.evaluar(r);
    const n = api.nombresMedalla(res);
    const src = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(MEDALLAS, n.cabecera)).toString('base64');
    const correo = api.construirCorreo(res, { nombre: m.nombre, email: 'x@y.z' }, { src, descarga: '', adjuntos: [{}] });
    fs.writeFileSync(path.join(SALIDA, m.archivo + '.html'), correo.html);
    fs.writeFileSync(path.join(SALIDA, m.archivo + '.txt'), 'Asunto: ' + correo.asunto + '\n\n' + correo.texto);
    hechos.push({ ...m, asunto: correo.asunto, res });
    console.log(`${m.archivo}: ${res.puntajeVisible}/100 ${res.franja.medalla} · caso ${res.claveCaso} · ${res.desenlace} · asunto: "${correo.asunto}"`);
  }

  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { console.log('(sin Playwright: no hay capturas)'); return; }
  const b = await chromium.launch();
  for (const [modo, w, escala] of [['escritorio', 720, 1], ['movil', 390, 2]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: escala });
    if (FUENTES) {
      await ctx.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: fs.readFileSync(path.join(FUENTES, 'jakarta.css'), 'utf8') }));
      await ctx.route('https://fonts.gstatic.com/**', (r) => { const f = path.join(FUENTES, path.basename(new URL(r.request().url()).pathname)); fs.existsSync(f) ? r.fulfill({ status: 200, contentType: 'font/woff2', body: fs.readFileSync(f) }) : r.abort(); });
    }
    const p = await ctx.newPage();
    for (const m of hechos) {
      await p.goto('file://' + path.join(SALIDA, m.archivo + '.html'));
      await p.waitForTimeout(300);
      await p.screenshot({ path: path.join(SALIDA, `${m.archivo}-${modo}.png`), fullPage: true });
    }
    await ctx.close();
  }
  await b.close();
  console.log('capturas en ' + SALIDA);
})();
