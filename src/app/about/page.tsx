import type { Metadata } from "next";
import { Target, Eye, HeartHandshake, Award, ShieldCheck, Clock } from "lucide-react";
import { SectionHeading } from "@/components/section-blocks";
import { Reveal, StatCounter } from "@/components/reveal";
import { STATS, PLATFORM_NAME } from "@/lib/platform-data";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "من نحن",
  description: "منصة أم سارة — قصتنا وقيمنا ومعاييرنا في تقديم الخدمات الأكاديمية والبحثية.",
};

const VALUES = [
  {
    icon: Target,
    title: "الدقة المنهجية",
    desc: "كل عمل يمر بمراجعة منهجية مزدوجة — من التخصص أولاً، ومن التحرير اللغوي ثانياً.",
  },
  {
    icon: ShieldCheck,
    title: "الشفافية المطلقة",
    desc: "سعر واضح مسبقاً، جدول زمني مكتوب، وتحديثات دورية. لا مفاجآت ولا التزامات خفية.",
  },
  {
    icon: Clock,
    title: "احترام الوقت",
    desc: "المواعيد النهائية عقد لا يُنقض — تسليم مرحلي يتيح لك مراجعة العمل أولاً بأول.",
  },
  {
    icon: HeartHandshake,
    title: "شراكة لا خدمة",
    desc: "ننجح عندما تنجح أنت: نبني معك مهارة بحثية تبقى معك بعد تسليم العمل.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-overlay absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-primary" dir="ltr">
            ABOUT US
          </p>
          <h1 className="font-display text-3xl font-black tracking-tight sm:text-4xl">
            قصة منصة {PLATFORM_NAME}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-9 text-muted-foreground sm:text-base">
            بدأنا من ملاحظة بسيطة تكررت أمامنا: طلاب وباحثون مجتهدون يضيعون
            أفضل أفكارهم في متاهات التنسيق والمصادر والمواعيد. فأنشأنا منصة
            تجمع الخبرة الأكاديمية بأدوات رقمية حديثة — لتصبح رحلة البحث
            العلمي واضحة الخطوات، عادلة السعر، ومشرقة النتيجة.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-9 text-muted-foreground sm:text-base">
            اليوم نخدم باحثين وطلاباً من أكثر من أربعين جامعة سعودية وخليجية،
            بفريق يضم أكاديميين ومحررين ومحللين إحصائيين ومبرمجين — كلٌّ في
            مجاله، وكلهم على معيار واحد: جودة تستحق أن تحمل اسمك.
          </p>
        </div>
      </section>

      {/* الإحصائيات */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4">
          {STATS.map((s) => (
            <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </section>

      {/* القيم */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <SectionHeading
            kicker="OUR VALUES"
            title="أربعة مبادئ لا نحيد عنها"
            description="ليست شعارات على جدار — بل معايير تقييم داخلية نُحاسب عليها أنفسنا في كل طلب."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 90}>
              <div className="flex h-full gap-5 rounded-2xl border border-border bg-card p-7 card-glow">
                <span className="flex size-13 shrink-0 items-center justify-center rounded-xl bg-accent p-3.5 text-primary">
                  <v.icon className="size-6" strokeWidth={1.7} />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{v.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* لماذا نحن */}
      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <div>
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-primary" dir="ltr">
                  WHY US
                </p>
                <h2 className="font-display text-2xl font-extrabold leading-snug sm:text-3xl">
                  لأن التميز الأكاديمي لا يُترك للحظ
                </h2>
                <ul className="mt-6 space-y-3.5 text-sm leading-8 text-muted-foreground">
                  <li className="flex gap-3">
                    <Award className="mt-1 size-5 shrink-0 text-gold" />
                    فريق متخصص لكل قسم — لا «صائغ واحد لكل الصنائع».
                  </li>
                  <li className="flex gap-3">
                    <Award className="mt-1 size-5 shrink-0 text-gold" />
                    أدوات رقمية داخلية لضبط الجودة وتتبع التقدم لحظة بلحظة.
                  </li>
                  <li className="flex gap-3">
                    <Award className="mt-1 size-5 shrink-0 text-gold" />
                    مراجعات مجانية حتى الرضا التام، بشروط مكتوبة واضحة.
                  </li>
                  <li className="flex gap-3">
                    <Award className="mt-1 size-5 shrink-0 text-gold" />
                    دعم ما بعد التسليم — أسئلتك بعد الاستلام لها أثر كأسئلتك قبله.
                  </li>
                </ul>
                <Button asChild size="lg" className="mt-8 rounded-full font-bold">
                  <Link href="/consultation">
                    جاهز للبدء؟ احجز استشارتك
                    <ArrowLeft className="size-4" />
                  </Link>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={140}>
              <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 card-glow">
                <div
                  className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-primary/15 blur-[70px]"
                  aria-hidden="true"
                />
                <Eye className="size-10 text-primary" strokeWidth={1.4} />
                <blockquote className="mt-6 font-display text-lg font-bold leading-relaxed">
                  «نقيس نجاحنا بعدد الطلاب الذين لم يعودوا يحتاجوننا — لأنهم
                  اكتسبوا المهارة لا الخدمة فقط.»
                </blockquote>
                <p className="mt-4 font-mono text-xs tracking-widest text-muted-foreground" dir="ltr">
                  — TEAM {PLATFORM_NAME.toUpperCase()}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
