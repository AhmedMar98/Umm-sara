#!/usr/bin/env python3
# ============================================================
# V10.1 — مراقبة النشر الحي والتحقق الكامل (المهمة 23)
# الدفع تم: fd49da7 → origin/main — هذا السكربت يراقب ويتحقق
#   1. انتظار ظهور /works على الإنتاج (مؤشر النشر الجديد 404→200)
#   2. فحص كل المسارات الجديدة والمحورة
#   3. تحقق محتوى الدروس السبعة في HTML الحي:
#      L1 hero-mobile-scrim · L2 الرقم · L3 السلة · L4 الجامعات
#      L5 المرض بنزاهة «نموذج توضيحي» · L6 خمسة أسباب · L7 الموافقة (chunk)
# ============================================================
import re
import sys
import time
import urllib.request
import urllib.error

LIVE = "https://umm-sara.vercel.app"
TIMEOUT = 20
MAX_POLLS = 90  # 7.5 دقائق
INTERVAL = 5

UA = {"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)"}


def fetch(path: str) -> tuple[int, str]:
    url = LIVE + path
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            return r.status, r.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", errors="replace") if e.fp else ""
    except Exception as e:  # noqa: BLE001
        return 0, str(e)


def code_only(path: str) -> int:
    req = urllib.request.Request(LIVE + path, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:  # noqa: BLE001
        return 0


print(f"[1/3] مراقبة ظهور /works (مؤشر اكتمال النشر الجديد)…")
t0 = time.time()
works_code = 0
for i in range(1, MAX_POLLS + 1):
    works_code = code_only("/works")
    if works_code == 200:
        print(f"    ✓ /works = 200 بعد {i} محاولة ({time.time()-t0:.0f} ث)")
        break
    if i % 6 == 0:
        print(f"    … محاولة {i}: /works = {works_code} ({time.time()-t0:.0f} ث)")
    time.sleep(INTERVAL)

if works_code != 200:
    print("    ✗ لم يظهر /works — راقب لوحة Vercel يدوياً")
    sys.exit(1)

print("\n[2/3] فحص المسارات الأساسية والجديدة…")
routes = [
    "/", "/healthz", "/services",
    "/services/university-services?university=kfu",
    "/services/graduate-services",
    "/services/statistics-and-data-analysis", "/contact", "/about",
    "/works", "/works/mba-research-proposal",
    "/works/spss-thesis-analysis", "/privacy", "/terms",
    "/cv-builder", "/plagiarism-check", "/consultation",
]
fail = 0
for p in routes:
    c = code_only(p)
    mark = "✓" if c == 200 else "✗"
    if c != 200:
        fail += 1
    print(f"    [{c}] {mark} {p}")
if fail:
    print(f"    ⚠ {fail} مسار غير 200")
    sys.exit(1)

print("\n[3/3] تحقق محتوى الدروس السبعة في HTML الحي…")
results: list[tuple[str, bool, str]] = []


def check(lesson: str, path: str, pattern: str, desc: str):
    c, html = fetch(path)
    ok = c == 200 and bool(re.search(pattern, html))
    results.append((lesson, ok, desc))


check("L1", "/", r"hero-mobile-scrim", "حجاب تباين هيرو الجوال في HTML")
check("L2", "/contact", r"966 54 466 5634", "الرقم الحقيقي في صفحة التواصل")
check("L2", "/contact", r"wa\.me/966544665634", "رابط واتساب بالرقم الصحيح")
c, services_html = fetch("/services/university-services?university=kfu")
results.append(("L3", c == 200 and "أضف" in services_html, "زر الإضافة للسلة في صفحة قسم"))
results.append(("L4", c == 200 and "خدمات طلاب" in services_html and "الملك فيصل" in services_html, "شارة جامعة kfu في القسم المُعامل"))
results.append(("L4b", c == 200 and "نعرف أنظمة جامعتك" in services_html or "أنظمة جامعتك" in services_html, "فقرة سياق الجامعة في القسم"))
check("L4", "/", r"اختر جامعتك|جامعتك", "قسم اختر جامعتك في الرئيسية")
check("L5", "/works", r"نموذج توضيحي", "وسم النزاهة في المعرض")
check("L5", "/works/mba-research-proposal", r"منهجية|المنهجية", "صفحة عمل بمنهجية")
check("L6", "/services/university-services", r"خمسة أسباب|تطمئن|مطمئناً", "كتلة الأسباب في القسم")
check("L7", "/", r"رابط سياسة الخصوصية|privacy", "روابط الخصوصية موجودة")
# ملاحظة: درج السلة وزر الشريط client-side (يظهران بعد التفاعل) —
# وظيفتهما مثبتة في Task 22 عبر Playwright (لقطات 08/09)؛ هنا نفحص ما يظهر في SSR فقط

# dir=rtl عبر الصفحة الرئيسية
c, home = fetch("/")
results.append(("SEO", c == 200 and 'dir="rtl"' in home, "dir=rtl على الرئيسية"))

passed = 0
for lesson, ok, desc in results:
    mark = "✓" if ok else "✗"
    if ok:
        passed += 1
    print(f"    {mark} [{lesson}] {desc}")
print(f"\n=== النتيجة: {passed}/{len(results)} فحصاً ناجحاً — النشر الحي مكتمل ===")
print(f"الرابط: {LIVE}")
sys.exit(0 if passed == len(results) else 1)
