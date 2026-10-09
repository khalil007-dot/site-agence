#!/bin/bash
# Fabrique, avec Google Chrome :
#   public/og-image.png (1200 × 630) à partir de outils/og-image.html
#   ressources/google-business/couverture.png (1600 × 900) à partir de outils/couverture-google.html
#   ressources/google-business/logo.png (720 × 720) à partir de outils/logo-google.html
cd "$(dirname "$0")/.."
chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$chrome" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1200,630 --screenshot="$PWD/public/og-image.png" "file://$PWD/outils/og-image.html"
"$chrome" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
  --window-size=1600,900 --screenshot="$PWD/ressources/google-business/couverture.png" "file://$PWD/outils/couverture-google.html"
"$chrome" --headless=new --disable-gpu --hide-scrollbars \
  --window-size=720,720 --screenshot="$PWD/ressources/google-business/logo.png" "file://$PWD/outils/logo-google.html"
