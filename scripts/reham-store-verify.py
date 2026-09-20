#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Verify Umm Reham store products render + count real services/prices from local data."""
import subprocess, time, os, json

REHAM = "/home/z/my-project/scripts/umm-reham/umm-reham-frontend-main"
srv = subprocess.Popen(
    ["python3", "-m", "http.server", "8090", "--directory", os.path.join(REHAM, "public")],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(2)

from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(args=["--no-sandbox", "--disable-gpu"])
    page = browser.new_context(viewport={"width": 1440, "height": 900}, locale="ar-SA").new_page()
    page.goto("http://localhost:8090/store.html", wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(4000)

    data = page.evaluate("""() => {
        // try to find product/service cards rendered by store-data
        const cards = document.querySelectorAll('.ur-product-card, [class*=product], .card');
        // extract any prices visible
        const prices = Array.from(document.querySelectorAll('*'))
            .map(el => el.childNodes.length === 1 ? el.textContent.trim() : null)
            .filter(t => t && /ريال|ر\.س|SAR|\\d+\\s*ريال/.test(t)).slice(0, 12);
        const text = document.body.innerText;
        const err = text.includes('تعذّر تحميل الخدمات') || text.includes('تعذر تحميل الخدمات');
        const zero = /0\\s*خدمة/.test(text);
        const countM = text.match(/٢٦ خدمة|26 خدمة|٥٨ نموذج|58 نموذج/);
        return {
            productCards: cards.length,
            samplePrices: prices,
            loadError: err,
            zeroServices: zero,
            countsFound: countM ? countM[0] : null,
            bodySnippet: text.slice(text.indexOf('الكتالوج'), text.indexOf('الكتالوج') + 400),
        };
    }""")
    print(json.dumps(data, ensure_ascii=False, indent=2))
    browser.close()
srv.kill()
