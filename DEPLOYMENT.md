# دليل نشر منصة أم سارة — Render + Supabase

دليل تشغيلي كامل: من المستودع إلى موقع حي على الويب.
**آخر تحديث: V10 (2026-09-20)** — مسار النشر محاكى ومُثبت من npm ci إلى استجابة 200 (v4) · تحقق V10 الكامل: بناء بفحص TS مفعّل + 13/13 مساراً 200 + هرمية h1=1 + هوية بكسلية 4/4 متطابقة مع خط الصفر.

## البنية

```
[المستخدم] → Next.js على Render (umm-sarah-web)
                  ├── API Routes → Supabase PostgreSQL (طلبات/استشارات)
                  └── FastAPI على Render (umm-sarah-api) — PDF والذكاء الاصطناعي لاحقاً
```

| المكوّن | التقنية | مكان النشر |
|---|---|---|
| الواجهة + مسارات API | Next.js 16.1 (Turbopack) + TypeScript + three.js/R3F (مشهد اللؤلؤة) | Render (خدمة Node) |
| الخدمة البرمجية | FastAPI (Python) | Render (خدمة Docker) |
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
2. من **SQL Editor** شغّل كامل محتوى `supabase/schema.sql` — سينشئ:
   - جداول `categories` / `subcategories` / `services` / `orders` / `consultations` / `testimonials`
   - البيانات الأولية للأقسام الستة و31 خدمة فرعية
   - سياسات RLS (قراءة عامة للمحتوى، كتابة عبر مفتاح الخادم فقط)
3. من **Project Settings → API** انسخ:
   - `Project URL` → متغير `SUPABASE_URL`
   - `anon public` → متغير `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` (سري!) → متغير `SUPABASE_SERVICE_ROLE_KEY`

## الخطوة 2 — النشر على Render (5 دقائق)

1. ارفع المستودع إلى GitHub (كما في القسم السابق).
2. في [Render](https://render.com): **New → Blueprint** واختر المستودع — سيقرأ `render.yaml` وينشئ الخدمتين تلقائياً.
3. عند طلب المتغيرات السرية (`sync: false`) أدخل قيم Supabase من الخطوة 1:
   - `SUPABASE_URL` و `SUPABASE_SERVICE_ROLE_KEY` → لخدمة الويب
   - `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_WHATSAPP_NUMBER` → لخدمة الويب
   - `ALLOWED_ORIGINS` → لخدمة API (دومين خدمة الويب)
4. أيضاً من لوحة Supabase → **Authentication → URL Configuration** اضبط النطاقات المسموحة على دومين Render.

> **ملاحظة**: احذف `NEXT_PUBLIC_WHATSAPP_NUMBER` الافتراضي وضع رقمك الحقيقي بصيغة دولية بلا + (مثال: `966501234567`).

## ما يحدث على Render أثناء البناء (تم التحقق منه فعلياً)

المسار المُثبت بمحاكاة كاملة على نسخة نظيفة من الكود:

| الأمر | النتيجة المقاسة |
|---|---|
| `npm ci --legacy-peer-deps` | 838 حزمة + three — يعتمد على `package-lock.json` (موجود في الجذر) |
| `npm run build` | `next build` بنجاح: 18 مساراً (14 ثابت + 4 ديناميكي) ثم نسخ `static/` و`public/` داخل `.next/standalone/` |
| `npm run start` | `node .next/standalone/server.js` — استجابة 200 على الصفحات الرئيسية والخدمات وباني السيرة |

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
- `https://umm-sarah-api.onrender.com/health` يجب أن يرجع `{"status":"ok"}`.

## متغيرات البيئة الكاملة

| المتغير | الخدمة | السرية | الوصف |
|---|---|---|---|
| `SUPABASE_URL` | web | نعم | رابط مشروع Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | web | نعم | مفتاح الخادم (إدراج الطلبات) |
| `NEXT_PUBLIC_SUPABASE_URL` | web | لا | رابط عام للقراءات المستقبلية |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | web | لا | رقم واتساب بصيغة دولية بلا + |
| `API_SERVICE_URL` | web | لا | رابط خدمة FastAPI |
| `ALLOWED_ORIGINS` | api | لا | النطاقات المسموحة في CORS |

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
