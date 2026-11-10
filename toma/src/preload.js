const { contextBridge, ipcRenderer } = require('electron');

const on = (channel) => (cb) => {
  const fn = (_e, ...args) => cb(...args);
  ipcRenderer.on(channel, fn);
  return () => ipcRenderer.removeListener(channel, fn);
};

contextBridge.exposeInMainWorld('toma', {
  info: () => ipcRenderer.invoke('app:info'),
  screenAccess: () => ipcRenderer.invoke('screen:access'),
  openScreenSettings: () => ipcRenderer.invoke('screen:open-settings'),
  permStatus: () => ipcRenderer.invoke('perm:status'),
  permRequest: (k) => ipcRenderer.invoke('perm:request', k),
  relaunch: () => ipcRenderer.invoke('app:relaunch'),

  // Fuentes de captura
  listSources: () => ipcRenderer.invoke('sources:list'),
  selectSource: (id, systemAudio) => ipcRenderer.invoke('sources:select', id, systemAudio),

  // Ventanas flotantes
  showBubble: (deviceId, size) => ipcRenderer.send('bubble:show', deviceId, size),
  hideBubble: () => ipcRenderer.send('bubble:hide'),
  setBubbleSize: (size) => ipcRenderer.send('bubble:size', size),
  onBubbleConfig: on('bubble:config'),
  onBubbleSizeChanged: on('bubble:size-changed'),
  showControls: () => ipcRenderer.send('controls:show'),
  hideControls: () => ipcRenderer.send('controls:hide'),
  controlAction: (a) => ipcRenderer.send('controls:action', a),
  onControlAction: on('controls:action'),
  sendState: (s) => ipcRenderer.send('rec:state', s),
  onState: on('rec:state'),
  onShortcut: on('shortcut'),
  hideMain: () => ipcRenderer.send('main:hide'),
  showMain: () => ipcRenderer.send('main:show'),
  minimizeMain: () => ipcRenderer.send('main:minimize'),

  // Grabación
  recBegin: () => ipcRenderer.invoke('rec:begin'),
  recChunk: (id, buf) => ipcRenderer.invoke('rec:chunk', id, buf),
  recEnd: (id, meta) => ipcRenderer.invoke('rec:end', id, meta),
  recCancel: (id) => ipcRenderer.invoke('rec:cancel', id),

  // Biblioteca
  list: () => ipcRenderer.invoke('lib:list'),
  update: (id, patch) => ipcRenderer.invoke('lib:update', id, patch),
  remove: (id) => ipcRenderer.invoke('lib:delete', id),
  showInFolder: (id) => ipcRenderer.invoke('lib:show', id),
  openFolder: () => ipcRenderer.invoke('lib:open-folder'),
  openExternal: (id) => ipcRenderer.invoke('lib:open-external', id),
  copyPath: (id) => ipcRenderer.invoke('lib:copy-path', id),
  trim: (id, s, e) => ipcRenderer.invoke('lib:trim', id, s, e),
  isolateVoice: (id) => ipcRenderer.invoke('lib:isolate-voice', id),
  exportVideo: (id, fmt) => ipcRenderer.invoke('lib:export', id, fmt),
  importVideos: () => ipcRenderer.invoke('lib:import'),
  setDuration: (id, d) => ipcRenderer.invoke('lib:set-duration', id, d),
});
