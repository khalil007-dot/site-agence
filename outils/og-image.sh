#!/bin/bash
# Fabrique public/og-image.png (1200 × 630) à partir de outils/og-image.html, avec Google Chrome
cd "$(dirname "$0")/.."
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1200,630 --screenshot="$PWD/public/og-image.png" "file://$PWD/outils/og-image.html"
