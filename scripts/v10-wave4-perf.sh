#!/bin/bash
# V10 Wave 4 — قياس ميزانية الأداء الكاملة (بناء + أصول + تشغيل)
set -e
cd /home/z/my-project

echo "=== 1. BUILD (موقوت) ==="
BUILD_START=$(date +%s.%N)
npm run build > /tmp/w4-build.log 2>&1
BUILD_END=$(date +%s.%N)
BUILD_SEC=$(awk "BEGIN {print $BUILD_END - $BUILD_START}")
echo "build-seconds=$BUILD_SEC"

echo "=== 2. ROUTE TABLE (أحجام first-load من الإخراج) ==="
rg " kB │| First Load" /tmp/w4-build.log | head -22 || rg "kB" /tmp/w4-build.log | head -22

echo "=== 3. STATIC ASSETS ==="
JS_COUNT=$(du -ak .next/static/chunks 2>/dev/null | wc -l)
JS_TOTAL=$(du -sh .next/static/chunks 2>/dev/null | cut -f1)
CSS_TOTAL=$(du -sh .next/static/css 2>/dev/null | cut -f1)
echo "chunks-count=$JS_COUNT chunks-total=$JS_TOTAL css-total=$CSS_TOTAL"

echo "--- أكبر 8 chunks ---"
du -ak .next/static/chunks/*.js 2>/dev/null | sort -rn | head -8

echo "=== 4. FONTS (قرار v3: ≤11 ملفاً) ==="
FONT_COUNT=$(ls .next/static/media/*.woff2 2>/dev/null | wc -l)
FONT_SIZE=$(du -sh .next/static/media 2>/dev/null | cut -f1)
echo "font-files=$FONT_COUNT font-total=$FONT_SIZE"

echo "=== 5. RUNTIME TTFB (13 مساراً) ==="
PID=$(ss -tlnp 2>/dev/null | rg "127.0.0.1:3100" | rg -o "pid=[0-9]+" | rg -o "[0-9]+" || true)
if [ -n "$PID" ]; then kill -9 "$PID" 2>/dev/null || true; sleep 1; fi
(PORT=3100 HOSTNAME=127.0.0.1 node .next/standalone/server.js > /tmp/w4-server.log 2>&1 &)
sleep 3
for r in / /services /cv-builder /plagiarism-check /about /contact /consultation /services/university-services; do
  R=$(curl -s -o /dev/null -w "%{http_code} %{time_total}s %{size_download}B" "http://127.0.0.1:3100$r")
  echo "$r => $R"
done

echo "=== 6. 3D-CHUNK SPLIT (إلزامي: المشهد منفصل lazy) ==="
rg -l "uEmerald" .next/static/chunks/*.js 2>/dev/null | head -2 || echo "shader-chunk: NOT-FOUND"
rg -c "three" .next/static/chunks/*.js 2>/dev/null | head -3

echo "=== 7. GZIP REPRESENTATIVE ==="
GZ=$(gzip -c .next/server/app/index.html 2>/dev/null | wc -c)
echo "home-html-gzip=${GZ}B (raw=$(stat -c%s .next/server/app/index.html 2>/dev/null || echo 0)B)"

PID=$(ss -tlnp 2>/dev/null | rg "127.0.0.1:3100" | rg -o "pid=[0-9]+" | rg -o "[0-9]+" || true)
if [ -n "$PID" ]; then kill -9 "$PID" 2>/dev/null || true; fi
echo "WAVE4-MEASUREMENT-DONE"
