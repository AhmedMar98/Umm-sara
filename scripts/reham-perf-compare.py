#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Measure performance of both sites: Umm Reham (local preview) vs Umm Sara (live).
Single process: build+serve+measure (servers die between bash calls).
"""
import subprocess, time, os, sys, json

REHAM = "/home/z/my-project/scripts/umm-reham/umm-reham-frontend-main"

# Start local server (pages already built in previous run)
srv = subprocess.Popen(
    ["python3", "-m", "http.server", "8090", "--directory", os.path.join(REHAM, "public")],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(2)

from playwright.sync_api import sync_playwright

TARGETS = {
    "reham-home": "http://localhost:8090/index.html",
    "sara-home": "https://umm-sara.vercel.app/",
    "reham-services": "http://localhost:8090/services.html",
    "sara-services": "https://umm-sara.vercel.app/services",
    "reham-store": "http://localhost:8090/store.html",
    "sara-cvbuilder": "https://umm-sara.vercel.app/cv-builder",
}

results = {}
with sync_playwright() as p:
    browser = p.chromium.launch(args=["--no-sandbox", "--disable-gpu"])
    ctx = browser.new_context(viewport={"width": 1440, "height": 900}, locale="ar-SA")
    page = ctx.new_page()

    # network capture helper
    def measure(name, url):
        reqs, bytes_total = [], 0
        def on_response(r):
            nonlocal bytes_total
            try:
                h = r.headers
                cl = h.get("content-length")
                if cl:
                    bytes_total += int(cl)
                else:
                    bytes_total += len(r.body()) if r.request.resource_type in ("script", "stylesheet", "document", "font", "image", "media") else 0
                reqs.append({"url": r.url.split("?")[0][-70:], "type": r.request.resource_type})
            except Exception:
                pass
        page.on("response", on_response)
        t0 = time.time()
        try:
            page.goto(url, wait_until="load", timeout=60000)
        except Exception as e:
            print(f"  [{name}] goto err: {e}")
        load_s = time.time() - t0
        page.wait_for_timeout(4000)  # settle 3D/motion
        # core web vitals approximations via JS
        vitals = page.evaluate("""() => {
            const nav = performance.getEntriesByType('navigation')[0];
            const paints = performance.getEntriesByType('paint');
            const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
            return {
                ttfb: nav ? Math.round(nav.responseStart - nav.startTime) : null,
                domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd) : null,
                loadEvent: nav ? Math.round(nav.loadEventEnd) : null,
                fcp: paints.find(x => x.name === 'first-contentful-paint')?.startTime || null,
                lcp: lcpEntries.length ? Math.round(lcpEntries[lcpEntries.length-1].startTime) : null,
                transferSize: nav ? nav.transferSize : null,
                domNodes: document.querySelectorAll('*').length,
                htmlKB: Math.round(document.documentElement.outerHTML.length / 1024),
                title: document.title,
                hasMetaDesc: !!document.querySelector('meta[name=description]'),
                hasOgTags: !!document.querySelector('meta[property^="og:"]'),
                hasCanonical: !!document.querySelector('link[rel=canonical]'),
                hasH1: !!document.querySelector('h1'),
                langAttr: document.documentElement.lang,
                dirAttr: document.documentElement.dir,
                imgsNoAlt: Array.from(document.images).filter(i => !i.alt).length,
                ariaLabels: document.querySelectorAll('[aria-label]').length,
            };
        }""")
        page.remove_listener("response", on_response)
        results[name] = {
            "url": url,
            "requests": len(reqs),
            "approx_bytes": bytes_total,
            "load_s": round(load_s, 2),
            "vitals": vitals,
            "types": {},
        }
        from collections import Counter
        c = Counter(r["type"] for r in reqs)
        results[name]["types"] = dict(c)
        print(f"  [{name}] load={load_s:.2f}s reqs={len(reqs)} bytes={bytes_total/1024:.0f}KB "
              f"domNodes={vitals['domNodes']} htmlKB={vitals['htmlKB']}")

    print("Measuring (2 runs each, showing final):")
    for n, u in TARGETS.items():
        measure(n, u)          # warm run (cache priming)
        results.pop(n, None)
        measure(n, u)           # measured run

    browser.close()

srv.kill()

# summary table
print("\n" + "=" * 60)
print(f"{'PAGE':<18}{'LOAD s':>8}{'REQS':>7}{'SIZE KB':>10}{'DOM':>8}{'HTML KB':>9}")
for k, v in results.items():
    print(f"{k:<18}{v['load_s']:>8}{v['requests']:>7}{v['approx_bytes']/1024:>10.0f}"
          f"{v['vitals']['domNodes']:>8}{v['vitals']['htmlKB']:>9}")

with open("/home/z/my-project/download/comparison/perf-metrics.json", "w") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print("\nSaved: download/comparison/perf-metrics.json")
