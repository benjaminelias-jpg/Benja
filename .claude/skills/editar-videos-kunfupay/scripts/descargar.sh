#!/bin/bash
# Uso: descargar.sh lista.txt [carpeta=assets/px]   (líneas «nombre ruta_cdn», p. ej. «swipe-a 2025/09/16/audio_x.mp3?filename=…»)
L="$1"; O="${2:-assets/px}"; mkdir -p "$O"
while read -r k p; do
  [ -z "$k" ] && continue
  [ -s "$O/$k.mp3" ] || curl -sfL -A "Mozilla/5.0 (Macintosh)" -e https://pixabay.com/ -o "$O/$k.mp3" "https://cdn.pixabay.com/download/audio/$p" || echo "FALLO $k"
  sleep 1
done < "$L"
