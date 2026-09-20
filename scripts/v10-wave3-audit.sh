#!/bin/bash
# V10 Wave 3 — تدقيق الاستجابة الموضوعي: تجاوز أفقي + أهداف لمس + لقطات
set -e
cd /home/z/my-project

echo "=== 0. KILL-ZOMBIE-BY-PID (القاعدة المحدثة) ==="
PID=$(ss -tlnp 2>/dev/null | rg "127.0.0.1:3100" | rg -o "pid=[0-9]+" | rg -o "[0-9]+" || true)
if [ -n "$PID" ]; then kill -9 "$PID" 2>/dev/null || true; sleep 1; fi
ss -tlnp 2>/dev/null | rg 3100 && echo "STILL-LISTENING" || echo "PORT-FREE"

echo "=== 1. START-SERVER ==="
(PORT=3100 HOSTNAME=127.0.0.1 node .next/standalone/server.js > /tmp/w3-server.log 2>&1 &)
sleep 3

OVERFLOW_JS='JSON.stringify({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,off:[...document.querySelectorAll("body *")].filter(e=>{const r=e.getBoundingClientRect();return (r.right>window.innerWidth+1||r.left<-1)&&r.width>0&&r.height>0&&getComputedStyle(e).position!=="fixed"}).slice(0,6).map(e=>e.tagName+"|"+String(e.className).slice(0,70))})'
TOUCH_JS='JSON.stringify([...document.querySelectorAll("a,button,[role=button],input,select,textarea")].map(e=>{const r=e.getBoundingClientRect();return{t:e.tagName,w:Math.round(r.width),h:Math.round(r.height),x:(e.textContent||"").trim().slice(0,22)}}).filter(x=>x.w>0&&(x.h<44||x.w<44)).slice(0,18))'

check_overflow () {  # $1=route $2=label
  agent-browser open "http://127.0.0.1:3100$1" >/dev/null 2>&1
  sleep 2
  echo "--- $2 $1 ---"
  agent-browser eval "$OVERFLOW_JS" 2>/dev/null | head -3
}

check_touch () {  # $1=route
  agent-browser open "http://127.0.0.1:3100$1" >/dev/null 2>&1
  sleep 2
  echo "--- TOUCH $1 ---"
  agent-browser eval "$TOUCH_JS" 2>/dev/null | head -3
}

echo "=== 2. MOBILE 390 — OVERFLOW AUDIT (8 routes) ==="
agent-browser set viewport 390 844
for r in / /services /about /cv-builder /plagiarism-check /consultation /contact /services/university-services; do
  check_overflow "$r" "M390"
done

echo "=== 3. TABLET 768 — OVERFLOW (2) ==="
agent-browser set viewport 768 1024
check_overflow "/" "T768"
check_overflow "/services" "T768"

echo "=== 4. DESKTOP 1920 — OVERFLOW (2) ==="
agent-browser set viewport 1920 1080
check_overflow "/" "D1920"
check_overflow "/cv-builder" "D1920"

echo "=== 5. TOUCH TARGETS 390 (3 routes) ==="
agent-browser set viewport 390 844
for r in / /services /services/university-services; do
  check_touch "$r"
done

echo "=== 6. SCREENSHOTS ==="
mkdir -p download/v10-wave3
agent-browser set viewport 390 844
agent-browser open "http://127.0.0.1:3100/services" >/dev/null 2>&1; sleep 2
agent-browser screenshot --full "download/v10-wave3/01-services-mobile-390.png" 2>&1 | tail -1
agent-browser open "http://127.0.0.1:3100/cv-builder" >/dev/null 2>&1; sleep 3
agent-browser screenshot --full "download/v10-wave3/02-cv-builder-mobile-390.png" 2>&1 | tail -1
agent-browser set viewport 768 1024
agent-browser open "http://127.0.0.1:3100/" >/dev/null 2>&1; sleep 3
agent-browser screenshot "download/v10-wave3/03-home-tablet-768.png" 2>&1 | tail -1
agent-browser close >/dev/null 2>&1 || true

echo "=== 7. KILL-BY-PID ==="
PID=$(ss -tlnp 2>/dev/null | rg "127.0.0.1:3100" | rg -o "pid=[0-9]+" | rg -o "[0-9]+" || true)
if [ -n "$PID" ]; then kill -9 "$PID" 2>/dev/null || true; fi
ls -la download/v10-wave3/
echo "WAVE3-AUDIT-DONE"
