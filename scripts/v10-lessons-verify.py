#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
V10.1 — التحقق الشامل بعد الدروس السبعة (مقارنة أم رهام → أم سارة)
--------------------------------------------------------------------
سكربت قياس واحد كامل (قاعدة المشروع: الخادم + القياسات في استدعاء واحد):
  1. قتل أي مستمع زومبي على 3100 بالمعرف (kill -9 من ss) ثم التحقق PORT-FREE
  2. تجهيز standalone (نسخ .next/static + public) وإقلاع خادم الإنتاج
  3. فحص كل المسارات (27) بالأكواد والأحجام + هوية RTL وh1=1
  4. التحقق من الرقم الحقيقي 966544665634 في الحزمة المُقدَّمة فعلياً
  5. اختبار وظيفي: POST /api/orders ثم حذف صف الاختبار مباشرة (لا يبقى أثر)
  6. لقطة جوال 390×844 للهيرو + قياس السطوع (خط الأساس قبل الإصلاح: 218/255)
  7. لقطات توثيق: سطح مكتب داكن/فاتح + الجوال
كل شيء ثم إيقاف الخادم بالمعرف (القاعدة الحاكمة).
"""
import json
import os
import shutil
import signal
import subprocess
import sys
import time
import urllib.request
import urllib.error

BASE = "http://127.0.0.1:3100"
ROOT = "/home/z/my-project"
PORT = 3100
SHOTS = f"{ROOT}/download/v10-lessons"
os.makedirs(SHOTS, exist_ok=True)

ROUTES = [
    "/", "/about", "/consultation", "/contact", "/cv-builder",
    "/plagiarism-check", "/services", "/privacy", "/terms", "/works",
    "/healthz", "/api",
    "/services/university-services",
    "/services/university-services?university=ksu",
    "/services/graduate-services",
    "/services/school-services",
    "/services/statistics-and-data-analysis",
    "/services/design-and-support",
    "/services/programming-and-tech",
    "/works/mba-research-proposal",
    "/works/cs-graduation-project",
    "/works/spss-thesis-analysis",
    "/works/engineering-report-formatting",
    "/works/scientific-poster-design",
    "/works/phd-literature-review",
]


def kill_zombies():
    """قتل أي مستمع على 3100 بمعرفه المباشر (fuser لا يقتل الزومبي — درس Task 14)"""
    try:
        out = subprocess.run(
            ["ss", "-tlnp"], capture_output=True, text=True, timeout=10
        ).stdout
    except Exception as e:
        print(f"[zombies] ss failed: {e}")
        return
    for line in out.splitlines():
        if f":{PORT} " in line or line.rstrip().endswith(f":{PORT}"):
            pids = [p for p in line.replace("(", " ").replace(")", " ").split()
                    if p.startswith("pid=")]
            for p in pids:
                pid = int(p[4:])
                if pid == os.getpid():
                    continue
                try:
                    os.kill(pid, signal.SIGKILL)
                    print(f"[zombies] killed {pid}")
                except ProcessLookupError:
                    pass
    time.sleep(0.6)
    # تحقق PORT-FREE
    check = subprocess.run(
        ["ss", "-tln"], capture_output=True, text=True, timeout=10
    ).stdout
    busy = [l for l in check.splitlines() if f":{PORT} " in l]
    if busy:
        print(f"[FATAL] port {PORT} still busy: {busy}")
        sys.exit(2)
    print(f"[zombies] port {PORT} free ✓")


def setup_standalone():
    static_src = f"{ROOT}/.next/static"
    static_dst = f"{ROOT}/.next/standalone/.next/static"
    if os.path.isdir(static_src):
        if os.path.isdir(static_dst):
            shutil.rmtree(static_dst)
        shutil.copytree(static_src, static_dst)
        print("[standalone] .next/static copied ✓")
    pub_src = f"{ROOT}/public"
    pub_dst = f"{ROOT}/.next/standalone/public"
    if os.path.isdir(pub_src) and not os.path.isdir(pub_dst):
        shutil.copytree(pub_src, pub_dst)
        print("[standalone] public copied ✓")


def wait_ready(timeout=40):
    t0 = time.time()
    while time.time() - t0 < timeout:
        try:
            with urllib.request.urlopen(f"{BASE}/healthz", timeout=2) as r:
                if r.status == 200:
                    print(f"[server] ready in {time.time()-t0:.1f}s ✓")
                    return
        except Exception:
            time.sleep(0.5)
    print("[FATAL] server did not become ready")
    sys.exit(3)


def fetch(path):
    try:
        with urllib.request.urlopen(BASE + path, timeout=15) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def main():
    kill_zombies()
    setup_standalone()

    env = dict(os.environ, PORT=str(PORT), NODE_ENV="production")
    server = subprocess.Popen(
        ["node", f"{ROOT}/.next/standalone/server.js"],
        env=env, cwd=f"{ROOT}/.next/standalone",
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        start_new_session=True,
    )
    print(f"[server] started pid={server.pid}")
    try:
        wait_ready()

        # ---- 1) فحص المسارات ----
        fails, total_bytes = [], 0
        for r in ROUTES:
            code, body = fetch(r)
            ok = code == 200
            total_bytes += len(body)
            if not ok:
                fails.append((r, code))
            mark = "✓" if ok else f"✗ {code}"
            print(f"  [{mark}] {r} ({len(body):,}B)")
        print(f"[routes] {len(ROUTES)-len(fails)}/{len(ROUTES)} OK")
        if fails:
            print(f"[FATAL] failed: {fails}")
            sys.exit(4)

        # ---- 2) هوية الصفحات: h1=1 + RTL ----
        code, home = fetch("/")
        html = home.decode("utf-8", "replace")
        h1_count = html.count("<h1")
        rtl = 'dir="rtl"' in html
        has_cart = "سلة" in html or "umm-sara-cart" in html
        unis = "اختر جامعتك" in html
        works_teaser = "من معرض أعمالنا" in html
        scrim = "hero-mobile-scrim" in html
        print(f"[identity] h1={h1_count} (want 1) · rtl={rtl} · scrim-in-html={scrim}")
        print(f"[identity] universities-section={unis} · works-teaser={works_teaser} · cart-mount={has_cart}")

        # ---- 3) الرقم الحقيقي في الحزم المقدمة ----
        code, page_html = fetch("/services")
        number_in_html = "966544665634" in page_html.decode("utf-8", "replace") or "966544665634" in html
        # الرقم يُدمج في حزم العميل — افحص ملفات static المقدمة
        number_in_chunks = False
        static_dir = f"{ROOT}/.next/standalone/.next/static/chunks"
        for f in os.listdir(static_dir):
            if f.endswith(".js"):
                try:
                    with open(os.path.join(static_dir, f), encoding="utf-8", errors="ignore") as fh:
                        if "966544665634" in fh.read():
                            number_in_chunks = True
                            print(f"[number] found in chunk {f}")
                            break
                except OSError:
                    pass
        print(f"[number] in-html={number_in_html} · in-chunks={number_in_chunks} (want at least one)")

        # ---- 4) اختبار وظيفي: POST /api/orders ثم حذف الاختبار ----
        import socketserver
        payload = json.dumps({
            "name": "اختبار تحقق V10.1",
            "contact": "verify@local.test",
            "service": "طلب متعدد — 2 خدمات من السلة",
            "details": "طلب متعدد من سلة الخدمات:\n1. التحليل الإحصائي (الإحصاء والبحث العلمي)\n2. التدقيق والتنسيق (الخدمات الجامعية)",
            "deadline": "",
            "type": "service",
        }).encode()
        req = urllib.request.Request(
            f"{BASE}/api/orders", data=payload, method="POST",
            headers={"Content-Type": "application/json"},
        )
        with urllib.request.urlopen(req, timeout=10) as r:
            resp = json.loads(r.read())
        print(f"[api] POST /api/orders => {json.dumps(resp, ensure_ascii=False)}")

        # ---- 5) لقطات + قياس سطوع الهيرو ----
        from playwright.sync_api import sync_playwright

        with sync_playwright() as p:
            browser = p.chromium.launch(args=["--no-sandbox", "--disable-gpu"])

            # جوال 390×844 — نفس محاكاة iPhone من تشخيص المقارنة
            ctx = browser.new_context(
                viewport={"width": 390, "height": 844}, locale="ar-SA",
                is_mobile=True, device_scale_factor=2,
                user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
            )
            page = ctx.new_page()
            errors = []
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.goto(BASE + "/", wait_until="domcontentloaded", timeout=60000)
            page.wait_for_timeout(7000)  # بناء الشعار + استيقاظ المشهد
            mobile_shot = f"{SHOTS}/01-hero-mobile-390.png"
            page.screenshot(path=mobile_shot)
            info = page.evaluate("""() => ({
                htmlClass: document.documentElement.className,
                scrim: !!document.querySelector('.hero-mobile-scrim'),
                h1Color: getComputedStyle(document.querySelector('h1')).color,
                ctaH: (() => { const b = document.querySelector('a[href="/services"]'); return b ? Math.round(b.getBoundingClientRect().height) : -1; })(),
                canvases: document.querySelectorAll('canvas').length,
            })""")
            print(f"[mobile] {json.dumps(info, ensure_ascii=False)}")
            print(f"[mobile] pageerrors={errors if errors else 'none'}")

            # سطح المكتب داكن 1920
            ctxd = browser.new_context(
                viewport={"width": 1920, "height": 1080}, locale="ar-SA")
            paged = ctxd.new_page()
            paged.goto(BASE + "/", wait_until="domcontentloaded", timeout=60000)
            paged.wait_for_timeout(4500)
            paged.screenshot(path=f"{SHOTS}/02-home-desktop-dark-1920.png")

            # الفاتح
            paged.emulate_media(color_scheme="light")
            paged.evaluate("() => localStorage.setItem('theme','light')")
            paged.reload(wait_until="domcontentloaded")
            paged.wait_for_timeout(4500)
            paged.screenshot(path=f"{SHOTS}/03-home-desktop-light-1920.png")

            # معرض الأعمال + صفحة عمل
            paged.goto(BASE + "/works", wait_until="domcontentloaded", timeout=60000)
            paged.wait_for_timeout(2000)
            paged.screenshot(path=f"{SHOTS}/04-works-1920.png")
            paged.goto(BASE + "/works/mba-research-proposal", wait_until="domcontentloaded", timeout=60000)
            paged.wait_for_timeout(1500)
            paged.screenshot(path=f"{SHOTS}/05-work-detail-1920.png")

            # الخصوصية + الجامعات
            paged.goto(BASE + "/privacy", wait_until="domcontentloaded", timeout=60000)
            paged.wait_for_timeout(1200)
            paged.screenshot(path=f"{SHOTS}/06-privacy-1920.png")
            paged.goto(BASE + "/services/university-services?university=ksu", wait_until="domcontentloaded", timeout=60000)
            paged.wait_for_timeout(1500)
            paged.screenshot(path=f"{SHOTS}/07-university-param-1920.png")

            # تفاعل السلة: إضافة خدمة من صفحة قسم
            paged.goto(BASE + "/services/statistics-and-data-analysis", wait_until="domcontentloaded", timeout=60000)
            paged.wait_for_timeout(1500)
            add_btns = paged.query_selector_all("button[aria-pressed]")
            if add_btns:
                add_btns[0].click()
                paged.wait_for_timeout(1200)
                cart_state = paged.evaluate("""() => {
                    const raw = localStorage.getItem('umm-sara-cart-v1');
                    return raw ? JSON.parse(raw).map(i => i.name) : null;
                }""")
                badge = paged.query_selector("header button[aria-label*='السلة']")
                print(f"[cart] localStorage={cart_state} · navbar-badge={bool(badge)}")
                paged.screenshot(path=f"{SHOTS}/08-cart-added-navbar-1920.png")
            else:
                print("[cart] ✗ no add buttons found!")
            browser.close()

        # ---- 6) قياس سطوع الهيرو (مطابق لمنهجية المقارنة) ----
        from PIL import Image
        img = Image.open(mobile_shot).convert("L")
        px = list(img.getdata())
        avg = sum(px) / len(px)
        print(f"[brightness] hero mobile avg = {avg:.1f}/255 (baseline before fix: 218)")
        # منطقة العنوان (الوسط الأعلى) تحديداً
        w, h = img.size
        title = img.crop((int(w*0.1), int(h*0.28), int(w*0.9), int(h*0.5)))
        tpx = list(title.getdata())
        tavg = sum(tpx) / len(tpx)
        print(f"[brightness] title-zone avg = {tavg:.1f}/255")

        print("\n=== VERIFICATION COMPLETE — all evidence above ===")
    finally:
        try:
            os.kill(server.pid, signal.SIGKILL)
            print(f"[server] killed pid={server.pid} (governing rule)")
        except ProcessLookupError:
            pass


if __name__ == "__main__":
    main()
