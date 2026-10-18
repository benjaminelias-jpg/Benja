// Render determinista: Chromium headless abre index.html y captura cada frame (1080×1920, 30 fps).
// Uso:
//   node render.mjs hook1 frames <out_dir> 30,150,330          -> PNG de frames sueltos (pruebas de estilo)
//   node render.mjs all <out_dir> [workers]               -> todos los frames en JPEG (calidad 97)
//   node render.mjs meta <out.json>                       -> exporta eventos SFX y duración
import { chromium } from './node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
const here = path.dirname(new URL(import.meta.url).pathname);
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const [, , V, mode, out, arg] = process.argv;   // V = hook1 | hook2

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error('PAGE ERROR', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await page.goto('file://' + path.join(here, 'index.html') + '?v=' + V);
  await page.waitForFunction(() => window.ready === true, null, { timeout: 60000 });
  return page;
}
const launch = () => chromium.launch({ executablePath: CHROME, args: ['--allow-file-access-from-files', '--disable-gpu-vsync', '--force-color-profile=srgb'] });

if (mode === 'meta') {
  const b = await launch(); const p = await openPage(b);
  const meta = await p.evaluate(() => ({ sfx: window.SFX, duration: window.DURATION, t_end: window.T_END }));
  fs.writeFileSync(out, JSON.stringify(meta, null, 1)); await b.close();
} else if (mode === 'frames') {
  fs.mkdirSync(out, { recursive: true });
  const b = await launch(); const p = await openPage(b);
  for (const f of arg.split(',').map(Number)) {
    await p.evaluate((i) => window.renderFrame(i), f);
    await p.screenshot({ path: path.join(out, `t${String(f).padStart(5, '0')}.png`) });
  }
  await b.close();
} else if (mode === 'range') {   // re-render parcial: frames [a, b)
  const [a, b] = arg.split(',').map(Number);
  const br = await launch(); const p = await openPage(br); const cdp = await p.context().newCDPSession(p);
  for (let i = a; i < b; i++) {
    await p.evaluate((k) => window.renderFrame(k), i);
    const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 97, captureBeyondViewport: false });
    fs.writeFileSync(path.join(out, `r${String(i).padStart(5, '0')}.jpg`), Buffer.from(data, 'base64'));
  }
  await br.close();
} else if (mode === 'all') {
  fs.mkdirSync(out, { recursive: true });
  const workers = Number(arg || 4);
  const b0 = await launch(); const p0 = await openPage(b0);
  const dur = await p0.evaluate(() => window.DURATION); await b0.close();
  const total = Math.round(dur * 30);
  const chunk = Math.ceil(total / workers);
  const t0 = Date.now();
  let done = 0;
  await Promise.all([...Array(workers).keys()].map(async (w) => {
    const b = await launch(); const p = await openPage(b);
    const cdp = await p.context().newCDPSession(p);
    for (let i = w * chunk; i < Math.min(total, (w + 1) * chunk); i++) {
      await p.evaluate((k) => window.renderFrame(k), i);
      const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 97, captureBeyondViewport: false });
      fs.writeFileSync(path.join(out, `r${String(i).padStart(5, '0')}.jpg`), Buffer.from(data, 'base64'));
      if (++done % 60 === 0) console.log(`${done}/${total} frames · ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
    }
    await b.close();
  }));
  console.log('total', total, 'frames en', ((Date.now() - t0) / 1000).toFixed(1), 's');
}
