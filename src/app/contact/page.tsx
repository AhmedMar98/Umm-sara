import type { Metadata } from "next";
import { MessageCircle, Mail, Clock, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/section-blocks";
import { Reveal } from "@/components/reveal";
import { OrderForm } from "@/components/order-form";
import { whatsappLink, WHATSAPP_DISPLAY } from "@/lib/platform-data";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: "تواصل مع منصة أم سارة — واتساب، بريد إلكتروني، أو نموذج الرسائل المباشر.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading
        as="h1"
        kicker="CONTACT"
        title="يسعدنا سماعك"
        description="اختر الوسيلة الأنسب لك — نرد على واتساب عادة خلال دقائق، وعلى البريد خلال يوم عمل واحد."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        <Reveal>
          <a
            href={whatsappLink("السلام عليكم، لدي استفسار عن خدمات المنصة.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 card-glow transition-transform hover:-translate-y-1"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
              <MessageCircle className="size-6" strokeWidth={1.8} />
            </span>
            <h2 className="font-display text-base font-bold">واتساب — الأسرع</h2>
            <p className="text-xs leading-6 text-muted-foreground">
              رد شبه فوري خلال ساعات العمل، وأفضل خيار للطلبات العاجلة.
            </p>
            <p className="font-mono text-sm text-primary" dir="ltr">{WHATSAPP_DISPLAY}</p>
          </a>
        </Reveal>
        <Reveal delay={90}>
          <a
            href="mailto:info@ummsarah.sa"
            className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 card-glow transition-transform hover:-translate-y-1"
          >
            <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
              <Mail className="size-6" strokeWidth={1.8} />
            </span>
            <h2 className="font-display text-base font-bold">البريد الإلكتروني</h2>
            <p className="text-xs leading-6 text-muted-foreground">
              الأنسب لإرسال الملفات التفصيلية والعقود الرسمية.
            </p>
            <p className="font-mono text-sm text-primary" dir="ltr">info@ummsarah.sa</p>
          </a>
        </Reveal>
        <Reveal delay={180}>
          <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6">
            <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
              <Clock className="size-6" strokeWidth={1.8} />
            </span>
            <h2 className="font-display text-base font-bold">ساعات العمل</h2>
            <p className="text-xs leading-6 text-muted-foreground">
              الأحد — الخميس · 9 صباحاً — 11 مساءً
            </p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5 text-primary" />
              الرياض، المملكة العربية السعودية
            </p>
          </div>
        </Reveal>
      </div>

      <div className="mx-auto mt-12 max-w-2xl">
        <OrderForm serviceLabel="رسالة تواصل عامة" orderType="contact" compact />
      </div>
    </div>
  );
}
