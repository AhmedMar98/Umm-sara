"use client";

/**
 * مستكشف معرض الأعمال — V10.2 Wave A «ثورة الأعماق» + Wave C «قاموس الحركة»
 *   - إيقاع 4/2 · 3/3 · 2/4 على شبكة 6 أعمدة — كل عمل يحتل مساحته بثقة
 *   - غلاف توليدي لكل فئة (mesh gradients) بلا صور مزعومة — نزاهة النموذج محفوظة
 *   - حدود متدرجة + زجاجية حقيقية + إمالة 3D + ظل منبعث + لمعان سفحي
 *   - أرقام شبحية ضخمة (تايبوغرافيا عرضية توقيعية)
 *
 * Wave C — فلترة بحركة FLIP (layout animations — توقيع 2025-27):
 *   البطاقات الباقية تنزلق لمواضعها الجديدة، الداخلة تتلاشى للظهور بتتابع،
 *   والخارجة تُقتلع بلطف (popLayout). MotionConfig reducedMotion="user"
 *   يُعطّل كل شيء تلقائياً لمن يطلب تقليل الحركة من نظامه.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { Clock3, ArrowLeft, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Work } from "@/lib/platform-data";
import { cn } from "@/lib/utils";

/** منحنى النظام الموقّع (0.16,1,0.3,1) — مطابق لـ --ease-expo في CSS */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** غلاف توليدي لكل فئة — لون مستمد من هوية الفئة */
const MESH: Record<string, string> = {
  "الدراسات العليا": "mesh-a",
  "الإحصاء والبحث العلمي": "mesh-b",
  "البرمجة والتقنية": "mesh-c",
  "التصميم والخدمات المساندة": "mesh-d",
  "الخدمات الجامعية": "mesh-e",
};

/** إيقاع التحرير: 4/2 ثم 3/3 ثم 2/4 — يكسر رتابة الشبكة المنتظمة */
function spanClass(i: number): string {
  const m = i % 6;
  if (m === 0) return "sm:col-span-2 lg:col-span-4";
  if (m === 1) return "lg:col-span-2";
  if (m === 2 || m === 3) return "lg:col-span-3";
  if (m === 4) return "lg:col-span-2";
  return "lg:col-span-4";
}

/** تداخل عضوي (broken grid): البطاقات المتجاورة تنزاح عمودياً لإيقاع تحريري */
function staggerClass(i: number): string {
  const m = i % 6;
  if (m === 1) return "lg:mt-12";
  if (m === 3) return "lg:mt-8";
  if (m === 4) return "lg:mt-14";
  return "";
}

export function WorksExplorer({ works }: { works: Work[] }) {
  const categories = useMemo(
    () => ["الكل", ...Array.from(new Set(works.map((w) => w.category)))],
    [works]
  );
  const [active, setActive] = useState("الكل");

  const filtered = useMemo(
    () => (active === "الكل" ? works : works.filter((w) => w.category === active)),
    [active, works]
  );

  return (
    <MotionConfig reducedMotion="user">
      {/* فلاتر الفئات — رقائق زجاجية بمؤشر ذهبي متوهج */}
      <div
        className="flex flex-wrap items-center justify-center gap-2"
        role="tablist"
        aria-label="تصفية الأعمال حسب الفئة"
      >
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={active === c}
            onClick={() => setActive(c)}
            className={cn(
              "glass rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300",
              active === c
                ? "border-gold/55 text-gold shadow-[0_10px_36px_-16px_rgba(197,160,89,0.55)]"
                : "border-border/70 text-muted-foreground hover:border-gold/35 hover:text-foreground"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <motion.p
        key={`${active}-${filtered.length}`}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="mt-4 text-center text-xs text-muted-foreground"
        role="status"
      >
        {filtered.length} {filtered.length === 1 ? "عمل" : "أعمال"} معروضة
      </motion.p>

      {/* شبكة تحريرية غير متناظرة — FLIP: البطاقات تنزلق لمواضعها عند الفلترة */}
      <motion.div
        layout
        className="mt-8 grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((w, i) => {
            const featured = i % 6 === 0;
            const enterDelay = Math.min(i * 0.05, 0.3);
            return (
              <motion.div
                key={w.slug}
                layout
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{
                  opacity: { duration: 0.35, delay: enterDelay },
                  y: { duration: 0.55, ease: EASE, delay: enterDelay },
                  scale: { duration: 0.25 },
                  layout: { duration: 0.55, ease: EASE },
                }}
                className={cn(spanClass(i), staggerClass(i))}
              >
                <Link
                  href={`/works/${w.slug}`}
                  className={cn(
                    "glass gradient-border card-glow tilt-card shine hairline-top",
                    "group relative flex h-full flex-col overflow-hidden rounded-2xl"
                  )}
                >
                  {/* الغلاف التوليدي — توقيع الفئة اللوني (موشورات متحركة + ملمس حبيبي + لمعة مخروطية) */}
                  <div
                    className={cn(
                      "mesh-cover relative flex items-end justify-between p-5 pb-4",
                      MESH[w.category] ?? "mesh-a",
                      featured ? "min-h-[13rem]" : "min-h-[9.5rem]"
                    )}
                    aria-hidden="true"
                  >
                    <span className="mesh-sheen" />
                    <span className="mesh-grain" />
                    <span className="mesh-fade" />
                    {/* رقم شبحي ضخم — تايبوغرافيا عرضية توقيعية */}
                    <span
                      className={cn(
                        "ghost-index absolute right-4 top-3",
                        featured ? "text-8xl" : "text-6xl"
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {/* شريط الجامعة أسفل الغلاف */}
                    <span className="glass relative z-10 inline-flex w-fit items-center rounded-full border border-border/60 px-3 py-1 text-[10px] font-medium text-muted-foreground">
                      {w.university}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5 pt-4">
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="outline" className="border-primary/30 bg-accent text-[10px] text-primary">
                        {w.category}
                      </Badge>
                      {/* وسم النزاهة: نموذج توضيحي — لا يُخفى أبداً */}
                      <Badge variant="outline" className="gap-1 border-gold/35 bg-gold-soft text-[9px] text-gold">
                        <BadgeCheck className="size-3" />
                        نموذج توضيحي
                      </Badge>
                    </div>
                    <h2
                      className={cn(
                        "mt-3 font-display font-bold leading-8 transition-colors duration-300 group-hover:text-gold",
                        featured ? "text-xl sm:text-2xl" : "text-base"
                      )}
                    >
                      {w.title}
                    </h2>
                    <p className={cn("mt-2 flex-1 text-[13px] leading-6 text-muted-foreground", !featured && "line-clamp-3")}>
                      {w.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {w.tags.map((t) => (
                        <span
                          key={t}
                          className="glass rounded-full border border-border/60 px-2.5 py-1 text-[10px] text-muted-foreground transition-colors group-hover:border-gold/25"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="size-3.5 text-gold" />
                        {w.duration}
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-primary transition-transform duration-300 group-hover:-translate-x-1">
                        التفاصيل
                        <ArrowLeft className="size-3.5" />
                      </span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </MotionConfig>
  );
}
