"use client";

/* ============================================================
   عرض المنتجات الرائد (v4) — «منتج كتحفة على مسرح»
   ------------------------------------------------------------
   دروس مرجع عرض المنتجات (Jacket Masters) معرّبة RTL:
   · بطاقة سينمائية 16:10 بنصف قطر 28px وحدّ شعري وظل متعدد الطبقات
   · تقسيم غير متماثل: معلومات 45% (يمين RTL) + فيجوال حي 55%
   · كبسولات تبديل — الفعّل مقلوب (ذهبي) كما في المرجع
   · فيزياء الانتقال: خروج +30% مع 0.92 حجم (300ms) / دخول من -30%
     مع 1.04→1 (450ms) على cubic-bezier(0.25,1,0.5,1)
   · هالة محيطية ديناميكية تتلوّن حسب المنتج (ذهبي/زمردي)
   · «المنتج» هنا خدمة: مجاز تجريدي حي بدل صورة — شعاع ATS / رادار أصالة
   · تسعير صادق: لا خصومات وهمية — بنية قيمة واضحة
   ============================================================ */

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  SearchCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@/lib/platform-data";

/* ---------- إعداد لكل منتج (بصري + قيمة صادقة) ---------- */
const SHOWCASE: Record<
  string,
  {
    visual: "cv" | "radar";
    eyebrow: string;
    valueChips: string[];
    microTrust: string;
    footnote: string;
  }
> = {
  "cv-builder": {
    visual: "cv",
    eyebrow: "PRODUCT 01",
    valueChips: ["مجاني بالكامل", "بدون تسجيل", "تصدير PDF فوري"],
    microTrust: "متوافق مع أنظمة التتبع الآلي ATS",
    footnote: "ابدأ مباشرة — لا تحتاج حساباً",
  },
  "plagiarism-check": {
    visual: "radar",
    eyebrow: "PRODUCT 02",
    valueChips: ["تسعير حسب نطاق الفحص", "تقرير مفصل", "إعادة صياغة عند الطلب"],
    microTrust: "بصيغة مهنية — دون وعود بنسب مسبقة",
    footnote: "أرسل مستندك واحصل على خطة فحص واضحة",
  },
};

const EASE_SWIFT: [number, number, number, number] = [0.25, 1, 0.5, 1];

const panelVariants = {
  enter: (dir: number) => ({ x: dir * -36, opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir * 36, opacity: 0, scale: 0.92 }),
};

/* ---------- الفيجوال 1: وثيقة سيرة مع شعاع مسح ATS ---------- */
function CvVisual() {
  const lines = [
    "w-11/12",
    "w-full",
    "w-9/12",
    "w-10/12",
    "w-8/12",
    "w-11/12",
    "w-7/12",
    "w-9/12",
  ];
  return (
    <div className="relative">
      {/* وثيقة السيرة — ورقة فاتحة (نقطة الاستقطاب البصري) */}
      <div className="relative w-44 overflow-hidden rounded-xl bg-[#fffdf6] p-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/5 sm:w-52 sm:p-6">
        {/* رأس الوثيقة */}
        <div className="flex items-center gap-3">
          <span className="size-9 rounded-full bg-gradient-to-br from-[#e8d48b] to-[#c5a059]" />
          <span className="flex-1 space-y-1.5">
            <span className="block h-2 w-3/4 rounded-full bg-[#0a231b]/70" />
            <span className="block h-1.5 w-1/2 rounded-full bg-[#0a231b]/25" />
          </span>
        </div>
        {/* أسطر السيرة — تُقبل كلما مرّ الشعاع */}
        <div className="mt-5 space-y-2.5">
          {lines.map((w, i) => (
            <span
              key={i}
              className={cn(
                "ats-line block h-1.5 rounded-full bg-[#0a231b]/20",
                w,
                i === 3 || i === 6 ? "bg-[#c5a059]/50" : undefined,
              )}
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </div>
        {/* شعاع المسح ATS */}
        <span
          className="ats-scan pointer-events-none absolute inset-x-0 top-0 h-9 bg-gradient-to-b from-[#e8d48b]/0 via-[#e8d48b]/40 to-[#e8d48b]/0"
          aria-hidden="true"
        >
          <span className="absolute inset-x-0 bottom-0 h-px bg-[#c5a059]" />
        </span>
      </div>

      {/* رقائق ثقة عائمة */}
      <span className="float-chip absolute -right-8 top-3 rounded-full border border-gold/40 bg-[#0d1613]/90 px-3.5 py-1.5 text-[10px] font-bold text-gold shadow-lg backdrop-blur" dir="ltr">
        ATS ✓ PASSED
      </span>
      <span className="float-chip float-chip-2 absolute -left-6 bottom-6 rounded-full border border-primary/40 bg-[#0d1613]/90 px-3.5 py-1.5 text-[10px] font-bold text-primary shadow-lg backdrop-blur" dir="ltr">
        PDF · READY
      </span>
    </div>
  );
}

/* ---------- الفيجوال 2: رادار فحص الأصالة فوق الوثيقة ---------- */
function RadarVisual() {
  return (
    <div className="relative">
      {/* الرادار — مسح مخروطي دوّار */}
      <div className="absolute -left-10 -top-8 size-32 rounded-full border border-primary/35 bg-[#0d1613]/60 backdrop-blur-sm sm:size-36" aria-hidden="true">
        <div className="absolute inset-3 rounded-full border border-primary/20" />
        <div className="absolute inset-8 rounded-full border border-primary/15" />
        <div className="plag-radar absolute inset-3 rounded-full bg-[conic-gradient(from_0deg,rgba(46,211,154,0.4),transparent_70deg)]" />
        <span className="plag-hit absolute left-6 top-8 size-2 rounded-full bg-gold-bright shadow-[0_0_8px_2px_rgba(232,212,139,0.5)]" style={{ animationDelay: "-0.4s" }} />
        <span className="plag-hit absolute left-16 top-14 size-1.5 rounded-full bg-primary shadow-[0_0_6px_2px_rgba(46,211,154,0.5)]" style={{ animationDelay: "-1.6s" }} />
      </div>

      {/* الوثيقة المفحوصة */}
      <div className="relative w-44 rotate-[2.5deg] rounded-xl bg-[#fffdf6] p-5 pt-7 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/5 sm:w-52 sm:p-6 sm:pt-8">
        <div className="space-y-2.5">
          {["w-10/12", "w-full", "w-8/12", "w-full", "w-9/12"].map((w, i) => (
            <span key={i} className={cn("block h-1.5 rounded-full bg-[#0a231b]/20", w)} />
          ))}
        </div>
        {/* مقاطع متطابقة — تنبض عند مرور المسح */}
        <div className="mt-4 space-y-2.5">
          <span className="plag-hit block h-2 w-11/12 rounded bg-gold/30 ring-1 ring-gold/50" />
          <span className="plag-hit block h-2 w-3/5 rounded bg-primary/25 ring-1 ring-primary/40" style={{ animationDelay: "-1.2s" }} />
          <span className="plag-hit block h-2 w-4/5 rounded bg-gold/20 ring-1 ring-gold/40" style={{ animationDelay: "-2.3s" }} />
        </div>
        {/* ختم المراجعة */}
        <span className="absolute -top-3 right-5 rounded-full bg-gradient-to-l from-gold-bright to-gold px-3 py-1 text-[9px] font-black text-[#241a08] shadow-md" dir="ltr">
          REVIEWED
        </span>
      </div>

      {/* رقاقة الثقة */}
      <span className="float-chip absolute -bottom-5 right-2 rounded-full border border-primary/40 bg-[#0d1613]/90 px-3.5 py-1.5 text-[10px] font-bold text-primary shadow-lg backdrop-blur">
        توثيق ومراجعة
      </span>
    </div>
  );
}

/* ---------- المكوّن الرئيسي ---------- */
export function ProductShowcase() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const product = PRODUCTS[active];
  const config = SHOWCASE[product.slug];

  const go = (next: number, direction: number) => {
    if (next === active) return;
    setDir(direction);
    setActive((next + PRODUCTS.length) % PRODUCTS.length);
  };

  return (
    <div className="mt-14">
      {/* شريط التحكم — كبسولات + أسهم (الفعّل مقلوب كما في المرجع) */}
      <div className="mb-8 flex items-center justify-center gap-4">
        <div role="tablist" aria-label="تبديل المنتجات" className="flex gap-1 rounded-full border border-border bg-card/70 p-1 backdrop-blur">
          {PRODUCTS.map((p, i) => (
            <button
              key={p.slug}
              role="tab"
              aria-selected={i === active}
              aria-controls="product-panel"
              onClick={() => go(i, i > active ? 1 : -1)}
              className={cn(
                "btn-lift rounded-full px-4 py-2 text-sm font-bold transition-colors sm:px-6",
                i === active
                  ? "bg-gradient-to-l from-gold-bright to-gold text-[#241a08] shadow-[0_4px_16px_-6px_rgba(197,160,89,0.6)]"
                  : "text-muted-foreground hover:bg-gold-soft hover:text-foreground",
              )}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => go(active + 1, 1)}
            aria-label="المنتج التالي"
            className="btn-lift flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => go(active - 1, -1)}
            aria-label="المنتج السابق"
            className="btn-lift flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* المسرح — هالة ديناميكية + بطاقة سينمائية */}
      <div className="relative">
        {/* الهالة المحيطية — تتلوّن حسب المنتج */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`orb-${product.slug}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65 }}
            aria-hidden="true"
            className={cn(
              "absolute -inset-x-8 -top-16 bottom-0 -z-10 rounded-full blur-[110px]",
              product.slug === "cv-builder"
                ? "bg-gold/[0.13]"
                : "bg-primary/[0.15]",
            )}
          />
        </AnimatePresence>

        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={product.slug}
            id="product-panel"
            role="tabpanel"
            aria-label={product.name}
            custom={dir}
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { duration: 0.45, ease: EASE_SWIFT },
              opacity: { duration: 0.28 },
              scale: { duration: 0.45, ease: EASE_SWIFT },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(active + 1, 1);
              else if (info.offset.x > 60) go(active - 1, -1);
            }}
            className="relative overflow-hidden rounded-[1.75rem] border border-border bg-card/70 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
              {/* عمود المعلومات — بداية القراءة (يمين RTL) */}
              <div className="order-2 flex flex-col p-7 sm:p-10 lg:order-1">
                <p className="mono-chip text-[10px] text-gold/80" dir="ltr">
                  {config.eyebrow}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="flex size-12 items-center justify-center rounded-xl border border-gold/25 bg-gold-soft text-gold">
                    {product.slug === "cv-builder" ? (
                      <FileText className="size-6" strokeWidth={1.6} />
                    ) : (
                      <SearchCheck className="size-6" strokeWidth={1.6} />
                    )}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-bold leading-tight">
                      {product.name}
                    </h3>
                    <p className="font-serif-accent text-base text-gold">
                      {product.tagline}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-8 text-muted-foreground">
                  {product.description}
                </p>

                <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {product.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2 text-xs leading-6 text-muted-foreground">
                      <CheckCircle2 className="size-4 shrink-0 text-primary" />
                      {pt}
                    </li>
                  ))}
                </ul>

                {/* بنية القيمة — تسعير صادق بلا خصومات وهمية */}
                <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border/60 pt-5">
                  {config.valueChips.map((chip, i) => (
                    <span
                      key={chip}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-[11px] font-bold",
                        i === 0
                          ? "border border-gold/40 bg-gold-soft text-gold"
                          : "border border-border bg-secondary text-muted-foreground",
                      )}
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    asChild
                    className="btn-lift shine h-12 rounded-full border border-gold/40 bg-gradient-to-l from-gold-bright to-gold px-7 text-base font-bold text-[#241a08] shadow-[0_10px_40px_-10px_rgba(197,160,89,0.55)]"
                  >
                    <Link
                      href={product.slug === "cv-builder" ? "/cv-builder" : "/plagiarism-check"}
                      data-cursor
                    >
                      {product.cta}
                      <ArrowLeft className="size-5" />
                    </Link>
                  </Button>
                  <p className="text-[11px] leading-5 text-muted-foreground/80">
                    {config.footnote}
                  </p>
                </div>
              </div>

              {/* منطقة الفيجوال — المسرح الحي */}
              <div
                className={cn(
                  "relative order-1 flex min-h-[21rem] items-center justify-center overflow-hidden border-border/60 p-8 sm:min-h-[24rem] lg:order-2 lg:border-inline-start",
                  product.slug === "cv-builder"
                    ? "bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.09),transparent_65%)]"
                    : "bg-[radial-gradient(ellipse_at_center,rgba(22,163,122,0.10),transparent_65%)]",
                )}
              >
                {/* شبكة خافتة تربط الفيجوال بلغة المنصة */}
                <div className="grid-overlay absolute inset-0" aria-hidden="true" />
                {config.visual === "cv" ? <CvVisual /> : <RadarVisual />}
              </div>
            </div>

            {/* شريط الثقة أسفل المسرح (درس micro-copy المرجع) */}
            <div className="flex items-center gap-2.5 border-t border-border/60 bg-background/40 px-7 py-3.5">
              <Sparkles className="size-3.5 shrink-0 text-gold" />
              <p className="text-[11px] text-muted-foreground">{config.microTrust}</p>
              <span className="mono-chip ms-auto hidden text-[9px] text-muted-foreground/60 sm:block" dir="ltr">
                {product.slug === "cv-builder" ? "CV · BUILDER" : "ORIGINALITY · CHECK"}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
