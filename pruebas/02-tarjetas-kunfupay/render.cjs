// Captura la composición fotograma a fotograma, en paralelo.
//
// Motion blur adaptativo: para cada fotograma se mide cuánto se mueven los elementos
// dentro del obturador (180°, fase −90°) y se toman entre 1 y MAX_SAMPLES muestras;
// post.py las promedia.
//
// Uso:
//   NODE_PATH=$(npm root -g) node render.cjs <carpeta_salida> [--workers 3] [--only 40,145,230]
//   --only renderiza solo esos fotogramas, sin motion blur (para revisar el layout).
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const FPS = 30;
const FRAMES = 650;
const MAX_SAMPLES = 10;
const PX_PER_SAMPLE = 4;   // una muestra cada 4 px de recorrido dentro del obturador

const args = process.argv.slice(2);
const out = args[0];
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const workers = Number(opt("--workers", 3));
const only = opt("--only", null);
const frames = only ? only.split(",").map(Number) : [...Array(FRAMES).keys()];

async function openPage() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto("file://" + path.resolve(__dirname, "index.html"));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
  await page.evaluate(() => Promise.all([...document.images].map(i => i.decode())));
  await page.evaluate(() => window.setup());
  const cdp = await page.context().newCDPSession(page);
  const shot = async file => {
    const { data } = await cdp.send("Page.captureScreenshot", { format: "png", optimizeForSpeed: true });
    if (file) fs.writeFileSync(file, Buffer.from(data, "base64"));
  };
  // Calentamiento: pinta los fotogramas con brillo especular para que las máscaras CSS ya estén cargadas
  for (const f of [214, 346, 488]) {
    await page.evaluate(t => window.render(t), f / FPS);
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    await shot(null);
  }
  return { browser, page, shot };
}

async function runWorker(list, id) {
  const { browser, page, shot } = await openPage();
  const manifest = {};
  for (const n of list) {
    let S = 1;
    if (!only) {
      const t0 = (n - 0.25) / FPS, t1 = (n + 0.25) / FPS;
      const a = await page.evaluate(t => window.motionRects(t), t0);
      const b = await page.evaluate(t => window.motionRects(t), t1);
      let d = 0;
      a.forEach((r, i) => r.forEach((v, j) => { d = Math.max(d, Math.abs(v - b[i][j])); }));
      S = Math.min(MAX_SAMPLES, Math.max(1, Math.ceil(d / PX_PER_SAMPLE)));
    }
    for (let k = 0; k < S; k++) {
      const t = S === 1 ? n / FPS : (n - 0.25 + 0.5 * (k + 0.5) / S) / FPS;
      await page.evaluate(t => window.render(t), t);
      await shot(path.join(out, `f${String(n).padStart(4, "0")}_${String(k).padStart(2, "0")}.png`));
    }
    manifest[n] = S;
    if (n % 25 === 0) process.stdout.write(`[w${id}] f${n} (${S}) `);
  }
  await browser.close();
  return manifest;
}

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const lists = [...Array(workers)].map((_, w) => frames.filter((_, i) => i % workers === w));
  const parts = await Promise.all(lists.map((l, w) => runWorker(l, w)));
  const manifest = Object.assign({}, ...parts);
  fs.writeFileSync(path.join(out, "manifest.json"), JSON.stringify(manifest));
  const total = Object.values(manifest).reduce((a, b) => a + b, 0);
  console.log(`\nlisto: ${Object.keys(manifest).length} fotogramas, ${total} capturas`);
})();
