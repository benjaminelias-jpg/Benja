#!/bin/bash
# Hoja de QA: fotogramas completos en los momentos indicados. Uso: hoja.sh <video> t1 t2 ...
cd "$(dirname "$0")/.."; V=$1; shift; F=renders/kunfupay-hub-$V.mp4; mkdir -p qa/$V; rm -f qa/$V/h*.png; i=0
for t in "$@"; do ffmpeg -v error -y -ss $t -i $F -frames:v 1 -vf "scale=300:-1,drawtext=text='$t':x=6:y=6:fontsize=20:fontcolor=yellow:fontfile=/System/Library/Fonts/Supplemental/Arial.ttf" qa/$V/h$(printf %02d $i).png; i=$((i+1)); done
ffmpeg -v error -y -i "qa/$V/h%02d.png" -vf "tile=7x2" -frames:v 1 qa/$V/hoja-final.jpg
