"use client";

import { useEffect, useRef } from "react";

/**
 * حبيبات فيلم فوق كامل الصفحة — النمط المستخلص من warmnfuzzy.tv (awwwards):
 * SVG feTurbulence + تحريك steps(2,end) لإحساس حبيبي سينمائي.
 * النمط يُطبَّق عبر .film-grain في globals.css — هذا مجرد حامل ذكي
 * يوقف الحركة عند تفضيل تقليلها.
 */
export function FilmGrain() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      el.style.animationPlayState = mq.matches ? "paused" : "running";
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return <div ref={ref} className="film-grain" aria-hidden="true" />;
}
