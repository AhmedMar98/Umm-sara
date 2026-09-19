"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * خط تقدم القراءة — شعرة ذهبية أسفل الشريط العلوي.
 * RTL: الأصل من اليمين (origin-right) ليبدأ التقدم مع اتجاه القراءة.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-right bg-gradient-to-l from-transparent via-gold to-transparent"
      style={{ scaleX }}
    />
  );
}
