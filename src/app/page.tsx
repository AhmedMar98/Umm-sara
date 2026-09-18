import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  FileText,
  SearchCheck,
  Star,
  Quote,
  MessageCircle,
  CalendarClock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ParticleField } from "@/components/particle-field";
import { Reveal, StatCounter } from "@/components/reveal";
import {
  SectionHeading,
  CategoryCard,
  TrustRow,
} from "@/components/section-blocks";
import {
  CATEGORIES,
  PRODUCTS,
  STATS,
  TESTIMONIALS,
  HOW_IT_WORKS,
  whatsappLink,
} from "@/lib/platform-data";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ================= Hero ================= */}
      <section className="relative overflow-hidden">
        <ParticleField />
        <div className="grid-overlay absolute inset-0" aria-hidden="true" />
        <div
          className="absolute -top-32 right-1/2 h-96 w-[42rem] rounded-full bg-primary/10 blur-[140px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-20 pt-20 text-center sm:px-6 sm:pt-28">
          <Badge
            variant="outline"
            className="mb-6 gap-2 rounded-full border-gold/40 bg-gold-soft px-4 py-1.5 text-xs font-medium text-gold"
          >
            <Sparkles className="size-3.5" />
            منصة سعودية للخدمات الأكاديمية والبحثية
          </Badge>

          <h1 className="font-display text-4xl font-black leading-[1.25] tracking-tight sm:text-5xl md:text-6xl">
            نحو تفوّقٍ أكاديمي
            <br />
            <span className="gradient-emerald-text text-glow">أكثر إشراقاً</span>
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-sm leading-8 text-muted-foreground sm:text-base sm:leading-9">
            في منصة أم سارة نرافقك في رحلتك الأكاديمية كاملة — من أول بحث
            جامعي، إلى رسالة الماجستير والدكتوراه، إلى سيرتك الذاتية التي
            تفتح لك أبواب المستقبل. فريق خبراء أكاديميين، معايير علمية صارمة،
            والتزام تام بالشفافية.
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full px-8 text-base font-bold shadow-lg shadow-primary/25">
              <Link href="/services">
                ابدأ طلبك الآن
                <ArrowLeft className="size-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full px-8 text-base font-bold ring-gold"
            >
              <Link href="/consultation">
                <CalendarClock className="size-5 text-gold" />
                احجز استشارة مجانية
              </Link>
            </Button>
          </div>

          <TrustRow className="mt-10 justify-center" />

          {/* مؤشر حي */}
          <div className="mt-12 flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-soft-pulse rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            متاحون الآن للرد على استفساراتك — متوسط زمن الرد أقل من 10 دقائق
          </div>
        </div>
      </section>

      {/* ================= الإحصائيات ================= */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4">
          {STATS.map((s) => (
            <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </section>

      {/* ================= الأقسام الستة ================= */}
      <section id="services" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading
            kicker="OUR SERVICES"
            title="ستة أقسام تغطي رحلتك الأكاديمية كاملة"
            description="من أول محاضرة جامعية إلى نشر بحثك الأول — كل خدمة مُدارة ككيان مستقل بجودة موثقة ومتابعة مستمرة."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <CategoryCard
              key={c.slug}
              name={c.name}
              slug={c.slug}
              icon={c.icon}
              tagline={c.tagline}
              description={c.description}
              subCount={c.subServices.length}
              delay={i * 80}
            />
          ))}
        </div>
      </section>

      {/* ================= المنتجات المستقلة ================= */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal>
            <SectionHeading
              kicker="STANDALONE PRODUCTS"
              title="منتجان مستقلان داخل المنصة"
              description="أداتان احترافيتان صممناهما ليعملا بمعزل عن باقي الخدمات — سرعة، بساطة، ونتيجة فورية."
            />
          </Reveal>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.slug} delay={i * 120}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-8 card-glow">
                  <div className="flex items-center justify-between">
                    <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
                      {p.slug === "cv-builder" ? (
                        <FileText className="size-7" strokeWidth={1.6} />
                      ) : (
                        <SearchCheck className="size-7" strokeWidth={1.6} />
                      )}
                    </span>
                    <span className="rounded-full bg-gold-soft px-3 py-1 font-mono text-[10px] tracking-widest text-gold" dir="ltr">
                      {p.slug === "cv-builder" ? "ATS READY" : "QUALITY"}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-xl font-bold">{p.name}</h3>
                  <p className="mt-2 text-sm text-gold">{p.tagline}</p>
                  <p className="mt-3 flex-1 text-sm leading-8 text-muted-foreground">
                    {p.description}
                  </p>
                  <ul className="mt-5 grid grid-cols-2 gap-2.5">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="size-4 shrink-0 text-primary" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-7 h-11 rounded-xl font-bold">
                    <Link href={p.slug === "cv-builder" ? "/cv-builder" : "/plagiarism-check"}>
                      {p.cta}
                      <ArrowLeft className="size-4" />
                    </Link>
                  </Button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= آلية العمل ================= */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading
            kicker="HOW IT WORKS"
            title="ثلاث خطوات تفصلك عن إنجازك"
          />
        </Reveal>
        <div className="relative mt-12 grid gap-5 md:grid-cols-3">
          <div
            className="absolute inset-x-16 top-10 hidden border-t border-dashed border-border md:block"
            aria-hidden="true"
          />
          {HOW_IT_WORKS.map((s, i) => (
            <Reveal key={s.step} delay={i * 120}>
              <div className="relative flex h-full flex-col items-center rounded-2xl border border-border bg-card p-8 text-center card-glow">
                <span className="flex size-14 items-center justify-center rounded-full border border-primary/30 bg-background font-mono text-lg font-semibold text-primary" dir="ltr">
                  {s.step}
                </span>
                <h3 className="mt-5 font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-3 text-sm leading-8 text-muted-foreground">
                  {s.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ================= آراء العملاء ================= */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal>
            <SectionHeading
              kicker="TESTIMONIALS"
              title="ماذا يقول عملاؤنا؟"
            />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 card-glow">
                  <Quote className="size-6 text-gold" aria-hidden="true" />
                  <blockquote className="mt-4 flex-1 text-sm leading-8 text-foreground/90">
                    {t.text}
                  </blockquote>
                  <figcaption className="mt-6 border-t border-border pt-4">
                    <p className="font-display text-sm font-bold">{t.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{t.role}</p>
                    <div className="mt-2 flex gap-0.5 text-gold" aria-label="تقييم 5 من 5">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="size-3.5 fill-current" />
                      ))}
                    </div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA الختامي ================= */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-bl from-accent via-card to-card p-10 text-center card-glow sm:p-14">
            <div
              className="absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[110px]"
              aria-hidden="true"
            />
            <h2 className="relative font-display text-2xl font-extrabold leading-snug sm:text-3xl md:text-4xl">
              مشروعك القادم يستحق فريقاً يليق به
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-sm leading-8 text-muted-foreground sm:text-base">
              أخبرنا بفكرتك اليوم — استشارتك الأولى مجانية، ونعدك بخطة واضحة
              وسعر عادل قبل أن تبدأ.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-full px-8 text-base font-bold">
                <a
                  href={whatsappLink("السلام عليكم، أريد مناقشة مشروعي الأكاديمي مع منصة أم سارة.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="size-5" />
                  تواصل عبر واتساب
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-8 text-base font-bold ring-gold">
                <Link href="/consultation">احجز استشارة مجانية</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
