import type { Metadata } from "next";
import { SearchCheck, ShieldCheck, FileSearch, PenLine, BookCheck } from "lucide-react";
import { SectionHeading } from "@/components/section-blocks";
import { Reveal } from "@/components/reveal";
import { OrderForm } from "@/components/order-form";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "فحص الأصالة",
  description:
    "فحص نسبة الاقتباس ومراجعة التشابه النصي وتحسين الصياغة الأكاديمية — بصيغة مهنية دون وعود مسبقة بنسب محددة.",
};

const STEPS = [
  {
    icon: FileSearch,
    title: "١. الفحص",
    desc: "نفحص عملك بأنظمة كشف التشابه المتقدمة ونحلّل مصادر التطابق بدقة.",
  },
  {
    icon: PenLine,
    title: "٢. التحسين",
    desc: "نعيد صياغة المقاطع المتشابهة بلغة أكاديمية رصينة تحفظ المعنى العلمي.",
  },
  {
    icon: BookCheck,
    title: "٣. التوثيق",
    desc: "نضبط الاستشهادات والمراجع وفق نمط التوثيق المطلوب (APA / MLA / Chicago).",
  },
];

export default function PlagiarismCheckPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-overlay absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Badge variant="outline" className="mb-4 border-gold/40 bg-gold-soft text-gold">
            منتج مستقل · فحص ومراجعة وتحسين
          </Badge>
          <h1 className="font-display text-3xl font-black sm:text-4xl">
            فحص الأصالة الأكاديمية
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-muted-foreground sm:text-base">
            نُجري الفحص ومراجعة التشابه النصي وتحسين الصياغة بمنهجية علمية
            شفافة — نُقرّ بما يظهره التقرير ونعالجه معك، دون وعود مسبقة
            بنسب محددة، لأن ما يهم فعلاً هو سلامة عملك الأكاديمي.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Reveal>
            <SectionHeading
              kicker="PROCESS"
              title="كيف نعمل؟"
              center={false}
            />
          </Reveal>
          <div className="mt-8 space-y-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 100}>
                <div className="flex gap-5 rounded-2xl border border-border bg-card p-6 card-glow">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <s.icon className="size-6" strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-7 text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-8 flex items-start gap-4 rounded-2xl border border-gold/30 bg-gold-soft p-6">
              <ShieldCheck className="mt-0.5 size-6 shrink-0 text-gold" />
              <div>
                <h3 className="font-display text-sm font-bold">التزامنا المهني</h3>
                <p className="mt-1.5 text-[13px] leading-7 text-muted-foreground">
                  نلتزم بسرية تامة لملفاتك، وبتقارير صادقة تعكس الواقع، وبصياغة
                  تحترم حقوق الملكية الفكرية. خدمتنا «فحص ومراجعة وتحسين» —
                  وليست ضمانات بلاسلوب علمي.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <aside className="lg:col-span-2">
          <div className="lg:sticky lg:top-24">
            <OrderForm serviceLabel="فحص الأصالة الأكاديمية" orderType="product" />
          </div>
        </aside>
      </div>
    </div>
  );
}
