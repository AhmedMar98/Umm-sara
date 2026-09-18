#!/bin/bash
# Resolve the 3 NEW Pinterest pins (logo ref, product display ref, logo motion ref)
set -u
OUT=/home/z/my-project/research/pinterest-new
mkdir -p "$OUT"

UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

declare -A LINKS=(
  ["logo_ref"]="https://pin.it/4k7LcJ1h0"
  ["product_ref"]="https://pin.it/AR2pJcA08"
  ["logo_motion"]="https://pin.it/5kHG01ix5"
)

for KEY in logo_ref product_ref logo_motion; do
  L="${LINKS[$KEY]}"
  echo "=== $KEY: $L ==="
  HTML_FILE="$OUT/$KEY.html"
  FINAL_URL=$(curl -sL -A "$UA" -o "$HTML_FILE" -w '%{url_effective}' "$L" 2>/dev/null)
  echo "Final URL: $FINAL_URL"
  echo "HTML size: $(wc -c < "$HTML_FILE" 2>/dev/null || echo 0) bytes"
  echo "--- og:title ---"
  grep -o '<meta property="og:title[^>]*>' "$HTML_FILE" | head -2 || echo "(none)"
  echo "--- og:description ---"
  grep -o '<meta property="og:description[^>]*>' "$HTML_FILE" | head -2 || echo "(none)"
  echo "--- og:video tags ---"
  grep -o '<meta property="og:video[^>]*>' "$HTML_FILE" | head -5 || echo "(none)"
  echo "--- og:image tags ---"
  grep -o '<meta property="og:image[^>]*>' "$HTML_FILE" | head -3 || echo "(none)"
  echo "--- video src occurrences ---"
  grep -o 'https://v1\.pinimg\.com/videos/[^"\\ ]*' "$HTML_FILE" | sort -u | head -10 || echo "(none)"
  grep -o 'https://i\.pinimg\.com/originals/[^"\\ ]*' "$HTML_FILE" | sort -u | head -10 || echo "(no original img)"
  echo ""
done
