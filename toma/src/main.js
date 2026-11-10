// Toma — grabador de pantalla y cámara local (proceso principal)
const {
  app, BrowserWindow, ipcMain, desktopCapturer, session, protocol, screen, shell, dialog,
  globalShortcut, clipboard, Menu, Tray, nativeImage, systemPreferences,
} = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { Readable } = require('stream');

const IS_MAC = process.platform === 'darwin';
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) app.quit();

// ---------- Rutas y almacenamiento ----------
const VIDEOS_DIR = path.join(app.getPath('videos'), 'Toma');
const THUMBS_DIR = path.join(VIDEOS_DIR, '.thumbs');
const LIB_FILE = path.join(VIDEOS_DIR, 'library.json');
fs.mkdirSync(THUMBS_DIR, { recursive: true });

let ffmpegPath = null;
try {
  ffmpegPath = require('ffmpeg-static');
  if (ffmpegPath) ffmpegPath = ffmpegPath.replace('app.asar', 'app.asar.unpacked');
  if (ffmpegPath && !fs.existsSync(ffmpegPath)) ffmpegPath = null;
} catch { ffmpegPath = null; }

function loadLibrary() {
  try {
    const lib = JSON.parse(fs.readFileSync(LIB_FILE, 'utf8'));
    return Array.isArray(lib) ? lib : [];
  } catch { return []; }
}
function saveLibrary(lib) {
  const tmp = LIB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(lib, null, 2));
  fs.renameSync(tmp, LIB_FILE);
}
function publicVideo(v) {
  const file = path.join(VIDEOS_DIR, v.file);
  let size = 0;
  try { size = fs.statSync(file).size; } catch {}
  const stamp = encodeURIComponent(v.updatedAt || v.createdAt);
  return {
    ...v,
    size,
    src: `toma://media/${encodeURIComponent(v.file)}?v=${stamp}`,
    thumbSrc: v.thumb ? `toma://media/${encodeURIComponent('.thumbs/' + v.thumb)}?v=${stamp}` : null,
  };
}

// ---------- ffmpeg ----------
function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    if (!ffmpegPath) return reject(new Error('ffmpeg no disponible'));
    const p = spawn(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', ...args]);
    let err = '';
    p.stderr.on('data', (d) => { err += d.toString(); });
    p.on('error', reject);
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(err.trim().split('\n').pop() || `ffmpeg salió con código ${code}`))));
  });
}

// Lee duración, códec y tamaño de un archivo de video
function ffmpegInfo(file) {
  return new Promise((resolve) => {
    const out = { duration: 0, width: 0, height: 0, vcodec: '', hasAudio: false };
    if (!ffmpegPath) return resolve(out);
    const p = spawn(ffmpegPath, ['-hide_banner', '-i', file]);
    let err = '';
    p.stderr.on('data', (d) => { err += d.toString(); });
    p.on('error', () => resolve(out));
    p.on('close', () => {
      const d = /Duration: (\d+):(\d+):(\d+(?:\.\d+)?)/.exec(err);
      if (d) out.duration = Number(d[1]) * 3600 + Number(d[2]) * 60 + parseFloat(d[3]);
      const v = /Stream #.*Video: (\w+).*?[ ,](\d{2,5})x(\d{2,5})/.exec(err);
      if (v) { out.vcodec = v[1]; out.width = Number(v[2]); out.height = Number(v[3]); }
      out.hasAudio = /Stream #.*Audio:/.test(err);
      resolve(out);
    });
  });
}

// Aislar voz: corta graves (golpes, zumbidos), reduce ruido de fondo constante
// (ventilador, aire, tráfico) y nivela el volumen de la voz.
const VOICE_AF = 'highpass=f=90,afftdn=nr=20:nf=-32:tn=1,lowpass=f=11000,dynaudnorm=f=250:g=15:p=0.9';
const X264 = ['-c:v', 'libx264', '-preset', 'veryfast', '-crf', '22', '-pix_fmt', 'yuv420p'];
const AAC = ['-c:a', 'aac', '-b:a', '160k'];
function audioCodecFor(file) {
  return path.extname(file).toLowerCase() === '.webm' ? ['-c:a', 'libopus', '-b:a', '128k'] : AAC;
}

async function makeThumb(videoFile, id, duration) {
  const thumb = `${id}.jpg`;
  const out = path.join(THUMBS_DIR, thumb);
  const at = Math.max(0, Math.min(1.5, (duration || 0) / 2));
  for (const ss of [String(at), '0']) {
    try {
      await runFfmpeg(['-ss', ss, '-i', videoFile, '-frames:v', '1', '-vf', 'scale=640:-2', '-q:v', '4', out]);
      if (fs.existsSync(out)) return thumb;
    } catch {}
  }
  return null;
}

// Convierte la grabación en bruto en el archivo final.
// H.264 -> MP4 (compatible con todo); si falla, cae a contenedores alternativos.
async function finalizeRecording(tmp, id, { codec, voiceIsolation }) {
  const af = voiceIsolation ? ['-af', VOICE_AF] : [];
  const attempts = [];
  if (codec === 'h264') {
    attempts.push({ file: `${id}.mp4`, voice: !!af.length, args: ['-i', tmp, '-c:v', 'copy', ...af, ...AAC, '-movflags', '+faststart'] });
    attempts.push({ file: `${id}.webm`, voice: false, args: ['-i', tmp, '-c', 'copy', '-f', 'matroska'] });
  } else {
    if (af.length) attempts.push({ file: `${id}.webm`, voice: true, args: ['-i', tmp, '-c:v', 'copy', ...af, '-c:a', 'libopus', '-b:a', '128k'] });
    attempts.push({ file: `${id}.webm`, voice: false, args: ['-i', tmp, '-c', 'copy'] });
  }
  for (const a of attempts) {
    const out = path.join(VIDEOS_DIR, a.file);
    try {
      await runFfmpeg([...a.args, out]);
      if (fs.statSync(out).size > 0) {
        fs.rmSync(tmp, { force: true });
        return { file: a.file, voiceIsolated: a.voice };
      }
    } catch {
      fs.rmSync(out, { force: true });
    }
  }
  const file = `${id}.webm`;
  fs.renameSync(tmp, path.join(VIDEOS_DIR, file));
  return { file, voiceIsolated: false };
}

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
const pad2 = (n) => String(n).padStart(2, '0');
function defaultTitle(d = new Date(), prefix = 'Grabación') {
  return `${prefix} ${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
function safeName(s) {
  return (s || 'video').replace(/[\\/:*?"<>|]+/g, '').trim().slice(0, 80) || 'video';
}
function fmtClock(s) {
  s = Math.max(0, Math.floor(s || 0));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  return h ? `${h}:${pad2(m)}:${pad2(x)}` : `${m}:${pad2(x)}`;
}

// ---------- Protocolo toma:// para servir videos con soporte de Range ----------
protocol.registerSchemesAsPrivileged([
  { scheme: 'toma', privileges: { standard: true, secure: true, stream: true, supportFetchAPI: true } },
]);

function mimeFor(file) {
  const ext = path.extname(file).toLowerCase();
  return { '.webm': 'video/webm', '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.png': 'image/png' }[ext] || 'application/octet-stream';
}

function registerProtocol() {
  protocol.handle('toma', (request) => {
    let file;
    try {
      const url = new URL(request.url);
      const rel = decodeURIComponent(url.pathname.replace(/^\/+/, ''));
      file = path.normalize(path.join(VIDEOS_DIR, rel));
    } catch { return new Response('Solicitud inválida', { status: 400 }); }
    if (!file.startsWith(VIDEOS_DIR + path.sep) || !fs.existsSync(file)) {
      return new Response('No encontrado', { status: 404 });
    }
    const stat = fs.statSync(file);
    const type = mimeFor(file);
    const range = request.headers.get('range');
    if (range) {
      const m = /bytes=(\d*)-(\d*)/.exec(range);
      let start = m && m[1] ? parseInt(m[1], 10) : 0;
      let end = m && m[2] ? parseInt(m[2], 10) : stat.size - 1;
      if (end >= stat.size) end = stat.size - 1;
      if (start > end) start = 0;
      return new Response(Readable.toWeb(fs.createReadStream(file, { start, end })), {
        status: 206,
        headers: {
          'Content-Type': type,
          'Content-Length': String(end - start + 1),
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Accept-Ranges': 'bytes',
        },
      });
    }
    return new Response(Readable.toWeb(fs.createReadStream(file)), {
      status: 200,
      headers: { 'Content-Type': type, 'Content-Length': String(stat.size), 'Accept-Ranges': 'bytes' },
    });
  });
}

// ---------- Estado ----------
let mainWin = null;
let bubbleWin = null;
let controlsWin = null;
let countdownWin = null;
let tray = null;
let selectedSource = { id: null, systemAudio: false };
let targetDisplayId = null;
const sourceMeta = new Map(); // id -> { type, display_id }
let recState = { phase: 'idle' };
let quitting = false;
let quitAfterSave = false;

const isRecording = () => recState.phase && recState.phase !== 'idle';
const sendMain = (channel, ...args) => { if (mainWin && !mainWin.isDestroyed()) mainWin.webContents.send(channel, ...args); };
function showMain() {
  if (!mainWin) return createMainWindow();
  if (mainWin.isMinimized()) mainWin.restore();
  mainWin.show();
  mainWin.focus();
}

const PRELOAD = path.join(__dirname, 'preload.js');
const webPrefs = { preload: PRELOAD, contextIsolation: true, nodeIntegration: false, backgroundThrottling: false };
const ASSETS = path.join(__dirname, 'assets');

// ---------- Ventana principal ----------
function createMainWindow() {
  mainWin = new BrowserWindow({
    width: 1240,
    height: 820,
    minWidth: 960,
    minHeight: 620,
    title: 'Toma',
    backgroundColor: '#0e0f13',
    autoHideMenuBar: true,
    show: false,
    icon: IS_MAC ? undefined : path.join(ASSETS, 'icon.png'),
    ...(IS_MAC ? { titleBarStyle: 'hiddenInset', trafficLightPosition: { x: 18, y: 20 } } : {}),
    webPreferences: webPrefs,
  });
  mainWin.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  mainWin.once('ready-to-show', () => mainWin && mainWin.show());
  mainWin.webContents.once('did-finish-load', () => { recoverOrphans().catch(() => {}); });

  mainWin.on('close', (e) => {
    if (quitting) return;
    if (isRecording()) {
      e.preventDefault();
      dialog.showMessageBox(mainWin, {
        type: 'question',
        buttons: ['Seguir grabando', 'Detener y guardar'],
        defaultId: 0,
        cancelId: 0,
        message: 'Hay una grabación en curso',
        detail: 'Si cierras Toma ahora se interrumpe la grabación.',
      }).then((r) => { if (r.response === 1) sendMain('controls:action', 'stop'); });
      return;
    }
    // En macOS cerrar la ventana solo la oculta: la app sigue lista en la barra de menús
    if (IS_MAC) { e.preventDefault(); mainWin.hide(); }
  });
  mainWin.on('closed', () => {
    mainWin = null;
    for (const w of [bubbleWin, controlsWin, countdownWin]) if (w && !w.isDestroyed()) w.close();
  });
}

// ---------- Ventanas flotantes ----------
// Encima de todo, en todos los escritorios (Spaces) y también sobre apps a pantalla completa.
const FLOAT_OPTS = {
  frame: false,
  transparent: true,
  resizable: false,
  hasShadow: false,
  alwaysOnTop: true,
  skipTaskbar: true,
  fullscreenable: false,
  show: false,
  ...(IS_MAC ? { type: 'panel' } : {}),
};
function keepOnTop(win) {
  if (!win || win.isDestroyed()) return;
  try {
    win.setAlwaysOnTop(true, 'screen-saver', 1);
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true, skipTransformProcessType: true });
  } catch {}
}

function targetDisplay() {
  const all = screen.getAllDisplays();
  return all.find((d) => d.id === targetDisplayId) || screen.getPrimaryDisplay();
}
function displayForSource(id) {
  const meta = sourceMeta.get(id);
  const all = screen.getAllDisplays();
  if (meta && meta.type === 'screen') {
    const byId = all.find((d) => String(d.id) === String(meta.display_id));
    if (byId) return byId;
    const idx = parseInt(String(id).split(':')[1], 10);
    if (all.length > 1 && idx >= 0 && idx < all.length && !meta.display_id) return all[idx];
    return screen.getPrimaryDisplay();
  }
  if (bubbleWin) return screen.getDisplayMatching(bubbleWin.getBounds());
  return screen.getPrimaryDisplay();
}

const BUBBLE_SIZES = { s: 160, m: 230, l: 320 };

function createBubble(deviceId, sizeKey = 'm', mirror = true) {
  const size = BUBBLE_SIZES[sizeKey] || BUBBLE_SIZES.m;
  if (bubbleWin) {
    const b = bubbleWin.getBounds();
    if (b.width !== size) bubbleWin.setBounds({ x: b.x, y: b.y + b.height - size, width: size, height: size });
    bubbleWin.webContents.send('bubble:config', { deviceId, sizeKey, mirror });
    bubbleWin.showInactive();
    return;
  }
  const wa = targetDisplay().workArea;
  bubbleWin = new BrowserWindow({
    ...FLOAT_OPTS,
    width: size,
    height: size,
    x: wa.x + 28,
    y: wa.y + wa.height - size - 28,
    webPreferences: webPrefs,
  });
  keepOnTop(bubbleWin);
  bubbleWin.loadFile(path.join(__dirname, 'renderer', 'bubble.html'), {
    query: { deviceId: deviceId || '', size: sizeKey, mirror: mirror ? '1' : '0' },
  });
  bubbleWin.once('ready-to-show', () => { if (bubbleWin) { bubbleWin.showInactive(); keepOnTop(bubbleWin); } });
  bubbleWin.on('closed', () => { bubbleWin = null; });
}

// Si se graba otra pantalla, lleva la burbuja a esa pantalla para que salga en el video
function moveBubbleToDisplay(display) {
  if (!bubbleWin) return;
  const b = bubbleWin.getBounds();
  const cur = screen.getDisplayMatching(b);
  if (cur.id === display.id) return;
  const wa = display.workArea;
  bubbleWin.setBounds({ x: wa.x + 28, y: wa.y + wa.height - b.height - 28, width: b.width, height: b.height });
}

function createControls() {
  if (controlsWin) { controlsWin.showInactive(); return; }
  const wa = targetDisplay().workArea;
  const w = 68, h = 150;
  controlsWin = new BrowserWindow({
    ...FLOAT_OPTS,
    width: w,
    height: h,
    x: wa.x + 16,
    y: Math.round(wa.y + (wa.height - h) / 2),
    webPreferences: webPrefs,
  });
  // Excluye la barra de controles de la grabación (Windows 10 2004+ / macOS)
  try { controlsWin.setContentProtection(true); } catch {}
  keepOnTop(controlsWin);
  controlsWin.loadFile(path.join(__dirname, 'renderer', 'controls.html'));
  controlsWin.webContents.once('did-finish-load', () => { if (controlsWin) controlsWin.webContents.send('rec:state', recState); });
  controlsWin.once('ready-to-show', () => { if (controlsWin) { controlsWin.showInactive(); keepOnTop(controlsWin); } });
  controlsWin.on('closed', () => { controlsWin = null; });
}

function showCountdown() {
  if (countdownWin) return;
  const b = targetDisplay().bounds;
  const s = 280;
  countdownWin = new BrowserWindow({
    ...FLOAT_OPTS,
    width: s,
    height: s,
    x: Math.round(b.x + (b.width - s) / 2),
    y: Math.round(b.y + (b.height - s) / 2),
    focusable: false,
    webPreferences: webPrefs,
  });
  try { countdownWin.setIgnoreMouseEvents(true); } catch {}
  keepOnTop(countdownWin);
  countdownWin.loadFile(path.join(__dirname, 'renderer', 'countdown.html'));
  countdownWin.webContents.once('did-finish-load', () => { if (countdownWin) countdownWin.webContents.send('rec:state', recState); });
  countdownWin.once('ready-to-show', () => { if (countdownWin) { countdownWin.showInactive(); keepOnTop(countdownWin); } });
  countdownWin.on('closed', () => { countdownWin = null; });
}
function closeCountdown() {
  if (countdownWin && !countdownWin.isDestroyed()) countdownWin.close();
}

// ---------- Icono en la barra de menús / bandeja ----------
let trayPhase = null;
let trayTitle = '';
function trayMenu(phase) {
  const quit = { label: 'Salir de Toma', click: () => app.quit() };
  if (phase === 'idle') {
    return [
      { label: 'Nueva grabación', click: () => { showMain(); sendMain('menu', 'new'); } },
      { label: 'Abrir biblioteca', click: () => showMain() },
      { type: 'separator' },
      quit,
    ];
  }
  return [
    { label: 'Detener y guardar', click: () => sendMain('controls:action', 'stop') },
    { label: phase === 'paused' ? 'Reanudar' : 'Pausar', enabled: phase === 'recording' || phase === 'paused', click: () => sendMain('controls:action', 'pause') },
    { label: 'Descartar grabación', click: () => sendMain('controls:action', 'cancel') },
    { type: 'separator' },
    quit,
  ];
}
function createTray() {
  try {
    const img = nativeImage.createFromPath(path.join(ASSETS, IS_MAC ? 'trayTemplate.png' : 'tray.png'));
    if (img.isEmpty()) return;
    if (IS_MAC) img.setTemplateImage(true);
    tray = new Tray(img);
    tray.setToolTip('Toma');
    if (!IS_MAC) tray.on('click', () => showMain());
    updateTray();
  } catch { tray = null; }
}
function updateTray() {
  if (!tray) return;
  try {
    const phase = recState.phase || 'idle';
    if (phase !== trayPhase) {
      trayPhase = phase;
      tray.setContextMenu(Menu.buildFromTemplate(trayMenu(phase)));
    }
    if (IS_MAC) {
      let t = '';
      if (phase === 'recording') t = ` ${fmtClock(recState.elapsed)}`;
      else if (phase === 'paused') t = ` ${fmtClock(recState.elapsed)} (pausa)`;
      if (t !== trayTitle) { trayTitle = t; tray.setTitle(t); }
    }
  } catch {}
}

// ---------- Menú de la aplicación ----------
function buildAppMenu() {
  if (!IS_MAC) { Menu.setApplicationMenu(null); return; }
  // En macOS el menú es necesario para ⌘Q, ⌘C/⌘V en los campos de texto, etc.
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'Toma',
      submenu: [
        { role: 'about', label: 'Acerca de Toma' },
        { type: 'separator' },
        { role: 'hide', label: 'Ocultar Toma' },
        { role: 'hideOthers', label: 'Ocultar otros' },
        { role: 'unhide', label: 'Mostrar todo' },
        { type: 'separator' },
        { role: 'quit', label: 'Salir de Toma' },
      ],
    },
    {
      label: 'Archivo',
      submenu: [
        { label: 'Nueva grabación', accelerator: 'CmdOrCtrl+N', click: () => { showMain(); sendMain('menu', 'new'); } },
        { label: 'Importar videos…', accelerator: 'CmdOrCtrl+I', click: () => { showMain(); sendMain('menu', 'import'); } },
        { type: 'separator' },
        { label: 'Abrir carpeta de videos', click: () => shell.openPath(VIDEOS_DIR) },
      ],
    },
    {
      label: 'Edición',
      submenu: [
        { role: 'undo', label: 'Deshacer' },
        { role: 'redo', label: 'Rehacer' },
        { type: 'separator' },
        { role: 'cut', label: 'Cortar' },
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Pegar' },
        { role: 'selectAll', label: 'Seleccionar todo' },
      ],
    },
    {
      label: 'Ver',
      submenu: [
        { role: 'togglefullscreen', label: 'Pantalla completa' },
        { role: 'toggleDevTools', label: 'Herramientas de desarrollo' },
      ],
    },
    {
      label: 'Ventana',
      submenu: [
        { role: 'minimize', label: 'Minimizar' },
        { role: 'close', label: 'Cerrar ventana' },
        { type: 'separator' },
        { label: 'Biblioteca', click: () => showMain() },
      ],
    },
  ]));
}

// ---------- IPC: fuentes y ventanas flotantes ----------
ipcMain.handle('sources:list', async () => {
  const sources = await desktopCapturer.getSources({
    types: ['screen', 'window'],
    thumbnailSize: { width: 480, height: 270 },
    fetchWindowIcons: true,
  });
  sourceMeta.clear();
  const screens = sources.filter((s) => s.id.startsWith('screen'));
  return sources
    .filter((s) => !(s.id.startsWith('window') && (s.name === 'Toma' || !s.name.trim())))
    .map((s) => {
      const type = s.id.startsWith('screen') ? 'screen' : 'window';
      sourceMeta.set(s.id, { type, display_id: s.display_id });
      let name = s.name;
      if (type === 'screen') name = screens.length > 1 ? `Pantalla ${screens.indexOf(s) + 1}` : 'Pantalla completa';
      return {
        id: s.id,
        name,
        type,
        thumb: s.thumbnail.isEmpty() ? null : s.thumbnail.toDataURL(),
        icon: s.appIcon && !s.appIcon.isEmpty() ? s.appIcon.toDataURL() : null,
      };
    });
});

ipcMain.handle('sources:select', (_e, id, systemAudio) => {
  selectedSource = { id, systemAudio: !!systemAudio };
  const d = displayForSource(id);
  targetDisplayId = d.id;
  const meta = sourceMeta.get(id);
  if (meta && meta.type === 'screen') moveBubbleToDisplay(d);
  return true;
});

ipcMain.on('bubble:show', (_e, deviceId, sizeKey, mirror) => createBubble(deviceId, sizeKey, mirror !== false));
ipcMain.on('bubble:hide', () => { if (bubbleWin) bubbleWin.close(); });
ipcMain.on('bubble:size', (_e, sizeKey) => {
  if (!bubbleWin) return;
  const size = BUBBLE_SIZES[sizeKey] || BUBBLE_SIZES.m;
  const b = bubbleWin.getBounds();
  // Mantiene la esquina inferior izquierda fija
  bubbleWin.setBounds({ x: b.x, y: b.y + b.height - size, width: size, height: size });
  bubbleWin.webContents.send('bubble:config', { sizeKey });
  sendMain('bubble:size-changed', sizeKey);
});
ipcMain.on('bubble:mirror', (_e, mirror) => {
  if (bubbleWin) bubbleWin.webContents.send('bubble:config', { mirror: !!mirror });
});

ipcMain.on('controls:show', () => createControls());
ipcMain.on('controls:hide', () => { if (controlsWin) controlsWin.close(); });
// Botones de la barra flotante -> ventana principal (que es la que graba)
ipcMain.on('controls:action', (_e, action) => sendMain('controls:action', action));

// Estado de la grabación -> barra flotante, burbuja, cuenta regresiva y bandeja
ipcMain.on('rec:state', (_e, state) => {
  recState = state && state.phase ? state : { phase: 'idle' };
  for (const w of [controlsWin, bubbleWin, countdownWin]) {
    if (w && !w.isDestroyed()) w.webContents.send('rec:state', recState);
  }
  if (recState.phase === 'countdown' && recState.count > 0 && recState.mode !== 'cam') showCountdown();
  else closeCountdown();
  updateTray();
  if (recState.phase === 'idle' && quitAfterSave) { quitting = true; app.quit(); }
});

ipcMain.on('main:hide', () => {
  if (mainWin) mainWin.hide();
  keepOnTop(bubbleWin);
  keepOnTop(controlsWin);
});
ipcMain.on('main:show', () => showMain());
ipcMain.on('main:minimize', () => { if (mainWin) mainWin.minimize(); });

// ---------- IPC: grabación (escritura progresiva a disco) ----------
const active = new Map(); // id -> { stream, tmp }
const partName = (id) => `.${id}.part.webm`;

ipcMain.handle('rec:begin', () => {
  const id = newId();
  const tmp = path.join(VIDEOS_DIR, partName(id));
  active.set(id, { stream: fs.createWriteStream(tmp), tmp });
  return id;
});

ipcMain.handle('rec:chunk', (_e, id, buf) => new Promise((resolve) => {
  const r = active.get(id);
  if (!r) return resolve(false);
  r.stream.write(Buffer.from(buf), (err) => resolve(!err));
}));

const closeStream = (r) => new Promise((resolve) => r.stream.end(resolve));

ipcMain.handle('rec:cancel', async (_e, id) => {
  const r = active.get(id);
  if (!r) return false;
  active.delete(id);
  await closeStream(r);
  fs.rmSync(r.tmp, { force: true });
  return true;
});

async function addRecording(tmp, id, meta, when = new Date(), titlePrefix = 'Grabación') {
  const fin = await finalizeRecording(tmp, id, { codec: meta.codec, voiceIsolation: !!meta.voiceIsolation });
  const finalPath = path.join(VIDEOS_DIR, fin.file);
  const info = await ffmpegInfo(finalPath);
  const duration = Number(meta.duration) > 0 ? Number(meta.duration) : info.duration;
  const video = {
    id,
    file: fin.file,
    title: defaultTitle(when, titlePrefix),
    notes: '',
    duration,
    mode: meta.mode || 'screen',
    voiceIsolated: fin.voiceIsolated,
    width: info.width || meta.width || 0,
    height: info.height || meta.height || 0,
    thumb: await makeThumb(finalPath, id, duration),
    createdAt: when.toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const lib = loadLibrary();
  lib.unshift(video);
  saveLibrary(lib);
  return video;
}

ipcMain.handle('rec:end', async (_e, id, meta) => {
  const r = active.get(id);
  if (!r) throw new Error('Grabación desconocida');
  active.delete(id);
  await closeStream(r);
  return publicVideo(await addRecording(r.tmp, id, meta || {}));
});

// Si la app se cerró a mitad de una grabación, recupera lo que se alcanzó a guardar
async function recoverOrphans() {
  const tmps = new Set([...active.values()].map((r) => path.basename(r.tmp)));
  const files = fs.readdirSync(VIDEOS_DIR).filter((f) => /^\..+\.part\.webm$/.test(f) && !tmps.has(f));
  let recovered = 0;
  for (const f of files) {
    const tmp = path.join(VIDEOS_DIR, f);
    try {
      const st = fs.statSync(tmp);
      if (st.size < 20000) { fs.rmSync(tmp, { force: true }); continue; }
      const info = await ffmpegInfo(tmp);
      if (!info.vcodec) { fs.rmSync(tmp, { force: true }); continue; }
      await addRecording(tmp, newId(), { codec: info.vcodec, mode: 'screen' }, st.mtime, 'Grabación recuperada');
      recovered += 1;
    } catch {}
  }
  if (recovered) sendMain('lib:changed', `Se recuperó ${recovered === 1 ? 'una grabación' : recovered + ' grabaciones'} que no se había guardado`);
}

// ---------- IPC: biblioteca ----------
ipcMain.handle('lib:list', () => {
  const lib = loadLibrary();
  const alive = lib.filter((v) => fs.existsSync(path.join(VIDEOS_DIR, v.file)));
  if (alive.length !== lib.length) saveLibrary(alive);
  return alive.map(publicVideo);
});

ipcMain.handle('lib:update', (_e, id, patch) => {
  const lib = loadLibrary();
  const v = lib.find((x) => x.id === id);
  if (!v) return null;
  if (typeof patch.title === 'string') v.title = patch.title.trim().slice(0, 140) || v.title;
  if (typeof patch.notes === 'string') v.notes = patch.notes;
  if (Array.isArray(patch.chapters)) v.chapters = patch.chapters;
  if (typeof patch.favorite === 'boolean') v.favorite = patch.favorite;
  v.updatedAt = new Date().toISOString();
  saveLibrary(lib);
  return publicVideo(v);
});

ipcMain.handle('lib:delete', (_e, id) => {
  const lib = loadLibrary();
  const idx = lib.findIndex((x) => x.id === id);
  if (idx < 0) return false;
  const [v] = lib.splice(idx, 1);
  saveLibrary(lib);
  const file = path.join(VIDEOS_DIR, v.file);
  shell.trashItem(file).catch(() => fs.rmSync(file, { force: true }));
  if (v.thumb) fs.rmSync(path.join(THUMBS_DIR, v.thumb), { force: true });
  return true;
});

const findVideo = (id) => loadLibrary().find((x) => x.id === id);

ipcMain.handle('lib:show', (_e, id) => {
  const v = findVideo(id);
  if (v) shell.showItemInFolder(path.join(VIDEOS_DIR, v.file));
});
ipcMain.handle('lib:open-folder', () => shell.openPath(VIDEOS_DIR));
ipcMain.handle('lib:open-external', (_e, id) => {
  const v = findVideo(id);
  if (v) return shell.openPath(path.join(VIDEOS_DIR, v.file));
});
ipcMain.handle('lib:copy-path', (_e, id) => {
  const v = findVideo(id);
  if (!v) return null;
  const p = path.join(VIDEOS_DIR, v.file);
  clipboard.writeText(p);
  return p;
});

// Sustituye el archivo de un video por una versión procesada
async function replaceFile(id, ext, buildArgs, after) {
  const lib = loadLibrary();
  const v = lib.find((x) => x.id === id);
  if (!v) throw new Error('Video no encontrado');
  const src = path.join(VIDEOS_DIR, v.file);
  const outName = `${v.id}-${Date.now().toString(36)}${ext || path.extname(v.file)}`;
  const out = path.join(VIDEOS_DIR, outName);
  try {
    await runFfmpeg([...buildArgs(src, out), out]);
  } catch (e) {
    fs.rmSync(out, { force: true });
    throw e;
  }
  shell.trashItem(src).catch(() => fs.rmSync(src, { force: true }));
  v.file = outName;
  v.updatedAt = new Date().toISOString();
  if (after) await after(v, out);
  saveLibrary(lib);
  return publicVideo(v);
}

ipcMain.handle('lib:trim', (_e, id, start, end) => {
  start = Math.max(0, Number(start) || 0);
  end = Number(end);
  if (!(end > start)) throw new Error('Rango de recorte inválido');
  return replaceFile(id, '.mp4',
    (src) => ['-ss', start.toFixed(3), '-to', end.toFixed(3), '-i', src, ...X264, ...AAC, '-movflags', '+faststart'],
    async (v, out) => {
      v.duration = end - start;
      if (Array.isArray(v.chapters)) {
        v.chapters = v.chapters.filter((c) => c.t >= start && c.t <= end).map((c) => ({ ...c, t: c.t - start }));
      }
      const info = await ffmpegInfo(out);
      if (info.duration) v.duration = info.duration;
      v.thumb = (await makeThumb(out, v.id, v.duration)) || v.thumb;
    });
});

ipcMain.handle('lib:isolate-voice', (_e, id) => replaceFile(id, null,
  (src, out) => ['-i', src, '-c:v', 'copy', '-af', VOICE_AF, ...audioCodecFor(out), ...(path.extname(out) === '.mp4' ? ['-movflags', '+faststart'] : [])],
  (v) => { v.voiceIsolated = true; }));

ipcMain.handle('lib:export', async (_e, id, format) => {
  const v = findVideo(id);
  if (!v) throw new Error('Video no encontrado');
  const src = path.join(VIDEOS_DIR, v.file);
  const ext = format === 'gif' ? 'gif' : 'mp4';
  const res = await dialog.showSaveDialog(mainWin, {
    title: 'Exportar video',
    defaultPath: path.join(app.getPath('downloads'), `${safeName(v.title)}.${ext}`),
    filters: [{ name: ext.toUpperCase(), extensions: [ext] }],
  });
  if (res.canceled || !res.filePath) return null;
  if (ext === 'mp4') {
    if (path.extname(src) === '.mp4') fs.copyFileSync(src, res.filePath);
    else await runFfmpeg(['-i', src, ...X264, ...AAC, '-movflags', '+faststart', res.filePath]);
  } else {
    await runFfmpeg([
      '-t', '30', '-i', src,
      '-vf', 'fps=12,scale=720:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse',
      res.filePath,
    ]);
  }
  shell.showItemInFolder(res.filePath);
  return res.filePath;
});

ipcMain.handle('lib:import', async () => {
  const res = await dialog.showOpenDialog(mainWin, {
    title: 'Importar videos',
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Video', extensions: ['mp4', 'webm', 'mov', 'mkv', 'm4v'] }],
  });
  if (res.canceled) return [];
  const lib = loadLibrary();
  const added = [];
  for (const f of res.filePaths) {
    const id = newId();
    const ext = path.extname(f).toLowerCase();
    let file = `${id}${ext}`;
    try {
      if (ext === '.mp4' || ext === '.webm') fs.copyFileSync(f, path.join(VIDEOS_DIR, file));
      else {
        file = `${id}.mp4`;
        await runFfmpeg(['-i', f, ...X264, ...AAC, '-movflags', '+faststart', path.join(VIDEOS_DIR, file)]);
      }
    } catch { continue; }
    const full = path.join(VIDEOS_DIR, file);
    const info = await ffmpegInfo(full);
    const now = new Date().toISOString();
    const v = {
      id, file, title: path.basename(f, path.extname(f)), notes: '', duration: info.duration, mode: 'import',
      width: info.width, height: info.height,
      thumb: await makeThumb(full, id, info.duration), createdAt: now, updatedAt: now,
    };
    lib.unshift(v);
    added.push(v);
  }
  saveLibrary(lib);
  return added.map(publicVideo);
});

// El renderer corrige la duración si el reproductor detecta otra
ipcMain.handle('lib:set-duration', (_e, id, duration) => {
  if (!(duration > 0) || !isFinite(duration)) return;
  const lib = loadLibrary();
  const v = lib.find((x) => x.id === id);
  if (!v) return;
  v.duration = duration;
  saveLibrary(lib);
});

// ---------- IPC: sistema ----------
// Audio del sistema: Windows siempre; macOS solo desde la versión 13
function systemAudioSupported() {
  if (process.platform === 'win32') return true;
  if (IS_MAC) return parseInt(process.getSystemVersion().split('.')[0], 10) >= 13;
  return false;
}
ipcMain.handle('app:info', () => ({
  videosDir: VIDEOS_DIR,
  ffmpeg: !!ffmpegPath,
  platform: process.platform,
  systemAudio: systemAudioSupported(),
  version: app.getVersion(),
}));

// Permisos del sistema (macOS): cámara, micrófono y grabación de pantalla
ipcMain.handle('perm:status', () => {
  if (!IS_MAC) return { camera: 'granted', microphone: 'granted', screen: 'granted' };
  return {
    camera: systemPreferences.getMediaAccessStatus('camera'),
    microphone: systemPreferences.getMediaAccessStatus('microphone'),
    screen: systemPreferences.getMediaAccessStatus('screen'),
  };
});
ipcMain.handle('perm:request', async (_e, kind, open = true) => {
  if (!IS_MAC) return true;
  const pane = { camera: 'Privacy_Camera', microphone: 'Privacy_Microphone', screen: 'Privacy_ScreenCapture' }[kind];
  if (!pane) return false;
  const openPane = () => shell.openExternal('x-apple.systempreferences:com.apple.preference.security?' + pane);
  if (kind === 'screen') {
    // Pedir las fuentes hace que macOS muestre su aviso y registre a Toma en la lista
    try { await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 1, height: 1 } }); } catch {}
    if (open && systemPreferences.getMediaAccessStatus('screen') !== 'granted') openPane();
    return true;
  }
  const st = systemPreferences.getMediaAccessStatus(kind);
  if (st === 'not-determined') {
    const ok = await systemPreferences.askForMediaAccess(kind);
    if (!ok) openPane();
  } else if (st !== 'granted') openPane();
  return true;
});
ipcMain.handle('app:relaunch', () => { quitting = true; app.relaunch(); app.exit(0); });

// ---------- Arranque ----------
app.on('second-instance', () => showMain());

app.whenReady().then(() => {
  if (!gotLock) return;
  buildAppMenu();
  registerProtocol();

  // getDisplayMedia() usa la fuente elegida en el selector de la app
  session.defaultSession.setDisplayMediaRequestHandler(async (_request, callback) => {
    try {
      const sources = await desktopCapturer.getSources({ types: ['screen', 'window'], thumbnailSize: { width: 1, height: 1 } });
      const src = sources.find((s) => s.id === selectedSource.id) || sources.find((s) => s.id.startsWith('screen'));
      if (!src) return callback({});
      const res = { video: src };
      if (selectedSource.systemAudio && systemAudioSupported()) res.audio = 'loopback';
      callback(res);
    } catch {
      callback({});
    }
  });
  session.defaultSession.setPermissionRequestHandler((_wc, _perm, cb) => cb(true));

  createMainWindow();
  createTray();

  const send = (a) => sendMain('shortcut', a);
  globalShortcut.register('Alt+Shift+R', () => send('toggle'));
  globalShortcut.register('Alt+Shift+P', () => send('pause'));
  globalShortcut.register('Alt+Shift+C', () => send('cancel'));

  app.on('activate', () => {
    if (!mainWin) createMainWindow();
    else if (!isRecording()) showMain();
  });
});

app.on('before-quit', (e) => {
  // ⌘Q durante una grabación: primero se guarda y después se sale
  if (isRecording() && !quitAfterSave && mainWin) {
    e.preventDefault();
    quitAfterSave = true;
    sendMain('controls:action', 'stop');
    return;
  }
  quitting = true;
});
app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', () => { if (!IS_MAC) app.quit(); });
