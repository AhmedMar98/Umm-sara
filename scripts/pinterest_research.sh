#!/bin/bash
# بحث بصري بديل عن Pinterest: web design / ui-ux / colors / فخامة داكنة
set -u
OUT="/home/z/my-project/research/pinterest"
mkdir -p "$OUT"
cd /home/z/my-project

run() {
  local q="$1" f="$2"
  echo "=== $f: $q"
  z-ai image-search -q "$q" --count 8 --gl us --no-rank -o "$OUT/$f.json" >/dev/null 2>&1 && echo "saved: $(wc -c < "$OUT/$f.json") bytes"
}

run "dark luxury website design with gold and emerald green accents, award winning web design" "mood-dark-luxury"
run "modern dark UI UX interface design trends, landing page hero sections" "mood-uiux"
run "emerald green and gold color palette swatches, elegant branding colors" "mood-colors"
run "immersive creative agency website, particle effects dark background hero" "mood-immersive"

echo "ALL DONE"
