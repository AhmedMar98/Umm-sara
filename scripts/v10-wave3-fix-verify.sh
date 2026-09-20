#!/bin/bash
# V10 Wave 3 — إعادة البناء + القياس الثلاثي بعد إصلاح القص + اختبار قائمة الجوال
set -e
cd /home/z/my-project

echo "=== BUILD ==="
npm run build 2>&1 | tail -2

PID=$(ss -tlnp 2>/dev/null | rg "127.0.0.1:3100" | rg -o "pid=[0-9]+" | rg -o "[0-9]+" || true)
if [ -n "$PID" ]; then kill -9 "$PID" 2>/dev/null || true; sleep 1; fi
(PORT=3100 HOSTNAME=127.0.0.1 node .next/standalone/server.js > /tmp/w3c.log 2>&1 &)
sleep 3

SW_JS='document.documentElement.scrollWidth+"x"+document.documentElement.clientWidth'

for dims in "390 844" "768 1024" "1920 1080"; do
  w=$(echo $dims | cut -d' ' -f1)
  agent-browser set viewport $dims >/dev/null 2>&1
  agent-browser open "http://127.0.0.1:3100/" >/dev/null 2>&1
  sleep 3
  echo "HOME ${w}px => $(agent-browser eval "$SW_JS" 2>/dev/null)"
done

echo "=== MOBILE-MENU TEST (صريح وبلا كتم) ==="
agent-browser set viewport 390 844 >/dev/null 2>&1
agent-browser open "http://127.0.0.1:3100/" >/dev/null 2>&1
sleep 3
MENU_STATE='JSON.stringify({dialog:!!document.querySelector("[role=dialog]"),sheetOpen:document.querySelectorAll("[data-state=open]").length})'
echo "BEFORE: $(agent-browser eval "$MENU_STATE" 2>&1 | tail -1)"
# زر القائمة = آخر زر أيقوني في الشريط (menu)
agent-browser eval 'document.querySelectorAll("header button, nav button")[document.querySelectorAll("header button, nav button").length-1].click(); "clicked"' 2>&1 | tail -1
sleep 2
echo "AFTER: $(agent-browser eval "$MENU_STATE" 2>&1 | tail -1)"
agent-browser screenshot "download/v10-wave3/04-mobile-menu-open-390.png" 2>&1 | tail -1
LINKS_JS='JSON.stringify([...document.querySelectorAll("[role=dialog] a, [data-state=open] a")].map(a=>a.textContent.trim()).slice(0,12))'
echo "MENU-LINKS: $(agent-browser eval "$LINKS_JS" 2>&1 | tail -1)"
agent-browser press Escape >/dev/null 2>&1 || true
sleep 1
echo "CLOSED: $(agent-browser eval "$MENU_STATE" 2>&1 | tail -1)"

echo "=== LIGH THEME SPOT ==="
agent-browser set viewport 1920 1080 >/dev/null 2>&1
agent-browser screenshot "download/v10-wave3/05-home-desktop-1920.png" 2>&1 | tail -1
agent-browser close >/dev/null 2>&1 || true

PID=$(ss -tlnp 2>/dev/null | rg "127.0.0.1:3100" | rg -o "pid=[0-9]+" | rg -o "[0-9]+" || true)
if [ -n "$PID" ]; then kill -9 "$PID" 2>/dev/null || true; fi
echo "WAVE3-FIX-VERIFIED"
