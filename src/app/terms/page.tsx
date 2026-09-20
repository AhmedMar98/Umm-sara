import type { Metadata } from "next";
import Link from "next/link";
import {
  ScrollText,
  GraduationCap,
  CreditCard,
  Copyright,
  AlertTriangle,
  Scale,
} from "lucide-react";
import { SectionHeading } from "@/components/section-blocks";

export const metadata: Metadata = {
  title: "شروط الاستخدام",
  description:
    "شروط استخدام منصة أم سارة للخدمات الأكاديمية والبحثية — طبيعة الخدمات، الطلبات، الملكية الفكرية، وحدود المسؤولية.",
};

const SECTIONS = [
  {
    icon: ScrollText,
    title: "1. طبيعة الخدمة",
    body: "توفر منصة أم سارة خدمات مساندة أكاديمية وبحثية: التحرير والتدقيق، التحليل الإحصائي، الإعداد الفني للبحوث والعروض، والتدريب والاستشارة. باستخدامك الموقع أو طلبك أي خدمة فإنك تقر بقراءة هذه الشروط وقبولها.",
  },
  {
    icon: GraduationCap,
    title: "2. الاستخدام المسؤول للأعمال",
    body: "ما يُسلَّم إليك عملٌ يُقدَّم كمسودة ومرجع ومصدر مساندة، وأنت المسؤول الأول عن الاستخدام النهائي وفق أنظمة جهتك التعليمية وأخلاقيات البحث العلمي المعتمدة في جامعتك. نرفض صراحة أي طلب يهدف إلى انتحال كامل أو تقديم العمل انتحالاً مباشراً، وللمنصة رفض أي طلب يخالف ذلك.",
  },
  {
    icon: CreditCard,
    title: "3. الطلبات والدفع",
    body: "يبدأ أي عمل بعد الاتفاق على نطاقه وموعده وسعره المكتوب عبر قناة التواصل الرسمية. تُحدد طريقة الدفع وجدول الدفعات عند الاتفاق ويُرسل لك عرض سعر مفصل قبل بدء التنفيذ — لا رسوم خفية ولا مبالغ تُطلب لاحقاً عن غير اتفاق مكتوب. المراجعات المجانية تكون ضمن نطاق العمل المتفق عليه فقط.",
  },
  {
    icon: Copyright,
    title: "4. الملكية الفكرية",
    body: "العمل المُسلَّم لك ملكك بعد اكتمال الدفع المتفق عليه، ولا تحتفظ المنصة بأي حق فيه ولا تعيد استخدامه أو عرضه دون إذنك الكامل. تبقى حقوق العلامة والتصاميم والنصوص العامة للموقع ملكاً للمنصة. المحتوى الموسوم «نموذج توضيحي» في معرض الأعمال هو عرض توضيحي لطريقة العمل وليس عميلاً محدداً.",
  },
  {
    icon: AlertTriangle,
    title: "5. حدود المسؤولية",
    body: "تبذل المنصة عناية معقولة في كل عمل، لكنها لا تضمن نتائج لا تملك قرارها — كدرجات محددة أو قبول نشر أو قرارات لجان — لأنها بيد جهات مستقلة. مسؤوليتها القصوى في أي نزاع هي قيمة ما دُفع مقابل العمل محل النزاع. لا تتحمل المنصة أي أضرار غير مباشرة ناتجة عن التأخير في التسليم الناتج عن المستخدم نفسه.",
  },
  {
    icon: Scale,
    title: "6. القانون الواجب التطبيق",
    body: "تخضع هذه الشروط لأنظمة المملكة العربية السعودية، وتُفسر أي مسائل غير منصوص عليها وفق الأنظمة ذات العلاقة بما فيها نظام حماية البيانات الشخصية. في حال تعارض أي بند مع نظام واجب التطبيق، يُقدَّم النظام على البند ويبقى باقي الشروط نافذاً كاملاً.",
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <SectionHeading
        as="h1"
        kicker="TERMS OF USE"
        title="شروط الاستخدام"
        description="قواعد واضحة تحكم علاقتنا بعملائنا — طبيعة الخدمات، الطلبات، الملكية، والمسؤوليات على اختصار ودون غموض."
      />
      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        آخر تحديث: سبتمبر 2026 · تسرى هذه الشروط على كل استخدام للموقع أو طلب لخدماته
      </p>

      <div className="mt-10 space-y-5">
        {SECTIONS.map((s) => (
          <section
            key={s.title}
            className="hairline-top rounded-xl border border-border bg-card p-6 card-glow"
          >
            <h2 className="flex items-center gap-3 font-display text-base font-bold">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-gold/25 bg-gold-soft text-gold">
                <s.icon className="size-4" strokeWidth={1.8} />
              </span>
              {s.title}
            </h2>
            <p className="mt-3 text-sm leading-8 text-muted-foreground">{s.body}</p>
          </section>
        ))}

        <section className="rounded-xl border border-gold/25 bg-gold-soft/30 p-6">
          <h2 className="font-display text-base font-bold">7. للتواصل بشأن هذه الشروط</h2>
          <p className="mt-3 text-sm leading-8 text-muted-foreground">
            أي سؤال أو استفسار حول هذه الشروط يسعدنا الإجابة عليه عبر{" "}
            <Link href="/contact" className="font-bold text-primary hover:text-gold">
              صفحة التواصل
            </Link>
            . راجع أيضاً{" "}
            <Link href="/privacy" className="font-bold text-primary hover:text-gold">
              سياسة الخصوصية
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
