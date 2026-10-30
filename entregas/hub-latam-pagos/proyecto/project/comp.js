// Hub Latam Pagos — composición completa (video + subtítulos + motions sencillas + escenas «estilo Ramiro» + tarjeta final)
(() => {
const FPS = 30;
const WD = window.WORDS;
const ws = (i) => WD[i].s, we = (i) => WD[i].e;
const T_END = CUTS.frames / FPS;           // fin de la voz (49,9 s)
const DURATION = T_END + 1.5;              // + tarjeta final
const SFX = [];
const tl = gsap.timeline({ paused: true });
const $ = (id) => document.getElementById(id);
const mk = (tag, cls, parent, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; if (parent) parent.appendChild(e); return e; };
const SVGNS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
const NARANJA = '#f0601f', TINTA = '#0b0b0b';

// ------------------------------------------------------------------ escenas Ramiro (tiempos en la salida)
const SCENES = [
  { k: 'buffett', t0: 11.16, t1: 15.50, fondo: 'assets/f-balanza.jpg', fh: 215, fx: 330,
    l1: 'Regla <b>nº 1</b>:', l2: 'no perder dinero.', l3: 'y tú pierdes', l4: 'hasta un 27 %', at: { l1: .08, l2: .24, l3: .70, l4: 1.32, fl: 1.85 } },
  { k: 'bezos', t0: 18.38, t1: 22.92, fondo: 'assets/f-mapa.jpg', fh: 270, fx: 300,
    l1: '<b>Obsesiónate</b>', l2: 'con tu cliente:', l3: 'si no ve', l4: 'su moneda local…', at: { l1: .08, l2: .24, l3: 1.40, l4: 1.80, fl: 2.35 } },
  { k: 'jobs', t0: 31.66, t1: 35.40, fondo: 'assets/f-cerebro.jpg', fh: 200, fx: 330,
    l1: 'Lo <b>simple</b>', l2: 'siempre gana:', l3: 'un solo link', l4: 'en todo el mundo', at: { l1: .08, l2: .24, l3: .80, l4: 1.50, fl: 2.00 } },
];
const inScene = (t) => SCENES.some((s) => t >= s.t0 - 0.001 && t < s.t1);

const FILTERS = (k) => `
  <filter id="dist-${k}" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence class="turb" type="fractalNoise" baseFrequency="0.004 0.006" numOctaves="1" seed="7" result="ruido" />
    <feDisplacementMap class="desp" in="SourceGraphic" in2="ruido" scale="8" xChannelSelector="R" yChannelSelector="G" />
  </filter>
  <filter id="tinta-${k}" x="-10%" y="-40%" width="125%" height="180%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="11" result="tn" />
    <feDisplacementMap in="SourceGraphic" in2="tn" scale="7" xChannelSelector="R" yChannelSelector="G" result="dt" />
    <feGaussianBlur in="dt" stdDeviation="4" result="b" />
    <feComponentTransfer in="b" result="ink"><feFuncA type="linear" slope="9" intercept="-3.7" /></feComponentTransfer>
    <feFlood flood-color="#ff1e46" flood-opacity=".55" /><feComposite in2="ink" operator="in" /><feOffset dx="-5" result="r" />
    <feFlood flood-color="#00b4ff" flood-opacity=".55" /><feComposite in2="ink" operator="in" /><feOffset dx="5" result="c" />
    <feGaussianBlur in="ink" stdDeviation="5 0.6" /><feOffset dx="12" />
    <feComponentTransfer result="g"><feFuncA type="linear" slope=".4" /></feComponentTransfer>
    <feMerge><feMergeNode in="g" /><feMergeNode in="r" /><feMergeNode in="c" /><feMergeNode in="ink" /></feMerge>
  </filter>
  <filter id="rgbm-${k}" x="-5%" y="-10%" width="110%" height="120%" color-interpolation-filters="sRGB">
    <feFlood flood-color="#ff1e46" flood-opacity=".4" /><feComposite in2="SourceAlpha" operator="in" /><feOffset dx="-3" result="r" />
    <feFlood flood-color="#00b4ff" flood-opacity=".3" /><feComposite in2="SourceAlpha" operator="in" /><feOffset dx="3" result="c" />
    <feMerge><feMergeNode in="r" /><feMergeNode in="c" /><feMergeNode in="SourceGraphic" /></feMerge>
  </filter>
  <filter id="fino-${k}"><feMorphology operator="erode" radius="1.3" /></filter>
  <filter id="boli-${k}" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="4" result="n" />
    <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
  </filter>
  <filter id="glitch-${k}" x="-5%" y="-2%" width="110%" height="104%" color-interpolation-filters="sRGB">
    <feOffset in="SourceGraphic" dx="0" result="d" />
    <feFlood flood-color="#00b4ff" flood-opacity=".38" /><feComposite in2="d" operator="in" /><feOffset dx="-3" result="c" />
    <feMerge><feMergeNode in="c" /><feMergeNode in="d" /></feMerge>
  </filter>`;

function buildScene(S) {
  const k = S.k, P = PERSONAS[k];
  const root = mk('div', 'rs', $('scenes')); root.id = 'rs-' + k;
  root.innerHTML = `<svg width="0" height="0" style="position:absolute">${FILTERS(k)}</svg>
    <div class="escena" style="filter:url(#dist-${k})">
      <div class="fondo" style="background-image:url(${S.fondo})"></div>
      <div class="mano l4" style="filter:url(#fino-${k}) url(#boli-${k}) url(#rgbm-${k})"><span>${S.l4}</span></div>
      <div class="pwrap"><div class="pin"><img class="pimg" src="assets/p-${k}.png" style="filter:url(#glitch-${k}) contrast(.85) brightness(1.06)"><div class="psombra" style="--sil:url(assets/p-${k}.png)"></div></div></div>
    </div>
    <div class="agua" style="filter:url(#dist-${k})"><div class="texto">
      <div class="grot l1" style="filter:url(#tinta-${k})">${S.l1}</div>
      <div class="grot l2" style="filter:url(#tinta-${k})">${S.l2}</div>
      <div class="mano l3" style="filter:url(#fino-${k}) url(#boli-${k}) url(#rgbm-${k})"><span>${S.l3}</span></div>
    </div></div>
    <svg class="flecha" viewBox="0 0 1080 1920"><g filter="url(#boli-${k})">
      <path class="trazo" fill="none" stroke="${TINTA}" stroke-width="7" stroke-linecap="round" opacity="0" />
      <path class="punta" fill="none" stroke="${TINTA}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity="0" />
    </g></svg>
    <div class="vineta"></div><div class="be si"></div><div class="be ii"></div><div class="be id"></div>
    <div class="scan"></div><div class="semi"></div><div class="grano"></div>`;
  // persona: cara de alto S.fh con el pelo justo bajo la línea 4 (la línea pasa por detrás de la cabeza)
  const l4 = root.querySelector('.l4').getBoundingClientRect();
  S.sx = l4.right - 30; S.sy = l4.top + 0.74 * l4.height;
  const top = 742 + (S.dy || 0);
  let fh = S.fh, sc = fh / (P.cara.h * P.h);
  if (P.abajo_continua && top + P.h * sc < 1860) { sc = (1860 - top) / P.h; fh = sc * P.cara.h * P.h; }   // la foto seguía: su borde inferior, fuera del encuadre
  const w = P.w * sc, h = P.h * sc, fw = P.cara.w * w;
  // borde derecho real de la cabeza (medido en el recorte): la punta de la flecha queda siempre fuera
  const hr = (P.cabeza_der - P.cara.cx) * w;
  const FX = Math.min(S.fx || 400, S.sx - 150 - hr);
  const left = FX - P.cara.cx * w, FY = top + P.cara.cy * h;
  const pw = root.querySelector('.pwrap');
  Object.assign(pw.style, { left: left + 'px', top: top + 'px', width: w + 'px', height: h + 'px' });
  const B = top + h;   // sombra y fundido en coordenadas del encuadre
  root.querySelector('.psombra').style.background = `linear-gradient(to top, rgba(0,0,0,.97) ${B - 1920}px, rgba(0,0,0,.85) ${B - 1720}px, rgba(0,0,0,.45) ${B - 1560}px, rgba(0,0,0,0) ${B - 1380}px)`;
  if (!P.abajo_continua) for (const e of root.querySelectorAll('.pimg, .psombra')) { e.style.webkitMaskImage = e.classList.contains('pimg') ? 'none' : ''; if (e.classList.contains('pimg')) e.style.maskImage = 'none'; }
  S.face = { x: FX, y: FY, w: fw, h: fh, right: FX + hr };
  S.root = root;
  return S;
}

function sceneTimeline(S) {
  const r = S.root, k = S.k, T = S.t0, D = S.t1 - S.t0, A = S.at;
  const q = (s) => r.querySelector(s);
  // flecha: nace bajo la última letra de la línea 4, curva a la derecha y vuelve a señalar a la persona sin tocarla
  const sx = S.sx, sy = S.sy;
  const tx = Math.min(S.face.right + 45, sx - 100), ty = S.face.y + 30;
  const dy = ty - sy;
  const trazo = q('.trazo'), punta = q('.punta');
  trazo.setAttribute('d', `M ${sx} ${sy} C ${sx + 60} ${sy + 0.08 * dy}, ${sx + 90} ${sy + 0.49 * dy}, ${sx + 32} ${sy + 0.78 * dy} C ${sx - 20} ${sy + 0.98 * dy}, ${tx + 95} ${ty + 5}, ${tx} ${ty}`);
  punta.setAttribute('d', `M ${tx + 32} ${ty - 29} Q ${tx + 18} ${ty - 15} ${tx - 2} ${ty} Q ${tx + 23} ${ty + 9} ${tx + 43} ${ty + 27}`);
  tl.set(r, { visibility: 'visible' }, T);
  tl.set(r, { visibility: 'hidden' }, S.t1);
  // capas
  tl.fromTo(q('.fondo'), { x: 60, scale: 1.0 }, { x: -60, scale: 1.04, duration: D, ease: 'none', immediateRender: false }, T);
  tl.fromTo(q('.pwrap'), { x: 0, scale: 1.0 }, { x: 50, scale: 1.02, duration: D, ease: 'none', immediateRender: false }, T);
  // entrada a saltos: A (medio cuerpo fuera) -> ~80 % -> B; siempre set, nunca tween
  tl.set(q('.pin'), { x: -330 }, T); tl.set(q('.pin'), { x: -150 }, T + 2 / FPS); tl.set(q('.pin'), { x: 0 }, T + 4 / FPS);
  // ondulación
  const turb = r.querySelector('.turb'), desp = r.querySelector('.desp');
  tl.fromTo(turb, { attr: { baseFrequency: '0.004 0.006' } }, { attr: { baseFrequency: '0.006 0.004' }, duration: D, ease: 'sine.inOut', immediateRender: false }, T);
  tl.fromTo(desp, { attr: { scale: 6 } }, { attr: { scale: 11 }, duration: D / 2, ease: 'sine.inOut', yoyo: true, repeat: 1, immediateRender: false }, T);
  // texto: grotesca desde fuera de plano; manuscrita sube de abajo arriba
  tl.fromTo(q('.l1'), { x: -1200 }, { x: 0, duration: 0.9, ease: 'expo.out', immediateRender: false }, T + A.l1);
  tl.fromTo(q('.l2'), { x: -1200 }, { x: 0, duration: 0.9, ease: 'expo.out', immediateRender: false }, T + A.l2);
  tl.fromTo(q('.l3 span'), { yPercent: 105 }, { yPercent: 0, duration: 0.7, ease: 'power4.out', immediateRender: false }, T + A.l3);
  tl.fromTo(q('.l4 span'), { yPercent: 105 }, { yPercent: 0, duration: 0.7, ease: 'power4.out', immediateRender: false }, T + A.l4);
  // antes de su entrada las líneas no existen (evita frames sueltos al hacer seek hacia atrás)
  tl.set(q('.l1'), { x: -1200 }, T); tl.set(q('.l2'), { x: -1200 }, T);
  tl.set(q('.l3 span'), { yPercent: 105 }, T); tl.set(q('.l4 span'), { yPercent: 105 }, T);
  // flecha a mano
  const L = trazo.getTotalLength(), Pl = punta.getTotalLength();
  tl.set(trazo, { attr: { opacity: 0 }, strokeDasharray: L, strokeDashoffset: L }, T);
  tl.set(punta, { attr: { opacity: 0 }, strokeDasharray: Pl, strokeDashoffset: Pl }, T);
  tl.set(trazo, { attr: { opacity: 1 } }, T + A.fl);
  tl.fromTo(trazo, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut', immediateRender: false }, T + A.fl);
  tl.set(punta, { attr: { opacity: 1 } }, T + A.fl + 0.53);
  tl.fromTo(punta, { strokeDashoffset: Pl }, { strokeDashoffset: 0, duration: 0.2, ease: 'power1.out', immediateRender: false }, T + A.fl + 0.53);
  // grano: 12 cambios/seg ciclando 8 texturas
  const g = q('.grano');
  for (let i = 0; i < Math.ceil(D * 12); i++)
    tl.set(g, { backgroundImage: `url(assets/grano-${i % 8}.png)`, backgroundPosition: `${(i * 137) % 540}px ${(i * 251) % 960}px` }, T + i / 12);
  SFX.push({ t: T, type: 'paper' }, { t: T + A.l3, type: 'tick', gain: 0.8 }, { t: T + A.l4, type: 'tick', gain: 0.8 }, { t: T + A.fl, type: 'pencil' });
}

// ------------------------------------------------------------------ video: punch-in alterno (100 / 106 %) en cada jump cut, anclado en la cara
const cam = $('cam');
cam.style.width = '1440px'; cam.style.height = '2560px';
const JOINS = [0, ...CUTS.joins];
const SHOTS = CUTS.shots;
const faceAt = (fr) => { for (let d = 0; d < 30; d++) { const f = FACES[fr - (fr % 3) + 3 * d] || FACES[fr - (fr % 3) - 3 * d]; if (f) return f; } return [380, 500, 320, 400]; };
const SEGS = [];
JOINS.forEach((t, i) => {
  const newShot = i === 0 || SHOTS.some((s) => Math.abs(s - t) < 0.05);
  const prev = SEGS[i - 1];
  const s = newShot ? 1.0 : (prev.s > 1.01 ? 1.0 : 1.06);
  const f = faceAt(Math.round(t * FPS) + 3);
  SEGS.push({ t, s, fx: f[0] + f[2] / 2, fy: f[1] + f[3] / 2 });
});
function camAt(t) { let s = SEGS[0]; for (const x of SEGS) if (x.t <= t + 1e-6) s = x; return s; }

// ------------------------------------------------------------------ subtítulos
const subs = $('subs');
const GROUPS = [
  [0, 2], [3, 4], [5, 6, { e: [5, 6] }], [7, 9], [10, 11], [12, 12], [13, 15], [16, 17], [18, 20], [21, 21], [22, 24], [25, 26],
  [27, 29, { e: [27, 28, 29] }],
  [41, 42], [43, 44], [45, 46], [47, 49],
  [68, 69], [70, 72], [73, 75], [76, 78], [79, 79, { e: [79] }],
  [80, 83], [84, 85, { e: [85] }], [86, 88], [89, 90], [91, 91], [92, 93],
  [107, 110], [111, 112, { e: [112] }], [113, 114], [115, 117], [118, 120], [121, 121, { e: [121] }], [122, 122, { e: [122] }], [123, 126],
  [127, 130], [131, 132], [133, 135, { e: [135] }], [136, 138], [139, 141],
  [142, 143], [144, 145, { e: [145] }], [146, 148, { e: [148] }], [149, 150], [151, 152],
];
const SENT = new Set(); WD.forEach((w, i) => { if (i === 0 || /[.?]$/.test(WD[i - 1].raw)) SENT.add(i); });
const nextSceneAfter = (t) => Math.min(...SCENES.filter((s) => s.t0 > t).map((s) => s.t0), DURATION);
GROUPS.forEach(([i0, i1, x = {}], gi) => {
  const start = ws(i0), nxt = GROUPS[gi + 1];
  let end = nxt && ws(nxt[0]) - we(i1) < 0.45 ? ws(nxt[0]) : we(i1) + 0.3;
  if (nxt) end = Math.min(end, ws(nxt[0]));
  end = Math.min(end, nextSceneAfter(start), T_END);
  const g = mk('div', 'sg', subs);
  const spans = [];
  for (let i = i0; i <= i1; i++) {
    const s = mk('span', 'w' + (x.e && x.e.includes(i) ? ' e' : ''), g);
    let tx = WD[i].raw.replace(/[,.]$/, '');
    if (SENT.has(i) && i === i0) tx = tx.charAt(0).toUpperCase() + tx.slice(1);
    s.textContent = tx; spans.push([s, i]);
  }
  gsap.set(g, { xPercent: -50, yPercent: -50 });
  tl.fromTo(g, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out', immediateRender: false }, start - 0.02);
  tl.set(g, { opacity: 0 }, end - 0.02);
  spans.forEach(([s, i], k) => {
    if (s.classList.contains('e')) {
      tl.fromTo(s, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.32, ease: 'power4.out', immediateRender: false }, ws(i) - 0.04);
      SFX.push({ t: ws(i), type: 'tick', gain: 0.7 });
    } else {
      const t1 = k + 1 < spans.length ? ws(spans[k + 1][1]) : end;
      tl.set(s, { color: '#FFD9C2' }, ws(i) - 0.02); tl.set(s, { color: '#FFFFFF' }, t1 - 0.02);
    }
  });
});

// ------------------------------------------------------------------ motions sencillas
const fx = $('fx');
const doodle = mk('div', '', fx); doodle.innerHTML = `<svg class="doodle" viewBox="0 0 1080 1920"></svg>`;
const dsvg = doodle.querySelector('svg');
function stroke(d, t, dur, opt = {}) {   // trazo a mano que se dibuja
  const p = svgEl('path', { d, stroke: opt.color || TINTA, 'stroke-width': opt.w || 7, filter: 'url(#g-boli)' }, dsvg);
  const L = p.getTotalLength();
  tl.set(p, { opacity: 0, strokeDasharray: L, strokeDashoffset: L }, 0);
  tl.set(p, { opacity: 1 }, t);
  tl.fromTo(p, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: dur, ease: opt.ease || 'power2.inOut', immediateRender: false }, t);
  if (opt.out !== undefined) tl.set(p, { opacity: 0 }, opt.out);
  if (opt.sfx !== false) SFX.push({ t, type: 'pencil', gain: opt.gain || 0.7 });
  return p;
}
function head(tx, ty, ang, t, opt = {}) {   // punta de flecha en (tx,ty) apuntando en dirección ang (radianes)
  const a1 = ang + Math.PI * 0.82, a2 = ang - Math.PI * 0.82, Lh = opt.len || 34;
  const d = `M ${tx + Lh * Math.cos(a1)} ${ty + Lh * Math.sin(a1)} L ${tx} ${ty} L ${tx + Lh * Math.cos(a2)} ${ty + Lh * Math.sin(a2)}`;
  return stroke(d, t, 0.16, { ...opt, ease: 'power1.out', sfx: false });
}
function pop(e, t, out, rot = 0) {   // entrada «a saltos» (como la persona de la escena Ramiro): 3 poses en 4 frames
  tl.set(e, { opacity: 0, rotation: rot }, 0);
  tl.set(e, { opacity: 1, scale: 0.72, rotation: rot - 4 }, t);
  tl.set(e, { scale: 1.1, rotation: rot + 2 }, t + 2 / FPS);
  tl.set(e, { scale: 1, rotation: rot }, t + 4 / FPS);
  if (out !== undefined) tl.set(e, { opacity: 0 }, out);
}
function tag(html, x, y, rot, t, out, cls = '') {
  const e = mk('div', 'tag ' + cls, fx, html); Object.assign(e.style, { left: x + 'px', top: y + 'px' });
  pop(e, t, out, rot); SFX.push({ t, type: 'tap' }); return e;
}
function hw(text, x, y, size, rot, t, out) {
  const e = mk('div', 'hw', fx); e.textContent = text; Object.assign(e.style, { left: x + 'px', top: y + 'px', fontSize: size + 'px' });
  tl.set(e, { opacity: 0, rotation: rot, scaleY: 0.88, clipPath: 'inset(0 100% 0 0)' }, 0);
  tl.set(e, { opacity: 1 }, t);
  tl.fromTo(e, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.45, ease: 'power2.out', immediateRender: false }, t);
  if (out !== undefined) tl.set(e, { opacity: 0 }, out);
  SFX.push({ t, type: 'pencil', gain: 0.5 }); return e;
}
const S1 = SCENES[0].t0, S2 = SCENES[1].t0, S3 = SCENES[2].t0, S4 = SHOTS[5];

// 1 · gancho: «como yo» (subtítulo en manuscrita) + flecha a mano que le señala
stroke('M 760 1190 C 830 1130, 835 1010, 700 905', ws(5) + 0.04, 0.28, { color: NARANJA, w: 8, out: ws(7) });
head(700, 905, Math.atan2(905 - 1010, 700 - 835), ws(5) + 0.3, { color: NARANJA, w: 8, out: ws(7) });

// 2 · cómo cobras hoy: etiquetas de papel que entran con su palabra y se tachan en «no es escalable»
const tH = tag('Hotmart', 70, 1066, -4, ws(11), S1);
const tS = tag('Stripe', 392, 1052, 3, ws(12), S1);
const tL = hw('+ LLC', 604, 984, 80, -6, ws(17), S1);
const tT = tag('Transferencia', 652, 1072, -2, ws(21), S1);
const z = ws(27) - 0.02;
stroke('M 52 1112 C 120 1090, 220 1124, 312 1094', z, 0.22, { w: 8, out: S1, gain: 0.9 });
stroke('M 372 1094 C 450 1078, 520 1108, 600 1082', z + 0.08, 0.22, { w: 8, out: S1, sfx: false });
stroke('M 636 1118 C 760 1092, 900 1128, 1036 1102', z + 0.16, 0.24, { w: 8, out: S1, sfx: false });
SFX.push({ t: z, type: 'scribble' });

// 3 · «…y lo único que hace es irse»: flecha que se escapa del plano
stroke('M 700 1222 C 820 1214, 930 1180, 1120 1120', ws(79) + 0.04, 0.3, { color: NARANJA, w: 8, out: SHOTS[2] });

// 4 · un enlace -> todos los países (columna derecha, libre de la cara)
tag('<small>tu enlace</small>kunfupay', 796, 520, 3, ws(83), S3);
const PAISES = [['Argentina', 'ARS', 90, 690, -3], ['España', 'EUR', 91, 836, 2], ['EE. UU.', 'USD', 92, 982, -2]];
PAISES.forEach(([n, c, wi, y, r]) => {
  tag(`<small>${n}</small>${c}`, 820, y, r, ws(wi), S3);
  stroke(`M 922 ${y - 46} C 912 ${y - 30}, 930 ${y - 16}, 918 ${y - 2}`, ws(wi) - 0.06, 0.14, { w: 5, out: S3, sfx: false });
});

// 5 · cripto
tag('<small>también</small>₿ cripto', 800, 640, -3, ws(112), SHOTS[4]);

// 6 · euros, dólares: símbolos a mano a la izquierda (lado libre)
hw('€', 130, 490, 200, -6, ws(121), S4);
hw('$', 250, 730, 200, 5, ws(122), S4);
stroke('M 308 470 C 164 436, 84 620, 140 800 C 180 930, 364 956, 392 820 C 410 700, 380 520, 284 480', ws(124) - 0.04, 0.5, { color: NARANJA, w: 6, out: S4 });

// 7 · «…ya aumentaron hasta un 27 % todas sus conversiones»: tarjeta de papel en el lado libre
tag('<small>conversiones</small><span class="big">+27 %</span>', 36, 560, -3, ws(135), ws(142) - 0.25, 'stat');
stroke('M 52 742 C 120 728, 210 748, 292 730', ws(138) - 0.02, 0.26, { color: NARANJA, w: 7, out: ws(142) - 0.25 });

// 8 · CTA: flecha a mano hacia el botón
stroke('M 905 1010 C 930 1110, 880 1220, 915 1330 C 930 1390, 915 1430, 905 1470', ws(145) - 0.02, 0.42, { color: NARANJA, w: 10, out: T_END });
head(905, 1470, Math.PI / 2, ws(145) + 0.38, { color: NARANJA, w: 10, out: T_END, len: 42 });

// ------------------------------------------------------------------ tarjeta final (mismo papel y textura que las escenas)
function endCard() {
  const r = mk('div', 'rs', $('scenes')); r.id = 'end';
  r.innerHTML = `<svg width="0" height="0" style="position:absolute">${FILTERS('end')}</svg>
    <div class="escena" style="filter:url(#dist-end)"><div class="fondo" style="background-image:url(assets/f-america.jpg);top:300px;left:40px;opacity:.22"></div></div>
    <div class="agua" style="filter:url(#dist-end)">
      <div class="marca" style="filter:url(#tinta-end)">kunfupay</div>
      <div class="frase" style="filter:url(#fino-end) url(#boli-end) url(#rgbm-end)"><span>cobrá en cualquier moneda</span></div>
    </div>
    <div class="vineta"></div><div class="be si"></div><div class="be ii"></div><div class="be id"></div>
    <div class="scan"></div><div class="semi"></div><div class="grano"></div>`;
  const T = T_END, D = DURATION - T_END, q = (s) => r.querySelector(s);
  tl.set(r, { visibility: 'visible' }, T);
  tl.fromTo(q('.fondo'), { x: 40, scale: 1 }, { x: -40, scale: 1.03, duration: D, ease: 'none', immediateRender: false }, T);
  tl.set(q('.marca'), { x: -1200 }, T);
  tl.fromTo(q('.marca'), { x: -1200 }, { x: 0, duration: 0.8, ease: 'expo.out', immediateRender: false }, T + 0.05);
  tl.set(q('.frase span'), { yPercent: 105 }, T);
  tl.fromTo(q('.frase span'), { yPercent: 105 }, { yPercent: 0, duration: 0.7, ease: 'power4.out', immediateRender: false }, T + 0.42);
  const g = q('.grano');
  for (let i = 0; i < Math.ceil(D * 12); i++)
    tl.set(g, { backgroundImage: `url(assets/grano-${i % 8}.png)`, backgroundPosition: `${(i * 137) % 540}px ${(i * 251) % 960}px` }, T + i / 12);
  SFX.push({ t: T, type: 'paper' }, { t: T + 0.42, type: 'tick' });
}

// ------------------------------------------------------------------ montaje
async function setup() {
  await document.fonts.ready;
  await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  SCENES.forEach(buildScene);
  await Promise.all([...document.querySelectorAll('.pimg')].map((i) => i.decode().catch(() => {})));
  SCENES.forEach(sceneTimeline);
  endCard();
  tl.set({}, {}, DURATION);
  window.SFX = SFX.sort((a, b) => a.t - b.t); window.DURATION = DURATION; window.T_END = T_END;
  window.SCENES_T = SCENES.map((s) => [s.t0, s.t1]).concat([[T_END, DURATION]]);
  window.ready = true;
}
function apply(t) {
  const c = camAt(t);
  cam.style.transform = `translate(${c.fx * (1 - c.s)}px, ${c.fy * (1 - c.s)}px) scale(${0.75 * c.s})`;
  cam.style.visibility = inScene(t) || t >= T_END ? 'hidden' : 'visible';
  fx.style.visibility = subs.style.visibility = cam.style.visibility;
}
window.renderFrame = async (i) => {
  const t = i / FPS;
  const vi = Math.min(i, CUTS.frames - 1);
  const src = `frames/f${String(vi).padStart(5, '0')}.jpg`;
  if (cam._src !== src) { cam.src = src; cam._src = src; await cam.decode(); }
  tl.seek(t, false);
  apply(t);
  return true;
};
setup();
})();
