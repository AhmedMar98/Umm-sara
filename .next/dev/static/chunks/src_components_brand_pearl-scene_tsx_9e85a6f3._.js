(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/brand/pearl-scene.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PearlScene
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$156d8d12$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-156d8d12.esm.js [app-client] (ecmascript) <export D as useFrame>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const PALETTES = {
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
        additive: true
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
        additive: false
    }
};
/* ---------- عشوائية حتمية (mulberry32) — نفس البذرة نفس التوزيع ---------- */ function mulberry32(seed) {
    let a = seed >>> 0;
    return ()=>{
        a |= 0;
        a = a + 0x6d2b79f5 | 0;
        let t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
/* ---------- شيدر اللؤلؤة ---------- */ const PEARL_VERT = /* glsl */ `
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
/* ---------- شيدر العقد المتوهجة (twinkle) ---------- */ const NODES_VERT = /* glsl */ `
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
/* ---------- شيدر الهالة (بديل bloom خفيف بلا مكتبة post) ---------- */ const GLOW_VERT = /* glsl */ `
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
/* ---------- منحنيات ---------- */ const easeOutCubic = (t)=>1 - Math.pow(1 - t, 3);
const easeOutBack = (t)=>{
    const c1 = 1.70158 * 0.55; /* تجاوز لطيف ~1.04x — شخصية --ease-pearl */ 
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
function buildRingNodes(radius, count, p, seed) {
    const rnd = mulberry32(seed);
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const gold = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](p.nodeGold);
    const emerald = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](p.nodeEmerald);
    for(let i = 0; i < count; i++){
        const a = i / count * Math.PI * 2 + rnd() * 0.22;
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
    return {
        positions,
        scales,
        phases,
        colors
    };
}
function buildDust(count, p, seed) {
    const rnd = mulberry32(seed);
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const gold = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](p.nodeGold);
    const emerald = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](p.nodeEmerald);
    for(let i = 0; i < count; i++){
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
    return {
        positions,
        scales,
        phases,
        colors
    };
}
/* ---------- باني وسائط مواد العقد (نطاق وحدة — نقية) ---------- */ function makeNodesArgs(p, opacity) {
    return {
        uniforms: {
            uTime: {
                value: 0
            },
            uPR: {
                value: Math.min(("TURBOPACK compile-time truthy", 1) ? window.devicePixelRatio : "TURBOPACK unreachable", 2)
            }
        },
        vertexShader: NODES_VERT,
        fragmentShader: NODES_FRAG,
        transparent: true,
        depthWrite: false,
        opacity,
        blending: p.additive ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NormalBlending"]
    };
}
/* ==================================================================== */ /*                            محتويات المشهد                             */ /* ==================================================================== */ function SceneContents({ palette, mobile }) {
    _s();
    /* ---------- بيانات ثابتة (useMemo — تُقرأ فقط ولا تُحور أبداً) ---------- */ const pearlArgs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SceneContents.useMemo[pearlArgs]": ()=>({
                uniforms: {
                    uTime: {
                        value: 0
                    },
                    uBase: {
                        value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](palette.pearlBase)
                    },
                    uGold: {
                        value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](palette.pearlGold)
                    },
                    uEmerald: {
                        value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](palette.pearlEmerald)
                    }
                },
                vertexShader: PEARL_VERT,
                fragmentShader: PEARL_FRAG
            })
    }["SceneContents.useMemo[pearlArgs]"], [
        palette
    ]);
    const ring1Args = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SceneContents.useMemo[ring1Args]": ()=>makeNodesArgs(palette, 1)
    }["SceneContents.useMemo[ring1Args]"], [
        palette
    ]);
    const ring2Args = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SceneContents.useMemo[ring2Args]": ()=>makeNodesArgs(palette, 0.85)
    }["SceneContents.useMemo[ring2Args]"], [
        palette
    ]);
    const dustArgs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SceneContents.useMemo[dustArgs]": ()=>makeNodesArgs(palette, 0.7)
    }["SceneContents.useMemo[dustArgs]"], [
        palette
    ]);
    const glowArgs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SceneContents.useMemo[glowArgs]": ()=>({
                uniforms: {
                    uTime: {
                        value: 0
                    },
                    uColor: {
                        value: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"](palette.glowColor)
                    },
                    uOpacity: {
                        value: palette.glowOpacity
                    }
                },
                vertexShader: GLOW_VERT,
                fragmentShader: GLOW_FRAG,
                transparent: true,
                depthWrite: false,
                blending: palette.additive ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NormalBlending"]
            })
    }["SceneContents.useMemo[glowArgs]"], [
        palette
    ]);
    const ring1Cloud = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SceneContents.useMemo[ring1Cloud]": ()=>buildRingNodes(1.98, mobile ? 20 : 28, palette, 11)
    }["SceneContents.useMemo[ring1Cloud]"], [
        palette,
        mobile
    ]);
    const ring2Cloud = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SceneContents.useMemo[ring2Cloud]": ()=>buildRingNodes(2.42, mobile ? 24 : 34, palette, 77)
    }["SceneContents.useMemo[ring2Cloud]"], [
        palette,
        mobile
    ]);
    const dustCloud = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SceneContents.useMemo[dustCloud]": ()=>buildDust(mobile ? 130 : 300, palette, 42)
    }["SceneContents.useMemo[dustCloud]"], [
        palette,
        mobile
    ]);
    /* ---------- المراجع (التحوير عبرها فقط داخل useFrame) ---------- */ const root = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pearl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const arc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const arcInner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const ring1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const ring2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dust = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const glow = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const kashida = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    /* ---------- حالة damp (نمط awwards-3d: مستقلة عن معدل الإطارات) ---------- */ const st = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        px: 0,
        py: 0,
        tpx: 0,
        tpy: 0,
        scroll: 0,
        tscroll: 0,
        intro: 0
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SceneContents.useEffect": ()=>{
            const onMove = {
                "SceneContents.useEffect.onMove": (e)=>{
                    st.current.tpx = e.clientX / window.innerWidth * 2 - 1;
                    st.current.tpy = -(e.clientY / window.innerHeight * 2 - 1);
                }
            }["SceneContents.useEffect.onMove"];
            const onScroll = {
                "SceneContents.useEffect.onScroll": ()=>{
                    st.current.tscroll = Math.min(1.35, window.scrollY / Math.max(1, window.innerHeight));
                }
            }["SceneContents.useEffect.onScroll"];
            window.addEventListener("pointermove", onMove, {
                passive: true
            });
            window.addEventListener("scroll", onScroll, {
                passive: true
            });
            onScroll();
            return ({
                "SceneContents.useEffect": ()=>{
                    window.removeEventListener("pointermove", onMove);
                    window.removeEventListener("scroll", onScroll);
                }
            })["SceneContents.useEffect"];
        }
    }["SceneContents.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$156d8d12$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "SceneContents.useFrame": (state, dt)=>{
            const d = st.current;
            const clampedDt = Math.min(dt, 0.05);
            /* معامل تخميد مستقل عن الإطارات (نمط awwards-3d) */ const dampF = {
                "SceneContents.useFrame.dampF": (ease)=>1 - Math.pow(1 - ease, clampedDt * 60)
            }["SceneContents.useFrame.dampF"];
            d.px += (d.tpx - d.px) * dampF(0.1);
            d.py += (d.tpy - d.py) * dampF(0.1);
            d.scroll += (d.tscroll - d.scroll) * dampF(0.08);
            d.intro = Math.min(1, d.intro + clampedDt / 2.6);
            const t = state.clock.elapsedTime;
            const e = easeOutCubic(d.intro);
            const arcP = easeOutCubic(Math.min(1, d.intro * 1.45)); /* القوس يكتمل أولاً */ 
            const pearlP = easeOutBack(Math.max(0, Math.min(1, (d.intro - 0.18) / 0.82)));
            /* الكاميرا: دخول doll-in + parallax + انجراف تمريري خفيف
       (v5.1: خُفّض عامل الانجراف — كان يقصّ قمة القوس عند التمرير) */ const cam = state.camera;
            cam.position.x = d.px * 0.5 * e;
            cam.position.y = 0.34 + d.py * 0.32 - d.scroll * 0.08;
            cam.position.z = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MathUtils"].lerp(8.8, 6.15, e) + d.scroll * 0.45;
            cam.lookAt(0, -0.08, 0);
            /* الجذر: ميلان parallax + دوران تمريري */ if (root.current) {
                root.current.rotation.y = 0.14 + d.px * 0.14 + d.scroll * 0.3;
                root.current.rotation.x = d.py * 0.06;
            }
            /* رسم القوس تدريجياً — يحاكي بناء الشعار (drawRange) */ if (arc.current) {
                const total = arc.current.geometry.index?.count ?? 0;
                arc.current.geometry.setDrawRange(0, Math.floor(total * arcP));
            }
            if (arcInner.current) {
                const total = arcInner.current.geometry.index?.count ?? 0;
                arcInner.current.geometry.setDrawRange(0, Math.floor(total * easeOutCubic(Math.min(1, d.intro * 1.3))));
            }
            /* اللؤلؤة: حطّة + طفو + دوران بطيء */ if (pearl.current) {
                const s = Math.max(0.001, pearlP);
                pearl.current.scale.setScalar(s);
                pearl.current.position.y = 0.16 + Math.sin(t * 0.7) * 0.075;
                pearl.current.rotation.y += clampedDt * 0.22;
                const mat = pearl.current.material;
                mat.uniforms.uTime.value = t;
            }
            if (glow.current && pearl.current) {
                glow.current.position.copy(pearl.current.position);
                glow.current.scale.setScalar(Math.max(0.001, pearlP));
                const mat = glow.current.material;
                mat.uniforms.uTime.value = t;
            }
            /* المدارات: دوران متعاكس (صدى مدار المعرفة SVG) */ if (ring1.current) {
                ring1.current.rotation.y += clampedDt * 0.075;
                ring1.current.material.uniforms.uTime.value = t;
            }
            if (ring2.current) {
                ring2.current.rotation.y -= clampedDt * 0.055;
                ring2.current.material.uniforms.uTime.value = t;
            }
            if (dust.current) {
                dust.current.rotation.y += clampedDt * 0.018;
                dust.current.material.uniforms.uTime.value = t;
            }
            /* الكاشدة: تظهر متأخرة (توقيع الشعار) */ if (kashida.current) {
                const m = kashida.current.material;
                m.opacity = 0.55 * easeOutCubic(Math.max(0, Math.min(1, (d.intro - 0.55) / 0.45)));
            }
        }
    }["SceneContents.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("group", {
        ref: root,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ambientLight", {
                intensity: palette.ambient
            }, void 0, false, {
                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                lineNumber: 450,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("directionalLight", {
                position: [
                    5,
                    8,
                    5
                ],
                intensity: palette.keyIntensity,
                color: palette.keyLight
            }, void 0, false, {
                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                lineNumber: 451,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("directionalLight", {
                position: [
                    -5,
                    3,
                    4
                ],
                intensity: 0.4,
                color: palette.fillLight
            }, void 0, false, {
                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                lineNumber: 452,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("directionalLight", {
                position: [
                    0,
                    4,
                    -8
                ],
                intensity: 0.6,
                color: palette.rimLight
            }, void 0, false, {
                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                lineNumber: 453,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                ref: arc,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("torusGeometry", {
                        args: [
                            1.52,
                            0.062,
                            22,
                            128,
                            Math.PI * 0.92
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/brand/pearl-scene.tsx",
                        lineNumber: 457,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: palette.arcColor,
                        metalness: 0.62,
                        roughness: 0.3,
                        emissive: palette.arcEmissive,
                        emissiveIntensity: 0.5
                    }, void 0, false, {
                        fileName: "[project]/src/components/brand/pearl-scene.tsx",
                        lineNumber: 458,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                lineNumber: 456,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                ref: arcInner,
                position: [
                    0,
                    -0.02,
                    -0.06
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("torusGeometry", {
                        args: [
                            1.36,
                            0.02,
                            12,
                            96,
                            Math.PI * 0.8
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/brand/pearl-scene.tsx",
                        lineNumber: 467,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshStandardMaterial", {
                        color: palette.pearlEmerald,
                        metalness: 0.45,
                        roughness: 0.45,
                        transparent: true,
                        opacity: 0.75
                    }, void 0, false, {
                        fileName: "[project]/src/components/brand/pearl-scene.tsx",
                        lineNumber: 468,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                lineNumber: 466,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                ref: pearl,
                position: [
                    0,
                    0.16,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("sphereGeometry", {
                        args: [
                            0.5,
                            40,
                            40
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/brand/pearl-scene.tsx",
                        lineNumber: 479,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("shaderMaterial", {
                        args: [
                            pearlArgs
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/brand/pearl-scene.tsx",
                        lineNumber: 480,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                lineNumber: 478,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                ref: glow,
                position: [
                    0,
                    0.16,
                    -0.55
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("planeGeometry", {
                        args: [
                            3.4,
                            3.4
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/brand/pearl-scene.tsx",
                        lineNumber: 485,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("shaderMaterial", {
                        args: [
                            glowArgs
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/brand/pearl-scene.tsx",
                        lineNumber: 486,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                lineNumber: 484,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("points", {
                ref: ring1,
                rotation: [
                    0.42,
                    0,
                    0.06
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferGeometry", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferAttribute", {
                                attach: "attributes-position",
                                args: [
                                    ring1Cloud.positions,
                                    3
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                                lineNumber: 492,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferAttribute", {
                                attach: "attributes-aScale",
                                args: [
                                    ring1Cloud.scales,
                                    1
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                                lineNumber: 493,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferAttribute", {
                                attach: "attributes-aPhase",
                                args: [
                                    ring1Cloud.phases,
                                    1
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                                lineNumber: 494,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferAttribute", {
                                attach: "attributes-aColor",
                                args: [
                                    ring1Cloud.colors,
                                    3
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                                lineNumber: 495,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/brand/pearl-scene.tsx",
                        lineNumber: 491,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("shaderMaterial", {
                        args: [
                            ring1Args
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/brand/pearl-scene.tsx",
                        lineNumber: 497,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                lineNumber: 490,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("points", {
                ref: ring2,
                rotation: [
                    -0.34,
                    0,
                    -0.14
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferGeometry", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferAttribute", {
                                attach: "attributes-position",
                                args: [
                                    ring2Cloud.positions,
                                    3
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                                lineNumber: 501,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferAttribute", {
                                attach: "attributes-aScale",
                                args: [
                                    ring2Cloud.scales,
                                    1
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                                lineNumber: 502,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferAttribute", {
                                attach: "attributes-aPhase",
                                args: [
                                    ring2Cloud.phases,
                                    1
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                                lineNumber: 503,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferAttribute", {
                                attach: "attributes-aColor",
                                args: [
                                    ring2Cloud.colors,
                                    3
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                                lineNumber: 504,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/brand/pearl-scene.tsx",
                        lineNumber: 500,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("shaderMaterial", {
                        args: [
                            ring2Args
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/brand/pearl-scene.tsx",
                        lineNumber: 506,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                lineNumber: 499,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("points", {
                ref: dust,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferGeometry", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferAttribute", {
                                attach: "attributes-position",
                                args: [
                                    dustCloud.positions,
                                    3
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                                lineNumber: 512,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferAttribute", {
                                attach: "attributes-aScale",
                                args: [
                                    dustCloud.scales,
                                    1
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                                lineNumber: 513,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferAttribute", {
                                attach: "attributes-aPhase",
                                args: [
                                    dustCloud.phases,
                                    1
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                                lineNumber: 514,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferAttribute", {
                                attach: "attributes-aColor",
                                args: [
                                    dustCloud.colors,
                                    3
                                ]
                            }, void 0, false, {
                                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                                lineNumber: 515,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/brand/pearl-scene.tsx",
                        lineNumber: 511,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("shaderMaterial", {
                        args: [
                            dustArgs
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/brand/pearl-scene.tsx",
                        lineNumber: 517,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                lineNumber: 510,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("mesh", {
                ref: kashida,
                position: [
                    0,
                    -1.12,
                    0
                ],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("boxGeometry", {
                        args: [
                            1.9,
                            0.016,
                            0.016
                        ]
                    }, void 0, false, {
                        fileName: "[project]/src/components/brand/pearl-scene.tsx",
                        lineNumber: 522,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("meshBasicMaterial", {
                        color: palette.arcColor,
                        transparent: true,
                        opacity: 0,
                        blending: palette.additive ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdditiveBlending"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NormalBlending"],
                        depthWrite: false
                    }, void 0, false, {
                        fileName: "[project]/src/components/brand/pearl-scene.tsx",
                        lineNumber: 523,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/brand/pearl-scene.tsx",
                lineNumber: 521,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/brand/pearl-scene.tsx",
        lineNumber: 448,
        columnNumber: 5
    }, this);
}
_s(SceneContents, "UJCdcoD5hBFEPuI+a3aJEBooF7Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$156d8d12$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c = SceneContents;
function PearlScene({ theme = "dark", mobile = false, paused = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Canvas"], {
        className: "!absolute inset-0",
        dpr: [
            1,
            mobile ? 1.5 : 1.75
        ],
        frameloop: paused ? "never" : "always",
        gl: {
            antialias: true,
            alpha: true,
            stencil: false,
            powerPreference: "high-performance"
        },
        camera: {
            fov: 38,
            near: 0.1,
            far: 60,
            position: [
                0,
                0.34,
                8.8
            ]
        },
        style: {
            background: "transparent",
            pointerEvents: "none"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SceneContents, {
            palette: PALETTES[theme],
            mobile: mobile
        }, theme, false, {
            fileName: "[project]/src/components/brand/pearl-scene.tsx",
            lineNumber: 563,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/brand/pearl-scene.tsx",
        lineNumber: 549,
        columnNumber: 5
    }, this);
}
_c1 = PearlScene;
var _c, _c1;
__turbopack_context__.k.register(_c, "SceneContents");
__turbopack_context__.k.register(_c1, "PearlScene");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/brand/pearl-scene.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/brand/pearl-scene.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_brand_pearl-scene_tsx_9e85a6f3._.js.map