import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowLeft, CalendarClock, ShieldCheck, RefreshCcw, MessageCircle, BadgeCheck, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, PLATFORM_NAME, universityBySlug, WHY_US } from "@/lib/platform-data";
import { ICONS, TrustRow } from "@/components/section-blocks";
import { OrderForm } from "@/components/order-form";
import { AddToCartButton } from "@/components/add-to-cart";

/* V10.1 — درس 6: أيقونات أسباب الطمأنينة (خمسة أسباب بصوت أم رهام) */
const WHY_ICONS = {
  "shield-check": ShieldCheck,
  "calendar-clock": CalendarClock,
  "refresh-ccw": RefreshCcw,
  "message-circle": MessageCircle,
  "badge-check": BadgeCheck,
} as const;

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ service?: string; university?: string }>;
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
  const { service, university } = await searchParams;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  /* V10.1 — درس 4: معامل الجامعة من قسم «اختر جامعتك» في الرئيسية —
     سياق دلالي («نعرف جامعتك») يظهر كشارة ويُدمج في عنوان الطلب */
  const uni = universityBySlug(university);

  const Icon = ICONS[cat.icon];
  const preselected = service
    ? cat.subServices.find((s) => s.slug === service)?.name
    : undefined;
  const orderLabel = preselected
    ? `${cat.name} — ${preselected}${uni ? ` — طالب في ${uni.name}` : ""}`
    : `${cat.name}${uni ? ` — طالب في ${uni.name}` : ""}`;

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
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-gold/40 bg-gold-soft text-[11px] text-gold">
                  {cat.tagline}
                </Badge>
                {uni && (
                  <Badge variant="outline" className="gap-1.5 border-primary/40 bg-accent text-[11px] text-primary">
                    <GraduationCap className="size-3.5" />
                    خدمات طلاب {uni.name}
                  </Badge>
                )}
              </div>
              <h1 className="mt-2 font-display text-3xl font-black sm:text-4xl">
                {cat.name}
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-8 text-muted-foreground sm:text-base sm:leading-9">
            {cat.longDescription}
            {uni && (
              <span className="mt-2 block text-[13px] leading-7 text-muted-foreground/90">
                طلاب {uni.name} ({uni.city}): نعرف أنظمة جامعتك التنسيقية
                ومتطلبات الكليات فيها — اذكر تخصصك في نموذج الطلب وسيصل طلبك
                إلى متخصص جرّب مثله في جامعتك.
              </span>
            )}
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
          {/* V10.1 — درس 3: نقرة واحدة تضيف الخدمة إلى السلة — ثم أرسلها
              كلها طلباً واحداً منظماً على واتساب من أي صفحة */}
          <p className="mt-2 text-xs leading-6 text-muted-foreground">
            اضغط «أضف» على ما يناسبك — ثم أرسل القائمة كاملة بضغطة واحدة من زر السلة أعلى الصفحة.
          </p>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {cat.subServices.map((s) => (
              <li key={s.slug}>
                <AddToCartButton
                  item={{
                    name: s.name,
                    category: cat.name,
                    categorySlug: cat.slug,
                    serviceSlug: s.slug,
                  }}
                />
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

          {/* V10.1 — درس 6: «خمسة أسباب تجعلك مطمئناً» — كتلة الثقة
              المستفادة من أم رهام، بصوت أم سارة وبنظامها التصميمي */}
          <div className="hairline-top mt-12 rounded-xl border border-gold/20 bg-gold-soft/30 p-6">
            <h2 className="font-display text-lg font-bold">
              خمسة أسباب تجعلك مطمئناً
            </h2>
            <ul className="mt-4 space-y-4">
              {WHY_US.map((r) => {
                const RIcon = WHY_ICONS[r.icon as keyof typeof WHY_ICONS];
                return (
                  <li key={r.title} className="flex items-start gap-3.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-card text-gold">
                      {RIcon && <RIcon className="size-4.5" strokeWidth={1.8} />}
                    </span>
                    <div>
                      <p className="text-sm font-bold">{r.title}</p>
                      <p className="mt-1 text-[13px] leading-6 text-muted-foreground">{r.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
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
