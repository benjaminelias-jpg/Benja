// Classroom Platinum · Anuncio 1 (hook 1 / hook 2) — motion graphics con GSAP, render determinista por frame.
// Mismo cuerpo para las dos versiones (referenciado por índice de palabra desde «Te presento»); cada gancho es propio.
(() => {
const V = new URLSearchParams(location.search).get('v') || 'hook1';
const FPS = 30, W = 1080, H = 1920;
const LAV = '#C3B4FF';
gsap.registerPlugin(CustomEase);
const KF = CustomEase.create('kf', '0.16,1,0.3,1');   // curva principal de entrada
const OUT = 'power2.in';
const $ = (id) => document.getElementById(id);

// ------------------------------------------------------------------ datos de cada versión
const CFG = {
  hook1: {
    data: window.WORDS_HOOK1, frames: 2135,
    joins: [2.667, 4.667, 10.667, 15.7, 17.0, 21.567, 23.9, 25.7, 26.667, 27.9, 29.1, 31.6, 33.7, 34.3, 38.633, 40.5, 43.8, 45.833, 50.633, 53.0, 54.467, 56.333, 56.967, 63.5, 64.467, 65.233, 68.767],
    shots: [6.867, 9.267, 21.567, 26.7, 29.133, 35.467, 41.867, 56.967],
    faces: [[536, 444], [533, 481], [628, 608], [570, 618], [577, 499], [579, 487], [619, 614], [603, 522], [569, 541]],
    cam: [[536, 444, 1.0], [533, 481, 1.0], [628, 1900, 1.12], [570, 618, 1.0], [577, 1900, 1.1], [579, 1900, 1.1], [619, 1900, 1.1], [603, 1900, 1.1], [569, 1900, 1.12]],
  },
  hook2: {
    data: window.WORDS_HOOK2, frames: 2164,
    joins: [0.467, 1.4, 2.167, 3.267, 6.8, 11.667, 16.7, 18.0, 22.567, 24.9, 26.7, 27.667, 28.9, 30.1, 32.6, 34.7, 35.3, 39.633, 41.5, 44.8, 46.833, 51.633, 54.0, 55.467, 57.3, 57.933, 64.467, 65.433, 66.2, 69.733],
    shots: [0.467, 7.833, 10.266, 22.567, 27.7, 30.134, 36.466, 42.866, 57.934],
    faces: [[539, 494], [547, 455], [519, 499], [628, 608], [570, 618], [577, 499], [579, 487], [619, 614], [603, 522], [569, 541]],
    cam: [[539, 494, 1.0], [547, 455, 1.0], [519, 499, 1.0], [628, 1900, 1.12], [570, 618, 1.0], [577, 1900, 1.1], [579, 1900, 1.1], [619, 1900, 1.1], [603, 1900, 1.1], [569, 1900, 1.12]],
  },
}[V];
const WD = CFG.data.w, B = CFG.data.b;          // palabras alineadas; B = índice de «Te presento»
const ws = (i) => WD[i].s, we = (i) => WD[i].e;
const bs = (r) => ws(B + r);                      // palabra del cuerpo por índice relativo
const T_END = we(WD.length - 1) + 0.12;           // fin de la voz -> tarjeta de cierre
const DURATION = Math.round((T_END + 1.9) * FPS) / FPS;
const SFX = [];
const tl = gsap.timeline({ paused: true });
const P = { bgv: 0, camOp: 1, camBlur: 0, notif: 0, req: 0 };
document.querySelectorAll('.v').forEach((el) => { el.style.display = 'none'; });

// ------------------------------------------------------------------ glass
function glassIn(el, t, o = {}) {
  const gb = o.gb ?? 30, gbr = o.gbr ?? 0.84, gs = o.gs ?? 1.1;
  el.style.setProperty('--gs', gs);
  tl.fromTo(el, { opacity: 0, y: o.dy ?? 24, scale: 0.96, '--gb': 0, '--gbr': 1 },
    { opacity: 1, y: 0, scale: 1, '--gb': gb, '--gbr': gbr, duration: 0.45, ease: KF, immediateRender: false }, t);
  const edge = el.querySelector(':scope > .edge');
  if (edge) {
    tl.fromTo(edge, { '--sa': '-40deg' }, { '--sa': '320deg', duration: 0.6, ease: 'power1.inOut', immediateRender: false }, t + 0.3);
    tl.fromTo(edge, { opacity: 0 }, { opacity: 1, duration: 0.12, immediateRender: false }, t + 0.3);
    tl.fromTo(edge, { opacity: 1 }, { opacity: 0, duration: 0.2, immediateRender: false }, t + 0.72);
  }
  if (o.sfx !== false) SFX.push({ t, type: 'air', gain: o.gain ?? 0.9 });
  el._g = { gb, gbr };
}
function glassOut(el, t) {
  tl.fromTo(el, { opacity: 1, '--gb': el._g.gb, '--gbr': el._g.gbr, y: 0 },
    { opacity: 0, '--gb': 0, '--gbr': 1, y: -6, duration: 0.25, ease: OUT, immediateRender: false }, t);
}
const fadeUp = (el, t, d = 0.4, dy = 12) => tl.fromTo(el, { opacity: 0, y: dy }, { opacity: 1, y: 0, duration: d, ease: KF, immediateRender: false }, t);
const blurIn = (el, t) => tl.fromTo(el, { opacity: 0, y: 14, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: KF, immediateRender: false }, t);
const hide = (ids) => ids.forEach((id) => gsap.set($(id), { opacity: 0 }));
const GROW = [];   // paneles que crecen fila a fila
function rowIn(row, chk, tIn, tChk) {
  fadeUp($(row), tIn, 0.45, 16); GROW.push([$(row).parentElement, $(row), tIn]); hide([row]);
  if (!chk) return;
  hide([chk]);
  tl.fromTo($(chk), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.36, ease: 'back.out(1.6)', immediateRender: false }, tChk);
  tl.fromTo($(chk).querySelector('.ck'), { strokeDasharray: 24, strokeDashoffset: 24 }, { strokeDashoffset: 0, duration: 0.3, ease: KF, immediateRender: false }, tChk + 0.08);
  SFX.push({ t: tChk, type: 'click', gain: 0.65 });
}

// ------------------------------------------------------------------ cámara: punch-ins en cada jump cut, máscaras y zoom
const SHOT_STARTS = [0, ...CFG.shots];
const CUTS = [...new Set([...CFG.joins, ...CFG.shots].map((x) => Math.round(x * 30) / 30))].sort((a, b) => a - b)
  .filter((x, i, a) => i === 0 || x - a[i - 1] > 0.05);
const shotIdx = (t) => { let k = 0; SHOT_STARTS.forEach((s, i) => { if (t >= s - 1e-6) k = i; }); return k; };
const fullState = (o, s) => ({ rect: [0, 0, W, H], r: 0, src: [o[0] - o[0] / s, o[1] - o[1] / s, W / s, H / s] });
function fullAt(t) {
  const si = shotIdx(t), s0 = SHOT_STARTS[si];
  const inShot = CUTS.filter((c) => c > s0 + 0.05 && c <= t + 1e-6);         // jump cuts dentro del plano hasta t
  const cs = inShot.length ? inShot[inShot.length - 1] : s0;
  const ce = CUTS.find((c) => c > t + 1e-6) ?? DURATION;
  const [ox, oy, s0b] = CFG.cam[si];                                           // reencuadre por plano (4K: punch-in anclado abajo sube al speaker)
  const base = s0b * (inShot.length % 2 ? 1.06 : 1.0);                        // alterna escala en cada jump cut
  const s = base * (1 + 0.016 * Math.min(1, (t - cs) / Math.max(0.5, ce - cs)));
  return fullState([ox, oy], s);
}
const D = 0.5;   // duración del zoom de entrada/salida de la máscara
function maskDef(rect, r, sw, tIn) {
  const [cx, cy] = CFG.faces[shotIdx(tIn + 0.05)]; const sh = sw * rect[3] / rect[2];
  const x = Math.min(W - sw, Math.max(0, cx - sw / 2)), y = Math.min(H - sh, Math.max(0, cy - 0.42 * sh));
  return { rect, r, src: [x, y, sw, sh] };
}
const MASKS = [];
function addMask(tIn, tOut, rect, r, sw) { MASKS.push({ tIn, tOut, m: maskDef(rect, r, sw, tIn) }); }
function maskAt(M, t) {
  const n = CUTS.filter((c) => c > M.tIn + 0.05 && c <= t + 1e-6).length;      // jump cuts dentro de la máscara: cambio de escala
  const k = n % 2 ? 0.93 : 1.0, [x, y, w, h] = M.m.src;
  const kk = k * (1 - 0.04 * Math.min(1, (t - M.tIn) / Math.max(1, M.tOut - M.tIn)));
  return { rect: M.m.rect, r: M.m.r, src: [x + w * (1 - kk) / 2, y + h * (1 - kk) / 2, w * kk, h * kk] };
}
const lerp = (a, b, p) => a + (b - a) * p, lerpS = (A, Bs, p) => ({ rect: A.rect.map((v, i) => lerp(v, Bs.rect[i], p)), r: lerp(A.r, Bs.r, p), src: A.src.map((v, i) => lerp(v, Bs.src[i], p)) });
const ease = gsap.parseEase(KF);
function camAt(t) {
  for (const M of MASKS) {
    if (t >= M.tIn && t < M.tIn + D) return lerpS(fullAt(t), maskAt(M, M.tIn + D), ease((t - M.tIn) / D));
    if (t >= M.tIn + D && t < M.tOut) return maskAt(M, t);
    if (t >= M.tOut && t < M.tOut + D) return lerpS(maskAt(M, M.tOut), fullAt(t), ease((t - M.tOut) / D));
  }
  return fullAt(t);
}
function maskScene(tIn, tOut, rect, r, sw) {
  addMask(tIn, tOut, rect, r, sw);
  tl.fromTo(P, { bgv: 0 }, { bgv: 1, duration: 0.25, immediateRender: false }, tIn);
  tl.fromTo(P, { bgv: 1 }, { bgv: 0, duration: 0.2, immediateRender: false }, tOut + D - 0.12);
  SFX.push({ t: tIn, type: 'air', gain: 0.75 }, { t: tOut, type: 'air', gain: 0.75 });
}

// ------------------------------------------------------------------ subtítulos (texto simple; énfasis en pill violeta sólida)
const subs = $('subs');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const SENT = new Set();   // índices que empiezan oración
WD.forEach((w, i) => { if (i === 0 || /[.?]$/.test(WD[i - 1].raw || '') ) SENT.add(i); });
function subtitles(G) {
  G.forEach((g, gi) => {
    const [i0, i1, x = {}] = g;
    const start = ws(i0), next = G[gi + 1];
    let end = x.end ?? (next && next[0] === i1 + 1 && ws(next[0]) - we(i1) < 0.45 ? ws(next[0]) : we(i1) + 0.3);
    if (next) end = Math.min(end, ws(next[0]));
    if (x.until !== undefined) end = Math.min(end, x.until);   // nunca se pisa con el grupo siguiente
    const el = document.createElement('div'); el.className = 'sg';
    const texts = x.text || WD.slice(i0, i1 + 1).map((w) => w.w);
    const idx = x.map || texts.map((_, k) => i0 + k);
    const spans = texts.map((tx, k) => {
      const s = document.createElement('span'); s.className = 'w';
      s.textContent = (x.cap ?? true) && k === 0 && (SENT.has(idx[0]) || [0, B].includes(idx[0])) ? cap(tx) : tx;
      if (x.emph && x.emph.includes(idx[k])) { s.classList.add('pw'); const bg = document.createElement('span'); bg.className = 'pbg'; s.appendChild(bg); }
      el.appendChild(s); return s;
    });
    subs.appendChild(el);
    gsap.set(el, { xPercent: -50, yPercent: -50 });
    tl.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.12, ease: KF, immediateRender: false }, start - 0.02);
    tl.set(el, { opacity: 0 }, end - 0.02);
    spans.forEach((s, k) => {
      const t0 = ws(idx[k]); const t1 = k + 1 < spans.length ? ws(idx[k + 1]) : end;
      if (s.classList.contains('pw')) {
        tl.fromTo(s.querySelector('.pbg'), { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.4)', immediateRender: false }, t0 - 0.03);
        SFX.push({ t: t0, type: 'click', gain: 0.5 });
      } else { tl.set(s, { color: LAV }, t0 - 0.02); tl.set(s, { color: '#FFFFFF' }, t1 - 0.02); }
    });
  });
}
const rel = (G) => G.map(([a, b, x = {}]) => [B + a, B + b, { ...x, map: x.map && x.map.map((m) => B + m), emph: x.emph && x.emph.map((m) => B + m), end: x.endRel !== undefined ? bs(x.endRel) : x.end }]);

// ------------------------------------------------------------------ GANCHOS (video normal, sin máscara, un solo elemento)
SFX.push({ t: 0, type: 'swell', gain: 0.75 });
if (V === 'hook1') {
  // «Vendes cursos y ya facturas más de 3.000 euros»: notificación de pago al lado del speaker
  const n = $('notif'); n.style.display = 'block';
  glassIn(n, ws(4) - 0.12, { gbr: 0.86, gain: 0.8 });
  tl.fromTo(P, { notif: 0 }, { notif: 3000, duration: we(9) - ws(7) + 0.1, ease: 'power2.out', immediateRender: false }, ws(7));
  for (let k = 0; k < 8; k++) SFX.push({ t: ws(7) + (we(9) - ws(7)) * (1 - Math.sqrt(1 - k / 8)), type: 'tick', gain: 0.45 });
  glassOut(n, ws(10) + 0.55);
  subtitles([
    [0, 1], [2, 4], [5, 9, { text: ['más de', '3 mil euros'], map: [5, 7], emph: [7] }],
    [10, 13], [14, 15], [16, 19], [20, 21], [22, 24], [25, 27, { text: ['cuota de mercado'], map: [25], emph: [25] }],
    [28, 31], [32, 34], [35, 36, { until: ws(B) }],
  ]);
} else {
  // «Tú pones los cursos, nosotros ponemos el presupuesto»: la tarjeta se arma con la voz (y hace de subtítulo)
  const d = $('deal'); d.style.display = 'block';
  glassIn(d, 0.02, { gbr: 0.86, gain: 0.8 });
  rowIn('d1', null, ws(0) + 0.05); SFX.push({ t: ws(0) + 0.05, type: 'click', gain: 0.5 });
  rowIn('d2', null, ws(4) - 0.05); SFX.push({ t: ws(4) - 0.05, type: 'click', gain: 0.5 });
  glassOut(d, ws(8) - 0.3);
  subtitles([
    [8, 10], [11, 13], [14, 16], [17, 23, { text: ['más de', '3 mil euros al mes'], map: [17, 19], emph: [19] }],
    [24, 27], [28, 31], [32, 34], [35, 36, { until: ws(B) }],
  ]);
}

// ------------------------------------------------------------------ CUERPO (compartido)
// M1 · «Te presento Classroom Platinum…»: el video se achica en la máscara; tarjeta con el nombre debajo
const m1In = Math.max(SHOT_STARTS[V === 'hook1' ? 2 : 3], bs(0)) + 0.02, m1Out = bs(18) - 0.15;
maskScene(m1In, m1Out, [270, 296, 540, 560], 30, 680);
const nc = $('nameCard');
glassIn(nc, m1In + 0.32, { gbr: 0.86, gain: 0.7 });
hide(['nmA', 'nmB', 'nmSub', 'nmPill']);
blurIn($('nmA'), bs(2) - 0.06); blurIn($('nmB'), bs(3) - 0.06);
fadeUp($('nmSub'), bs(4) - 0.04);
tl.fromTo($('nmPill'), { opacity: 0, scale: 0.92, transformOrigin: '0% 50%' }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.3)', immediateRender: false }, bs(13) - 0.05);
SFX.push({ t: bs(13) - 0.05, type: 'click', gain: 0.6 });
glassOut(nc, m1Out - 0.18);

// B2 · «Te apoyamos con equipo, presupuesto y un sistema ya probado»
const sp = $('supportPanel');
glassIn(sp, bs(19) + 0.05, { gbr: 0.86 });
hide(['supHead']); fadeUp($('supHead'), bs(19) + 0.3);
rowIn('s1', 'sc1', bs(21) - 0.08, bs(21) + 0.25);
rowIn('s2', 'sc2', bs(23) - 0.08, bs(25));
rowIn('s3', 'sc3', bs(28) - 0.08, bs(30));
glassOut(sp, bs(38) - 0.3);

// B4 · «Pero ¿cómo puedes saber si esto es para ti?»: promete los 3 pasos (loop abierto)
const lc = $('loopCard');
glassIn(lc, bs(61) + 0.02, { gbr: 0.86 });
hide(['loopPill', 'loopTitle', 'ls1', 'ls2', 'ls3']);
fadeUp($('loopPill'), bs(61) + 0.3);
blurIn($('loopTitle'), bs(65) - 0.06);
['ls1', 'ls2', 'ls3'].forEach((id, k) => fadeUp($(id), bs(67) + 0.05 * k, 0.4, 10));
glassOut(lc, bs(70) - 0.28);

// B5a · Paso 1
const s1 = $('step1');
glassIn(s1, bs(70) + 0.02, { gbr: 0.86 });
hide(['st1Title', 'ch1', 'ch2', 'ch3', 'st1Note']);
blurIn($('st1Title'), bs(71) - 0.06);
[['ch1', 77], ['ch2', 79], ['ch3', 81]].forEach(([id, r]) => { tl.fromTo($(id), { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.5)', immediateRender: false }, bs(r) - 0.04); SFX.push({ t: bs(r) - 0.04, type: 'click', gain: 0.5 }); });
fadeUp($('st1Note'), bs(87) - 0.06);
glassOut(s1, bs(90) - 0.3);

// M2 · Paso 2 bajo la máscara: «agendamos una reunión con uno de nuestros consultores…»
const m2In = bs(90) - 0.04, m2Out = SHOT_STARTS[shotIdx(bs(110))] - D - 0.03;
maskScene(m2In, m2Out, [300, 276, 480, 500], 30, 760);
const s2 = $('step2');
glassIn(s2, m2In + 0.36, { gbr: 0.86, gain: 0.7 });
hide(['st2Head']); fadeUp($('st2Head'), bs(91) - 0.05);
rowIn('m1', 'mc1', bs(99) - 0.08, bs(104));
rowIn('m2', 'mc2', bs(105) - 0.08, bs(107));
glassOut(s2, m2Out - 0.15);

// B5c · Paso 3
const s3 = $('step3');
glassIn(s3, bs(110) + 0.02, { gbr: 0.86 });
hide(['st3Head']); fadeUp($('st3Head'), bs(111) - 0.05);
rowIn('p1', 'pc1', bs(116) - 0.08, bs(121));
rowIn('p2', 'pc2', bs(124) - 0.08, bs(126));
rowIn('p3', 'pc3', bs(128) - 0.08, bs(132));
rowIn('p4', 'pc4', bs(136) - 0.08, bs(138));
glassOut(s3, bs(139) - 0.22);

// B5d · «donde nosotros pagaremos todos los anuncios, sin que tengas que arriesgar tu dinero»
const pc = $('payCard');
glassIn(pc, bs(140) - 0.12, { gbr: 0.86 });
hide(['payPill', 'pyA', 'pyB', 'paySub']);
fadeUp($('payPill'), bs(140) + 0.1);
blurIn($('pyA'), bs(141) - 0.06); blurIn($('pyB'), bs(142) - 0.06);
fadeUp($('paySub'), bs(145) - 0.04);
glassOut(pc, bs(152) - 0.28);

// M3 · «Y muy importante… solo para infoproductores que venden…» bajo la máscara
const m3In = Math.max(SHOT_STARTS[shotIdx(bs(159))], bs(159) - 0.05) + 0.02, m3Out = bs(183) - 0.12;
maskScene(m3In, m3Out, [300, 276, 480, 500], 30, 700);
const wp = $('whoPanel');
glassIn(wp, bs(164) - 0.25, { gbr: 0.86, gain: 0.7 });
tl.fromTo($('whoHeadA'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: KF, immediateRender: false }, bs(164) + 0.05);
tl.fromTo($('whoHeadA'), { opacity: 1 }, { opacity: 0, duration: 0.2, immediateRender: false }, bs(170) - 0.1);
tl.fromTo($('whoHeadB'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: KF, immediateRender: false }, bs(170) - 0.02);
hide(['whoHeadA']);
rowIn('w1', null, bs(175) - 0.06); SFX.push({ t: bs(175) - 0.04, type: 'click', gain: 0.55 });
rowIn('w2', null, bs(179) - 0.06); SFX.push({ t: bs(179) - 0.04, type: 'click', gain: 0.55 });
rowIn('w3', null, bs(181) - 0.06); SFX.push({ t: bs(181) - 0.04, type: 'click', gain: 0.55 });
glassOut(wp, m3Out - 0.18);

// B8 · «tienes que estar facturando más de 3.000 euros»
const rc = $('reqCard');
glassIn(rc, bs(185) - 0.05, { gbr: 0.86, gs: 0.95 });
hide(['reqPill', 'reqNum', 'reqSub']);
fadeUp($('reqPill'), bs(185) + 0.25);
blurIn($('reqNum'), bs(189) - 0.1);
tl.fromTo(P, { req: 0 }, { req: 3000, duration: bs(193) - bs(189) + 0.12, ease: 'power2.out', immediateRender: false }, bs(189));
for (let k = 0; k < 10; k++) SFX.push({ t: bs(189) + (bs(193) - bs(189)) * (1 - Math.sqrt(1 - k / 10)), type: 'tick', gain: 0.45 });
fadeUp($('reqSub'), bs(193) + 0.05);
glassOut(rc, bs(194) - 0.28);

// B9 · CTA
const cta = $('ctaCard');
glassIn(cta, bs(194) + 0.02, { gbr: 0.88 });
hide(['ctaPill', 'ctA', 'ctB']);
fadeUp($('ctaPill'), bs(194) + 0.3);
blurIn($('ctA'), bs(199) - 0.06); blurIn($('ctB'), bs(200) - 0.06);
glassOut(cta, T_END - 0.02);

// cierre: focus pull al video desenfocado + tarjeta final
tl.set(P, { bgv: 1 }, T_END);
tl.fromTo(P, { camBlur: 0, camOp: 1 }, { camBlur: 18, camOp: 0, duration: 0.42, ease: 'power1.inOut', immediateRender: false }, T_END);
const endC = $('endCard');
glassIn(endC, T_END + 0.16, { gbr: 0.86, gain: 0.7 });
hide(['endMark', 'endTitle', 'endPill']);
fadeUp($('endMark'), T_END + 0.46); blurIn($('endTitle'), T_END + 0.51);
tl.fromTo($('endPill'), { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.3)', immediateRender: false }, T_END + 0.61);
SFX.push({ t: T_END + 0.61, type: 'click', gain: 0.65 });

// subtítulos del cuerpo (índices relativos a «Te presento»); se ocultan cuando una tarjeta muestra las mismas palabras
subtitles(rel([
  [0, 1, { endRel: 2 }], [10, 12],
  [18, 19], [20, 21], [22, 25], [26, 28], [29, 30], [31, 32], [33, 34], [35, 37],
  [38, 40], [41, 43], [44, 46], [47, 49], [50, 53, { emph: [53] }], [54, 55], [56, 58], [59, 60],
  [61, 64], [65, 66, { endRel: 67 }],
  [70, 70], [71, 72], [73, 76, { endRel: 77 }], [83, 84], [85, 86], [87, 89],
  [90, 90], [91, 91], [92, 93], [94, 96], [97, 98], [99, 102], [103, 104], [105, 107], [108, 109],
  [110, 111], [112, 115], [116, 118], [119, 121], [122, 123], [124, 126], [127, 129], [130, 132], [133, 135], [136, 138, { endRel: 140 }],
  [145, 147], [148, 151],
  [152, 153], [154, 155], [156, 158, { text: ['si', 'tú ganas'], map: [156, 157], emph: [157] }],
  [159, 161, { emph: [161] }], [162, 163], [164, 166], [167, 169], [170, 172], [173, 175], [176, 178], [179, 179], [180, 182],
  [183, 184], [185, 188, { endRel: 189 }],
  [194, 195], [196, 198, { endRel: 199 }],
]));

tl.set({}, {}, DURATION);

// ------------------------------------------------------------------ aplicar estado procedural por frame
const cam = $('cam'), camwrap = $('camwrap'), bgv = $('bgv'), pipFrame = $('pipFrame');
const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
function apply(t) {
  const c = camAt(t);
  const [x, y, w, h] = c.rect; const [sx, sy, sw] = c.src; const k = w / sw;
  camwrap.style.left = x + 'px'; camwrap.style.top = y + 'px'; camwrap.style.width = w + 'px'; camwrap.style.height = h + 'px';
  camwrap.style.borderRadius = c.r + 'px';
  cam.style.transform = `translate(${-sx * k}px, ${-sy * k}px) scale(${k})`;
  pipFrame.style.opacity = Math.min(1, Math.max(0, (W - w) / 260));
  camwrap.style.filter = P.camBlur > 0.05 ? `blur(${P.camBlur}px)` : 'none';
  camwrap.style.opacity = P.camOp;
  bgv.style.opacity = P.bgv;
  if (V === 'hook1') $('notifNum').textContent = '+' + fmt(P.notif) + ' €';
  $('reqNum').textContent = '+' + fmt(P.req) + ' €';
}
async function setup() {
  await document.fonts.ready;
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
  window.SFX = SFX; window.DURATION = DURATION; window.T_END = T_END;
  window.ready = true;
}
window.renderFrame = async (i) => {
  const t = i / FPS;
  const vi = Math.min(i, CFG.frames - 1);
  const src = `frames_${V}/f${String(vi).padStart(5, '0')}.jpg`;
  if (cam._src !== src) { cam.src = src; bgv.src = src; cam._src = src; await Promise.all([cam.decode(), bgv.decode()]); }
  tl.seek(t, false);
  apply(t);
  return true;
};
setup();
})();
