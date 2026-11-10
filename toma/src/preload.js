const { contextBridge, ipcRenderer } = require('electron');

const on = (channel) => (cb) => {
  const fn = (_e, ...args) => cb(...args);
  ipcRenderer.on(channel, fn);
  return () => ipcRenderer.removeListener(channel, fn);
};
const invoke = (channel) => (...args) => ipcRenderer.invoke(channel, ...args);
const send = (channel) => (...args) => ipcRenderer.send(channel, ...args);

contextBridge.exposeInMainWorld('toma', {
  // Sistema
  info: invoke('app:info'),
  permStatus: invoke('perm:status'),
  permRequest: invoke('perm:request'),
  relaunch: invoke('app:relaunch'),

  // Fuentes de captura
  listSources: invoke('sources:list'),
  selectSource: invoke('sources:select'),

  // Ventanas flotantes
  showBubble: send('bubble:show'),
  hideBubble: send('bubble:hide'),
  setBubbleSize: send('bubble:size'),
  setBubbleMirror: send('bubble:mirror'),
  onBubbleConfig: on('bubble:config'),
  onBubbleSizeChanged: on('bubble:size-changed'),
  showControls: send('controls:show'),
  hideControls: send('controls:hide'),
  controlAction: send('controls:action'),
  onControlAction: on('controls:action'),
  sendState: send('rec:state'),
  onState: on('rec:state'),
  onShortcut: on('shortcut'),
  onMenu: on('menu'),
  onLibChanged: on('lib:changed'),
  hideMain: send('main:hide'),
  showMain: send('main:show'),
  minimizeMain: send('main:minimize'),

  // Grabación
  recBegin: invoke('rec:begin'),
  recChunk: invoke('rec:chunk'),
  recEnd: invoke('rec:end'),
  recCancel: invoke('rec:cancel'),

  // Biblioteca
  list: invoke('lib:list'),
  update: invoke('lib:update'),
  remove: invoke('lib:delete'),
  showInFolder: invoke('lib:show'),
  openFolder: invoke('lib:open-folder'),
  openExternal: invoke('lib:open-external'),
  copyPath: invoke('lib:copy-path'),
  trim: invoke('lib:trim'),
  isolateVoice: invoke('lib:isolate-voice'),
  exportVideo: invoke('lib:export'),
  importVideos: invoke('lib:import'),
  setDuration: invoke('lib:set-duration'),
});
