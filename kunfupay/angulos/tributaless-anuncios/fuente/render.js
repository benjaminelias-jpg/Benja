// Exporta los anuncios de Tributaless a JPG de 1080 × 1350.
// Uso, desde esta carpeta:  node render.js [carpeta de salida]
// Necesita Playwright:  npm i -D playwright && npx playwright install chromium
// Si ya tienes Chromium instalado, puedes indicarlo con CHROMIUM_PATH=/ruta/al/chrome
const path = require('path');
const { chromium } = require('playwright');

const ANUNCIOS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'R1', 'R2'];
const salida = path.resolve(process.argv[2] || path.join(__dirname, '..'));

(async () => {
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
  );
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
  for (const k of ANUNCIOS) {
    await page.goto('file://' + path.join(__dirname, k + '.html'), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const destino = path.join(salida, `TRIB_${k}_1080x1350.jpg`);
    await page.screenshot({ path: destino, type: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
    console.log('ok', destino);
  }
  await browser.close();
})();
