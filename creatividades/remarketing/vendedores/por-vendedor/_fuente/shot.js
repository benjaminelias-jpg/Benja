const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const jobs = fs.readFileSync(0, 'utf8').trim().split('\n').map(l => l.split(' '));
  const b = await chromium.launch();
  for (const [file, w, h, out] of jobs) {
    const p = await b.newPage({ viewport: { width: +w, height: +h } });
    await p.goto('file://' + file, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(400);
    await p.screenshot({ path: out });
    await p.close();
  }
  await b.close();
})();
