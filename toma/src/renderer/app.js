/* Toma — interfaz principal: biblioteca, configuración, grabación y reproductor */
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const api = window.toma;

// ---------- Utilidades ----------
function fmtDur(s) {
  if (!isFinite(s) || s < 0) s = 0;
  s = Math.round(s);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  const p = (n) => String(n).padStart(2, '0');
  return h ? `${h}:${p(m)}:${p(x)}` : `${m}:${p(x)}`;
}
function fmtTimePrecise(s) {
  const m = Math.floor(s / 60), x = (s % 60).toFixed(1);
  return `${m}:${x.padStart(4, '0')}`;
}
function fmtSize(b) {
  if (!b) return '0 MB';
  if (b > 1e9) return (b / 1e9).toFixed(2) + ' GB';
  if (b < 1e6) return Math.max(1, Math.round(b / 1e3)) + ' KB';
  return (b / 1e6).toFixed(1) + ' MB';
}
function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' }) + ' · ' +
    d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
}
const MODE_LABEL = { 'screen-cam': 'Pantalla + cámara', screen: 'Pantalla', cam: 'Cámara', import: 'Importado' };
let toastTimer;
function toast(msg, err = false) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.toggle('err', err);
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), err ? 5000 : 2600);
}
function busy(text) {
  if (text) { $('#busy-text').textContent = text; $('#busy').classList.remove('hidden'); }
  else $('#busy').classList.add('hidden');
}
function showView(name) {
  ['library', 'player', 'camrec'].forEach((v) => $(`#view-${v}`).classList.toggle('hidden', v !== name));
  $('.topbar').classList.toggle('hidden', name === 'camrec');
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- Biblioteca ----------
let library = [];
let current = null;

async function loadLibrary() {
  library = await api.list();
  renderLibrary();
}

function renderLibrary() {
  const q = $('#search').value.trim().toLowerCase();
  const onlyFav = $('#only-fav').checked;
  const sort = $('#sort').value;
  let items = library.filter((v) => v.exists);
  if (onlyFav) items = items.filter((v) => v.favorite);
  if (q) items = items.filter((v) => (v.title + ' ' + (v.notes || '')).toLowerCase().includes(q));
  const by = {
    new: (a, b) => b.createdAt.localeCompare(a.createdAt),
    old: (a, b) => a.createdAt.localeCompare(b.createdAt),
    title: (a, b) => a.title.localeCompare(b.title, 'es'),
    long: (a, b) => (b.duration || 0) - (a.duration || 0),
  }[sort];
  items.sort(by);

  const all = library.filter((v) => v.exists);
  const totalDur = all.reduce((s, v) => s + (v.duration || 0), 0);
  const totalSize = all.reduce((s, v) => s + (v.size || 0), 0);
  $('#lib-stats').textContent = all.length
    ? `${all.length} video${all.length === 1 ? '' : 's'} · ${fmtDur(totalDur)} en total · ${fmtSize(totalSize)}`
    : '';

  const grid = $('#grid');
  grid.innerHTML = '';
  $('#empty').classList.toggle('hidden', all.length > 0);
  for (const v of items) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="thumb">
        <span class="mode"></span>
        ${v.favorite ? '<span class="fav">★</span>' : ''}
        <span class="dur">${fmtDur(v.duration)}</span>
      </div>
      <div class="card-body">
        <div class="card-title"></div>
        <div class="card-sub">${fmtDate(v.createdAt)} · ${fmtSize(v.size)}</div>
      </div>`;
    if (v.thumbSrc) card.querySelector('.thumb').style.backgroundImage = `url("${v.thumbSrc}")`;
    card.querySelector('.mode').textContent = MODE_LABEL[v.mode] || '';
    card.querySelector('.card-title').textContent = v.title;
    card.title = v.title;
    card.addEventListener('click', () => openPlayer(v));
    grid.appendChild(card);
  }
  if (all.length && !items.length) {
    grid.innerHTML = '<p class="muted">No hay videos que coincidan con la búsqueda.</p>';
  }
}

$('#search').addEventListener('input', renderLibrary);
$('#sort').addEventListener('change', renderLibrary);
$('#only-fav').addEventListener('change', renderLibrary);
$('#btn-folder').addEventListener('click', () => api.openFolder());
$('#btn-import').addEventListener('click', async () => {
  try {
    busy('Importando…');
    const added = await api.importVideos();
    busy();
    if (added.length) { toast(`${added.length} video(s) importado(s)`); await loadLibrary(); }
  } catch (e) { busy(); toast('No se pudo importar: ' + e.message, true); }
});

// ---------- Reproductor ----------
const player = $('#player');
let notesTimer;

function openPlayer(v) {
  current = v;
  showView('player');
  player.src = v.src;
  player.playbackRate = Number($('#speed .on').dataset.s);
  $('#title').value = v.title;
  $('#notes').value = v.notes || '';
  $('#notes-status').textContent = '';
  renderMeta();
  renderChapters();
  renderFav();
  closeTrim();
}

function renderMeta() {
  const v = current;
  const res = v.width && v.height ? ` · ${v.width}×${v.height}` : '';
  $('#meta').textContent = `${fmtDate(v.createdAt)} · ${fmtDur(v.duration)} · ${fmtSize(v.size)}${res} · ${MODE_LABEL[v.mode] || ''}`;
}
function renderFav() {
  $('#btn-fav').textContent = current.favorite ? '★ Favorito' : '☆ Favorito';
}

player.addEventListener('loadedmetadata', () => {
  if (!current) return;
  const d = player.duration;
  if (isFinite(d) && d > 0 && Math.abs(d - (current.duration || 0)) > 0.5) {
    current.duration = d;
    api.setDuration(current.id, d);
    renderMeta();
  }
  if (!trimState.open) return;
  resetTrim();
});

$('#btn-back').addEventListener('click', () => {
  player.pause();
  player.removeAttribute('src');
  player.load();
  current = null;
  showView('library');
  loadLibrary();
});

$$('#speed button').forEach((b) => b.addEventListener('click', () => {
  $$('#speed button').forEach((x) => x.classList.remove('on'));
  b.classList.add('on');
  player.playbackRate = Number(b.dataset.s);
}));

async function patchCurrent(patch) {
  const v = await api.update(current.id, patch);
  if (v) {
    current = v;
    const i = library.findIndex((x) => x.id === v.id);
    if (i >= 0) library[i] = v;
  }
  return v;
}

$('#title').addEventListener('change', () => patchCurrent({ title: $('#title').value }));
$('#title').addEventListener('keydown', (e) => { if (e.key === 'Enter') e.target.blur(); });
$('#notes').addEventListener('input', () => {
  $('#notes-status').textContent = 'Guardando…';
  clearTimeout(notesTimer);
  notesTimer = setTimeout(async () => {
    await patchCurrent({ notes: $('#notes').value });
    $('#notes-status').textContent = 'Guardado';
  }, 600);
});
$('#btn-fav').addEventListener('click', async () => { await patchCurrent({ favorite: !current.favorite }); renderFav(); });

// Marcadores (capítulos)
function renderChapters() {
  const ul = $('#chapters');
  ul.innerHTML = '';
  const list = (current.chapters || []).slice().sort((a, b) => a.t - b.t);
  if (!list.length) {
    ul.innerHTML = '<li class="muted small" style="cursor:default">Sin marcadores. Pausa en un momento y añade uno.</li>';
    return;
  }
  for (const c of list) {
    const li = document.createElement('li');
    li.innerHTML = '<span class="t"></span><span class="l"></span><button class="x" title="Quitar">✕</button>';
    li.querySelector('.t').textContent = fmtDur(c.t);
    li.querySelector('.l').textContent = c.label;
    li.addEventListener('click', () => { player.currentTime = c.t; player.play(); });
    li.querySelector('.x').addEventListener('click', async (e) => {
      e.stopPropagation();
      await patchCurrent({ chapters: (current.chapters || []).filter((x) => x !== c && !(x.t === c.t && x.label === c.label)) });
      renderChapters();
    });
    ul.appendChild(li);
  }
}
async function addChapter() {
  const label = $('#chapter-label').value.trim() || `Marcador ${fmtDur(player.currentTime)}`;
  const chapters = [...(current.chapters || []), { t: player.currentTime, label }];
  await patchCurrent({ chapters });
  $('#chapter-label').value = '';
  renderChapters();
}
$('#chapter-add').addEventListener('click', addChapter);
$('#chapter-label').addEventListener('keydown', (e) => { if (e.key === 'Enter') addChapter(); });

// Acciones
async function doExport(fmt) {
  try {
    busy(fmt === 'gif' ? 'Creando GIF…' : 'Exportando…');
    const out = await api.exportVideo(current.id, fmt);
    busy();
    if (out) toast('Exportado: ' + out);
  } catch (e) { busy(); toast('Error al exportar: ' + e.message, true); }
}
$('#btn-export-mp4').addEventListener('click', () => doExport('mp4'));
$('#btn-export-gif').addEventListener('click', () => doExport('gif'));
$('#btn-show').addEventListener('click', () => api.showInFolder(current.id));
$('#btn-ext').addEventListener('click', () => api.openExternal(current.id));
$('#btn-copy').addEventListener('click', async () => { await api.copyPath(current.id); toast('Ruta copiada al portapapeles'); });
$('#btn-delete').addEventListener('click', async () => {
  if (!confirm(`¿Eliminar "${current.title}"? El archivo se moverá a la papelera.`)) return;
  await api.remove(current.id);
  toast('Video eliminado');
  $('#btn-back').click();
});

// Recorte
const trimState = { open: false, start: 0, end: 0, previewing: false };
function dur() { return isFinite(player.duration) && player.duration > 0 ? player.duration : (current?.duration || 0); }
function resetTrim() { trimState.start = 0; trimState.end = dur(); drawTrim(); }
function closeTrim() { trimState.open = false; $('#trim-panel').classList.add('hidden'); }
function drawTrim() {
  const d = dur() || 1;
  const a = (trimState.start / d) * 100, b = (trimState.end / d) * 100;
  $('#trim-sel').style.left = a + '%';
  $('#trim-sel').style.width = Math.max(0, b - a) + '%';
  $('#trim-h-start').style.left = a + '%';
  $('#trim-h-end').style.left = b + '%';
  $('#trim-playhead').style.left = (player.currentTime / d) * 100 + '%';
  $('#trim-label').textContent = `${fmtTimePrecise(trimState.start)} → ${fmtTimePrecise(trimState.end)}  (${fmtDur(trimState.end - trimState.start)})`;
}
$('#btn-trim-toggle').addEventListener('click', () => {
  trimState.open = !trimState.open;
  $('#trim-panel').classList.toggle('hidden', !trimState.open);
  if (trimState.open) resetTrim();
});
function dragHandle(el, which) {
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    const rect = $('#trim-track').getBoundingClientRect();
    const move = (ev) => {
      const t = Math.min(1, Math.max(0, (ev.clientX - rect.left) / rect.width)) * dur();
      if (which === 'start') trimState.start = Math.min(t, trimState.end - 0.5);
      else trimState.end = Math.max(t, trimState.start + 0.5);
      trimState.start = Math.max(0, trimState.start);
      trimState.end = Math.min(dur(), trimState.end);
      player.currentTime = which === 'start' ? trimState.start : trimState.end;
      drawTrim();
    };
    const up = () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  });
}
dragHandle($('#trim-h-start'), 'start');
dragHandle($('#trim-h-end'), 'end');
$('#trim-track').addEventListener('click', (e) => {
  if (e.target.classList.contains('trim-handle')) return;
  const rect = $('#trim-track').getBoundingClientRect();
  player.currentTime = ((e.clientX - rect.left) / rect.width) * dur();
});
$('#trim-set-start').addEventListener('click', () => { trimState.start = Math.min(player.currentTime, trimState.end - 0.5); drawTrim(); });
$('#trim-set-end').addEventListener('click', () => { trimState.end = Math.max(player.currentTime, trimState.start + 0.5); drawTrim(); });
$('#trim-preview').addEventListener('click', () => {
  trimState.previewing = true;
  player.currentTime = trimState.start;
  player.play();
});
player.addEventListener('timeupdate', () => {
  if (trimState.open) drawTrim();
  if (trimState.previewing && player.currentTime >= trimState.end) { player.pause(); trimState.previewing = false; }
});
player.addEventListener('pause', () => { trimState.previewing = false; });
$('#trim-apply').addEventListener('click', async () => {
  if (trimState.start < 0.05 && trimState.end > dur() - 0.05) return toast('Mueve los extremos para elegir qué conservar');
  if (!confirm(`¿Conservar solo ${fmtTimePrecise(trimState.start)} → ${fmtTimePrecise(trimState.end)}? El original se moverá a la papelera.`)) return;
  try {
    player.pause();
    busy('Recortando video…');
    const v = await api.trim(current.id, trimState.start, trimState.end);
    busy();
    toast('Recorte aplicado');
    openPlayer(v);
  } catch (e) { busy(); toast('Error al recortar: ' + e.message, true); }
});

// Teclado en el reproductor
document.addEventListener('keydown', (e) => {
  if ($('#view-player').classList.contains('hidden')) return;
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
  if (e.code === 'Space' || e.key === 'k') { e.preventDefault(); player.paused ? player.play() : player.pause(); }
  else if (e.key === 'ArrowRight' || e.key === 'l') player.currentTime += 5;
  else if (e.key === 'ArrowLeft' || e.key === 'j') player.currentTime -= 5;
  else if (e.key === 'f') player.requestFullscreen?.();
  else if (e.key === 'm') { $('#chapter-label').focus(); }
});

// ---------- Configuración de grabación ----------
const cfg = {
  mode: localStorage.getItem('mode') || 'screen-cam',
  sourceId: null,
  filter: 'screen',
  camId: localStorage.getItem('camId') || '',
  micId: localStorage.getItem('micId') || '',
  bubble: localStorage.getItem('bubble') || 'm',
  quality: localStorage.getItem('quality') || '1080',
  systemAudio: localStorage.getItem('systemAudio') === '1',
  countdown: localStorage.getItem('countdown') !== '0',
  hideMain: localStorage.getItem('hideMain') !== '0',
};
let sources = [];
let micPreview = null, micCtx = null, micRaf = 0;
let camPreviewStream = null;
let setupOpen = false;

async function ensureDeviceLabels() {
  try {
    const s = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    s.getTracks().forEach((t) => t.stop());
  } catch {
    try { const s = await navigator.mediaDevices.getUserMedia({ audio: true }); s.getTracks().forEach((t) => t.stop()); } catch {}
  }
}

async function fillDevices() {
  const devs = await navigator.mediaDevices.enumerateDevices();
  const cams = devs.filter((d) => d.kind === 'videoinput');
  const mics = devs.filter((d) => d.kind === 'audioinput' && d.deviceId !== 'communications');
  const camSel = $('#cam-select'), micSel = $('#mic-select');
  camSel.innerHTML = cams.map((d, i) => `<option value="${d.deviceId}">${escapeHtml(d.label || 'Cámara ' + (i + 1))}</option>`).join('')
    || '<option value="">(No se detectó cámara)</option>';
  micSel.innerHTML = '<option value="none">Sin micrófono</option>' +
    mics.map((d, i) => `<option value="${d.deviceId}">${escapeHtml(d.label || 'Micrófono ' + (i + 1))}</option>`).join('');
  if (cams.some((c) => c.deviceId === cfg.camId)) camSel.value = cfg.camId; else cfg.camId = camSel.value;
  if (cfg.micId === 'none' || mics.some((m) => m.deviceId === cfg.micId)) micSel.value = cfg.micId;
  else { micSel.value = mics.find((m) => m.deviceId === 'default')?.deviceId || mics[0]?.deviceId || 'none'; cfg.micId = micSel.value; }
}
function escapeHtml(s) { return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

async function loadSources() {
  try { sources = await api.listSources(); } catch { sources = []; }
  if (!sources.some((s) => s.id === cfg.sourceId)) cfg.sourceId = (sources.find((s) => s.type === 'screen') || sources[0])?.id || null;
  renderSources();
}

function renderSources() {
  const box = $('#sources');
  if (cfg.mode === 'cam') {
    box.innerHTML = '<video id="cam-preview" autoplay muted playsinline style="width:100%;grid-column:1/-1;max-height:300px;background:#000;border-radius:10px;transform:scaleX(-1)"></video>';
    if (camPreviewStream) $('#cam-preview').srcObject = camPreviewStream;
    return;
  }
  const list = sources.filter((s) => s.type === cfg.filter);
  box.innerHTML = '';
  if (!list.length) box.innerHTML = `<p class="muted">No hay ${cfg.filter === 'screen' ? 'pantallas' : 'ventanas'} disponibles.</p>`;
  list.forEach((s, i) => {
    const el = document.createElement('div');
    el.className = 'source' + (s.id === cfg.sourceId ? ' on' : '');
    el.innerHTML = `<img alt="" /><div class="name">${s.icon ? '<img alt="" class="ico" />' : ''}<span></span></div>`;
    if (s.thumb) el.querySelector('img').src = s.thumb;
    if (s.icon) el.querySelector('.ico').src = s.icon;
    el.querySelector('span').textContent = s.type === 'screen' && /^(Entire screen|Screen \d+|Pantalla)/i.test(s.name)
      ? `Pantalla ${i + 1}` : s.name;
    el.addEventListener('click', () => { cfg.sourceId = s.id; renderSources(); });
    box.appendChild(el);
  });
}

function applyModeUI() {
  $$('#mode button').forEach((b) => b.classList.toggle('on', b.dataset.mode === cfg.mode));
  const needsCam = cfg.mode !== 'screen';
  $('#cam-field').classList.toggle('hidden', !needsCam);
  $('#bubble-field').classList.toggle('hidden', cfg.mode !== 'screen-cam');
  $('#sysaudio-field').classList.toggle('hidden', cfg.mode === 'cam');
  $('#src-filter').classList.toggle('hidden', cfg.mode === 'cam');
  $('#source-block h4').textContent = cfg.mode === 'cam' ? 'Vista previa de la cámara' : '¿Qué quieres grabar?';
  $$('#bubble-size button').forEach((b) => b.classList.toggle('on', b.dataset.b === cfg.bubble));
  $$('#src-filter button').forEach((b) => b.classList.toggle('on', b.dataset.f === cfg.filter));
  syncCamPreview();
  renderSources();
}

async function syncCamPreview() {
  // Burbuja flotante para "Pantalla + Cámara"; vista previa interna para "Solo cámara"
  if (!setupOpen) return;
  if (cfg.mode === 'screen-cam' && cfg.camId) api.showBubble(cfg.camId, cfg.bubble);
  else api.hideBubble();
  if (cfg.mode === 'cam' && cfg.camId) {
    if (!camPreviewStream || camPreviewStream._id !== cfg.camId) {
      stopCamPreview();
      try {
        camPreviewStream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: cfg.camId }, width: { ideal: 1280 }, height: { ideal: 720 } } });
        camPreviewStream._id = cfg.camId;
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
    micPreview = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: { exact: cfg.micId } } });
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
  if (micCtx) micCtx.close();
  micPreview = null; micCtx = null;
  $('#mic-meter').style.width = '0';
}

async function openSetup() {
  if (rec) return;
  setupOpen = true;
  $('#setup').classList.remove('hidden');
  $('#quality').value = cfg.quality;
  $('#sysaudio').checked = cfg.systemAudio;
  $('#countdown').checked = cfg.countdown;
  $('#hide-main').checked = cfg.hideMain;
  await ensureDeviceLabels();
  await fillDevices();
  applyModeUI();
  loadSources();
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
$$('#mode button').forEach((b) => b.addEventListener('click', () => { cfg.mode = b.dataset.mode; localStorage.setItem('mode', cfg.mode); applyModeUI(); }));
$$('#src-filter button').forEach((b) => b.addEventListener('click', () => { cfg.filter = b.dataset.f; applyModeUI(); }));
$$('#bubble-size button').forEach((b) => b.addEventListener('click', () => {
  cfg.bubble = b.dataset.b; localStorage.setItem('bubble', cfg.bubble);
  $$('#bubble-size button').forEach((x) => x.classList.toggle('on', x === b));
  api.setBubbleSize(cfg.bubble);
}));
api.onBubbleSizeChanged((s) => {
  cfg.bubble = s; localStorage.setItem('bubble', s);
  $$('#bubble-size button').forEach((x) => x.classList.toggle('on', x.dataset.b === s));
});
$('#cam-select').addEventListener('change', (e) => { cfg.camId = e.target.value; localStorage.setItem('camId', cfg.camId); syncCamPreview(); });
$('#mic-select').addEventListener('change', (e) => { cfg.micId = e.target.value; localStorage.setItem('micId', cfg.micId); startMicMeter(); });
$('#quality').addEventListener('change', (e) => { cfg.quality = e.target.value; localStorage.setItem('quality', cfg.quality); });
$('#sysaudio').addEventListener('change', (e) => { cfg.systemAudio = e.target.checked; localStorage.setItem('systemAudio', e.target.checked ? '1' : '0'); });
$('#countdown').addEventListener('change', (e) => { cfg.countdown = e.target.checked; localStorage.setItem('countdown', e.target.checked ? '1' : '0'); });
$('#hide-main').addEventListener('change', (e) => { cfg.hideMain = e.target.checked; localStorage.setItem('hideMain', e.target.checked ? '1' : '0'); });
$('#btn-start').addEventListener('click', () => startRecording());
navigator.mediaDevices.addEventListener('devicechange', () => { if (setupOpen) fillDevices(); });

// ---------- Motor de grabación ----------
let rec = null; // estado de la grabación en curso

const QUALITY = {
  720: { w: 1280, h: 720, bps: 4e6 },
  1080: { w: 1920, h: 1080, bps: 8e6 },
  1440: { w: 2560, h: 1440, bps: 12e6 },
  max: { w: 3840, h: 2160, bps: 16e6 },
};

function pickMime() {
  const opts = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
  return opts.find((m) => MediaRecorder.isTypeSupported(m)) || '';
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
  if (rec) return;
  const c = { ...cfg, ...(overrides || {}) };
  if (c.mode !== 'cam' && !c.sourceId) { await loadSources(); c.sourceId = cfg.sourceId; }
  if (c.mode !== 'cam' && !c.sourceId) return toast('Elige una pantalla o ventana', true);
  if (c.mode !== 'screen' && !c.camId) return toast('No hay cámara disponible para este modo', true);
  closeSetup(c.mode === 'screen-cam');

  const q = QUALITY[c.quality] || QUALITY[1080];
  const tracks = [];
  const owned = []; // streams a detener al final
  let width, height;
  try {
    let videoTrack;
    let sysAudio = null;
    if (c.mode === 'cam') {
      const cam = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: c.camId }, width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } },
      });
      owned.push(cam);
      videoTrack = cam.getVideoTracks()[0];
      $('#camrec-video').srcObject = cam;
    } else {
      await api.selectSource(c.sourceId, c.systemAudio);
      const disp = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: c.systemAudio });
      owned.push(disp);
      videoTrack = disp.getVideoTracks()[0];
      try {
        await videoTrack.applyConstraints({ width: { max: q.w }, height: { max: q.h }, frameRate: { max: 30 } });
      } catch {}
      sysAudio = disp.getAudioTracks()[0] || null;
      videoTrack.addEventListener('ended', () => { if (rec && rec.phase !== 'stopping') stopRecording(); });
    }
    const st = videoTrack.getSettings();
    width = st.width; height = st.height;
    tracks.push(videoTrack);

    // Mezcla de audio: micrófono + audio del sistema
    let mic = null;
    if (c.micId && c.micId !== 'none') {
      try {
        mic = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: c.micId }, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
        owned.push(mic);
      } catch (e) { toast('No se pudo usar el micrófono: ' + e.message, true); }
    }
    let audioCtx = null;
    if (mic || sysAudio) {
      audioCtx = new AudioContext();
      const dest = audioCtx.createMediaStreamDestination();
      if (mic) audioCtx.createMediaStreamSource(mic).connect(dest);
      if (sysAudio) audioCtx.createMediaStreamSource(new MediaStream([sysAudio])).connect(dest);
      tracks.push(dest.stream.getAudioTracks()[0]);
    }

    rec = {
      cfg: c, owned, audioCtx, width, height,
      stream: new MediaStream(tracks),
      id: null, recorder: null, phase: 'countdown', count: 0,
      startedAt: 0, pausedAt: 0, pausedTotal: 0,
      writeChain: Promise.resolve(), cancelled: false, timer: null,
    };
  } catch (e) {
    owned.forEach((s) => s.getTracks().forEach((t) => t.stop()));
    api.hideBubble();
    return toast('No se pudo iniciar la captura: ' + e.message, true);
  }

  if (c.mode === 'cam') showView('camrec');
  else if (c.hideMain) api.hideMain();
  else api.minimizeMain();
  api.showControls();
  rec.timer = setInterval(broadcast, 250);

  // Cuenta regresiva
  if (c.countdown) {
    for (let n = 3; n >= 1; n--) {
      if (!rec || rec.phase !== 'countdown') return;
      rec.count = n;
      broadcast();
      if (c.mode === 'cam') { $('#camrec-count').textContent = n; $('#camrec-count').classList.remove('hidden'); }
      await sleep(1000);
    }
  } else await sleep(400); // deja que la ventana se oculte
  $('#camrec-count').classList.add('hidden');
  if (!rec || rec.phase !== 'countdown') return;

  rec.id = await api.recBegin();
  const mimeType = pickMime();
  const recorder = new MediaRecorder(rec.stream, {
    mimeType,
    videoBitsPerSecond: c.mode === 'cam' ? 6e6 : q.bps,
    audioBitsPerSecond: 160000,
  });
  const r = rec;
  recorder.ondataavailable = (e) => {
    if (!e.data || !e.data.size) return;
    r.writeChain = r.writeChain.then(async () => api.recChunk(r.id, await e.data.arrayBuffer()));
  };
  recorder.onstop = () => finishRecording(r);
  rec.recorder = recorder;
  recorder.start(1000);
  rec.phase = 'recording';
  rec.startedAt = performance.now();
  broadcast();
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
}

function cancelRecording(restart = false) {
  if (!rec) return;
  const r = rec;
  r.cancelled = true;
  r.restart = restart;
  if (r.recorder && r.recorder.state !== 'inactive') { r.phase = 'stopping'; r.recorder.stop(); }
  else { r.phase = 'stopping'; finishRecording(r); }
}

function teardown(r) {
  clearInterval(r.timer);
  r.owned.forEach((s) => s.getTracks().forEach((t) => t.stop()));
  r.stream.getTracks().forEach((t) => t.stop());
  if (r.audioCtx) r.audioCtx.close();
  $('#camrec-video').srcObject = null;
  $('#camrec-count').classList.add('hidden');
}

async function finishRecording(r) {
  if (r.finished) return;
  r.finished = true;
  teardown(r);
  try { await r.writeChain; } catch {}
  rec = null;
  api.hideControls();

  if (r.cancelled) {
    if (r.id) await api.recCancel(r.id);
    if (r.restart) {
      return startRecording(r.cfg);
    }
    api.hideBubble();
    api.showMain();
    showView(current ? 'player' : 'library');
    toast('Grabación descartada');
    return;
  }

  api.hideBubble();
  api.showMain();
  busy('Guardando grabación…');
  try {
    const v = await api.recEnd(r.id, { duration: r.duration, mode: r.cfg.mode, width: r.width, height: r.height });
    library.unshift(v);
    busy();
    openPlayer(v);
    toast('¡Video guardado!');
  } catch (e) {
    busy();
    showView('library');
    toast('Error al guardar: ' + e.message, true);
  }
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

// Esc cierra la configuración
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && setupOpen) closeSetup(); });

// ---------- Inicio ----------
(async () => {
  const info = await api.info();
  if (!info.ffmpeg) toast('Aviso: ffmpeg no encontrado; recortar/exportar no funcionará', true);
  if (info.platform === 'linux') $('#sysaudio-field').title = 'El audio del sistema no está soportado en Linux';
  await loadLibrary();
})();
