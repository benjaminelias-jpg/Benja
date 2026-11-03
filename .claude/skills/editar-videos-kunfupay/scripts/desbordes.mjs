// Desbordes medidos en una composición HyperFrames: cada svg/img/bloque dentro de una tarjeta visible se compara
// con el rectángulo de su tarjeta en cada tramo de N segundos. Uso:
//   node desbordes.mjs DIR_COMPOSICION [--paso 5] [--tarjeta ".card,.glass,.win,.cover"] [--tol 2]
// Necesita puppeteer-core (lo trae la caché de npx de hyperframes) y el Chrome de ~/.cache/hyperframes.
import { readdirSync, existsSync } from "fs";
import { homedir } from "os";
import path from "path";
import { createRequire } from "module";

const args = process.argv.slice(2);
const dir = path.resolve(args[0] || ".");
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const PASO = parseFloat(opt("--paso", "5")), TOL = parseFloat(opt("--tol", "2"));
const TARJ = opt("--tarjeta", ".card,.glass,.win,.cover,.logo-pill");

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
  for (const v of readdirSync(base)) {
    for (const sub of readdirSync(path.join(base, v))) {
      const exe = path.join(base, v, sub, "chrome-headless-shell");
      if (existsSync(exe)) return exe;
    }
  }
  throw new Error("No encuentro chrome-headless-shell de hyperframes.");
}

const require = createRequire(import.meta.url);
const puppeteer = require(findPuppeteer());
const browser = await puppeteer.launch({ executablePath: findChrome(), args: ["--allow-file-access-from-files", "--autoplay-policy=no-user-gesture-required"] });
const page = await browser.newPage();
const logs = []; page.on("console", (m) => logs.push(m.type() + ": " + m.text())); page.on("pageerror", (e) => logs.push("pageerror: " + e.message));
const html = path.join(dir, "index.html");
await page.goto("file://" + html, { waitUntil: "load", timeout: 60000 });
const { w, h } = await page.evaluate(() => { const r = document.querySelector("[data-composition-id]"); return { w: +r.dataset.width, h: +r.dataset.height }; });
await page.setViewport({ width: w, height: h });
let ready = false;
for (let i = 0; i < 80 && !ready; i++) {      // espera a la línea de tiempo (waitForFunction se cuelga con file://)
  ready = await page.evaluate(() => !!(window.__timelines && window.__timelines.main));
  if (!ready) await new Promise((r) => setTimeout(r, 500));
}
if (!ready) { console.error("La composición no arrancó:\n" + logs.slice(0, 15).join("\n")); await browser.close(); process.exit(1); }
const dur = await page.evaluate(() => window.__timelines.main.duration());

const out = [];
// se mide cada 0,5 s (es barato: no renderiza vídeo) y se informa agrupado en tramos de PASO segundos
for (let t = 0.25; t < dur; t += PASO) {
  for (let k = 0; k < PASO * 2; k++) {
    const tt = t + k * 0.5;
    if (tt >= dur) continue;
    const res = await page.evaluate((tt, TARJ, TOL, W, H) => {
      window.__timelines.main.seek(tt, false);
      const vis = (el) => { for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < .15) return false; } return true; };
      const name = (el) => el.id ? "#" + el.id : (el.closest("[id]") ? "#" + el.closest("[id]").id + " " : "") + el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : "");
      const found = [];
      for (const card of document.querySelectorAll(TARJ)) {
        if (!vis(card)) continue;
        const r = card.getBoundingClientRect();
        if (r.width < 20) continue;
        // tarjeta pegada o fuera del lienzo
        const m = Math.min(r.left, r.top, W - r.right, H - r.bottom);
        if (m < 40) found.push({ tipo: "tarjeta junto al borde del vídeo", el: name(card), px: Math.round(m) });
        for (const ch of card.querySelectorAll("svg, img, div, span, i, b")) {
          if (!vis(ch)) continue;
          const c = ch.getBoundingClientRect();
          if (c.width < 2 || c.height < 2) continue;
          const over = Math.max(r.left - c.left, c.right - r.right, r.top - c.top, c.bottom - r.bottom);
          if (over > TOL) found.push({ tipo: "se sale de su tarjeta", el: name(ch), tarjeta: name(card), px: Math.round(over) });
          // contenido de un svg (paths) que sobresale de la caja del svg
          if (ch.tagName === "svg") {
            for (const p of ch.querySelectorAll("path, line, rect, g")) {
              const q = p.getBoundingClientRect(); if (!q.width && !q.height) continue;
              const o2 = Math.max(r.left - q.left, q.right - r.right, r.top - q.top, q.bottom - r.bottom);
              if (o2 > TOL + 2) found.push({ tipo: "trazo del gráfico fuera de la tarjeta", el: name(ch) + " " + p.tagName, tarjeta: name(card), px: Math.round(o2) });
            }
          }
        }
      }
      // TEXTOS (Brayan 2026-10-28: «que no se corten y aparezca el texto perfecto»): todo texto visible con contenido propio
      for (const el of document.querySelectorAll("body *")) {
        if (el.closest("#sub-layer") || !vis(el)) continue;
        const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join("").trim();
        if (!own) continue;
        const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
        const cs = getComputedStyle(el);
        // cortado por su propia caja (ancho fijo, overflow hidden, nowrap…)
        if (cs.overflow !== "visible" || cs.overflowX !== "visible") {
          const fx = el.scrollWidth - el.clientWidth, fy = el.scrollHeight - el.clientHeight;
          if (fx > 1 || fy > 1) found.push({ tipo: "texto cortado por su caja", el: name(el) + " «" + own.slice(0, 40) + "»", px: Math.round(Math.max(fx, fy)) });
        }
        // cortado por un antepasado con overflow oculto
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
          const ca = getComputedStyle(a); if (ca.overflow === "visible") continue;
          const q = a.getBoundingClientRect(); const o = Math.max(q.left - r.left, r.right - q.right, q.top - r.top, r.bottom - q.bottom);
          if (o > TOL) found.push({ tipo: "texto cortado por " + name(a), el: name(el) + " «" + own.slice(0, 40) + "»", px: Math.round(o) });
          break;
        }
        // fuera del lienzo
        const m = Math.min(r.left, r.top, W - r.right, H - r.bottom);
        if (m < 0) found.push({ tipo: "texto fuera del vídeo", el: name(el) + " «" + own.slice(0, 40) + "»", px: Math.round(-m) });
        // apretado: casi una palabra por línea (la caja es demasiado estrecha para el titular)
        const words = (el.innerText || own).trim().split(/\s+/).length;
        const rg = document.createRange(); rg.selectNodeContents(el);          // líneas REALES de texto, no la altura de la caja
        const lines = new Set([...rg.getClientRects()].filter((q) => q.width > 1).map((q) => Math.round(q.top / 4))).size;
        if (lines >= 3 && words / lines <= 1.4) found.push({ tipo: "texto apretado (casi una palabra por línea)", el: name(el) + " «" + own.slice(0, 40) + "»", px: lines });
      }
      // dedup
      const seen = new Set(); return found.filter((f) => { const k = f.tipo + f.el + f.tarjeta; if (seen.has(k)) return false; seen.add(k); return true; });
    }, tt, TARJ, TOL, w, h);
    for (const r of res) out.push({ segundo: +tt.toFixed(1), ...r });
  }
}
await browser.close();
const seen = new Set();
const uniq = out.filter((o) => { const k = o.tipo + o.el + o.tarjeta; if (seen.has(k)) return false; seen.add(k); return true; });
if (!uniq.length) console.log("Sin desbordes medidos.");
for (const o of uniq) console.log(`tramo ${Math.floor(o.segundo / PASO) * PASO}–${Math.floor(o.segundo / PASO) * PASO + PASO}s · ${o.segundo}s · ${o.tipo} · ${o.el}${o.tarjeta ? " en " + o.tarjeta : ""} · ${o.px}px`);
