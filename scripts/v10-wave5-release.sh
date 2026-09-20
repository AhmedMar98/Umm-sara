#!/bin/bash
# V10 Wave 5 — التحقق النهائي لإطلاق V10 (بوابة الخروج)
set -e
cd /home/z/my-project
mkdir -p download/v10-release

echo "=== 1. BUILD ==="
npm run build 2>&1 | tail -2

echo "=== 2. SERVER (قتل بالمعرف أولاً) ==="
PID=$(ss -tlnp 2>/dev/null | rg "127.0.0.1:3100" | rg -o "pid=[0-9]+" | rg -o "[0-9]+" || true)
if [ -n "$PID" ]; then kill -9 "$PID" 2>/dev/null || true; sleep 1; fi
(PORT=3100 HOSTNAME=127.0.0.1 node .next/standalone/server.js > /tmp/w5-server.log 2>&1 &)
sleep 3

echo "=== 3. ALL 13 ROUTES ==="
PASS=0
for r in / /services /services/university-services /services/graduate-services /services/school-services /services/statistics-and-data-analysis /services/design-and-support /services/programming-and-tech /cv-builder /plagiarism-check /about /contact /consultation; do
  R=$(curl -s -o /tmp/pg.html -w "%{http_code}" "http://127.0.0.1:3100$r")
  H1=$(rg -o "<h1" /tmp/pg.html | wc -l)
  echo "$r => $R | h1=$H1"
  [ "$R" = "200" ] && [ "$H1" = "1" ] && PASS=$((PASS+1))
done
echo "ROUTES-PASS=$PASS/13"

echo "=== 4. IDENTITY MARKERS (HTML المُخدَّم) ==="
curl -s http://127.0.0.1:3100/ -o /tmp/home.html
SARA=$(rg -o "أم سارة" /tmp/home.html | wc -l)
PEARL=$(rg -o "pearl" /tmp/home.html | wc -l)
RTL=$(rg -c 'dir="rtl"' /tmp/home.html || echo 0)
BYTES=$(wc -c < /tmp/home.html)
echo "أم-سارة=$SARA | pearl=$PEARL | rtl=$RTL | bytes=$BYTES (baseline 181175 / wave1 181159)"

echo "=== 5. IDENTITY SCREENSHOTS (الأربع الحاكمة) ==="
agent-browser set viewport 1920 1080 >/dev/null 2>&1
agent-browser open "http://127.0.0.1:3100/?force3d=1" >/dev/null 2>&1; sleep 7
agent-browser screenshot "download/v10-release/01-home-force3d-1920.png" 2>&1 | tail -1
agent-browser open "http://127.0.0.1:3100/" >/dev/null 2>&1; sleep 4
agent-browser screenshot "download/v10-release/02-home-dark-1920.png" 2>&1 | tail -1
# السمة الفاتحة عبر localStorage
agent-browser open "http://127.0.0.1:3100/" >/dev/null 2>&1
agent-browser eval 'localStorage.setItem("theme","light"); "set"' >/dev/null 2>&1
agent-browser open "http://127.0.0.1:3100/" >/dev/null 2>&1; sleep 4
agent-browser eval 'document.documentElement.classList.add("light"); document.documentElement.classList.remove("dark"); "theme-forced"' >/dev/null 2>&1; sleep 1
agent-browser screenshot "download/v10-release/04-home-light-1920.png" 2>&1 | tail -1
agent-browser eval 'document.documentElement.classList.remove("light"); document.documentElement.classList.add("dark"); "dark-restored"' >/dev/null 2>&1
agent-browser set viewport 390 844 >/dev/null 2>&1
agent-browser open "http://127.0.0.1:3100/" >/dev/null 2>&1; sleep 4
agent-browser screenshot "download/v10-release/03-home-mobile-390.png" 2>&1 | tail -1
agent-browser close >/dev/null 2>&1 || true

echo "=== 6. PIXEL IDENTITY CHECK ==="
python3 - << 'PYEOF'
from PIL import Image
BASE = "/home/z/my-project/download/baseline-v5"
REL = "/home/z/my-project/download/v10-release"
PAIRS = [
    ("02-home-force3d-1920.png", "01-home-force3d-1920.png"),
    ("01-home-dark-1920.png", "02-home-dark-1920.png"),
    ("07-home-mobile-390.png", "03-home-mobile-390.png"),
    ("08-home-light-1920.png", "04-home-light-1920.png"),
]
def analyze(path):
    img = Image.open(path).convert("RGB"); img.thumbnail((480,480))
    px = list(img.getdata()); n = len(px)
    avg = tuple(sum(c[i] for c in px)//n for i in range(3))
    dark = sum(1 for p in px if sum(p)<150)/n
    light = sum(1 for p in px if sum(p)>600)/n
    gold = sum(1 for r,g,b in px if r>140 and 90<g<210 and b<130 and r>g>b)/n
    emerald = sum(1 for r,g,b in px if g>90 and g>r and g>b)/n
    return avg,dark,light,gold,emerald
ok = True
for base_f, rel_f in PAIRS:
    b = analyze(f"{BASE}/{base_f}"); v = analyze(f"{REL}/{rel_f}")
    drift = max(abs(b[1]-v[1]), abs(b[2]-v[2]))
    status = "OK" if drift < 0.05 else "DRIFT!"
    if drift >= 0: pass
    print(f"[{base_f}] avg {b[0]}->{v[0]} | dark {b[1]:.1%}->{v[1]:.1%} light {b[2]:.1%}->{v[2]:.1%} | gold {b[3]:.2%}->{v[3]:.2%} emerald {b[4]:.2%}->{v[4]:.2%} | {status}")
PYEOF

echo "=== 7. DEV-SERVER 3000 (معاينة المنصة) ==="
curl -s -o /dev/null -w "dev3000 => %{http_code}\n" http://127.0.0.1:3000/ --max-time 5 || echo "dev3000 => DOWN"

echo "=== 8. SHA256 (بصمات أدلة الإطلاق) ==="
cd download/v10-release && sha256sum *.png > CHECKSUMS.sha256 && cat CHECKSUMS.sha256 | head -4 && cd ../..

PID=$(ss -tlnp 2>/dev/null | rg "127.0.0.1:3100" | rg -o "pid=[0-9]+" | rg -o "[0-9]+" || true)
if [ -n "$PID" ]; then kill -9 "$PID" 2>/dev/null || true; fi
echo "RELEASE-VERIFY-DONE"
