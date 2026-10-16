#!/usr/bin/env bash
# Máster a -14 LUFS integrados con picos a -1 dBTP: ganancia lineal + limitador con sobremuestreo, y verificación.
# Uso: master.sh premaster.wav master.wav
set -euo pipefail
IN="$1"; OUT="$2"
measure() { ffmpeg -hide_banner -i "$1" -af ebur128=peak=true -f null - 2>&1 | awk '/Integrated loudness/{f=1} f&&/I:/{print $2; exit}'; }
I0=$(measure "$IN")
G=$(python3 -c "print(round(-14.0 - ($I0), 2))")
# limitador a -1.6 dBFS sobre señal sobremuestreada x4 → true peak < -1 dBTP
ffmpeg -v error -y -i "$IN" -af "volume=${G}dB,aresample=192000,alimiter=limit=-1.6dB:attack=1:release=60:level=disabled,aresample=48000" -c:a pcm_f32le "$OUT.tmp.wav"
I1=$(measure "$OUT.tmp.wav"); G2=$(python3 -c "print(round(-14.0 - ($I1), 2))")
ffmpeg -v error -y -i "$IN" -af "volume=$(python3 -c "print($G + $G2)")dB,aresample=192000,alimiter=limit=-1.6dB:attack=1:release=60:level=disabled,aresample=48000" -c:a pcm_f32le "$OUT"
rm -f "$OUT.tmp.wav"
ffmpeg -hide_banner -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -A20 Summary | grep -E "I:|LRA:|Peak:"
