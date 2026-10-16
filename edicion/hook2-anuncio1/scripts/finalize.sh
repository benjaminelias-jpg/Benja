#!/usr/bin/env bash
# Une los tramos renderizados en paralelo, añade el máster de audio y verifica el resultado.
# Uso: finalize.sh <dir_tramos> <master.wav> <salida.mp4>
set -euo pipefail
DIR="$1"; AUD="$2"; OUT="$3"
ls "$DIR"/part*.mp4 | sort -V | sed "s|^|file '|; s|$|'|" > "$DIR/concat.txt"
ffmpeg -v error -y -f concat -safe 0 -i "$DIR/concat.txt" -c copy "$DIR/video.mp4"
ffmpeg -v error -y -i "$DIR/video.mp4" -i "$AUD" -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 320k -ar 48000 \
  -shortest -movflags +faststart -metadata title="Kunfupay · Classroom Platinum · Hook 2" "$OUT"
echo "== formato"
ffprobe -v error -show_entries stream=codec_name,profile,width,height,r_frame_rate,pix_fmt,color_primaries,bit_rate,sample_rate,channels:format=duration,size,bit_rate -of default=nw=1 "$OUT"
echo "== loudness (pista final)"
ffmpeg -hide_banner -i "$OUT" -map 0:a -af ebur128=peak=true -f null - 2>&1 | grep -A20 Summary | grep -E "I:|LRA:|Peak:"
