"use client";

/**
 * درج سلة الطلبات (V10.1 — الدرس 3)
 * --------------------------------
 * تجربة «اختر واضغط» المستفادة من أم رهام: عرض ما في السلة،
 * حقلان خفيفان (الاسم/الجوال) يُحفظان محلياً لطلباتك القادمة،
 * ثم زر واحد: يسجل الطلب في قاعدة البيانات ويفتح واتساب
 * برسالة منسقة مجمّعة — نفس مسار الطلبات الموثوق بلا تغيير خلفي.
 */

import { useEffect, useState } from "react";
import {
  ShoppingBasket,
  Trash2,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCart, buildCartMessage, buildCartDetails } from "@/lib/cart";
import { whatsappLink } from "@/lib/platform-data";

const PROFILE_KEY = "umm-sara-contact-profile-v1";

interface Profile {
  name: string;
  contact: string;
}

function readProfile(): Profile {
  if (typeof window === "undefined") return { name: "", contact: "" };
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return { name: "", contact: "" };
    const p = JSON.parse(raw);
    return {
      name: typeof p.name === "string" ? p.name : "",
      contact: typeof p.contact === "string" ? p.contact : "",
    };
  } catch {
    return { name: "", contact: "" };
  }
}

export function CartDrawer() {
  const { items, open, setOpen, remove, clear } = useCart();
  const [profile, setProfile] = useState<Profile>({ name: "", contact: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setProfile(readProfile());
  }, []);

  useEffect(() => {
    const openCart = () => setOpen(true);
    window.addEventListener("umm-sara:open-cart", openCart);
    return () => window.removeEventListener("umm-sara:open-cart", openCart);
  }, [setOpen]);

  async function submit() {
    const name = profile.name.trim();
    const contact = profile.contact.trim();
    if (name.length < 2) {
      toast.error("اكتب اسمك أولاً لنعرف من نخاطب.");
      return;
    }
    if (contact.length < 5) {
      toast.error("اكتب رقم جوالك أو بريدك لنتمكن من التواصل معك.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          service: `طلب متعدد — ${items.length} خدمات من السلة`,
          details: buildCartDetails(items),
          deadline: "",
          type: "service",
        }),
      });
      if (!res.ok) throw new Error("failed");
      setDone(true);
      try {
        window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      } catch {
        /* حفظ ملف التواصل اختياري — لا يعطل الإرسال */
      }
      toast.success("تم استلام طلبك — نفتح لك واتساب برسالة مجمّعة.");
      window.open(whatsappLink(buildCartMessage(items, name)), "_blank", "noopener");
      clear();
    } catch {
      toast.error("تعذر إرسال الطلب — جرّب مرة أخرى أو راسلنا مباشرة.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => { setOpen(v); if (!v) setDone(false); }}>
      <SheetContent
        side="left"
        className="flex w-[22rem] flex-col gap-0 overflow-y-auto p-0 sm:w-[24rem]"
      >
        <div className="border-b border-border p-5">
          <SheetTitle className="flex items-center gap-2.5 font-display text-lg font-bold">
            <ShoppingBasket className="size-5 text-primary" />
            سلة الطلبات
          </SheetTitle>
          <SheetDescription className="mt-1 text-xs leading-6 text-muted-foreground">
            اخترت {items.length === 0 ? "لا خدمات بعد" : `${items.length} ${items.length === 1 ? "خدمة" : "خدمات"}`} —
            أرسلها طلباً واحداً منظماً على واتساب.
          </SheetDescription>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl border border-dashed border-border text-muted-foreground">
              <ShoppingBasket className="size-6" />
            </span>
            <p className="font-display text-sm font-bold">سلتك فارغة</p>
            <p className="text-xs leading-6 text-muted-foreground">
              تصفح الأقسام واضغط «أضف» على الخدمات التي تريدها — ثم أرسلها كلها بضغطة واحدة.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 rounded-full"
              onClick={() => setOpen(false)}
            >
              تصفح الخدمات
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {items.map((i) => (
                <li key={i.key} className="flex items-start gap-3 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-6">{i.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{i.category}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(i.key)}
                    aria-label={`إزالة ${i.name} من السلة`}
                    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="space-y-3.5 border-t border-border bg-card/50 p-5">
              <div className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="cart-name" className="text-xs">الاسم *</Label>
                  <Input
                    id="cart-name"
                    value={profile.name}
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    placeholder="اسمك الكريم"
                    autoComplete="name"
                    className="h-10"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="cart-contact" className="text-xs">جوال أو بريد *</Label>
                  <Input
                    id="cart-contact"
                    value={profile.contact}
                    onChange={(e) => setProfile((p) => ({ ...p, contact: e.target.value }))}
                    placeholder="05xxxxxxxx"
                    autoComplete="tel"
                    dir="ltr"
                    className="h-10 text-end"
                  />
                </div>
              </div>

              <Button
                type="button"
                onClick={submit}
                disabled={loading}
                className="h-12 w-full rounded-xl font-bold"
                size="lg"
              >
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
                    أرسل طلبي واتساب
                    <span className="ms-1 rounded-full bg-primary-foreground/20 px-2 py-0.5 text-[10px] font-black" dir="ltr">
                      {items.length}
                    </span>
                  </>
                )}
              </Button>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <p>بياناتك محفوظة بسرية ولا تُستخدم إلا لخدمة طلبك.</p>
                <button
                  type="button"
                  onClick={clear}
                  className="shrink-0 transition-colors hover:text-destructive"
                >
                  تفريغ السلة
                </button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
