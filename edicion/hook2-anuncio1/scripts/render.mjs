// Renderiza la escena HTML/GSAP frame a frame en Chromium headless y la codifica con ffmpeg.
// El vídeo real y el vidrio se componen en la MISMA página: el backdrop-filter desenfoca el metraje de verdad.
//
// Uso:
//   node render.mjs --frames <dir_frames> --out <video.mp4> [--from 0] [--to N]   (vídeo, sin audio)
//   node render.mjs --frames <dir_frames> --stills 0,120,300 --outdir <dir>       (capturas PNG de control)
//   node render.mjs --frames <dir_frames> --dump <meta.json>                      (pistas SFX + grupos de subtítulos)
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, arr) => {
  if (a.startsWith("--")) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith("--") ? arr[i + 1] : true]);
  return acc;
}, []));
const framesUrl = pathToFileURL(path.resolve(args.frames)).href;
const page_url = pathToFileURL(path.join(here, "..", "mg", "index.html")).href +
  `?frames=${encodeURIComponent(framesUrl)}${args.debug ? "&debug=1" : ""}`;

const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--force-color-profile=srgb", "--disable-gpu-vsync", "--hide-scrollbars"] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on("console", (m) => { if (m.type() === "error") console.error("[page]", m.text()); });
page.on("pageerror", (e) => console.error("[pageerror]", e.message));
await page.goto(page_url);
await page.evaluate(() => window.__READY);
const total = await page.evaluate(() => window.__TIMELINE.frames);

if (args.dump) {
  const meta = await page.evaluate(() => ({ sfx: window.__SFX, groups: window.__GROUPS, srt: window.__SRT }));
  fs.writeFileSync(args.dump, JSON.stringify(meta, null, 1));
  console.log(`sfx ${meta.sfx.length} · grupos ${meta.groups.length} → ${args.dump}`);
} else if (args.stills) {
  fs.mkdirSync(args.outdir, { recursive: true });
  for (const f of String(args.stills).split(",").map(Number)) {
    await page.evaluate((i) => window.renderFrame(i), f);
    await page.screenshot({ path: path.join(args.outdir, `f${String(f).padStart(5, "0")}.png`) });
  }
  console.log("stills ok");
} else {
  const from = +(args.from || 0), to = Math.min(+(args.to || total), total);
  const ff = spawn("ffmpeg", ["-v", "error", "-y", "-f", "image2pipe", "-framerate", "30", "-c:v", "mjpeg", "-i", "-",
    "-vf", "scale=in_color_matrix=bt601:in_range=pc:out_color_matrix=bt709:out_range=tv",
    "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p",
    "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
    "-x264-params", "keyint=60:min-keyint=60", "-movflags", "+faststart", args.out], { stdio: ["pipe", "inherit", "inherit"] });
  const t0 = Date.now();
  for (let i = from; i < to; i++) {
    await page.evaluate((k) => window.renderFrame(k), i);
    const buf = await page.screenshot({ type: "jpeg", quality: 96 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if ((i - from) % 150 === 0) console.log(`[${args.out}] frame ${i}/${to} · ${((Date.now() - t0) / (i - from + 1)).toFixed(0)} ms/f`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  console.log(`listo ${args.out} (${to - from} frames en ${((Date.now() - t0) / 1000).toFixed(0)} s)`);
}
await browser.close();
