#!/usr/bin/env bash
# Hojas de fotogramas de un reel para leer su gancho y sus subtítulos, y portada.
#   bash hoja.sh <video.mp4> <dir_salida>
# Genera: hook.jpg (primeros 8 s a 2 fps), subs.jpg (1 fotograma cada 1,5 s) y portada.jpg (0,6 s).
set -euo pipefail
V="$1"; O="$2"; mkdir -p "$O"
ffprobe -v error -show_entries stream=width,height -show_entries format=duration -of default=nw=1 "$V"
ffmpeg -loglevel error -y -t 8 -i "$V" -vf "fps=2,scale=360:-1,crop=360:232:0:ih-232,tile=4x4" -frames:v 1 "$O/hook.jpg"
ffmpeg -loglevel error -y -i "$V" -vf "fps=1/1.5,scale=300:-1,crop=300:167:0:ih-200,tile=6x8" -frames:v 1 "$O/subs.jpg"
ffmpeg -loglevel error -y -ss 0.6 -i "$V" -frames:v 1 -q:v 2 "$O/portada.jpg"
echo "Listo: $O/hook.jpg $O/subs.jpg $O/portada.jpg"
