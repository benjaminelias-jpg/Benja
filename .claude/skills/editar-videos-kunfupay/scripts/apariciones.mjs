// ¿Cuándo APARECE cada infografía? Recorre la línea de tiempo de una composición HyperFrames a 15 fps y anota el instante
// en que cada elemento gráfico (con id) o cada ítem interno (filas, checks, avatares, chips…) pasa a verse (opacidad efectiva
// ≥ 0,5 y tamaño real). Es la lista de momentos en los que PUEDE sonar un efecto: nada fuera de ella. Uso:
//   node apariciones.mjs DIR_COMPOSICION [--fuera "root,main,cam,…"] [--items ".rowx,.ck,…"] > apariciones.json
import { readdirSync, existsSync } from "fs";
import { homedir } from "os";
import path from "path";
import { createRequire } from "module";

const args = process.argv.slice(2);
const dir = path.resolve(args[0] || ".");
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const FUERA = opt("--fuera", "root,main,cam,vw,bgimg,rst,persona,grade,flash,sub-layer").split(",");
const ITEMS = opt("--items", ".rowx,.ck,.ava,.chipx,.field,.mb,.mon,.stamp,.pill,.tt,.cb,.logo-pill,.bar");
const FPS = 15;

function findPuppeteer() {
  const base = path.join(homedir(), ".npm/_npx");
  for (const d of existsSync(base) ? readdirSync(base) : []) {
    const p = path.join(base, d, "node_modules/puppeteer-core");
    if (existsSync(p)) return p;
  }
  throw new Error("No encuentro puppeteer-core (ejecuta antes cualquier `npx hyperframes`).");
}
function findChrome() {
  const base = path.join(homedir(), ".cache/hyperframes/chrome/chrome-headless-shell");
  for (const v of readdirSync(base)) for (const sub of readdirSync(path.join(base, v))) {
    const exe = path.join(base, v, sub, "chrome-headless-shell");
    if (existsSync(exe)) return exe;
  }
  throw new Error("No encuentro chrome-headless-shell de hyperframes.");
}
const require = createRequire(import.meta.url);
const puppeteer = require(findPuppeteer());
const browser = await puppeteer.launch({ executablePath: findChrome(), args: ["--allow-file-access-from-files"] });
const page = await browser.newPage();
await page.goto("file://" + path.join(dir, "index.html"), { waitUntil: "load", timeout: 60000 });
const { w, h } = await page.evaluate(() => { const r = document.querySelector("[data-composition-id]"); return { w: +r.dataset.width, h: +r.dataset.height }; });
await page.setViewport({ width: w, height: h });
for (let i = 0; i < 80; i++) { if (await page.evaluate(() => !!(window.__timelines && window.__timelines.main))) break; await new Promise((r) => setTimeout(r, 500)); }
const dur = await page.evaluate(() => window.__timelines.main.duration());

const prev = {}, out = [];
for (let f = 0; f <= dur * FPS; f++) {
  const t = f / FPS;
  const vis = await page.evaluate((t, FUERA, ITEMS, W, H) => {
    window.__timelines.main.seek(t, false);
    const op = (el) => { let o = 1; for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden") return 0; o *= parseFloat(cs.opacity); } return o; };
    const res = {};
    const els = [...document.querySelectorAll("[id]")].filter((e) => !FUERA.includes(e.id) && !e.closest("#persona,#sub-layer"));
    for (const e of els) {
      const r = e.getBoundingClientRect();
      const on = op(e) >= .5 && r.width > 8 && r.height > 8 && r.right > 0 && r.left < W && r.bottom > 0 && r.top < H;
      res["#" + e.id] = on ? 1 : 0;
    }
    document.querySelectorAll(ITEMS).forEach((e, i) => {
      const r = e.getBoundingClientRect(); const host = e.closest("[id]");
      const on = op(e) >= .5 && r.width > 8 && r.height > 8 && r.right > 0 && r.left < W && r.bottom > 0 && r.top < H;
      res[(host ? "#" + host.id : "") + " " + e.className.split(" ")[0] + "[" + i + "]"] = on ? 1 : 0;
    });
    return res;
  }, t, FUERA, ITEMS, w, h);
  for (const [k, v] of Object.entries(vis)) {
    if (v && !prev[k]) out.push([+t.toFixed(3), k]);
    prev[k] = v;
  }
}
await browser.close();
console.log(JSON.stringify({ dur, fps: FPS, apariciones: out }, null, 0));
