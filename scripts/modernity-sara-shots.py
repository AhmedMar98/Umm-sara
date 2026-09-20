#!/usr/bin/env python3
# ============================================================
# دراسة 2027 — لقطات طازجة لموقع أم سارة الحي (بعد V10.1)
# الغرض: قاعدة أدلة جديدة لدراسة الحداثة التصميمية
#   - سطح مكتب 1440×900 (السمة الداكنة الافتراضية + الفاتحة)
#   - جوال 390×844 (السمتان — للتحقق من ثبات إصلاح الدرس 1)
# ============================================================
import os
from playwright.sync_api import sync_playwright

LIVE = "https://umm-sara.vercel.app"
OUT = "/home/z/my-project/download/modernity-2027/sara"
os.makedirs(OUT, exist_ok=True)

DESKTOP_PAGES = [
    ("home", f"{LIVE}/"),
    ("services", f"{LIVE}/services"),
    ("works", f"{LIVE}/works"),
    ("contact", f"{LIVE}/contact"),
    ("about", f"{LIVE}/about"),
]

errors = []
with sync_playwright() as p:
    browser = p.chromium.launch(args=["--no-sandbox", "--disable-gpu"])

    # ---------- سطح المكتب: السمة الداكنة (الافتراضية) ----------
    ctx = browser.new_context(
        viewport={"width": 1440, "height": 900},
        locale="ar-SA",
        extra_http_headers={"Accept-Language": "ar"},
    )
    page = ctx.new_page()

    def shoot(name, url, wait_ms=4000, scrolls=2, suffix=""):
        try:
            page.goto(url, wait_until="networkidle", timeout=45000)
        except Exception as e:
            print(f"  [{name}] goto warning: {e}")
        page.wait_for_timeout(wait_ms)
        page.screenshot(path=os.path.join(OUT, f"sara-{name}-top{suffix}.png"))
        height = page.evaluate("document.body.scrollHeight")
        for i in range(1, scrolls + 1):
            page.evaluate(f"window.scrollTo(0, {i * 900})")
            page.wait_for_timeout(1000)
            page.screenshot(path=os.path.join(OUT, f"sara-{name}-s{i}{suffix}.png"))
        page.evaluate("window.scrollTo(0, 0)")
        print(f"  [{name}{suffix}] OK (height {height}px)")

    for name, url in DESKTOP_PAGES:
        try:
            shoot(name, url, scrolls=2 if name in ("home", "services", "works") else 1)
        except Exception as e:
            errors.append(f"{name}: {e}")

    # ---------- سطح المكتب: السمة الفاتحة (الرئيسية فقط) ----------
    try:
        page.goto(f"{LIVE}/", wait_until="networkidle", timeout=45000)
        page.wait_for_timeout(3000)
        page.click('button[aria-label="تبديل السمة"]')
        page.wait_for_timeout(1200)
        page.screenshot(path=os.path.join(OUT, "sara-home-top-light.png"))
        page.evaluate("window.scrollTo(0, 900)")
        page.wait_for_timeout(1000)
        page.screenshot(path=os.path.join(OUT, "sara-home-s1-light.png"))
        print("  [home-light] OK")
    except Exception as e:
        errors.append(f"home-light: {e}")
    ctx.close()

    # ---------- الجوال: السمتان ----------
    mob = browser.new_context(
        viewport={"width": 390, "height": 844},
        locale="ar-SA", is_mobile=True, device_scale_factor=2,
    )
    mp = mob.new_page()
    for suffix, label in [("", "dark"), ("-light", "light")]:
        try:
            mp.goto(f"{LIVE}/", wait_until="networkidle", timeout=45000)
            mp.wait_for_timeout(4000)
            if suffix == "-light":
                mp.click('button[aria-label="تبديل السمة"]')
                mp.wait_for_timeout(1200)
            mp.screenshot(path=os.path.join(OUT, f"sara-home-mobile{suffix}.png"))
            # لقطة ثانية بعد تمرير أول قسم (لمعرفة إيقاع الأقسام)
            mp.evaluate("window.scrollTo(0, 700)")
            mp.wait_for_timeout(900)
            mp.screenshot(path=os.path.join(OUT, f"sara-home-mobile{suffix}-s1.png"))
            print(f"  [mobile-{label}] OK")
        except Exception as e:
            errors.append(f"mobile-{label}: {e}")
    mob.close()
    browser.close()

print("=" * 50)
print(f"DONE. {len(os.listdir(OUT))} shots in {OUT}")
if errors:
    print("ERRORS:", errors)
