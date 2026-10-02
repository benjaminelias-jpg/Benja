// Genera el mapa de desplazamiento (lente) que usa feDisplacementMap para refractar el fondo.
// R = desplazamiento X, G = desplazamiento Y (128 = sin desplazamiento).
// Uso: node tools/make-lens-map.mjs [diámetro] [caja]  →  assets/glass/lens-map.png + imprime SCALE
import { writeFileSync, mkdirSync } from "node:fs";
import { deflateSync } from "node:zlib";

const D = Number(process.argv[2] ?? 174); // diámetro visible de la esfera (px)
const L = Number(process.argv[3] ?? 236); // caja de refracción (más grande que la esfera para traer fondo de afuera)
const R = D / 2;

// Radio de muestreo s(r) en unidades del radio:
// centro levemente magnificado (~1.14x) y un borde que comprime y curva el fondo,
// trayendo contenido de afuera de la esfera (como la "L" deformada de la referencia).
const sampleRadius = (r) => r * 0.88 + 0.38 * Math.pow(Math.max(0, (r - 0.55) / 0.45), 2.2);

let maxOff = 0;
for (let i = 0; i <= 2000; i++) {
  const r = i / 2000;
  maxOff = Math.max(maxOff, Math.abs(sampleRadius(r) - r) * R);
}
const SCALE = Math.ceil(maxOff * 2 * 1.04);

const raw = Buffer.alloc(L * (L * 3 + 1));
for (let y = 0; y < L; y++) {
  raw[y * (L * 3 + 1)] = 0; // filtro PNG: none
  for (let x = 0; x < L; x++) {
    const ux = (x + 0.5 - L / 2) / R;
    const uy = (y + 0.5 - L / 2) / R;
    const r = Math.hypot(ux, uy);
    let dx = 0;
    let dy = 0;
    if (r > 1e-6) {
      const rc = Math.min(r, 1);
      const off = (sampleRadius(rc) - rc) * R;
      // fuera de la esfera el desplazamiento se apaga suave (el clip-path recorta igual)
      const fade = r <= 1 ? 1 : Math.max(0, 1 - (r - 1) / 0.04);
      dx = (ux / r) * off * fade;
      dy = (uy / r) * off * fade;
    }
    const p = y * (L * 3 + 1) + 1 + x * 3;
    raw[p] = Math.max(0, Math.min(255, Math.round(255 * (0.5 + dx / SCALE))));
    raw[p + 1] = Math.max(0, Math.min(255, Math.round(255 * (0.5 + dy / SCALE))));
    raw[p + 2] = 128;
  }
}

// PNG mínimo (RGB 8 bits)
const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(L, 0);
ihdr.writeUInt32BE(L, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // RGB
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

mkdirSync(new URL("../assets/glass/", import.meta.url), { recursive: true });
writeFileSync(new URL("../assets/glass/lens-map.png", import.meta.url), png);
console.log(`lens-map.png ${L}x${L}  maxOff=${maxOff.toFixed(1)}px  SCALE=${SCALE}`);
