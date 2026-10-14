// Captura la composición fotograma a fotograma.
// Motion blur real: en los tramos con movimiento rápido se toman varias muestras
// dentro del obturador (180°, fase −90°) y post.py las promedia.
//
// Uso: NODE_PATH=$(npm root -g) node render.cjs <carpeta_salida> [fotogramas sueltos...]
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const FPS = 30;
const FRAMES = 150;      // 5 s
const SAMPLES = 16;      // muestras por fotograma en los tramos rápidos
const out = process.argv[2];
const only = process.argv.slice(3).map(Number);

// Tramos con movimiento rápido: entradas (f19–f44) y salidas (f122–f140)
const needsBlur = n => (n >= 19 && n <= 44) || (n >= 122 && n <= 140);

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto("file://" + path.resolve(__dirname, "index.html"));
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => { window.align(); });

  const frames = only.length ? only : [...Array(FRAMES).keys()];
  const manifest = {};
  for (const n of frames) {
    const S = needsBlur(n) ? SAMPLES : 1;
    manifest[n] = S;
    for (let k = 0; k < S; k++) {
      // Obturador de 180°: ventana de medio fotograma centrada en el fotograma
      const t = S === 1 ? n / FPS : (n - 0.25 + 0.5 * (k + 0.5) / S) / FPS;
      await page.evaluate(t => window.render(t), t);
      const file = path.join(out, `f${String(n).padStart(4, "0")}_${String(k).padStart(2, "0")}.png`);
      await page.screenshot({ path: file, type: "png", clip: { x: 0, y: 0, width: 1080, height: 1920 } });
    }
    if (n % 10 === 0) process.stdout.write(`f${n} `);
  }
  fs.writeFileSync(path.join(out, "manifest.json"), JSON.stringify(manifest));
  await browser.close();
  console.log("\nlisto");
})();
