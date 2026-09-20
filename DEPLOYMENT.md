# دليل نشر منصة أم سارة — Render + Supabase

دليل تشغيلي كامل: من المستودع إلى موقع حي على الويب.
**آخر تحديث: التلقائية الكاملة (2026-09-20)** — المستودع منشور على GitHub · `render.yaml` Blueprint جاهز بنقرة واحدة (`autoDeploy: true`) · GitHub Action جاهز لتطبيق مخطط Supabase تلقائياً · مسار البناء مُثبت بمحاكاة تثبيت نظيف كاملة (npm ci بظروف Render → بناء 22.4s بـ 18/18 صفحة → خادم standalone يستجيب 200).

## خريطة التلقائية (ماذا يحدث بعد أول إعداد)

```
كل push إلى main ──┬─→ Render (Blueprint, autoDeploy: true)
                    │     بناء + نشر تلقائي للواجهة — بلا أي تدخل
                    └─→ GitHub Action (إن مُسّ supabase/** )
                          تطبيق schema.sql على Supabase — بلا أي تدخل
```

الإعداد الأولي مرة واحدة فقط: (1) تشغيل المخطط على Supabase (يدوي أو بسر واحد)، (2) Render → New → Blueprint وملء 4 متغيرات سرية. بعدها الدورة كاملة تلقائية.

## البنية

```
[المستخدم] → Next.js على Render (umm-sarah-web)
                  └── API Routes → Supabase PostgreSQL (طلبات/استشارات)

FastAPI على Render (umm-sarah-api) — معطّلة مؤقتاً (PDF فيها TODO — انظر render.yaml)
```

| المكوّن | التقنية | مكان النشر |
|---|---|---|
| الواجهة + مسارات API | Next.js 16.1 (Turbopack) + TypeScript + three.js/R3F (مشهد اللؤلؤة) | Render (خدمة Node — المفعّلة الوحيدة) |
| الخدمة البرمجية | FastAPI (Python) | Render (Docker) — **معطّلة مؤقتاً** في `render.yaml` |
| قاعدة البيانات | PostgreSQL + RLS | Supabase |

## المستودع على GitHub

**مرتبط ومنشور**: <https://github.com/AhmedMar98/Umm-sara>

| الفرع البعيد | المحتوى |
|---|---|
| `main` | إصدار V10 كاملاً — تاريخ نشر نظيف (فرع يتيم من شجرة `main` المحلية المُتحقَّقة) + وسم `v10.0.0` + إصدار GitHub Release بأدلة البوابة |
| `history/full-v5-v10` | السلسلة المحلية الكاملة (نسخة احتياطية للأدلة: خط الصفر V5 → كل موجات V10) |

> **لماذا فرع نظيف يتيم؟** تاريخ `main` المحلي يحمل لقطتَي منصة تلقائيتين أضافتا ~285MB من كاش البناء (أكبر بلوب: 86.9MB من `.next/dev/cache/turbopack`) — دفعها إلى مستودع عام يلوّثه للأبد ولا يمكن تنظيفها لاحقاً إلا بإعادة كتابة التاريخ (وهي تكسر بصمات الكوميتات الموثقة في `BASELINE_V5.md` و`worklog.md`). السلسلة الكاملة محفوظة محلياً وفي فرع النسخة الاحتياطية.

```bash
# لتحديث لاحق على فرع النشر النظيف (ضغط جديد في كوميت واحد):
git checkout release-v10 && git merge main --squash && git commit && git push origin release-v10:main
```

**المستثنى من التتبع تلقائياً** (`.gitignore`): `node_modules/` و`.next/` و`research/` (أكواد مرجعية محفوظة الحقوق) و`reference-material/` و`upload/` وملفات `.env` وقواعد البيانات المحلية. **الشجرة المتعقبة = كود التطبيق + أدلة التحقق** (`download/` لقطات القياس، `scripts/` سكربتات الفحص القابلة لإعادة التشغيل).

> **تنبيه أمان**: إن كانت لديك ملفات `.env` محلية فهي لن تُرفع (مستثناة). أسرار الإنتاج تُدخل من لوحة Render مباشرة كما في الخطوة 2.

## الخطوة 1 — تجهيز Supabase (10 دقائق)

1. أنشئ مشروعاً جديداً على [supabase.com](https://supabase.com) (خطة Free تكفي للبداية).
2. طبّق المخطط — طريقان:
   - **يدوي (الأسرع الآن):** من **SQL Editor** شغّل كامل محتوى `supabase/schema.sql` — الملف idempotent (آمن للإعادة).
   - **تلقائي (سر واحد):** من لوحة Supabase → **Project Settings → Database → Connection string → URI** (اختر **Session pooler — منفذ 5432**)، ثم في GitHub → المستودع → **Settings → Secrets and variables → Actions → New repository secret**: الاسم `SUPABASE_DB_URL` والقيمة الرابط. بعدها GitHub Action جاهز (`.github/workflows/supabase-db.yml`) يطبّق المخطط تلقائياً عند كل تعديل يمس `supabase/`.
3. المخطط ينشئ: جداول `categories` / `subcategories` / `services` / `orders` / `consultations` / `testimonials` + البيانات الأولية للأقسام الستة و31 خدمة فرعية + سياسات RLS (قراءة عامة للمحتوى، كتابة عبر مفتاح الخادم فقط).
4. من **Project Settings → API** انسخ:
   - `Project URL` → متغير `SUPABASE_URL`
   - `service_role` (سري!) → متغير `SUPABASE_SERVICE_ROLE_KEY`

## الخطوة 2 — النشر على Render (5 دقائق)

1. المستودع منشور أصلاً على GitHub: `AhmedMar98/Umm-sara` (فرع `main`).
2. في [Render](https://render.com): **New → Blueprint** واختر المستودع — سيقرأ `render.yaml` وينشئ خدمة الويب تلقائياً.
3. عند طلب المتغيرات السرية (`sync: false`) أدخل قيم Supabase من الخطوة 1:
   - `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` → الإدراج الفعلي للطلبات
   - `NEXT_PUBLIC_SUPABASE_URL` → احتياط الكود (نفس Project URL)
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` → رقمك بصيغة دولية بلا `+` (مثال: `966501234567`) — يُدمج وقت البناء فاضبطه قبل أول نشر
4. اضغط Deploy — وبعدها كل push إلى `main` ينشر تلقائياً (`autoDeploy: true`).

> **ملاحظة**: `NEXT_PUBLIC_WHATSAPP_NUMBER` غير مضبوط = الرقم الافتراضي 966500000000 يُدمج في الحزمة. ضع رقمك الحقيقي قبل أول بناء.

## ما يحدث على Render أثناء البناء (تم التحقق منه فعلياً)

المسار المُثبت بمحاكاة كاملة على نسخة نظيفة من الكود (Task 17 — 2026-09-20: `git archive` → `NODE_ENV=production npm ci --legacy-peer-deps` → بناء → تشغيل standalone):

| الأمر | النتيجة المقاسة |
|---|---|
| `npm ci --legacy-peer-deps` | تثبيت نظيف بظروف Render (devDeps مُقصاة) — سكربتات prisma (توليد العميل) وsharp (الثلنات الأصلية) نجحت جميعها |
| `npm run build` | `next build` بنجاح: 18 مساراً (14 ثابت + 4 ديناميكي) في 22.4s بفحص TS مفعّل، ثم نسخ `static/` و`public/` داخل `.next/standalone/` |
| `npm run start` | `node .next/standalone/server.js` — جاهز في 62ms، استجابة 200 على الرئيسية + مسارات API تعمل (التدهور الرشيق بلا متغيرات مُثبت) |

> **لماذا `--legacy-peer-deps` إلزامي؟** سببان موثقان من سجل الأخطاء الفعلي:
> 1. `@lexical/yjs` (من سلسلة `@mdxeditor/editor`) يصرّح بـ peer على `yjs` لا يستورده التطبيق إطلاقاً — npm 11 يفرض بناءه في «الشجرة المثالية» فيفشل `npm ci` العادي بخطأ EUSAGE (مفقود: yjs).
> 2. `@react-three/fiber@9.7` يحمل peerOptional (expo-gl → expo → react-native) تسحب react-dom@19.3 الذي يصطدم بسقف fiber نفسه `react <19.3`.
>
> العلم يثبّت الشجرة المقفلة الحرفية — وهي شجرة متحقق منها فعلياً: بناء نظيف، صفر expo في الشجرة، تشغيل مثبت. مررنا بالتجربة أن بدونه يفشل البناء فشلاً حتمياً.

- **Node 20.19.0** مثبت في `render.yaml` (Next 16 يتطلب ≥ 20.9).
- جذر Turbopack مُثبَّت صراحةً في `next.config.ts` (يمنع استنتاج الجذر عند تعدد ملفات القفل).
- كل الخطوط (Amiri / Cairo / IBM Plex Arabic / IBM Plex Mono) **مدمجة ذاتياً عبر `next/font`** — لا طلبات خارجية لأي CDN خطوط وقت التشغيل.
- حزم وقت التشغيل الحرجة مضمّنة في الـ bundle: `lenis` (التمرير السلس) و`framer-motion` (لغة الحركة).

## أصول العلامة (v4) والمشهد السينمائي (v5)

- `public/favicon.svg` و `public/logo.svg` — شعار «قوس المعرفة واللؤلؤة» بصيغة SVG (خفيف وقابل للتكبير بلا فقدان).
- الشعار داخل الواجهة (الشريط، الفوتر، مركز مدار المعرفة) مُرسم كـ SVG inline عبر `src/components/brand/` — لا صور نقطية إطلاقاً.
- حركة شعار الدخول (`logo-construct`) تعمل تلقائياً مع احترام `prefers-reduced-motion`.
- **v5 — مشهد اللؤلؤة ثلاثي الأبعاد** (`src/components/brand/pearl-scene.tsx`): قوس ذهبي + لؤلؤة بشيدر iridescent + مدارات عقد متوهجة.
  - يعمل بـ three.js + @react-three/fiber فقط (لا GSAP — framer-motion+lenis يغطيان الحركة).
  - يُحمّل lazy في chunk منفصل بعد اكتمال بناء الشعار SVG — لا يمس LCP.
  - مسارات الحماية: لا WebGL/مسعّر برمجي → fallback لمدار SVG · `prefers-reduced-motion` → لا يُحمّل إطلاقاً · جوال → جزيئات مخففة + DPR≤1.5 · خارج الشاشة → تجميد كامل (frameloop=never).
  - مفتاح فحص `?force3d=1` يتجاوز رفض المسعّرات البرمجية فقط (بيئات CI/headless) — لا يمس بوابة reduced-motion.

## الخطوة 3 — التحقق بعد النشر

- افتح دومين `umm-sarah-web` — الصفحة الرئيسية تعمل والسمة الداكنة افتراضية مع شريط تقدم القراءة أعلى الشريط.
- أرسل نموذج طلب تجريبي → تحقق من ظهور صف في `orders` داخل Supabase (Table Editor).
- فحص إضافي (اختياري): `curl -o /dev/null -s -w "%{http_code}" <رابطك>` يرجع 200.
- خدمة FastAPI معطّلة مؤقتاً — عند تفعيلها لاحقاً يصبح `https://umm-sarah-api.onrender.com/health` يرجع `{"status":"ok"}`.

## متغيرات البيئة الكاملة

المرجع الكامل مع الشرح: `.env.example` في جذر المستودع.

| المتغير | الخدمة | السرية | الوصف |
|---|---|---|---|
| `SUPABASE_URL` | web | نعم | رابط مشروع Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | web | نعم | مفتاح الخادم (إدراج الطلبات) |
| `NEXT_PUBLIC_SUPABASE_URL` | web | لا | احتياط الكود (نفس Project URL) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | web | لا | رقم واتساب بصيغة دولية بلا + — يُدمج وقت البناء |
| `SUPABASE_DB_URL` | GitHub Secret | نعم | رابط Postgres (Session pooler) — يشغّل التطبيق التلقائي للمخطط |
| `ALLOWED_ORIGINS` | api | لا | مؤجلة — عند تفعيل خدمة FastAPI لاحقاً |

## التشغيل المحلي (للتطوير)

```bash
# الواجهة
npm install && npm run dev

# الخدمة البرمجية
cd api-service && pip install -r requirements.txt && uvicorn main:app --reload
```

المسارات تعمل حتى بلا متغيرات Supabase (قاعدة الاستقبال المنطقية) — لكن الإدراج الفعلي يتطلب ضبطها.

## تشغيل مسودة Supabase على المحتوى الديناميكي

الواجهة حالياً تقرأ من `src/lib/platform-data.ts` (ثابت ومضمون الأداء).
لتحويلها لقراءة حية من Supabase مستقبلاً: أنشئ `services` rows من
بيانات الملف نفسها (موجودة في `schema.sql`) واستبدل الاستيراد باستعلام
PostgREST بمفتاح `anon` — البنية جاهزة لذلك دون تغيير التصميم.

## الأمان

- مفتاح `service_role` يبقى في متغيرات بيئة Render فقط — لا يُكوَّن أبداً في كود العميل.
- RLS مُفعّل على كل الجداول؛ الكتابة العامة تمر حصراً عبر API Routes (جهة الخادم).
- `.env` مُستثنى من التتبع نهائياً (`.gitignore`)؛ `.env.example` مرجع بلا قيم حقيقية.
- سر `SUPABASE_DB_URL` يعيش في GitHub Secrets فقط (مشفّر) — لا يظهر في السجلات.
