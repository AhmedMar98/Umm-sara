/* ============================================================
   منصة أم سارة — طبقة البيانات المرجعية
   المصدر: services-data.md (مجلد Google Drive)
   الاصطلاح: كل خدمة Record مستقل قابل للإدارة من قاعدة البيانات
   (Supabase) دون لمس الكود — انظر supabase/schema.sql
============================================================ */

export interface SubService {
  name: string;
  slug: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string; // lucide icon name
  tagline: string;
  description: string;
  longDescription: string;
  features: string[];
  subServices: SubService[];
  accent: string; // tailwind gradient
}

export const CATEGORIES: Category[] = [
  {
    id: 1,
    name: "الخدمات الجامعية",
    slug: "university-services",
    icon: "graduation-cap",
    tagline: "لبكالوريوس في كل التخصصات",
    description: "خدمات متكاملة لطلاب البكالوريوس في مختلف التخصصات الجامعية.",
    longDescription:
      "نرافقك من أول محاضرة حتى تسليم المشروع النهائي: بحث موثّق، تقرير محكم، عروض تقديمية مؤثرة، وتدقيق لغوي ونحوي يليق بعملك الأكاديمي. فريقنا يجمع بين الخبرة الأكاديمية الصارمة والفهم العميق لمتطلبات الجامعات السعودية والخليجية.",
    features: [
      "أبحاث وتقارير علمية موثقة بمصادر محكمة",
      "تنسيق APA / MLA / Chicago بدقة",
      "ترجمة أكاديمية عربي ↔ إنجليزي",
      "عروض PowerPoint وتصاميم Infographic",
      "تلخيص وخرائط ذهنية للمراجعة",
    ],
    subServices: [
      { name: "الأبحاث والتقارير", slug: "university-research-reports" },
      { name: "مشاريع التخرج", slug: "graduation-projects" },
      { name: "الاختبارات والواجبات", slug: "exams-and-assignments" },
      { name: "الشرح والدروس الخصوصية", slug: "tutoring-and-explanation" },
      { name: "التدقيق والتنسيق", slug: "proofreading-and-formatting" },
      { name: "الترجمة الأكاديمية", slug: "translation" },
      { name: "التلخيص", slug: "summarization" },
      { name: "العروض التقديمية", slug: "presentations" },
    ],
    accent: "from-emerald-500/20 to-transparent",
  },
  {
    id: 2,
    name: "الدراسات العليا",
    slug: "graduate-services",
    icon: "scroll-text",
    tagline: "للماجستير والدكتوراه",
    description: "خدمات متخصصة لطلاب الماجستير والدكتوراه والباحثين.",
    longDescription:
      "مسار بحثي كامل تحت إشراف أكاديميين متخصصين: من صياغة خطة البحث والفرضيات، مروراً ببناء الإطار النظري وتحليل البيانات، وصولاً إلى التجهيز للنشر العلمي والتحضير للمناقشة. نلتزم بمنهجية علمية صارمة وشفافية كاملة في كل مرحلة.",
    features: [
      "خطط بحث وResearch Proposals محكمة",
      "إعداد رسائل الماجستير وأطروحات الدكتوراه",
      "مراجعة منهجية للأدبيات Literature Review",
      "التحضير للنشر في مجلات علمية محكمة",
      "جلسات تحضيرية للمناقشة Viva",
    ],
    subServices: [
      { name: "الرسائل العلمية", slug: "theses-and-dissertations" },
      { name: "خطط البحث", slug: "research-proposals" },
      { name: "البحث العلمي المتقدم", slug: "advanced-research" },
      { name: "النشر العلمي", slug: "scientific-publishing" },
      { name: "الإشراف والاستشارات", slug: "supervision-and-consulting" },
      { name: "دراسات الحالة", slug: "case-studies" },
    ],
    accent: "from-amber-500/20 to-transparent",
  },
  {
    id: 3,
    name: "الخدمات المدرسية",
    slug: "school-services",
    icon: "school",
    tagline: "للثانوية وما دونها",
    description: "خدمات موجهة لطلاب المرحلة الثانوية وما دونها.",
    longDescription:
      "دعم دراسي قريب من احتياجات الطالب السعودي: شرح مبسّط للمواد الأساسية، حلول واجبات بطريقة تعليمية تصنع الاستقلال، وتدريب مركّز قبل الاختبارات النهائية مع ملخصات ونماذج تدريبية.",
    features: [
      "دروس تقوية أونلاين فردية وجماعية",
      "شرح الرياضيات والفيزياء والمواد الأدبية",
      "مراجعات نهائية وملخصات مركزة",
      "نماذج اختبارات تدريبية",
      "تنمية مهارات الدراسة والبحث",
    ],
    subServices: [
      { name: "الدروس والشرح", slug: "school-tutoring" },
      { name: "الواجبات المدرسية", slug: "school-homework" },
      { name: "المشاريع والتقارير", slug: "school-projects" },
      { name: "تنمية المهارات", slug: "skills-development" },
      { name: "الاختبارات", slug: "school-exams" },
    ],
    accent: "from-teal-500/20 to-transparent",
  },
  {
    id: 4,
    name: "الإحصاء والبحث العلمي",
    slug: "statistics-and-data-analysis",
    icon: "bar-chart-3",
    tagline: "SPSS · R · Excel",
    description: "خدمات التحليل الإحصائي والبيانات البحثية باحترافية.",
    longDescription:
      "من تصميم الاستبيان إلى تفسير النتائج: تحليل وصفي واستدلالي باستخدام SPSS وR وExcel، مع تقارير جاهزة لفصل النتائج وفصل المناقشة، ولوحات بيانات تفاعلية تُظهر نتائجك بأعلى جودة عرض.",
    features: [
      "تصميم وتفريغ الاستبيانات",
      "تحليل إحصائي SPSS / R / Excel",
      "تفسير الجداول والرسوم البيانية",
      "إعداد فصل النتائج والمناقشة",
      "Dashboards وPivot Tables متقدمة",
    ],
    subServices: [
      { name: "تصميم الاستبيانات", slug: "survey-design" },
      { name: "التحليل الإحصائي", slug: "statistical-analysis" },
      { name: "تحليل البيانات البحثية", slug: "research-data" },
      { name: "تفسير النتائج", slug: "results-interpretation" },
      { name: "لوحات البيانات", slug: "dashboards" },
    ],
    accent: "from-cyan-500/20 to-transparent",
  },
  {
    id: 5,
    name: "التصميم والخدمات المساندة",
    slug: "design-and-support",
    icon: "palette",
    tagline: "هوية بصرية أكاديمية",
    description: "تصميم جرافيكي متخصص للأغراض الأكاديمية والبحثية.",
    longDescription:
      "مظهر يليق ببحثك: أغلفة رسائل وأبحاث بتصميم راقٍ، ملصقات علمية Scientific Posters بمعايير المؤتمرات، وإنفوجرافيك يبسّط تعقيد بياناتك، مع تفريغ صوتي حرفي للمحاضرات والمقابلات مع timestamps.",
    features: [
      "تصميم Scientific Posters بمعايير المؤتمرات",
      "أغلفة الرسائل والأبحاث والتقارير",
      "إنفوجرافيك ومخططات توضيحية",
      "تفريغ صوتي حرفي مع تحديد المتحدثين",
      "تدقيق لغوي وتنسيق شامل",
    ],
    subServices: [
      { name: "التصميم الأكاديمي", slug: "academic-design" },
      { name: "التفريغ الصوتي", slug: "audio-transcription" },
      { name: "التدقيق والتنسيق", slug: "proofreading" },
      { name: "تصميم العروض", slug: "presentations-design" },
    ],
    accent: "from-yellow-500/20 to-transparent",
  },
  {
    id: 6,
    name: "البرمجة والتقنية",
    slug: "programming-and-tech",
    icon: "code-2",
    tagline: "مواقع · تطبيقات · AI",
    description: "حلول برمجية وتقنية: تطوير، ذكاء اصطناعي، قواعد بيانات.",
    longDescription:
      "من نجران حلول برمجية إلى منصتك: تطوير مواقع وتطبيقات ويب وجوال بتقنيات حديثة، مشاريع تخرج برمجية بمختلف اللغات، نماذج تعلم آلة وتحليلات تنبؤية، وأنظمة مدمجة وإنترنت أشياء IoT.",
    features: [
      "تطوير مواقع وتطبيقات ويب وجوال",
      "مشاريع Flutter / Python / Java / C++",
      "نماذج Machine Learning وتحليل بيانات",
      "تصميم قواعد بيانات MySQL / MongoDB / Firebase",
      "أنظمة مدمجة Arduino وإنترنت الأشياء IoT",
    ],
    subServices: [
      { name: "تطوير البرمجيات", slug: "software-development" },
      { name: "الذكاء الاصطناعي والبيانات", slug: "ai-and-data" },
      { name: "قواعد البيانات", slug: "databases" },
      { name: "الأنظمة المدمجة وIoT", slug: "embedded-systems" },
      { name: "تقنيات الويب", slug: "web-technologies" },
    ],
    accent: "from-emerald-400/20 to-transparent",
  },
];

export interface Product {
  id: number;
  name: string;
  slug: string;
  icon: string;
  tagline: string;
  description: string;
  points: string[];
  cta: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "بنّاء السيرة الذاتية",
    slug: "cv-builder",
    icon: "file-text",
    tagline: "منتج مستقل داخل المنصة",
    description:
      "أداة إنشاء سيرة ذاتية احترافية متوافقة مع أنظمة التوظيف الآلية ATS، بقوالب متعددة وتصدير PDF فوري.",
    points: [
      "قوالب احترافية متوافقة مع ATS",
      "محرر مباشر مع معاينة حية",
      "تصدير PDF بجودة طباعة",
      "حفظ تلقائي للمسودة",
    ],
    cta: "ابدأ ببناء سيرتك الآن",
  },
  {
    id: 2,
    name: "فحص الأصالة",
    slug: "plagiarism-check",
    icon: "search-check",
    tagline: "فحص ومراجعة وتحسين",
    description:
      "فحص نسبة الاقتباس ومراجعة التشابه النصي وتحسين الصياغة الأكاديمية — بصيغة مهنية دون وعود بنسب مسبقة.",
    points: [
      "فحص نسبة الاقتباس",
      "تقارير تشابه نصي مفصلة",
      "إعادة صياغة أكاديمية",
      "توثيق المصادر والاستشهادات",
    ],
    cta: "اطلب فحص الأصالة",
  },
];

export const STATS = [
  { value: 4500, suffix: "+", label: "باحث وطالب خدمناهم" },
  { value: 1200, suffix: "+", label: "مشروع وبحث منجز" },
  { value: 98, suffix: "%", label: "نسبة رضا العملاء" },
  { value: 40, suffix: "+", label: "جامعة سعودية وخليجية" },
];

export const TESTIMONIALS = [
  {
    name: "أ. محمد العتيبي",
    role: "طالب ماجستير — إدارة أعمال",
    text: "من خطة البحث حتى المناقشة، الفريق كان معي خطوة بخطوة. التحليل الإحصائي لـ SPSS كان أبعد من توقعاتي بكثير.",
  },
  {
    name: "أ. نورة القحطاني",
    role: "طالبة بكالوريوس — علوم حاسب",
    text: "مشروع التخرج البرمجي طلع متكامل: كود نظيف، توثيق كامل، وعرض تقديمي أحترف فيه يوم المناقشة.",
  },
  {
    name: "د. سالم الشمري",
    role: "باحث دكتوراه — تربية",
    text: "التدقيق اللغوي وتنسيق المراجع APA وفّر عليّ أسابيع من المراجعة اليدوية. التزام تام بالمواعيد.",
  },
];

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "اطلب خدمتك",
    description:
      "اختر الخدمة، صف متطلباتك بدقة، وحدد الموعد النهائي — عبر النموذج أو مباشرة على واتساب.",
  },
  {
    step: "02",
    title: "تابع تنفيذك",
    description:
      "متخصص أكاديمي يتولى طلبك ويوافيك بجدول واضح، مع مراجعات مجانية حتى الرضا التام.",
  },
  {
    step: "03",
    title: "استلم عملك",
    description:
      "تسليم موثق بجودة أكاديمية، مع تقرير أصالة عند الطلب ودعم ما بعد التسليم.",
  },
];

/* ---------- الإعدادات والتكاملات ---------- */

/**
* رقم الواتساب الرسمي (V10.1 — الدرس 2 من مقارنة أم رهام):
* الرقم بيانات منصة عامة مثل اسم العلامة — مصدره الحاكم هذا الملف (نسخي
* ومُراجَع ويُنشر تلقائياً مع كل دفعة). متغير البيئة القديم
* NEXT_PUBLIC_WHATSAPP_NUMBER أصبح مهجوراً ولم يعد يُقرأ: القيمة المضبوطة
* على لوحة Vercel لا يمكنها إبطال الرقم الصحيح بعد اليوم (السقف الذي
* حدث في المراحل السابقة: 966500000000 الافتراضي كان يغلب الكود).
*/
export const WHATSAPP_NUMBER = "966544665634";

/** الصيغة المعروضة للزوار (توافق هندسي واحد للمصدر) */
export const WHATSAPP_DISPLAY = "+966 54 466 5634";

export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const PLATFORM_NAME = "أم سارة";
export const PLATFORM_TAGLINE = "وجهتك نحو التميز الأكاديمي والبحثي";

/* ============================================================
   الجامعات (V10.1 — الدرس 4: «اختر جامعتك»)
   بطاقات اسمية بروابط لصفحة الخدمات الجامعية بمعامل جامعة —
   بلا شعارات رسمية (علامات تجارية)؛ الرسالة: «نعرف جامعتك»
============================================================ */
export interface University {
  name: string;
  slug: string;
  city: string;
  /** ملاحظة تمييز قصيرة تُعرض في البطاقة */
  note: string;
}

export const UNIVERSITIES: University[] = [
  { name: "جامعة الملك سعود", slug: "ksu", city: "الرياض", note: "أكبر جامعات المملكة وأعرقها" },
  { name: "جامعة الإمام محمد بن سعود", slug: "imamu", city: "الرياض", note: "الشريعة والعلوم الإنسانية والاقتصاد" },
  { name: "جامعة الأميرة نورة", slug: "pnu", city: "الرياض", note: "أكبر جامعة نسائية في العالم" },
  { name: "جامعة الملك فيصل", slug: "kfu", city: "الأحساء", note: "الطب والعلوم والزراعة" },
  { name: "جامعة القصيم", slug: "qu", city: "بريدة", note: "الهندسة والطب والعلوم" },
  { name: "جامعة أم القرى", slug: "uqu", city: "مكة المكرمة", note: "مكانة خاصة وتقاليد راسخة" },
  { name: "جامعة طيبة", slug: "taibahu", city: "المدينة المنورة", note: "تخصصات صحية وهندسية" },
  { name: "جامعة الأمير سطام", slug: "psau", city: "الخرج", note: "برامج علمية وأدبية متوازنة" },
];

export function universityBySlug(slug?: string): University | undefined {
  return slug ? UNIVERSITIES.find((u) => u.slug === slug) : undefined;
}

/* ============================================================
   معرض الأعمال (V10.1 — الدرس 5)
   «نماذج توضيحية» تُعرض بوسم صريح — بنية جاهزة للاستبدال
   بأعمال حقيقية من جدول works في Supabase دون لمس الكود.
   التزام النزاهة: لا نسب نتائج مُختلقة ولا انتحال عملاء.
============================================================ */
export interface Work {
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  university: string;
  summary: string;
  description: string[];
  deliverables: string[];
  tags: string[];
  duration: string;
  isSample: boolean;
}

export const WORKS: Work[] = [
  {
    slug: "mba-research-proposal",
    title: "خطة بحث ماجستير — إدارة الأعمال",
    category: "الدراسات العليا",
    categorySlug: "graduate-services",
    university: "جامعة الملك سعود",
    summary: "صياغة مشكلة البحث والفرضيات والإطار النظري وفق توصيات لجنة الدراسات العليا، بمراجع APA محدثة.",
    description: [
      "انطلق العمل من صياغة مشكلة بحثية قابلة للقياس ثم بناء الفرضيات وربطها بالأدبيات الحديثة (خمس سنوات) من قواعد بيانات علمية محكمة، وتُوّج بخطة متكاملة جاهزة للعرض على المشرف واللجنة.",
      "شمل التسليم مراجعة منهجية كاملة: اتساق الأهداف مع الفرضيات، ملاءمة المنهج المختار، وجودة التوثيق APA في المتن والمراجع.",
    ],
    deliverables: ["خطة بحث من 18 صفحة", "قائمة مراجع APA بـ 42 مرجعاً", "ملخص تنفيذي للمناقشة"],
    tags: ["خطة بحث", "APA", "إدارة أعمال"],
    duration: "أسبوعان",
    isSample: true,
  },
  {
    slug: "cs-graduation-project",
    title: "مشروع تخرج برمجي — علوم الحاسب",
    category: "البرمجة والتقنية",
    categorySlug: "programming-and-tech",
    university: "جامعة الإمام محمد بن سعود",
    summary: "تطبيق ويب متكامل بمكدس حديث مع توثيق فني كامل واختبارات، جاهز لعرض يوم المناقشة.",
    description: [
      "طُوّر مشروع التخرج بمعايير هندسة البرمجيات: تحليل متطلبات، تصميم قاعدة بيانات مطوّعة، واجهات متجاوبة، ثم توثيق فني مفصل يغطي القرار المعماري وسبب كل اختيار تقني.",
      "أُتبع التسليم بجلسة تدريبية للطالب على شرح المعمارية أمام اللجنة، مع أسئلة متوقعة وإجابات مرجعية من الكود نفسه.",
    ],
    deliverables: ["كود مصدري موثق", "وثيقة متطلبات وتصميم", "عرض تقديمي للمناقشة", "دليل تشغيل"],
    tags: ["مشروع تخرج", "تطوير ويب", "توثيق فني"],
    duration: "6 أسابيع",
    isSample: true,
  },
  {
    slug: "spss-thesis-analysis",
    title: "تحليل إحصائي لرسالة ماجستير — SPSS",
    category: "الإحصاء والبحث العلمي",
    categorySlug: "statistics-and-data-analysis",
    university: "جامعة أم القرى",
    summary: "تفريغ 380 استبانة وتحليل وصفي واستدلالي كامل مع كتابة فصلي النتائج والمناقشة بصياغة أكاديمية.",
    description: [
      "بدأ العمل بتفريغ الاستبانات وتدقيق الاتساق والقيم الشاذة، ثم تحليل وصفي (متوسطات، انحرافات، ارتباطات) واستدلالي (اختبارات T وANOVA وارتباط بيرسون) بحسب فرضيات الرسالة.",
      "كُتب فصل النتائج بجداول مرقمة وتفسير لكل جدول، وفصل المناقشة بربط النتائج بالدراسات السابقة دراسةً دراسة.",
    ],
    deliverables: ["ملف SPSS نظيف", "فصل نتائج مفصل", "فصل مناقشة مربوط بالأدبيات", "جداول ورسوم جاهزة"],
    tags: ["SPSS", "تحليل إحصائي", "فصل النتائج"],
    duration: "3 أسابيع",
    isSample: true,
  },
  {
    slug: "engineering-report-formatting",
    title: "تدقيق وتنسيق تقرير هندسي — 60 صفحة",
    category: "الخدمات الجامعية",
    categorySlug: "university-services",
    university: "جامعة القصيم",
    summary: "تدقيق لغوي شامل وتنسيق مراجع IEEE وتوحيد الأشكال والجداول وفق دليل الكلية.",
    description: [
      "مرّ التقرير على جولتَي تدقيق: لغوية (إملاء ونحو وصياغة فنية) ثم شكلية (ترقيم الأشكال والجداول، توحيد العناوين، المراجع IEEE بدقة الحرف).",
      "سُلّم التقرير بنسختين: نسخة تعديلات مقروءة بالتعليقات، ونسخة نهائية نظيفة جاهزة للطباعة والتجليد.",
    ],
    deliverables: ["نسخة مُدققة بالتعليقات", "نسخة نهائية للطباعة", "فهرس أشكال وجداول موحد"],
    tags: ["تدقيق", "IEEE", "تنسيق"],
    duration: "5 أيام",
    isSample: true,
  },
  {
    slug: "scientific-poster-design",
    title: "ملصق علمي لمؤتمر طبي",
    category: "التصميم والخدمات المساندة",
    categorySlug: "design-and-support",
    university: "جامعة طيبة",
    summary: "تصميم Scientific Poster بمعايير المؤتمرات: هرمية قراءة واضحة ورسوم بيانية مُبسطة للنتائج.",
    description: [
      "هُيكل الملصق على قاعدة «المسح السريع»: عنوان بارز، مشكلة في سطرين، منهج مصور، ونتائج في ثلاثة رسوم بيانية بدل جداول كثيفة.",
      "سُلّم بثلاثة مقاسات (A0 للطباعة، عرض للشاشة، ونسخة PDF خفيفة للإرسال)، مع ملف مصدر قابل للتعديل.",
    ],
    deliverables: ["ملصق A0 جاهز للطباعة", "نسخة عرض للشاشة", "ملف مصدر قابل للتعديل"],
    tags: ["ملصق علمي", "تصميم", "مؤتمرات"],
    duration: "4 أيام",
    isSample: true,
  },
  {
    slug: "phd-literature-review",
    title: "مراجعة منهجية للأدبيات — دكتوراه تربية",
    category: "الدراسات العليا",
    categorySlug: "graduate-services",
    university: "جامعة الأميرة نورة",
    summary: "مراجعة منهجية PRISMA لـ 48 دراسة مع مصفوفة تركيب ومحاور نقدية جاهزة لفصل الأدبيات.",
    description: [
      "صُنّفت الدراسات بمصفوفة تركيب (السنة، العينة، الأداة، النتيجة) ثم كُتبت المحاور النقدية بصياغة تُظهر الفجوة البحثية التي تقوم عليها مشكلة الأطروحة.",
      "رُوعي توثيق APA في كل استشهاد، وسُلّم مرفق قاعدة مراجع قابلة للتحديث مع تقدم البحث.",
    ],
    deliverables: ["مصفوفة 48 دراسة", "فصل أدبيات بمحاور نقدية", "قاعدة مراجع حية"],
    tags: ["مراجعة منهجية", "PRISMA", "أدبيات"],
    duration: "3 أسابيع",
    isSample: true,
  },
];

export function workBySlug(slug: string): Work | undefined {
  return WORKS.find((w) => w.slug === slug);
}

/* ============================================================
   أسباب الطمأنينة (V10.1 — الدرس 6: نفس صوت «خمسة أسباب
   تجعلك مطمئناً» من أم رهام، بصياغة أم سارة)
============================================================ */
export const WHY_US = [
  {
    icon: "shield-check",
    title: "سرية تامة",
    text: "عملك ومعلوماتك لا يغادران نطاق الفريق المكلّف — تسليم نهائي وحذف موثق عند طلبك.",
  },
  {
    icon: "calendar-clock",
    title: "تسليم على مراحل",
    text: "لا مفاجآت في النهاية: خطة زمنية واضحة من اليوم الأول وتسليمات جزئية تتابعها بنفسك.",
  },
  {
    icon: "refresh-ccw",
    title: "مراجعات حتى الرضا",
    text: "جولات تعديل مجانية ضمن نطاق العمل المتفق عليه — نعمل حتى تقول «هذا هو».",
  },
  {
    icon: "message-circle",
    title: "تواصل مباشر",
    text: "قناة واتساب مباشرة مع منفّذ طلبك لا مع وسيط ردود آلية — قرارك سؤال واحد فقط.",
  },
  {
    icon: "badge-check",
    title: "سعر واضح قبل البدء",
    text: "عرض سعر مفصل مكتوب قبل أي عمل — لا رسوم تظهر لاحقاً ولا مفاجآت في الفاتورة.",
  },
];
