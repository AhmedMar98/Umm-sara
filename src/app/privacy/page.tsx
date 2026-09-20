import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Database, Cookie, Share2, UserCheck, Mail } from "lucide-react";
import { SectionHeading } from "@/components/section-blocks";
import { WHATSAPP_DISPLAY, whatsappLink } from "@/lib/platform-data";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description:
    "كيف تجمع منصة أم سارة بياناتك وتستخدمها وتحميها — وفق أفضل الممارسات وأنظمة حماية البيانات الشخصية في المملكة العربية السعودية.",
};

const SECTIONS = [
  {
    icon: Database,
    title: "1. البيانات التي نجمعها",
    body: "نجمع الحد الأدنى اللازم لخدمتك فقط: الاسم، وسيلة التواصل (جوال أو بريد)، وتفاصيل الطلب أو الاستشارة التي تكتبها بنفسك في النماذج. لا نجمع أي بيانات دفع داخل الموقع — التسويات المالية تتم عبر قنوات تواصل مباشرة بعد الاتفاق، ولا نطلب أبداً بيانات بطاقات بنكية أو كلمات مرور حساباتك الجامعية.",
  },
  {
    icon: ShieldCheck,
    title: "2. كيف نستخدم بياناتك",
    body: "تُستخدم بياناتك حصراً لتنفيذ طلبك والرد على استفساراتك وتحسين جودة خدماتنا. عندما ترسل نموذج طلب، يسجَّل الطلب في قاعدة بياناتنا المؤمنة ثم يُفتح لك حوار واتساب مباشر لاستكمال التفاصيل — لا نستخدم بياناتك في أي حملات تسويقية ولا نرسل رسائل ترويجية دون طلبك الصريح.",
  },
  {
    icon: ShieldCheck,
    title: "3. الحفظ والحماية",
    body: "تُحفظ بيانات الطلبات في قاعدة بيانات مُدارة بصلاحيات وصول مقيدة (Supabase مع تشفير الاتصال وسياسات أمن على مستوى الصفوف). الوصول إليها محصور بالفريق المكلَّف بتنفيذ طلبك. نحتفظ ببيانات الطلب للمدة اللازمة لتنفيذه ودعم ما بعد التسليم، وعند طلبك حذفها نحذفها بشكل نهائي ونؤكد لك ذلك.",
  },
  {
    icon: Cookie,
    title: "4. ملفات التعريف والتخزين المحلي",
    body: "الموقع لا يستخدم أي أدوات تتبع أو إعلانات إطلاقاً. ما نستخدمه تخزين محلي وظيفي فقط داخل متصفحك: تفضيلك للسمة الداكنة أو الفاتحة، محتويات سلة الطلبات المؤقتة، ومسودة سيرتك الذاتية في بنّاء السيرة. هذه البيانات لا تغادر جهازك، ويمكنك مسحها في أي وقت من إعدادات المتصفح. أي قياس مجهول مستقبلي لن يعمل إلا بموافقتك الصريحة عبر شريط الموافقة.",
  },
  {
    icon: Share2,
    title: "5. مشاركة البيانات",
    body: "لا نبيع بياناتك ولا نشاركها مع أي طرف ثالث لأي غرض تجاري، باستثناء ما توجبه الأنظمة والجهات المختصة بطلب نظامي موثق. الأداة الوحيدة الخارجية في مسار طلبك هي تطبيق واتساب الذي تفتحه بنفسك لاستكمال التواصل — وهو خيار تختاره أنت.",
  },
  {
    icon: UserCheck,
    title: "6. حقوقك",
    body: "لك وفق أنظمة حماية البيانات الشخصية في المملكة حق الوصول إلى بياناتك وطلب تصحيحها أو حذفها في أي وقت، وحق سحب موافقتك على أي معالجة اختيارية. لممارسة أي من هذه الحقوق راسلنا عبر واتساب من صفحة التواصل وسنستجيب خلال مدة لا تتجاوز خمسة أيام عمل.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <SectionHeading
        as="h1"
        kicker="PRIVACY POLICY"
        title="سياسة الخصوصية"
        description="نجمع أقل ما يلزم لخدمتك، ولا نشاركه مع أحد — هذه السيافة توضح بالتفصيل ماذا نحفظ ولماذا وكيف تحميه أنظمتنا."
      />
      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        آخر تحديث: سبتمبر 2026 · ننسخ هذه السياسة عند أي تغيير جوهري في هذه الصفحة
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

        {/* التواصل */}
        <section className="rounded-xl border border-gold/25 bg-gold-soft/30 p-6">
          <h2 className="flex items-center gap-3 font-display text-base font-bold">
            <Mail className="size-4 text-gold" />
            7. للتواصل بشأن الخصوصية
          </h2>
          <p className="mt-3 text-sm leading-8 text-muted-foreground">
            لأي سؤال حول هذه السياسة أو بياناتك، راسلنا مباشرة على واتساب{" "}
            <a
              href={whatsappLink("السلام عليكم، لدي سؤال بشأن سياسة الخصوصية.")}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono font-bold text-primary hover:text-gold"
              dir="ltr"
            >
              {WHATSAPP_DISPLAY}
            </a>{" "}
            أو من{" "}
            <Link href="/contact" className="font-bold text-primary hover:text-gold">
              صفحة التواصل
            </Link>
            . راجع أيضاً{" "}
            <Link href="/terms" className="font-bold text-primary hover:text-gold">
              شروط الاستخدام
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
