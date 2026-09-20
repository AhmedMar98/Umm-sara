#!/usr/bin/env python3
"""مراقبة نشر Vercel حتى الحكم النهائي: READY / ERROR / CANCELED."""
import json
import os
import time
import urllib.error
import urllib.request

d = json.load(open("/tmp/vercel-deploy.json"))
VT = os.environ.get("VERCEL_TOKEN", "")
API = "https://api.vercel.com"


def call(path):
    url = API + path
    if d.get("teamId"):
        url += ("&" if "?" in url else "?") + "teamId=" + d["teamId"]
    req = urllib.request.Request(url, headers={
        "Authorization": f"Bearer {VT}", "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        try:
            return e.code, json.loads(e.read().decode()[:500])
        except Exception:
            return e.code, {}


did = d["id"]
print("deployment:", did)
print("url:", d.get("url"))
last = None
deadline = time.time() + 540  # 9 دقائق
while time.time() < deadline:
    st, dep = call(f"/v13/deployments/{did}")
    if st == 200:
        state = dep.get("readyState")
        if state != last:
            print("state:", state, flush=True)
            last = state
        if state in ("READY", "ERROR", "CANCELED"):
            print("FINAL:", state)
            print("alias:", dep.get("alias"))
            break
    else:
        print("poll status:", st, str(dep)[:200], flush=True)
    time.sleep(15)
else:
    print("انتهت مهلة المراقبة (9 دقائق) — النشر قد يكون لا يزال قيد البناء")
