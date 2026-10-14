// Contenido de la animación. El motor (index.html) calcula los tiempos a partir de aquí.
//
// - *palabra* marca la palabra en color de acento (una por frase como máximo).
// - Cada punto: título corto de la tarjeta (2–3 palabras, en mayúsculas), frase de 2–6 palabras
//   e imagen PNG/WebP con fondo transparente (ver scripts/preparar_imagen.py).
// - foley: nombre de un sonido definido en audio.json → "foley" (suena al aterrizar el objeto).
// - glow: true añade un halo del color de acento al objeto (útil para objetos oscuros).
// - rot: inclinación del objeto en grados.
// - De 1 a 5 puntos. Con más de 3, las tarjetas se hacen más bajas para caber en la zona segura.
window.CONFIG = {
  fps: 30,
  palette: { bg: "#0B111E", accent: "#4CC9F0" },
  intro: {
    kicker: "VENDES CURSOS ONLINE",
    lines: ["ASÍ COBRAS", "CON *KUNFUPAY*"],
  },
  points: [
    { title: "LA FACTURA", caption: "Se la hacemos *nosotros.*", image: "assets/img/factura.webp", rot: -5, foley: "papel" },
    { title: "CADA VENTA", caption: "Te olvidas de su *IVA.*", image: "assets/img/calculadora.webp", rot: 4, foley: "tecla", glow: true },
    { title: "TU CUENTA", caption: "A *tu nombre.*", image: "assets/img/llave.webp", rot: -12, foley: "llave" },
  ],
};
