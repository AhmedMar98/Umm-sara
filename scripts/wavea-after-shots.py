#!/usr/bin/env python3
# ============================================================
# V10.2 Wave A — لقطات «بعد» من بناء إنتاج محلي
# يعتمد على: قتل الزومبي ← npm start على 3102 ← لقطات ← قتل
# المسارات: /works و/services و/ (داكن+فاتح) + جوال
# ============================================================
import os
import subprocess
import time
from playwright.sync_api import sync_playwright

ROOT = "/home/z/my-project"
OUT = "/home/z/my-project/download/modernity-2027/after"
PORT = 3102
os.makedirs(OUT, exist_ok=True)

# 1) قتل أي خادم سابق على المنفذ
subprocess.run(
    f"ss -ltnp 2>/dev/null | grep ':{PORT}' | grep -oP 'pid=\\K[0-9]+' | xargs -r kill -9",
    shell=True,
)
time.sleep(1)

# 2) تشغيل خادم الإنتاج
env = dict(os.environ, PORT=str(PORT))
srv = subprocess.Popen(
    ["npm", "start"], cwd=ROOT, env=env,
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
)
time.sleep(9)  # جاهزية next start

BASE = f"http://127.0.0.1:{PORT}"
errors = []
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--no-sandbox", "--disable-gpu"])
        ctx = browser.new_context(
            viewport={"width": 1440, "height": 900},
            locale="ar-SA",
            extra_http_headers={"Accept-Language": "ar"},
        )
        page = ctx.new_page()

        def shoot(name, path, scrolls=2):
            try:
                page.goto(BASE + path, wait_until="networkidle", timeout=45000)
                page.wait_for_timeout(4000)
                page.screenshot(path=os.path.join(OUT, f"{name}-top.png"))
                for i in range(1, scrolls + 1):
                    page.evaluate(f"window.scrollTo(0, {i * 900})")
                    page.wait_for_timeout(1000)
                    page.screenshot(path=os.path.join(OUT, f"{name}-s{i}.png"))
                page.evaluate("window.scrollTo(0, 0)")
                print(f"  [{name}] OK")
            except Exception as e:
                errors.append(f"{name}: {e}")
                print(f"  [{name}] ERR {e}")

        shoot("works", "/works", scrolls=1)
        shoot("services", "/services", scrolls=3)
        shoot("home", "/", scrolls=1)

        # الفاتح: الرئيسية والمعرض
        for target, name in [("/", "home"), ("/works", "works")]:
            try:
                page.goto(BASE + target, wait_until="networkidle", timeout=45000)
                page.wait_for_timeout(3000)
                page.click('button[aria-label="تبديل السمة"]')
                page.wait_for_timeout(1200)
                page.screenshot(path=os.path.join(OUT, f"{name}-top-light.png"))
                print(f"  [{name}-light] OK")
            except Exception as e:
                errors.append(f"{name}-light: {e}")

        # الجوال
        mob = browser.new_context(
            viewport={"width": 390, "height": 844},
            locale="ar-SA", is_mobile=True, device_scale_factor=2,
        )
        mp = mob.new_page()
        for name, path in [("works-mobile", "/works"), ("home-mobile", "/")]:
            try:
                mp.goto(BASE + path, wait_until="networkidle", timeout=45000)
                mp.wait_for_timeout(4000)
                mp.screenshot(path=os.path.join(OUT, f"{name}.png"))
                print(f"  [{name}] OK")
            except Exception as e:
                errors.append(f"{name}: {e}")
        mob.close()
        browser.close()
finally:
    srv.terminate()
    try:
        srv.wait(timeout=10)
    except Exception:
        srv.kill()

print("=" * 50)
print(f"DONE. {len(os.listdir(OUT))} shots in {OUT}")
if errors:
    print("ERRORS:", errors)
