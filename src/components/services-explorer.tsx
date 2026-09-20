"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, ArrowLeft, MessageCircle, ShoppingBasket } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/reveal";
import { ICONS } from "@/components/section-blocks";
import { AddToCartButton } from "@/components/add-to-cart";
import type { Category } from "@/lib/platform-data";
import { whatsappLink } from "@/lib/platform-data";

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
      {/* البحث */}
      <div className="relative mx-auto max-w-xl">
        <Search className="absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن خدمة… مثال: رسالة ماجستير، SPSS، Flutter"
          className="h-12 rounded-xl bg-card pr-11 text-sm"
          aria-label="البحث في الخدمات"
        />
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground" role="status">
        {query
          ? `النتائج: ${filtered.length} ${filtered.length === 1 ? "قسم" : "أقسام"}`
          : `${categories.length} أقسام · ${categories.reduce((n, c) => n + c.subServices.length, 0)} خدمة`}
      </p>

      {filtered.length === 0 && (
        <div className="mx-auto mt-10 max-w-md rounded-2xl border border-border bg-card p-8 text-center">
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

      {/* الأقسام */}
      <div className="mt-8 space-y-8">
        {filtered.map((c, ci) => {
          const Icon = ICONS[c.icon];
          return (
            <Reveal key={c.slug} delay={Math.min(ci * 60, 240)}>
              <section
                id={c.slug}
                className="rounded-2xl border border-border bg-card card-glow"
              >
                <div className="flex flex-wrap items-center gap-4 border-b border-border p-6">
                  <span className="flex size-13 items-center justify-center rounded-xl bg-accent p-3 text-primary">
                    {Icon && <Icon className="size-6" strokeWidth={1.8} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-lg font-bold">{c.name}</h2>
                    <p className="mt-0.5 text-xs text-gold">{c.tagline}</p>
                  </div>
                  <Link
                    href={`/services/${c.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-bold text-primary transition-colors hover:border-primary/40 hover:bg-accent"
                  >
                    صفحة القسم
                    <ArrowLeft className="size-3.5" />
                  </Link>
                </div>
                <ul className="flex flex-wrap gap-2.5 p-6">
                  {c.subServices.map((s) => (
                    <li key={s.slug} className="flex items-center gap-1.5">
                      <Link
                        href={`/services/${c.slug}?service=${s.slug}`}
                        className="inline-flex rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
                      >
                        {s.name}
                      </Link>
                      {/* V10.1 — درس 3: إضافة سريعة للسلة بجانب كل خدمة في البحث */}
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
