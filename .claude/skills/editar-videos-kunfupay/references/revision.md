# Revisión antes de entregar

Los revisores **solo informan** (segundo, zona y arreglo); luego corriges tú y vuelves a pasar.

## 1. Diseño (esquinas, CTA)
- Ningún texto cuyo centro caiga en una esquina (30 % ancho × 15 % alto desde cada esquina); el logo sí se permite.
- Ningún botón de CTA dibujado en el vídeo (píldora con flecha incluida). Los botones de la UI de un mockup no cuentan.
- Portadas sin badge de play.

## 2. Errores visuales (cada 5 s)
```bash
python3 scripts/muestrear.py VIDEO.mp4 qa/            # fotogramas cada 5 s (+1,5 s) y hojas de contacto
node scripts/desbordes.mjs DIR_COMPOSICION --paso 5     # lo que se sale de su caja, textos cortados o apretados
```
Mira TODAS las hojas y abre a tamaño real lo dudoso. Caza: gráficos descuadrados, textos cortados o encima de la cara,
cosas que se pisan, mensajes que se van antes de ~1,5 s, cifras ilegibles, y coherencia concepto ↔ ilustración
(varias «personas» = fotos variadas, no la misma sesión; coherencia física de manos/pantallas/texto en imágenes IA).

## 3. Sonido ↔ pantalla
```bash
node scripts/apariciones.mjs DIR_COMPOSICION > apariciones.json
python3 scripts/sfx_vs_pantalla.py VIDEO.mp4 --eventos meta.json     # o --stem sfx.wav
python3 plantilla/cruce_sfx.py <video>                               # cada SFX ≤ 0,2 s de una aparición
```
Marca SFX sin nada nuevo en pantalla o solo con zoom/destello, colas largas, repetidos seguidos y nivel (cama de SFX
audible pero por debajo de la voz).

## 4. Medición y marca
- `ebur128` → −14 LUFS / ≤ −1 dBTP.
- Marca: «Kunfupay» bien escrito y pronunciado («kun-fu-péi»), cifras correctas, sistema visual de Kunfupay.
- Lista de claims de la voz para Compliance (cifras sin fuente, promesas). No se cortan: se avisan.
- README del proyecto con decisiones y pendientes. Versión ligera (< 10 MB) si hay que subirla por navegador.
