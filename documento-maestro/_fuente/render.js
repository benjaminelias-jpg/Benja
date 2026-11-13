// Uso: node render.js <entrada.html> <salida.pdf> "<pie de página>"
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [html, pdf, pie] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 643, height: 900 } });
  await page.goto('file://' + path.resolve(html), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => window.dibujarPizarras && window.dibujarPizarras());
  const rotas = await page.evaluate(() => [...document.images].filter(i => !i.naturalWidth).map(i => i.src));
  if (rotas.length) console.log('IMAGENES ROTAS:', rotas.join('\n'));
  const pieHtml = `<div style="font-family:Inter,Arial,sans-serif;font-size:7.5px;color:#888;width:100%;padding:0 20mm;display:flex;justify-content:space-between;"><span>${pie || ''}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;
  await page.pdf({ path: pdf, format: 'A4', printBackground: true, displayHeaderFooter: true,
    headerTemplate: '<div></div>', footerTemplate: pieHtml,
    margin: { top: '17mm', bottom: '19mm', left: '20mm', right: '20mm' } });
  await browser.close();
  console.log('ok', pdf);
})();
