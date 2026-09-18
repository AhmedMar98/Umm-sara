"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** كشف التمرير — ظهور ناعم بتدرّج (بديل خفيف لـ framer-motion في الحركات البنيوية) */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
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

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className
      )}
    >
      {children}
    </div>
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
    <div ref={ref} className={cn("flex flex-col items-center gap-1.5 text-center", className)}>
      <span className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl" dir="ltr">
        <span className="gold-gradient-text">{display.toLocaleString("en-US")}</span>
        <span className="text-gold-bright">{suffix}</span>
      </span>
      <span className="text-xs text-muted-foreground sm:text-sm">{label}</span>
    </div>
  );
}
