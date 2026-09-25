/* El motor del correo tiene que dar EXACTAMENTE lo mismo que la landing v1.
 * El oráculo son las 3.750 combinaciones calculadas con CBS.simular() en la
 * landing publicada (kunfupay.com/landings/classroom-platinum-score/v1). */
const assert = require('assert');
const fs = require('fs'), path = require('path');
const { crearEntorno } = require('./entorno');

const { api } = crearEntorno();
const oraculo = JSON.parse(fs.readFileSync(path.join(__dirname, 'oraculo-landing-v1.json'), 'utf8')).combinaciones;
const ids = api.PREGUNTAS.map((p) => p.id);

let fallos = 0;
oraculo.forEach((o) => {
  const r = {};
  ids.forEach((id, k) => { r[id] = api.PREGUNTAS[k].opciones[o.i[k]]; });
  const res = api.evaluar(r);
  const mal = [];
  if (res.puntaje !== o.puntaje) mal.push(`puntaje ${res.puntaje}≠${o.puntaje}`);
  if (res.puntajeVisible !== o.visible) mal.push(`visible ${res.puntajeVisible}≠${o.visible}`);
  if (res.claveCaso !== o.caso) mal.push(`caso ${res.claveCaso}≠${o.caso}`);
  if (res.califica !== o.califica) mal.push(`califica ${res.califica}≠${o.califica}`);
  if (res.noAplica !== o.noAplica) mal.push(`noAplica ${res.noAplica}≠${o.noAplica}`);
  if (JSON.stringify(res.variables) !== JSON.stringify(o.variables)) mal.push('variables');
  if (mal.length) { fallos++; if (fallos < 10) console.log(o.i.join(','), mal.join(' · ')); }
});
assert.strictEqual(fallos, 0, `${fallos} combinaciones no coinciden con la landing`);
console.log(`paridad: ${oraculo.length}/${oraculo.length} combinaciones idénticas a la landing v1 (puntaje real, mostrado, caso, calificación, variables)`);

/* Cada par (puntaje mostrado, caso) tiene su medalla generada. */
const pares = new Set(oraculo.map((o) => `cbs-${o.visible}-${o.caso}`));
console.log(`medallas necesarias: ${pares.size} pares → ${pares.size * 2} archivos`);
const carpeta = process.argv[2];
if (carpeta) {
  const faltan = [...pares].flatMap((b) => [b + '.jpg', b + '-correo.jpg']).filter((f) => !fs.existsSync(path.join(carpeta, f)));
  assert.strictEqual(faltan.length, 0, 'faltan medallas: ' + faltan.slice(0, 5).join(', '));
  console.log(`medallas: las ${pares.size * 2} están en ${carpeta}`);
}
