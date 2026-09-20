#!/usr/bin/env bash
# ============================================================
# V10.1 — دفع الدروس السبعة + التحقق من النشر الحي
# ------------------------------------------------------------
# الاستخدام (توكن GitHub بصلاحيات repo على AhmedMar98/Umm-sara):
#   GH_TOKEN=ghp_XXXX bash scripts/v10-lessons-push.sh
#
# ماذا يفعل:
#   1. يدفع release-v10.1 (شجعة ff190a6 كاملة فوق التاريخ البعيد)
#      إلى main البعيد — fast-forward بلا force
#   2. يراقب النشر التلقائي على Vercel حتى يظهر مسار /works الجديد
#   3. يتحقق من الرقم الحقيقي 966544665634 في الإنتاج
#   4. يطبق مخطط Supabase (works) تلقائياً عبر GitHub Action عند الدفع
# ============================================================
set -euo pipefail

GH_TOKEN="${GH_TOKEN:?يجب تمرير GH_TOKEN كمتغير بيئة}"
REPO="AhmedMar98/Umm-sara"
LIVE="https://umm-sara.vercel.app"

echo "[1/4] دفع release-v10.1 → main البعيد (fast-forward)…"
git push "https://x-access-token:${GH_TOKEN}@github.com/${REPO}.git" release-v10.1:main
echo "    ✓ تم الدفع"

echo "[2/4] تحقق عبر API أن رأس main البعيد هو كوميتنا…"
SHA_LOCAL=$(git rev-parse release-v10.1)
SHA_REMOTE=$(curl -s -H "Authorization: Bearer ${GH_TOKEN}" \
  "https://api.github.com/repos/${REPO}/branches/main" | python3 -c "import json,sys; print(json.load(sys.stdin)['commit']['sha'])")
if [ "$SHA_LOCAL" != "$SHA_REMOTE" ]; then
  echo "    ✗ عدم تطابق: local=$SHA_LOCAL remote=$SHA_REMOTE"; exit 1
fi
echo "    ✓ $SHA_REMOTE"

echo "[3/4] مراقبة النشر الحي على Vercel (قد يستغرق 2-4 دقائق)…"
# المؤشر: /works مسار جديد غير موجود في النسخة الحالية (404) → 200 يعني النشر تم
for i in $(seq 1 60); do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$LIVE/works" || echo 000)
  if [ "$CODE" = "200" ]; then
    echo "    ✓ /works = 200 — النشر الحي تم (بعد ${i} محاولة)"
    break
  fi
  if [ "$i" = "60" ]; then
    echo "    ✗ لم يظهر /works بعد 5 دقائق — راقب لوحة Vercel يدوياً"; exit 1
  fi
  sleep 5
done

echo "[4/4] التحقق الحي من المسارات والرقم…"
for path in / /works /works/mba-research-proposal /privacy /terms /services /healthz; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$LIVE$path" || echo 000)
  echo "    [$CODE] $path"
done
echo "--- الرقم الحقيقي في الصفحة الحية ---"
curl -s --max-time 15 "$LIVE/contact" | grep -o "966 54 466 5634" | head -1 || true
echo ""
echo "=== اكتمل: الدروس السبعة حية على $LIVE ==="
echo "ملاحظة: GitHub Action سيطبق جدول works في Supabase تلقائياً (supabase/** في هذا الدفع)"
