"use client";

/**
 * HeroVisual — بوابة المرساة البصرية للهيرو (v5).
 *
 * الاستراتيجية: تحسين تدريجي مضمون — مدار المعرفة SVG (خفيف، فوري،
 * يحمل بناء الشعار الحي) يُعرض أولاً دائماً، ثم عند توفر WebGL فعلي
 * (بلا مسعّر برمجي) وبعد اكتمال بناء الشعار يُحمل مشهد اللؤلؤة ثلاثي
 * الأبعاد في chunk منفصل ويتقاطع معه بلطف.
 *
 * fallback الكامل: prefers-reduced-motion أو WebGL غائب/برمجي أو فشل
 * التحميل → يبقى مدار المعرفة SVG نهائياً. لا يوجد مسار بلا مخرج.
 *
 * V10 — مرونة مستوى الإنتاج: SceneBoundary يلتقط أي فشل في تحميل/تشغيل
 * المشهد (ChunkLoadError، فشل WebGL context، خطأ شيدر) ويرجع بهدوء إلى
 * المدار SVG — الفشل لا يُسقط الصفحة أبداً (Failure → Controlled Fallback).
 */

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useTheme } from "next-themes";
import { KnowledgeOrbit } from "@/components/knowledge-orbit";

const PearlScene = dynamic(() => import("@/components/brand/pearl-scene"), {
  ssr: false,
});

/** حاجز أخطاء مصغّر للمشهد: يلتقط ويعزل الفشل ويُبقي التطبيق صالحاً */
class SceneBoundary extends Component<
  { onCatch: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onCatch();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** كشف WebGL مع رفض المسعّرات البرمجية (نمط awwwards-3d) */
function detectRealWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
    return !/SwiftShader|Software|llvmpipe|Basic Render/i.test(renderer);
  } catch {
    return false;
  }
}

export function HeroVisual({
  className = "",
  faint = false,
}: {
  className?: string;
  /** faint = الطبقة الخلفية الخافتة على الجوال (كانت opacity-20 للمدار) */
  faint?: boolean;
}) {
  const [mode, setMode] = useState<"pending" | "scene3d" | "fallback">("pending");
  const [sceneError, setSceneError] = useState(false);
  const [paused, setPaused] = useState(false);
  const [mobile, setMobile] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let raf = 0;
    let timer = 0;
    /* نمط rAF المؤجل (المعتمد في المشروع) — الكشف بعد أول إطار */
    raf = requestAnimationFrame(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        setMode("fallback");
        return;
      }
      /* ?force3d=1 — مفتاح فحص/تشخيص: يتجاوز رفض المسعّرات البرمجية فقط
         (بيئات CI/headless) ولا يمس بوابة reduced-motion إطلاقاً */
      const force3d = new URLSearchParams(window.location.search).has("force3d");
      if (!force3d && !detectRealWebGL()) {
        setMode("fallback");
        return;
      }
      setMobile(window.matchMedia("(max-width: 1024px)").matches);
      /* بعد اكتمال بناء الشعار SVG (~2.2s) — لحظة "استيقاظ" المشهد */
      timer = window.setTimeout(() => setMode("scene3d"), 2200);
    });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setPaused(!entry.isIntersecting), {
      threshold: 0.04,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [mode]);

  const showScene = mode === "scene3d" && !sceneError;
  /* v5.1: على الجوال تبقى طبقة SVG عند 20% (كما v4) بينما طبقة 3D أوضح (40%) */
  const svgOpacity = showScene ? "opacity-0" : faint ? "opacity-20" : "opacity-100";

  return (
    <div
      ref={wrapRef}
      className={`relative ${className}`}
      aria-hidden="true"
    >
      {/* المدار SVG — الأساس الدائم والـ fallback */}
      <div
        className={`h-full w-full transition-opacity duration-[1400ms] ease-out ${svgOpacity}`}
      >
        <KnowledgeOrbit className="h-full w-full" />
      </div>

      {/* مشهد اللؤلؤة — طبقة ثلاثية الأبعاد فوق المدار
          (V10: داخل SceneBoundary — أي فشل يعيد المدار SVG بلا سقوط صفحة) */}
      {showScene && (
        <SceneBoundary onCatch={() => setSceneError(true)}>
          <div
            className={`animate-scene-in absolute inset-0 ${
              faint ? "opacity-35" : "opacity-100"
            }`}
          >
            <PearlScene
              theme={resolvedTheme === "light" ? "light" : "dark"}
              mobile={mobile}
              paused={paused}
            />
          </div>
        </SceneBoundary>
      )}
    </div>
  );
}
