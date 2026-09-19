"use client";

/**
 * مشهد اللؤلؤة — القلب السينمائي للهيرو (v5)
 * قوس المعرفة (torus إجرائي يُرسم تدريجياً بتقنية drawRange — يحاكي
 * بناء الشعار ثنائي الأبعاد) + اللؤلؤة (شيدر iridescent: fresnel ذهبي↔زمردي)
 * + مدارا عقد معرفية متوهجة (نقاط بشيدر twinkle) + غبار ذهبي/زمردي
 * + كاشدة أفقية صدى للشعار.
 *
 * الأنماط مستخلصة من المراجع الموثقة في research/DESIGN_v5.md:
 * - awwards-3d: damp-state المستقل عن الإطارات + إضاءة ثلاثية key/fill/rim
 *   + كاميرا doll-in افتتاحية + كشف WebGL برفض المسعّرات البرمجية (في الغلاف).
 * - Awwwards-Portfolio: تكوين R3F داخل React بمدخل كاميرا ناعم.
 * - العقيدة الإجرائية: لا GLB ولا ملفات خارجية — كل شيء كود خالص.
 *
 * البنية تصريحية بالكامل (متوافقة مع مترجم React): المواد تُبنى عبر args
 * من كائنات useMemo ثابتة، والتحديثات تمر حصراً عبر مراجع الميش داخل useFrame.
 *
 * الحراسة: frameloop "never" خارج الشاشة · DPR مقيّد · جوال مخفف · سمتان
 * (تبديل السمة يعيد بناء المشهد عبر key — رخيص لمشهد بهذا الحجم).
 */

import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";

type ThemeName = "dark" | "light";

interface Palette {
  pearlBase: string;
  pearlGold: string;
  pearlEmerald: string;
  arcColor: string;
  arcEmissive: string;
  nodeGold: string;
  nodeEmerald: string;
  glowColor: string;
  glowOpacity: number;
  keyLight: string;
  fillLight: string;
  rimLight: string;
  ambient: number;
  keyIntensity: number;
  additive: boolean;
}

const PALETTES: Record<ThemeName, Palette> = {
  dark: {
    pearlBase: "#141b17",
    pearlGold: "#e8d48b",
    pearlEmerald: "#2ed39a",
    arcColor: "#c5a059",
    arcEmissive: "#2f2410",
    nodeGold: "#e8d48b",
    nodeEmerald: "#2ed39a",
    glowColor: "#c5a059",
    glowOpacity: 0.5,
    keyLight: "#ffeedd",
    fillLight: "#2ed39a",
    rimLight: "#ffffff",
    ambient: 0.32,
    keyIntensity: 1.35,
    additive: true,
  },
  light: {
    pearlBase: "#ece2c8",
    pearlGold: "#9a7b3f",
    pearlEmerald: "#0c7a57",
    arcColor: "#8a6a2c",
    arcEmissive: "#241a08",
    nodeGold: "#9a7b3f",
    nodeEmerald: "#0c7a57",
    glowColor: "#9a7b3f",
    glowOpacity: 0.16,
    keyLight: "#fff6e6",
    fillLight: "#0c7a57",
    rimLight: "#ffffff",
    ambient: 0.55,
    keyIntensity: 1.2,
    additive: false,
  },
};

/* ---------- عشوائية حتمية (mulberry32) — نفس البذرة نفس التوزيع ---------- */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- شيدر اللؤلؤة ---------- */
const PEARL_VERT = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const PEARL_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec3 uBase;
  uniform vec3 uGold;
  uniform vec3 uEmerald;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vView);
    float ndv = clamp(dot(N, V), 0.0, 1.0);
    float fres = pow(1.0 - ndv, 2.3);
    /* تحلل قزحي رقيق: نطاقات زاوية النظر تتنفس ببطء (v5.1: مزيج أوسع قليلاً) */
    float band = 0.5 + 0.5 * sin(acos(ndv) * 5.2 - uTime * 0.32);
    vec3 sheen = mix(uGold, uEmerald, band * 0.48);
    vec3 col = mix(uBase, sheen, clamp(fres * 0.9 + 0.07, 0.0, 1.0));
    /* specular مفتاحي ناعم */
    vec3 L = normalize(vec3(0.55, 0.85, 0.5));
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 42.0);
    col += spec * uGold * 1.15;
    /* تنفس ضوئي خفيف */
    col *= 0.97 + 0.03 * sin(uTime * 0.9);
    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ---------- شيدر العقد المتوهجة (twinkle) ---------- */
const NODES_VERT = /* glsl */ `
  attribute float aScale;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPR;
  varying vec3 vColor;
  varying float vTw;
  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float tw = 0.55 + 0.45 * sin(uTime * 1.35 + aPhase);
    vTw = tw;
    gl_PointSize = aScale * uPR * (34.0 / max(0.1, -mv.z)) * (0.7 + 0.5 * tw);
    gl_Position = projectionMatrix * mv;
  }
`;

const NODES_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vTw;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float a = smoothstep(0.5, 0.06, d) * vTw;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

/* ---------- شيدر الهالة (بديل bloom خفيف بلا مكتبة post) ---------- */
const GLOW_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const GLOW_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - vec2(0.5)) * 2.0;
    float a = pow(smoothstep(1.0, 0.0, d), 1.6);
    float breathe = 0.85 + 0.15 * sin(uTime * 0.8);
    gl_FragColor = vec4(uColor, a * uOpacity * breathe);
  }
`;

/* ---------- منحنيات ---------- */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number) => {
  const c1 = 1.70158 * 0.55; /* تجاوز لطيف ~1.04x — شخصية --ease-pearl */
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/* ---------- غيوم النقاط حتمية (بيانات خام للـ bufferAttribute) ---------- */
interface Cloud {
  positions: Float32Array;
  scales: Float32Array;
  phases: Float32Array;
  colors: Float32Array;
}

function buildRingNodes(radius: number, count: number, p: Palette, seed: number): Cloud {
  const rnd = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const phases = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const gold = new THREE.Color(p.nodeGold);
  const emerald = new THREE.Color(p.nodeEmerald);
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + rnd() * 0.22;
    const r = radius * (0.97 + rnd() * 0.06);
    positions[i * 3] = Math.cos(a) * r;
    positions[i * 3 + 1] = (rnd() - 0.5) * 0.05;
    positions[i * 3 + 2] = Math.sin(a) * r;
    scales[i] = 0.5 + rnd() * 0.9;
    phases[i] = rnd() * Math.PI * 2;
    const c = rnd() > 0.42 ? gold : emerald;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  return { positions, scales, phases, colors };
}

function buildDust(count: number, p: Palette, seed: number): Cloud {
  const rnd = mulberry32(seed);
  const positions = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const phases = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const gold = new THREE.Color(p.nodeGold);
  const emerald = new THREE.Color(p.nodeEmerald);
  for (let i = 0; i < count; i++) {
    const r = 2.15 + rnd() * 1.75;
    const th = Math.acos(2 * rnd() - 1);
    const ph = rnd() * Math.PI * 2;
    positions[i * 3] = Math.sin(th) * Math.cos(ph) * r;
    positions[i * 3 + 1] = Math.cos(th) * r * 0.58;
    positions[i * 3 + 2] = Math.sin(th) * Math.sin(ph) * r;
    scales[i] = 0.28 + rnd() * 0.55;
    phases[i] = rnd() * Math.PI * 2;
    const c = rnd() > 0.5 ? gold : emerald;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  return { positions, scales, phases, colors };
}

/* ---------- باني وسائط مواد العقد (نطاق وحدة — نقية) ---------- */
function makeNodesArgs(p: Palette, opacity: number) {
  return {
    uniforms: {
      uTime: { value: 0 },
      uPR: {
        value: Math.min(
          typeof window !== "undefined" ? window.devicePixelRatio : 1,
          2
        ),
      },
    },
    vertexShader: NODES_VERT,
    fragmentShader: NODES_FRAG,
    transparent: true,
    depthWrite: false,
    opacity,
    blending: p.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  };
}

/* ==================================================================== */
/*                            محتويات المشهد                             */
/* ==================================================================== */

function SceneContents({ palette, mobile }: { palette: Palette; mobile: boolean }) {
  /* ---------- بيانات ثابتة (useMemo — تُقرأ فقط ولا تُحور أبداً) ---------- */
  const pearlArgs = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uBase: { value: new THREE.Color(palette.pearlBase) },
        uGold: { value: new THREE.Color(palette.pearlGold) },
        uEmerald: { value: new THREE.Color(palette.pearlEmerald) },
      },
      vertexShader: PEARL_VERT,
      fragmentShader: PEARL_FRAG,
    }),
    [palette]
  );

  const ring1Args = useMemo(() => makeNodesArgs(palette, 1), [palette]);
  const ring2Args = useMemo(() => makeNodesArgs(palette, 0.85), [palette]);
  const dustArgs = useMemo(() => makeNodesArgs(palette, 0.7), [palette]);

  const glowArgs = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(palette.glowColor) },
        uOpacity: { value: palette.glowOpacity },
      },
      vertexShader: GLOW_VERT,
      fragmentShader: GLOW_FRAG,
      transparent: true,
      depthWrite: false,
      blending: palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    }),
    [palette]
  );

  const ring1Cloud = useMemo(
    () => buildRingNodes(1.98, mobile ? 20 : 28, palette, 11),
    [palette, mobile]
  );
  const ring2Cloud = useMemo(
    () => buildRingNodes(2.42, mobile ? 24 : 34, palette, 77),
    [palette, mobile]
  );
  const dustCloud = useMemo(
    () => buildDust(mobile ? 130 : 300, palette, 42),
    [palette, mobile]
  );

  /* ---------- المراجع (التحوير عبرها فقط داخل useFrame) ---------- */
  const root = useRef<THREE.Group>(null);
  const pearl = useRef<THREE.Mesh>(null);
  const arc = useRef<THREE.Mesh>(null);
  const arcInner = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Points>(null);
  const ring2 = useRef<THREE.Points>(null);
  const dust = useRef<THREE.Points>(null);
  const glow = useRef<THREE.Mesh>(null);
  const kashida = useRef<THREE.Mesh>(null);

  /* ---------- حالة damp (نمط awwards-3d: مستقلة عن معدل الإطارات) ---------- */
  const st = useRef({
    px: 0,
    py: 0,
    tpx: 0,
    tpy: 0,
    scroll: 0,
    tscroll: 0,
    intro: 0,
  });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      st.current.tpx = (e.clientX / window.innerWidth) * 2 - 1;
      st.current.tpy = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onScroll = () => {
      st.current.tscroll = Math.min(
        1.35,
        window.scrollY / Math.max(1, window.innerHeight)
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useFrame((state, dt) => {
    const d = st.current;
    const clampedDt = Math.min(dt, 0.05);
    /* معامل تخميد مستقل عن الإطارات (نمط awwards-3d) */
    const dampF = (ease: number) => 1 - Math.pow(1 - ease, clampedDt * 60);
    d.px += (d.tpx - d.px) * dampF(0.1);
    d.py += (d.tpy - d.py) * dampF(0.1);
    d.scroll += (d.tscroll - d.scroll) * dampF(0.08);
    d.intro = Math.min(1, d.intro + clampedDt / 2.6);

    const t = state.clock.elapsedTime;
    const e = easeOutCubic(d.intro);
    const arcP = easeOutCubic(Math.min(1, d.intro * 1.45)); /* القوس يكتمل أولاً */
    const pearlP = easeOutBack(Math.max(0, Math.min(1, (d.intro - 0.18) / 0.82)));

    /* الكاميرا: دخول doll-in + parallax + انجراف تمريري خفيف
       (v5.1: خُفّض عامل الانجراف — كان يقصّ قمة القوس عند التمرير) */
    const cam = state.camera;
    cam.position.x = d.px * 0.5 * e;
    cam.position.y = 0.34 + d.py * 0.32 - d.scroll * 0.08;
    cam.position.z = THREE.MathUtils.lerp(8.8, 6.15, e) + d.scroll * 0.45;
    cam.lookAt(0, -0.08, 0);

    /* الجذر: ميلان parallax + دوران تمريري */
    if (root.current) {
      root.current.rotation.y = 0.14 + d.px * 0.14 + d.scroll * 0.3;
      root.current.rotation.x = d.py * 0.06;
    }

    /* رسم القوس تدريجياً — يحاكي بناء الشعار (drawRange) */
    if (arc.current) {
      const total = arc.current.geometry.index?.count ?? 0;
      arc.current.geometry.setDrawRange(0, Math.floor(total * arcP));
    }
    if (arcInner.current) {
      const total = arcInner.current.geometry.index?.count ?? 0;
      arcInner.current.geometry.setDrawRange(
        0,
        Math.floor(total * easeOutCubic(Math.min(1, d.intro * 1.3)))
      );
    }

    /* اللؤلؤة: حطّة + طفو + دوران بطيء */
    if (pearl.current) {
      const s = Math.max(0.001, pearlP);
      pearl.current.scale.setScalar(s);
      pearl.current.position.y = 0.16 + Math.sin(t * 0.7) * 0.075;
      pearl.current.rotation.y += clampedDt * 0.22;
      const mat = pearl.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = t;
    }
    if (glow.current && pearl.current) {
      glow.current.position.copy(pearl.current.position);
      glow.current.scale.setScalar(Math.max(0.001, pearlP));
      const mat = glow.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = t;
    }

    /* المدارات: دوران متعاكس (صدى مدار المعرفة SVG) */
    if (ring1.current) {
      ring1.current.rotation.y += clampedDt * 0.075;
      (ring1.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
    }
    if (ring2.current) {
      ring2.current.rotation.y -= clampedDt * 0.055;
      (ring2.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
    }
    if (dust.current) {
      dust.current.rotation.y += clampedDt * 0.018;
      (dust.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
    }

    /* الكاشدة: تظهر متأخرة (توقيع الشعار) */
    if (kashida.current) {
      const m = kashida.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.55 * easeOutCubic(Math.max(0, Math.min(1, (d.intro - 0.55) / 0.45)));
    }
  });

  return (
    <group ref={root}>
      {/* الإضاءة الثلاثية بنمط awwwards-3d بألوان الهوية */}
      <ambientLight intensity={palette.ambient} />
      <directionalLight position={[5, 8, 5]} intensity={palette.keyIntensity} color={palette.keyLight} />
      <directionalLight position={[-5, 3, 4]} intensity={0.4} color={palette.fillLight} />
      <directionalLight position={[0, 4, -8]} intensity={0.6} color={palette.rimLight} />

      {/* القوس المزدوج — قوس المعرفة (ذهبي خارجي + زمردي داخلي خافت) */}
      <mesh ref={arc}>
        <torusGeometry args={[1.52, 0.062, 22, 128, Math.PI * 0.92]} />
        <meshStandardMaterial
          color={palette.arcColor}
          metalness={0.62}
          roughness={0.3}
          emissive={palette.arcEmissive}
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh ref={arcInner} position={[0, -0.02, -0.06]}>
        <torusGeometry args={[1.36, 0.02, 12, 96, Math.PI * 0.8]} />
        <meshStandardMaterial
          color={palette.pearlEmerald}
          metalness={0.45}
          roughness={0.45}
          transparent
          opacity={0.75}
        />
      </mesh>

      {/* اللؤلؤة — نقطة المعرفة */}
      <mesh ref={pearl} position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.5, 40, 40]} />
        <shaderMaterial args={[pearlArgs]} />
      </mesh>

      {/* هالة اللؤلؤة (بديل bloom بمزج إضافي) */}
      <mesh ref={glow} position={[0, 0.16, -0.55]}>
        <planeGeometry args={[3.4, 3.4]} />
        <shaderMaterial args={[glowArgs]} />
      </mesh>

      {/* مدارا العقد المعرفية */}
      <points ref={ring1} rotation={[0.42, 0, 0.06]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ring1Cloud.positions, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[ring1Cloud.scales, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[ring1Cloud.phases, 1]} />
          <bufferAttribute attach="attributes-aColor" args={[ring1Cloud.colors, 3]} />
        </bufferGeometry>
        <shaderMaterial args={[ring1Args]} />
      </points>
      <points ref={ring2} rotation={[-0.34, 0, -0.14]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ring2Cloud.positions, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[ring2Cloud.scales, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[ring2Cloud.phases, 1]} />
          <bufferAttribute attach="attributes-aColor" args={[ring2Cloud.colors, 3]} />
        </bufferGeometry>
        <shaderMaterial args={[ring2Args]} />
      </points>

      {/* الغبار الذهبي/الزمردي */}
      <points ref={dust}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustCloud.positions, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[dustCloud.scales, 1]} />
          <bufferAttribute attach="attributes-aPhase" args={[dustCloud.phases, 1]} />
          <bufferAttribute attach="attributes-aColor" args={[dustCloud.colors, 3]} />
        </bufferGeometry>
        <shaderMaterial args={[dustArgs]} />
      </points>

      {/* الكاشدة — التوقيع الأفقي */}
      <mesh ref={kashida} position={[0, -1.12, 0]}>
        <boxGeometry args={[1.9, 0.016, 0.016]} />
        <meshBasicMaterial
          color={palette.arcColor}
          transparent
          opacity={0}
          blending={palette.additive ? THREE.AdditiveBlending : THREE.NormalBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ==================================================================== */
/*                              الغلاف                                   */
/* ==================================================================== */

export default function PearlScene({
  theme = "dark",
  mobile = false,
  paused = false,
}: {
  theme?: ThemeName;
  mobile?: boolean;
  paused?: boolean;
}) {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, mobile ? 1.5 : 1.75]}
      frameloop={paused ? "never" : "always"}
      gl={{
        antialias: true,
        alpha: true,
        stencil: false,
        powerPreference: "high-performance",
      }}
      camera={{ fov: 38, near: 0.1, far: 60, position: [0, 0.34, 8.8] }}
      style={{ background: "transparent", pointerEvents: "none" }}
    >
      {/* key=theme: إعادة بناء نظيفة كاملة عند تبديل السمة */}
      <SceneContents key={theme} palette={PALETTES[theme]} mobile={mobile} />
    </Canvas>
  );
}
