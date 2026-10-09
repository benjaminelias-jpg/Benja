#!/usr/bin/env bash
# Renderiza solo las esferas con fondo transparente (1080x1920, 5,8 s, entran en t=0).
# El proyecto ../esferas-overlay toma la subcomposición y los assets de este proyecto,
# así hay una sola fuente de verdad: compositions/orbs.html.
# Uso: bash tools/render-overlay.sh  →  renders/esferas-overlay-alpha.webm y .mov (QuickTime Animation)
set -euo pipefail
SRC="$(cd "$(dirname "$0")/.." && pwd)"
OVL="$SRC/../esferas-overlay"

rm -rf "$OVL/compositions" "$OVL/assets"
mkdir -p "$OVL/compositions" "$OVL/assets"
cp "$SRC/compositions/orbs.html" "$OVL/compositions/"
cp -r "$SRC/assets/fonts" "$SRC/assets/glass" "$SRC/assets/vendor" "$OVL/assets/"

cd "$OVL"
npx hyperframes check
npx hyperframes render --format webm --fps 30 -o "$SRC/renders/esferas-overlay-alpha.webm"
npx hyperframes render --format mov --fps 30 -o "$OVL/renders/esferas-overlay-alpha-prores.mov"
# QuickTime Animation: sin pérdida, con alfa y ~3x más liviano que ProRes 4444 para este contenido
ffmpeg -v error -y -i "$OVL/renders/esferas-overlay-alpha-prores.mov" -c:v qtrle -pix_fmt argb "$SRC/renders/esferas-overlay-alpha.mov"
echo "Listo: $SRC/renders/esferas-overlay-alpha.webm y esferas-overlay-alpha.mov"
