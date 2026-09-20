"use client";

/**
 * سلة الخدمات (V10.1 — الدرس 3 من مقارنة أم رهام)
 * ------------------------------------------------
 * سلة محلية خالصة (localStorage) — لا تغيير في أي بنية خلفية:
 * تعبئة الاختيار من صفحات الأقسام والبحث، ثم «أرسل طلبي واتساب»
 * يبني رسالة منسقة + يسجل الطلب في /api/orders كأي نموذج آخر.
 *
 * نقاط التصميم:
 * - إضافة/إزالة بلمسة واحدة (toggle) مع حد أعلى حكيم (20 خدمة).
 * - مزامنة بين التبويبات عبر حدث storage.
 * - لا حالة تُحفظ إلا الضرورية: القائمة فقط (الاسم/القسم/المعرّفات).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

export interface CartItem {
  /** مفتاح فريد: `${categorySlug}/${serviceSlug}` */
  key: string;
  /** اسم الخدمة الفرعية المعروض */
  name: string;
  /** اسم القسم الأم */
  category: string;
  categorySlug: string;
  serviceSlug: string;
}

const STORAGE_KEY = "umm-sara-cart-v1";
const MAX_ITEMS = 20;

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is CartItem =>
        i && typeof i.key === "string" && typeof i.name === "string"
    );
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* التخزين ممتلئ أو محجوب — السلة تعمل في الذاكرة لهذه الجلسة */
  }
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  has: (key: string) => boolean;
  toggle: (item: Omit<CartItem, "key">) => boolean;
  remove: (key: string) => void;
  clear: () => void;
  /** فتح/إغلاق الدرج — يُديره CartDrawer عبر السياق نفسه */
  open: boolean;
  setOpen: (v: boolean) => void;
  /** جاهزية العرض بعد أول قراءة من القرص (منع وميض Hydration) */
  ready: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    /* نمط rAF المؤجل (المعتمد في المشروع — hero-visual): قراءة القرص
       بعد أول إطار بدل setState المتزامن داخل الـ effect */
    const raf = requestAnimationFrame(() => {
      setItems(readCart());
      setReady(true);
    });
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(readCart());
    };
    window.addEventListener("storage", onStorage);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    writeCart(next);
  }, []);

  const toggle = useCallback(
    (item: Omit<CartItem, "key">) => {
      const key = `${item.categorySlug}/${item.serviceSlug}`;
      let added = false;
      setItems((prev) => {
        const exists = prev.some((i) => i.key === key);
        if (exists) {
          writeCart(prev.filter((i) => i.key !== key));
          return prev.filter((i) => i.key !== key);
        }
        if (prev.length >= MAX_ITEMS) {
          toast.info(`السلة تتسع لـ ${MAX_ITEMS} خدمة كحد أقصى — أرسل طلبك الحالي أولاً.`);
          return prev;
        }
        added = true;
        const next = [...prev, { ...item, key }];
        writeCart(next);
        return next;
      });
      return added;
    },
    []
  );

  const remove = useCallback((key: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.key !== key);
      writeCart(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => persist([]), [persist]);

  const has = useCallback(
    (key: string) => items.some((i) => i.key === key),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.length,
      has,
      toggle,
      remove,
      clear,
      open,
      setOpen,
      ready,
    }),
    [items, has, toggle, remove, clear, open, ready]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart يجب أن يُستخدم داخل CartProvider");
  return ctx;
}

/** يبني رسالة واتساب منسقة من عناصر السلة (بنية أم رهام بأصوات أم سارة) */
export function buildCartMessage(items: CartItem[], name: string): string {
  const lines = items.map(
    (i, idx) => `${idx + 1}. ${i.name} — (${i.category})`
  );
  return (
    `السلام عليكم، أنا ${name}.\n` +
    `أرغب بطلب الخدمات التالية من منصة أم سارة:\n` +
    `${lines.join("\n")}\n` +
    `(عدد الخدمات: ${items.length})\n` +
    `وشكراً جزيلاً.`
  );
}

/** يبني نص التفاصيل لسجل الطلب في قاعدة البيانات */
export function buildCartDetails(items: CartItem[]): string {
  return (
    `طلب متعدد من سلة الخدمات:\n` +
    items.map((i, idx) => `${idx + 1}. ${i.name} (${i.category})`).join("\n")
  );
}
