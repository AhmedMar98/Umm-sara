"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Printer,
  Save,
  RotateCcw,
  Check,
  FileText,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ================= أنواع البيانات ================= */

interface CVData {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  city: string;
  summary: string;
  education: string;
  experience: string;
  skills: string;
  languages: string;
  template: "modern" | "classic" | "ats";
}

const EMPTY: CVData = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  city: "",
  summary: "",
  education: "",
  experience: "",
  skills: "",
  languages: "",
  template: "modern",
};

const STORAGE_KEY = "ummsarah-cv-draft";

const PLACEHOLDER: CVData = {
  fullName: "سارة أحمد",
  title: "باحثة أكاديمية — علوم حاسب",
  email: "sara@example.com",
  phone: "0500000000",
  city: "الرياض، السعودية",
  summary:
    "طالبة ماجستير في علوم الحاسب بخبرة بحثية في تحليل البيانات والتعلم الآلي، نشرت بحثين في مؤتمرات محكمة، وأسعى لفرص بحثية في مجال الذكاء الاصطناعي.",
  education: `ماجستير علوم الحاسب — جامعة الملك سعود (2024 — الآن)
بكالوريوس علوم الحاسب — جامعة الأمير سلطان (2019 — 2023) · معدل 4.5/5`,
  experience: `مساعدة باحث — مختبر الذكاء الاصطناعي (2023 — الآن)
· دعم تجارب نماذج التعلم الآلي وتجهيز البيانات
مدربة أكاديمية — مركز المهارات (2022 — 2023)
· تدريب 40+ طالبة على أساسيات البرمجة`,
  skills: `Python · R · SPSS · SQL
تحليل بيانات · تعلم آلة · كتابة علمية · عرض تقديمي`,
  languages: `العربية — اللغة الأم
الإنجليزية — متقدم (IELTS 7.0)`,
  template: "modern",
};

const TEMPLATES = [
  { id: "modern", name: "الحديث", desc: "شريط جانبي زمردي — الأنسب للتخصصات التقنية والإدارية" },
  { id: "classic", name: "الكلاسيكي", desc: "ترويسة ذهبية أنيقة — الأنسب للتخصصات الأدبية والإدارية" },
  { id: "ats", name: "الأكاديمي ATS", desc: "بنية نصية مباشرة — مضمونة التوافق مع أنظمة التوظيف الآلية" },
] as const;

/* ================= المكوّن ================= */

export function CVBuilder() {
  const [data, setData] = useState<CVData>(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const [showSample, setShowSample] = useState(false);

  // تحميل المسودة المحفوظة (بأثر غير متزامن لتجنب العرض المتسلسل)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) setData({ ...EMPTY, ...JSON.parse(raw) });
      } catch {
        /* تجاهل */
      }
      setLoaded(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const set = <K extends keyof CVData>(key: K, value: CVData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const filled = useMemo(
    () => Object.values(data).filter((v) => String(v).trim()).length,
    [data]
  );

  function saveDraft(auto = false) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (!auto) toast.success("تم حفظ المسودة في هذا المتصفح.");
  }

  function autoSave() {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(autoSave, 800);
    return () => clearTimeout(t);
  }, [data, loaded]);

  function exportPDF() {
    if (!data.fullName.trim()) {
      toast.error("أضف اسمك أولاً قبل التصدير.");
      return;
    }
    toast.info("تأكد من ضبط «الهوامش: بلا» في نافذة الطباعة للحصول على أفضل نتيجة.");
    setTimeout(() => window.print(), 350);
  }

  const v = showSample ? PLACEHOLDER : data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* ترويسة */}
      <div className="max-w-2xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-primary" dir="ltr">
          CV BUILDER · ATS READY
        </p>
        <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
          بنّاء السيرة الذاتية
        </h1>
        <p className="mt-4 text-sm leading-8 text-muted-foreground">
          حرّر على اليمين، وشاهد النتيجة حيّة على اليسار. عند الجاهزية صدّر
          ملف PDF بجودة طباعة — متوافق مع أنظمة التوظيف الآلية ATS.
        </p>
      </div>

      {/* أدوات */}
      <div className="mt-8 flex flex-wrap items-center gap-2.5">
        <Button onClick={exportPDF} className="rounded-xl font-bold">
          <Printer className="size-4" />
          تصدير PDF
        </Button>
        <Button onClick={() => saveDraft()} variant="outline" className="rounded-xl">
          <Save className="size-4" />
          حفظ المسودة
        </Button>
        <Button
          onClick={() => setShowSample((s) => !s)}
          variant="outline"
          className="rounded-xl"
        >
          <Sparkles className="size-4" />
          {showSample ? "إخفاء النموذج" : "عرض نموذج جاهز"}
        </Button>
        <Button
          onClick={() => {
            setData(EMPTY);
            localStorage.removeItem(STORAGE_KEY);
            toast.success("تمت التهيئة من جديد.");
          }}
          variant="ghost"
          className="rounded-xl text-muted-foreground"
        >
          <RotateCcw className="size-4" />
          تفريغ
        </Button>
        {loaded && (
          <span className="ms-auto font-mono text-[11px] text-muted-foreground" dir="ltr">
            AUTOSAVE · ON
          </span>
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* ============ المحرر ============ */}
        <div className="space-y-6">
          {/* القوالب */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-base font-bold">اختر القالب</h2>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => set("template", t.id)}
                  className={cn(
                    "rounded-xl border p-3.5 text-right transition-all",
                    data.template === t.id
                      ? "border-primary/50 bg-accent card-glow"
                      : "border-border bg-background hover:border-primary/30"
                  )}
                  aria-pressed={data.template === t.id}
                >
                  <span className="flex items-center justify-between">
                    <span className="font-display text-sm font-bold">{t.name}</span>
                    {data.template === t.id && <Check className="size-4 text-primary" />}
                  </span>
                  <span className="mt-1 block text-[11px] leading-5 text-muted-foreground">
                    {t.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* الحقول */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <Tabs defaultValue="personal" dir="rtl">
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="personal">البيانات الشخصية</TabsTrigger>
                <TabsTrigger value="content">المحتوى</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="mt-5 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="cv-name">الاسم الكامل *</Label>
                    <Input id="cv-name" value={data.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="اسمك كما تريد ظهوره" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="cv-title">المسمى المهني</Label>
                    <Input id="cv-title" value={data.title} onChange={(e) => set("title", e.target.value)} placeholder="مثال: مهندس برمجيات — طالب ماجستير" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="cv-email">البريد الإلكتروني</Label>
                    <Input id="cv-email" type="email" dir="ltr" className="text-right" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="name@mail.com" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="cv-phone">الجوال</Label>
                    <Input id="cv-phone" dir="ltr" className="text-right" value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder="05xxxxxxxx" />
                  </div>
                  <div className="grid gap-1.5 sm:col-span-2">
                    <Label htmlFor="cv-city">المدينة</Label>
                    <Input id="cv-city" value={data.city} onChange={(e) => set("city", e.target.value)} placeholder="الرياض، السعودية" />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="content" className="mt-5 grid gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="cv-summary">نبذة تعريفية</Label>
                  <Textarea id="cv-summary" value={data.summary} onChange={(e) => set("summary", e.target.value)} rows={3} placeholder="3 — 4 أسطر تُبرز هويتك المهنية وهدفك" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="cv-edu">التعليم</Label>
                  <Textarea id="cv-edu" value={data.education} onChange={(e) => set("education", e.target.value)} rows={4} placeholder={"الدرجة — الجامعة (السنوات)\nالتقدير أو المعدل"} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="cv-exp">الخبرات والمشاريع</Label>
                  <Textarea id="cv-exp" value={data.experience} onChange={(e) => set("experience", e.target.value)} rows={5} placeholder={"المنصب — الجهة (السنوات)\n· إنجاز ملموس بنتيجة رقمية"} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="cv-skills">المهارات</Label>
                  <Textarea id="cv-skills" value={data.skills} onChange={(e) => set("skills", e.target.value)} rows={3} placeholder="افصل بينها بـ · أو سطر جديد" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="cv-langs">اللغات</Label>
                  <Textarea id="cv-langs" value={data.languages} onChange={(e) => set("languages", e.target.value)} rows={2} placeholder="العربية — اللغة الأم · الإنجليزية — متقدم" />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {showSample && (
            <p className="rounded-xl border border-gold/30 bg-gold-soft p-3 text-[11px] leading-6 text-muted-foreground">
              النموذج الجاهز معروض في المعاينة فقط — لم تُنسخ بياناتك. اضغط «إخفاء النموذج» للعودة لسيرتك.
            </p>
          )}
        </div>

        {/* ============ المعاينة الحية ============ */}
        <div>
          <div className="lg:sticky lg:top-24">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-base font-bold">
                <FileText className="size-4 text-primary" />
                المعاينة الحية
              </h2>
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground" dir="ltr">
                A4 · {filled}/10 FIELDS
              </span>
            </div>
            <div id="cv-print-area" dir="rtl" className="min-h-[600px] overflow-hidden rounded-xl border border-border bg-white text-gray-900 shadow-2xl">
              <CVPreview data={v} />
            </div>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              المعاينة بجودة الويب — ملف الـ PDF الناتج سيكون بدقة الطباعة (210×297مم).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= المعاينة ================= */

function Lines({ text }: { text: string }) {
  const parts = text.split("\n").filter((l) => l.trim());
  return (
    <>
      {parts.map((p, i) =>
        p.trim().startsWith("·") ? (
          <p key={i} className="mt-1 ps-3 text-[11.5px] leading-5 text-gray-700">
            {p.trim()}
          </p>
        ) : (
          <p key={i} className="mt-1.5 text-[12px] font-semibold leading-5">
            {p}
          </p>
        )
      )}
    </>
  );
}

function CVPreview({ data }: { data: CVData }) {
  const contact = [data.email, data.phone, data.city].filter(Boolean).join("  ·  ");

  if (data.template === "modern") {
    return (
      <div className="flex min-h-[600px] flex-col sm:flex-row">
        <aside className="bg-emerald-900 p-6 text-emerald-50 sm:w-2/5">
          <div className="size-16 rounded-2xl border-2 border-emerald-400/60 p-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-full text-emerald-300">
              <rect x="3" y="6" width="18" height="14" rx="2" />
              <path d="M12 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
              <path d="M8 10h8M8 13.5h8M8 17h5" />
            </svg>
          </div>
          <h1 className="mt-4 font-bold leading-snug">{data.fullName || "اسمك الكامل"}</h1>
          <p className="mt-1 text-xs text-emerald-300">{data.title || "المسمى المهني"}</p>
          {contact && <p className="mt-4 text-[10.5px] leading-5 text-emerald-100/90" dir="ltr">{contact}</p>}
          {data.skills && (
            <>
              <h2 className="mt-6 text-[11px] font-bold uppercase tracking-widest text-emerald-300">المهارات</h2>
              <div className="mt-2 space-y-1.5">
                {data.skills.split(/[·\n]/).filter((s) => s.trim()).map((s, i) => (
                  <p key={i} className="flex items-center gap-1.5 text-[11px] text-emerald-50">
                    <span className="size-1 rounded-full bg-emerald-400" />
                    {s.trim()}
                  </p>
                ))}
              </div>
            </>
          )}
          {data.languages && (
            <>
              <h2 className="mt-6 text-[11px] font-bold uppercase tracking-widest text-emerald-300">اللغات</h2>
              <Lines text={data.languages} />
            </>
          )}
        </aside>
        <div className="flex-1 p-6">
          {data.summary && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">النبذة التعريفية</h2>
              <p className="mt-2 text-[11.5px] leading-6 text-gray-700">{data.summary}</p>
            </section>
          )}
          {data.education && (
            <section className="mt-5">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">التعليم</h2>
              <Lines text={data.education} />
            </section>
          )}
          {data.experience && (
            <section className="mt-5">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">الخبرات والمشاريع</h2>
              <Lines text={data.experience} />
            </section>
          )}
          {!data.summary && !data.education && !data.experience && (
            <p className="mt-16 text-center text-xs text-gray-400">ابدأ بتعبئة الحقول لترى سيرتك تتشكل هنا…</p>
          )}
        </div>
      </div>
    );
  }

  if (data.template === "classic") {
    return (
      <div className="min-h-[600px] p-8">
        <header className="border-b-2 border-amber-600 pb-4 text-center">
          <h1 className="text-2xl font-bold tracking-wide">{data.fullName || "اسمك الكامل"}</h1>
          <p className="mt-1 text-sm font-medium text-amber-700">{data.title || "المسمى المهني"}</p>
          {contact && <p className="mt-2 text-[10.5px] text-gray-500" dir="ltr">{contact}</p>}
        </header>
        {data.summary && (
          <section className="mt-5">
            <h2 className="text-xs font-bold text-amber-700">النبذة التعريفية</h2>
            <p className="mt-1.5 text-[11.5px] leading-6 text-gray-700">{data.summary}</p>
          </section>
        )}
        {data.education && <Section title="التعليم"><Lines text={data.education} /></Section>}
        {data.experience && <Section title="الخبرات والمشاريع"><Lines text={data.experience} /></Section>}
        {data.skills && <Section title="المهارات"><Lines text={data.skills} /></Section>}
        {data.languages && <Section title="اللغات"><Lines text={data.languages} /></Section>}
        {!data.summary && !data.education && !data.experience && (
          <p className="mt-16 text-center text-xs text-gray-400">ابدأ بتعبئة الحقول لترى سيرتك تتشكل هنا…</p>
        )}
      </div>
    );
  }

  /* ATS — بنية نصية مباشرة */
  return (
    <div className="min-h-[600px] p-8 font-mono">
      <h1 className="text-lg font-bold">{data.fullName || "اسمك الكامل"}</h1>
      <p className="mt-0.5 text-[11px] text-gray-600">{data.title || "المسمى المهني"}</p>
      {contact && <p className="mt-1 text-[10.5px] text-gray-600" dir="ltr">{contact}</p>}
      <hr className="my-4 border-gray-300" />
      {[
        ["SUMMARY", data.summary],
        ["EDUCATION", data.education],
        ["EXPERIENCE", data.experience],
        ["SKILLS", data.skills],
        ["LANGUAGES", data.languages],
      ].map(([t, txt]) =>
        txt ? (
          <section key={t} className="mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-800" dir="ltr">{t}</h2>
            <div className="mt-1.5 text-[11px] leading-6 text-gray-700">
              <Lines text={txt} />
            </div>
          </section>
        ) : null
      )}
      {!data.summary && !data.education && !data.experience && (
        <p className="mt-16 text-center text-xs text-gray-400">ابدأ بتعبئة الحقول لترى سيرتك تتشكل هنا…</p>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="text-xs font-bold text-amber-700">{title}</h2>
      <div className="mt-1.5">{children}</div>
    </section>
  );
}
