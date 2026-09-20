"use client";

/**
 * مستكشف معرض الأعمال (V10.1 — الدرس 5)
 * فلترة حية بالفئة + بطاقات أعمال بوسم «نموذج توضيحي» الصادق —
 * بنفس لغة التصميم: hairline-top / card-glow / hover ذهبي.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { Clock3, ArrowLeft, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import type { Work } from "@/lib/platform-data";
import { cn } from "@/lib/utils";

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
    <div>
      {/* فلاتر الفئات */}
      <div className="flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="تصفية الأعمال حسب الفئة">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={active === c}
            onClick={() => setActive(c)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-bold transition-all",
              active === c
                ? "border-gold/50 bg-gold-soft text-gold"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground" role="status">
        {filtered.length} {filtered.length === 1 ? "عمل" : "أعمال"} معروضة
      </p>

      {/* شبكة الأعمال */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((w, i) => (
          <Reveal key={w.slug} delay={Math.min(i * 70, 280)} variant="up">
            <Link
              href={`/works/${w.slug}`}
              className="hairline-top card-lift group flex h-full flex-col rounded-xl border border-border bg-card p-6 card-glow hover:border-gold/30"
            >
              <div className="flex items-center justify-between gap-3">
                <Badge variant="outline" className="border-primary/30 bg-accent text-[10px] text-primary">
                  {w.category}
                </Badge>
                {/* وسم النزاهة: نموذج توضيحي — لا يُخفى أبداً (درس المقارنة: الثقة تصنعها الصداقة مع الحقيقة) */}
                <Badge variant="outline" className="gap-1 border-gold/35 bg-gold-soft text-[9px] text-gold">
                  <BadgeCheck className="size-3" />
                  نموذج توضيحي
                </Badge>
              </div>
              <h2 className="mt-4 font-display text-base font-bold leading-7 transition-colors duration-300 group-hover:text-gold">
                {w.title}
              </h2>
              <p className="mt-1.5 text-xs text-muted-foreground">{w.university}</p>
              <p className="mt-2.5 flex-1 text-[13px] leading-6 text-muted-foreground">
                {w.summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {w.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-background px-2.5 py-1 text-[10px] text-muted-foreground"
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
                <span className="inline-flex items-center gap-1 font-bold text-primary">
                  التفاصيل
                  <ArrowLeft className="size-3.5" />
                </span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
