"use client";

import { useEffect, useRef } from "react";

/**
 * حقل جزيئات تفاعلي — الاستلهمام الجوهري من activetheory.net
 * زمردي + ذهبي على خلفية داكنة، خطوط ربط، وتفاعل مع المؤشر.
 * خفيف الأداء: rAF واحد، DPR-aware، يحترم prefers-reduced-motion.
 */
export function ParticleField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };

    interface P {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      gold: boolean;
      tw: number;
    }
    let particles: P[] = [];

    const EMERALD = { r: 52, g: 211, b: 153 };
    const GOLD = { r: 214, g: 178, b: 94 };

    function isDark() {
      return !document.documentElement.classList.contains("light");
    }

    function spawn() {
      const count = Math.min(
        Math.floor((w * h) / 22000) + 26,
        w < 768 ? 42 : 96
      );
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.6 + 0.5,
        gold: Math.random() < 0.22,
        tw: Math.random() * Math.PI * 2,
      }));
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawn();
    }

    function tick() {
      ctx!.clearRect(0, 0, w, h);
      const dark = isDark();
      const baseAlpha = dark ? 1 : 0.55;
      const linkDist = w < 768 ? 90 : 130;

      for (const p of particles) {
        if (!reducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.tw += 0.02;
        }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // انحراف لطيف حول المؤشر
        const dxm = p.x - mouse.x;
        const dym = p.y - mouse.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 140 && dm > 0.01) {
          const f = ((140 - dm) / 140) * 0.012;
          p.vx += (dxm / dm) * f;
          p.vy += (dym / dm) * f;
        }
        p.vx = Math.max(-0.35, Math.min(0.35, p.vx));
        p.vy = Math.max(-0.35, Math.min(0.35, p.vy));

        const c = p.gold ? GOLD : EMERALD;
        const twinkle = 0.55 + Math.sin(p.tw) * 0.45;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${c.r},${c.g},${c.b},${(p.gold ? 0.75 : 0.5) * twinkle * baseAlpha})`;
        ctx!.fill();
      }

      // خطوط الربط
      ctx!.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            const o = (1 - d / linkDist) * 0.16 * baseAlpha;
            ctx!.strokeStyle = `rgba(${EMERALD.r},${EMERALD.g},${EMERALD.b},${o})`;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    tick();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`hero-canvas ${className}`}
    />
  );
}
