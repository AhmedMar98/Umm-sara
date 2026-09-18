"use client";

import { useEffect, useRef } from "react";

/**
 * حقل جزيئات ثلاثي العمق — الترقية الجوهرية من الدرس البصري لـ activetheory:
 *   1) غبار خلفي دقيق خافت (طرفه بعيد)
 *   2) جسيمات متوسطة زمردي/ذهبية متلألئة
 *   3) بوكيه أمامي كبير شفاف يسبح ببطء (أقرب للمشاهد)
 * + تعويض منظر (parallax) خفيف مع المؤشر لخلق عمق كاميرا حقيقي.
 * rAF واحد، DPR-aware، يحترم prefers-reduced-motion.
 */
type Layer = 0 | 1 | 2;

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  gold: boolean;
  tw: number;
  layer: Layer;
  phase: number;
}

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
    let t = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let particles: P[] = [];

    const EMERALD = { r: 74, g: 226, b: 165 };
    const GOLD = { r: 226, g: 200, b: 133 };

    function isDark() {
      return !document.documentElement.classList.contains("light");
    }

    function spawn() {
      const area = w * h;
      // طبقة 0: غبار كثيف صغير · طبقة 1: متوسطة · طبقة 2: بوكيه قليل كبير
      const nDust = Math.min(Math.floor(area / 16000), w < 768 ? 40 : 90);
      const nMid = Math.min(Math.floor(area / 30000), w < 768 ? 22 : 48);
      const nBokeh = w < 768 ? 4 : 9;

      particles = [];
      const push = (layer: Layer, n: number, rMin: number, rMax: number) => {
        for (let i = 0; i < n; i++) {
          particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * (layer === 2 ? 0.1 : 0.22),
            vy: (Math.random() - 0.5) * (layer === 2 ? 0.08 : 0.2),
            r: rMin + Math.random() * (rMax - rMin),
            gold: Math.random() < (layer === 2 ? 0.45 : 0.2),
            tw: Math.random() * Math.PI * 2,
            layer,
            phase: Math.random() * Math.PI * 2,
          });
        }
      };
      push(0, nDust, 0.4, 1.1); // غبار بعيد
      push(1, nMid, 1.1, 2.1); // متوسط
      push(2, nBokeh, 7, 15); // بوكيه أمامي
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

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      const dark = isDark();
      const baseAlpha = dark ? 1 : 0.5;
      // عمق الكاميرا: إزاحة عكسية بالطبقة
      const par = [
        -mouse.x * 0.006,
        -mouse.x * 0.016,
        -mouse.x * 0.045,
      ];
      const parY = [
        -mouse.y * 0.004,
        -mouse.y * 0.01,
        -mouse.y * 0.028,
      ];

      for (const p of particles) {
        if (!reducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.tw += p.layer === 2 ? 0.008 : 0.02;
          // انجراف جيبي للبوكيه (سباحة بطيئة)
          if (p.layer === 2) {
            p.x += Math.sin(t * 0.004 + p.phase) * 0.12;
            p.y += Math.cos(t * 0.003 + p.phase) * 0.09;
          }
        }
        if (p.x < -30) p.x = w + 30;
        if (p.x > w + 30) p.x = -30;
        if (p.y < -30) p.y = h + 30;
        if (p.y > h + 30) p.y = -30;

        const c = p.gold ? GOLD : EMERALD;
        const twinkle = 0.55 + Math.sin(p.tw) * 0.45;
        const px = p.x + par[p.layer];
        const py = p.y + parY[p.layer];

        if (p.layer === 2) {
          // بوكيه أمامي: قرص ضوئي ناعم جداً
          const grad = ctx!.createRadialGradient(px, py, 0, px, py, p.r);
          const a = (p.gold ? 0.1 : 0.07) * twinkle * baseAlpha;
          grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${a})`);
          grad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
          ctx!.beginPath();
          ctx!.arc(px, py, p.r, 0, Math.PI * 2);
          ctx!.fillStyle = grad;
          ctx!.fill();
        } else {
          const alpha =
            (p.layer === 0 ? 0.35 : p.gold ? 0.8 : 0.55) *
            twinkle *
            baseAlpha;
          ctx!.beginPath();
          ctx!.arc(px, py, p.r, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
          ctx!.fill();
          if (p.layer === 1 && p.gold) {
            // توهج صغير للذهبي المتوسط
            ctx!.beginPath();
            ctx!.arc(px, py, p.r * 2.6, 0, Math.PI * 2);
            ctx!.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha * 0.16})`;
            ctx!.fill();
          }
        }
      }

      // خطوط ربط بين جسيمات الطبقة المتوسطة فقط (أداء + وضوح)
      const mid = particles.filter((p) => p.layer === 1);
      const linkDist = w < 768 ? 90 : 130;
      ctx!.lineWidth = 0.55;
      for (let i = 0; i < mid.length; i++) {
        for (let j = i + 1; j < mid.length; j++) {
          const a = mid[i];
          const b = mid[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            const o = (1 - d / linkDist) * 0.13 * baseAlpha;
            ctx!.strokeStyle = `rgba(${EMERALD.r},${EMERALD.g},${EMERALD.b},${o})`;
            ctx!.beginPath();
            ctx!.moveTo(a.x + par[1], a.y + parY[1]);
            ctx!.lineTo(b.x + par[1], b.y + parY[1]);
            ctx!.stroke();
          }
        }
      }
    }

    function tick() {
      // تتبع ناعم للمؤشر (lag)
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      t += 1;
      draw();
      raf = requestAnimationFrame(tick);
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouse.tx = (e.clientX - rect.left - w / 2) || 0;
      mouse.ty = (e.clientY - rect.top - h / 2) || 0;
    };

    resize();
    tick();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });

    // مراقبة تبديل السمة (الرسم يقرأ isDark كل إطار — لا حاجة لمعالجة)
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
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
