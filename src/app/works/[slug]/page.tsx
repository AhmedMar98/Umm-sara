import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  GraduationCap,
  Clock3,
  CheckCircle2,
  ArrowLeft,
  Layers,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { WORKS, workBySlug } from "@/lib/platform-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return WORKS.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const work = workBySlug(slug);
  if (!work) return { title: "غير موجود" };
  return {
    title: work.title,
    description: work.summary,
  };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const work = workBySlug(slug);
  if (!work) notFound();

  const related = WORKS.filter(
    (w) => w.slug !== work.slug && w.categorySlug === work.categorySlug
  ).slice(0, 2);

  return (
    <div>
      {/* ترويسة العمل */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-overlay absolute inset-0" aria-hidden="true" />
        <div
          className="absolute -top-24 left-10 h-72 w-96 rounded-full bg-primary/10 blur-[110px]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <nav aria-label="مسار التنقل" className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary">الرئيسية</Link>
            <span>/</span>
            <Link href="/works" className="hover:text-primary">معرض الأعمال</Link>
            <span>/</span>
            <span className="text-foreground">{work.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-primary/30 bg-accent text-[11px] text-primary">
              {work.category}
            </Badge>
            {work.isSample && (
              <Badge variant="outline" className="border-gold/35 bg-gold-soft text-[10px] text-gold">
                نموذج توضيحي
              </Badge>
            )}
          </div>

          <h1 className="mt-4 max-w-3xl font-display text-2xl font-black leading-snug sm:text-3xl md:text-4xl">
            {work.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <GraduationCap className="size-4 text-gold" />
              {work.university}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="size-4 text-gold" />
              مدة التنفيذ: {work.duration}
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-5">
        {/* السرد الكامل */}
        <article className="lg:col-span-3">
          <h2 className="font-display text-xl font-bold">منهجية التنفيذ</h2>
          <div className="mt-4 space-y-5">
            {work.description.map((p, i) => (
              <p key={i} className="text-sm leading-9 text-muted-foreground sm:text-[15px]">
                {p}
              </p>
            ))}
          </div>

          <h2 className="mt-12 font-display text-xl font-bold">التسليمات</h2>
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {work.deliverables.map((d) => (
              <li
                key={d}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-sm"
              >
                <CheckCircle2 className="size-4 shrink-0 text-primary" />
                <span className="font-medium">{d}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-1.5">
            {work.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-[11px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>

          {work.isSample && (
            <div className="mt-8 flex items-start gap-3 rounded-xl border border-gold/25 bg-gold-soft/40 p-4 text-xs leading-6 text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0 text-gold" />
              <p>
                هذا العمل <b className="text-foreground">نموذج توضيحي</b> يعرض بنية
                التنفيذ والتسليم في هذا التخصص — نعرضه بشفافية كاملة حتى تعرف
                ماذا ستحصل عليه بالضبط قبل أن تطلب.
              </p>
            </div>
          )}
        </article>

        {/* CTA + أعمال ذات صلة */}
        <aside className="lg:col-span-2">
          <div className="lg:sticky lg:top-24">
            <Reveal>
              <div className="hairline-top gradient-frame corner-marks relative overflow-hidden rounded-2xl bg-card p-7 card-glow">
                <p className="mono-chip text-[10px] text-gold/80" dir="ltr">START SIMILAR</p>
                <h2 className="mt-4 font-display text-lg font-bold leading-8">
                  عندك عمل مشابه؟
                </h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  أرسل لنا تفاصيل مشروعك ونرسل لك خطة عمل وعرض سعر مفصل خلال
                  24 ساعة — الاستشارة الأولى مجانية وبلا التزام.
                </p>
                <Button asChild className="mt-6 h-12 w-full rounded-xl font-bold">
                  <Link href={`/services/${work.categorySlug}`}>
                    <Layers className="size-4" />
                    استعرض خدمات هذا التخصص
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="mt-3 h-11 w-full rounded-xl font-bold ring-gold"
                >
                  <Link href="/consultation">احجز استشارة مجانية</Link>
                </Button>
              </div>
            </Reveal>

            {related.length > 0 && (
              <div className="mt-6">
                <h2 className="font-display text-sm font-bold text-muted-foreground">
                  أعمال أخرى في {work.category}
                </h2>
                <ul className="mt-3 space-y-2.5">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/works/${r.slug}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-sm transition-all hover:border-gold/30"
                      >
                        <span className="font-semibold leading-6">{r.title}</span>
                        <ArrowLeft className="size-4 shrink-0 text-primary" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
