#!/bin/bash
# التقاط نتائج image-search عبر stdout (البديل عن -o المعطوب)
set -u
OUT="/home/z/my-project/research/pinterest"
mkdir -p "$OUT"
cd /home/z/my-project

run() {
  local q="$1" f="$2"
  echo "=== $f"
  z-ai image-search -q "$q" --count 8 --gl us --no-rank > "$OUT/$f.raw.txt" 2>/dev/null
  # استخراج JSON فقط (يبدأ من أول سطر "{")
  node -e "
    const fs = require('fs');
    const raw = fs.readFileSync('$OUT/$f.raw.txt','utf8');
    const start = raw.indexOf('{');
    if (start < 0) { console.error('NO JSON'); process.exit(1); }
    const j = JSON.parse(raw.slice(start));
    fs.writeFileSync('$OUT/$f.json', JSON.stringify(j, null, 2));
    console.log('ok: ' + (j.results ? j.results.length : 0) + ' results');
  " || echo "FAILED: $f"
}

run "dark luxury website design gold emerald green accents award winning" "mood-dark-luxury"
run "modern dark UI UX interface design landing page hero section trends" "mood-uiux"
run "emerald green gold color palette elegant luxury branding" "mood-colors"
run "immersive website dark background particles glow WebGL hero" "mood-immersive"
echo "ALL DONE"
