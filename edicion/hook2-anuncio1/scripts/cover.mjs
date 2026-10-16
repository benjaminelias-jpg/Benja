// Portada 1080×1920 con el mismo sistema visual. Uso: node cover.mjs <frame.jpg> <salida.png> [--debug]
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
const here = path.dirname(fileURLToPath(import.meta.url));
const [frame, out, dbg] = process.argv.slice(2);
const b = await chromium.launch({ args: ["--force-color-profile=srgb"] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await p.goto(pathToFileURL(path.join(here, "..", "mg", "cover.html")).href + "?frame=" +
  encodeURIComponent(pathToFileURL(path.resolve(frame)).href) + (dbg ? "&debug=1" : ""));
await p.evaluate(() => window.__READY);
await p.screenshot({ path: out });
await b.close();
console.log("portada →", out);
