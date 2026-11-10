/* Toma — interfaz principal: biblioteca, configuración, grabación y reproductor */
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
const api = window.toma;
let INFO = { platform: 'linux', systemAudio: false, ffmpeg: true };

// ---------- Utilidades ----------
const ico = (name) => `<svg class="ico"><use href="#i-${name}"/></svg>`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pad2 = (n) => String(n).padStart(2, '0');
function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
function fmtDur(s) {
  if (!isFinite(s) || s < 0) s = 0;
  s = Math.round(s);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  return h ? `${h}:${pad2(m)}:${pad2(x)}` : `${m}:${pad2(x)}`;
}
function fmtTimePrecise(s) {
  const m = Math.floor(s / 60), x = (s % 60).toFixed(1);
  return `${m}:${x.padStart(4, '0')}`;
}
function fmtSize(b) {
  if (!b) return '0 MB';
  if (b >= 1e9) return (b / 1e9).toFixed(2) + ' GB';
  if (b < 1e6) return Math.max(1, Math.round(b / 1e3)) + ' KB';
  return (b / 1e6).toFixed(b < 1e7 ? 1 : 0) + ' MB';
}
function fmtDate(iso) {
  const d = new Date(iso), now = new Date();
  const time = d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
  const day = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((day(now) - day(d)) / 86400000);
  if (diff === 0) return `Hoy, ${time}`;
  if (diff === 1) return `Ayer, ${time}`;
  const opts = { day: 'numeric', month: 'short' };
  if (d.getFullYear() !== now.getFullYear()) opts.year = 'numeric';
  return d.toLocaleDateString('es', opts);
}
const MODE_LABEL = { 'screen-cam': 'Pantalla + cámara', screen: 'Pantalla', cam: 'Cámara', import: 'Importado' };
const MODE_ICON = { 'screen-cam': 'both', screen: 'screen', cam: 'cam', import: 'import' };
const keys = () => (INFO.platform === 'darwin'
  ? { rec: ['⌥', '⇧', 'R'], pause: ['⌥', '⇧', 'P'], cancel: ['⌥', '⇧', 'C'] }
  : { rec: ['Alt', 'Shift', 'R'], pause: ['Alt', 'Shift', 'P'], cancel: ['Alt', 'Shift', 'C'] });
const kbd = (arr) => arr.map((k) => `<kbd>${k}</kbd>`).join(' ');

let toastTimer;
function toast(msg, err = false) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.toggle('err', err);
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), err ? 6000 : 2800);
}
function busy(text) {
  if (text) { $('#busy-text').textContent = text; $('#busy').classList.remove('hidden'); }
  else $('#busy').classList.add('hidden');
}
let confirmDone = null;
function askConfirm({ title, text = '', ok = 'Aceptar', danger = false }) {
  return new Promise((resolve) => {
    $('#confirm-title').textContent = title;
    $('#confirm-text').textContent = text;
    const yes = $('#confirm-yes'), no = $('#confirm-no');
    yes.textContent = ok;
    yes.className = danger ? 'btn danger-solid' : 'btn primary';
    confirmDone = (val) => {
      $('#confirm').classList.add('hidden');
      confirmDone = null;
      resolve(val);
    };
    yes.onclick = () => confirmDone && confirmDone(true);
    no.onclick = () => confirmDone && confirmDone(false);
    $('#confirm').classList.remove('hidden');
    yes.focus();
  });
}
function showView(name) {
  $('#view-library').classList.toggle('hidden', name !== 'library');
  $('#view-player').classList.toggle('hidden', name !== 'player');
}

// ---------- Menú contextual ----------
function hideCtx() { $('#ctx').classList.add('hidden'); }
function showCtx(x, y, items) {
  const el = $('#ctx');
  el.innerHTML = '';
  for (const it of items) {
    if (it === 'sep') { el.appendChild(document.createElement('hr')); continue; }
    const b = document.createElement('button');
    if (it.danger) b.className = 'danger';
    b.innerHTML = `${ico(it.icon)}<span></span>`;
    b.querySelector('span').textContent = it.label;
    b.addEventListener('click', () => { hideCtx(); it.action(); });
    el.appendChild(b);
  }
  el.classList.remove('hidden');
  const r = el.getBoundingClientRect();
  el.style.left = Math.max(8, Math.min(x, window.innerWidth - r.width - 8)) + 'px';
  el.style.top = Math.max(8, Math.min(y, window.innerHeight - r.height - 8)) + 'px';
}
document.addEventListener('mousedown', (e) => { if (!e.target.closest('#ctx')) hideCtx(); });
window.addEventListener('blur', hideCtx);
window.addEventListener('resize', hideCtx);

// ---------- Biblioteca ----------
let library = [];
let current = null;
const view = { filter: 'all', sort: 'new' };
const FILTERS = {
  all: { title: 'Todos los videos', test: () => true },
  fav: { title: 'Favoritos', test: (v) => !!v.favorite },
  screen: { title: 'Grabaciones de pantalla', test: (v) => v.mode === 'screen' || v.mode === 'screen-cam' },
  cam: { title: 'Grabaciones de cámara', test: (v) => v.mode === 'cam' },
};
const SORTS = {
  new: (a, b) => b.createdAt.localeCompare(a.createdAt),
  old: (a, b) => a.createdAt.localeCompare(b.createdAt),
  title: (a, b) => a.title.localeCompare(b.title, 'es'),
  long: (a, b) => (b.duration || 0) - (a.duration || 0),
};

async function loadLibrary() {
  library = await api.list();
  renderLibrary();
}
function replaceInLibrary(v) {
  const i = library.findIndex((x) => x.id === v.id);
  if (i >= 0) library[i] = v; else library.unshift(v);
  renderSidebar();
}

function renderSidebar() {
  for (const k of Object.keys(FILTERS)) {
    const n = library.filter(FILTERS[k].test).length;
    $(`#n-${k}`).textContent = n || '';
  }
  $$('#nav button').forEach((b) => b.classList.toggle('on', b.dataset.filter === view.filter));
  const total = library.reduce((s, v) => s + (v.size || 0), 0);
  $('#storage').textContent = library.length
    ? `${library.length} video${library.length === 1 ? '' : 's'} · ${fmtSize(total)}`
    : 'Sin videos todavía';
}

function renderLibrary() {
  renderSidebar();

  const q = $('#search').value.trim().toLowerCase();
  let items = library.filter(FILTERS[view.filter].test);
  if (q) items = items.filter((v) => (v.title + ' ' + (v.notes || '')).toLowerCase().includes(q));
  items.sort(SORTS[view.sort]);

  $('#lib-title').textContent = q ? `Resultados para “${$('#search').value.trim()}”` : FILTERS[view.filter].title;
  const grid = $('#grid');
  grid.innerHTML = '';
  const isEmpty = library.length === 0;
  $('#empty').classList.toggle('hidden', !isEmpty);
  $('#lib-title').classList.toggle('hidden', isEmpty);
  $('#no-results').classList.toggle('hidden', isEmpty || items.length > 0);
  for (const v of items) grid.appendChild(cardFor(v));
}

function cardFor(v) {
  const el = document.createElement('div');
  el.className = 'card';
  el.tabIndex = 0;
  el.innerHTML = `
    <div class="thumb">
      ${v.thumbSrc ? '' : `<div class="noimg">${ico('play')}</div>`}
      <div class="tools">
        <button class="fav${v.favorite ? ' fav-on' : ''}" title="Favorito">${ico('star')}</button>
        <button class="more" title="Más opciones">${ico('more')}</button>
      </div>
      <div class="play">${ico('play')}</div>
      <span class="dur">${fmtDur(v.duration)}</span>
    </div>
    <div class="card-body">
      <div class="card-title"></div>
      <div class="card-sub">${ico(MODE_ICON[v.mode] || 'screen')}<span>${fmtDate(v.createdAt)} · ${fmtSize(v.size)}</span></div>
    </div>`;
  if (v.thumbSrc) $('.thumb', el).style.backgroundImage = `url("${v.thumbSrc}")`;
  $('.card-title', el).textContent = v.title;
  el.title = v.title;
  el.addEventListener('click', () => openPlayer(v));
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter') openPlayer(v); });
  $('.fav', el).addEventListener('click', async (e) => {
    e.stopPropagation();
    const nv = await api.update(v.id, { favorite: !v.favorite });
    if (nv) { replaceInLibrary(nv); renderLibrary(); }
  });
  const menu = (x, y) => showCtx(x, y, [
    { icon: 'play', label: 'Abrir', action: () => openPlayer(v) },
    { icon: 'pen', label: 'Cambiar título', action: () => openPlayer(v, { rename: true }) },
    { icon: 'star', label: v.favorite ? 'Quitar de favoritos' : 'Añadir a favoritos', action: () => $('.fav', el).click() },
    { icon: 'export', label: 'Exportar MP4', action: () => doExport(v, 'mp4') },
    { icon: 'folder', label: 'Mostrar en carpeta', action: () => api.showInFolder(v.id) },
    'sep',
    { icon: 'trash', label: 'Eliminar', danger: true, action: () => deleteVideo(v) },
  ]);
  $('.more', el).addEventListener('click', (e) => {
    e.stopPropagation();
    const r = e.currentTarget.getBoundingClientRect();
    menu(r.left, r.bottom + 6);
  });
  el.addEventListener('contextmenu', (e) => { e.preventDefault(); menu(e.clientX, e.clientY); });
  return el;
}

async function deleteVideo(v) {
  const ok = await askConfirm({
    title: '¿Eliminar este video?',
    text: `“${v.title}” se moverá a la papelera.`,
    ok: 'Eliminar',
    danger: true,
  });
  if (!ok) return;
  await api.remove(v.id);
  toast('Video eliminado');
  if (current && current.id === v.id) goLibrary();
  else loadLibrary();
}

async function doExport(v, fmt) {
  try {
    busy(fmt === 'gif' ? 'Creando GIF…' : 'Exportando MP4…');
    const out = await api.exportVideo(v.id, fmt);
    busy();
    if (out) toast('Exportado en ' + out);
  } catch (e) { busy(); toast('No se pudo exportar: ' + e.message, true); }
}

async function importVideos() {
  try {
    busy('Importando…');
    const added = await api.importVideos();
    busy();
    if (added.length) {
      toast(added.length === 1 ? 'Video importado' : `${added.length} videos importados`);
      await loadLibrary();
    }
  } catch (e) { busy(); toast('No se pudo importar: ' + e.message, true); }
}

$('#search').addEventListener('input', renderLibrary);
$('#sort').addEventListener('change', (e) => { view.sort = e.target.value; renderLibrary(); });
$$('#nav button').forEach((b) => b.addEventListener('click', () => {
  view.filter = b.dataset.filter;
  if (current) goLibrary(); else renderLibrary();
}));
$('#btn-folder').addEventListener('click', () => api.openFolder());
$('#btn-import').addEventListener('click', importVideos);

// ---------- Reproductor ----------
const player = $('#player');
let notesTimer = null;

function openPlayer(v, opts = {}) {
  flushNotes();
  current = v;
  showView('player');
  player.src = v.src;
  player.playbackRate = Number($('#speed .on').dataset.s);
  $('#title').value = v.title;
  $('#notes').value = v.notes || '';
  $('#notes-status').textContent = '';
  $('#chapter-label').value = '';
  renderMeta();
  renderChapters();
  renderFav();
  closeTrim();
  if (opts.rename) { $('#title').focus(); $('#title').select(); }
}

function goLibrary() {
  flushNotes();
  player.pause();
  player.removeAttribute('src');
  player.load();
  current = null;
  showView('library');
  loadLibrary();
}

function renderMeta() {
  const v = current;
  const chips = [fmtDate(v.createdAt), fmtDur(v.duration), fmtSize(v.size)];
  if (v.width && v.height) chips.push(`${v.width}×${v.height}`);
  if (MODE_LABEL[v.mode]) chips.push(MODE_LABEL[v.mode]);
  chips.push(/\.mp4$/i.test(v.file) ? 'MP4' : 'WebM');
  $('#meta').innerHTML = chips.map((c) => `<span>${escapeHtml(c)}</span>`).join('')
    + (v.voiceIsolated ? '<span class="good">Voz aislada</span>' : '');
}
function renderFav() {
  $('#btn-fav').classList.toggle('on', !!current.favorite);
  $('#btn-fav span').textContent = current.favorite ? 'En favoritos' : 'Favorito';
}

player.addEventListener('loadedmetadata', () => {
  if (!current) return;
  const d = player.duration;
  if (isFinite(d) && d > 0 && Math.abs(d - (current.duration || 0)) > 0.5) {
    current.duration = d;
    api.setDuration(current.id, d);
    renderMeta();
  }
  if (trimState.open) resetTrim();
});
player.addEventListener('error', () => { if (current && player.src) toast('No se pudo reproducir este video', true); });

$('#btn-back').addEventListener('click', goLibrary);
$$('#speed button').forEach((b) => b.addEventListener('click', () => {
  $$('#speed button').forEach((x) => x.classList.remove('on'));
  b.classList.add('on');
  player.playbackRate = Number(b.dataset.s);
}));

async function patchVideo(id, patch) {
  const v = await api.update(id, patch);
  if (v) {
    replaceInLibrary(v);
    if (current && current.id === v.id) current = v;
  }
  return v;
}
function flushNotes() {
  if (!notesTimer || !current) return;
  clearTimeout(notesTimer);
  notesTimer = null;
  patchVideo(current.id, { notes: $('#notes').value });
}

$('#title').addEventListener('change', () => { if (current) patchVideo(current.id, { title: $('#title').value }); });
$('#title').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') e.target.blur();
  if (e.key === 'Escape') { e.target.value = current.title; e.target.blur(); }
});
$('#notes').addEventListener('input', () => {
  $('#notes-status').textContent = '';
  clearTimeout(notesTimer);
  const id = current.id;
  notesTimer = setTimeout(async () => {
    notesTimer = null;
    await patchVideo(id, { notes: $('#notes').value });
    if (current && current.id === id) $('#notes-status').textContent = 'Guardado';
  }, 600);
});
$('#btn-fav').addEventListener('click', async () => {
  await patchVideo(current.id, { favorite: !current.favorite });
  renderFav();
});

// Marcadores
function renderChapters() {
  const ul = $('#chapters');
  ul.innerHTML = '';
  const list = (current.chapters || []).slice().sort((a, b) => a.t - b.t);
  if (!list.length) {
    ul.innerHTML = '<li class="none">Pausa en un momento importante y añade un marcador para volver a él con un clic.</li>';
    return;
  }
  for (const c of list) {
    const li = document.createElement('li');
    li.innerHTML = `<span class="t"></span><span class="l"></span><button class="x" title="Quitar">${ico('x')}</button>`;
    $('.t', li).textContent = fmtDur(c.t);
    $('.l', li).textContent = c.label;
    li.addEventListener('click', () => { player.currentTime = c.t; player.play(); });
    $('.x', li).addEventListener('click', async (e) => {
      e.stopPropagation();
      await patchVideo(current.id, { chapters: (current.chapters || []).filter((x) => !(x.t === c.t && x.label === c.label)) });
      renderChapters();
    });
    ul.appendChild(li);
  }
}
async function addChapter() {
  const label = $('#chapter-label').value.trim() || `Marcador ${fmtDur(player.currentTime)}`;
  await patchVideo(current.id, { chapters: [...(current.chapters || []), { t: player.currentTime, label }] });
  $('#chapter-label').value = '';
  renderChapters();
}
$('#chapter-add').addEventListener('click', addChapter);
$('#chapter-label').addEventListener('keydown', (e) => { if (e.key === 'Enter') addChapter(); });

// Acciones
$('#btn-export-mp4').addEventListener('click', () => doExport(current, 'mp4'));
$('#btn-export-gif').addEventListener('click', () => doExport(current, 'gif'));
$('#btn-show').addEventListener('click', () => api.showInFolder(current.id));
$('#btn-ext').addEventListener('click', () => api.openExternal(current.id));
$('#btn-copy').addEventListener('click', async () => { await api.copyPath(current.id); toast('Ruta copiada al portapapeles'); });
$('#btn-delete').addEventListener('click', () => deleteVideo(current));
$('#btn-voice').addEventListener('click', async () => {
  if (current.voiceIsolated) {
    const again = await askConfirm({ title: 'Este video ya tiene la voz aislada', text: 'Aplicarlo de nuevo puede hacer que la voz suene artificial.', ok: 'Aplicar otra vez' });
    if (!again) return;
  }
  try {
    const t = player.currentTime;
    player.pause();
    busy('Aislando la voz…');
    const v = await api.isolateVoice(current.id);
    busy();
    replaceInLibrary(v);
    openPlayer(v);
    player.currentTime = t;
    toast('Listo: se redujo el ruido de fondo');
  } catch (e) { busy(); toast('No se pudo aislar la voz: ' + e.message, true); }
});

// Recorte
const trimState = { open: false, start: 0, end: 0, previewing: false };
function dur() { return isFinite(player.duration) && player.duration > 0 ? player.duration : ((current && current.duration) || 0); }
function resetTrim() { trimState.start = 0; trimState.end = dur(); drawTrim(); }
function closeTrim() {
  trimState.open = false;
  trimState.previewing = false;
  $('#trim-panel').classList.add('hidden');
}
function drawTrim() {
  const d = dur() || 1;
  const a = (trimState.start / d) * 100, b = (trimState.end / d) * 100;
  $('#trim-sel').style.left = a + '%';
  $('#trim-sel').style.width = Math.max(0, b - a) + '%';
  $('#trim-h-start').style.left = a + '%';
  $('#trim-h-end').style.left = b + '%';
  $('#trim-playhead').style.left = Math.min(100, (player.currentTime / d) * 100) + '%';
  $('#trim-label').textContent = `${fmtTimePrecise(trimState.start)} → ${fmtTimePrecise(trimState.end)} · quedan ${fmtDur(trimState.end - trimState.start)}`;
}
$('#btn-trim-toggle').addEventListener('click', () => {
  trimState.open = !trimState.open;
  $('#trim-panel').classList.toggle('hidden', !trimState.open);
  if (trimState.open) resetTrim();
});
function dragHandle(el, which) {
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    el.setPointerCapture(e.pointerId);
    const rect = $('#trim-track').getBoundingClientRect();
    const move = (ev) => {
      const t = Math.min(1, Math.max(0, (ev.clientX - rect.left) / rect.width)) * dur();
      if (which === 'start') trimState.start = Math.max(0, Math.min(t, trimState.end - 0.5));
      else trimState.end = Math.min(dur(), Math.max(t, trimState.start + 0.5));
      player.currentTime = which === 'start' ? trimState.start : trimState.end;
      drawTrim();
    };
    const up = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  });
  el.addEventListener('click', (e) => e.stopPropagation());
}
dragHandle($('#trim-h-start'), 'start');
dragHandle($('#trim-h-end'), 'end');
$('#trim-track').addEventListener('click', (e) => {
  const rect = $('#trim-track').getBoundingClientRect();
  player.currentTime = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)) * dur();
});
$('#trim-set-start').addEventListener('click', () => { trimState.start = Math.max(0, Math.min(player.currentTime, trimState.end - 0.5)); drawTrim(); });
$('#trim-set-end').addEventListener('click', () => { trimState.end = Math.min(dur(), Math.max(player.currentTime, trimState.start + 0.5)); drawTrim(); });
$('#trim-preview').addEventListener('click', () => {
  player.currentTime = trimState.start;
  player.play();
  trimState.previewing = true;
});
player.addEventListener('timeupdate', () => {
  if (trimState.open) drawTrim();
  if (trimState.previewing && player.currentTime >= trimState.end) { player.pause(); trimState.previewing = false; }
});
$('#trim-apply').addEventListener('click', async () => {
  if (trimState.start < 0.05 && trimState.end > dur() - 0.05) return toast('Mueve los extremos naranjas para elegir qué parte conservar');
  const ok = await askConfirm({
    title: '¿Recortar el video?',
    text: `Se conservará de ${fmtTimePrecise(trimState.start)} a ${fmtTimePrecise(trimState.end)}. El original se moverá a la papelera.`,
    ok: 'Recortar',
  });
  if (!ok) return;
  try {
    player.pause();
    busy('Recortando video…');
    const v = await api.trim(current.id, trimState.start, trimState.end);
    busy();
    replaceInLibrary(v);
    openPlayer(v);
    toast('Recorte aplicado');
  } catch (e) { busy(); toast('No se pudo recortar: ' + e.message, true); }
});

// ---------- Configuración de grabación ----------
const store = {
  get: (k, d) => { const v = localStorage.getItem(k); return v === null ? d : v; },
  bool: (k, d) => { const v = localStorage.getItem(k); return v === null ? d : v === '1'; },
  set: (k, v) => localStorage.setItem(k, typeof v === 'boolean' ? (v ? '1' : '0') : v),
};
const cfg = {
  mode: store.get('mode', 'screen-cam'),
  sourceId: null,
  filter: 'screen',
  camId: store.get('camId', ''),
  micId: store.get('micId', ''),
  bubble: store.get('bubble', 'm'),
  quality: store.get('quality', '1080'),
  systemAudio: store.bool('systemAudio', false),
  voiceIso: store.bool('voiceIso', true),
  mirror: store.bool('mirror', true),
  countdown: store.bool('countdown', true),
  hideMain: store.bool('hideMain', true),
};
let sources = [];
let sourcesLoaded = false;
let screenAccess = 'granted';
let micPreview = null, micCtx = null, micRaf = 0;
let camPreviewStream = null;
let setupOpen = false;

async function ensureDeviceLabels() {
  // Los nombres de cámara/micrófono solo aparecen tras conceder acceso una vez
  const devs = await navigator.mediaDevices.enumerateDevices();
  const need = (kind) => devs.some((d) => d.kind === kind && !d.label);
  const want = { audio: need('audioinput'), video: need('videoinput') };
  if (!want.audio && !want.video) return;
  try {
    const s = await navigator.mediaDevices.getUserMedia(want);
    s.getTracks().forEach((t) => t.stop());
  } catch {
    if (want.audio && want.video) {
      try { const s = await navigator.mediaDevices.getUserMedia({ audio: true }); s.getTracks().forEach((t) => t.stop()); } catch {}
    }
  }
}

async function fillDevices() {
  const devs = await navigator.mediaDevices.enumerateDevices();
  const cams = devs.filter((d) => d.kind === 'videoinput');
  const mics = devs.filter((d) => d.kind === 'audioinput' && d.deviceId !== 'communications');
  const camSel = $('#cam-select'), micSel = $('#mic-select');
  camSel.innerHTML = cams.map((d, i) => `<option value="${escapeHtml(d.deviceId)}">${escapeHtml(d.label || 'Cámara ' + (i + 1))}</option>`).join('')
    || '<option value="">No se detectó ninguna cámara</option>';
  micSel.innerHTML = '<option value="none">Sin micrófono</option>'
    + mics.map((d, i) => `<option value="${escapeHtml(d.deviceId)}">${escapeHtml(d.label || 'Micrófono ' + (i + 1))}</option>`).join('');
  if (cams.some((c) => c.deviceId === cfg.camId)) camSel.value = cfg.camId; else cfg.camId = camSel.value;
  if (cfg.micId === 'none' || mics.some((m) => m.deviceId === cfg.micId)) micSel.value = cfg.micId;
  else {
    micSel.value = (mics.find((m) => m.deviceId === 'default') || mics[0] || { deviceId: 'none' }).deviceId;
    cfg.micId = micSel.value;
  }
  updateMicNote();
}
function updateMicNote() {
  const opt = $('#mic-select').selectedOptions[0];
  const bt = !!opt && /bluetooth|airpods|hands-?free|headset/i.test(opt.textContent);
  $('#mic-note').classList.toggle('hidden', !bt);
}

async function loadSources() {
  try { sources = await api.listSources(); } catch { sources = []; }
  try { screenAccess = (await api.permStatus()).screen; } catch {}
  sourcesLoaded = true;
  if (!sources.some((s) => s.id === cfg.sourceId)) {
    cfg.sourceId = (sources.find((s) => s.type === 'screen') || sources[0] || { id: null }).id;
  }
  renderSources();
}

function renderSources() {
  const box = $('#sources');
  const note = $('#src-note');
  note.classList.add('hidden');
  if (cfg.mode === 'cam') {
    box.innerHTML = '<video id="cam-preview" class="wide" autoplay muted playsinline></video>';
    $('#cam-preview').classList.toggle('mirror', cfg.mirror);
    if (camPreviewStream) $('#cam-preview').srcObject = camPreviewStream;
    return;
  }
  const list = sources.filter((s) => s.type === cfg.filter);
  box.innerHTML = '';
  if (!sourcesLoaded) { box.innerHTML = '<p class="muted wide">Buscando pantallas y ventanas…</p>'; return; }
  if (!list.length && screenAccess !== 'granted') {
    box.innerHTML = `<div class="perm wide">
      <strong>Falta el permiso de Grabación de pantalla</strong>
      <p>macOS no deja que Toma vea tus pantallas hasta que lo autorices. Marca la casilla de <b>Toma</b> en los ajustes y después reinicia la app.</p>
      <div class="row"><button class="btn primary small" id="perm-open">Abrir ajustes de privacidad</button>
      <button class="btn small" id="perm-relaunch">Reiniciar Toma</button></div>
    </div>`;
    $('#perm-open').addEventListener('click', () => api.permRequest('screen'));
    $('#perm-relaunch').addEventListener('click', () => api.relaunch());
    return;
  }
  if (!list.length) {
    box.innerHTML = `<p class="muted wide">No hay ${cfg.filter === 'screen' ? 'pantallas' : 'ventanas abiertas'} para grabar.</p>`;
    return;
  }
  for (const s of list) {
    const el = document.createElement('div');
    el.className = 'source' + (s.id === cfg.sourceId ? ' on' : '');
    el.innerHTML = `${s.thumb ? '<img class="shot" alt="" />' : '<div class="shot"></div>'}<div class="name">${s.icon ? '<img alt="" />' : ''}<span></span></div>`;
    if (s.thumb) $('.shot', el).src = s.thumb;
    if (s.icon) $('.name img', el).src = s.icon;
    $('.name span', el).textContent = s.name;
    el.title = s.name;
    el.addEventListener('click', () => { cfg.sourceId = s.id; renderSources(); });
    el.addEventListener('dblclick', () => { cfg.sourceId = s.id; startRecording(); });
    box.appendChild(el);
  }
  const sel = sources.find((s) => s.id === cfg.sourceId);
  if (cfg.mode === 'screen-cam' && sel && sel.type === 'window') {
    note.textContent = 'Al grabar una sola ventana, tu cámara se añade en la esquina inferior izquierda del video.';
    note.classList.remove('hidden');
  }
}

function applyModeUI() {
  $$('#mode button').forEach((b) => b.classList.toggle('on', b.dataset.mode === cfg.mode));
  const cam = cfg.mode === 'cam';
  $('#cam-field').classList.toggle('hidden', cfg.mode === 'screen');
  $('#bubble-field').classList.toggle('hidden', cfg.mode !== 'screen-cam');
  $('#mirror-field').classList.toggle('hidden', cfg.mode === 'screen');
  $('#sysaudio-field').classList.toggle('hidden', cam || !INFO.systemAudio);
  $('#hide-main-field').classList.toggle('hidden', cam);
  $('#src-tools').classList.toggle('hidden', cam);
  $('#src-title').textContent = cam ? 'Así te verás' : '¿Qué quieres grabar?';
  $$('#bubble-size button').forEach((b) => b.classList.toggle('on', b.dataset.b === cfg.bubble));
  $$('#src-filter button').forEach((b) => b.classList.toggle('on', b.dataset.f === cfg.filter));
  renderSources();
  syncCamPreview();
}

async function syncCamPreview() {
  // Burbuja flotante para "Pantalla + Cámara"; vista previa interna para "Solo cámara"
  if (!setupOpen) return;
  if (cfg.mode === 'screen-cam' && cfg.camId) api.showBubble(cfg.camId, cfg.bubble, cfg.mirror);
  else api.hideBubble();
  if (cfg.mode === 'cam' && cfg.camId) {
    if (!camPreviewStream || camPreviewStream._id !== cfg.camId) {
      stopCamPreview();
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cfg.camId }, width: { ideal: 1280 }, height: { ideal: 720 } } });
        if (!setupOpen || cfg.mode !== 'cam') { s.getTracks().forEach((t) => t.stop()); return; }
        s._id = cfg.camId;
        camPreviewStream = s;
      } catch (e) { toast('No se pudo abrir la cámara: ' + e.message, true); }
    }
    const v = $('#cam-preview');
    if (v && camPreviewStream) v.srcObject = camPreviewStream;
  } else stopCamPreview();
}
function stopCamPreview() {
  if (camPreviewStream) { camPreviewStream.getTracks().forEach((t) => t.stop()); camPreviewStream = null; }
}

async function startMicMeter() {
  stopMicMeter();
  if (!cfg.micId || cfg.micId === 'none') return;
  try {
    const s = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: { exact: cfg.micId } } });
    if (!setupOpen) { s.getTracks().forEach((t) => t.stop()); return; }
    micPreview = s;
    micCtx = new AudioContext();
    const an = micCtx.createAnalyser();
    an.fftSize = 512;
    micCtx.createMediaStreamSource(micPreview).connect(an);
    const data = new Uint8Array(an.fftSize);
    const tick = () => {
      an.getByteTimeDomainData(data);
      let peak = 0;
      for (const x of data) peak = Math.max(peak, Math.abs(x - 128));
      $('#mic-meter').style.width = Math.min(100, (peak / 128) * 180) + '%';
      micRaf = requestAnimationFrame(tick);
    };
    tick();
  } catch {}
}
function stopMicMeter() {
  cancelAnimationFrame(micRaf);
  if (micPreview) micPreview.getTracks().forEach((t) => t.stop());
  if (micCtx) micCtx.close().catch(() => {});
  micPreview = null;
  micCtx = null;
  $('#mic-meter').style.width = '0';
}

async function openSetup() {
  if (rec || starting || setupOpen) return;
  hideCtx();
  if (!player.paused) player.pause();
  setupOpen = true;
  sourcesLoaded = false;
  $('#setup').classList.remove('hidden');
  $('#quality').value = cfg.quality;
  $('#sysaudio').checked = cfg.systemAudio;
  $('#voiceiso').checked = cfg.voiceIso;
  $('#mirror').checked = cfg.mirror;
  $('#countdown').checked = cfg.countdown;
  $('#hide-main').checked = cfg.hideMain;
  applyModeUI();
  loadSources();
  await ensureDeviceLabels();
  if (!setupOpen) return;
  await fillDevices();
  syncCamPreview();
  startMicMeter();
}
function closeSetup(keepBubble = false) {
  setupOpen = false;
  $('#setup').classList.add('hidden');
  stopMicMeter();
  stopCamPreview();
  if (!keepBubble) api.hideBubble();
}

$('#btn-new').addEventListener('click', openSetup);
$('#btn-empty-new').addEventListener('click', openSetup);
$('#setup-close').addEventListener('click', () => closeSetup());
$('#setup').addEventListener('mousedown', (e) => { if (e.target.id === 'setup') closeSetup(); });
$('#src-refresh').addEventListener('click', loadSources);
$$('#mode button').forEach((b) => b.addEventListener('click', () => { cfg.mode = b.dataset.mode; store.set('mode', cfg.mode); applyModeUI(); }));
$$('#src-filter button').forEach((b) => b.addEventListener('click', () => {
  cfg.filter = b.dataset.f;
  const sel = sources.find((s) => s.id === cfg.sourceId);
  if (!sel || sel.type !== cfg.filter) {
    const first = sources.find((s) => s.type === cfg.filter);
    if (first) cfg.sourceId = first.id;
  }
  applyModeUI();
}));
$$('#bubble-size button').forEach((b) => b.addEventListener('click', () => {
  cfg.bubble = b.dataset.b;
  store.set('bubble', cfg.bubble);
  $$('#bubble-size button').forEach((x) => x.classList.toggle('on', x === b));
  api.setBubbleSize(cfg.bubble);
}));
api.onBubbleSizeChanged((s) => {
  cfg.bubble = s;
  store.set('bubble', s);
  $$('#bubble-size button').forEach((x) => x.classList.toggle('on', x.dataset.b === s));
});
$('#cam-select').addEventListener('change', (e) => { cfg.camId = e.target.value; store.set('camId', cfg.camId); syncCamPreview(); });
$('#mic-select').addEventListener('change', (e) => { cfg.micId = e.target.value; store.set('micId', cfg.micId); updateMicNote(); startMicMeter(); });
$('#quality').addEventListener('change', (e) => { cfg.quality = e.target.value; store.set('quality', cfg.quality); });
const bindCheck = (sel, key, after) => $(sel).addEventListener('change', (e) => {
  cfg[key] = e.target.checked;
  store.set(key, e.target.checked);
  if (after) after();
});
bindCheck('#sysaudio', 'systemAudio');
bindCheck('#voiceiso', 'voiceIso');
bindCheck('#countdown', 'countdown');
bindCheck('#hide-main', 'hideMain');
bindCheck('#mirror', 'mirror', () => {
  api.setBubbleMirror(cfg.mirror);
  const v = $('#cam-preview');
  if (v) v.classList.toggle('mirror', cfg.mirror);
});
$('#btn-start').addEventListener('click', () => startRecording());
navigator.mediaDevices.addEventListener('devicechange', () => { if (setupOpen) fillDevices(); });

// ---------- Motor de grabación ----------
let rec = null; // estado de la grabación en curso
let starting = false;

const QUALITY = {
  720: { w: 1280, h: 720, bps: 5e6 },
  1080: { w: 1920, h: 1080, bps: 8e6 },
  1440: { w: 2560, h: 1440, bps: 12e6 },
  max: { w: 0, h: 0, bps: 16e6 },
};

// H.264 usa el codificador por hardware del equipo (menos CPU) y permite guardar en MP4 directamente
function pickFormat() {
  const opts = [
    ['video/webm;codecs=h264,opus', 'h264'],
    ['video/webm;codecs=vp9,opus', 'vp9'],
    ['video/webm;codecs=vp8,opus', 'vp8'],
    ['video/webm', 'vp8'],
  ];
  const forced = localStorage.getItem('forceCodec');
  for (const [mime, codec] of opts) {
    if (forced && codec !== forced) continue;
    if (MediaRecorder.isTypeSupported(mime)) return { mime, codec };
  }
  return { mime: '', codec: 'vp8' };
}

// Pasa el video de una ventana por un lienzo de tamaño fijo y, si hay cámara, la dibuja en un
// círculo. Se usa al grabar una sola ventana: ahí la burbuja flotante no forma parte de la
// captura, y si la ventana cambia de tamaño el video no puede cambiar de resolución a medias.
function createCompositor(screenTrack, camTrack, opt) {
  const sProc = new MediaStreamTrackProcessor({ track: screenTrack });
  const cProc = camTrack ? new MediaStreamTrackProcessor({ track: camTrack }) : null;
  const gen = new MediaStreamTrackGenerator({ kind: 'video' });
  const writer = gen.writable.getWriter();
  const canvas = new OffscreenCanvas(2, 2);
  const ctx = canvas.getContext('2d', { alpha: false });
  const FRAC = { s: 0.2, m: 0.28, l: 0.38 }[opt.sizeKey] || 0.28;
  const readers = [];
  let sFrame = null, cFrame = null, stopped = false, W = 0, H = 0, last = 0, writing = false, frames = 0;

  function emit() {
    if (stopped || !sFrame || writing) return;
    const now = performance.now();
    if (now - last < 30) return;
    last = now;
    const fw = sFrame.displayWidth, fh = sFrame.displayHeight;
    if (!W) {
      W = fw - (fw % 2);
      H = fh - (fh % 2);
      canvas.width = W;
      canvas.height = H;
    }
    if (fw === W && fh === H) ctx.drawImage(sFrame, 0, 0);
    else {
      // La ventana cambió de tamaño: se ajusta dentro del lienzo original
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H);
      const k = Math.min(W / fw, H / fh);
      ctx.drawImage(sFrame, (W - fw * k) / 2, (H - fh * k) / 2, fw * k, fh * k);
    }
    if (cFrame) {
      const d = Math.round(Math.min(W, H) * FRAC);
      const m = Math.round(Math.min(W, H) * 0.035);
      const cx = m + d / 2, cy = H - m - d / 2;
      const cw = cFrame.displayWidth, ch = cFrame.displayHeight;
      const side = Math.min(cw, ch);
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, d / 2, 0, Math.PI * 2);
      ctx.clip();
      if (opt.mirror) { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
      ctx.drawImage(cFrame, (cw - side) / 2, (ch - side) / 2, side, side, cx - d / 2, cy - d / 2, d, d);
      ctx.restore();
    }
    let vf;
    try { vf = new VideoFrame(canvas, { timestamp: Math.round(now * 1000) }); } catch { return; }
    writing = true;
    writer.write(vf).then(() => { frames += 1; }).catch(() => {}).finally(() => {
      writing = false;
      try { vf.close(); } catch {}
    });
  }

  async function pump(proc, set) {
    const reader = proc.readable.getReader();
    readers.push(reader);
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        if (stopped) { value.close(); break; }
        set(value);
        emit();
      }
    } catch {}
  }
  pump(sProc, (f) => { if (sFrame) sFrame.close(); sFrame = f; });
  if (cProc) pump(cProc, (f) => { if (cFrame) cFrame.close(); cFrame = f; });

  return {
    track: gen,
    hasCamera: !!camTrack,
    frames: () => frames,
    stop() {
      if (stopped) return;
      stopped = true;
      readers.forEach((r) => r.cancel().catch(() => {}));
      if (sFrame) sFrame.close();
      if (cFrame) cFrame.close();
      sFrame = cFrame = null;
      writer.close().catch(() => {});
      try { gen.stop(); } catch {}
    },
  };
}

function elapsed() {
  if (!rec || !rec.startedAt) return 0;
  const now = rec.pausedAt || performance.now();
  return (now - rec.startedAt - rec.pausedTotal) / 1000;
}
function broadcast() {
  if (!rec) return;
  api.sendState({ phase: rec.phase, elapsed: elapsed(), count: rec.count, mode: rec.cfg.mode });
}

async function startRecording(overrides) {
  if (rec || starting) return;
  starting = true;
  try { await beginRecording({ ...cfg, ...(overrides || {}) }); }
  finally { starting = false; }
}

async function beginRecording(c) {
  if (c.mode !== 'cam' && !sources.length) await loadSources();
  if (c.mode !== 'cam' && !sources.some((s) => s.id === c.sourceId)) c.sourceId = cfg.sourceId;
  if (c.mode !== 'cam' && !c.sourceId) return toast('Elige qué pantalla o ventana quieres grabar', true);
  if (c.mode !== 'screen' && !c.camId) return toast('No hay ninguna cámara disponible para este modo', true);
  const src = sources.find((s) => s.id === c.sourceId);
  closeSetup(c.mode === 'screen-cam');
  if (c.mode === 'screen-cam') api.showBubble(c.camId, c.bubble, c.mirror);

  const q = QUALITY[c.quality] || QUALITY[1080];
  const fmt = pickFormat();
  const owned = []; // streams a detener al final
  let rawVideo = null, audioTrack = null;
  let comp = null, mic = null, sysAudio = null, audioCtx = null;
  try {
    let videoTrack;
    if (c.mode === 'cam') {
      const cam = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: c.camId }, width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } },
      });
      owned.push(cam);
      videoTrack = cam.getVideoTracks()[0];
      $('#camrec-video').srcObject = cam;
      $('#camrec-video').classList.toggle('mirror', c.mirror);
    } else {
      await api.selectSource(c.sourceId, c.systemAudio && INFO.systemAudio);
      const disp = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: c.systemAudio && INFO.systemAudio });
      owned.push(disp);
      videoTrack = disp.getVideoTracks()[0];
      if (!videoTrack) throw new Error('no se recibió imagen de la pantalla');
      if (q.w) {
        try { await videoTrack.applyConstraints({ width: { max: q.w }, height: { max: q.h }, frameRate: { max: 30 } }); } catch {}
      }
      sysAudio = disp.getAudioTracks()[0] || null;
      videoTrack.addEventListener('ended', () => { if (rec && rec.phase !== 'stopping') stopRecording(); });

      // Ventanas: lienzo de tamaño fijo y, en "Pantalla + Cámara", la cámara dibujada dentro del video
      const isWindow = (!!src && src.type === 'window') || localStorage.getItem('forceComposite') === '1';
      if (isWindow && typeof MediaStreamTrackProcessor === 'function' && typeof MediaStreamTrackGenerator === 'function') {
        let camTrack = null;
        if (c.mode === 'screen-cam') {
          try {
            const cam = await navigator.mediaDevices.getUserMedia({
              video: { deviceId: { exact: c.camId }, width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 30 } },
            });
            owned.push(cam);
            camTrack = cam.getVideoTracks()[0];
          } catch {}
        }
        try { comp = createCompositor(videoTrack, camTrack, { sizeKey: c.bubble, mirror: c.mirror }); } catch { comp = null; }
      }
    }
    rawVideo = videoTrack;

    // Mezcla de audio: micrófono + audio del sistema
    if (c.micId && c.micId !== 'none') {
      try {
        mic = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: c.micId }, echoCancellation: true, noiseSuppression: !!c.voiceIso, autoGainControl: true, voiceIsolation: !!c.voiceIso },
        });
        owned.push(mic);
      } catch (e) { toast('No se pudo usar el micrófono: ' + e.message, true); }
    }
    if (mic || sysAudio) {
      audioCtx = new AudioContext();
      const dest = audioCtx.createMediaStreamDestination();
      if (mic) audioCtx.createMediaStreamSource(mic).connect(dest);
      if (sysAudio) audioCtx.createMediaStreamSource(new MediaStream([sysAudio])).connect(dest);
      audioTrack = dest.stream.getAudioTracks()[0];
    }
  } catch (e) {
    if (comp) comp.stop();
    owned.forEach((s) => s.getTracks().forEach((t) => t.stop()));
    if (audioCtx) audioCtx.close().catch(() => {});
    api.hideBubble();
    const denied = /denied|NotAllowed|Permission/i.test(String(e && (e.name + ' ' + e.message)));
    toast(denied ? 'Falta un permiso del sistema para grabar. Revísalo y vuelve a intentarlo.' : 'No se pudo iniciar la grabación: ' + e.message, true);
    if (denied) checkPerms(false);
    return;
  }

  const r = {
    cfg: c, owned, audioCtx, comp, fmt, rawVideo, audioTrack,
    stream: null,
    // El filtro de voz solo se aplica si no hay audio del sistema mezclado (lo estropearía)
    voiceIsolation: !!(c.voiceIso && mic && !sysAudio),
    id: null, recorder: null, phase: 'countdown', count: 0,
    startedAt: 0, pausedAt: 0, pausedTotal: 0, duration: 0,
    writeChain: Promise.resolve(), cancelled: false, restart: false, finished: false, timer: null,
  };
  rec = r;

  if (c.mode === 'cam') $('#view-camrec').classList.remove('hidden');
  else if (c.hideMain) api.hideMain();
  else api.minimizeMain();
  api.showControls();
  broadcast();
  r.timer = setInterval(broadcast, 250);

  // Cuenta regresiva
  if (c.countdown) {
    for (let n = 3; n >= 1; n--) {
      if (rec !== r || r.phase !== 'countdown') return;
      r.count = n;
      broadcast();
      if (c.mode === 'cam') { $('#camrec-count').textContent = n; $('#camrec-count').classList.remove('hidden'); }
      await sleep(1000);
    }
  }
  r.count = 0;
  broadcast();
  $('#camrec-count').classList.add('hidden');
  await sleep(c.countdown ? 300 : 500); // deja que desaparezcan la cuenta regresiva y la ventana
  if (rec !== r || r.phase !== 'countdown') return;

  try {
    // Si el compositor no llegó a producir imagen, se graba la ventana directamente
    let video = r.rawVideo;
    if (r.comp && r.comp.frames() > 0) video = r.comp.track;
    else if (r.comp) {
      const hadCamera = r.comp.hasCamera;
      r.comp.stop();
      r.comp = null;
      if (hadCamera) toast('No se pudo añadir la cámara al video de esta ventana', true);
    }
    r.stream = new MediaStream(r.audioTrack ? [video, r.audioTrack] : [video]);
    r.id = await api.recBegin();
    const opts = { videoBitsPerSecond: c.mode === 'cam' ? 6e6 : q.bps, audioBitsPerSecond: 160000 };
    let recorder;
    try { recorder = new MediaRecorder(r.stream, r.fmt.mime ? { ...opts, mimeType: r.fmt.mime } : opts); }
    catch { r.fmt = { mime: '', codec: 'vp8' }; recorder = new MediaRecorder(r.stream, opts); }
    recorder.ondataavailable = (e) => {
      if (!e.data || !e.data.size) return;
      r.writeChain = r.writeChain.then(async () => api.recChunk(r.id, await e.data.arrayBuffer())).catch(() => {});
    };
    recorder.onerror = () => { toast('Hubo un error durante la grabación; se guardó lo grabado hasta ahora', true); stopRecording(); };
    recorder.onstop = () => finishRecording(r);
    r.recorder = recorder;
    recorder.start(1000);
    r.phase = 'recording';
    r.startedAt = performance.now();
    broadcast();
  } catch (e) {
    r.cancelled = true;
    r.phase = 'stopping';
    toast('No se pudo iniciar la grabación: ' + e.message, true);
    finishRecording(r);
  }
}

function pauseResume() {
  if (!rec || !rec.recorder) return;
  if (rec.phase === 'recording') {
    rec.recorder.pause();
    rec.pausedAt = performance.now();
    rec.phase = 'paused';
  } else if (rec.phase === 'paused') {
    rec.pausedTotal += performance.now() - rec.pausedAt;
    rec.pausedAt = 0;
    rec.recorder.resume();
    rec.phase = 'recording';
  }
  broadcast();
}

function stopRecording() {
  if (!rec) return;
  if (!rec.recorder) return cancelRecording(); // aún en cuenta regresiva
  if (rec.phase === 'stopping') return;
  rec.duration = elapsed();
  rec.phase = 'stopping';
  broadcast();
  if (rec.recorder.state !== 'inactive') rec.recorder.stop();
  else finishRecording(rec);
}

function cancelRecording(restart = false) {
  if (!rec || rec.phase === 'stopping') return;
  const r = rec;
  r.cancelled = true;
  r.restart = restart;
  r.phase = 'stopping';
  if (r.recorder && r.recorder.state !== 'inactive') r.recorder.stop();
  else finishRecording(r);
}

function teardown(r) {
  clearInterval(r.timer);
  if (r.comp) r.comp.stop();
  r.owned.forEach((s) => s.getTracks().forEach((t) => t.stop()));
  if (r.stream) r.stream.getTracks().forEach((t) => t.stop());
  if (r.audioTrack) r.audioTrack.stop();
  if (r.audioCtx) r.audioCtx.close().catch(() => {});
  $('#camrec-video').srcObject = null;
  $('#camrec-count').classList.add('hidden');
  $('#view-camrec').classList.add('hidden');
}

async function finishRecording(r) {
  if (r.finished) return;
  r.finished = true;
  teardown(r);
  try { await r.writeChain; } catch {}
  if (rec === r) rec = null;
  api.hideControls();

  if (r.cancelled) {
    if (r.id) await api.recCancel(r.id).catch(() => {});
    if (r.restart) { api.sendState({ phase: 'idle' }); return startRecording(r.cfg); }
    api.hideBubble();
    api.showMain();
    api.sendState({ phase: 'idle' });
    toast('Grabación descartada');
    return;
  }

  api.hideBubble();
  api.showMain();
  busy('Guardando tu video…');
  try {
    const v = await api.recEnd(r.id, {
      duration: r.duration, mode: r.cfg.mode, codec: r.fmt.codec, voiceIsolation: r.voiceIsolation,
    });
    replaceInLibrary(v);
    busy();
    openPlayer(v);
    toast('Video guardado');
  } catch (e) {
    busy();
    toast('No se pudo guardar la grabación: ' + e.message, true);
    loadLibrary();
  }
  api.sendState({ phase: 'idle' });
}

api.onControlAction((a) => {
  if (a === 'stop') stopRecording();
  else if (a === 'pause') pauseResume();
  else if (a === 'cancel') cancelRecording(false);
  else if (a === 'restart') cancelRecording(true);
});
api.onShortcut((a) => {
  if (a === 'toggle') {
    if (rec) stopRecording();
    else if (setupOpen) startRecording();
    else { api.showMain(); openSetup(); }
  } else if (a === 'pause') pauseResume();
  else if (a === 'cancel') cancelRecording(false);
});
api.onMenu((a) => {
  if (a === 'new') openSetup();
  else if (a === 'import') importVideos();
});
api.onLibChanged((msg) => {
  if (!current) loadLibrary();
  if (msg) toast(msg);
});

// ---------- Teclado ----------
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!$('#ctx').classList.contains('hidden')) return hideCtx();
    if (confirmDone) return confirmDone(false);
    if (setupOpen) return closeSetup();
    return;
  }
  const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
  const modalOpen = setupOpen || confirmDone || !$('#perms').classList.contains('hidden') || !$('#busy').classList.contains('hidden');
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f' && !current && !modalOpen) {
    e.preventDefault();
    $('#search').focus();
    return;
  }
  if (typing || modalOpen || !current || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.code === 'Space' || e.key === 'k') { e.preventDefault(); if (player.paused) player.play(); else player.pause(); }
  else if (e.key === 'ArrowRight' || e.key === 'l') player.currentTime = Math.min(dur(), player.currentTime + 5);
  else if (e.key === 'ArrowLeft' || e.key === 'j') player.currentTime = Math.max(0, player.currentTime - 5);
  else if (e.key === 'f') { if (player.requestFullscreen) player.requestFullscreen(); }
  else if (e.key === 'm') { e.preventDefault(); $('#chapter-label').focus(); }
});

// ---------- Permisos (macOS) ----------
let permTimer = null;
async function refreshPerms() {
  const st = await api.permStatus();
  let all = true;
  for (const k of ['screen', 'camera', 'microphone']) {
    const ok = st[k] === 'granted';
    all = all && ok;
    const el = $('#perm-st-' + k);
    el.textContent = ok ? 'Permitido' : 'Pendiente';
    el.classList.toggle('ok', ok);
    $('[data-perm="' + k + '"]').classList.toggle('hidden', ok);
  }
  return { st, all };
}
function closePerms() {
  clearInterval(permTimer);
  $('#perms').classList.add('hidden');
}
async function checkPerms(first) {
  const { st, all } = await refreshPerms();
  if (all) return closePerms();
  $('#perms').classList.remove('hidden');
  clearInterval(permTimer);
  permTimer = setInterval(async () => { const r = await refreshPerms(); if (r.all) closePerms(); }, 1500);
  if (first) {
    // Lanza los avisos del sistema uno tras otro
    if (st.camera === 'not-determined') await api.permRequest('camera');
    if (st.microphone === 'not-determined') await api.permRequest('microphone');
    // Registra a Toma en la lista de Grabación de pantalla sin abrir los ajustes
    if (st.screen !== 'granted') await api.permRequest('screen', false);
    refreshPerms();
  }
}
$$('[data-perm]').forEach((b) => b.addEventListener('click', async () => { await api.permRequest(b.dataset.perm); refreshPerms(); }));
$('#perms-skip').addEventListener('click', closePerms);
$('#perms-relaunch').addEventListener('click', () => api.relaunch());

// ---------- Inicio ----------
(async () => {
  try { INFO = await api.info(); } catch {}
  document.body.classList.toggle('mac', INFO.platform === 'darwin');
  const k = keys();
  $('#hint-new').innerHTML = `${kbd(k.rec)} para grabar`;
  $('#setup-hint').innerHTML = `${kbd(k.rec)} iniciar o terminar &nbsp;·&nbsp; ${kbd(k.pause)} pausar &nbsp;·&nbsp; ${kbd(k.cancel)} descartar`;
  if (!INFO.systemAudio) cfg.systemAudio = false;
  api.sendState({ phase: 'idle' });
  await loadLibrary();
  if (!INFO.ffmpeg) toast('No se encontró ffmpeg: recortar y exportar no funcionarán', true);
  checkPerms(true);
})();
