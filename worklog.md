# Worklog — Multi-Agent Shared Log

---
Task ID: 7
Agent: main (Super Z)
Task: المرحلة v5 — تنظيف Markdown + تدقيق + بحث موثق (GitHub/Gitee/Drive/Framer) + مشهد اللؤلؤة ثلاثي الأبعاد (three.js/R3F) داخل نظام هوية v4

Work Log:
- تفكيك نقدي لتوجيه المستخدم (ازدواج مراجع، تعارض مكدس 3D مع قواعد الأداء، ادعاءات GPT غير موثقة) ثم إعادة كتابته كتوجيه حاكم مضغوط نُفذ حرفياً
- تنظيف Markdown: حُذف 13 ملفاً بعد فحص المحتوى (DESIGN_v2/v3 + 6 تحليلات مراجع + 5 تقارير QA + download/README قديم) — بقي: DEPLOYMENT.md + worklog.md + services-data.md (بيانات المستخدم المصدرية) + أرشيف المستخدم القديم كاملاً (لا يُمس)
- البحث الموثق: استنساخ المستودعات الأربعة (mcarbonell/web-templates, elijah-farrell/Awwwards-Portfolio, shellcat-com/formwork, tsogjavklann/awwwards-3d) + نزّل مجلد Drive (5 ملفات zip مرآة للمستودعات) + GitHub API (HamishMW ★3536، fireship ★1666، awwwards 2311 مستودعاً) + Gitee API 403 (معدل IP) فعُوّض بـ web-search (مشروع gitee واحد موثق) + فحص Framer (Elements/Conicorn حقيقيان، framer.link خلف تسجيل دخول) + ادعاءات «Satori Web» و«2026 Portfolio» و«Aether» تعذر التحقق → أُعلنت مستبعدة
- قراءة أكواد المراجع فعلياً: minimal.html (534 سطراً: damp-state، RoomEnvironment/PMREM، إضاءة ثلاثية، رفض SwiftShader، post-processing chain)، Planet.jsx (نمط R3F+useGSAP)، PROCEDURAL_GEOMETRY.md («الهندسة الإجرائية أولاً»)، formwork («27 قالباً MIT بلا build» مؤكد من الميتا)
- وثيقة الاتجاه: research/DESIGN_v5.md (5 مراجع رئيسة + ميزانية تقنية + قائمة سلبية لما لا يُمس)
- المكتبات: three@0.186 + @react-three/fiber@9.7 فقط (GSAP مستبعد بقرار موثق: ازدواج نظام حركة مع framer-motion+lenis) — تثبيت نظيف بلا سلسلة expo بعد حذف node_modules القديم (كان bun بـ react 19.3) وreinstall من package-lock (react 19.2.3 داخل نطاق fiber) وحذف bun.lock نهائياً
- مشهد اللؤلؤة (src/components/brand/pearl-scene.tsx): قوس torus مزدوج (ذهبي + زمردي داخلي) يُرسم تدريجياً بـ drawRange (يحاكي بناء الشعار) + لؤلؤة بشيدر fresnel iridescent (ذهبي↔زمردي) + specular ناعم + تنفس + مدارا عقد متوهجة (شيدر twinkle حتمي mulberry32) + غبار قشرة كروية + هالة بديل bloom + كاشدة صادى الشعار؛ كاميرا doll-in 8.8→6.15 + parallax مؤشر + انجراف تمريري — كل الحركة بنمط damp المستقل عن الإطارات من awwwards-3d
- hero-visual.tsx: بوابة تحسين تدريجي — مدار SVG يظهر أولاً دائماً ثم تقاطع 1.4s مع المشهد بعد 2.2s؛ كشف WebGL برفض SwiftShader/llvmpipe؛ reduced-motion → لا يُحمّل الـ 3D إطلاقاً؛ IO تجميد خارج الشاشة؛ key=theme لإعادة البناء عند التبديل؛ ?force3d=1 مفتاح فحص (يتجاوز رفض المسعّر البرمجي فقط)
- معارك الجودة أثناء التنفيذ: مترجم React صارم — 3 جولات إعادة هيكلة: lazy-ref ثم البناء التصريحي الكامل (مواد عبر args من useMemo، تحوير عبر مراجع الميش في useFrame فقط) — النتيجة: بنية تصريحية متوافقة مع المترجم بلا أي تعطيل قواعد
- VLM-QA جولتان: الأولى (8.5/8/8.5/7) كشفت اقتصاص قمة القوس بعد التمرير + خفوت اللؤلؤة جوالاً → خُفّض انجراف الكاميرا (z 0.85→0.45، y 0.22→0.08) + طبقة الجوال 40% + مزيج قزحي 0.42→0.48 → الثانية: 9/10 desktop + PASS اقتصاص + PASS وضوح → ضبط نهائي 35%
- اكتشاف نشر حرج: npm ci العادي يفشل بخطأ EUSAGE (مفقود yjs) — الجذر الموثق: @lexical/yjs من @mdxeditor يصرح بـ peer غير مستخدم + سلسلة peerOptional لـ fiber تسحب react-dom 19.3 فوق سقفها → buildCommand أصبح `npm ci --legacy-peer-deps && npm run build` (render.yaml + render-sim.sh + DEPLOYMENT.md موثقة بالسبب)
- محاكاة Render كاملة نجحت: npm ci --legacy-peer-deps (exit 0) → build (18 مساراً) → خادم إنتاج 200 على / و/services وcv-builder + علامات v4 محفوظة (logo-construct/tablist/أم سارة) + chunk شيدر المشهد (uEmerald) مثبت في static chunks (lazy-split ناجح) + favicon/logo 200
- التحقق النهائي: tsc نظيف + eslint صفر أخطاء على src كاملاً + build نظيف مرتين + 7 لقطات في download/v5-screenshots/

Stage Summary:
- v5 مطبقة فعلياً داخل المشروع: طبقة سينمائية 3D حقيقية (three/R3F) مدموجة في هوية v4 بلا أي Frankenstein — الشعار يُبنى SVG ثم «يستيقظ» ثلاثي الأبعاد
- الوظائف كلها محفوظة (لا تغيير في أي مسار/نموذج/منطق) — فقط page.tsx عمودان بصريان + globals.css حركة scene-in
- مخرجات البحث: research/DESIGN_v5.md + research/vlm-qa-v5.md + مستودعات github-refs (4 جديدة) + zips Drive في reference-material/drive-v5/
- تنظيف: 13 ملف md حذفاً + bun.lock حُذف (مصدر تعارض تعدد القفل سابقاً)
- المتبقي للإنتاج: متغيرات Render/Supabase + رقم واتساب (كما المراحل السابقة — خارج هذه البيئة)

---
Task ID: 6
Agent: main (Super Z)
Task: تحقق من سؤال المستخدم «هل أنت متأكد أنك حدّثت النشر؟ بحسب التقرير النهائي — المرحلة v4» → تدقيق طبقة النشر فعلياً وإصلاحها

Work Log:
- سؤال المستخدم كشف أن «النشر» لم يكن محدثاً فعلياً رغم نجاح بناء v4 محلياً — الفحص أثبت خللين حقيقيين كانا سيفشلان النشر على Render:
  1) render.yaml يستخدم `npm ci` والمشروع فيه bun.lock فقط بلا package-lock.json → فشل البناء محتوم على Render
  2) سكربت start يشغّل `bun .next/standalone/server.js` وbun غير متوفر على بيئة Node في Render → انهيار الخدمة عند الإقلاع
- الإصلاح 1: توليد package-lock.json عبر `npm install --package-lock-only` (lockfileVersion 3، 939 حزمة، حلول متوافقة: next 16.1.3 / lenis 1.3.26 / react 19.2.3)
- الإصلاح 2: start أصبح `node .next/standalone/server.js` (محايد لبيئة النشر)
- الإصلاح 3 (مكشوف أثناء المحاكاة): تحذير استنتاج جذر مساحة العمل عند تعدد ملفات القفل → تثبيت `turbopack.root = path.resolve(__dirname)` في next.config.ts (توصية Next.js الرسمية نصاً)
- محاكاة كاملة لمسار Render في نسخة معزولة (scripts/render-sim.sh → render-sim/): npm ci (838 حزمة، exit 0) → npm run build (18 مساراً، صفر تحذيرات بعد تثبيت الجذر) → node standalone على منفذ 3100 → HTTP 200 على / و/services وcv-builder
- التحقق من v4 في HTML المُقدَّم من خادم الإنتاج: logo-construct ×4 + tablist (عرض المنتجات) + أم سارة ×17 + favicon.svg وlogo.svg برمز 200
- إضافة .gitignore (كان مفقوداً كلياً — الرفع بدونه كان سينشر node_modules وresearch بأكواد المواقع المحفوظة الحقوق وreference-material بملفات المستخدم الخاصة)
- تحديث render.yaml: NODE_VERSION من 20.11.1 إلى 20.19.0
- إعادة كتابة DEPLOYMENT.md ليعكس v4: قائمة ما يُرفع للمستودع، جدول المسار المُثبت بالقياس، أصول العلامة (SVG)، الخطوط المدمجة ذاتياً عبر next/font، lenis مضمّن
- إعادة تشغيل خادم المعاينة بالإعدادات الجديدة (200) وحذف render-sim (~1GB)

Stage Summary:
- الجواب الصادق لسؤال المستخدم: لا — البناء المحلي لـ v4 نجح لكن طبقة النشر لم تكن محدثة، وتم إصلاحها الآن وإثباتها بمحاكاة كاملة من npm ci حتى استجابة 200
- الملفات المعدلة: package.json (start) + package-lock.json (جديد) + next.config.ts (turbopack.root) + render.yaml (Node 20.19.0) + DEPLOYMENT.md (إعادة كتابة v4) + .gitignore (جديد)
- الأدلة: scripts/render-sim.log + scripts/render-sim-home.html (HTML الإنتاجي الفعلي)
- المتبقي للإنتاج (خارج بيئة العمل هذه): متغيرات Supabase/واتساب على لوحة Render — لا يمكن إنشاؤها محلياً

---
Task ID: 2
Agent: main (Super Z)
Task: بناء منصة أم سارة كاملة (Next.js + Python + Supabase + Render) بعد اعتماد القرارات

Work Log:
- عُقدت أسئلة توضيحية وحُسمت: هجين بصري، Next.js+Python، كل الصفحات، نموذج+واتساب+حجز، داكن+فاتح، هوية «أم سارة»، Render+Supabase
- بُني نظام تصميم هجين: داكن افتراضي (#050807 + زمردي #10B981 + ذهبي #D6B25E)، شبكة تقنية overlay، Cairo/IBM Plex Arabic/Plex Mono
- بُني ParticleField (canvas تفاعلي، جزيئات زمردي/ذهبي، خطوط ربط، تفاعل مؤشر، DPR-aware، reduced-motion)
- الصفحات: الرئيسية (Hero+إحصائيات متحركة+6 أقسام+منتجان+آلية عمل+آراء+CTA)، الخدمات (بحث حي)، [category] ديناميكية لستة أقسام مع ?service=، CV Builder (3 قوالب، معاينة حية، autosave، تصدير طباعة A4، نموذج جاهز)، فحص الأصالة، من نحن، تواصل، حجز استشارة
- مسار العمل: نموذج → POST /api/orders (zod) → Supabase PostgREST (service_role) → فتح واتساب برسالة معبأة
- Supabase: schema.sql كامل (6 جداول + فهارس + RLS + seed 6 أقسام/31 خدمة فرعية/آراء)
- FastAPI: api-service/ (main.py + requirements + Dockerfile) لخدمة PDF مستقبلاً
- render.yaml: خدمتان (web: Node، api: Docker) + DEPLOYMENT.md دليل عربي كامل
- إصلاحات أثناء التحقق: حدف onClick من Server Component في [category]/page.tsx (خطأ Runtime)؛ نمط ThemeToggle بلا setState-in-effect
- تحقق ذاتي شامل بالمتصفح: 13 لقطة (داكن/فاتح/جوال)، إرسال نموذج فعلي فتح واتساب برسالة كاملة، API رد 200 مع fallback، lint نظيف، dev.log بلا أخطاء

Stage Summary:
- المخرجات: تطبيق كامل قابل للتشغيل في المعاينة + 13 لقطة واجهة في download/interface-screenshots/ + supabase/schema.sql + api-service/ + render.yaml + DEPLOYMENT.md
- القرارات: Supabase عبر PostgREST fetch (بلا حزم)، fallback منطقي بلا أسرار، بيانات ثابتة مصدرها services-data.md وجاهزة للتحويل لقراءة حية
- متبقٍ للإنتاج: ضبط متغيرات البيئة في Render، تشغيل schema.sql في Supabase، رقم واتساب حقيقي، تفعيل توليد reportlab في api-service

---
Task ID: 1
Agent: main (Super Z)
Task: جمع السياق الكامل للمشروع قبل التحليل النقدي وإعادة الكتابة

Work Log:
- نُزِّل مجلد جوجل درايف عبر gdown إلى /home/z/my-project/drive_files/مشروع/ (5 صور + services-data.md + umm-reham-main.zip)
- قُرِئ services-data.md بالكامل: 10 أقسام خدمات → 6 أقسام Navbar، منتجان مستقلان (CV Builder، فحص الأصالة)، مخطط قاعدة بيانات مقترح (services/categories/subcategories)، لغة عربية RTL
- فُحِص zip المشروع: Angular 19+ frontend + ASP.NET Core 9 backend (Clean Architecture)، SQLite، لوحة تحكم، خريطة Leaflet، وكلاء AI (سعود وفرح)، 4 سمات ألوان
- حُلِّلت 4 صور مرجعية عبر VLM: منصات سعودية فاخرة (داكن زمردي/ذهبي، أفق الرياض، أشرطة إحصائيات، مؤشرات ثقة، CTA "ابدأ طلبك الآن")
- حُلِّل activetheory.net عبر متصفح آلي + VLM: جمالية داكنة غامرة، WebGL، جزيئات، سماوي كهربائي/قزحي، طباعة تقنية monospace، سينمائية بسيطة

Stage Summary:
- المشروع: منصة "أم رهام" للخدمات الأكاديمية والبحثية (سعودية، RTL)
- تعارض بصري مكتشف بين 3 مصادر: activetheory (تقني داكن) / صور درايف (فخامة سعودية ذهبي-زمردي) / zip القديم (4 سمات)
- فجوات جوهرية: نطاق إعادة البناء، المكدس التقني، قائمة الواجهات، مسار الطلب/الحجز، صيغة تسليم الواجهات
- الملفات: تحليلات الصور في /home/z/my-project/img*_analysis.json، لقطات الموقع في /home/z/my-project/reference_shots/

---
Task ID: 3
Agent: main (Super Z)
Task: رفض الهوية البصرية v1 → بحث ميداني (Pinterest + awwwards + activetheory) → تحديث الأكواد والهوية إلى v2

Work Log:
- رفض المستخدم الهوية الأولى وطلب: دخول Pinterest للبحث (web/ui/ux/colors) + تنزيل مشاريع من awwwards.com وقراءة أكوادها وتحديث أكوادنا، مع activetheory.net كنموذج
- awwwards: تصفح قائمة الفائزين، استخراج روابط 7 مواقع حية، لقطات hero/mid (14 لقطة في research/awwwards/)
- تنزيل أكواد 6 مواقع فائزة (HTML+CSS ~1.5MB في research/code-samples/): noho, white-desert, cerebrium, lxl, aspen, warmnfuzzy
- قراءة الأكواد واستخراج الأنماط: Lenis في كل المواقع الستة، GSAP، OGL، noise بـ steps(2,end)، cubic-bezier(.16,1,.3,1)/(.76,0,.24,1)، مصفوفات توكنات الألوان
- Pinterest محجوب بجدار تسجيل للبحث → بديل: image-search (4 استعلامات × 8 = 32 صورة مودبورد) + تحليل VLM تخليصي (hex الألوان والأنماط)
- تحليل VLM للقطات الفائزة + ربطه بتحليل activetheory السابق → وثيقة research/DESIGN_v2.md
- التنفيذ: globals.css جديد بالكامل (توكنز دافئة: #080E0B/#F4F1E8/#C5A059→#E8D48B/#16A37A + حبيبات فيلم + أورورا + مؤشر مخصص + لمعان سفحي + إطار-داخل-إطار + منحنيات الحركة)
- مكونات جديدة: film-grain.tsx، cursor-glow.tsx، smooth-scroll.tsx (Lenis@1.3.26 ديناميكي التحميل)
- ترقية: particle-field.tsx (عمق ثلاثي: غبار/متوسط/بوكيه + parallax كاميرا)، reveal.tsx (أرقام ذهبية عملاقة)، section-blocks.tsx (فهرس رقمي + خط شعري)، navbar (خط ذهبي + شعار Amiri + كشف سفلي)، footer (توهج ختامي)
- page.tsx: هيرو سينمائي 92svh بأركان mono + كلمة Amiri ذهبية + شريط marquee خدمات + إحصائيات بخطوط شعرية + CTA بإطار متدرج وعلامات أركان
- خط Amiri عبر next/font (400/700 عادي/مائل) كصوت الفخامة
- التحقق: كل الصفحات 200، lint نظيف، Lenis مؤكد نشطاً، VLM-QA للتصميم: تحقق الهوية 9/10 (فاتح دافئ سليم + جوال متكيف + لا قصّ فعلي)
- 12 لقطة جديدة في download/v2-screenshots/ + README محدث

Stage Summary:
- الهوية v2 مبنية على أدلة منزّلة ومقروءة (لا ذوق مجرد): داكن غابي دافئ + ذهبي عتيق→شمبانيا متدرج + زمردي + Amiri/mono + حبيبات + مؤشر مخصص + Lenis
- المواد البحثية محفوظة في research/ (لقطات + أكواد + مودبورد + تحليلات + وثيقة القرار)
- جاهز للاعتماد: إن أقرّ المستخدم الاتجاه تُعمَّم أنماط v2 على بقية تفاصيل الصفحات الداخلية وتبدأ مرحلة النشر على Render+Supabase

---
Task ID: 4
Agent: main (Super Z)
Task: تعلم من 3 فيديوهات Pinterest + تحسين موجّه شامل للواجهة القائمة (v3) وفق عملية المهندس الأول (تدقيق → مراجع → اتجاه → تنفيذ → استجابة → تلميع → تحقق)

Work Log:
- حُلّلت روابط pin.it الثلاثة: فك قصيرة → استخراج روابط v1.pinimg.com → تنزيل MP4 → تحليل video-understand عبر SDK (base64) → 3 وثائق في research/pinterest-videos/
- الدروس المستخلصة: هيرو غير متماثل + عمق طبقي + مجاز بصري تجريدي + cubic-bezier(0.16,1,0.3,1) + stagger + مؤشر مخصص
- استُنسخت 6 مستودعات مرجع (research/github-refs/): motion-primitives (قراءة magnetic/scroll-progress/text-effect كاملة)، react-bits، magicui، space-portfolio، play-nextjs، portfolio-2025
- التدقيق وثّق 9 نقاط ضعف في research/DESIGN_v3.md ثم وثيقة اتجاه v3
- مكونات جديدة: magnetic.tsx (نوابض framer-motion، مؤشر دقيق فقط)، scroll-progress.tsx (origin-right RTL)، word-reveal.tsx (قناع كلمة-بكلمة آمن للتشكيل)، knowledge-orbit.tsx (SVG خالص: 3 حلقات متعاكسة + عقد متوهجة + ختم LogoMark عبر foreignObject)
- ترقيات: reveal.tsx (--ease-expo + 3 تنويعات + reduced-motion)، navbar (+ScrollProgress)، page.tsx (هيرو غير متماثل + إحصائيات عملاقة text-5xl→7xl + معاينات بطاقات)، section-blocks (فهرس شبحي ghost-index + معاينة خدمات)، globals.css (حركات المدار + ghost-index + focus-visible ذهبي)
- أداء: خفض الخطوط 16→11 ملفاً (Cairo بدون 400/600، Amiri بدون مائل، Plex Arabic بدون 300/600)
- نظّف: eslint/tsconfig يستثنيان research/examples/reference-material/skills/download/upload/scripts
- إصلاحات أثناء التحقق: set-state-in-effect في مكونين (نمط مؤقّت/rAF)، xmlns غير صالحة في foreignObject، union معقد في WordReveal، 404ات الاختبار كانت أخطاء slugs في URLs الاختبارية (المسارات سليمة)

Stage Summary:
- التحقق النهائي: lint نظيف، tsc نظيف، 10 مسارات + 6 صفحات أقسام = 200، صفر أخطاء طرفية، صفر تجاوز أفقي
- 12 لقطة في download/v3-screenshots/ عبر 4 مقاسات (390/768/1280/1920) + سمتان + قائمة جوال
- VLM-QA: جوال 9/10 وضوح، خدمات شبكة مثالية، فاتح 8.5/10 AAA، النهائي: توازن 9، تايبوغرافيا 9، صقل 9.5/10 "Ready for production"
- كل الوظائف محفوظة (نموذج/واتساب/CV/بحث/preselect) — بلا مكتبات جديدة (framer-motion موجودة مسبقاً)

---
Task ID: 5
Agent: main (Super Z)
Task: شعار أم سارة 10/10 + نظام عرض المنتجات + حركة الشعار والحركة الموحدة (v4) — تنفيذ كامل داخل المشروع وفق مراجع Pinterest الستة

Work Log:
- فُكّت المراجع الثلاثة الجديدة: pin.it/4k7LcJ1h0 (شعار RUNAQ — صورة)، pin.it/AR2pJcA08 (عرض منتجات Jacket Masters — فيديو)، pin.it/5kHG01ix5 (حركة شعار بناء إنشائي — فيديو) عبر curl لروابط pinimg المباشرة
- حُلّلت الثلاثة عبر VLM/video-understand (base64) بوثائق في research/pinterest-new/ + دُمجت مع تحليلات الفيديوهات الثلاثة السابقة (research/pinterest-videos/)
- الشعار الجديد «قوس المعرفة واللؤلؤة»: قوس/محراب مفتوح (أمّ حاضنة + كتاب) بلون currentColor + لؤلؤة ذهبية (نقطة المعرفة) + كاشدة توقيع أفقية — SVG خالص على شبكة 64 (قوس 40×35)
- نظام كامل: brand/logo.tsx (LogoMark/Wordmark/Full/Stacked) + brand/logo-construction.tsx (بناء متحرك: دليل→قوس RTL→لؤلؤة بحطّة 1.04x→كاشدة) + public/favicon.svg + public/logo.svg جديدان
- حركة الشعار في مركز مدار المعرفة (قلب الهيرو)، ونبضة لؤلؤة عند تحويم شعارَي الشريط والفوتر
- عرض المنتجات الجديد product-showcase.tsx: بطاقة سينمائية (نصف قطر 28px، ظل متعدد الطبقات، blur خلفي)، كبسولات بفعّل ذهبي مقلوب، هالة ديناميكية حسب المنتج، فيجوالات حية (شعاع ATS يمسح السيرة / رادار أصالة دوّار مع مقاطع متطابقة نابضة)، انتقال بم فيزياء المرجع (خروج +30%/0.92، دخول -30%/1.04→1، cubic-bezier(0.25,1,0.5,1))، سحب باللمس، ARIA tablist كامل
- تسعير صادق: بنية قيمة (رقائق) بدل الخصومات الوهمية — قرار صريح: نمط الشرطات المخفّضة للمرجع غير أخلاقي لخدمات أكاديمية
- توكنات حركة موحدة: --ease-pearl و--ease-swift + أدوات .btn-lift/.card-lift + كيفرامز البناء والفيجوالات في globals.css مع حراسة prefers-reduced-motion شاملة
- CategoryCard v4: رفع -4px + توهج حدّ ذهبي + أيقونة تدور بلطف اللؤلؤة + سهم بتوقيت swift
- إصلاحات أثناء التنفيذ: خطأ دمج ThemeToggle أثناء تحرير navbar (أُعيد فوراً)؛ اتجاه رسم الكاشدة عُكس ليطابق RTL؛ حصر كلاسات البناء داخل .logo-construct حتى لا تتحرك النسخ الساكنة
- التحقق: next build نجح (18 صفحة، صفر أخطاء) + tsc نظيف + eslint نظيف + console صفر أخطاء
- VLM-QA من جولتين: بطاقة العرض كاملة 10/10 (داكن) + 9/10 فاتح وجوال + مدار الشعار 9/10 + شريط/شبكة الخدمات 10/10 — ملاحظات الجولة الأولى (قصّ الوثيقة، قصّ الشريط، عكس ترتيب الخطوات) ثبت أنها حواف لقطات شاشة لا عيوب تصميم (إعادة تشخيص مركّزة)
- 14 لقطة في download/v4-screenshots/ (1920/1280/390 + سمتان + تبويبا المنتجين + مركز الشعار)

Stage Summary:
- العلامة: هوية أصلية جديدة كلياً (ليست نسخة RUNAQ): المبادئ الخمسة المستخلصة طُبقت — خط قاعدي معماري، فراغ بمعنى، إقران لاتيني Amiri tracking واسع، سرد ذهبي أحادي، كاشدة-توقيع متحركة
- كل عناصر v4 داخل نظام واحد: نفس التوكنات، نفس منحنيات الحركة، نفس لغة الذهب/الزمردي — لا Frankenstein
- المتبقي للإنتاج: متغيرات Render/Supabase، رقم واتساب حقيقي (كما في المراحل السابقة)
