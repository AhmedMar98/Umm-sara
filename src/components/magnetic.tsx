"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * مغناطيسية نابضة للأزرار الرئيسية — نمط motion-primitives/magnetic
 * (مبسّطة: منطقة self فقط، مؤشر دقيق فقط، تحترم reduced-motion).
 */
export function Magnetic({
  children,
  intensity = 0.35,
  range = 90,
  className,
}: {
  children: React.ReactNode;
  intensity?: number;
  range?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 26.7, damping: 4.1, mass: 0.2 });
  const springY = useSpring(y, { stiffness: 26.7, damping: 4.1, mass: 0.2 });

  useEffect(() => {
    // مؤشرات اللمس لا تناسب المغناطيسية + احترام تقليل الحركة
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    // عبر rAF بدل الاستدعاء المتزامن داخل الـ effect
    const raf = requestAnimationFrame(() => setEnabled(true));

    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist <= range) {
        const scale = 1 - dist / range;
        x.set(dx * intensity * scale);
        y.set(dy * intensity * scale);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [intensity, range, x, y]);

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    <motion.div ref={ref} className={className} style={{ x: springX, y: springY }}>
      {children}
    </motion.div>
  );
}
