"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { whatsappLink } from "@/lib/platform-data";

/**
 * نموذج الطلب الموحّد: يُسجّل الطلب في قاعدة البيانات (Supabase عبر
 * /api/orders) ثم يفتح واتساب برسالة مُعبّأة مسبقاً لاستكمال التواصل.
 */
export function OrderForm({
  serviceLabel,
  orderType = "service",
  compact = false,
}: {
  serviceLabel: string;
  orderType?: "service" | "product" | "contact";
  compact?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      contact: String(fd.get("contact") || "").trim(),
      details: String(fd.get("details") || "").trim(),
      deadline: String(fd.get("deadline") || "").trim(),
      service: serviceLabel,
      type: orderType,
    };

    if (!payload.name || !payload.contact || !payload.details) {
      toast.error("يرجى تعبئة الحقول المطلوبة أولاً.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      setDone(true);
      toast.success("تم استلام طلبك — نفتح لك واتساب لإتمامة التفاصيل.");
      form.reset();

      const msg =
        `السلام عليكم، أنا ${payload.name}.\n` +
        `أرغب بطلب: ${serviceLabel}.\n` +
        (payload.deadline ? `الموعد النهائي: ${payload.deadline}.\n` : "") +
        `التفاصيل: ${payload.details}\n` +
        `وسيلة التواصل: ${payload.contact}`;
      window.open(whatsappLink(msg), "_blank", "noopener");
    } catch {
      toast.error("تعذر إرسال الطلب — تواصل معنا مباشرة عبر واتساب.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 rounded-2xl border border-border bg-card p-6 card-glow"
      id="order-form"
    >
      <div>
        <h3 className="font-display text-lg font-bold">اطلب: {serviceLabel}</h3>
        <p className="mt-1 text-xs leading-6 text-muted-foreground">
          املأ النموذج — يصلنا طلبك فوراً ونكمل التفاصيل على واتساب.
        </p>
      </div>

      <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
        <div className="grid gap-1.5">
          <Label htmlFor="of-name">الاسم *</Label>
          <Input id="of-name" name="name" placeholder="اسمك الكريم" required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="of-contact">جوال أو بريد *</Label>
          <Input id="of-contact" name="contact" placeholder="05xxxxxxxx أو بريدك" required />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="of-deadline">الموعد النهائي (اختياري)</Label>
        <Input id="of-deadline" name="deadline" placeholder="مثال: بعد أسبوعين / نهاية الشهر" />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="of-details">تفاصيل الطلب *</Label>
        <Textarea
          id="of-details"
          name="details"
          placeholder="اذكر التخصص، نوع العمل، عدد الصفحات، أي متطلبات خاصة…"
          rows={4}
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="h-11 rounded-xl font-bold" size="lg">
        {loading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : done ? (
          <>
            <CheckCircle2 className="size-5" />
            تم الاستلام — أكمل عبر واتساب
          </>
        ) : (
          <>
            <Send className="size-4" />
            أرسل الطلب
            <MessageCircle className="size-4 opacity-60" />
          </>
        )}
      </Button>
      <p className="text-center text-[11px] text-muted-foreground">
        بياناتك محفوظة بسرية تامة ولا تُستخدم إلا لخدمة طلبك.
      </p>
    </form>
  );
}
