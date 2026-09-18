#!/bin/bash
# Resolve Pinterest short URLs and extract video/image URLs
set -u
OUT=/home/z/my-project/research/pinterest-videos
mkdir -p "$OUT"

UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

LINKS=(
  "https://pin.it/7xwYu8X6p"
  "https://pin.it/2lpH6YUAR"
  "https://pin.it/5G0spNTZ7"
)

i=1
for L in "${LINKS[@]}"; do
  echo "=== Video $i: $L ==="
  # Follow redirects, get final URL + HTML
  HTML_FILE="$OUT/pin$i.html"
  FINAL_URL=$(curl -sL -A "$UA" -o "$HTML_FILE" -w '%{url_effective}' "$L" 2>/dev/null)
  echo "Final URL: $FINAL_URL"
  echo "HTML size: $(wc -c < "$HTML_FILE" 2>/dev/null || echo 0) bytes"
  # Extract og:video / og:image meta
  echo "--- og:video tags ---"
  grep -o '<meta property="og:video[^>]*>' "$HTML_FILE" | head -5 || echo "(none)"
  echo "--- og:image tags ---"
  grep -o '<meta property="og:image[^>]*>' "$HTML_FILE" | head -3 || echo "(none)"
  echo "--- video src occurrences ---"
  grep -o 'https://v1\.pinimg\.com/videos/[^"\\ ]*' "$HTML_FILE" | sort -u | head -10 || echo "(none)"
  grep -o 'https://[^"]*\.mp4[^"]*' "$HTML_FILE" | sort -u | head -10 || echo "(no mp4)"
  echo ""
  i=$((i+1))
done
