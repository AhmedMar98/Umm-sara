"use client";

/**
 * مستكشف الخدمات — V10.2 Wave A «ثورة الأعماق»
 * من أكوام أقسام متماثلة (2021) إلى شبكة bento حية:
 *   - إيقاع كامل/نصفي/نصفي على 6 أعمدة — القسم الأكبر يتنفس بعرض الصفحة
 *   - أورورا داخلية لكل كتلة (عمق مادي حقيقي بالسمتين)
 *   - حدود متدرجة + زجاجية + ظلال منبعثة ملونة بالتناوب (ذهبي/زمردي)
 *   - بحث بتوهج تركيز (spotlight) — الحقل يستحضر الضوء عند الطلب
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowLeft, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/reveal";
import { ICONS } from "@/components/section-blocks";
import { AddToCartButton } from "@/components/add-to-cart";
import type { Category } from "@/lib/platform-data";
import { whatsappLink } from "@/lib/platform-data";
import { cn } from "@/lib/utils";

/** إيقاع bento: كامل · نصف · نصف — يتكرر */
function bentoSpan(i: number): string {
  return i % 4 === 0 ? "lg:col-span-6" : "lg:col-span-3";
}

export function ServicesExplorer({ categories }: { categories: Category[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories
      .map((c) => {
        const subs = c.subServices.filter((s) =>
          s.name.toLowerCase().includes(q) || s.slug.includes(q)
        );
        const catMatch =
          c.name.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q);
        if (catMatch || subs.length > 0) {
          return { ...c, subServices: catMatch ? c.subServices : subs };
        }
        return null;
      })
      .filter((c): c is Category => c !== null);
  }, [query, categories]);

  return (
    <div className="mt-10">
      {/* البحث — بتوهج تركيز */}
      <div className="relative mx-auto max-w-xl">
        <Search className="absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن خدمة… مثال: رسالة ماجستير، SPSS، Flutter"
          className="glass spotlight-input h-14 rounded-2xl border-border/70 pr-12 text-sm"
          aria-label="البحث في الخدمات"
        />
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground" role="status">
        {query
          ? `النتائج: ${filtered.length} ${filtered.length === 1 ? "قسم" : "أقسام"}`
          : `${categories.length} أقسام · ${categories.reduce((n, c) => n + c.subServices.length, 0)} خدمة`}
      </p>

      {filtered.length === 0 && (
        <div className="glass gradient-border mx-auto mt-10 max-w-md rounded-2xl p-8 text-center">
          <p className="font-display font-bold">لم نجد نتائج مطابقة</p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            خدمتك غير مدرجة؟ راسلنا وسنؤمّنها لك بأقرب وقت.
          </p>
          <a
            href={whatsappLink(`السلام عليكم، أبحث عن خدمة غير مدرجة: "${query}" — هل توفرها منصة أم سارة؟`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-gold"
          >
            <MessageCircle className="size-4" />
            اسأل عن خدمتك
          </a>
        </div>
      )}

      {/* شبكة bento — كتل بأحجام متباينة */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-6">
        {filtered.map((c, ci) => {
          const Icon = ICONS[c.icon];
          const wide = ci % 4 === 0;
          return (
            <Reveal key={c.slug} delay={Math.min(ci * 60, 240)} variant="up" className={cn(bentoSpan(ci))}>
              <section
                id={c.slug}
                className={cn(
                  "glass gradient-border card-glow",
                  ci % 2 === 0 ? "emit-gold" : "emit-emerald",
                  "group relative h-full overflow-hidden rounded-2xl"
                )}
              >
                {/* أورورا داخلية — عمق مادي حقيقي داخل الكتلة */}
                <div
                  className={cn(
                    "aurora pointer-events-none absolute -top-24 h-56 w-56",
                    ci % 2 === 0 ? "aurora-gold right-[-3rem]" : "aurora-emerald left-[-3rem]"
                  )}
                  aria-hidden="true"
                />
                <div className="relative flex flex-wrap items-center gap-4 border-b border-border/60 p-6">
                  <span className="relative flex size-13 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-accent p-3 text-primary transition-transform duration-500 group-hover:scale-110">
                    {Icon && <Icon className="size-6" strokeWidth={1.8} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className={cn("font-display font-bold", wide ? "text-lg sm:text-xl" : "text-base sm:text-lg")}>
                      {c.name}
                    </h2>
                    <p className="mt-0.5 text-xs text-gold">{c.tagline}</p>
                  </div>
                  <Link
                    href={`/services/${c.slug}`}
                    className="glass inline-flex items-center gap-1.5 rounded-full border border-border/70 px-4 py-2 text-xs font-bold text-primary transition-all hover:border-gold/40 hover:text-gold"
                  >
                    صفحة القسم
                    <ArrowLeft className="size-3.5" />
                  </Link>
                </div>
                <ul className="relative flex flex-wrap gap-2.5 p-6">
                  {c.subServices.map((s) => (
                    <li key={s.slug} className="flex items-center gap-1.5">
                      <Link
                        href={`/services/${c.slug}?service=${s.slug}`}
                        className="glass inline-flex rounded-lg border border-border/70 bg-background/40 px-4 py-2.5 text-sm text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:text-foreground"
                      >
                        {s.name}
                      </Link>
                      {/* V10.1 — درس 3: إضافة سريعة للسلة بجانب كل خدمة */}
                      <AddToCartButton
                        variant="chip"
                        item={{
                          name: s.name,
                          category: c.name,
                          categorySlug: c.slug,
                          serviceSlug: s.slug,
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
