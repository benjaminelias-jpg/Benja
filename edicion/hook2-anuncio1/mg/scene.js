/* Motion graphics — hook 2 (anuncio 1) · Kunfupay Classroom Platinum
   Todo se sincroniza con las palabras alineadas (data/timeline.js). Un único timeline GSAP en pausa:
   el renderizador llama a window.renderFrame(i) para cada frame y captura la pantalla. */
(() => {
  const TL = window.__TIMELINE;
  const FPS = TL.fps, DUR = TL.duration;
  const W = TL.words;
  const S = (i) => W[i].s, E = (i) => W[i].e;
  const params = new URLSearchParams(location.search);
  const FRAMES = params.get("frames") || "frames";
  if (params.get("debug")) document.body.classList.add("debug");

  gsap.registerPlugin(CustomEase);
  CustomEase.create("out", "M0,0 C0.16,1 0.3,1 1,1");      // cubic-bezier(0.16, 1, 0.3, 1)
  CustomEase.create("in", "M0,0 C0.42,0 0.86,0.46 1,1");     // ease-in suave para salidas
  CustomEase.create("inout", "M0,0 C0.62,0 0.3,1 1,1");
  const tl = gsap.timeline({ paused: true });
  const SFX = [];                       // pistas de efectos de sonido (las lee la mezcla de audio)
  const sfx = (t, type, gain = 0) => SFX.push({ t: +t.toFixed(3), type, gain });
  const updaters = [];                  // funciones que dependen del tiempo (contadores, orbes…)

  const $ = (s) => document.querySelector(s);
  const layer = $("#layer");
  const icon = (n, cls = "ic") => `<svg class="${cls}" viewBox="0 0 24 24">${ICONS[n]}</svg>`;

  // ------------------------------------------------------------------ vidrio
  function card({ x, y, w, h, pad = "40px 48px", html = "", tint = false, align = "left" }) {
    const c = document.createElement("div");
    c.className = "glass" + (tint ? " tint" : "");
    Object.assign(c.style, { left: x + "px", top: y + "px", width: w + "px", padding: pad, textAlign: align });
    if (h) c.style.height = h + "px";
    c.innerHTML = `<div class="spec"></div>` + html;
    layer.appendChild(c);
    gsap.set(c, { autoAlpha: 0 });
    gsap.set(c.querySelector(".spec"), { xPercent: -160, skewX: -14, opacity: 0 });
    return c;
  }
  // entrada: blur-in (20→0) + fade + 30 px + escala 96→100 %, curva out; barrido especular una vez
  function enter(c, t, { dy = 30, dur = 0.46, sound = "air", gain = 0 } = {}) {
    tl.fromTo(c, { autoAlpha: 0, y: dy, scale: 0.96, filter: "blur(20px)" },
      { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: dur, ease: "out", immediateRender: false }, t);
    tl.set(c, { filter: "none" }, t + dur);
    const sp = c.querySelector(".spec");
    tl.fromTo(sp, { xPercent: -160, opacity: 0 }, { xPercent: 330, duration: 1.05, ease: "inout", immediateRender: false }, t + 0.1);
    tl.fromTo(sp, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "out", immediateRender: false }, t + 0.1);
    tl.to(sp, { opacity: 0, duration: 0.3, ease: "in" }, t + 0.82);
    if (sound) sfx(t, sound, gain);
  }
  function exit(c, t, { dur = 0.26 } = {}) {
    tl.fromTo(c, { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)" },
      { autoAlpha: 0, y: -14, scale: 0.985, filter: "blur(10px)", duration: dur, ease: "in", immediateRender: false }, t);
  }
  // revelado de línea con máscara (la línea sube dentro de su caja) + blur-in
  function reveal(node, t, { dur = 0.5, from = 105 } = {}) {
    gsap.set(node, { yPercent: from, opacity: 0 });
    tl.fromTo(node, { yPercent: from, opacity: 0, filter: "blur(10px)" },
      { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: dur, ease: "out", immediateRender: false }, t);
    tl.set(node, { filter: "none" }, t + dur);
  }
  function hideUp(node, t, dur = 0.26) {
    tl.fromTo(node, { yPercent: 0, opacity: 1 }, { yPercent: -100, opacity: 0, duration: dur, ease: "in", immediateRender: false }, t);
  }
  function pop(node, t, { dur = 0.42, dy = 18, s0 = 0.9 } = {}) {
    gsap.set(node, { opacity: 0 });
    tl.fromTo(node, { opacity: 0, y: dy, scale: s0, filter: "blur(8px)" },
      { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: dur, ease: "out", immediateRender: false }, t);
    tl.set(node, { filter: "none" }, t + dur);
  }
  function accent(node, t, dur = 0.22) {
    tl.fromTo(node, { color: "rgb(245,245,247)" }, { color: "#A895FF", duration: dur, ease: "out", immediateRender: false }, t);
  }
  function underline(node, t, dur = 0.5) {
    tl.fromTo(node, { scaleX: 0 }, { scaleX: 1, duration: dur, ease: "out", immediateRender: false }, t);
  }
  // trazo de ícono que se dibuja
  function drawIcon(svg, t, dur = 0.55) {
    svg.querySelectorAll("path,circle,rect,line,polyline").forEach((p) => {
      const L = (p.getTotalLength && p.getTotalLength()) || 60;
      gsap.set(p, { strokeDasharray: L, strokeDashoffset: L });
      tl.fromTo(p, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: dur, ease: "out", immediateRender: false }, t);
    });
  }
  const fmt = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  function countUp(node, t, to, dur, ticks = 9) {
    const o = { v: 0 };
    tl.fromTo(o, { v: 0 }, { v: to, duration: dur, ease: "out", immediateRender: false }, t);
    updaters.push(() => { node.textContent = fmt(Math.round(o.v / 100) * 100); });
    // ticks que se espacian siguiendo la curva (más juntos al principio)
    for (let k = 0; k < ticks; k++) {
      const p = k / ticks, tt = 1 - Math.pow(1 - p, 0.45);
      sfx(t + tt * dur * 0.92, "tick", -2 - k * 0.6);
    }
  }

  // ------------------------------------------------------------------ cámara (metraje real)
  // Centro de la cara por plano (detección facial sobre la fuente) → origen de los punch-ins.
  const SHOTS = [
    [0, 8.2333, 533, 452], [8.2333, 20.8, 592, 610], [20.8, 26.1333, 583, 614], [26.1333, 28.7667, 574, 515],
    [28.7667, 33.5, 594, 478], [33.5, 40.2, 590, 608], [40.2, 55.9333, 555, 500], [55.9333, 999, 582, 536],
  ];
  const shotAt = (t) => SHOTS.find((s) => t >= s[0] - 1e-6 && t < s[1] - 1e-6) || SHOTS[SHOTS.length - 1];
  // Ventanas picture-in-picture: rect [x, y, w, h], punto del frame F que va al centro C, escala zp
  const PIPS = {
    1: { rect: [220, 290, 640, 690], F: [592, 640], C: [540, 580], zp: 0.82 },
    2: { rect: [350, 280, 380, 440], F: [555, 560], C: [540, 478], zp: 0.66 },
  };
  const cam = { z: 1, p: 0, pip: 1, blur: 0, bg: 0 };
  let camCur = { z: 1 };
  gsap.set(cam, { z: 1, p: 0, blur: 0, bg: 0 });
  function zoom(t, z, dur = 0.55, ease = "out") {     // punch-in/out suave
    const from = camCur.z; camCur.z = z;
    if (dur === 0) tl.set(cam, { z }, t - 0.004);
    else tl.fromTo(cam, { z: from }, { z, duration: dur, ease, immediateRender: false }, t);
  }
  function pipIn(t, id, dur = 0.62) {
    tl.set(cam, { pip: id }, t);
    tl.fromTo(cam, { p: 0, bg: 0 }, { p: 1, bg: 1, duration: dur, ease: "out", immediateRender: false }, t);
    sfx(t, "air_long", 0);
  }
  function pipOut(t, dur = 0.6) {
    tl.fromTo(cam, { p: 1, bg: 1 }, { p: 0, bg: 0, duration: dur, ease: "inout", immediateRender: false }, t);
    sfx(t, "air_long", -3);
  }
  const camEl = $("#cam"), camInner = $("#camInner"), camImg = $("#camImg"), bgEl = $("#bg"), bgImg = $("#bgImg");
  const pipRim = $("#pipRim"), pipShadow = $("#pipShadow");
  const orbs = [$("#orb1"), $("#orb2"), $("#orb3")];
  const ORB = [
    { c: "rgba(115,75,252,.55)", s: 760, x: 120, y: 360, ax: 60, ay: 40, f: 0.21 },
    { c: "rgba(92,33,224,.50)", s: 820, x: 520, y: 1260, ax: 70, ay: 50, f: 0.16 },
    { c: "rgba(156,135,254,.28)", s: 520, x: 640, y: 120, ax: 50, ay: 60, f: 0.27 },
  ];
  ORB.forEach((o, k) => Object.assign(orbs[k].style, { width: o.s + "px", height: o.s + "px",
    background: `radial-gradient(circle at 50% 50%, ${o.c}, rgba(0,0,0,0) 68%)` }));

  function applyCam(t) {
    const [, , ox, oy] = shotAt(t);
    const z = cam.z, p = cam.p;
    let tx = ox * (1 - z), ty = oy * (1 - z), zz = z;
    let T = 0, R = 0, B = 0, L = 0, rad = 0;
    if (p > 0.0001) {
      const P = PIPS[cam.pip];
      const ptx = P.C[0] - P.F[0] * P.zp, pty = P.C[1] - P.F[1] * P.zp;
      tx += (ptx - tx) * p; ty += (pty - ty) * p; zz += (P.zp - zz) * p;
      const [x, y, w, h] = P.rect;
      T = y * p; L = x * p; R = (1080 - x - w) * p; B = (1920 - y - h) * p; rad = 28 * p;
      const box = { left: L + "px", top: T + "px", width: 1080 - L - R + "px", height: 1920 - T - B + "px", borderRadius: rad + "px" };
      Object.assign(pipRim.style, box); Object.assign(pipShadow.style, box);
      pipRim.style.opacity = Math.min(1, p * 1.4); pipShadow.style.opacity = p;
      camEl.style.clipPath = `inset(${T}px ${R}px ${B}px ${L}px round ${rad}px)`;
    } else {
      pipRim.style.opacity = 0; pipShadow.style.opacity = 0; camEl.style.clipPath = "none";
    }
    camInner.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${zz.toFixed(5)})`;
    camEl.style.filter = cam.blur > 0.05 ? `blur(${cam.blur.toFixed(2)}px) brightness(${(1 - cam.blur / 60).toFixed(3)})` : "none";
    bgEl.style.opacity = cam.bg; bgEl.style.display = cam.bg > 0.001 ? "block" : "none";
    if (cam.bg > 0.001) ORB.forEach((o, k) => {
      const x = o.x + o.ax * Math.sin(t * o.f * 2 * Math.PI * 0.35 + k), y = o.y + o.ay * Math.cos(t * o.f * 2 * Math.PI * 0.3 + k * 2);
      orbs[k].style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    });
  }

  // ------------------------------------------------------------------ subtítulos
  // Ventanas donde la tipografía grande ya dice las palabras (no se duplican en subtítulo)
  const SUPPRESS = [[0, 3.70], [8.62, 12.15], [54.40, 55.95], [69.25, 999]];
  const suppressed = (t) => SUPPRESS.some(([a, b]) => t >= a && t < b);
  function displayWords() {
    const out = [];
    for (let i = 0; i < W.length; i++) {
      const w = W[i];
      if (w.w === "Kung" && W[i + 1] && W[i + 1].w === "Fu") {          // marca escrita como se escribe
        out.push({ ...w, w: "Kunfupay" + (W[i + 2].w.endsWith(",") ? "," : ""), e: W[i + 2].e }); i += 2; continue;
      }
      out.push({ ...w });
    }
    return out;
  }
  // Grupos de 2–4 palabras: primero frases (puntuación, pausas, ventanas suprimidas) y luego un reparto
  // óptimo que evita cerrar un grupo en palabra funcional ("de", "que", "y"…) y los grupos de una palabra.
  const FUNC = new Set("de del al a en con para por que y o el la los las un una tu tus mi si se te lo nos le muy ya no".split(" "));
  const clean = (w) => w.replace(/[.,¿?]+/g, "").toLowerCase();
  function chunkPhrase(ph) {
    const n = ph.length, chars = (a, b) => ph.slice(a, b).reduce((m, w) => m + w.w.length + 1, -1);
    const best = new Array(n + 1).fill(Infinity), from = new Array(n + 1).fill(-1);
    best[0] = 0;
    for (let b = 1; b <= n; b++) for (let a = Math.max(0, b - 4); a < b; a++) {
      const len = b - a, ch = chars(a, b);
      if (ch > 24 && len > 1) continue;
      let c = best[a] + Math.abs(len - 3) * 0.6 + (len === 1 ? (n === 1 ? 0 : 9) : 0);
      if (b < n && FUNC.has(clean(ph[b - 1].w))) c += 3;
      if (c < best[b]) { best[b] = c; from[b] = a; }
    }
    const cuts = []; for (let b = n; b > 0; b = from[b]) cuts.unshift([from[b], b]);
    return cuts.map(([a, b]) => ph.slice(a, b));
  }
  function buildGroups(useSuppress = true) {
    const sup = useSuppress ? suppressed : () => false;
    const ws = displayWords().filter((w) => !sup(w.s + 0.001));
    const phrases = []; let ph = null;
    ws.forEach((w, k) => {
      const prev = ws[k - 1];
      const brk = !ph || (prev && /[.,?]$/.test(prev.w)) || (prev && w.s - prev.e > 0.45) ||
        (prev && sup((prev.e + w.s) / 2));
      if (brk) { ph = []; phrases.push(ph); }
      ph.push(w);
    });
    for (let k = 0; k < phrases.length - 1; k++) {
      const a = phrases[k], b = phrases[k + 1];
      if (a.length === 1 && b[0].s - a[0].e < 0.6 && !/[.?]$/.test(a[0].w)) { b.unshift(a[0]); phrases.splice(k, 1); k--; }
      else if (b.length === 1 && b[0].s - a[a.length - 1].e < 0.6 && !/[.?]$/.test(a[a.length - 1].w)) { a.push(b[0]); phrases.splice(k + 1, 1); k--; }
    }
    const groups = [];
    phrases.forEach((p) => chunkPhrase(p).forEach((words) => groups.push({ words })));
    groups.forEach((gr) => { gr.s = gr.words[0].s - 0.06; });
    groups.forEach((gr, k) => {
      const next = groups[k + 1];
      gr.e = Math.min(next ? next.s : 999, gr.words[gr.words.length - 1].e + 0.55);
      if (useSuppress) SUPPRESS.forEach(([a]) => { if (gr.s < a && gr.e > a) gr.e = a; });
      gr.text = gr.words.map((w) => w.w.replace(/[.,]+$/, "")).join(" ");
      gr.raw = gr.words.map((w) => w.w).join(" ");
    });
    return groups;
  }
  const GROUPS = buildGroups();
  const subsEl = $("#subs");
  let curGroup = -1, spans = [];
  function applySubs(t) {
    const k = GROUPS.findIndex((g) => t >= g.s && t < g.e);
    if (k !== curGroup) {
      curGroup = k; subsEl.innerHTML = ""; spans = [];
      if (k >= 0) {
        const g = document.createElement("span"); g.className = "g";
        GROUPS[k].words.forEach((w, j) => {
          const sp = document.createElement("span"); sp.className = "w";
          sp.textContent = w.w.replace(/[.,]+$/, "") + (j < GROUPS[k].words.length - 1 ? " " : "");
          g.appendChild(sp); spans.push(sp);
        });
        subsEl.appendChild(g);
      }
    }
    if (k < 0) return;
    const G = GROUPS[k], g = subsEl.firstChild;
    const a = Math.min(1, (t - G.s) / 0.2), ea = 1 - Math.pow(1 - a, 3);        // entrada 200 ms
    const outA = Math.min(1, Math.max(0, (G.e - t) / 0.08));
    g.style.opacity = (ea * outA).toFixed(3);
    g.style.transform = `translateY(${((1 - ea) * 12).toFixed(2)}px)`;
    g.style.filter = ea < 0.999 ? `blur(${((1 - ea) * 8).toFixed(2)}px)` : "none";
    let act = -1;
    G.words.forEach((w, j) => { if (t >= w.s - 0.02) act = j; });
    spans.forEach((sp, j) => sp.classList.toggle("on", j === act));
  }

  // ================================================================== ESCENAS
  // ---------- 1 · Gancho (0–3,7 s): titular en vidrio + punch-in
  {
    const c = card({ x: 80, y: 712, w: 920, pad: "40px 52px 44px", html: `
      <span class="line h2" style="margin-bottom:10px"><span class="in" id="hk1">Tú pones los cursos.</span></span>
      <span class="line h1"><span class="in" id="hk2">Nosotros,</span></span>
      <span class="line h1"><span class="in" id="hk3">el <span class="uline" id="hkW">presupuesto<i></i></span>.</span></span>` });
    gsap.set(cam, { z: 1.04 }); camCur.z = 1.04;
    // frame 0 ya muestra el vidrio y la primera línea a medio entrar: el gancho funciona sin sonido desde el inicio
    tl.fromTo(c, { autoAlpha: 0.45, y: 14, scale: 0.98, filter: "blur(8px)" },
      { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.36, ease: "out", immediateRender: true }, 0);
    tl.set(c, { filter: "none" }, 0.36);
    { const sp = c.querySelector(".spec");
      tl.fromTo(sp, { xPercent: -160, opacity: 0 }, { xPercent: 330, duration: 1.05, ease: "inout", immediateRender: false }, 0.12);
      tl.fromTo(sp, { opacity: 0 }, { opacity: 1, duration: 0.25, immediateRender: false }, 0.12);
      tl.to(sp, { opacity: 0, duration: 0.3, ease: "in" }, 0.84); }
    sfx(0, "air", -2);
    gsap.set($("#hk1"), { yPercent: 45, opacity: 0.35 });
    tl.fromTo($("#hk1"), { yPercent: 45, opacity: 0.35, filter: "blur(6px)" },
      { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.42, ease: "out", immediateRender: true }, 0);
    tl.set($("#hk1"), { filter: "none" }, 0.42);
    reveal($("#hk2"), S(4) - 0.06);
    tl.fromTo($("#hk1"), { color: "rgb(245,245,247)" }, { color: "rgba(245,245,247,0.7)", duration: 0.3, ease: "out", immediateRender: false }, S(4) - 0.06);
    reveal($("#hk3"), S(6) - 0.12);
    accent($("#hkW"), S(7));
    underline($("#hkW i"), S(7) + 0.08, 0.55);
    sfx(S(4) - 0.55, "swell", -1);
    zoom(S(4) - 0.04, 1.10, 0.6);
    exit(c, 3.56);
    zoom(3.7333, 1.0, 0);                               // corte (salto) → encuadre abierto
  }
  // ---------- 2 · Llamada al público: "más de 13.000 € al mes" — momento limpio: la cifra vive en el subtítulo
  // y en un punch-in (no se agranda en tarjeta para no competir con el requisito de 3.000 € del final).
  {
    zoom(S(19) - 0.06, 1.06, 0.55);
  }
  // ---------- 3 · Presentación: Classroom Platinum (PiP con fondo desenfocado)
  {
    zoom(8.2333, 1.0, 0);
    pipIn(8.2333, 1);
    const c = card({ x: 90, y: 1010, w: 900, pad: "36px 48px 38px", html: `
      <span class="line" style="font-size:76px;font-weight:600;letter-spacing:-0.022em;line-height:1.04">
        <span class="in" id="ttl">Classroom Platinum</span></span>
      <span class="line sm" style="margin-top:12px"><span class="in" id="ttl2">Nuestro programa de partnerships de <span id="ttlK" style="color:var(--text)">Kunfupay</span></span></span>` });
    enter(c, S(29) - 0.18, { sound: null });
    reveal($("#ttl"), S(29) - 0.08, { dur: 0.55 });
    reveal($("#ttl2"), S(31) - 0.05);
    accent($("#ttlK"), S(36));
    sfx(S(29) - 0.05, "glass", -4);
    exit(c, 11.84);
    pipOut(11.86);
    zoom(S(42) - 0.05, 1.07, 0.6);                      // "invertimos"
    zoom(14.7667, 1.0, 0);                              // salto de corte
  }
  // ---------- 4 · Lista: equipo · presupuesto para anuncios · sistema probado
  {
    const row = (id, ic, txt) => `<div style="display:flex;align-items:center;gap:24px;height:58px" id="${id}">
      <span class="dot">${icon(ic)}</span><span class="lbl">${txt}</span></div>`;
    const c = card({ x: 110, y: 822, w: 860, pad: "30px 36px", html: `
      <div style="display:flex;flex-direction:column;gap:18px">
        ${row("r1", "users", "Equipo")}
        ${row("r2", "megaphone", "Presupuesto para anuncios")}
        <div style="display:flex;align-items:center;gap:24px;height:58px" id="r3">
          <span class="dot" style="position:relative"><span id="r3a" style="display:flex">${icon("sparkles")}</span>
            <span id="r3b" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${icon("check")}</span></span>
          <span class="lbl">Sistema ya probado</span></div>
      </div>` });
    gsap.set($("#r3b"), { opacity: 0, scale: 0.6 });
    enter(c, S(50) - 0.22, { gain: -3 });
    pop($("#r1"), S(50) - 0.06); sfx(S(50), "glass", -8);
    pop($("#r2"), S(52) - 0.06); sfx(S(52), "glass", -8);
    pop($("#r3"), S(57) - 0.06); sfx(S(57), "glass", -8);
    tl.fromTo($("#r3a"), { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.6, duration: 0.2, ease: "in", immediateRender: false }, S(61));
    tl.fromTo($("#r3b"), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.4, ease: "out", immediateRender: false }, S(61) + 0.12);
    drawIcon($("#r3b svg"), S(61) + 0.12, 0.45);
    sfx(S(61) + 0.12, "glass", -6);
    exit(c, 19.62);
    zoom(S(64), 1.04, 0.5);                              // "como el tuyo"
  }
  // ---------- 5 · Momento limpio (solo la persona): "mientras tú haces lo que se te da bien…"
  {
    zoom(20.8, 1.0, 0);
    zoom(S(76) - 0.1, 1.06, 0.7);                        // "se te da bien"
    zoom(S(84) - 0.1, 1.02, 0.8, "inout");              // "enseñar": respiración suave
  }
  // ---------- 6–7 · Bucle abierto "¿Es para ti?" → Paso 1
  {
    const dots = (pfx) => `<div style="display:flex;gap:14px;margin-bottom:22px">
      ${[1, 2, 3].map((n) => `<span class="step" style="position:relative" id="${pfx}${n}"><span class="fill"></span><span>${n}</span></span>`).join("")}</div>`;
    const c = card({ x: 90, y: 790, w: 900, pad: "36px 44px", html: `
      ${dots("sa")}
      <div style="position:relative;height:60px">
        <span class="line h3" style="position:absolute;left:0;top:0"><span class="in" id="sT0">¿Es para ti?</span></span>
        <span class="line h3" style="position:absolute;left:0;top:0"><span class="in" id="sT1">Nos cuentas tu negocio</span></span>
      </div>
      <div id="chips" style="display:flex;gap:14px;height:0;overflow:hidden">
        <span class="pill ghost" id="ch1">Qué vendes</span><span class="pill ghost" id="ch2">A cuánto</span><span class="pill ghost" id="ch3">A quién</span>
      </div>` });
    zoom(26.1333, 1.06, 0);                              // "Pero": corte con punch-in
    enter(c, S(94) - 0.22, { gain: -3 });
    reveal($("#sT0"), S(94) - 0.12);
    [1, 2, 3].forEach((n) => pop($("#sa" + n), S(94) + n * 0.05, { s0: 0.7 }));
    zoom(28.7667, 1.0, 0);
    tl.fromTo($("#sa1 .fill"), { scale: 0 }, { scale: 1, duration: 0.42, ease: "out", immediateRender: false }, S(99));
    tl.fromTo($("#sa1"), { color: "rgba(255,255,255,.62)" }, { color: "#fff", duration: 0.3, immediateRender: false }, S(99));
    sfx(S(99), "glass", -5);
    hideUp($("#sT0"), S(101) - 0.32);
    reveal($("#sT1"), S(101) - 0.06);
    tl.fromTo($("#chips"), { height: 0, marginTop: 0 }, { height: 64, marginTop: 24, duration: 0.42, ease: "out", immediateRender: false }, S(106) - 0.3);
    pop($("#ch1"), S(106) - 0.04); sfx(S(106), "glass", -9);
    pop($("#ch2"), S(108) - 0.04); sfx(S(108), "glass", -9);
    pop($("#ch3"), S(110) - 0.04); sfx(S(110), "glass", -9);
    exit(c, 33.2);
  }
  // ---------- 8 · Paso 2: reunión con un consultor (primer plano)
  {
    const c = card({ x: 90, y: 905, w: 900, pad: "34px 44px", html: `
      <div style="display:flex;gap:14px;margin-bottom:20px">
        <span class="step" style="position:relative;color:#fff"><span class="fill" style="transform:scale(1);opacity:.45"></span><span>1</span></span>
        <span class="step" style="position:relative" id="sb2"><span class="fill"></span><span>2</span></span>
        <span class="step" style="position:relative"><span class="fill"></span><span>3</span></span></div>
      <div style="display:flex;align-items:center;gap:22px">
        <span class="dot" id="sbI" style="width:58px;height:58px">${icon("calendar-check")}</span>
        <span class="line h3"><span class="in" id="sbT">Reunión con un consultor</span></span></div>` });
    zoom(33.5, 1.0, 0);
    enter(c, 33.56, { gain: -3 });
    tl.fromTo($("#sb2 .fill"), { scale: 0 }, { scale: 1, duration: 0.42, ease: "out", immediateRender: false }, S(112) + 0.05);
    tl.fromTo($("#sb2"), { color: "rgba(255,255,255,.62)" }, { color: "#fff", duration: 0.3, immediateRender: false }, S(112) + 0.05);
    sfx(S(112) + 0.05, "glass", -5);
    pop($("#sbI"), S(115) - 0.14, { s0: 0.7 });
    drawIcon($("#sbI svg"), S(115) - 0.06, 0.6);
    reveal($("#sbT"), S(115) - 0.08);
    exit(c, 36.42);
    zoom(S(125) - 0.08, 1.07, 0.6);                      // "realmente encaja"
  }
  // ---------- 9 · Paso 3: comenzamos con el programa
  {
    const c = card({ x: 90, y: 760, w: 900, pad: "34px 44px", html: `
      <div style="display:flex;gap:14px;margin-bottom:20px">
        <span class="step" style="position:relative;color:#fff"><span class="fill" style="transform:scale(1);opacity:.45"></span><span>1</span></span>
        <span class="step" style="position:relative;color:#fff"><span class="fill" style="transform:scale(1);opacity:.45"></span><span>2</span></span>
        <span class="step" style="position:relative" id="sc3"><span class="fill"></span><span>3</span></span></div>
      <div style="display:flex;align-items:center;gap:22px">
        <span class="dot" id="scI">${icon("rocket")}</span>
        <span class="line h3"><span class="in" id="scT">Comenzamos el programa</span></span></div>` });
    zoom(40.2, 1.0, 0);
    enter(c, S(132) - 0.06, { gain: -3 });
    tl.fromTo($("#sc3 .fill"), { scale: 0 }, { scale: 1, duration: 0.42, ease: "out", immediateRender: false }, S(133));
    tl.fromTo($("#sc3"), { color: "rgba(255,255,255,.62)" }, { color: "#fff", duration: 0.3, immediateRender: false }, S(133));
    sfx(S(133), "glass", -5);
    pop($("#scI"), S(134) - 0.12, { s0: 0.7 });
    drawIcon($("#scI svg"), S(134) - 0.04, 0.6);
    reveal($("#scT"), S(134) - 0.06);
    exit(c, 41.86);
  }
  // ---------- 10 · B-roll: tu comunidad en Classroom (PiP pequeño + ventana de app en vidrio)
  {
    pipIn(42.06, 2, 0.64);
    const row = (id, ic, txt) => `<div style="display:flex;align-items:center;gap:20px;height:58px" id="${id}">
      <span class="dot" style="width:52px;height:52px">${icon(ic)}</span><span class="lbl" style="font-size:36px">${txt}</span></div>`;
    const bars = [38, 58, 82, 112, 150];
    const c = card({ x: 64, y: 744, w: 952, h: 366, pad: "28px 36px", html: `
      <div style="display:flex;align-items:center;gap:16px;height:52px;margin-bottom:20px;padding-bottom:18px;box-sizing:content-box;
                  border-bottom:1px solid rgba(255,255,255,.10)">
        <img src="assets/logos/kunfupay-isotipo.svg" style="width:42px;height:42px;border-radius:10px" alt="">
        <span style="font-size:32px;font-weight:600;letter-spacing:-0.01em">Kunfupay Classroom</span></div>
      <div style="display:flex;justify-content:space-between">
        <div style="display:flex;flex-direction:column;gap:14px">
          ${row("m1", "users", "Tu comunidad")}
          ${row("m2", "user-check", "Account manager asignado")}
          ${row("m3", "badge-check", "Oferta validada")}
        </div>
        <div id="chart" style="position:relative;width:236px;height:202px">
          <div class="sm" id="chL" style="position:absolute;left:0;top:-4px;display:flex;align-items:center;gap:8px;color:var(--text);font-size:28px">
            ${icon("trending-up").replace('class="ic"', 'class="ic" style="width:30px;height:30px;color:#A895FF"')}Escalado</div>
          ${bars.map((h, k) => `<div class="bar" id="b${k}" style="position:absolute;bottom:0;left:${k * 48}px;width:34px;height:${h}px;
             border-radius:10px;background:${k === bars.length - 1 ? "var(--accent)" : "rgba(255,255,255,.22)"};transform-origin:50% 100%"></div>`).join("")}
        </div>
      </div>` });
    enter(c, 42.3, { dy: 44, dur: 0.5, sound: null });
    pop($("#m1"), S(140) - 0.1); sfx(S(140), "glass", -8);
    pop($("#m2"), S(147) - 0.1); sfx(S(147), "glass", -8);
    pop($("#m3"), S(152) - 0.1); sfx(S(152), "glass", -8);
    pop($("#chL"), S(155) - 0.1);
    bars.forEach((h, k) => {
      gsap.set($("#b" + k), { scaleY: 0 });
      tl.fromTo($("#b" + k), { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: "out", immediateRender: false }, S(158) - 0.2 + k * 0.09);
    });
    sfx(S(158) - 0.2, "glass", -7);
    exit(c, 49.06, { dur: 0.28 });
    pipOut(49.12, 0.62);
    zoom(49.12, 1.0, 0);
    zoom(S(164) - 0.06, 1.07, 0.55);                    // "todos los anuncios"
    zoom(53.3333, 1.0, 0);                              // salto de corte
  }
  // ---------- 12 · "Solo ganamos si tú ganas."
  {
    const c = card({ x: 160, y: 900, w: 760, pad: "34px 48px 38px", align: "center", html: `
      <span class="line h1" style="font-size:78px"><span class="in" id="gn1">Solo ganamos</span></span>
      <span class="line h1" style="font-size:78px"><span class="in" id="gn2">si <span id="gnW">tú ganas</span>.</span></span>` });
    enter(c, 54.41, { gain: -2 });
    reveal($("#gn1"), S(176) - 0.08);
    reveal($("#gn2"), S(178) - 0.1);
    accent($("#gnW"), S(179));
    // segundo barrido de luz como micro-recompensa en "tú ganas"
    const sp = c.querySelector(".spec");
    tl.fromTo(sp, { xPercent: -160, opacity: 0 }, { xPercent: 330, duration: 1.0, ease: "inout", immediateRender: false }, S(179));
    tl.fromTo(sp, { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, S(179));
    tl.to(sp, { opacity: 0, duration: 0.3 }, S(179) + 0.7);
    sfx(S(179), "glass", -5);
    exit(c, 55.6);
  }
  // ---------- 13 · Momento limpio: "Y muy importante…"
  {
    zoom(55.9333, 1.0, 0);
    zoom(S(183) - 0.1, 1.06, 0.6);                       // "importante"
    zoom(S(192) - 0.5, 1.0, 0.55, "inout");             // vuelve a abrir antes de la lista
  }
  // ---------- 14 · Filtro: solo para infoproductores
  {
    const row = (id, txt) => `<div style="display:flex;align-items:center;gap:20px;height:48px" id="${id}">
      <span class="dot" style="width:44px;height:44px"><span id="${id}c" style="display:flex">${icon("check").replace('class="ic"', 'class="ic" style="width:26px;height:26px;stroke-width:2.4"')}</span></span>
      <span class="lbl" style="font-size:38px">${txt}</span></div>`;
    const c = card({ x: 110, y: 800, w: 860, pad: "30px 40px", html: `
      <span class="line h3" style="margin-bottom:18px"><span class="in" id="fl1"><span style="color:var(--muted)">Solo para</span> infoproductores</span></span>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${row("f1", "Acceso a una comunidad")}${row("f2", "Suscripciones")}${row("f3", "Educación online")}
      </div>` });
    enter(c, S(194) - 0.32, { gain: -3 });
    reveal($("#fl1"), S(194) - 0.24);
    [[196, "f1"], [201, "f2"], [203, "f3"]].forEach(([wi, id]) => {
      pop($("#" + id), S(wi) - 0.08);
      drawIcon($("#" + id + "c svg"), S(wi) + 0.02, 0.4);
      sfx(S(wi), "glass", -8);
    });
    exit(c, 64.98);
  }
  // ---------- 15 · Requisito: facturando más de 3.000 €
  {
    const c = card({ x: 250, y: 808, w: 580, pad: "34px 40px 38px", align: "center", html: `
      <span class="line sm"><span class="in" id="c3a">Facturando más de</span></span>
      <div class="num" style="font-size:112px;font-weight:600;letter-spacing:-0.03em;line-height:1.02;margin-top:6px">
        <span id="c3n">0</span><span style="font-size:76px;margin-left:12px">€</span></div>` });
    enter(c, S(211) - 0.3, { gain: -3 });
    reveal($("#c3a"), S(211) - 0.24);
    countUp($("#c3n"), S(211) - 0.04, 3000, 0.62, 7);
    exit(c, 67.92);
  }
  // ---------- 16 · CTA final
  {
    zoom(68.0333, 1.05, 0);
    const c = card({ x: 100, y: 792, w: 880, pad: "38px 48px 40px", align: "center", html: `
      <img src="assets/logos/kunfupay-lockup-white.svg" id="ctaL" style="height:56px;display:block;margin:0 auto 18px" alt="Kunfupay">
      <span class="line h2"><span class="in" id="ctaT">Classroom Platinum</span></span>
      <div style="margin-top:24px;height:76px"><span class="pill solid" id="ctaB" style="height:76px;padding:0 36px;font-size:38px;gap:14px">Clic aquí abajo
        <span id="ctaC" style="display:flex">${icon("chevron-down").replace('class="ic"', 'class="ic" style="width:36px;height:36px;stroke-width:2.4"')}</span></span></div>` });
    enter(c, S(217) - 0.16, { gain: -2 });
    pop($("#ctaL"), S(217) - 0.08, { s0: 0.95 });
    reveal($("#ctaT"), S(217) + 0.06);
    pop($("#ctaB"), S(220) - 0.1, { s0: 0.92 });
    sfx(S(220) - 0.06, "glass", -3);
    const chev = $("#ctaC");
    updaters.push((t) => {   // el chevron indica "abajo" con un vaivén suave (sin rebote)
      const a = Math.max(0, t - S(221));
      chev.style.transform = `translateY(${(Math.sin(a * Math.PI * 1.6) * 5 * Math.min(1, a * 3)).toFixed(2)}px)`;
    });
    tl.fromTo(cam, { blur: 0 }, { blur: 16, duration: 1.1, ease: "inout", immediateRender: false }, 70.05);
  }

  // ------------------------------------------------------------------ render
  let lastSrc = -1;
  async function renderFrame(i) {
    const t = i / FPS;
    const src = TL.frame_map[Math.min(i, TL.frame_map.length - 1)];
    if (src !== lastSrc) {
      const url = `${FRAMES}/${String(src).padStart(5, "0")}.jpg`;
      camImg.src = url; bgImg.src = url; lastSrc = src;
      await Promise.all([camImg.decode(), bgImg.decode()]);
    }
    tl.seek(t, false);
    applyCam(t);
    updaters.forEach((u) => u(t));
    applySubs(t);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  }
  window.renderFrame = renderFrame;
  window.__gsapTL = tl; window.__cam = cam;   // inspección (cobertura, checklist)
  window.__SFX = SFX.sort((a, b) => a.t - b.t);
  window.__GROUPS = GROUPS.map((g) => ({ s: g.s, e: g.e, text: g.text }));
  window.__SRT = buildGroups(false).map((g) => ({ s: g.words[0].s, e: g.e, text: g.raw }));
  window.__READY = document.fonts.ready.then(() => true);
})();
