/* Simulación de los servicios de Apps Script para probar Codigo.gs en Node.
 * La hoja imita la semántica real de Sheets que importa aquí:
 *  · un texto escrito con apóstrofo inicial ("'=…") se guarda como texto y
 *    getValues() lo devuelve SIN el apóstrofo;
 *  · un texto que empieza por "=" escrito con setValue(s)/appendRow se
 *    convierte en fórmula (se registra en estado.formulas);
 *  · las columnas con formato '@' guardan el texto tal cual. */
const fs = require('fs'), path = require('path'), vm = require('vm');

function crearEntorno(opciones = {}) {
  const estado = {
    correos: [], fetches: [], triggers: [], alertas: [], formulas: [], carpetasCreadas: [], errores: [],
    props: Object.assign({}, opciones.props || {}),
    cuota: opciones.cuota === undefined ? 100 : opciones.cuota,
    fallarCorreo: opciones.fallarCorreo || 0,
    errorCorreo: opciones.errorCorreo || 'Servicio de correo no disponible',
    archivos: Object.assign({}, opciones.archivos || {}),    // nombre → contenido (carpeta de medallas)
    papelera: new Set(opciones.papelera || []),
    respuestaFetch: opciones.respuestaFetch || 200,
    cerrojoOcupado: !!opciones.cerrojoOcupado
  };

  /* ---------- hoja en memoria ---------- */
  const celdas = (opciones.filas || []).map((f) => f.slice());
  const formatos = {};
  function asegurar(r, c) {
    while (celdas.length < r) celdas.push([]);
    for (const fila of celdas) while (fila.length < c) fila.push('');
  }
  function guardar(r, c, x) {
    asegurar(r, c);
    if (typeof x === 'string' && formatos[c] !== '@') {
      if (x.startsWith("'")) x = x.slice(1);                       // prefijo de texto: no se guarda
      else if (x.startsWith('=')) estado.formulas.push({ r, c, x }); // se evaluaría como fórmula
    }
    celdas[r - 1][c - 1] = x;
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
      getValue() { asegurar(r, c); return celdas[r - 1][c - 1]; },
      setValues(v) {
        if (v.length !== nr || v.some((x) => x.length !== nc)) throw new Error(`setValues: tamaño ${v.length}x${v[0] && v[0].length} ≠ ${nr}x${nc}`);
        v.forEach((fila, i) => fila.forEach((x, j) => guardar(r + i, c + j, x)));
        return this;
      },
      setValue(x) { guardar(r, c, x); return this; },
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
    appendRow(fila) { const r = ultimaFila() + 1; fila.forEach((x, j) => guardar(r, j + 1, x)); },
    setFrozenRows() {}
  };
  const libro = {
    getId: () => 'hoja-de-prueba',
    getSheetByName: (n) => (n === 'Leads' ? hoja : null),
    insertSheet: () => hoja,
    getActiveRange: () => opciones.seleccion ? rango(opciones.seleccion, 1) : null
  };

  /* ---------- Drive ---------- */
  const blob = (nombre, datos, tipo) => ({ nombre, datos, tipo, setName(n) { return blob(n, datos, tipo); }, setContentType(t) { return blob(nombre, datos, t); }, getName() { return nombre; } });
  const archivo = (n) => ({ getId: () => 'id:' + n, getName: () => n, isTrashed: () => estado.papelera.has(n), getBlob: () => blob(n, estado.archivos[n]) });
  const iterador = (xs) => { let i = 0; return { hasNext: () => i < xs.length, next: () => xs[i++] }; };
  const carpetaMedallas = {
    getId: () => 'carpeta-ok', getName: () => 'Medallas · Creator Business Score',
    getFilesByName: (n) => iterador(n in estado.archivos ? [archivo(n)] : []),
    getFiles: () => iterador(Object.keys(estado.archivos).map(archivo)),
    createFile: (b) => { estado.archivos[b.getName()] = b.datos; estado.tiposCreados = (estado.tiposCreados || []).concat(b.tipo); return archivo(b.getName()); }
  };
  const carpetaDeLaHoja = { createFolder: (n) => { estado.carpetasCreadas.push(n); return carpetaMedallas; } };

  const sandbox = {
    console: { log() {}, error: (m) => estado.errores.push(m) }, Date, Math, JSON, Object, Array, String, Number, Set, RegExp, Error,
    encodeURIComponent, decodeURIComponent,
    SpreadsheetApp: {
      getActiveSpreadsheet: () => libro, openById: () => libro, flush() {},
      getUi: () => ({ alert: (t, x) => estado.alertas.push({ t, x }), ButtonSet: { OK: 'OK' }, createMenu: () => ({ addItem() { return this; }, addSeparator() { return this; }, addToUi() {} }) })
    },
    MailApp: {
      getRemainingDailyQuota: () => estado.cuota,
      sendEmail(o) {
        if (estado.fallarCorreo > 0) { estado.fallarCorreo--; throw new Error(estado.errorCorreo); }
        const n = 1 + (o.bcc ? o.bcc.split(',').length : 0);
        if (estado.cuota < n) throw new Error('Service invoked too many times for one day: email.');
        estado.cuota -= n; estado.correos.push(o);
        if (opciones.alEnviar) opciones.alEnviar(celdas);
      }
    },
    DriveApp: {
      getFolderById: (id) => { if (id !== 'carpeta-ok') throw new Error('No existe la carpeta ' + id); return carpetaMedallas; },
      getFileById: (id) => (id === 'hoja-de-prueba' ? { getParents: () => iterador([carpetaDeLaHoja]) } : archivo(id.slice(3))),
      getRootFolder: () => carpetaDeLaHoja
    },
    LockService: { getScriptLock: () => ({ tryLock: () => !estado.cerrojoOcupado, releaseLock() {} }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => (k in estado.props ? estado.props[k] : null), setProperty: (k, v) => { estado.props[k] = v; } }) },
    CacheService: { getScriptCache: () => { const m = {}; return { get: (k) => (k in m ? m[k] : null), put: (k, v) => { m[k] = v; } }; } },
    UrlFetchApp: {
      fetch(url, o) {
        estado.fetches.push({ url, o });
        if (url.endsWith('lista.json')) return { getResponseCode: () => 200, getContentText: () => JSON.stringify(opciones.listaMedallas || []) };
        const code = estado.respuestaFetch;
        return { getResponseCode: () => code, getBlob: () => blob(url.split('/').pop(), 'remoto') };
      },
      fetchAll(peticiones) { return peticiones.map((p) => sandbox.UrlFetchApp.fetch(p.url, p)); }
    },
    ContentService: { createTextOutput: (t) => ({ texto: t, setMimeType() { return this; } }), MimeType: { JSON: 'json' } },
    Utilities: { getUuid: () => '1234abcd-0000-4000-8000-00000000cafe' },
    ScriptApp: {
      getProjectTriggers: () => estado.triggers,
      deleteTrigger: (t) => { estado.triggers.splice(estado.triggers.indexOf(t), 1); },
      newTrigger: (h) => ({ timeBased: () => ({
        everyMinutes: (n) => ({ create: () => { estado.triggers.push({ getHandlerFunction: () => h, n }); } }),
        after: (ms) => ({ create: () => { estado.triggers.push({ getHandlerFunction: () => h, ms }); } })
      }) }),
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
