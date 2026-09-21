#!/usr/bin/env python3
# ============================================================
# V10.2 Wave C «قاموس الحركة» — أدلة تفاعلية
#   1) /works: فلترة + إطار منتصف FLIP (~280ms بعد النقر) + النتيجة
#   2) /services: بحث "SPSS" + إطار منتصف + النتيجة
#   3) الرئيسية: أعلى + منتصف تمرير (دليل parallax المدفوع بالتمرير)
# ============================================================
import os, subprocess, time, signal, sys
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"
OUT = "/home/z/my-project/download/modernity-2027/wavec"
os.makedirs(OUT, exist_ok=True)

subprocess.run("pkill -f 'standalone/server.js' || true", shell=True, capture_output=True)
subprocess.run("pkill -f 'next dev' || true", shell=True, capture_output=True)
time.sleep(1)
server = subprocess.Popen(
    ["npm", "start"], cwd="/home/z/my-project",
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    preexec_fn=os.setsid,
)

def wait_ready(timeout=60):
    import urllib.request
    t0 = time.time()
    while time.time() - t0 < timeout:
        try:
            urllib.request.urlopen(BASE, timeout=3)
            return True
        except Exception:
            time.sleep(1)
    return False

if not wait_ready():
    print("FATAL: server not ready"); server.terminate(); sys.exit(1)
print("server ready")

errors = []
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--no-sandbox", "--disable-gpu"])
        ctx = browser.new_context(
            viewport={"width": 1440, "height": 900},
            locale="ar-SA", extra_http_headers={"Accept-Language": "ar"},
        )
        page = ctx.new_page()

        # ---------- 1) المعرض: فلترة FLIP ----------
        page.goto(f"{BASE}/works", wait_until="networkidle", timeout=45000)
        page.wait_for_timeout(3500)
        page.screenshot(path=f"{OUT}/works-before-filter.png")
        # انقر فلتر «البرمجة والتقنية» (أو أول فلتر غير «الكل»)
        tabs = page.locator('button[role="tab"]')
        count = tabs.count()
        target = None
        for i in range(count):
            t = tabs.nth(i).inner_text()
            if t.strip() != "الكل":
                target = i; break
        if target is None: target = 1
        tabs.nth(target).click()
        # إطار منتصف FLIP — البطاقات في الطريق لمواضعها
        page.wait_for_timeout(280)
        page.screenshot(path=f"{OUT}/works-flip-midframe.png")
        page.wait_for_timeout(1200)
        page.screenshot(path=f"{OUT}/works-after-filter.png")
        print("works FLIP captured")

        # ---------- 2) الخدمات: بحث FLIP ----------
        page.goto(f"{BASE}/services", wait_until="networkidle", timeout=45000)
        page.wait_for_timeout(3000)
        page.screenshot(path=f"{OUT}/services-before-search.png")
        page.fill('input[aria-label="البحث في الخدمات"]', "SPSS")
        page.wait_for_timeout(240)
        page.screenshot(path=f"{OUT}/services-flip-midframe.png")
        page.wait_for_timeout(1100)
        page.screenshot(path=f"{OUT}/services-after-search.png")
        print("services FLIP captured")

        # ---------- 3) الرئيسية: parallax مدفوع بالتمرير ----------
        page.goto(BASE, wait_until="networkidle", timeout=45000)
        page.wait_for_timeout(4000)
        page.screenshot(path=f"{OUT}/home-top.png")
        page.evaluate("window.scrollTo(0, 500)")
        page.wait_for_timeout(900)
        page.screenshot(path=f"{OUT}/home-scrolled-parallax.png")
        print("parallax captured")

        ctx.close(); browser.close()
except Exception as e:
    errors.append(str(e))

os.killpg(os.getpgid(server.pid), signal.SIGTERM)
print("errors:", errors if errors else "none")
print("shots:", sorted(os.listdir(OUT)))
