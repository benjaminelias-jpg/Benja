// Pegar en el navegador integrado. WANT = { nombre: [ruta_de_búsqueda, id_numérico] } → ruta del mp3 en el CDN.
const WANT = { "swipe-a": ["/es/sound-effects/search/swipe/", "405450"] };
const cache = {}, out = {};
for (const [k, [u, id]] of Object.entries(WANT)) {
  if (!cache[u]) { const h = await (await fetch(u)).text(); const d = new DOMParser().parseFromString(h, "text/html"); cache[u] = [...new Set([...d.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")))]; }
  const href = cache[u].find((x) => x.endsWith("-" + id + "/")); if (!href) { out[k] = null; continue; }
  const h = await (await fetch(href)).text();
  const m = h.match(/https:\/\/cdn\.pixabay\.com\/download\/audio\/[^"' ]+?\.mp3\?filename=[^"' &]+/);
  out[k] = m && m[0].replace("https://cdn.pixabay.com/download/audio/", "");
}
out
