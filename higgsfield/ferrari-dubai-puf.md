# Reel "Ferrari en Dubái + puf" — cómo se hizo en Higgsfield

Guion (tu voz original, sin cambios): **"No necesitas ni un Rolex, ni un coche de estos, para vender más."**
Final: el Ferrari desaparece de golpe, te quedas ~0,5 s sentado en el aire y caes al asfalto.

Video final: 7,6 s · 1080x1920 · 24 fps · -14 LUFS. Está en tu biblioteca de Higgsfield (media `f3d7eeab-0abc-4f44-a891-c1a28371384a`).

## 1. Corte base (antes de Higgsfield)

- Primer plano `IMG_7996` completo (0,0–1,8 s): "No necesitas ni un Rolex".
- Plano abierto `IMG_7995` desde 1,57 s hasta el final: "ni un coche de estos para vender más".
- Unidos a 1080x1920, 30 fps → `source_cut.mp4` (5,43 s).

## 2. Video base — Gemini Omni Flash 1.1 (modo `edit`, 1080p, 9:16)

Job `8d331d73-bd67-4050-b5ed-74d89fdb2da3`. Este modo solo acepta el video (sin imágenes de referencia).

```text
Video edit. Keep this clip exactly as it is: the same two shots and the cut at 1.8s, the same static camera, framing and composition, and above all the same young man: identical face, facial features, skin, curly dark hair, expressions, eye and mouth movements (lip-sync), head and hand movements, body pose, light blue striped shirt, jeans and timing. Do not beautify, replace or re-cast him. Change only the environment, add a car and change the watch.
1. Close-up shot (0.0-1.8s): replace the green screen and the stool with a real scene: he sits in the driver's seat of a glossy Rosso Corsa red Ferrari SF90 Spider convertible (roof down, tan leather interior; the top of the red door and the tan seat visible around him), Downtown Dubai behind him with the Burj Khalifa, glass towers and palm trees, deep blue sky, softly out of focus.
2. Wide shot (1.8s-end): replace the green screen, curtain, wooden floor, cable and black chair with a Dubai boulevard on a clear day (Burj Khalifa, glass towers, palm trees behind) and put him in the driver's seat of the same red Ferrari SF90 Spider seen in side profile, completely still on the asphalt: his fists on a black steering wheel, the red door and bodywork in front of his hips and legs, the front of the car extending out of frame to the left, the rear wheel on the right.
3. Whole clip: his square silver watch becomes an 18k yellow-gold Rolex Day-Date with champagne dial, fluted bezel and gold President bracelet, on the same left wrist, following every wrist movement.
4. Whole clip: bright warm late-afternoon Dubai sunlight on him and the car, glossy reflections on the paint, no green spill or green tint on skin, hair or shirt.
Ultra-realistic, bright, high-end luxury commercial look, sharp detail, natural skin texture, real footage, not CGI. Everything else (his performance, the camera, the cut and all timing) stays exactly the same.
```

## 3. Último cuadro sin el Ferrari — Nano Banana 2.1 (2k, 9:16, thinking `high`)

Entrada: último cuadro del video de Gemini. Job `50dbd39f-a608-4083-9ac7-5bfad1fc710d`. Después se alineó y se le devolvieron los píxeles originales del cielo y los edificios, para que al desaparecer el coche no cambie nada más.

```text
Edit this photo. Make the red Ferrari vanish completely: remove the whole car including its body, the open door, the seats, the steering wheel, the dashboard, the windshield frame, the wheels and the car's shadow on the road. Keep EVERYTHING else exactly identical: the same camera, framing and crop, the same background (Burj Khalifa, skyscrapers, palm trees, street lamps, hedge, buildings, road, sky) and the same lighting and colors.
Keep the young man exactly as he is, at exactly the same position and size in the frame, with exactly the same face, hair, expression (looking down), light blue striped shirt and the same pose: sitting in the air with nothing under him, torso slightly reclined as if still leaning on the seat back, both hands still raised in front of his chest gripping an invisible steering wheel (now holding nothing), knees bent and legs stretched forward exactly as they were inside the car. His full legs are now visible: blue jeans and beige suede loafers, hanging in mid-air about 40 cm above the asphalt.
Where the car was, show the empty asphalt road continuing naturally (same texture, lane markings, curb and hedge), with only the man's own soft shadow on the road under him. Remove the wristwatch from his wrist (bare wrist).
Photorealistic, identical photo quality, natural sunlight, no smoke, no motion blur, no extra objects or people.
```

## 4. Flotar y caer — Kling 3.0 (`pro`, 3 s, 9:16, sin sonido)

Imagen inicial: el cuadro sin Ferrari. Job elegido `3e24aa56-b27a-4b2e-8b81-3e1f59b7bdb4`. Con 3 s el modelo cae a los ~1,5 s; con 5 s flotaba ~3 s.

```text
Static locked-off camera, no camera movement, one continuous shot. The young man is suspended in mid-air in a seated driving pose above the empty asphalt road, hands holding an invisible steering wheel. After only a split second (half a second) of hanging in the air, gravity kicks in and he immediately drops straight down, landing hard on his butt on the asphalt; his legs bounce up, his hands slap the ground behind him, and he stays sitting on the road, stunned. Same young man, same face and curly dark hair, light blue striped shirt, blue jeans and beige loafers. Same Dubai street with the Burj Khalifa behind, bright warm late-afternoon sunlight. Ultra-realistic real footage, real gravity, fast natural fall with motion blur, no other people, no cars.
```

## 5. Montaje final (ffmpeg)

- 0–5,5 s: video de Gemini tal cual.
- 5,5 s: corte seco al cuadro sin Ferrari → el coche y el reloj desaparecen al instante, sin humo.
- Flotación acelerada suavemente (1x → ~4x → 1x) para que dure ~0,5 s, y caída a velocidad normal.
- Audio: **tu grabación original**. Gemini había corrido la voz +43 ms y alargado ~0,29 s la pausa antes de "para vender más" (los labios siguen ese ritmo). Se reconstruyó el mismo ritmo con las muestras originales, sin regenerar la voz.
- Golpe suave sintético al tocar el piso (6,2 s). También hay una versión sin golpe.
- Volumen normalizado a -14 LUFS (estándar de Reels/TikTok).

## Pruebas descartadas

- Kling 3.0 Omni Edit sobre el mismo corte (job `db3a1a7e-3b56-4a09-8665-c8178b15123a`): conserva muy bien la cara, pero elegiste la versión de Gemini.
- Kling 4.0 edit: estiró el video a 10 s y puso el coche detrás de las piernas.
- Veo 3.1 desde el último cuadro: el coche se desvanece, pero caes al instante y después saltas.
- Variantes de Kling de 5 s: flotaban ~3 s antes de caer.
