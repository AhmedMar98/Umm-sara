import type { Metadata } from "next";
import { Info } from "lucide-react";
import { SectionHeading } from "@/components/section-blocks";
import { WorksExplorer } from "@/components/works-explorer";
import { WORKS } from "@/lib/platform-data";

export const metadata: Metadata = {
  title: "معرض الأعمال",
  description:
    "نماذج من أعمال منصة أم سارة: خطط بحث، مشاريع تخرج، تحليل إحصائي، تدقيق وتنسيق، وملصقات علمية — بنية العمل والتسليمات في كل تخصص.",
};

export default function WorksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading
        as="h1"
        kicker="PORTFOLIO"
        title="معرض الأعمال"
        description="بنية العمل والتسليمات في مختلف تخصصاتنا الأكاديمية — لكل عمل صفحته الكاملة بالمنهجية والمدة الزمنية."
      />

      {/* إفصاح النزاهة: النماذج توضيحية لبنية العمل — واضح وصريح من أعلى الصفحة.
          عند توفر أعمال حقيقية موثقة تُستبدل من مصدر البيانات دون لمس الكود. */}
      <div className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-xl border border-gold/25 bg-gold-soft/40 p-4 text-xs leading-6 text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-gold" />
        <p>
          المعروض هنا <b className="text-foreground">نماذج توضيحية</b> لطريقة عملنا
          وتسليماتنا في كل تخصص — نؤمن بأن الثقة تُبنى بالشفافية لا بالادعاء.
          اطلب عبر واتساب نماذج مرجعية إضافية لخدمة محددة قبل أن تبدأ.
        </p>
      </div>

      <WorksExplorer works={WORKS} />
    </div>
  );
}
