# دليل نشر منصة أم سارة — Render + Supabase

دليل تشغيلي كامل: من المستودع إلى موقع حي على الويب.

## البنية

```
[المستخدم] → Next.js على Render (umm-sarah-web)
                  ├── API Routes → Supabase PostgreSQL (طلبات/استشارات)
                  └── FastAPI على Render (umm-sarah-api) — PDF والذكاء الاصطناعي لاحقاً
```

| المكوّن | التقنية | مكان النشر |
|---|---|---|
| الواجهة + مسارات API | Next.js 16 + TypeScript | Render (خدمة Node) |
| الخدمة البرمجية | FastAPI (Python) | Render (خدمة Docker) |
| قاعدة البيانات | PostgreSQL + RLS | Supabase |

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

1. ارفع هذا المشروع إلى مستودع GitHub.
2. في [Render](https://render.com): **New → Blueprint** واختر المستودع — سيقرأ `render.yaml` وينشئ الخدمتين تلقائياً.
3. عند طلب المتغيرات السرية (`sync: false`) أدخل قيم Supabase من الخطوة 1:
   - `SUPABASE_URL` و `SUPABASE_SERVICE_ROLE_KEY` → لخدمة الويب
   - `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_WHATSAPP_NUMBER` → لخدمة الويب
   - `ALLOWED_ORIGINS` → لخدمة API (دومين خدمة الويب)
4. أيضاً من لوحة Supabase → **Authentication → URL Configuration** اضبط النطاقات المسموحة على دومين Render.

> **ملاحظة**: احذف `NEXT_PUBLIC_WHATSAPP_NUMBER` الافتراضي وضع رقمك الحقيقي بصيغة دولية بلا + (مثال: `966501234567`).

## الخطوة 3 — التحقق

- افتح دومين `umm-sarah-web` — الصفحة الرئيسية تعمل والسمة الداكنة افتراضية.
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
