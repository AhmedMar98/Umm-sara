#!/bin/bash
# V10 Wave 4 — تدقيق تحميل الخطوط الفعلي + أول تحميل JS للرئيسية
set -e
cd /home/z/my-project

PID=$(ss -tlnp 2>/dev/null | rg "127.0.0.1:3100" | rg -o "pid=[0-9]+" | rg -o "[0-9]+" || true)
if [ -n "$PID" ]; then kill -9 "$PID" 2>/dev/null || true; sleep 1; fi
(PORT=3100 HOSTNAME=127.0.0.1 node .next/standalone/server.js > /tmp/w4b.log 2>&1 &)
sleep 3

echo "=== FONT-FILES-ON-DISK ==="
ls -la .next/static/media/*.woff2 | awk '{print $5, $NF}' | sort -rn | head -12
echo "disk-count=$(ls .next/static/media/*.woff2 | wc -l)"

echo ""
echo "=== ACTUAL PAGE LOAD (1920، dark) — ما يُحمّل فعلاً ==="
agent-browser set viewport 1920 1080 >/dev/null 2>&1
agent-browser open "http://127.0.0.1:3100/" >/dev/null 2>&1
sleep 5
LOAD_JS='(function(){const res=performance.getEntriesByType("resource");const fonts=res.filter(r=>r.name.includes(".woff2"));const js=res.filter(r=>r.name.endsWith(".js"));const css=res.filter(r=>r.name.endsWith(".css"));const fmt=a=>a.length+" files / "+Math.round(a.reduce((s,r)=>s+r.transferSize,0)/1024)+"KB";return JSON.stringify({fonts:fmt(fonts),fontList:fonts.map(f=>f.name.split("/").pop()),js:fmt(js),css:fmt(css),total:Math.round(res.reduce((s,r)=>s+r.transferSize,0)/1024)+"KB"})})()'
agent-browser eval "$LOAD_JS" 2>/dev/null

echo ""
echo "=== FIRST-LOAD SCRIPT TAGS (في HTML الرئيسية) ==="
curl -s http://127.0.0.1:3100/ | rg -o 'src="[^"]*\.js"' | head -12

echo ""
echo "=== 3D CHUNK lazy-check: f0438c50 في HTML الأولي؟ ==="
if curl -s http://127.0.0.1:3100/ | rg -q "f0438c509cd92ff5"; then echo "IN-INITIAL-HTML (BAD)"; else echo "NOT-IN-INITIAL (lazy ✓)"; fi

agent-browser close >/dev/null 2>&1 || true
PID=$(ss -tlnp 2>/dev/null | rg "127.0.0.1:3100" | rg -o "pid=[0-9]+" | rg -o "[0-9]+" || true)
if [ -n "$PID" ]; then kill -9 "$PID" 2>/dev/null || true; fi
echo "FONT-AUDIT-DONE"
