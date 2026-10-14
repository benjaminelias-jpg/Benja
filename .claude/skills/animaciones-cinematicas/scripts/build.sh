#!/usr/bin/env bash
# Pipeline completo: captura con motion blur → grano → mezcla de audio → MP4 → verificación.
#
# Uso: build.sh <proyecto> [salida.mp4] [carpeta_trabajo] [crf=26]
# Por defecto el MP4 se llama como la carpeta del proyecto y el trabajo va a <proyecto>/build.
set -euo pipefail
S="$(cd "$(dirname "$0")" && pwd)"
P="$(cd "$1" && pwd)"
OUT="${2:-$P/$(basename "$P").mp4}"
W="${3:-$P/build}"
CRF="${4:-26}"

rm -rf "$W/sub" "$W/final"
node "$S/render.cjs" "$P" "$W/sub" --workers "${WORKERS:-3}"
python3 "$S/post.py" "$W/sub" "$W/final"
rm -rf "$W/sub"
python3 "$S/mezcla_audio.py" "$P" "$W/audio"
FPS=$(python3 -c "import json;print(json.load(open('$P/build_info.json'))['fps'])")
bash "$S/codificar.sh" "$W/final" "$W/audio/audio.wav" "$OUT" "$FPS" "$CRF"
python3 "$S/hoja_contacto.py" "$W/final" "$W/hoja_contacto.png" --every 10 --cols 12 --width 160
python3 "$S/verificar_sync.py" "$OUT" "$P" "$W" || echo "AVISO: revisa la sincronía de los golpes"
echo "Listo: $OUT"
echo "Revisa: $W/hoja_contacto.png"
