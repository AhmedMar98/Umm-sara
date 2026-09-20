#!/bin/bash
# V10 Wave 3 — المسبار الجنائي للتجاوز الأفقي الحقيقي + اختبار قائمة الجوال
set -e
cd /home/z/my-project

PID=$(ss -tlnp 2>/dev/null | rg "127.0.0.1:3100" | rg -o "pid=[0-9]+" | rg -o "[0-9]+" || true)
if [ -n "$PID" ]; then kill -9 "$PID" 2>/dev/null || true; sleep 1; fi
(PORT=3100 HOSTNAME=127.0.0.1 node .next/standalone/server.js > /tmp/w3b.log 2>&1 &)
sleep 3

REAL_JS='(function(){const vw=window.innerWidth;const bad=[];for(const e of document.querySelectorAll("body *")){const r=e.getBoundingClientRect();if(r.width===0||r.height===0)continue;if(r.right<=vw+1&&r.left>=-1)continue;let p=e.parentElement,clipped=false;while(p&&p!==document.body.parentElement){const s=getComputedStyle(p);if((s.overflow+s.overflowX).includes("hidden")||(s.overflow+s.overflowX).includes("clip")){clipped=true;break;}p=p.parentElement;}if(!clipped)bad.push(e.tagName+"|"+String(e.className).slice(0,80));}return JSON.stringify({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,real:bad.slice(0,8)})})()'

echo "=== REAL-OVERFLOW 390 home ==="
agent-browser set viewport 390 844
agent-browser open "http://127.0.0.1:3100/" >/dev/null 2>&1
sleep 3
agent-browser eval "$REAL_JS" 2>/dev/null

echo ""
echo "=== MOBILE-MENU FUNCTIONAL TEST ==="
agent-browser open "http://127.0.0.1:3100/" >/dev/null 2>&1
sleep 2
MENU_JS='(function(){const btns=[...document.querySelectorAll("button")].filter(b=>b.getAttribute("aria-label")||b.querySelector("svg"));const menu=[...document.querySelectorAll('[role="dialog"],[data-state="open"]')].length;return JSON.stringify({iconButtons:btns.slice(0,6).map(b=>(b.getAttribute("aria-label")||"svg-btn")+"["+(b.getBoundingClientRect().width)+"x"+(b.getBoundingClientRect().height)+"]"),openDialogs:menu})})()'
agent-browser eval "$MENU_JS" 2>/dev/null | head -2
# انقر زر القائمة (آخر أزرار الأيقونات عادة)
agent-browser click "button[aria-label]" 2>&1 | tail -1 || true
sleep 1.5
MENU_AFTER='(function(){const d=document.querySelector('[role="dialog"]');return JSON.stringify({menuOpen:!!d,linksInMenu:d?d.querySelectorAll("a").length:0})})()'
agent-browser eval "$MENU_AFTER" 2>/dev/null | head -2
agent-browser screenshot "download/v10-wave3/04-mobile-menu-open-390.png" 2>&1 | tail -1
agent-browser press Escape 2>/dev/null || true

PID=$(ss -tlnp 2>/dev/null | rg "127.0.0.1:3100" | rg -o "pid=[0-9]+" | rg -o "[0-9]+" || true)
if [ -n "$PID" ]; then kill -9 "$PID" 2>/dev/null || true; fi
echo "PROBE-DONE"
