#!/usr/bin/env bash
# Extrae todos los frames de la fuente con la corrección de color aplicada, a 1188x2112 (1,1x la salida:
# deja margen para los punch-ins de hasta un 10 % sin perder nitidez).
# Uso: extract_frames.sh <video_fuente> <carpeta_salida>
set -euo pipefail
SRC="$1"; OUT="$2"; mkdir -p "$OUT"
GRADE="colorbalance=rm=0.03:gm=0.012:bm=-0.03:rh=0.015:gh=0.008:bh=-0.02,curves=master='0/0.018 0.12/0.11 0.5/0.5 0.82/0.84 1/0.98',eq=saturation=1.03"
ffmpeg -v error -y -i "$SRC" -vf "scale=1188:2112:flags=lanczos,${GRADE}" -q:v 2 -start_number 0 "$OUT/%05d.jpg"
