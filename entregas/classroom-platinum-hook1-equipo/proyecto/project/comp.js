// Classroom Platinum · Hook 1 Equipo — composición de motion graphics (GSAP, render determinista por frame)
// Todo el vidrio vive en la misma escena que el metraje: backdrop-filter desenfoca el video real que tiene detrás.
(() => {
const FPS = 30, W = 1080, H = 1920;
const DURATION = 36.2;                  // incluye la tarjeta de cierre
const VIDEO_FRAMES = 1038;              // frames del corte base
const LAV = '#C3B4FF';
gsap.registerPlugin(CustomEase);
const KF = CustomEase.create('kf', '0.16,1,0.3,1');   // curva principal de entrada
const OUT = 'power2.in';                               // salida suave
const $ = (id) => document.getElementById(id);
const WD = window.WORDS;                               // palabras alineadas (forced alignment)
const ws = (i) => WD[i].s;
const SFX = [];                                        // eventos de sonido que lee el mezclador
const tl = gsap.timeline({ paused: true });

// ------------------------------------------------------------------ glass
function glassIn(el, t, o = {}) {
  const chip = el.classList.contains('chip');
  const gb = o.gb ?? (chip ? 20 : 30), gbr = o.gbr ?? 0.80, gs = o.gs ?? 1.15;
  el.style.setProperty('--gs', gs);
  tl.fromTo(el, { opacity: 0, y: o.dy ?? 24, scale: o.s0 ?? 0.96, '--gb': 0, '--gbr': 1 },
    { opacity: 1, y: 0, scale: 1, '--gb': gb, '--gbr': gbr, duration: 0.45, ease: KF, immediateRender: false }, t);
  const edge = el.querySelector(':scope > .edge');
  if (edge && o.edge !== false) {
    tl.fromTo(edge, { '--sa': '-40deg' }, { '--sa': '320deg', duration: 0.6, ease: 'power1.inOut', immediateRender: false }, t + 0.3);
    tl.fromTo(edge, { opacity: 0 }, { opacity: 1, duration: 0.12, immediateRender: false }, t + 0.3);
    tl.fromTo(edge, { opacity: 1 }, { opacity: 0, duration: 0.2, immediateRender: false }, t + 0.72);
  }
  if (o.sfx !== false) SFX.push({ t, type: o.sfx || 'air', gain: o.gain ?? 1 });
  el._g = { gb, gbr };
}
function glassOut(el, t, o = {}) {
  const g = el._g || { gb: 30, gbr: 0.8 };
  tl.fromTo(el, { opacity: 1, '--gb': g.gb, '--gbr': g.gbr, y: 0 },
    { opacity: 0, '--gb': 0, '--gbr': 1, y: o.dy ?? -6, duration: 0.25, ease: OUT, immediateRender: false }, t);
}
function fadeUp(el, t, d = 0.4, dy = 12) {
  tl.fromTo(el, { opacity: 0, y: dy }, { opacity: 1, y: 0, duration: d, ease: KF, immediateRender: false }, t);
}
function blurIn(el, t) {   // titulares: blur 12px -> 0
  tl.fromTo(el, { opacity: 0, y: 14, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: KF, immediateRender: false }, t);
}
function hideAll(ids) { ids.forEach((id) => gsap.set($(id), { opacity: 0 })); }

// ------------------------------------------------------------------ cámara (corte, punch-ins, PiP, zoom-through)
const ORIG = { A: [514, 610], B: [504, 480], C: [520, 660], D: [430, 1650] };
const full = (shot, s) => { const [ox, oy] = ORIG[shot]; return { rect: [0, 0, W, H], r: 0, src: [ox - ox / s, oy - oy / s, W / s, H / s] }; };
const pip = (rect, r, src) => ({ rect, r, src });
// PiP del gancho: ventana cuadrada con la cara y la pizarra
const PIP1 = pip([260, 636, 560, 612], 34, [0, 290, 1080, 1180]);
const PIP1b = pip([260, 636, 560, 612], 34, [27, 320, 1026, 1121]);
// PiP del bloque de beneficios: plano B recortado 4:5
const PIP2 = pip([350, 280, 380, 420], 26, [204, 110, 600, 663]);
const PIP2b = pip([350, 280, 380, 420], 26, [222, 130, 564, 623]);
const CAM = [
  [0.00, 3.40, PIP1, PIP1b, 'none'],
  [3.40, 3.90, PIP1b, full('A', 1.0), KF],
  [3.90, 5.333, full('A', 1.0), full('A', 1.04), 'none'],
  [5.333, 6.233, full('A', 1.08), full('A', 1.10), 'none'],
  [6.233, 9.233, full('B', 1.12), full('B', 1.14), 'none'],
  [9.233, 10.83, full('B', 1.0), full('B', 1.03), 'none'],
  [10.83, 16.2, PIP2, PIP2b, 'none'],
  [16.2, 16.35, full('C', 1.0), full('C', 1.0), 'none'],
  [16.35, 16.8, full('C', 1.0), full('C', 1.07), KF],
  [16.8, 21.2, full('C', 1.07), full('C', 1.09), 'none'],
  [21.2, 21.533, full('C', 1.0), full('C', 1.005), 'none'],
  [21.533, 22.367, full('C', 1.07), full('C', 1.075), 'none'],
  [22.367, 23.033, full('C', 1.0), full('C', 1.005), 'none'],
  [23.033, 23.633, full('C', 1.07), full('C', 1.075), 'none'],
  [23.633, 30.167, full('C', 1.0), full('C', 1.05), 'none'],
  [30.167, 32.467, full('D', 1.04), full('D', 1.06), 'none'],
  [32.467, 33.6, full('D', 1.11), full('D', 1.12), 'none'],
  [33.6, 99, full('D', 1.05), full('D', 1.07), 'none'],
];
const lerp = (a, b, p) => a + (b - a) * p;
const lerpA = (a, b, p) => a.map((v, i) => lerp(v, b[i], p));
function camAt(t) {
  const k = CAM.find((c) => t >= c[0] && t < c[1]) || CAM[CAM.length - 1];
  let p = Math.min(1, Math.max(0, (t - k[0]) / (k[1] - k[0])));
  if (k[4] !== 'none') p = gsap.parseEase(k[4])(p);
  return { rect: lerpA(k[2].rect, k[3].rect, p), r: lerp(k[2].r, k[3].r, p), src: lerpA(k[2].src, k[3].src, p) };
}

// ------------------------------------------------------------------ fondos
const P = { bgv: 0, base: 0, orbs: 0, camOp: 0, camBlur: 0, count: 0, dash: 0, bar: 0, line: 0 };
// gancho: video real desenfocado + orbes suaves
tl.set(P, { bgv: 1, orbs: 0.55, base: 0 }, 0);
tl.to(P, { bgv: 0, orbs: 0, duration: 0.25, ease: 'power1.in' }, 3.72);
// bloque beneficios: fondo abstracto (se cambia bajo el barrido de vidrio)
tl.set(P, { base: 1, orbs: 1 }, 10.83);
tl.set(P, { base: 0, orbs: 0 }, 16.2);
// dashboard: blur dissolve
tl.fromTo(P, { camBlur: 0, camOp: 1 }, { camBlur: 30, camOp: 0, duration: 0.4, ease: 'power1.inOut', immediateRender: false }, 26.83);
tl.fromTo(P, { base: 0, orbs: 0 }, { base: 1, orbs: 1, duration: 0.3, immediateRender: false }, 26.81);
// el B-roll cubre «Así que ya sabes» y corta al plano D en el beat 30.84 (la tarjeta nunca pasa sobre la cara)
tl.set(P, { base: 0, orbs: 0, camBlur: 0, camOp: 1 }, 30.84);
// cierre: blur dissolve
tl.fromTo(P, { camBlur: 0, camOp: 1 }, { camBlur: 30, camOp: 0, duration: 0.42, ease: 'power1.inOut', immediateRender: false }, 34.36);
tl.fromTo(P, { base: 0, orbs: 0 }, { base: 1, orbs: 1, duration: 0.3, immediateRender: false }, 34.34);

// ------------------------------------------------------------------ E1 · GANCHO (0 – 3.62)
const hook = $('hookCard'), bezel = $('pipBezel');
hook.style.setProperty('--gs', 0.9);
glassIn(hook, 0.0, { gbr: 0.92, gs: 0.9, sfx: 'swell' });
fadeUp($('hookPill'), 0.30); blurIn($('hookTitle'), 0.35);
// la cifra se ilumina y se subraya justo cuando dice "3 mil"
tl.fromTo($('hookAcc'), { color: '#FFFFFF' }, { color: LAV, duration: 0.18, immediateRender: false }, ws(10) - 0.04);
tl.fromTo(P, { bar: 0 }, { bar: 1, duration: 0.42, ease: KF, immediateRender: false }, ws(10));
SFX.push({ t: ws(10), type: 'click', gain: 0.7 });
bezel.style.left = '242px'; bezel.style.top = '618px'; bezel.style.width = '596px'; bezel.style.height = '648px'; bezel.style.setProperty('--r', '74px');
gsap.set($('hookAcc'), { color: '#FFFFFF' });
tl.set(P, { camOp: 0 }, 0);
tl.fromTo(P, { camOp: 0 }, { camOp: 1, duration: 0.3, ease: KF, immediateRender: false }, 0.08);
tl.fromTo('#camwrap', { scale: 0.96, y: 24 }, { scale: 1, y: 0, duration: 0.45, ease: KF, immediateRender: false }, 0.08);
SFX.push({ t: 3.40, type: 'air', gain: 0.8 });
glassOut(hook, 3.30);

// ------------------------------------------------------------------ subtítulos
// modo: plain (texto con sombra suave) | pill (dentro de una pill de vidrio) | hide (lo dice una tarjeta)
const G = [
  // [i0, i1, modo, extra]
  [13, 14, 'pill', { gbr: 0.86 }], [15, 16, 'pill', { gbr: 0.86, end: 4.5 }],
  [22, 23, 'pill', { gbr: 0.72, gs: 0.9 }], [24, 27, 'pill', { gbr: 0.72, gs: 0.9 }], [28, 30, 'pill', { gbr: 0.72, gs: 0.9, end: ws(31) }],
  [35, 38, 'pill', { gbr: 0.72, gs: 0.9 }], [39, 40, 'pill', { gbr: 0.72, gs: 0.9, end: 10.66 }],
  [41, 43, 'plain'], [44, 45, 'plain'], [46, 46, 'plain'], [47, 50, 'plain'], [51, 52, 'plain'], [53, 55, 'plain'], [56, 58, 'plain'], [59, 60, 'plain', { end: 16.2 }],
  [61, 63, 'plain', { emph: [63] }], [64, 65, 'plain'], [66, 67, 'plain'], [68, 69, 'plain'],
  [70, 71, 'pill', { gbr: 0.9 }],
  [72, 75, 'plain'],
  [76, 76, 'pill', { badge: 1, gbr: 0.9 }], [77, 77, 'pill', { badge: 2, gbr: 0.9 }], [78, 78, 'pill', { badge: 3, gbr: 0.9 }],
  [79, 83, 'pill', { badge: 4, gbr: 0.9, text: ['Servicios', 'y', 'productos', 'digitales'], map: [80, 81, 82, 83], fs: 52 }],
  [84, 84, 'plain'], [85, 87, 'plain'],
  [88, 90, 'plain'], [91, 92, 'plain'], [93, 95, 'plain', { end: ws(96) }],
  [101, 104, 'plain'], [105, 107, 'plain'], [108, 109, 'plain'], [110, 113, 'plain', { end: ws(114) }],
];
const SRT = [];
const subs = $('subs');
let pillEl = null, pillRunEnd = -1;
const cap = (s, first) => (first ? s.charAt(0).toUpperCase() + s.slice(1) : s);
G.forEach((g, gi) => {
  const [i0, i1, mode, x = {}] = g;
  const start = ws(i0);
  const nextStart = gi + 1 < G.length ? ws(G[gi + 1][0]) : WD[i1].e + 0.3;
  const end = x.end ?? (G[gi + 1] && G[gi + 1][0] === i1 + 1 ? nextStart : Math.min(nextStart, WD[i1].e + 0.35));
  const el = document.createElement('div'); el.className = 'sg';
  if (x.fs) el.style.fontSize = x.fs + 'px';
  const texts = x.text || WD.slice(i0, i1 + 1).map((w) => w.w);
  const idx = x.map || texts.map((_, k) => i0 + k);
  if (x.badge) { const b = document.createElement('span'); b.className = 'badge'; b.textContent = x.badge; el.appendChild(b); }
  const spans = texts.map((tx, k) => {
    const s = document.createElement('span'); s.className = 'w';
    const sentenceStart = idx[k] === 0 || /[.]$/.test(WD[idx[k] - 1]?.w || '') || [22, 61, 101].includes(idx[k]);
    s.textContent = cap(tx, sentenceStart || (x.badge && k === 0));
    if (x.emph && x.emph.includes(idx[k])) { s.classList.add('pw'); const bg = document.createElement('span'); bg.className = 'pbg'; s.appendChild(bg); }
    el.appendChild(s); return s;
  });
  subs.appendChild(el);
  gsap.set(el, { xPercent: -50, yPercent: -50 });
  SRT.push({ s: start, e: end, text: texts.map((t, k) => cap(t, k === 0)).join(' ') });
  // entrada / salida del grupo
  tl.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.14, ease: KF, immediateRender: false }, start - 0.02);
  const isRunEnd = mode === 'pill' && (!G[gi + 1] || G[gi + 1][2] !== 'pill' || Math.abs(ws(G[gi + 1][0]) - end) > 0.05);
  tl.fromTo(el, { opacity: 1 }, { opacity: 0, duration: isRunEnd ? 0.2 : 0.08, immediateRender: false }, end - (isRunEnd ? 0.25 : 0.06));
  // palabra activa en lavanda (o dentro de pill violeta sólida si es de énfasis)
  spans.forEach((s, k) => {
    const wi = idx[k]; const t0 = ws(wi); const t1 = k + 1 < spans.length ? ws(idx[k + 1]) : end;
    if (s.classList.contains('pw')) {
      const bg = s.querySelector('.pbg');
      tl.fromTo(bg, { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.4)', immediateRender: false }, t0 - 0.03);
      SFX.push({ t: t0, type: 'click', gain: 0.6 });
    } else {
      tl.set(s, { color: LAV }, t0 - 0.02);
      tl.set(s, { color: '#FFFFFF' }, t1 - 0.02);
    }
  });
  // pill de vidrio que persiste entre grupos consecutivos y ajusta su ancho
  if (mode === 'pill') {
    el.classList.add('inpill');
    const isNewRun = !(pillEl && Math.abs(pillRunEnd - start) < 0.05);
    if (isNewRun) {
      pillEl = document.createElement('div'); pillEl.className = 'glass chip';
      pillEl.style.cssText = 'top:1172px;height:104px;margin-top:-52px;left:540px;';
      subs.insertBefore(pillEl, subs.firstChild);
      pillEl._first = start; pillEl._widths = [];
      glassIn(pillEl, start - 0.08, { gbr: x.gbr ?? 0.85, gs: x.gs ?? 1.0, dy: 14, sfx: 'air', gain: 0.6 });
    }
    pillEl._widths.push({ t: start, el });
    pillEl._end = end; pillRunEnd = end; pillEl._last = gi;
    const pe = pillEl;
    if (!G[gi + 1] || G[gi + 1][2] !== 'pill' || Math.abs(ws(G[gi + 1][0]) - end) > 0.05) {
      glassOut(pe, end - 0.27);   // la pill termina de irse justo antes del siguiente subtítulo
      el._runEnd = true;
    }
    if (x.badge) SFX.push({ t: start, type: 'click', gain: 0.55 });
  }
});
// ------------------------------------------------------------------ E2 · NOMBRE (4.5 – 6.23)
const nameCard = $('nameCard');
glassIn(nameCard, 4.50, { gbr: 0.88 });
fadeUp($('namePill'), ws(18) - 0.04);
blurIn($('nmA'), ws(20) - 0.06); blurIn($('nmB'), ws(21) - 0.06);
glassOut(nameCard, 5.98);

// ------------------------------------------------------------------ E3 · +100 (7.7 – 9.3)
const countCard = $('countCard');
glassIn(countCard, 7.66, { gbr: 0.86, gs: 0.95 });
fadeUp($('countPill'), 7.96);
tl.fromTo($('countNum'), { opacity: 0, y: 14, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, ease: KF, immediateRender: false }, ws(31) - 0.12);
tl.fromTo(P, { count: 0 }, { count: 100, duration: 0.6, ease: 'power2.out', immediateRender: false }, ws(31) - 0.06);
for (let k = 0; k < 9; k++) SFX.push({ t: ws(31) - 0.06 + 0.6 * (1 - Math.sqrt(1 - k / 9)), type: 'tick', gain: 0.5 });
fadeUp($('countSub'), ws(32) - 0.04);
glassOut(countCard, 9.06);

// ------------------------------------------------------------------ E5 · barrido + panel de beneficios (10.6 – 16.2)
const sweep = $('sweep');
sweep.style.setProperty('--gs', 1.0);
// entra, frena mientras cubre todo el cuadro (el cambio de plano ocurre debajo) y sale
tl.fromTo(sweep, { x: 1100, opacity: 1, '--gb': 30, '--gbr': 0.86 }, { x: -210, duration: 0.3, ease: 'power3.out', immediateRender: false }, 10.53);
tl.fromTo(sweep, { x: -210 }, { x: -1520, duration: 0.3, ease: 'power3.in', immediateRender: false }, 10.83);
tl.set(sweep, { opacity: 0 }, 11.14);
SFX.push({ t: 10.50, type: 'whoosh', gain: 1 });
const bez2 = $('pipBezel');
// el mismo bisel se reutiliza para el PiP 2
tl.set(bez2, { left: 332, top: 262, width: 416, height: 456, '--r': '70px' }, 10.83);
tl.set(P, { camOp: 0 }, 10.83);
tl.fromTo(P, { camOp: 0 }, { camOp: 1, duration: 0.3, ease: KF, immediateRender: false }, 11.0);
tl.fromTo('#camwrap', { scale: 0.96, y: 18 }, { scale: 1, y: 0, duration: 0.45, ease: KF, immediateRender: false }, 11.0);
const panel = $('listPanel');
glassIn(panel, 11.10, { gbr: 0.86 });
fadeUp($('listHead'), 11.40);
const rowIn = (row, chk, tIn, tChk) => {
  fadeUp($(row), tIn, 0.45, 16);
  tl.fromTo($(chk), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.36, ease: 'back.out(1.6)', immediateRender: false }, tChk);
  const ck = $(chk).querySelector('.ck');
  tl.fromTo(ck, { strokeDasharray: 24, strokeDashoffset: 24 }, { strokeDashoffset: 0, duration: 0.3, ease: KF, immediateRender: false }, tChk + 0.08);
  SFX.push({ t: tChk, type: 'click', gain: 0.75 });
};
rowIn('r1', 'c1', 11.46, ws(46));
rowIn('r2', 'c2', ws(50) - 0.08, ws(52));
rowIn('r3', 'c3', ws(55) - 0.08, ws(58));
glassOut(panel, 15.96);
tl.fromTo(P, { camOp: 1 }, { camOp: 0, duration: 0.22, ease: OUT, immediateRender: false }, 15.98);
tl.set(P, { camOp: 1 }, 16.2);

// ------------------------------------------------------------------ E8 · dashboard (26.6 – 30.4)
const dash = $('dash');
glassIn(dash, 26.98, { gbr: 0.86 });
tl.fromTo($('dashPill'), { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.4)', immediateRender: false }, ws(90) - 0.04);
SFX.push({ t: ws(90), type: 'click', gain: 0.6 });
tl.fromTo(P, { line: 0 }, { line: 1, duration: 1.3, ease: 'power2.inOut', immediateRender: false }, ws(90));
tl.fromTo($('chartFill'), { opacity: 0 }, { opacity: 1, duration: 0.6, immediateRender: false }, ws(90) + 0.7);
tl.fromTo($('chartDot'), { opacity: 0, scale: 0.4, svgOrigin: '680 12' }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.6)', immediateRender: false }, ws(90) + 1.25);
tl.fromTo(P, { dash: 0 }, { dash: 3000, duration: ws(98) - ws(92) + 0.1, ease: 'power2.out', immediateRender: false }, ws(92));
for (let k = 0; k < 12; k++) SFX.push({ t: ws(92) + (ws(98) - ws(92)) * (1 - Math.sqrt(1 - k / 12)), type: 'tick', gain: 0.42 });
tl.fromTo($('dashMes'), { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.3, ease: KF, immediateRender: false }, ws(99) - 0.05);
gsap.set($('dashMes'), { opacity: 0 });
glassOut(dash, 30.56);

// ------------------------------------------------------------------ E10 · CTA (33.25 – 34.36)
const cta = $('ctaCard');
glassIn(cta, 33.24, { gbr: 0.9 });
fadeUp($('ctaPill'), 33.52);
blurIn($('ctA'), ws(114) - 0.06); blurIn($('ctB'), ws(115) - 0.06);
fadeUp($('ctaSub'), ws(116) + 0.05);
glassOut(cta, 34.34);

// ------------------------------------------------------------------ E11 · cierre (34.4 – 36.2)
const endC = $('endCard');
glassIn(endC, 34.52, { gbr: 0.86 });
fadeUp($('endMark'), 34.82); blurIn($('endTitle'), 34.87);
tl.fromTo($('endPill'), { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.3)', immediateRender: false }, 34.97);
SFX.push({ t: 34.97, type: 'click', gain: 0.7 });

// estados iniciales del contenido
hideAll(['hookPill', 'hookTitle', 'namePill', 'nmA', 'nmB', 'countPill', 'countNum', 'countSub', 'listHead', 'r1', 'r2', 'r3', 'c1', 'c2', 'c3',
  'dashPill', 'chartFill', 'chartDot', 'ctaPill', 'ctA', 'ctB', 'ctaSub', 'endMark', 'endTitle', 'endPill']);
gsap.set(sweep, { opacity: 0 });
tl.set({}, {}, DURATION);

// ------------------------------------------------------------------ orbes (fondo abstracto)
const orbs = [
  { el: $('o1'), c: 'rgba(107,75,255,.78)', d: 1100, x: 200, y: 560, ax: 170, ay: 160, f: 0.07 },
  { el: $('o2'), c: 'rgba(195,180,255,.42)', d: 820, x: 820, y: 1000, ax: 160, ay: 220, f: 0.06 },
  { el: $('o3'), c: 'rgba(168,140,255,.55)', d: 900, x: 860, y: 300, ax: 120, ay: 120, f: 0.08 },
  { el: $('o4'), c: 'rgba(107,75,255,.55)', d: 1000, x: 380, y: 1520, ax: 200, ay: 120, f: 0.05 },
];
orbs.forEach((o) => { o.el.style.width = o.el.style.height = o.d + 'px'; o.el.style.background = `radial-gradient(circle at 50% 50%, ${o.c} 0%, rgba(0,0,0,0) 68%)`; });

// ------------------------------------------------------------------ aplicar estado procedural
const pipFrame = $('pipFrame');
const cam = $('cam'), camwrap = $('camwrap'), bgv = $('bgv'), orbsEl = $('orbs');
const base = document.createElement('div'); base.id = 'base';
base.style.cssText = 'position:absolute;inset:0;opacity:0;background:radial-gradient(120% 80% at 50% 0%, #211a45 0%, #141029 55%, #0B0B0F 100%);';
$('stage').insertBefore(base, orbsEl);
orbsEl.style.background = 'none';
const chartLine = $('chartLine'); const LEN = chartLine.getTotalLength();
chartLine.style.strokeDasharray = LEN;
const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
function apply(t) {
  const c = camAt(t);
  const [x, y, w, h] = c.rect; const [sx, sy, sw] = c.src; const k = w / sw;
  camwrap.style.left = x + 'px'; camwrap.style.top = y + 'px'; camwrap.style.width = w + 'px'; camwrap.style.height = h + 'px';
  camwrap.style.borderRadius = c.r + 'px';
  pipFrame.style.opacity = Math.min(1, Math.max(0, (W - w) / 260));
  cam.style.transform = `translate(${-sx * k}px, ${-sy * k}px) scale(${k})`;
  camwrap.style.filter = P.camBlur > 0.05 ? `blur(${P.camBlur}px)` : 'none';
  camwrap.style.opacity = P.camOp;
  bgv.style.opacity = P.bgv; base.style.opacity = P.base; orbsEl.style.opacity = P.orbs;
  orbs.forEach((o, i) => {
    const ox = o.x + Math.sin(t * o.f * 6.283 + i * 1.7) * o.ax, oy = o.y + Math.cos(t * o.f * 6.283 * 0.8 + i) * o.ay;
    o.el.style.transform = `translate(${ox - o.d / 2}px, ${oy - o.d / 2}px)`;
  });
  $('countNum').textContent = '+' + Math.round(P.count);
  $('dashNum').textContent = fmt(P.dash) + ' €';
  chartLine.style.strokeDashoffset = LEN * (1 - P.line);
  const bar = $('hookBar');
  if (bar._w) { bar.style.width = bar._w * P.bar + 'px'; }
}

// ------------------------------------------------------------------ montaje tras cargar fuentes
async function setup() {
  await document.fonts.ready;
  // subrayado bajo la cifra del gancho
  const acc = $('hookAcc'), card = $('hookCard'), bar = $('hookBar');
  const ra = acc.getBoundingClientRect(), rc = card.getBoundingClientRect();
  bar.style.left = (ra.left - rc.left) + 'px'; bar.style.top = (ra.bottom - rc.top + 2) + 'px'; bar._w = ra.width;
  // anchos de las pills de subtítulo
  const groups = [...subs.querySelectorAll('.sg.inpill')];
  const pills = [...subs.querySelectorAll(':scope > .glass.chip')];
  pills.forEach((pe) => {
    pe._widths.forEach((g, n) => {
      g.el.style.opacity = 1; const wpx = g.el.getBoundingClientRect().width; g.el.style.opacity = 0;
      if (n === 0) gsap.set(pe, { width: wpx, xPercent: -50 });
      else tl.fromTo(pe, { width: pe._widths[n - 1]._w }, { width: wpx, duration: 0.24, ease: KF, immediateRender: false }, g.t - 0.06);
      g._w = wpx;
    });
  });
  window.SFX = SFX; window.SRT = SRT; window.DURATION = DURATION;
  window.ready = true;
}
const imgs = [cam, bgv];
window.renderFrame = async (i) => {
  const t = i / FPS;
  const vi = Math.min(i, VIDEO_FRAMES - 1);
  const src = `frames/f${String(vi).padStart(5, '0')}.jpg`;
  if (cam._src !== src) {
    cam.src = src; cam._src = src;
    const needBg = t < 4.3;
    if (needBg) bgv.src = src;
    await Promise.all([cam.decode(), needBg ? bgv.decode() : null].filter(Boolean));
  }
  tl.seek(t, false);
  apply(t);
  return true;
};
setup();
})();
