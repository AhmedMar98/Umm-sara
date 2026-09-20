#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Build Umm Reham static site, serve it, and screenshot both sites
(Umm Reham local preview + Umm Sara live) for the comparison.
All in one process run because background servers die between bash calls.
"""
import subprocess, time, os, sys, json

REHAM = "/home/z/my-project/scripts/umm-reham/umm-reham-frontend-main"
OUT = "/home/z/my-project/download/comparison/reham"
OUT_SARA = "/home/z/my-project/download/comparison/sara"
os.makedirs(OUT, exist_ok=True)
os.makedirs(OUT_SARA, exist_ok=True)

# ---------- 1. Build Umm Reham ----------
print("=" * 50)
print("STEP 1: Building Umm Reham static pages...")
r = subprocess.run(["node", "scripts/build-pages.js"], cwd=REHAM,
                   capture_output=True, text=True, timeout=120)
print(r.stdout[-1500:] if r.stdout else "")
if r.returncode != 0:
    print("BUILD STDERR:", r.stderr[-2000:])
    sys.exit(1)

# verify generated pages
gen = [f for f in os.listdir(os.path.join(REHAM, "public")) if f.endswith(".html")]
print("Generated HTML:", sorted(gen))

# ---------- 2. Start local server ----------
print("=" * 50)
print("STEP 2: Starting local server on :8090...")
srv = subprocess.Popen(
    ["python3", "-m", "http.server", "8090", "--directory", os.path.join(REHAM, "public")],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(2)

# quick check
import urllib.request
try:
    resp = urllib.request.urlopen("http://localhost:8090/index.html", timeout=10)
    print("Local server status:", resp.status, "size:", len(resp.read()))
except Exception as e:
    print("Server check FAILED:", e)
    srv.kill()
    sys.exit(1)

# ---------- 3. Screenshot both sites ----------
print("=" * 50)
print("STEP 3: Taking screenshots...")
from playwright.sync_api import sync_playwright

REHAM_PAGES = [
    ("home", "http://localhost:8090/index.html"),
    ("services", "http://localhost:8090/services.html"),
    ("store", "http://localhost:8090/store.html"),
    ("portfolio", "http://localhost:8090/portfolio.html"),
    ("about", "http://localhost:8090/about.html"),
    ("contact", "http://localhost:8090/contact.html"),
]
SARA_PAGES = [
    ("home", "https://umm-sara.vercel.app/"),
    ("services", "https://umm-sara.vercel.app/services"),
    ("consultation", "https://umm-sara.vercel.app/consultation"),
    ("cv-builder", "https://umm-sara.vercel.app/cv-builder"),
    ("plagiarism-check", "https://umm-sara.vercel.app/plagiarism-check"),
    ("about", "https://umm-sara.vercel.app/about"),
    ("contact", "https://umm-sara.vercel.app/contact"),
]

errors = []
with sync_playwright() as p:
    browser = p.chromium.launch(args=["--no-sandbox", "--disable-gpu"])
    ctx = browser.new_context(
        viewport={"width": 1440, "height": 900},
        locale="ar-SA",
        extra_http_headers={"Accept-Language": "ar"},
    )
    page = ctx.new_page()

    def shoot(name, url, outdir, prefix, wait_ms=3500, scroll_shots=2):
        try:
            page.goto(url, wait_until="networkidle", timeout=45000)
        except Exception as e:
            print(f"  [{prefix}/{name}] goto warning: {e}")
        page.wait_for_timeout(wait_ms)
        # top of page
        page.screenshot(path=os.path.join(outdir, f"{prefix}-{name}-top.png"))
        # scroll down for content sections
        height = page.evaluate("document.body.scrollHeight")
        vh = 900
        n = max(1, min(scroll_shots, (height // vh)))
        for i in range(1, n + 1):
            page.evaluate(f"window.scrollTo(0, {i * vh})")
            page.wait_for_timeout(900)
            page.screenshot(path=os.path.join(outdir, f"{prefix}-{name}-s{i}.png"))
        print(f"  [{prefix}/{name}] OK (page height {height}px)")

    print("-- Umm Reham (local preview):")
    for name, url in REHAM_PAGES:
        try:
            shoot(name, url, OUT, "reham")
        except Exception as e:
            errors.append(f"reham/{name}: {e}")
            print(f"  [reham/{name}] ERROR: {e}")

    print("-- Umm Sara (live Vercel):")
    for name, url in SARA_PAGES:
        try:
            shoot(name, url, OUT_SARA, "sara")
        except Exception as e:
            errors.append(f"sara/{name}: {e}")
            print(f"  [sara/{name}] ERROR: {e}")

    # Mobile shot of both home pages
    mob = browser.new_context(viewport={"width": 390, "height": 844},
                              locale="ar-SA", is_mobile=True, device_scale_factor=2)
    mp = mob.new_page()
    for prefix, url, outdir in [("reham", "http://localhost:8090/index.html", OUT),
                                ("sara", "https://umm-sara.vercel.app/", OUT_SARA)]:
        try:
            mp.goto(url, wait_until="networkidle", timeout=45000)
            mp.wait_for_timeout(3500)
            mp.screenshot(path=os.path.join(outdir, f"{prefix}-home-mobile.png"))
            print(f"  [{prefix} mobile] OK")
        except Exception as e:
            errors.append(f"{prefix} mobile: {e}")
            print(f"  [{prefix} mobile] ERROR: {e}")
    mob.close()
    browser.close()

srv.kill()
print("=" * 50)
print("DONE. Shots in:", os.path.dirname(OUT))
print("Errors:", errors if errors else "none")
