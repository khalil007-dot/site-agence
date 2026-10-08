#!/bin/bash
# Fabrique, avec Google Chrome, à partir de outils/og-image.html :
#   public/og-image.png (1200 × 630) et ressources/google-business/couverture.png (1024 × 576)
cd "$(dirname "$0")/.."
chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$chrome" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1200,630 --screenshot="$PWD/public/og-image.png" "file://$PWD/outils/og-image.html"
"$chrome" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1024,576 --screenshot="$PWD/ressources/google-business/couverture.png" "file://$PWD/outils/og-image.html"
