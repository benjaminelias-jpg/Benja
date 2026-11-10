// Toma — grabador de pantalla y cámara local (proceso principal)
const {
  app, BrowserWindow, ipcMain, desktopCapturer, session, protocol,
  screen, shell, dialog, globalShortcut, clipboard, Menu,
} = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

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
  try { return JSON.parse(fs.readFileSync(LIB_FILE, 'utf8')); } catch { return []; }
}
function saveLibrary(lib) {
  fs.writeFileSync(LIB_FILE, JSON.stringify(lib, null, 2));
}
function publicVideo(v) {
  const file = path.join(VIDEOS_DIR, v.file);
  let size = 0;
  try { size = fs.statSync(file).size; } catch {}
  return {
    ...v,
    size,
    exists: fs.existsSync(file),
    src: `toma://media/${encodeURIComponent(v.file)}?v=${v.updatedAt || v.createdAt}`,
    thumbSrc: v.thumb ? `toma://media/${encodeURIComponent('.thumbs/' + v.thumb)}?v=${v.updatedAt || v.createdAt}` : null,
  };
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    if (!ffmpegPath) return reject(new Error('ffmpeg no disponible'));
    const p = spawn(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', ...args]);
    let err = '';
    p.stderr.on('data', (d) => { err += d.toString(); });
    p.on('error', reject);
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(err || `ffmpeg salió con código ${code}`))));
  });
}

async function makeThumb(videoFile, id, duration) {
  const thumb = `${id}.jpg`;
  const out = path.join(THUMBS_DIR, thumb);
  const at = Math.max(0, Math.min(1, (duration || 0) / 2));
  try {
    await runFfmpeg(['-ss', String(at), '-i', videoFile, '-frames:v', '1', '-vf', 'scale=480:-2', '-q:v', '4', out]);
    return thumb;
  } catch {
    try {
      await runFfmpeg(['-i', videoFile, '-frames:v', '1', '-vf', 'scale=480:-2', '-q:v', '4', out]);
      return thumb;
    } catch { return null; }
  }
}

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
function defaultTitle(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `Grabación ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function safeName(s) {
  return (s || 'video').replace(/[\\/:*?"<>|]+/g, '').trim().slice(0, 80) || 'video';
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
    const url = new URL(request.url);
    const rel = decodeURIComponent(url.pathname.replace(/^\/+/, ''));
    const file = path.normalize(path.join(VIDEOS_DIR, rel));
    if (!file.startsWith(VIDEOS_DIR) || !fs.existsSync(file)) {
      return new Response('No encontrado', { status: 404 });
    }
    const stat = fs.statSync(file);
    const type = mimeFor(file);
    const range = request.headers.get('range');
    const toWeb = (stream) => new ReadableStream({
      start(controller) {
        stream.on('data', (c) => controller.enqueue(new Uint8Array(c)));
        stream.on('end', () => controller.close());
        stream.on('error', (e) => controller.error(e));
      },
      cancel() { stream.destroy(); },
    });
    if (range) {
      const m = /bytes=(\d*)-(\d*)/.exec(range);
      let start = m && m[1] ? parseInt(m[1], 10) : 0;
      let end = m && m[2] ? parseInt(m[2], 10) : stat.size - 1;
      if (end >= stat.size) end = stat.size - 1;
      if (start > end) start = 0;
      return new Response(toWeb(fs.createReadStream(file, { start, end })), {
        status: 206,
        headers: {
          'Content-Type': type,
          'Content-Length': String(end - start + 1),
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Accept-Ranges': 'bytes',
        },
      });
    }
    return new Response(toWeb(fs.createReadStream(file)), {
      status: 200,
      headers: { 'Content-Type': type, 'Content-Length': String(stat.size), 'Accept-Ranges': 'bytes' },
    });
  });
}

// ---------- Ventanas ----------
let mainWin = null;
let bubbleWin = null;
let controlsWin = null;
let selectedSource = { id: null, systemAudio: false };

const PRELOAD = path.join(__dirname, 'preload.js');
const webPrefs = { preload: PRELOAD, contextIsolation: true, nodeIntegration: false, backgroundThrottling: false };

function createMainWindow() {
  mainWin = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'Toma',
    backgroundColor: '#0f1115',
    autoHideMenuBar: true,
    webPreferences: webPrefs,
  });
  mainWin.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  mainWin.on('closed', () => {
    mainWin = null;
    if (bubbleWin) bubbleWin.close();
    if (controlsWin) controlsWin.close();
  });
}

const BUBBLE_SIZES = { s: 160, m: 240, l: 340 };

function createBubble(deviceId, sizeKey = 'm') {
  const size = BUBBLE_SIZES[sizeKey] || BUBBLE_SIZES.m;
  if (bubbleWin) {
    bubbleWin.webContents.send('bubble:config', { deviceId, sizeKey });
    const [x, y] = bubbleWin.getPosition();
    bubbleWin.setBounds({ x, y, width: size, height: size });
    bubbleWin.showInactive();
    return;
  }
  const wa = screen.getPrimaryDisplay().workArea;
  bubbleWin = new BrowserWindow({
    width: size,
    height: size,
    x: wa.x + 32,
    y: wa.y + wa.height - size - 32,
    frame: false,
    transparent: true,
    resizable: false,
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    focusable: true,
    fullscreenable: false,
    show: false,
    webPreferences: webPrefs,
  });
  bubbleWin.setAlwaysOnTop(true, 'screen-saver');
  bubbleWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  bubbleWin.loadFile(path.join(__dirname, 'renderer', 'bubble.html'), { query: { deviceId: deviceId || '', size: sizeKey } });
  bubbleWin.once('ready-to-show', () => bubbleWin && bubbleWin.showInactive());
  bubbleWin.on('closed', () => { bubbleWin = null; });
}

function createControls() {
  if (controlsWin) { controlsWin.showInactive(); return; }
  const wa = screen.getPrimaryDisplay().workArea;
  const w = 380, h = 64;
  controlsWin = new BrowserWindow({
    width: w,
    height: h,
    x: Math.round(wa.x + (wa.width - w) / 2),
    y: wa.y + wa.height - h - 24,
    frame: false,
    transparent: true,
    resizable: false,
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    fullscreenable: false,
    show: false,
    webPreferences: webPrefs,
  });
  // Excluye la barra de controles de la grabación (Windows 10 2004+ / macOS)
  controlsWin.setContentProtection(true);
  controlsWin.setAlwaysOnTop(true, 'screen-saver');
  controlsWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  controlsWin.loadFile(path.join(__dirname, 'renderer', 'controls.html'));
  controlsWin.once('ready-to-show', () => controlsWin && controlsWin.showInactive());
  controlsWin.on('closed', () => { controlsWin = null; });
}

// ---------- IPC: fuentes y ventanas flotantes ----------
ipcMain.handle('sources:list', async () => {
  const sources = await desktopCapturer.getSources({
    types: ['screen', 'window'],
    thumbnailSize: { width: 320, height: 180 },
    fetchWindowIcons: true,
  });
  const ownTitles = new Set(['Toma', '']);
  return sources
    .filter((s) => !(s.id.startsWith('window') && ownTitles.has(s.name)))
    .map((s) => ({
      id: s.id,
      name: s.name,
      type: s.id.startsWith('screen') ? 'screen' : 'window',
      thumb: s.thumbnail.isEmpty() ? null : s.thumbnail.toDataURL(),
      icon: s.appIcon && !s.appIcon.isEmpty() ? s.appIcon.toDataURL() : null,
    }));
});

ipcMain.handle('sources:select', (_e, id, systemAudio) => {
  selectedSource = { id, systemAudio: !!systemAudio };
  return true;
});

ipcMain.handle('platform', () => process.platform);

ipcMain.on('bubble:show', (_e, deviceId, sizeKey) => createBubble(deviceId, sizeKey));
ipcMain.on('bubble:hide', () => { if (bubbleWin) bubbleWin.close(); });
ipcMain.on('bubble:size', (_e, sizeKey) => {
  if (!bubbleWin) return;
  const size = BUBBLE_SIZES[sizeKey] || BUBBLE_SIZES.m;
  const b = bubbleWin.getBounds();
  // Mantiene la esquina inferior izquierda fija
  bubbleWin.setBounds({ x: b.x, y: b.y + b.height - size, width: size, height: size });
  bubbleWin.webContents.send('bubble:config', { sizeKey });
  if (mainWin) mainWin.webContents.send('bubble:size-changed', sizeKey);
});

ipcMain.on('controls:show', () => createControls());
ipcMain.on('controls:hide', () => { if (controlsWin) controlsWin.close(); });
// Botones de la barra flotante -> ventana principal (que es la que graba)
ipcMain.on('controls:action', (_e, action) => { if (mainWin) mainWin.webContents.send('controls:action', action); });
// Estado de la grabación -> barra flotante y burbuja
ipcMain.on('rec:state', (_e, state) => {
  if (controlsWin) controlsWin.webContents.send('rec:state', state);
  if (bubbleWin) bubbleWin.webContents.send('rec:state', state);
});

ipcMain.on('main:hide', () => { if (mainWin) mainWin.hide(); });
ipcMain.on('main:show', () => { if (mainWin) { mainWin.show(); mainWin.focus(); } });
ipcMain.on('main:minimize', () => { if (mainWin) mainWin.minimize(); });

// ---------- IPC: grabación (escritura progresiva a disco) ----------
const active = new Map(); // id -> { stream, tmp }

ipcMain.handle('rec:begin', () => {
  const id = newId();
  const tmp = path.join(VIDEOS_DIR, `.${id}.part.webm`);
  active.set(id, { stream: fs.createWriteStream(tmp), tmp });
  return id;
});

ipcMain.handle('rec:chunk', (_e, id, buf) => new Promise((resolve) => {
  const r = active.get(id);
  if (!r) return resolve(false);
  r.stream.write(Buffer.from(buf), () => resolve(true));
}));

function closeStream(r) {
  return new Promise((resolve) => r.stream.end(resolve));
}

ipcMain.handle('rec:cancel', async (_e, id) => {
  const r = active.get(id);
  if (!r) return false;
  active.delete(id);
  await closeStream(r);
  fs.rm(r.tmp, { force: true }, () => {});
  return true;
});

ipcMain.handle('rec:end', async (_e, id, meta) => {
  const r = active.get(id);
  if (!r) throw new Error('Grabación desconocida');
  active.delete(id);
  await closeStream(r);

  const now = new Date();
  const file = `${id}.webm`;
  const finalPath = path.join(VIDEOS_DIR, file);
  // Remux con ffmpeg para que el WebM tenga duración y sea navegable
  try {
    await runFfmpeg(['-i', r.tmp, '-c', 'copy', finalPath]);
    fs.rmSync(r.tmp, { force: true });
  } catch {
    fs.renameSync(r.tmp, finalPath);
  }
  const duration = Number(meta && meta.duration) || 0;
  const thumb = await makeThumb(finalPath, id, duration);
  const video = {
    id,
    file,
    title: defaultTitle(now),
    notes: '',
    duration,
    mode: (meta && meta.mode) || 'screen',
    width: meta && meta.width,
    height: meta && meta.height,
    thumb,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  const lib = loadLibrary();
  lib.unshift(video);
  saveLibrary(lib);
  return publicVideo(video);
});

// ---------- IPC: biblioteca ----------
ipcMain.handle('lib:list', () => loadLibrary().map(publicVideo));

ipcMain.handle('lib:update', (_e, id, patch) => {
  const lib = loadLibrary();
  const v = lib.find((x) => x.id === id);
  if (!v) return null;
  if (typeof patch.title === 'string') v.title = patch.title.trim() || v.title;
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

ipcMain.handle('lib:show', (_e, id) => {
  const v = loadLibrary().find((x) => x.id === id);
  if (v) shell.showItemInFolder(path.join(VIDEOS_DIR, v.file));
});

ipcMain.handle('lib:open-folder', () => shell.openPath(VIDEOS_DIR));

ipcMain.handle('lib:open-external', (_e, id) => {
  const v = loadLibrary().find((x) => x.id === id);
  if (v) return shell.openPath(path.join(VIDEOS_DIR, v.file));
});

ipcMain.handle('lib:copy-path', (_e, id) => {
  const v = loadLibrary().find((x) => x.id === id);
  if (!v) return null;
  const p = path.join(VIDEOS_DIR, v.file);
  clipboard.writeText(p);
  return p;
});

ipcMain.handle('lib:trim', async (_e, id, start, end) => {
  const lib = loadLibrary();
  const v = lib.find((x) => x.id === id);
  if (!v) throw new Error('Video no encontrado');
  start = Math.max(0, Number(start) || 0);
  end = Number(end);
  if (!(end > start)) throw new Error('Rango de recorte inválido');
  const src = path.join(VIDEOS_DIR, v.file);
  const outName = `${v.id}-${Date.now().toString(36)}.mp4`;
  const out = path.join(VIDEOS_DIR, outName);
  await runFfmpeg([
    '-ss', start.toFixed(3), '-to', end.toFixed(3), '-i', src,
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '22', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', out,
  ]);
  shell.trashItem(src).catch(() => fs.rmSync(src, { force: true }));
  v.file = outName;
  v.duration = end - start;
  if (Array.isArray(v.chapters)) {
    v.chapters = v.chapters
      .filter((c) => c.t >= start && c.t <= end)
      .map((c) => ({ ...c, t: c.t - start }));
  }
  v.updatedAt = new Date().toISOString();
  v.thumb = (await makeThumb(out, v.id, v.duration)) || v.thumb;
  saveLibrary(lib);
  return publicVideo(v);
});

ipcMain.handle('lib:export', async (_e, id, format) => {
  const v = loadLibrary().find((x) => x.id === id);
  if (!v) throw new Error('Video no encontrado');
  const src = path.join(VIDEOS_DIR, v.file);
  const ext = format === 'gif' ? 'gif' : format === 'webm' ? 'webm' : 'mp4';
  const res = await dialog.showSaveDialog(mainWin, {
    title: 'Exportar video',
    defaultPath: path.join(app.getPath('downloads'), `${safeName(v.title)}.${ext}`),
    filters: [{ name: ext.toUpperCase(), extensions: [ext] }],
  });
  if (res.canceled || !res.filePath) return null;
  if (ext === 'mp4') {
    if (path.extname(src) === '.mp4') fs.copyFileSync(src, res.filePath);
    else {
      await runFfmpeg([
        '-i', src, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '22', '-pix_fmt', 'yuv420p',
        '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', res.filePath,
      ]);
    }
  } else if (ext === 'gif') {
    await runFfmpeg([
      '-t', '30', '-i', src,
      '-vf', 'fps=12,scale=720:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse',
      res.filePath,
    ]);
  } else {
    if (path.extname(src) === '.webm') fs.copyFileSync(src, res.filePath);
    else await runFfmpeg(['-i', src, '-c:v', 'libvpx-vp9', '-deadline', 'realtime', '-cpu-used', '8', '-b:v', '3M', '-c:a', 'libopus', res.filePath]);
  }
  shell.showItemInFolder(res.filePath);
  return res.filePath;
});

ipcMain.handle('lib:import', async () => {
  const res = await dialog.showOpenDialog(mainWin, {
    title: 'Importar videos',
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Video', extensions: ['mp4', 'webm', 'mov', 'mkv'] }],
  });
  if (res.canceled) return [];
  const lib = loadLibrary();
  const added = [];
  for (const f of res.filePaths) {
    const id = newId();
    let ext = path.extname(f).toLowerCase();
    let file = `${id}${ext}`;
    if (ext === '.mp4' || ext === '.webm') fs.copyFileSync(f, path.join(VIDEOS_DIR, file));
    else {
      file = `${id}.mp4`;
      await runFfmpeg(['-i', f, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '22', '-pix_fmt', 'yuv420p', '-c:a', 'aac', path.join(VIDEOS_DIR, file)]);
    }
    const now = new Date().toISOString();
    const v = {
      id, file, title: path.basename(f, path.extname(f)), notes: '', duration: 0, mode: 'import',
      thumb: await makeThumb(path.join(VIDEOS_DIR, file), id, 2), createdAt: now, updatedAt: now,
    };
    lib.unshift(v);
    added.push(v);
  }
  saveLibrary(lib);
  return added.map(publicVideo);
});

// El renderer descubre la duración real de videos importados
ipcMain.handle('lib:set-duration', (_e, id, duration) => {
  const lib = loadLibrary();
  const v = lib.find((x) => x.id === id);
  if (!v || !(duration > 0) || !isFinite(duration)) return;
  v.duration = duration;
  saveLibrary(lib);
});

ipcMain.handle('app:info', () => ({ videosDir: VIDEOS_DIR, ffmpeg: !!ffmpegPath, platform: process.platform }));

// ---------- Arranque ----------
app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  registerProtocol();

  // getDisplayMedia() usa la fuente elegida en el selector de la app
  session.defaultSession.setDisplayMediaRequestHandler(async (_request, callback) => {
    try {
      const sources = await desktopCapturer.getSources({ types: ['screen', 'window'] });
      const src = sources.find((s) => s.id === selectedSource.id) || sources.find((s) => s.id.startsWith('screen'));
      const res = { video: src };
      if (selectedSource.systemAudio && process.platform !== 'linux') res.audio = 'loopback';
      callback(res);
    } catch {
      callback({});
    }
  });
  session.defaultSession.setPermissionRequestHandler((_wc, _perm, cb) => cb(true));

  createMainWindow();

  const send = (a) => mainWin && mainWin.webContents.send('shortcut', a);
  globalShortcut.register('Alt+Shift+R', () => send('toggle'));
  globalShortcut.register('Alt+Shift+P', () => send('pause'));
  globalShortcut.register('Alt+Shift+C', () => send('cancel'));

  app.on('activate', () => { if (!mainWin) createMainWindow(); });
});

app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
