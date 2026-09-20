#!/usr/bin/env python3
"""التحقق النهائي من النشر الحي — لا دليل = لا نجاح:
1) كل المسارات: 200 + هوية «أم سارة» + RTL
2) POST /api/orders و /api/consultations حقيقياً => persisted:true
3) الاستعلام المباشر عن الصفين في Supabase ثم تنظيفهما"""
import json
import os
import time
import urllib.error
import urllib.request

import psycopg2

BASE = "https://umm-sara.vercel.app"
DB = os.environ.get("SUPABASE_DB_URL", "")  # رابط Session pooler — سر لا يُكتب في المستودع
assert DB, "SUPABASE_DB_URL مطلوب (متغير بيئة)"
MARK = "verify-live@umm-sara.test"


def fetch(path):
    req = urllib.request.Request(BASE + path, headers={"User-Agent": "verify/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")[:200]


def post(path, payload):
    req = urllib.request.Request(BASE + path, method="POST",
                                 data=json.dumps(payload).encode(),
                                 headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return r.status, json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", "replace")[:200]
        try:
            return e.code, json.loads(raw)
        except Exception:
            return e.code, {"raw": raw}


# ── 1) كل المسارات ────────────────────────────────────────────────
print("=" * 72)
print("1) فحص المسارات")
html_routes = ["/", "/about", "/consultation", "/contact", "/cv-builder",
               "/plagiarism-check", "/services", "/services/university-services"]
all_ok = True
for r in html_routes:
    st, body = fetch(r)
    identity = ("أم سارة" in body)
    rtl = ('dir="rtl"' in body)
    ok = st == 200 and identity and rtl
    all_ok &= ok
    print(f"  {'PASS' if ok else 'FAIL'}  {r:<40} {st}  هوية:{'✓' if identity else '✗'}  rtl:{'✓' if rtl else '✗'}")

for r in ["/healthz", "/api"]:
    st, body = fetch(r)
    ok = st == 200
    all_ok &= ok
    print(f"  {'PASS' if ok else 'FAIL'}  {r:<40} {st}  {body[:60]!r}")

# ── 2) طلبات POST حقيقية إلى الإنتاج ─────────────────────────────
print("=" * 72)
print("2) POST حقيقي => Supabase عبر الإنتاج")
st, res = post("/api/orders", {
    "name": "فحص آلي للنشر الحي",
    "contact": MARK,
    "service": "التحقق من النشر الإنتاجي على Vercel",
    "details": "طلب اختباري تلقائي للتحقق من اتصال الإنتاج بقاعدة Supabase الحية — بوابة إطلاق V10.",
    "type": "service",
})
print(f"  POST /api/orders          => {st}  ok={res.get('ok')}  persisted={res.get('persisted')}")
all_ok &= (st == 200 and res.get("persisted") is True)

st, res = post("/api/consultations", {
    "name": "فحص آلي للنشر الحي",
    "contact": MARK,
    "field": "اختبار النشر الإنتاجي",
    "notes": "حجز اختباري تلقائي — يُنظَّف بعد التحقق",
})
print(f"  POST /api/consultations    => {st}  ok={res.get('ok')}  persisted={res.get('persisted')}")
all_ok &= (st == 200 and res.get("persisted") is True)

# ── 3) الاستعلام المباشر في Supabase ثم التنظيف ─────────────────
print("=" * 72)
print("3) الاستعلام المباشر في Supabase (pooler)")
conn = psycopg2.connect(DB)
cur = conn.cursor()
time.sleep(1.5)  # مهلة صغيرة لضمان وصول الإدراج
cur.execute("SELECT id, name, service, created_at FROM orders WHERE contact=%s", (MARK,))
orders_rows = cur.fetchall()
print(f"  orders      : {len(orders_rows)} صف  | {orders_rows[0] if orders_rows else '— لا شيء!'}")
cur.execute("SELECT id, field, created_at FROM consultations WHERE contact=%s", (MARK,))
cons_rows = cur.fetchall()
print(f"  consultations: {len(cons_rows)} صف | {cons_rows[0] if cons_rows else '— لا شيء!'}")
cur.execute("SELECT count(*) FROM categories")
print(f"  البذور سليمة: categories={cur.fetchone()[0]}")
all_ok &= len(orders_rows) == 1 and len(cons_rows) == 1

# تنظيف صفوف الاختبار (الإنتاج يبقى نظيفاً) مع إثبات العدد قبل/بعد
cur.execute("DELETE FROM orders WHERE contact=%s", (MARK,))
cur.execute("DELETE FROM consultations WHERE contact=%s", (MARK,))
conn.commit()
cur.execute("SELECT (SELECT count(*) FROM orders WHERE contact=%s), (SELECT count(*) FROM consultations WHERE contact=%s)", (MARK, MARK))
after = cur.fetchone()
print(f"  بعد التنظيف: orders={after[0]}  consultations={after[1]}  (أُزيلت صفوف الاختبار)")
conn.close()

print("=" * 72)
print("الحكم النهائي:", "PASS — النشر الحي مُثبت بالقياس كاملاً" if all_ok else "FAIL — راجع البنود أعلاه")
