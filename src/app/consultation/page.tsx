"use client";

import { useState, type FormEvent } from "react";
import { CalendarClock, CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { CATEGORIES, whatsappLink } from "@/lib/platform-data";

export default function ConsultationPage() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      contact: String(fd.get("contact") || "").trim(),
      field: String(fd.get("field") || "").trim(),
      date: String(fd.get("date") || "").trim(),
      time: String(fd.get("time") || "").trim(),
      notes: String(fd.get("notes") || "").trim(),
    };

    if (!payload.name || !payload.contact || !payload.field) {
      toast.error("يرجى تعبئة الاسم ووسيلة التواصل والمجال.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setDone(true);
      toast.success("تم تسجيل حجزك — نفتح واتساب لتأكيد الموعد.");

      const msg =
        `السلام عليكم، أنا ${payload.name}.\n` +
        `أرغب بحجز استشارة مجانية.\n` +
        `المجال: ${payload.field}\n` +
        `التاريخ المفضل: ${payload.date || "مرن"}\n` +
        `الوقت المفضل: ${payload.time || "مرن"}\n` +
        (payload.notes ? `ملاحظات: ${payload.notes}\n` : "") +
        `وسيلة التواصل: ${payload.contact}`;
      window.open(whatsappLink(msg), "_blank", "noopener");
    } catch {
      toast.error("تعذر الحجز — راسلنا مباشرة عبر واتساب.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        {/* لماذا الاستشارة */}
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-primary" dir="ltr">
            FREE CONSULTATION
          </p>
          <h1 className="font-display text-3xl font-black sm:text-4xl">
            احجز استشارتك المجانية
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-8 text-muted-foreground sm:text-base">
            ثلاثون دقيقة نخصصها لك مع أحد مستشارينا الأكاديميين — بلا أي
            التزام. نناقش فكرتك، نحدد التحديات، ونرسم معك خطة أولية واضحة
            قبل أن تدفع ريالاً واحداً.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              "تقييم صريح لجدوى فكرتك البحثية أو مشروعك",
              "خطة زمنية تقديرية وهيكل عمل مبدئي",
              "تقدير سعر عادل وشفاف بلا مفاجآت",
              "توصية بالمسار الأمثل حتى لو لم يكن معنا",
            ].map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm leading-7">
                <CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" />
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold-soft p-5">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-soft-pulse rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
            </span>
            <p className="text-[13px] leading-6 text-muted-foreground">
              متوسط زمن الرد على الحجوزات: أقل من ساعتين خلال ساعات العمل.
            </p>
          </div>
        </div>

        {/* النموذج */}
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-border bg-card p-7 card-glow"
        >
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <CalendarClock className="size-5 text-primary" />
            تفاصيل الحجز
          </h2>

          <div className="mt-6 grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="c-name">الاسم *</Label>
              <Input id="c-name" name="name" placeholder="اسمك الكريم" required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="c-contact">جوال أو بريد *</Label>
              <Input id="c-contact" name="contact" placeholder="05xxxxxxxx أو بريدك" required />
            </div>
            <div className="grid gap-1.5">
              <Label>المجال الأكاديمي *</Label>
              <Select name="field" required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر المجال الأقرب" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.slug} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="مجال آخر / غير متأكد">مجال آخر / غير متأكد</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="c-date">التاريخ المفضل</Label>
                <Input id="c-date" name="date" type="date" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="c-time">الوقت المفضل</Label>
                <select
                  id="c-time"
                  name="time"
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">مرن</option>
                  <option value="صباحي (9 — 12)">صباحي (9 — 12)</option>
                  <option value="ظهيرة (12 — 4)">ظهيرة (12 — 4)</option>
                  <option value="مسائي (4 — 8)">مسائي (4 — 8)</option>
                  <option value="ليلي (8 — 11)">ليلي (8 — 11)</option>
                </select>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="c-notes">ملاحظات</Label>
              <Textarea
                id="c-notes"
                name="notes"
                rows={3}
                placeholder="اذكر باختصار فكرتك أو مشروعك ومستواك الحالي…"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} size="lg" className="mt-6 h-12 w-full rounded-xl font-bold">
            {loading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : done ? (
              <>
                <CheckCircle2 className="size-5" />
                تم الحجز — أكمل التأكيد عبر واتساب
              </>
            ) : (
              <>
                <MessageCircle className="size-5" />
                احجز الآن — مجاناً
              </>
            )}
          </Button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            الاستشارة مجانية بالكامل ولا تُلزمك بأي طلب لاحق.
          </p>
        </form>
      </div>
    </div>
  );
}
