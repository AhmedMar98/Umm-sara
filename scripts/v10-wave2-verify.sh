#!/bin/bash
# V10 Wave 2 — التحقق التشغيلي الكامل (وفق قاعدة الزومبي: قتل 3100 أولاً)
set -e
cd /home/z/my-project

echo "=== 1. BUILD ==="
npm run build 2>&1 | tail -3

echo "=== 2. KILL-ZOMBIE + START-SERVER ==="
fuser -k 3100/tcp 2>/dev/null || true
sleep 1
(PORT=3100 HOSTNAME=127.0.0.1 node .next/standalone/server.js > /tmp/w2-server.log 2>&1 &)
sleep 3

echo "=== 3. ROUTES + H1 HIERARCHY ==="
for r in / /services /contact /about /cv-builder /plagiarism-check /consultation /services/university-services /services/graduate-services /services/school-services /services/statistics-and-data-analysis /services/design-and-support /services/programming-and-tech; do
  code=$(curl -s -o /tmp/pg.html -w "%{http_code}" "http://127.0.0.1:3100$r")
  h1=$(rg -o "<h1" /tmp/pg.html | wc -l)
  echo "$r => $code | h1=$h1"
done

echo "=== 4. HTML FRESHNESS ==="
bytes=$(curl -s http://127.0.0.1:3100/ | wc -c)
echo "home-bytes=$bytes (baseline=181175 | wave1=181159)"

echo "=== 5. SCREENSHOTS (typography evidence) ==="
mkdir -p download/v10-wave2
agent-browser set viewport 1920 1080
for spec in "about:01-about-h1" "cv-builder:02-cv-builder" "services:03-services-h1" "contact:04-contact-h1"; do
  route="${spec%%:*}"; name="${spec##*:}"
  agent-browser open "http://127.0.0.1:3100/$route" >/dev/null 2>&1
  sleep 2
  agent-browser screenshot --full "download/v10-wave2/${name}-1920.png" 2>&1 | tail -1
done
# جوال: تايبوغرافيا الهيرو العربي على 390
agent-browser set viewport 390 844
agent-browser open "http://127.0.0.1:3100/" >/dev/null 2>&1
sleep 3
agent-browser screenshot "download/v10-wave2/05-home-mobile-390.png" 2>&1 | tail -1
agent-browser close >/dev/null 2>&1 || true

echo "=== 6. EVIDENCE LIST ==="
ls -la download/v10-wave2/

echo "=== 7. KILL ==="
fuser -k 3100/tcp 2>/dev/null || true
echo "WAVE2-VERIFY-DONE"
