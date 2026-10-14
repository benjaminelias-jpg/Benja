#!/usr/bin/env bash
# Crea un proyecto nuevo a partir de una plantilla.
#
# Uso: nuevo_proyecto.sh <plantilla> <carpeta_destino>
#   plantillas: sistema-tarjetas | tarjeta-seccion
#
# Copia el motor (index.html), un config.js y un audio.json de ejemplo y las fuentes.
# Después: edita config.js (contenido) y, si hace falta, audio.json (sonidos).
set -euo pipefail
SKILL="$(cd "$(dirname "$0")/.." && pwd)"
TPL="$SKILL/templates/$1"
DST="$2"
[ -d "$TPL" ] || { echo "No existe la plantilla '$1'. Disponibles: $(ls "$SKILL/templates" | tr '\n' ' ')"; exit 1; }
[ -e "$DST/index.html" ] && { echo "Ya hay un proyecto en $DST"; exit 1; }
mkdir -p "$DST/assets/fonts" "$DST/assets/img"
cp "$TPL/index.html" "$TPL/config.js" "$TPL/audio.json" "$DST/"
[ -d "$TPL/assets/img" ] && cp "$TPL"/assets/img/* "$DST/assets/img/" 2>/dev/null || true
cp "$SKILL"/assets/fonts/* "$DST/assets/fonts/"
printf 'build/\n' > "$DST/.gitignore"
echo "Proyecto creado en $DST (plantilla: $1)"
echo "Siguiente: edita $DST/config.js y lanza:  $SKILL/scripts/build.sh $DST"
