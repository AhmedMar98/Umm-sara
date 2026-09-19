"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * كشف كلمة-بكلمة للعناوين — قناع overflow-hidden + انزلاق رأسي بتدرّج.
 * نمط TextEffect/split-text من المراجع، بخط عربي آمن (التقسيم على المسافات فقط).
 * قارئات الشاشة: aria-label كامل على الحاوية، والكلمات المتحركة aria-hidden.
 */
export function WordReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 70,
  as: Tag = "span",
  style,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  as?: "span" | "h1" | "h2" | "p" | "div";
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // تشغيل عبر مؤقّت دائماً (تجنّب setState المتزامن داخل الـ effect) —
    // reduced-motion: الحالة النهائية فوراً (صفر تأخير)
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setReady(true), reduced ? 0 : delay);
    return () => window.clearTimeout(t);
  }, [delay]);

  const words = text.split(" ");

  return (
    <Tag
      ref={ref as never}
      aria-label={text}
      className={cn("inline-block", className)}
      style={style}
    >
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          aria-hidden="true"
          /* حشو رأسي معاكس يوسّع صندوق القصّ لحماية التشكيل العربي (فوق/تحت) */
          className="inline-block overflow-hidden px-[0.02em] py-[0.18em] -my-[0.18em] align-bottom"
        >
          <span
            className={cn(
              "inline-block will-change-transform transition-[transform,opacity,filter] duration-[900ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
              wordClassName
            )}
            style={{
              transitionDelay: `${i * stagger}ms`,
              transform: ready ? "translateY(0)" : "translateY(115%)",
              opacity: ready ? 1 : 0,
              filter: ready ? "blur(0px)" : "blur(6px)",
            }}
          >
            {w}
          </span>
          {i < words.length - 1 && <span aria-hidden="true">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
