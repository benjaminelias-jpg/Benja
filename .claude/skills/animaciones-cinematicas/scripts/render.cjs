// Captura una composición (plantilla) fotograma a fotograma con motion blur adaptativo.
//
// La composición debe exponer:
//   window.COMP = { fps, frames, cues, warnings, warmup: [fotogramas], moving: () => [elementos], ready: true }
//   window.render(t)   // dibuja el estado exacto en el segundo t
//
// Para cada fotograma mide cuánto se mueven los elementos dentro del obturador (180°, fase −90°)
// y toma de 1 a MAX_SAMPLES muestras; post.py las promedia. También escribe build_info.json
// (duración, señales de audio, avisos) en la carpeta del proyecto.
//
// Uso:
//   node render.cjs <proyecto> <salida> [--workers 3] [--only 40,145,230]
//   --only renderiza solo esos fotogramas, sin motion blur (para revisar el layout rápido).
const fs = require("fs");
const path = require("path");

let chromium;
try { ({ chromium } = require("playwright")); }
catch {
  const g = require("child_process").execSync("npm root -g").toString().trim();
  ({ chromium } = require(path.join(g, "playwright")));
}

const MAX_SAMPLES = 10;
const PX_PER_SAMPLE = 4;

const args = process.argv.slice(2);
const project = path.resolve(args[0]);
const out = path.resolve(args[1]);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const workers = Number(opt("--workers", 3));
const only = opt("--only", null);

async function openPage() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on("pageerror", e => console.error("[página]", e.message));
  await page.goto("file://" + path.join(project, "index.html"));
  await page.waitForFunction(() => window.COMP && (window.COMP.ready || window.COMP.error), null, { timeout: 60000 });
  const err = await page.evaluate(() => window.COMP.error);
  if (err) throw new Error("La composición falló:\n" + err);
  await page.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))));
  const cdp = await page.context().newCDPSession(page);
  const shot = async file => {
    const { data } = await cdp.send("Page.captureScreenshot", { format: "png", optimizeForSpeed: true });
    if (file) fs.writeFileSync(file, Buffer.from(data, "base64"));
  };
  // Calentamiento: pinta fotogramas con máscaras CSS para que ya estén cargadas al capturar
  const info = await page.evaluate(() => ({ fps: window.COMP.fps, warmup: window.COMP.warmup || [] }));
  for (const f of info.warmup) {
    await page.evaluate(t => window.render(t), f / info.fps);
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    await shot(null);
  }
  return { browser, page, shot };
}

async function motionPx(page, t0, t1) {
  const rects = t => page.evaluate(t => {
    window.render(t);
    return window.COMP.moving().map(e => { const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; });
  }, t);
  const a = await rects(t0), b = await rects(t1);
  let d = 0;
  a.forEach((r, i) => r.forEach((v, j) => { d = Math.max(d, Math.abs(v - b[i][j])); }));
  return d;
}

async function runWorker(list, id, fps) {
  const { browser, page, shot } = await openPage();
  const manifest = {};
  for (const n of list) {
    const S = only ? 1 : Math.min(MAX_SAMPLES, Math.max(1, Math.ceil(await motionPx(page, (n - 0.25) / fps, (n + 0.25) / fps) / PX_PER_SAMPLE)));
    for (let k = 0; k < S; k++) {
      const t = S === 1 ? n / fps : (n - 0.25 + 0.5 * (k + 0.5) / S) / fps;
      await page.evaluate(t => window.render(t), t);
      await shot(path.join(out, `f${String(n).padStart(4, "0")}_${String(k).padStart(2, "0")}.png`));
    }
    manifest[n] = S;
    if (n % 50 === 0) process.stdout.write(`[w${id}] f${n} `);
  }
  await browser.close();
  return manifest;
}

(async () => {
  fs.mkdirSync(out, { recursive: true });
  // Leer la composición una vez: duración, señales de audio y avisos
  const probe = await openPage();
  const comp = await probe.page.evaluate(() => ({
    fps: window.COMP.fps, frames: window.COMP.frames, cues: window.COMP.cues || [],
    timeline: window.COMP.timeline || null, warnings: window.COMP.warnings || [],
  }));
  await probe.browser.close();
  fs.writeFileSync(path.join(project, "build_info.json"), JSON.stringify(comp, null, 2));
  for (const w of comp.warnings) console.warn("AVISO:", w);
  console.log(`Composición: ${comp.frames} fotogramas a ${comp.fps} fps (${(comp.frames / comp.fps).toFixed(2)} s), ${comp.cues.length} señales de audio`);

  const frames = only ? only.split(",").map(Number) : [...Array(comp.frames).keys()];
  const lists = [...Array(Math.min(workers, frames.length))].map((_, w) => frames.filter((_, i) => i % workers === w));
  const parts = await Promise.all(lists.map((l, w) => runWorker(l, w, comp.fps)));
  const manifest = Object.assign({}, ...parts);
  fs.writeFileSync(path.join(out, "manifest.json"), JSON.stringify(manifest));
  const total = Object.values(manifest).reduce((a, b) => a + b, 0);
  console.log(`\nlisto: ${Object.keys(manifest).length} fotogramas, ${total} capturas`);
})().catch(e => { console.error(e.message || e); process.exit(1); });
