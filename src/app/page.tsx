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

/* الكلمات المتدفقة أسفل الهيرو — كلها من الأقسام الفعلية */
const MARQUEE_WORDS = [
  "بحوث علمية",
  "رسائل ماجستير ودكتوراه",
  "مشاريع تخرج",
  "تحليل إحصائي",
  "برمجة وتقنية",
  "تصميم عرض",
  "سيرة ذاتية",
  "فحص أصالة",
  "استشارات أكاديمية",
  "تلخيص ومراجعة",
];

/* بيانات الأركان mono (نمط activetheory/locomotive) */
const CORNER_META = [
  { text: "SA · RIYADH", pos: "top-right" },
  { text: "EST. MMXXV", pos: "top-left" },
  { text: "26.4°N — 47.6°E", pos: "bottom-left" },
  { text: "AR · EN", pos: "bottom-right" },
] as const;

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ================= Hero — مشهد سينمائي كامل ================= */}
      <section className="relative flex min-h-[92svh] flex-col overflow-hidden">
        {/* طبقات المشهد: جزيئات ثلاثية العمق → أورورا → شبكة → فيغنيت */}
        <ParticleField />
        <div className="aurora aurora-emerald -top-40 right-[8%] h-[34rem] w-[34rem]" aria-hidden="true" />
        <div className="aurora aurora-gold top-1/3 -left-40 h-[30rem] w-[30rem]" aria-hidden="true" />
        <div className="aurora aurora-emerald bottom-[-12rem] left-1/3 h-[26rem] w-[26rem]" aria-hidden="true" />
        <div className="grid-overlay absolute inset-0" aria-hidden="true" />
        <div className="vignette absolute inset-0" aria-hidden="true" />

        {/* بيانات الأركان التقنية */}
        {CORNER_META.map((m) => (
          <span
            key={m.text}
            className={`mono-chip pointer-events-none absolute z-10 hidden text-[10px] text-muted-foreground/70 md:block ${
              m.pos === "top-right" && "right-8 top-24"
            } ${m.pos === "top-left" && "left-8 top-24" } ${
              m.pos === "bottom-left" && "bottom-8 left-8"
            } ${m.pos === "bottom-right" && "bottom-8 right-8"}`}
            dir="ltr"
            aria-hidden="true"
          >
            {m.text}
          </span>
        ))}

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-28 text-center sm:px-6">
          <Reveal>
            <Badge
              variant="outline"
              className="mb-8 gap-2 rounded-full border-gold/35 bg-gold-soft px-4 py-1.5 text-xs font-medium text-gold backdrop-blur-sm"
            >
              <Sparkles className="size-3.5" />
              منصة سعودية للخدمات الأكاديمية والبحثية
            </Badge>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="font-display text-[2.6rem] font-black leading-[1.2] tracking-tight sm:text-6xl md:text-7xl">
              نحو تفوّقٍ أكاديمي
              <br />
              <span className="font-serif-accent gold-gradient-text text-glow pr-2 text-[3.2rem] font-bold leading-[1.35] sm:text-7xl md:text-[5.25rem]">
                أشدُّ إشراقاً
              </span>
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className="mt-7 max-w-2xl text-balance text-sm leading-8 text-muted-foreground sm:text-base sm:leading-9">
              في منصة أم سارة نرافقك في رحلتك الأكاديمية كاملة — من أول بحث
              جامعي، إلى رسالة الماجستير والدكتوراه، إلى سيرتك الذاتية التي
              تفتح لك أبواب المستقبل. فريق خبراء أكاديميين، معايير علمية صارمة،
              والتزام تام بالشفافية.
            </p>
          </Reveal>

          <Reveal delay={360}>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="shine h-12 rounded-full border border-gold/40 bg-gradient-to-l from-gold-bright to-gold px-8 text-base font-bold text-[#241a08] shadow-[0_10px_40px_-10px_rgba(197,160,89,0.55)] transition-transform duration-300 hover:scale-[1.03]"
              >
                <Link href="/services" data-cursor>
                  ابدأ طلبك الآن
                  <ArrowLeft className="size-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-primary/40 bg-transparent px-8 text-base font-bold text-primary backdrop-blur-sm transition-all duration-300 hover:border-primary hover:bg-glow/20 hover:scale-[1.03]"
              >
                <Link href="/consultation" data-cursor>
                  <CalendarClock className="size-5" />
                  احجز استشارة مجانية
                </Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={480}>
            <TrustRow className="mt-12 justify-center" />
          </Reveal>

          <Reveal delay={560}>
            <div className="mt-10 flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-soft-pulse rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              متاحون الآن للرد على استفساراتك — متوسط زمن الرد أقل من 10 دقائق
            </div>
          </Reveal>
        </div>

        {/* تلميح التمرير */}
        <div className="relative mx-auto mb-5 hidden flex-col items-center gap-2 text-muted-foreground/60 md:flex" aria-hidden="true">
          <span className="mono-chip text-[9px]">SCROLL</span>
          <span className="animate-scroll-hint block h-6 w-px bg-gradient-to-b from-gold/70 to-transparent" />
        </div>

        {/* شريط الخدمات المتدفق */}
        <div className="marquee-mask relative border-y border-border bg-card/30 py-3.5 backdrop-blur-sm">
          <div className="animate-marquee flex w-max flex-row-reverse items-center gap-8 whitespace-nowrap will-change-transform">
            {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, i) => (
              <span key={i} className="flex items-center gap-8 text-sm text-muted-foreground">
                <span className="text-gold/80" aria-hidden="true">✦</span>
                {word}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= الإحصائيات — أعمدة بخطوط شعرية ================= */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-4 py-14 sm:px-6 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <StatCounter
              key={s.label}
              value={s.value}
              suffix={s.suffix}
              label={s.label}
              className={
                i > 0
                  ? "lg:border-inline-start lg:border-border lg:ps-8"
                  : undefined
              }
            />
          ))}
        </div>
      </section>

      {/* ================= الأقسام الستة ================= */}
      <section id="services" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal>
          <SectionHeading
            kicker="OUR SERVICES"
            index="01"
            title="ستة أقسام تغطي رحلتك الأكاديمية كاملة"
            description="من أول محاضرة جامعية إلى نشر بحثك الأول — كل خدمة مُدارة ككيان مستقل بجودة موثقة ومتابعة مستمرة."
          />
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <CategoryCard
              key={c.slug}
              name={c.name}
              slug={c.slug}
              icon={c.icon}
              tagline={c.tagline}
              description={c.description}
              subCount={c.subServices.length}
              index={i + 1}
              delay={i * 80}
            />
          ))}
        </div>
      </section>

      {/* ================= المنتجات المستقلة ================= */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <Reveal>
            <SectionHeading
              kicker="STANDALONE PRODUCTS"
              index="02"
              title="منتجان مستقلان داخل المنصة"
              description="أداتان احترافيتان صممناهما ليعملا بمعزل عن باقي الخدمات — سرعة، بساطة، ونتيجة فورية."
            />
          </Reveal>
          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.slug} delay={i * 120}>
                <div className="frame-inset shine flex h-full flex-col rounded-xl border border-border bg-card p-8 card-glow">
                  <div className="flex items-center justify-between">
                    <span className="flex size-14 items-center justify-center rounded-xl border border-gold/25 bg-gold-soft text-gold">
                      {p.slug === "cv-builder" ? (
                        <FileText className="size-7" strokeWidth={1.6} />
                      ) : (
                        <SearchCheck className="size-7" strokeWidth={1.6} />
                      )}
                    </span>
                    <span className="mono-chip rounded-full bg-secondary px-3 py-1 text-[9px] text-gold" dir="ltr">
                      {p.slug === "cv-builder" ? "ATS READY" : "QUALITY"}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-xl font-bold">{p.name}</h3>
                  <p className="font-serif-accent mt-1.5 text-lg text-gold">{p.tagline}</p>
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
                  <Button asChild className="mt-7 h-11 rounded-lg font-bold">
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
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <Reveal>
          <SectionHeading
            kicker="HOW IT WORKS"
            index="03"
            title="ثلاث خطوات تفصلك عن إنجازك"
          />
        </Reveal>
        <div className="relative mt-14 grid gap-5 md:grid-cols-3">
          <div
            className="absolute inset-x-16 top-10 hidden border-t border-dashed border-gold/25 md:block"
            aria-hidden="true"
          />
          {HOW_IT_WORKS.map((s, i) => (
            <Reveal key={s.step} delay={i * 120}>
              <div className="hairline-top flex h-full flex-col items-center rounded-xl border border-border bg-card p-8 text-center card-glow">
                <span className="flex size-14 items-center justify-center rounded-full border border-gold/40 bg-background font-mono text-lg font-semibold text-gold" dir="ltr">
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
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <Reveal>
            <SectionHeading
              kicker="TESTIMONIALS"
              index="04"
              title="ماذا يقول عملاؤنا؟"
            />
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <figure className="hairline-top flex h-full flex-col rounded-xl border border-border bg-card p-7 card-glow">
                  <Quote className="size-6 text-gold" aria-hidden="true" />
                  <blockquote className="font-serif-accent mt-4 flex-1 text-[1.05rem] leading-9 text-foreground/90">
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

      {/* ================= CTA الختامي — إطار-داخل-إطار ================= */}
      <section className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
        <Reveal>
          <div className="gradient-frame corner-marks relative overflow-hidden rounded-2xl bg-card p-10 text-center card-glow sm:p-16">
            <div
              className="absolute -top-28 left-1/2 h-64 w-[38rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-32 right-1/4 h-56 w-96 rounded-full bg-gold/10 blur-[110px]"
              aria-hidden="true"
            />
            <p className="mono-chip text-[10px] text-gold/80" dir="ltr">BEGIN YOUR JOURNEY</p>
            <h2 className="relative mt-5 font-display text-2xl font-extrabold leading-snug sm:text-3xl md:text-4xl">
              مشروعك القادم يستحق فريقاً{" "}
              <span className="font-serif-accent gold-gradient-text">يليق به</span>
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-sm leading-8 text-muted-foreground sm:text-base">
              أخبرنا بفكرتك اليوم — استشارتك الأولى مجانية، ونعدك بخطة واضحة
              وسعر عادل قبل أن تبدأ.
            </p>
            <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="shine h-12 rounded-full border border-gold/40 bg-gradient-to-l from-gold-bright to-gold px-8 text-base font-bold text-[#241a08] shadow-[0_10px_40px_-10px_rgba(197,160,89,0.55)] transition-transform duration-300 hover:scale-[1.03]"
              >
                <a
                  href={whatsappLink("السلام عليكم، أريد مناقشة مشروعي الأكاديمي مع منصة أم سارة.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor
                >
                  <MessageCircle className="size-5" />
                  تواصل عبر واتساب
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-full border-primary/40 bg-transparent px-8 text-base font-bold text-primary transition-all duration-300 hover:border-primary hover:bg-glow/20 hover:scale-[1.03]"
              >
                <Link href="/consultation">احجز استشارة مجانية</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
