#!/usr/bin/env python3
# ============================================================
# V10.2 Wave B — «سطوح الإدراك»: لقطات بعد الترقية المحلية
#   الرئيسية (السطح الذي يراه المستخدم 90% من الوقت) + الشريط الكبسولي
#   - سطح مكتب 1440×900 داكن (top + s1 + s2) وفاتح
#   - جوال 390×844 (السمتان — حماية إصلاح الدرس 1)
#   - قياس وزن الصفحة المنقول (مقارنة بخط الأساس 542KB)
# ============================================================
import os, subprocess, time, signal, sys
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"
OUT = "/home/z/my-project/download/modernity-2027/waveb"
os.makedirs(OUT, exist_ok=True)

# ---------- إدارة الخادم: قتل أي زومبي ثم تشغيل الإنتاج ----------
subprocess.run("pkill -f 'next start' || true", shell=True, capture_output=True)
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

        # ---------- سطح المكتب — داكن ----------
        ctx = browser.new_context(
            viewport={"width": 1440, "height": 900},
            locale="ar-SA", extra_http_headers={"Accept-Language": "ar"},
        )
        page = ctx.new_page()

        page.goto(BASE, wait_until="networkidle", timeout=45000)
        page.wait_for_timeout(4500)
        page.screenshot(path=f"{OUT}/home-dark-top.png")
        for i in (1, 2, 3):
            page.evaluate(f"window.scrollTo(0, {i * 900})")
            page.wait_for_timeout(1200)
            page.screenshot(path=f"{OUT}/home-dark-s{i}.png")
        page.evaluate("window.scrollTo(0, 0)")

        # وزن الصفحة المنقول (ضغط واقعي)
        transferred = 0
        def on_resp(r):
            global transferred
            try:
                cl = r.response.headers.get("content-length")
                if cl: 
                    globals()["transferred"] = globals()["transferred"] + int(cl)
            except Exception: pass
        page2 = ctx.new_page()
        page2.on("response", on_resp)
        page2.goto(BASE, wait_until="networkidle", timeout=45000)
        page2.wait_for_timeout(2500)
        print(f"transferred (approx): {transferred/1024:.0f} KB")

        # ---------- سطح المكتب — فاتح ----------
        page.goto(BASE, wait_until="networkidle", timeout=45000)
        page.wait_for_timeout(3000)
        page.click('button[aria-label="تبديل السمة"]')
        page.wait_for_timeout(2500)
        page.screenshot(path=f"{OUT}/home-light-top.png")
        page.evaluate("window.scrollTo(0, 900)")
        page.wait_for_timeout(1200)
        page.screenshot(path=f"{OUT}/home-light-s1.png")
        ctx.close()

        # ---------- جوال ----------
        mctx = browser.new_context(
            viewport={"width": 390, "height": 844},
            locale="ar-SA", device_scale_factor=2,
            is_mobile=True, has_touch=True,
        )
        mpage = mctx.new_page()
        mpage.goto(BASE, wait_until="networkidle", timeout=45000)
        mpage.wait_for_timeout(4500)
        mpage.screenshot(path=f"{OUT}/home-mobile-dark.png")
        mpage.evaluate("window.scrollTo(0, 700)")
        mpage.wait_for_timeout(1200)
        mpage.screenshot(path=f"{OUT}/home-mobile-dark-s1.png")
        mpage.click('button[aria-label="تبديل السمة"]')
        mpage.wait_for_timeout(2000)
        mpage.evaluate("window.scrollTo(0, 0)")
        mpage.wait_for_timeout(800)
        mpage.screenshot(path=f"{OUT}/home-mobile-light.png")
        mctx.close()
        browser.close()
except Exception as e:
    errors.append(str(e))

os.killpg(os.getpgid(server.pid), signal.SIGTERM)
print("errors:", errors if errors else "none")
print("shots in", OUT, ":", sorted(os.listdir(OUT)))
