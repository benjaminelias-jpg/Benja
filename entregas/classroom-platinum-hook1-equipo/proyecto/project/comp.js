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
const P = { bgv: 0, camOp: 1, camBlur: 0, count: 0, dash: 0, line: 0, hlp: 0, hlo: 0 };

// ------------------------------------------------------------------ glass
function glassIn(el, t, o = {}) {
  const gb = o.gb ?? 30, gbr = o.gbr ?? 0.80, gs = o.gs ?? 1.15;
  el.style.setProperty('--gs', gs);
  tl.fromTo(el, { opacity: 0, y: o.dy ?? 24, scale: 0.96, '--gb': 0, '--gbr': 1 },
    { opacity: 1, y: 0, scale: 1, '--gb': gb, '--gbr': gbr, duration: 0.45, ease: KF, immediateRender: false }, t);
  const edge = el.querySelector(':scope > .edge');
  if (edge) {   // destello de luz que recorre el borde una sola vez (600 ms)
    tl.fromTo(edge, { '--sa': '-40deg' }, { '--sa': '320deg', duration: 0.6, ease: 'power1.inOut', immediateRender: false }, t + 0.3);
    tl.fromTo(edge, { opacity: 0 }, { opacity: 1, duration: 0.12, immediateRender: false }, t + 0.3);
    tl.fromTo(edge, { opacity: 1 }, { opacity: 0, duration: 0.2, immediateRender: false }, t + 0.72);
  }
  if (o.sfx !== false) SFX.push({ t, type: 'air', gain: o.gain ?? 1 });
  el._g = { gb, gbr };
}
function glassOut(el, t) {
  const g = el._g;
  tl.fromTo(el, { opacity: 1, '--gb': g.gb, '--gbr': g.gbr, y: 0 },
    { opacity: 0, '--gb': 0, '--gbr': 1, y: -6, duration: 0.25, ease: OUT, immediateRender: false }, t);
}
function fadeUp(el, t, d = 0.4, dy = 12) {
  tl.fromTo(el, { opacity: 0, y: dy }, { opacity: 1, y: 0, duration: d, ease: KF, immediateRender: false }, t);
}
function blurIn(el, t) {   // titulares: blur 12px -> 0
  tl.fromTo(el, { opacity: 0, y: 14, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: KF, immediateRender: false }, t);
}

// ------------------------------------------------------------------ cámara: punch-ins, máscara y zoom
const ORIG = { A: [514, 610], B: [504, 480], C: [520, 660], D: [430, 1650] };
const full = (shot, s) => { const [ox, oy] = ORIG[shot]; return { rect: [0, 0, W, H], r: 0, src: [ox - ox / s, oy - oy / s, W / s, H / s] }; };
const mask = (rect, r, src) => ({ rect, r, src });
const tighter = (m, k) => { const [x, y, w, h] = m.src, dw = w * (1 - k), dh = h * (1 - k); return mask(m.rect, m.r, [x + dw / 2, y + dh / 2, w * k, h * k]); };
// máscara del bloque de beneficios (plano B y, tras el corte, plano C)
const MB = mask([300, 276, 480, 500], 30, [184, 100, 640, 667]);
const MC = mask([300, 276, 480, 500], 30, [140, 200, 760, 792]);
// máscara del bloque «para quién es» (plano C)
const MC2 = mask([320, 270, 440, 458], 28, [140, 200, 760, 792]);
const CAM = [
  [0.00, 2.833, full('A', 1.0), full('A', 1.04), 'none'],
  [2.833, 3.633, full('A', 1.08), full('A', 1.09), 'none'],
  [3.633, 5.333, full('A', 1.0), full('A', 1.03), 'none'],
  [5.333, 6.233, full('A', 1.07), full('A', 1.09), 'none'],
  [6.233, 9.233, full('B', 1.12), full('B', 1.14), 'none'],
  [9.233, 10.83, full('B', 1.0), full('B', 1.03), 'none'],
  [10.83, 11.33, full('B', 1.03), MB, KF],                    // el video se achica en la máscara
  [11.33, 16.2, MB, tighter(MB, 0.94), 'none'],
  [16.2, 16.26, MC, MC, 'none'],
  [16.26, 16.76, MC, full('C', 1.07), KF],                    // zoom hacia la imagen: vuelve a pantalla completa
  [16.76, 21.2, full('C', 1.07), full('C', 1.09), 'none'],
  [21.2, 21.7, full('C', 1.0), MC2, KF],                      // se achica de nuevo
  [21.7, 22.367, MC2, tighter(MC2, 0.99), 'none'],
  [22.367, 23.033, tighter(MC2, 0.93), tighter(MC2, 0.925), 'none'],   // jump cuts dentro de la máscara: cambio de escala
  [23.033, 23.633, MC2, tighter(MC2, 0.995), 'none'],
  [23.633, 25.76, tighter(MC2, 0.93), tighter(MC2, 0.9), 'none'],
  [25.76, 26.26, tighter(MC2, 0.9), full('C', 1.0), KF],     // zoom hacia la imagen
  [26.26, 30.167, full('C', 1.0), full('C', 1.04), 'none'],
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
SFX.push({ t: 10.83, type: 'air', gain: 0.8 }, { t: 16.26, type: 'air', gain: 0.8 }, { t: 21.2, type: 'air', gain: 0.8 }, { t: 25.76, type: 'air', gain: 0.8 });

// ------------------------------------------------------------------ fondo desenfocado (el mismo video) y focus pull
tl.fromTo(P, { bgv: 0 }, { bgv: 1, duration: 0.25, immediateRender: false }, 10.83);
tl.fromTo(P, { bgv: 1 }, { bgv: 0, duration: 0.2, immediateRender: false }, 16.7);
tl.fromTo(P, { bgv: 0 }, { bgv: 1, duration: 0.25, immediateRender: false }, 21.2);
tl.fromTo(P, { bgv: 1 }, { bgv: 0, duration: 0.2, immediateRender: false }, 26.2);
// dashboard: el video se desenfoca y queda de fondo; al terminar vuelve a foco en el plano D (beat 30.84)
tl.set(P, { bgv: 1 }, 26.83);
tl.fromTo(P, { camBlur: 0, camOp: 1 }, { camBlur: 18, camOp: 0, duration: 0.42, ease: 'power1.inOut', immediateRender: false }, 26.83);
tl.fromTo(P, { camBlur: 18, camOp: 0 }, { camBlur: 0, camOp: 1, duration: 0.42, ease: 'power1.inOut', immediateRender: false }, 30.84);
tl.set(P, { bgv: 0 }, 31.3);
SFX.push({ t: 30.84, type: 'air', gain: 0.55 });
// cierre: focus pull al fondo desenfocado
tl.set(P, { bgv: 1 }, 34.36);
tl.fromTo(P, { camBlur: 0, camOp: 1 }, { camBlur: 18, camOp: 0, duration: 0.42, ease: 'power1.inOut', immediateRender: false }, 34.36);

// ------------------------------------------------------------------ GANCHO (0 – 3.6): video normal + resaltador sobre la tiza
SFX.push({ t: 0, type: 'swell', gain: 0.8 });
tl.fromTo(P, { hlp: 0, hlo: 0 }, { hlp: 1, hlo: 0.9, duration: 0.38, ease: KF, immediateRender: false }, ws(7) - 0.04);   // «facturen»
SFX.push({ t: ws(7) - 0.04, type: 'air', gain: 0.55 });
tl.fromTo(P, { hlo: 0.9 }, { hlo: 0, duration: 0.28, ease: OUT, immediateRender: false }, 3.42);

// ------------------------------------------------------------------ subtítulos (texto simple; énfasis en pill violeta sólida)
const G = [
  // [i0, i1, extra]
  [0, 1], [2, 5], [6, 8], [9, 12, { text: ['de', '3 mil euros'], map: [9, 10], emph: [10] }],
  [13, 14], [15, 17, { end: ws(18) }],
  [22, 23], [24, 27], [28, 30, { end: ws(31) }],
  [35, 38], [39, 40],
  [41, 43], [44, 45], [46, 46], [47, 50], [51, 52], [53, 55], [56, 58], [59, 60],
  [61, 63, { emph: [63] }], [64, 65], [66, 67], [68, 69], [70, 71, { emph: [71] }],
  [72, 75], [76, 76], [77, 77], [78, 78], [79, 80], [81, 83], [84, 84], [85, 87],
  [88, 90], [91, 92], [93, 95, { end: ws(96) }],
  [101, 104], [105, 107], [108, 109], [110, 113, { end: ws(114) }],
];
const subs = $('subs');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
G.forEach((g, gi) => {
  const [i0, i1, x = {}] = g;
  const start = ws(i0);
  const next = G[gi + 1];
  const end = x.end ?? (next && next[0] === i1 + 1 && ws(next[0]) - WD[i1].e < 0.45 ? ws(next[0]) : WD[i1].e + 0.3);
  const el = document.createElement('div'); el.className = 'sg';
  const texts = x.text || WD.slice(i0, i1 + 1).map((w) => w.w);
  const idx = x.map || texts.map((_, k) => i0 + k);
  const spans = texts.map((tx, k) => {
    const s = document.createElement('span'); s.className = 'w';
    s.textContent = [0, 22, 61, 101].includes(idx[k]) ? cap(tx) : tx;
    if (x.emph && x.emph.includes(idx[k])) { s.classList.add('pw'); const bg = document.createElement('span'); bg.className = 'pbg'; s.appendChild(bg); }
    el.appendChild(s); return s;
  });
  subs.appendChild(el);
  gsap.set(el, { xPercent: -50, yPercent: -50 });
  tl.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.12, ease: KF, immediateRender: false }, start - 0.02);
  tl.set(el, { opacity: 0 }, end - 0.02);   // cambio seco entre grupos (sin superposición)
  spans.forEach((s, k) => {
    const t0 = ws(idx[k]); const t1 = k + 1 < spans.length ? ws(idx[k + 1]) : end;
    if (s.classList.contains('pw')) {
      tl.fromTo(s.querySelector('.pbg'), { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.4)', immediateRender: false }, t0 - 0.03);
      SFX.push({ t: t0, type: 'click', gain: 0.55 });
    } else {
      tl.set(s, { color: LAV }, t0 - 0.02);
      tl.set(s, { color: '#FFFFFF' }, t1 - 0.02);
    }
  });
});

// ------------------------------------------------------------------ NOMBRE (4.5 – 6.23)
const nameCard = $('nameCard');
glassIn(nameCard, 4.50, { gbr: 0.88 });
fadeUp($('namePill'), ws(18) - 0.04);
blurIn($('nmA'), ws(20) - 0.06); blurIn($('nmB'), ws(21) - 0.06);
glassOut(nameCard, 5.98);

// ------------------------------------------------------------------ +100 (7.7 – 9.3)
const countCard = $('countCard');
glassIn(countCard, 7.66, { gbr: 0.86, gs: 0.95 });
fadeUp($('countPill'), 7.96);
blurIn($('countNum'), ws(31) - 0.12);
tl.fromTo(P, { count: 0 }, { count: 100, duration: 0.6, ease: 'power2.out', immediateRender: false }, ws(31) - 0.06);
for (let k = 0; k < 9; k++) SFX.push({ t: ws(31) - 0.06 + 0.6 * (1 - Math.sqrt(1 - k / 9)), type: 'tick', gain: 0.5 });
fadeUp($('countSub'), ws(32) - 0.04);
glassOut(countCard, 9.06);

// ------------------------------------------------------------------ panel de beneficios bajo la máscara (11.1 – 16.2)
const GROW = [];   // [panel, fila, tiempo]: el panel crece al entrar cada fila
const rowIn = (row, chk, tIn, tChk) => {
  fadeUp($(row), tIn, 0.45, 16);
  GROW.push([$(row).parentElement, $(row), tIn]);
  if (!chk) return;
  tl.fromTo($(chk), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.36, ease: 'back.out(1.6)', immediateRender: false }, tChk);
  tl.fromTo($(chk).querySelector('.ck'), { strokeDasharray: 24, strokeDashoffset: 24 }, { strokeDashoffset: 0, duration: 0.3, ease: KF, immediateRender: false }, tChk + 0.08);
  SFX.push({ t: tChk, type: 'click', gain: 0.7 });
};
const panel = $('listPanel');
glassIn(panel, 11.12, { gbr: 0.86, gain: 0.7 });
fadeUp($('listHead'), 11.42);
rowIn('r1', 'c1', 11.48, ws(46));
rowIn('r2', 'c2', ws(50) - 0.08, ws(52));
rowIn('r3', 'c3', ws(55) - 0.08, ws(58));
glassOut(panel, 15.94);

// ------------------------------------------------------------------ panel «para quién es» bajo la máscara (21.4 – 25.8)
const panel2 = $('listPanel2');
glassIn(panel2, 21.40, { gbr: 0.86, gain: 0.7 });
fadeUp($('list2Head'), 21.62);
[[76, 'q1'], [77, 'q2'], [78, 'q3'], [80, 'q4']].forEach(([wi, id]) => { rowIn(id, null, ws(wi) - 0.06); SFX.push({ t: ws(wi) - 0.04, type: 'click', gain: 0.6 }); });
glassOut(panel2, 25.5);

// ------------------------------------------------------------------ dashboard sobre el video desenfocado (26.98 – 30.8)
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
glassOut(dash, 30.56);

// ------------------------------------------------------------------ CTA (33.24 – 34.36)
const cta = $('ctaCard');
glassIn(cta, 33.24, { gbr: 0.9 });
fadeUp($('ctaPill'), 33.52);
blurIn($('ctA'), ws(114) - 0.06); blurIn($('ctB'), ws(115) - 0.06);
fadeUp($('ctaSub'), ws(116) + 0.05);
glassOut(cta, 34.34);

// ------------------------------------------------------------------ cierre (34.5 – 36.2)
const endC = $('endCard');
glassIn(endC, 34.52, { gbr: 0.86, gain: 0.7 });
fadeUp($('endMark'), 34.82); blurIn($('endTitle'), 34.87);
tl.fromTo($('endPill'), { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.3)', immediateRender: false }, 34.97);
SFX.push({ t: 34.97, type: 'click', gain: 0.7 });

// estados iniciales del contenido
['namePill', 'nmA', 'nmB', 'countPill', 'countNum', 'countSub', 'listHead', 'r1', 'r2', 'r3', 'c1', 'c2', 'c3',
  'list2Head', 'q1', 'q2', 'q3', 'q4', 'dashPill', 'dashMes', 'chartFill', 'chartDot', 'ctaPill', 'ctA', 'ctB', 'ctaSub',
  'endMark', 'endTitle', 'endPill'].forEach((id) => gsap.set($(id), { opacity: 0 }));
tl.set({}, {}, DURATION);

// ------------------------------------------------------------------ aplicar estado procedural por frame
const cam = $('cam'), camwrap = $('camwrap'), overlay = $('camOverlay'), bgv = $('bgv'), pipFrame = $('pipFrame'), hl = $('hl');
const chartLine = $('chartLine'); const LEN = chartLine.getTotalLength();
chartLine.style.strokeDasharray = LEN;
const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
// resaltador: rectángulo inclinado sobre «¿FACTURAS?» (frame de referencia 100), desplazado con el tracking
const HL = { x: 540, y: 947, w: 552, rot: 6.5 };
hl.style.left = HL.x + 'px'; hl.style.top = HL.y + 'px'; hl.style.width = HL.w + 'px';
function apply(t, i) {
  const c = camAt(t);
  const [x, y, w, h] = c.rect; const [sx, sy, sw] = c.src; const k = w / sw;
  camwrap.style.left = x + 'px'; camwrap.style.top = y + 'px'; camwrap.style.width = w + 'px'; camwrap.style.height = h + 'px';
  camwrap.style.borderRadius = c.r + 'px';
  const tr = `translate(${-sx * k}px, ${-sy * k}px) scale(${k})`;
  cam.style.transform = tr; overlay.style.transform = tr;
  pipFrame.style.opacity = Math.min(1, Math.max(0, (W - w) / 260));
  camwrap.style.filter = P.camBlur > 0.05 ? `blur(${P.camBlur}px)` : 'none';
  camwrap.style.opacity = P.camOp;
  bgv.style.opacity = P.bgv;
  if (P.hlo > 0.001 && i < TRACK.d.length) {
    const [dx, dy] = TRACK.d[i];
    hl.style.opacity = P.hlo;
    hl.style.transform = `translate(${dx}px, ${dy}px) rotate(${HL.rot}deg) scaleX(${P.hlp})`;
  } else hl.style.opacity = 0;
  $('countNum').textContent = '+' + Math.round(P.count);
  $('dashNum').textContent = fmt(P.dash) + ' €';
  chartLine.style.strokeDashoffset = LEN * (1 - P.line);
}

async function setup() {
  await document.fonts.ready;
  // alto del panel: cabecera + filas visibles; crece con cada fila nueva
  const byPanel = new Map();
  GROW.forEach(([p, r, t]) => { if (!byPanel.has(p)) byPanel.set(p, []); byPanel.get(p).push([r, t]); });
  byPanel.forEach((rows, p) => {
    const pad = parseFloat(getComputedStyle(p).paddingBottom) + 2;
    const hAt = (r) => r.offsetTop + r.offsetHeight + pad;
    const head = rows[0][0].offsetTop + pad + 6;
    p.style.overflow = 'hidden';
    gsap.set(p, { height: head });
    rows.forEach(([r, t], n) => tl.fromTo(p, { height: n ? hAt(rows[n - 1][0]) : head }, { height: hAt(r), duration: 0.42, ease: KF, immediateRender: false }, t - 0.04));
  });
  window.SFX = SFX; window.DURATION = DURATION;
  window.ready = true;
}
window.renderFrame = async (i) => {
  const t = i / FPS;
  const vi = Math.min(i, VIDEO_FRAMES - 1);
  const src = `frames/f${String(vi).padStart(5, '0')}.jpg`;
  if (cam._src !== src) {
    cam.src = src; bgv.src = src; cam._src = src;
    await Promise.all([cam.decode(), bgv.decode()]);
  }
  tl.seek(t, false);
  apply(t, i);
  return true;
};
setup();
})();
