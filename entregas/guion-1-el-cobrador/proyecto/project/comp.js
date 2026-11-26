// El cobrador — escenas «estilo Ramiro» y una nota a mano sobre el video original (1080×1920, 30 fps)
(() => {
const FPS = 30;
const WD = window.WORDS;
const ws = (i) => WD[i].s, we = (i) => WD[i].e;
const DURATION = 46.0667;
const SFX = [];
const tl = gsap.timeline({ paused: true });
const $ = (id) => document.getElementById(id);
const mk = (tag, cls, parent, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; if (parent) parent.appendChild(e); return e; };
const SVGNS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs, parent) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
const NARANJA = '#f0601f', TINTA = '#0b0b0b';

// ------------------------------------------------------------------ escenas Ramiro (tiempos en la salida)
const SCENES = [
  // «No estás pagando por un bot, estás pagando literalmente por un cartero» (12,2–15,33 s)
  { k: 'jobs', t0: 366 / FPS, t1: 460 / FPS, fondo: 'assets/f-cerebro.jpg', fh: 200, fx: 330, l4y: 704, dy: 74,
    l1: 'No <b>pagas</b>', l2: 'por un bot', l3: 'pagas literalmente', l4: 'por un cartero', at: { l1: .02, l2: .72, l3: 1.27, l4: 2.20, fl: 2.42, fd: [.38, .14] } },
  // «No califica, no decide, no vende» (21,97–24,4 s)
  { k: 'kiyosaki', t0: 659 / FPS, t1: 732 / FPS, fondo: 'assets/f-balanza.jpg', fh: 190, fx: 330, l4y: 704, dy: 70,
    l1: 'Un <b>cartero</b>', l2: 'no califica,', l3: 'no decide,', l4: 'no vende', at: { l1: .02, l2: .10, l3: .93, l4: 1.72, fl: 1.92, fd: [.32, .12] } },
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
  root.querySelector('.l4').style.top = (S.l4y || 677) + 'px';
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
  tl.fromTo(trazo, { strokeDashoffset: L }, { strokeDashoffset: 0, duration: (A.fd ? A.fd[0] : 0.55), ease: 'power2.inOut', immediateRender: false }, T + A.fl);
  const fp = A.fd ? A.fd[0] - 0.02 : 0.53;
  tl.set(punta, { attr: { opacity: 1 } }, T + A.fl + fp);
  tl.fromTo(punta, { strokeDashoffset: Pl }, { strokeDashoffset: 0, duration: (A.fd ? A.fd[1] : 0.2), ease: 'power1.out', immediateRender: false }, T + A.fl + fp);
  // grano: 12 cambios/seg ciclando 8 texturas
  const g = q('.grano');
  for (let i = 0; i < Math.ceil(D * 12); i++)
    tl.set(g, { backgroundImage: `url(assets/grano-${i % 8}.png)`, backgroundPosition: `${(i * 137) % 540}px ${(i * 251) % 960}px` }, T + i / 12);
  SFX.push({ t: T, type: 'paper' }, { t: T + A.l3, type: 'tick', gain: 0.8 }, { t: T + A.l4, type: 'tick', gain: 0.8 }, { t: T + A.fl, type: 'pencil' });
}

// ------------------------------------------------------------------ nota a mano sobre el hablante (40,2–40,9 s, antes del destello de transición)
const cam = $('cam'), fx = $('fx');
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
function hw(text, x, y, size, rot, t, out, dur = 0.45) {
  const e = mk('div', 'hw', fx); e.textContent = text; Object.assign(e.style, { left: x + 'px', top: y + 'px', fontSize: size + 'px' });
  tl.set(e, { opacity: 0, rotation: rot, scaleY: 0.88, clipPath: 'inset(0 100% 0 0)' }, 0);
  tl.set(e, { opacity: 1 }, t);
  tl.fromTo(e, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: dur, ease: 'power2.out', immediateRender: false }, t);
  if (out !== undefined) tl.set(e, { opacity: 0 }, out);
  SFX.push({ t, type: 'pencil', gain: 0.5 }); return e;
}

const N0 = 1204 / FPS, N1 = 1232 / FPS;   // ventana de la nota (frames 1204–1231; el destello de transición del original empieza en el 1232)
hw('gratis', 34, 636, 90, -6, 40.20, N1, 0.22);
hw('para', 40, 738, 64, -4, 40.52, N1, 0.2);
hw('siempre', 40, 804, 64, -4, 40.66, N1, 0.24);
stroke('M 40 906 C 120 888, 210 914, 296 894', 40.86, 0.16, { color: NARANJA, w: 7, out: N1 });
const WINDOWS = [[N0, N1]];

// ------------------------------------------------------------------ montaje
async function setup() {
  await document.fonts.ready;
  await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  SCENES.forEach(buildScene);
  await Promise.all([...document.querySelectorAll('.pimg')].map((i) => i.decode().catch(() => {})));
  SCENES.forEach(sceneTimeline);
  tl.set({}, {}, DURATION);
  window.SFX = SFX.sort((a, b) => a.t - b.t); window.DURATION = DURATION; window.T_END = DURATION;
  window.WINDOWS = SCENES.map((s) => [s.t0, s.t1, 'escena']).concat(WINDOWS.map((w) => [w[0], w[1], 'nota']));
  window.ready = true;
}
function apply(t) {
  const sc = inScene(t);
  cam.style.visibility = sc ? 'hidden' : 'visible';
  fx.style.visibility = sc ? 'hidden' : 'visible';
}
window.renderFrame = async (i) => {
  const t = i / FPS;
  const src = `frames/f${String(i).padStart(5, '0')}.jpg`;
  if (cam._src !== src) { cam.src = src; cam._src = src; await cam.decode(); }
  tl.seek(t, false);
  apply(t);
  return true;
};
setup();
})();
