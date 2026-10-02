#!/usr/bin/env bash
# Sintetiza los SFX limpios (sin ruido de fondo, sin reverb):
#  - entrada-1/2/3: "pop" de vidrio estilo iOS, cuerpo corto + "tink" que sube de tono (Do6, Re6, Mi6)
#  - salida: "swoosh" suave de ruido rosa con filtro pasabanda que baja de 3,5 kHz a 0,9 kHz
# Uso: bash tools/make-sfx.sh
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p assets/sfx
SR=48000

normalize() { # $1 entrada, $2 salida, $3 pico objetivo en dBFS
  local peak
  peak=$(ffmpeg -v info -i "$1" -af volumedetect -f null - 2>&1 | sed -n 's/.*max_volume: \(-\?[0-9.]*\) dB.*/\1/p')
  local gain
  gain=$(awk -v p="$peak" -v t="$3" 'BEGIN{printf "%.2f", t-p}')
  ffmpeg -v error -y -i "$1" -af "volume=${gain}dB" -c:a pcm_s16le "$2"
  rm -f "$1"
}

pop() { # $1 = frecuencia del tink, $2 = archivo
  local F=$1
  local body="0.55*sin(2*PI*(380*t+(620-380)*0.01*(1-exp(-t/0.01))))*exp(-t/0.03)"
  local tink="0.35*sin(2*PI*${F}*t)*exp(-t/0.06)+0.12*sin(2*PI*2*${F}*t)*exp(-t/0.035)+0.07*sin(2*PI*2.76*${F}*t)*exp(-t/0.025)+0.025*sin(2*PI*5.4*${F}*t)*exp(-t/0.012)"
  ffmpeg -v error -y -f lavfi -i "aevalsrc=exprs='(1-exp(-t/0.002))*(${body}+${tink})':s=${SR}:d=0.26" \
    -af "highpass=f=120,afade=t=out:st=0.18:d=0.08:curve=qsin,aformat=channel_layouts=stereo" \
    -ar ${SR} -c:a pcm_f32le "$2.raw.wav"
  normalize "$2.raw.wav" "$2" -3
}

pop 1046.50 assets/sfx/entrada-1.wav
pop 1174.66 assets/sfx/entrada-2.wav
pop 1318.51 assets/sfx/entrada-3.wav

# Swoosh: barrido del pasabanda vía asendcmd cada 10 ms
CMDS=""
for i in $(seq 0 32); do
  t=$(awk -v i="$i" 'BEGIN{printf "%.2f", i*0.01}')
  f=$(awk -v i="$i" 'BEGIN{x=i/32; printf "%.0f", 3500*exp(log(900/3500)*x)}')
  CMDS="${CMDS}${t} bandpass f ${f};"
done
ffmpeg -v error -y -f lavfi -i "anoisesrc=color=pink:seed=7:sample_rate=${SR}:duration=0.34:amplitude=0.8" \
  -af "asendcmd=c='${CMDS}',bandpass=f=3500:width_type=q:w=1.1,highpass=f=200,afade=t=in:d=0.12:curve=qsin,afade=t=out:st=0.12:d=0.22:curve=qsin,aformat=channel_layouts=stereo" \
  -ar ${SR} -c:a pcm_f32le assets/sfx/salida.raw.wav
normalize assets/sfx/salida.raw.wav assets/sfx/salida.wav -6

for f in assets/sfx/*.wav; do
  printf "%-26s %ss  " "$f" "$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")"
  ffmpeg -v info -i "$f" -af astats=measure_overall=Peak_level+RMS_level:measure_perchannel=none -f null - 2>&1 | grep -E "Peak level|RMS level" | tr -s ' ' | tr '\n' ' '
  echo
done
