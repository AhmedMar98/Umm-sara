#!/usr/bin/env python3
"""Vercel — إنشاء مشروع «أم سارة» + ربط GitHub + حقن متغيرات البيئة + إطلاق أول نشر production.
كل الخطوات عبر الـ API (توفره Hobby مجاني — بلا بطاقة). لا يُطبع أي سر."""
import json
import os
import sys
import urllib.error
import urllib.request

VT = os.environ.get("VERCEL_TOKEN", "")
GT = os.environ.get("GH_TOKEN", "")
assert VT and GT, "VERCEL_TOKEN / GH_TOKEN مطلوبة"

API = "https://api.vercel.com"
GH = "https://api.github.com"
SB_URL = "https://tmxjdxfechwqfweuvxul.supabase.co"
PROJECT = "umm-sara"
TEAM = "team_ViRpPxTCLW6hqqeGiKCUyNby"  # الفريق الشخصي الافتراضي للحساب

# service_role من ملف المفاتيح المؤقت (بلا طباعة)
service_role = None
for k in json.load(open("/tmp/sb-keys.json")):
    name = k.get("name") or (k.get("api_key") or {}).get("name")
    if name == "service_role":
        v = k.get("api_key") or k.get("value") or k
        if isinstance(v, dict):
            v = v.get("key") or v.get("value")
        service_role = v
        break
assert service_role, "service_role غير موجود في /tmp/sb-keys.json"


def call(method, path, payload=None, token=None, scope_team=None, base=API):
    url = base + path
    if scope_team:
        url += ("&" if "?" in url else "?") + "teamId=" + scope_team
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    })
    try:
        with urllib.request.urlopen(req) as r:
            body = r.read()
            return r.status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        raw = e.read().decode()[:800]
        try:
            return e.code, json.loads(raw)
        except Exception:
            return e.code, {"raw": raw}


SCOPE = {"teamId": None}  # يُضبط تلقائياً إن رفض النطاق الشخصي


def team():
    return SCOPE["teamId"]


# ── 0) التحقق من التوكن ──────────────────────────────────────────
st, res = call("GET", "/v2/user", token=VT)
print("[0] token =>", st, "| user:", res.get("user", {}).get("username"),
      "| plan:", res.get("user", {}).get("billing", {}).get("plan"))
assert st == 200, res

# ── 1) المشروع: موجود؟ وإلا أنشئه مربوطاً بـ GitHub ─────────────
st, proj = call("GET", f"/v9/projects/{PROJECT}", token=VT, scope_team=team())
if st == 200:
    print(f"[1] project {PROJECT} موجود مسبقاً:", proj.get("id"))
else:
    body = {
        "name": PROJECT,
        "gitRepository": {"type": "github", "repo": "AhmedMar98/Umm-sara"},
        "installCommand": "npm ci --legacy-peer-deps",  # المسار المُثبت في محاكاة Render (Task 17/19)
    }
    st, proj = call("POST", "/v9/projects", payload=body, token=VT)
    if st not in (200, 201):
        print("    إعادة المحاولة ضمن نطاق الفريق الشخصي ...")
        st, proj = call("POST", "/v9/projects", payload=body, token=VT, scope_team=TEAM)
        if st in (200, 201):
            SCOPE["teamId"] = TEAM
    print("[1] create project =>", st)
    if st not in (200, 201):
        print(json.dumps(proj, ensure_ascii=False)[:600])
        sys.exit(1)

link = proj.get("link") or {}
print("    id:", proj.get("id"))
print("    git:", link.get("type"), "|", (link.get("org") or "?") + "/" + (link.get("repo") or "?"),
      "| branch:", link.get("productionBranch"))

# ضمان فرع الإنتاج = main
if link.get("productionBranch") not in (None, "main"):
    st, _ = call("PATCH", f"/v9/projects/{PROJECT}",
                 payload={"productionBranch": "main"}, token=VT, scope_team=team())
    print("[1b] productionBranch => main:", st)

# ── 2) متغيرات البيئة (upsert قبل النشر — NEXT_PUBLIC تُدمج وقت البناء) ──
for key, value in [
    ("SUPABASE_URL", SB_URL),
    ("SUPABASE_SERVICE_ROLE_KEY", service_role),
    ("NEXT_PUBLIC_SUPABASE_URL", SB_URL),
    ("NEXT_PUBLIC_WHATSAPP_NUMBER", "966500000000"),
    ("NEXT_TELEMETRY_DISABLED", "1"),
]:
    # POST ينشئ (الـ PUT/upsert غير موجود — 404). إن وُجد مسبقاً: PATCH بالمعرّف.
    st, res = call("POST", f"/v10/projects/{proj['id']}/env", payload={
        "key": key, "value": value, "type": "encrypted",
        "target": ["production", "preview"],
    }, token=VT, scope_team=team())
    if st in (400, 409):
        st2, lst = call("GET", f"/v9/projects/{proj['id']}/env", token=VT, scope_team=team())
        eid = next((e["id"] for e in lst.get("envs", []) if e["key"] == key), None)
        if eid:
            st, res = call("PATCH", f"/v10/projects/{proj['id']}/env/{eid}", payload={
                "value": value, "target": ["production", "preview"],
            }, token=VT, scope_team=team())
    print(f"[2] env {key:<32} => {st}")
    if st not in (200, 201):
        print("   ", json.dumps(res, ensure_ascii=False)[:400])
        sys.exit(1)

# ── 3) معلومات GitHub: رقم المستودع + آخر كوميت على main ────────
st, repo = call("GET", "/repos/AhmedMar98/Umm-sara", token=GT, base=GH)
print("[3] github repo =>", st, "| id:", repo.get("id"), "| default:", repo.get("default_branch"))
assert st == 200, repo
st, commit = call("GET", "/repos/AhmedMar98/Umm-sara/commits/main", token=GT, base=GH)
sha = commit.get("sha", "")
print("    main HEAD:", sha[:12])

# ── 4) إطلاق نشر production من git (ثلاث صيغ — الأولى الناجحة تفوز) ──
variants = [
    {"name": PROJECT, "target": "production",
     "gitSource": {"type": "github", "repoId": repo["id"], "ref": "main"},
     "meta": {"githubCommitRef": "main", "githubCommitSha": sha,
              "githubRepo": "AhmedMar98/Umm-sara"}},
    {"name": PROJECT, "target": "production",
     "gitSource": {"type": "github", "repo": "AhmedMar98/Umm-sara", "ref": "main"},
     "meta": {"githubCommitRef": "main", "githubCommitSha": sha,
              "githubRepo": "AhmedMar98/Umm-sara"}},
]
dep = None
for i, body in enumerate(variants, 1):
    st, res = call("POST", "/v13/deployments", payload=body, token=VT, scope_team=team())
    print(f"[4] deploy (صيغة {i}) => {st}")
    if st in (200, 201):
        dep = res
        break
    print("   ", json.dumps(res, ensure_ascii=False)[:300])

if not dep:
    print("فشل إطلاق النشر — الأسباب أعلاه")
    sys.exit(1)

print("    deployment id:", dep.get("id"))
print("    deployment url:", dep.get("url"))
print("    readyState:", dep.get("readyState"))
json.dump({"id": dep.get("id"), "url": dep.get("url"),
           "teamId": SCOPE["teamId"], "project": PROJECT},
          open("/tmp/vercel-deploy.json", "w"))
print("SAVED /tmp/vercel-deploy.json — الخطوة التالية: vercel-poll.py")
