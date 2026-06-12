#!/usr/bin/env bash
# Rend les 10 slides du deck éditorial KOBO (composition KoboDeck) en PNG 1920x1080,
# une image par slide, dans out/deck_png/slide-NN.png.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out/deck_png
# 30 frames par slide -> on capture le milieu de chaque slide (frame i*30 + 15)
for i in $(seq 0 9); do
  frame=$(( i * 30 + 15 ))
  n=$(printf "%02d" $(( i + 1 )))
  echo "→ slide $n (frame $frame)"
  npx remotion still src/kobo/index.ts KoboDeck "out/deck_png/slide-$n.png" --frame="$frame"
done
echo "OK — slides dans out/deck_png/"
