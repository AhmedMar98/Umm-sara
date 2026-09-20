#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""تشخيص دقيق: ارتفاع CTA في الهيرو الجوال + شارة السلة بعد الإضافة."""
import json
import os
import signal
import subprocess
import time
import urllib.request

BASE = "http://127.0.0.1:3100"
ROOT = "/home/z/my-project"
PORT = 3100


def kill_zombies():
    out = subprocess.run(["ss", "-tlnp"], capture_output=True, text=True, timeout=10).stdout
    for line in out.splitlines():
        if f":{PORT} " in line:
            for tok in line.replace("(", " ").replace(")", " ").split():
                if tok.startswith("pid="):
                    try:
                        os.kill(int(tok[4:]), signal.SIGKILL)
                        print(f"killed {tok}")
                    except ProcessLookupError:
                        pass
    time.sleep(0.5)


kill_zombies()
server = subprocess.Popen(
    ["node", f"{ROOT}/.next/standalone/server.js"],
    env=dict(os.environ, PORT=str(PORT), NODE_ENV="production"),
    cwd=f"{ROOT}/.next/standalone",
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True,
)
try:
    for _ in range(60):
        try:
            urllib.request.urlopen(f"{BASE}/healthz", timeout=2)
            break
        except Exception:
            time.sleep(0.5)

    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch(args=["--no-sandbox", "--disable-gpu"])

        # جوال: قياس أزرار الهيرو تحديداً
        ctx = browser.new_context(
            viewport={"width": 390, "height": 844}, locale="ar-SA",
            is_mobile=True, device_scale_factor=2,
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        )
        page = ctx.new_page()
        page.goto(BASE + "/", wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(4000)
        cta = page.evaluate("""() => {
            const h1 = document.querySelector('h1');
            const heroSection = h1 ? h1.closest('section') : null;
            if (!heroSection) return {error: 'no hero'};
            const links = heroSection.querySelectorAll('a[href="/services"], a[href="/consultation"]');
            return Array.from(links).map(a => {
                const r = a.getBoundingClientRect();
                const cs = getComputedStyle(a);
                return {
                    href: a.getAttribute('href'),
                    h: Math.round(r.height), w: Math.round(r.width),
                    font: cs.fontSize, weight: cs.fontWeight,
                    visible: r.width > 0 && r.height > 0,
                    text: a.textContent.trim().slice(0, 25),
                };
            });
        }""")
        print("HERO CTAs:", json.dumps(cta, ensure_ascii=False, indent=1))

        # سطح المكتب: إضافة عنصر ثم فحص الشارة بعناية
        ctxd = browser.new_context(viewport={"width": 1920, "height": 1080}, locale="ar-SA")
        paged = ctxd.new_page()
        errors = []
        paged.on("pageerror", lambda e: errors.append(str(e)))
        paged.goto(BASE + "/services/statistics-and-data-analysis", wait_until="domcontentloaded", timeout=60000)
        paged.wait_for_timeout(2500)
        paged.query_selector_all("button[aria-pressed]")[0].click()
        paged.wait_for_timeout(1500)
        probe = paged.evaluate("""() => {
            const raw = localStorage.getItem('umm-sara-cart-v1');
            const cart = raw ? JSON.parse(raw) : null;
            const buttons = Array.from(document.querySelectorAll('header button')).map(b => ({
                label: (b.getAttribute('aria-label') || '').slice(0, 40),
                tag: b.tagName,
                visible: b.offsetParent !== null,
            }));
            return {cartCount: cart ? cart.length : 0, buttons};
        }""")
        print("CART PROBE:", json.dumps(probe, ensure_ascii=False, indent=1))
        print("pageerrors:", errors if errors else "none")
        paged.screenshot(path=f"{ROOT}/download/v10-lessons/09-cart-debug-1920.png")
        browser.close()
finally:
    try:
        os.kill(server.pid, signal.SIGKILL)
        print(f"server killed pid={server.pid}")
    except ProcessLookupError:
        pass
