#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Diagnose Sara mobile rendering: theme class, bg color, timing."""
from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(args=["--no-sandbox", "--disable-gpu"])
    # emulate mobile
    ctx = browser.new_context(
        viewport={"width": 390, "height": 844}, locale="ar-SA",
        is_mobile=True, device_scale_factor=2,
        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1")
    page = ctx.new_page()
    page.goto("https://umm-sara.vercel.app/", wait_until="domcontentloaded", timeout=60000)
    for wait in [1000, 3000, 6000]:
        page.wait_for_timeout(wait)
        info = page.evaluate("""() => ({
            htmlClass: document.documentElement.className,
            bodyBg: getComputedStyle(document.body).backgroundColor,
            bodyBgImage: getComputedStyle(document.body).backgroundImage.slice(0, 60),
            heroBg: (() => { const h = document.querySelector('section') || document.querySelector('main'); return h ? getComputedStyle(h).backgroundColor : 'no-section'; })(),
            canvasCount: document.querySelectorAll('canvas').length,
            textVisible: (() => { const h1 = document.querySelector('h1'); return h1 ? getComputedStyle(h1).color : 'no-h1'; })(),
            prefersColorScheme: matchMedia('(prefers-color-scheme: dark)').matches,
        })""")
        print(f"t+{wait}ms:", json.dumps(info, ensure_ascii=False))
    page.screenshot(path="/home/z/my-project/download/comparison/sara/sara-mobile-recheck.png")
    print("saved recheck screenshot")
    browser.close()
