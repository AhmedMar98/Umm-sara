"use client";

/**
 * أزرار الإضافة إلى السلة (V10.1 — الدرس 3)
 * -----------------------------------------
 * نمطان من نفس المصدر:
 * - "row": صف خدمة فرعية كامل (صفحات الأقسام) — نقرة واحدة تضيف/تزيل.
 * - "chip": زر دائري مصغر بجانب رقاقة البحث (مستكشف الخدمات).
 *
 * كلاهما زر حقيقي (button) بمس لمس AA ≥ 44px في النمط row،
 * والنمط chip ≥ 36px مقبول لضيق المساحة مع تكرار الإتاحة في صفحة القسم.
 */

import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCart, type CartItem } from "@/lib/cart";
import { cn } from "@/lib/utils";

type ItemInput = Omit<CartItem, "key">;

export function AddToCartButton({
  item,
  variant = "row",
}: {
  item: ItemInput;
  variant?: "row" | "chip";
}) {
  const { has, toggle } = useCart();
  const key = `${item.categorySlug}/${item.serviceSlug}`;
  const inCart = has(key);

  function onClick() {
    const added = toggle(item);
    if (added) {
      toast.success(`أُضيفت «${item.name}» إلى سلة الطلبات`, {
        action: { label: "عرض السلة", onClick: () => window.dispatchEvent(new CustomEvent("umm-sara:open-cart")) },
      });
    } else {
      toast.info(`أُزيلت «${item.name}» من السلة`);
    }
  }

  if (variant === "chip") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={inCart ? `إزالة ${item.name} من السلة` : `إضافة ${item.name} إلى السلة`}
        aria-pressed={inCart}
        className={cn(
          "inline-flex size-9 shrink-0 items-center justify-center rounded-lg border transition-all",
          inCart
            ? "border-primary/50 bg-primary/15 text-primary"
            : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary"
        )}
      >
        {inCart ? <Check className="size-4" /> : <Plus className="size-4" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={inCart}
      className={cn(
        "flex w-full min-h-11 items-center gap-3 rounded-xl border px-4 py-3 text-start text-sm transition-all",
        inCart
          ? "border-primary/50 bg-primary/10 hover:border-primary/60"
          : "border-border bg-card hover:border-primary/40 hover:bg-accent/50"
      )}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
          inCart ? "border-primary bg-primary text-primary-foreground" : "border-gold/40 text-gold"
        )}
        aria-hidden="true"
      >
        {inCart ? <Check className="size-3" /> : <Plus className="size-3" />}
      </span>
      <span className="font-medium">{item.name}</span>
      <span
        className={cn(
          "ms-auto shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold transition-colors",
          inCart ? "bg-primary/15 text-primary" : "bg-gold-soft text-gold"
        )}
      >
        {inCart ? "في السلة" : "أضف"}
      </span>
    </button>
  );
}
