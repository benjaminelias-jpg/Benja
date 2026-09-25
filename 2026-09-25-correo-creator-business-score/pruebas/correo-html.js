/* Genera los tres correos de muestra en la versión 100 % HTML (sin imagen)
 * y sus capturas en móvil y escritorio.
 *
 *   node pruebas/correo-html.js [nombre-para-la-muestra-que-califica]
 */
const fs = require('fs'), path = require('path');
const { crearEntorno } = require('./entorno');


const SALIDA = path.join(__dirname, '..', 'muestras');
const { api } = crearEntorno();
const NOMBRE = process.argv[2] || 'Ana López';

const MUESTRAS = [
  { archivo: 'correo-html-califica', nombre: NOMBRE, i: { audiencia: 3, ritmo: 3, modelo: 4, facturacion: 3, limitacion: 4 } },
  { archivo: 'correo-html-fase-de-ordenar', nombre: 'Luis Pérez', i: { audiencia: 1, ritmo: 0, modelo: 1, facturacion: 0, limitacion: 0 } },
  { archivo: 'correo-html-fuera-de-perfil', nombre: 'Eva Ruiz', i: { audiencia: 2, ritmo: 2, modelo: 5, facturacion: 2, limitacion: 2 } }
];

(async () => {
  fs.mkdirSync(SALIDA, { recursive: true });
  const hechos = [];
  for (const m of MUESTRAS) {
    const r = {};
    api.PREGUNTAS.forEach((p) => { r[p.id] = p.opciones[m.i[p.id]]; });
    const res = api.evaluar(r);
    const correo = api.construirCorreoHtml(res, { nombre: m.nombre, email: 'x@y.z' }, 'hola@kunfupay.com');
    fs.writeFileSync(path.join(SALIDA, m.archivo + '.html'), correo.html);
    fs.writeFileSync(path.join(SALIDA, m.archivo + '.txt'), 'Asunto: ' + correo.asunto + '\n\n' + correo.texto);
    hechos.push({ ...m, res });
    console.log(`${m.archivo}: ${res.puntajeVisible}/100 ${res.franja.medalla} · caso ${res.claveCaso} · ${res.desenlace} · ${correo.html.length} bytes · asunto: "${correo.asunto}"`);
  }
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { console.log('(sin Playwright: no hay capturas)'); return; }
  const b = await chromium.launch();
  for (const [modo, w, escala] of [['escritorio', 720, 1], ['movil', 390, 2]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: escala });
    const p = await ctx.newPage();
    for (const m of hechos) {
      await p.goto('file://' + path.join(SALIDA, m.archivo + '.html'));
      await p.waitForTimeout(400);
      await p.screenshot({ path: path.join(SALIDA, `${m.archivo}-${modo}.png`), fullPage: true });
    }
    await ctx.close();
  }
  await b.close();
  console.log('capturas en ' + SALIDA);
})();
