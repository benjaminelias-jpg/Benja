#!/bin/bash
# Recorte de la persona (alfa) de cada vídeo completo, para poner las infografías DETRÁS del sujeto.
cd "$(dirname "$0")/.."
for v in "$@"; do
  [ -s $v/assets/matte/persona.webm ] && continue
  ( cd $v && npx hyperframes remove-background assets/video.mp4 -o assets/matte/persona.webm --quality best </dev/null > matte.log 2>&1 ) && echo "$v ok" || echo "$v FALLO"
done
