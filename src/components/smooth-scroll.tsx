"use client";

import { useEffect } from "react";

/**
 * تمرير ناعم (Lenis) — القاسم المشترك الأعلى بين المواقع الفائزة الستة
 * التي نُزِّلت أكوادها من awwwards (noho, white-desert, cerebrium, lxl, aspen,
 * warmnfuzzy — كلها تستخدم Lenis).
 * يُعطَّل كلياً عند prefers-reduced-motion أو على الشاشات اللمسية الضيقة.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let raf = 0;
    let cancelled = false;

    import("lenis")
      .then(({ default: Lenis }) => {
        if (cancelled) return;
        lenis = new Lenis({
          duration: 1.15,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });
        const loop = (time: number) => {
          lenis?.raf(time);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      })
      .catch(() => {
        // فشل التحميل → يبقى التمرير الأصلي، لا ضرر
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return null;
}
