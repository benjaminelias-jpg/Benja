/* Simulación mínima de los servicios de Apps Script para probar Codigo.gs en
 * Node: una hoja en memoria, MailApp que guarda los correos, Drive con blobs
 * falsos, cerrojo, propiedades, caché y UrlFetchApp. */
const fs = require('fs'), path = require('path'), vm = require('vm');

function crearEntorno(opciones = {}) {
  const estado = {
    correos: [], fetches: [], triggers: [], alertas: [],
    props: Object.assign({}, opciones.props || {}),
    cuota: opciones.cuota === undefined ? 100 : opciones.cuota,
    fallarCorreo: opciones.fallarCorreo || 0,
    archivos: opciones.archivos || {},       // nombre → contenido
    respuestaFetch: opciones.respuestaFetch || 200
  };

  /* ---------- hoja en memoria ---------- */
  const celdas = (opciones.filas || []).map((f) => f.slice());
  const formatos = {};
  function asegurar(r, c) {
    while (celdas.length < r) celdas.push([]);
    for (const fila of celdas) while (fila.length < c) fila.push('');
  }
  function ultimaFila() {
    for (let r = celdas.length; r >= 1; r--) if (celdas[r - 1].some((v) => v !== '' && v !== null && v !== undefined)) return r;
    return 0;
  }
  function ultimaCol() {
    let m = 0;
    celdas.forEach((f) => f.forEach((v, i) => { if (v !== '' && v !== null && v !== undefined) m = Math.max(m, i + 1); }));
    return m;
  }
  function rango(r, c, nr = 1, nc = 1) {
    return {
      getValues() { asegurar(r + nr - 1, c + nc - 1); return Array.from({ length: nr }, (_, i) => celdas[r - 1 + i].slice(c - 1, c - 1 + nc)); },
      setValues(v) {
        if (v.length !== nr || v.some((x) => x.length !== nc)) throw new Error(`setValues: tamaño ${v.length}x${v[0] && v[0].length} ≠ ${nr}x${nc}`);
        asegurar(r + nr - 1, c + nc - 1);
        v.forEach((fila, i) => fila.forEach((x, j) => { celdas[r - 1 + i][c - 1 + j] = x; }));
        return this;
      },
      setValue(x) { asegurar(r, c); celdas[r - 1][c - 1] = x; return this; },
      setFontWeight() { return this; },
      setNumberFormat(f) { formatos[c] = f; return this; },
      getRow() { return r; }, getLastRow() { return r + nr - 1; },
      getSheet() { return hoja; }
    };
  }
  const hoja = {
    getName: () => 'Leads',
    getLastRow: ultimaFila, getLastColumn: ultimaCol, getMaxRows: () => 1000,
    getRange: rango,
    appendRow(fila) { const r = ultimaFila() + 1; asegurar(r, fila.length); fila.forEach((x, j) => { celdas[r - 1][j] = x; }); },
    setFrozenRows() {}
  };
  const libro = {
    getId: () => 'hoja-de-prueba',
    getSheetByName: (n) => (n === 'Leads' ? hoja : null),
    insertSheet: () => hoja,
    getActiveRange: () => opciones.seleccion ? rango(opciones.seleccion, 1) : null
  };

  const blob = (nombre, datos) => ({ nombre, datos, setName(n) { return blob(n, datos); }, getName() { return nombre; } });

  const sandbox = {
    console, Date, Math, JSON, Object, Array, String, Number, Set, RegExp, Error, encodeURIComponent, decodeURIComponent,
    SpreadsheetApp: {
      getActiveSpreadsheet: () => libro, openById: () => libro, flush() {},
      getUi: () => ({ alert: (t, x) => estado.alertas.push({ t, x }), ButtonSet: { OK: 'OK' }, createMenu: () => ({ addItem() { return this; }, addSeparator() { return this; }, addToUi() {} }) })
    },
    MailApp: {
      getRemainingDailyQuota: () => estado.cuota,
      sendEmail(o) {
        if (estado.fallarCorreo > 0) { estado.fallarCorreo--; throw new Error('Servicio de correo no disponible'); }
        if (estado.cuota < 1) throw new Error('Cuota agotada');
        estado.cuota--; estado.correos.push(o);
      }
    },
    DriveApp: {
      getFolderById: (id) => {
        if (id !== 'carpeta-ok') throw new Error('No existe la carpeta ' + id);
        return {
          getFilesByName: (n) => { const hay = n in estado.archivos; let dado = false; return { hasNext: () => hay && !dado, next: () => { dado = true; return { getId: () => 'id:' + n }; } }; },
          getFiles: () => { const ks = Object.keys(estado.archivos); let i = 0; return { hasNext: () => i < ks.length, next: () => ks[i++] }; }
        };
      },
      getFileById: (id) => ({ getBlob: () => blob(id.slice(3), estado.archivos[id.slice(3)]) })
    },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock() {} }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => (k in estado.props ? estado.props[k] : null), setProperty: (k, v) => { estado.props[k] = v; } }) },
    CacheService: { getScriptCache: () => { const m = {}; return { get: (k) => (k in m ? m[k] : null), put: (k, v) => { m[k] = v; } }; } },
    UrlFetchApp: {
      fetch(url, o) {
        estado.fetches.push({ url, o });
        const code = estado.respuestaFetch;
        return { getResponseCode: () => code, getBlob: () => blob(url.split('/').pop(), 'remoto') };
      }
    },
    ContentService: { createTextOutput: (t) => ({ texto: t, setMimeType() { return this; } }), MimeType: { JSON: 'json' } },
    Utilities: { getUuid: () => '1234abcd-0000-0000-0000-00000000cafe' },
    ScriptApp: {
      getProjectTriggers: () => estado.triggers,
      deleteTrigger: (t) => { estado.triggers.splice(estado.triggers.indexOf(t), 1); },
      newTrigger: (h) => ({ timeBased: () => ({ everyMinutes: (n) => ({ create: () => { estado.triggers.push({ getHandlerFunction: () => h, n }); } }) }) }),
      getService: () => ({ getUrl: () => 'https://script.google.com/macros/s/PRUEBA/exec' })
    },
    Session: { getEffectiveUser: () => ({ getEmail: () => 'yo@kunfupay.com' }) },
    Logger: { log() {} },
    module: { exports: {} }
  };
  vm.createContext(sandbox);
  const codigo = fs.readFileSync(path.join(__dirname, '..', 'apps-script', 'Codigo.gs'), 'utf8');
  vm.runInContext(codigo, sandbox, { filename: 'Codigo.gs' });
  const api = sandbox.module.exports;
  if (opciones.config) Object.assign(api.CONFIG, opciones.config);
  return { api, estado, celdas, formatos, sandbox };
}

module.exports = { crearEntorno };
