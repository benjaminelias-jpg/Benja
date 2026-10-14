#!/usr/bin/env bash
# Codifica los fotogramas finales + audio en un MP4 listo para redes.
# H.264 High, BT.709 (sin desplazamiento de color), tune grain (conserva el grano), AAC 256 kbps.
# CRF 26 ≈ 1,2 MB/s con grano; 23 para un máster más pesado.
#
# Uso: codificar.sh <carpeta_fotogramas> <audio.wav> <salida.mp4> [fps=30] [crf=26]
set -euo pipefail
FR=${4:-30}
CRF=${5:-26}
ffmpeg -y -hide_banner -loglevel error -thread_queue_size 128 \
  -framerate "$FR" -i "$1/f%04d.png" -i "$2" \
  -vf "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p" \
  -c:v libx264 -preset slow -crf "$CRF" -tune grain -profile:v high \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
  -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest \
  "$3"
ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 "$3"
