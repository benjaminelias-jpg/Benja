---
workflow: motion-graphics
flow: automation
storyboard: no
message: "La clave está en los detalles."
destination: instagram-reels
aspect: 1080x1920
language: es
length: 6.6s
angle: concept
---

## Intent

Segundo test del estilo limpio de `menos-pero-mejor`, ahora con un elemento real "wow" referencial al texto: si se habla de "la clave", aparece una llave dorada fotorrealista de altísima calidad, combinada con la tipografía y con transiciones.

## Assets

- assets/img/golden-key.webp — llave dorada generada con Magnific (Seedream 5 Pro, 2K) y recortada con Magnific (quitar fondo). Ver assets/index.md.
- assets/img/golden-key-shadow.webp — sombra suave derivada del alfa de la llave.
- assets/img/paper.webp — textura de papel de algodón (Magnific, Seedream 5 Pro), procesada.
- audio/src/ — música y efectos generados con Magnific (ver assets/index.md).

## Customizations

- v3 ("hazlo bien, cambia por completo la sonorización, la animación muchísimo mejor"):
  - Música real (Google Lyria 3 vía Magnific: piano, contrabajo, percusión ligera). La animación está cortada a sus golpes de bajo: impacto de la llave en 0.665 s, cambio de plano en 3.115 s, destello en 5.665 s.
  - Foley real (ElevenLabs SFX vía Magnific) editado: swish del lanzamiento, clink al chocar con el papel, roce de papel al frenar, swell + aire en el cambio de plano, tink lejano. La música baja 3.5 dB bajo los sonidos protagonistas.
  - La llave se lanza sobre el papel: vuela girando con desenfoque de movimiento en la dirección del vuelo, su altura se lee en la escala y en la sombra (se aleja y suaviza en el aire, se pega al tocar), choca en el golpe de la música y se desliza hasta frenar.
  - Papel de algodón real (textura generada y procesada a 2 niveles) para que se sienta la cámara.
  - "La clave" sale palabra por palabra desde detrás de la llave; en el cambio de plano la cámara se eleva (la llave y "La clave" se achican, suben, pierden brillo y se desenfocan) y "está en los detalles." llega palabra por palabra en primer plano, más cerca del lente (paralaje).

## Notes

- Reglas de `motion-estetico`: fondo papel liso, una fuente, sin subtítulos, sin textos en esquinas, sin HUD.
