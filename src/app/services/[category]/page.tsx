import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowLeft, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, PLATFORM_NAME } from "@/lib/platform-data";
import { ICONS, TrustRow } from "@/components/section-blocks";
import { OrderForm } from "@/components/order-form";

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ service?: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) return { title: "غير موجود" };
  return {
    title: cat.name,
    description: cat.description,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { service } = await searchParams;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  const Icon = ICONS[cat.icon];
  const preselected = service
    ? cat.subServices.find((s) => s.slug === service)?.name
    : undefined;
  const orderLabel = preselected
    ? `${cat.name} — ${preselected}`
    : cat.name;

  const siblings = CATEGORIES.filter((c) => c.slug !== cat.slug);

  return (
    <div>
      {/* ترويسة القسم */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-overlay absolute inset-0" aria-hidden="true" />
        <div
          className={`absolute -top-24 left-10 h-72 w-96 rounded-full bg-primary/10 blur-[110px] ${cat.accent}`}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <nav aria-label="مسار التنقل" className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary">الرئيسية</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-primary">الخدمات</Link>
            <span>/</span>
            <span className="text-foreground">{cat.name}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-5">
            {Icon && (
              <span className="flex size-16 items-center justify-center rounded-2xl border border-primary/25 bg-accent text-primary">
                <Icon className="size-8" strokeWidth={1.6} />
              </span>
            )}
            <div>
              <Badge variant="outline" className="mb-2 border-gold/40 bg-gold-soft text-[11px] text-gold">
                {cat.tagline}
              </Badge>
              <h1 className="font-display text-3xl font-black sm:text-4xl">
                {cat.name}
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-8 text-muted-foreground sm:text-base sm:leading-9">
            {cat.longDescription}
          </p>
          <TrustRow className="mt-6" />
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-5">
        {/* الخدمات الفرعية والمزايا */}
        <div className="lg:col-span-3">
          <h2 className="font-display text-xl font-bold">
            الخدمات الفرعية
            <span className="ms-2 font-mono text-xs font-normal text-muted-foreground" dir="ltr">
              ({String(cat.subServices.length).padStart(2, "0")})
            </span>
          </h2>
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {cat.subServices.map((s) => (
              <li key={s.slug}>
                <a
                  href="#order-form"
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-sm transition-all hover:border-primary/40 hover:bg-accent/50"
                >
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  <span className="font-medium">{s.name}</span>
                </a>
              </li>
            ))}
          </ul>

          <h2 className="mt-12 font-display text-xl font-bold">ما يميّز هذا القسم</h2>
          <ul className="mt-5 space-y-3.5">
            {cat.features.map((f) => (
              <li key={f} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm leading-7">
                <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* نموذج الطلب */}
        <aside className="lg:col-span-2">
          <div className="lg:sticky lg:top-24">
            <OrderForm serviceLabel={orderLabel} orderType="service" />
            <Button asChild variant="outline" className="mt-4 h-11 w-full rounded-xl font-bold ring-gold">
              <Link href="/consultation">
                <CalendarClock className="size-4 text-gold" />
                لا تعرف من أين تبدأ؟ احجز استشارة مجانية
              </Link>
            </Button>
          </div>
        </aside>
      </div>

      {/* بقية الأقسام */}
      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-lg font-bold">أقسام أخرى قد تهمك</h2>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {siblings.map((s) => {
              const SIcon = ICONS[s.icon];
              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
                >
                  {SIcon && <SIcon className="size-4 text-primary" />}
                  {s.name}
                  <ArrowLeft className="size-3.5" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
