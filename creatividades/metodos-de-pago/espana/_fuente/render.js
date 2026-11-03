// node render.js <dir_html> <dir_png>: pasa cada ES-*.html a PNG con su tamaño.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const [src, dst] = process.argv.slice(2);
  const b = await chromium.launch();
  for (const f of fs.readdirSync(src).filter(f => f.endsWith('.html')).sort()) {
    const h = Number(f.match(/1080x(\d+)/)[1]);
    const p = await b.newPage({ viewport: { width: 1080, height: h }, deviceScaleFactor: 1 });
    await p.goto('file://' + path.join(src, f), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(dst, f.replace('.html', '.png')) });
    await p.close();
  }
  await b.close();
})();
