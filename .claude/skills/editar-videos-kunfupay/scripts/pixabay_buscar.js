// Pegar en el navegador integrado (javascript_tool) estando en pixabay.com. Cambia TERMS.
const TERMS = { swipe: "/es/sound-effects/search/swipe/", contador: "/es/sound-effects/search/ui%20tick/", musica: "/es/music/search/cinematic%20suspense/" };
const out = {};
for (const [k, u] of Object.entries(TERMS)) {
  const h = await (await fetch(u)).text();
  const d = new DOMParser().parseFromString(h, "text/html");
  out[k] = [...new Set([...d.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")).filter((x) => /\/(sound-effects|music)\/[^/]+-\d+\/$/.test(x)))]
    .slice(0, 6).map((x) => decodeURIComponent(x).split("/").slice(-2, -1)[0].slice(-50));
}
out
