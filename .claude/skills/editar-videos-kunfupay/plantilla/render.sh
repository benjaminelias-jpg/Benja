#!/bin/bash
# Uso: scripts/render.sh <video> → build.py → hyperframes render (espera a que no haya otro render) → final.py
cd "$(dirname "$0")/.."; V=$1; python3 scripts/build.py $V >/dev/null || exit 1
for i in 1 2 3; do
  while pgrep -f "hyperframes(\.js)? render" >/dev/null; do python3 -c "import time; time.sleep(10)"; done
  ( cd $V && npx hyperframes render --fps 30 --quality delivery --output renders/hf.mp4 > render.log 2>&1 ) && break
  grep -qi "sigterm" $V/render.log || { tail -20 $V/render.log; exit 1; }
  echo "render cancelado, reintento $i"
done
[ -f scripts/final.py ] && python3 scripts/final.py $V
