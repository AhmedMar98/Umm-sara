"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "up" | "blur" | "scale";

const VARIANT_CLASS: Record<Variant, { hidden: string; shown: string }> = {
  up: {
    hidden: "translate-y-7 opacity-0",
    shown: "translate-y-0 opacity-100",
  },
  blur: {
    hidden: "translate-y-5 opacity-0 [filter:blur(8px)]",
    shown: "translate-y-0 opacity-100 [filter:blur(0px)]",
  },
  scale: {
    hidden: "scale-[0.96] opacity-0",
    shown: "scale-100 opacity-100",
  },
};

/**
 * كشف التمرير — v3: يعتمد منحنى النظام --ease-expo (0.16,1,0.3,1)
 * مع ثلاثة تنويعات (انزلاق / ضباب / تكبير) لتناسب طبيعة المحتوى.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  variant = "up",
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: Variant;
  as?: "div" | "section" | "li" | "span";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // reduced-motion: اعرض الحالة النهائية فوراً (عبر مؤقّت صفر — بلا setState متزامن)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(t);
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as "div";
  const v = VARIANT_CLASS[variant];

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-[transform,opacity,filter] duration-[850ms] [transition-timing-function:var(--ease-expo)] will-change-transform",
        visible ? v.shown : v.hidden,
        className
      )}
    >
      {children}
    </Tag>
  );
}

/** عدّاد رقمي متحرك يعمل عند الظهور — أرقام عملاقة بخط display (درس aspen) */
export function StatCounter({
  value,
  suffix = "",
  label,
  className,
}: {
  value: number;
  suffix?: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          if (reduced) {
            setDisplay(value);
            io.disconnect();
            return;
          }
          const dur = 1600;
          const t0 = performance.now();
          const step = (t: number) => {
            const p = Math.min((t - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(value * eased));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div ref={ref} className={cn("flex flex-col items-center gap-2 text-center", className)}>
      <span className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl" dir="ltr">
        <span className="gold-gradient-text">{display.toLocaleString("en-US")}</span>
        <span className="text-gold-bright">{suffix}</span>
      </span>
      <span className="mono-chip text-[9px] text-muted-foreground sm:text-[10px]">{label}</span>
    </div>
  );
}
