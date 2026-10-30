#!/usr/bin/env bash
# Post-proceso del estilo Ramiro: ojo de pez de lente + recorte 88 % + negros levemente hundidos.
# Uso: bash postproceso.sh render/base.mp4 render/final.mp4
set -euo pipefail
in="$1"; out="$2"
ffmpeg -loglevel error -y -i "$in" \
  -vf "lenscorrection=k1=0.10:k2=0.02:i=bilinear,crop=iw*0.88:ih*0.88,scale=1080:1920:flags=lanczos,curves=all='0/0.025 0.5/0.48 1/0.96'" \
  -c:v libx264 -crf 16 -pix_fmt yuv420p "$out"
echo "OK → $out"
