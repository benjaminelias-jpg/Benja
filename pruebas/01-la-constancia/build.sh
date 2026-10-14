#!/usr/bin/env bash
# Render completo de "01 · LA CONSTANCIA":
# fotogramas (Chromium) → motion blur + grano → audio → MP4 H.264 + AAC
#
# Requisitos: Node con Playwright y Chromium, Python 3 con numpy, scipy y Pillow, ffmpeg.
# Uso: ./build.sh [carpeta_de_trabajo]
set -euo pipefail
cd "$(dirname "$0")"
W=${1:-build}

NODE_PATH=$(npm root -g) node render.cjs "$W/sub"
python3 post.py "$W/sub" "$W/final"
python3 audio.py "$W/audio"

ffmpeg -y -hide_banner -loglevel warning \
  -framerate 30 -i "$W/final/f%04d.png" -i "$W/audio/audio.wav" \
  -vf "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p" \
  -c:v libx264 -preset slow -crf 14 -tune grain -profile:v high \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
  -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest \
  01-la-constancia.mp4

echo "Listo: 01-la-constancia.mp4"
