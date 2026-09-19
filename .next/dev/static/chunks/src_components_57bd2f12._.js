(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/particle-field.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ParticleField",
    ()=>ParticleField
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function ParticleField({ className = "" }) {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ParticleField.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            let raf = 0;
            let w = 0;
            let h = 0;
            let t = 0;
            let dpr = Math.min(window.devicePixelRatio || 1, 2);
            const mouse = {
                x: 0,
                y: 0,
                tx: 0,
                ty: 0
            };
            let particles = [];
            const EMERALD = {
                r: 74,
                g: 226,
                b: 165
            };
            const GOLD = {
                r: 226,
                g: 200,
                b: 133
            };
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
                const push = {
                    "ParticleField.useEffect.spawn.push": (layer, n, rMin, rMax)=>{
                        for(let i = 0; i < n; i++){
                            particles.push({
                                x: Math.random() * w,
                                y: Math.random() * h,
                                vx: (Math.random() - 0.5) * (layer === 2 ? 0.1 : 0.22),
                                vy: (Math.random() - 0.5) * (layer === 2 ? 0.08 : 0.2),
                                r: rMin + Math.random() * (rMax - rMin),
                                gold: Math.random() < (layer === 2 ? 0.45 : 0.2),
                                tw: Math.random() * Math.PI * 2,
                                layer,
                                phase: Math.random() * Math.PI * 2
                            });
                        }
                    }
                }["ParticleField.useEffect.spawn.push"];
                push(0, nDust, 0.4, 1.1); // غبار بعيد
                push(1, nMid, 1.1, 2.1); // متوسط
                push(2, nBokeh, 7, 15); // بوكيه أمامي
            }
            function resize() {
                const rect = canvas.getBoundingClientRect();
                dpr = Math.min(window.devicePixelRatio || 1, 2);
                w = rect.width;
                h = rect.height;
                canvas.width = Math.floor(w * dpr);
                canvas.height = Math.floor(h * dpr);
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                spawn();
            }
            function draw() {
                ctx.clearRect(0, 0, w, h);
                const dark = isDark();
                const baseAlpha = dark ? 1 : 0.5;
                // عمق الكاميرا: إزاحة عكسية بالطبقة
                const par = [
                    -mouse.x * 0.006,
                    -mouse.x * 0.016,
                    -mouse.x * 0.045
                ];
                const parY = [
                    -mouse.y * 0.004,
                    -mouse.y * 0.01,
                    -mouse.y * 0.028
                ];
                for (const p of particles){
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
                        const grad = ctx.createRadialGradient(px, py, 0, px, py, p.r);
                        const a = (p.gold ? 0.1 : 0.07) * twinkle * baseAlpha;
                        grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${a})`);
                        grad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
                        ctx.beginPath();
                        ctx.arc(px, py, p.r, 0, Math.PI * 2);
                        ctx.fillStyle = grad;
                        ctx.fill();
                    } else {
                        const alpha = (p.layer === 0 ? 0.35 : p.gold ? 0.8 : 0.55) * twinkle * baseAlpha;
                        ctx.beginPath();
                        ctx.arc(px, py, p.r, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
                        ctx.fill();
                        if (p.layer === 1 && p.gold) {
                            // توهج صغير للذهبي المتوسط
                            ctx.beginPath();
                            ctx.arc(px, py, p.r * 2.6, 0, Math.PI * 2);
                            ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${alpha * 0.16})`;
                            ctx.fill();
                        }
                    }
                }
                // خطوط ربط بين جسيمات الطبقة المتوسطة فقط (أداء + وضوح)
                const mid = particles.filter({
                    "ParticleField.useEffect.draw.mid": (p)=>p.layer === 1
                }["ParticleField.useEffect.draw.mid"]);
                const linkDist = w < 768 ? 90 : 130;
                ctx.lineWidth = 0.55;
                for(let i = 0; i < mid.length; i++){
                    for(let j = i + 1; j < mid.length; j++){
                        const a = mid[i];
                        const b = mid[j];
                        const dx = a.x - b.x;
                        const dy = a.y - b.y;
                        const d = Math.hypot(dx, dy);
                        if (d < linkDist) {
                            const o = (1 - d / linkDist) * 0.13 * baseAlpha;
                            ctx.strokeStyle = `rgba(${EMERALD.r},${EMERALD.g},${EMERALD.b},${o})`;
                            ctx.beginPath();
                            ctx.moveTo(a.x + par[1], a.y + parY[1]);
                            ctx.lineTo(b.x + par[1], b.y + parY[1]);
                            ctx.stroke();
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
            const onMove = {
                "ParticleField.useEffect.onMove": (e)=>{
                    const rect = canvas.getBoundingClientRect();
                    mouse.tx = e.clientX - rect.left - w / 2 || 0;
                    mouse.ty = e.clientY - rect.top - h / 2 || 0;
                }
            }["ParticleField.useEffect.onMove"];
            resize();
            tick();
            const ro = new ResizeObserver(resize);
            ro.observe(canvas);
            window.addEventListener("pointermove", onMove, {
                passive: true
            });
            // مراقبة تبديل السمة (الرسم يقرأ isDark كل إطار — لا حاجة لمعالجة)
            return ({
                "ParticleField.useEffect": ()=>{
                    cancelAnimationFrame(raf);
                    ro.disconnect();
                    window.removeEventListener("pointermove", onMove);
                }
            })["ParticleField.useEffect"];
        }
    }["ParticleField.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef,
        "aria-hidden": "true",
        className: `hero-canvas ${className}`
    }, void 0, false, {
        fileName: "[project]/src/components/particle-field.tsx",
        lineNumber: 214,
        columnNumber: 5
    }, this);
}
_s(ParticleField, "UJgi7ynoup7eqypjnwyX/s32POg=");
_c = ParticleField;
var _c;
__turbopack_context__.k.register(_c, "ParticleField");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/reveal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Reveal",
    ()=>Reveal,
    "StatCounter",
    ()=>StatCounter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const VARIANT_CLASS = {
    up: {
        hidden: "translate-y-7 opacity-0",
        shown: "translate-y-0 opacity-100"
    },
    blur: {
        hidden: "translate-y-5 opacity-0 [filter:blur(8px)]",
        shown: "translate-y-0 opacity-100 [filter:blur(0px)]"
    },
    scale: {
        hidden: "scale-[0.96] opacity-0",
        shown: "scale-100 opacity-100"
    }
};
function Reveal({ children, delay = 0, className, variant = "up", as = "div" }) {
    _s();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Reveal.useEffect": ()=>{
            const el = ref.current;
            if (!el) return;
            // reduced-motion: اعرض الحالة النهائية فوراً (عبر مؤقّت صفر — بلا setState متزامن)
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                const t = window.setTimeout({
                    "Reveal.useEffect.t": ()=>setVisible(true)
                }["Reveal.useEffect.t"], 0);
                return ({
                    "Reveal.useEffect": ()=>window.clearTimeout(t)
                })["Reveal.useEffect"];
            }
            const io = new IntersectionObserver({
                "Reveal.useEffect": ([entry])=>{
                    if (entry.isIntersecting) {
                        setVisible(true);
                        io.disconnect();
                    }
                }
            }["Reveal.useEffect"], {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            });
            io.observe(el);
            return ({
                "Reveal.useEffect": ()=>io.disconnect()
            })["Reveal.useEffect"];
        }
    }["Reveal.useEffect"], []);
    const Tag = as;
    const v = VARIANT_CLASS[variant];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tag, {
        ref: ref,
        style: {
            transitionDelay: `${delay}ms`
        },
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("transition-[transform,opacity,filter] duration-[850ms] [transition-timing-function:var(--ease-expo)] will-change-transform", visible ? v.shown : v.hidden, className),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/reveal.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
}
_s(Reveal, "F7BtIAxVh3vOWU1Jr24RYsj9CHc=");
_c = Reveal;
function StatCounter({ value, suffix = "", label, className }) {
    _s1();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [display, setDisplay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StatCounter.useEffect": ()=>{
            const el = ref.current;
            if (!el) return;
            let started = false;
            const io = new IntersectionObserver({
                "StatCounter.useEffect": ([entry])=>{
                    if (entry.isIntersecting && !started) {
                        started = true;
                        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                        if (reduced) {
                            setDisplay(value);
                            io.disconnect();
                            return;
                        }
                        const dur = 1600;
                        const t0 = performance.now();
                        const step = {
                            "StatCounter.useEffect.step": (t)=>{
                                const p = Math.min((t - t0) / dur, 1);
                                const eased = 1 - Math.pow(1 - p, 3);
                                setDisplay(Math.round(value * eased));
                                if (p < 1) requestAnimationFrame(step);
                            }
                        }["StatCounter.useEffect.step"];
                        requestAnimationFrame(step);
                        io.disconnect();
                    }
                }
            }["StatCounter.useEffect"], {
                threshold: 0.4
            });
            io.observe(el);
            return ({
                "StatCounter.useEffect": ()=>io.disconnect()
            })["StatCounter.useEffect"];
        }
    }["StatCounter.useEffect"], [
        value
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center gap-2 text-center", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-display text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl",
                dir: "ltr",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "gold-gradient-text",
                        children: display.toLocaleString("en-US")
                    }, void 0, false, {
                        fileName: "[project]/src/components/reveal.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-gold-bright",
                        children: suffix
                    }, void 0, false, {
                        fileName: "[project]/src/components/reveal.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/reveal.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "mono-chip text-[9px] text-muted-foreground sm:text-[10px]",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/reveal.tsx",
                lineNumber: 135,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/reveal.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
_s1(StatCounter, "LMOgqDHOOne+hOrWIjVyJGascQ4=");
_c1 = StatCounter;
var _c, _c1;
__turbopack_context__.k.register(_c, "Reveal");
__turbopack_context__.k.register(_c1, "StatCounter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/word-reveal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WordReveal",
    ()=>WordReveal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function WordReveal({ text, className, wordClassName, delay = 0, stagger = 70, as: Tag = "span", style }) {
    _s();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [ready, setReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WordReveal.useEffect": ()=>{
            const el = ref.current;
            if (!el) return;
            // تشغيل عبر مؤقّت دائماً (تجنّب setState المتزامن داخل الـ effect) —
            // reduced-motion: الحالة النهائية فوراً (صفر تأخير)
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const t = window.setTimeout({
                "WordReveal.useEffect.t": ()=>setReady(true)
            }["WordReveal.useEffect.t"], reduced ? 0 : delay);
            return ({
                "WordReveal.useEffect": ()=>window.clearTimeout(t)
            })["WordReveal.useEffect"];
        }
    }["WordReveal.useEffect"], [
        delay
    ]);
    const words = text.split(" ");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tag, {
        ref: ref,
        "aria-label": text,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-block", className),
        style: style,
        children: words.map((w, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "aria-hidden": "true",
                /* حشو رأسي معاكس يوسّع صندوق القصّ لحماية التشكيل العربي (فوق/تحت) */ className: "inline-block overflow-hidden px-[0.02em] py-[0.18em] -my-[0.18em] align-bottom",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("inline-block will-change-transform transition-[transform,opacity,filter] duration-[900ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]", wordClassName),
                        style: {
                            transitionDelay: `${i * stagger}ms`,
                            transform: ready ? "translateY(0)" : "translateY(115%)",
                            opacity: ready ? 1 : 0,
                            filter: ready ? "blur(0px)" : "blur(6px)"
                        },
                        children: w
                    }, void 0, false, {
                        fileName: "[project]/src/components/word-reveal.tsx",
                        lineNumber: 57,
                        columnNumber: 11
                    }, this),
                    i < words.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        "aria-hidden": "true",
                        children: " "
                    }, void 0, false, {
                        fileName: "[project]/src/components/word-reveal.tsx",
                        lineNumber: 71,
                        columnNumber: 36
                    }, this)
                ]
            }, `${w}-${i}`, true, {
                fileName: "[project]/src/components/word-reveal.tsx",
                lineNumber: 51,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/word-reveal.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_s(WordReveal, "ctPjIdD54uC8zTWlO2J9EchDWY4=");
_c = WordReveal;
var _c;
__turbopack_context__.k.register(_c, "WordReveal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/magnetic.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Magnetic",
    ()=>Magnetic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/value/use-motion-value.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/value/use-spring.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function Magnetic({ children, intensity = 0.35, range = 90, className }) {
    _s();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [enabled, setEnabled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const x = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"])(0);
    const y = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"])(0);
    const springX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"])(x, {
        stiffness: 26.7,
        damping: 4.1,
        mass: 0.2
    });
    const springY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"])(y, {
        stiffness: 26.7,
        damping: 4.1,
        mass: 0.2
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Magnetic.useEffect": ()=>{
            // مؤشرات اللمس لا تناسب المغناطيسية + احترام تقليل الحركة
            const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (!fine || reduced) return;
            // عبر rAF بدل الاستدعاء المتزامن داخل الـ effect
            const raf = requestAnimationFrame({
                "Magnetic.useEffect.raf": ()=>setEnabled(true)
            }["Magnetic.useEffect.raf"]);
            const onMove = {
                "Magnetic.useEffect.onMove": (e)=>{
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
                }
            }["Magnetic.useEffect.onMove"];
            window.addEventListener("mousemove", onMove, {
                passive: true
            });
            return ({
                "Magnetic.useEffect": ()=>{
                    cancelAnimationFrame(raf);
                    window.removeEventListener("mousemove", onMove);
                }
            })["Magnetic.useEffect"];
        }
    }["Magnetic.useEffect"], [
        intensity,
        range,
        x,
        y
    ]);
    if (!enabled) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/magnetic.tsx",
        lineNumber: 62,
        columnNumber: 24
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        ref: ref,
        className: className,
        style: {
            x: springX,
            y: springY
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/magnetic.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
_s(Magnetic, "ShGpHEak/zCQQMc+q1O9QbuoA7I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMotionValue"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSpring"]
    ];
});
_c = Magnetic;
var _c;
__turbopack_context__.k.register(_c, "Magnetic");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/brand/logo-construction.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LogoConstruction",
    ()=>LogoConstruction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/* ============================================================
   بناء الشعار المتحرك — تسلسل «الهوية تُكتب» (v4)
   ------------------------------------------------------------
   مستلهم من مرجع حركة الشعار (بناء إنشائي) معرّباً RTL:
   1) دليل قياس يُرسم يميناً→يساراً (نبضة ترقب — 0.6s)
   2) القوس يُكتب كالكاليجرافي المتصل: قدم يمنى→قمة→يسرى (0.75s)
   3) اللؤلؤة تحطّ من الأعلى بحطّة لطيفة 1.04x + توهج متأخر (0.55s)
   4) الكاشدة تكتسح كالتوقيع، ويتلاشى الدليل (0.5s)
   الإجمالي ~1.75s — تحوّلات وopacity فقط · CSS خالص
   prefers-reduced-motion: الحالة النهائية فوراً (انظر globals.css)
   ============================================================ */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$brand$2f$logo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/brand/logo.tsx [app-client] (ecmascript)");
;
;
function LogoConstruction({ size = 56 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: size,
        height: size,
        viewBox: "0 0 64 64",
        fill: "none",
        "aria-hidden": "true",
        className: "text-gold",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
            className: "logo-construct",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                    className: "logo-guide",
                    x1: 58,
                    y1: 52,
                    x2: 6,
                    y2: 52,
                    pathLength: 1,
                    stroke: "currentColor",
                    strokeOpacity: 0.28,
                    strokeWidth: 0.9,
                    strokeDasharray: "1",
                    strokeDashoffset: 1
                }, void 0, false, {
                    fileName: "[project]/src/components/brand/logo-construction.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    className: "logo-kashida",
                    d: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$brand$2f$logo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KASHIDA_PATH"],
                    pathLength: 1,
                    stroke: "currentColor",
                    strokeOpacity: 0.75,
                    strokeWidth: 2.5,
                    strokeLinecap: "round"
                }, void 0, false, {
                    fileName: "[project]/src/components/brand/logo-construction.tsx",
                    lineNumber: 42,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    className: "logo-arch",
                    d: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$brand$2f$logo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ARCH_PATH"],
                    pathLength: 1,
                    stroke: "currentColor",
                    strokeWidth: 3.4,
                    strokeLinecap: "round"
                }, void 0, false, {
                    fileName: "[project]/src/components/brand/logo-construction.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    className: "logo-pearl-glow",
                    cx: 32,
                    cy: 30.5,
                    r: 9,
                    fill: "#e8d48b",
                    opacity: 0
                }, void 0, false, {
                    fileName: "[project]/src/components/brand/logo-construction.tsx",
                    lineNumber: 63,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    className: "logo-pearl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: 32,
                            cy: 30.5,
                            r: 5.2,
                            fill: "#c5a059"
                        }, void 0, false, {
                            fileName: "[project]/src/components/brand/logo-construction.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: 30.2,
                            cy: 28.7,
                            r: 1.7,
                            fill: "#f4e9c8",
                            opacity: 0.9
                        }, void 0, false, {
                            fileName: "[project]/src/components/brand/logo-construction.tsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/brand/logo-construction.tsx",
                    lineNumber: 66,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/brand/logo-construction.tsx",
            lineNumber: 25,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/brand/logo-construction.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_c = LogoConstruction;
var _c;
__turbopack_context__.k.register(_c, "LogoConstruction");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/knowledge-orbit.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "KnowledgeOrbit",
    ()=>KnowledgeOrbit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$brand$2f$logo$2d$construction$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/brand/logo-construction.tsx [app-client] (ecmascript)");
;
;
function KnowledgeOrbit({ className = "" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `knowledge-orbit ${className}`,
        "aria-hidden": "true",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            viewBox: "0 0 600 600",
            fill: "none",
            className: "h-full w-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("radialGradient", {
                            id: "orbit-glow",
                            cx: "50%",
                            cy: "50%",
                            r: "50%",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "0%",
                                    stopColor: "#16a37a",
                                    stopOpacity: "0.16"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/knowledge-orbit.tsx",
                                    lineNumber: 16,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "100%",
                                    stopColor: "#16a37a",
                                    stopOpacity: "0"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/knowledge-orbit.tsx",
                                    lineNumber: 17,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/knowledge-orbit.tsx",
                            lineNumber: 15,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                            id: "orbit-ring-a",
                            x1: "0",
                            y1: "0",
                            x2: "600",
                            y2: "600",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "0%",
                                    stopColor: "#e8d48b",
                                    stopOpacity: "0.55"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/knowledge-orbit.tsx",
                                    lineNumber: 20,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "100%",
                                    stopColor: "#2ed39a",
                                    stopOpacity: "0.25"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/knowledge-orbit.tsx",
                                    lineNumber: 21,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/knowledge-orbit.tsx",
                            lineNumber: 19,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/knowledge-orbit.tsx",
                    lineNumber: 14,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "300",
                    cy: "300",
                    r: "230",
                    fill: "url(#orbit-glow)"
                }, void 0, false, {
                    fileName: "[project]/src/components/knowledge-orbit.tsx",
                    lineNumber: 26,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    className: "orbit-spin-slow",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "300",
                            cy: "300",
                            r: "252",
                            stroke: "url(#orbit-ring-a)",
                            strokeWidth: "1.2",
                            strokeDasharray: "3 9"
                        }, void 0, false, {
                            fileName: "[project]/src/components/knowledge-orbit.tsx",
                            lineNumber: 30,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "300",
                            cy: "48",
                            r: "6",
                            fill: "#e8d48b",
                            className: "orbit-node"
                        }, void 0, false, {
                            fileName: "[project]/src/components/knowledge-orbit.tsx",
                            lineNumber: 37,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "524",
                            cy: "428",
                            r: "4.5",
                            fill: "#2ed39a",
                            className: "orbit-node orbit-node-dim"
                        }, void 0, false, {
                            fileName: "[project]/src/components/knowledge-orbit.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "76",
                            cy: "428",
                            r: "5",
                            fill: "#c5a059",
                            className: "orbit-node"
                        }, void 0, false, {
                            fileName: "[project]/src/components/knowledge-orbit.tsx",
                            lineNumber: 39,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/knowledge-orbit.tsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    className: "orbit-spin-rev",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "300",
                            cy: "300",
                            r: "186",
                            stroke: "#c5a059",
                            strokeOpacity: "0.42",
                            strokeWidth: "1",
                            strokeDasharray: "1 12"
                        }, void 0, false, {
                            fileName: "[project]/src/components/knowledge-orbit.tsx",
                            lineNumber: 44,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "300",
                            cy: "114",
                            r: "4.5",
                            fill: "#2ed39a",
                            className: "orbit-node"
                        }, void 0, false, {
                            fileName: "[project]/src/components/knowledge-orbit.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "462",
                            cy: "394",
                            r: "3.5",
                            fill: "#e8d48b",
                            className: "orbit-node orbit-node-dim"
                        }, void 0, false, {
                            fileName: "[project]/src/components/knowledge-orbit.tsx",
                            lineNumber: 52,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "138",
                            cy: "394",
                            r: "3.5",
                            fill: "#c5a059",
                            className: "orbit-node orbit-node-dim"
                        }, void 0, false, {
                            fileName: "[project]/src/components/knowledge-orbit.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/knowledge-orbit.tsx",
                    lineNumber: 43,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    className: "orbit-spin-fast",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "300",
                            cy: "300",
                            r: "122",
                            stroke: "#2ed39a",
                            strokeOpacity: "0.32",
                            strokeWidth: "1",
                            strokeDasharray: "2 7"
                        }, void 0, false, {
                            fileName: "[project]/src/components/knowledge-orbit.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "422",
                            cy: "300",
                            r: "3.5",
                            fill: "#e8d48b",
                            className: "orbit-node"
                        }, void 0, false, {
                            fileName: "[project]/src/components/knowledge-orbit.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "178",
                            cy: "300",
                            r: "3",
                            fill: "#2ed39a",
                            className: "orbit-node orbit-node-dim"
                        }, void 0, false, {
                            fileName: "[project]/src/components/knowledge-orbit.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/knowledge-orbit.tsx",
                    lineNumber: 57,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M 300 118 A 182 182 0 0 1 458 210",
                    stroke: "#c5a059",
                    strokeOpacity: "0.4",
                    strokeWidth: "1",
                    strokeLinecap: "round"
                }, void 0, false, {
                    fileName: "[project]/src/components/knowledge-orbit.tsx",
                    lineNumber: 70,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M 300 482 A 182 182 0 0 1 142 390",
                    stroke: "#2ed39a",
                    strokeOpacity: "0.25",
                    strokeWidth: "1",
                    strokeLinecap: "round"
                }, void 0, false, {
                    fileName: "[project]/src/components/knowledge-orbit.tsx",
                    lineNumber: 77,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "300",
                            cy: "300",
                            r: "86",
                            fill: "#0d1613",
                            fillOpacity: "0.7"
                        }, void 0, false, {
                            fileName: "[project]/src/components/knowledge-orbit.tsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "300",
                            cy: "300",
                            r: "86",
                            stroke: "#c5a059",
                            strokeOpacity: "0.45",
                            strokeWidth: "1"
                        }, void 0, false, {
                            fileName: "[project]/src/components/knowledge-orbit.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "300",
                            cy: "300",
                            r: "76",
                            stroke: "#c5a059",
                            strokeOpacity: "0.18",
                            strokeWidth: "1"
                        }, void 0, false, {
                            fileName: "[project]/src/components/knowledge-orbit.tsx",
                            lineNumber: 89,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("foreignObject", {
                            x: "256",
                            y: "256",
                            width: "88",
                            height: "88",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex h-full w-full items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$brand$2f$logo$2d$construction$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LogoConstruction"], {
                                    size: 56
                                }, void 0, false, {
                                    fileName: "[project]/src/components/knowledge-orbit.tsx",
                                    lineNumber: 92,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/knowledge-orbit.tsx",
                                lineNumber: 91,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/knowledge-orbit.tsx",
                            lineNumber: 90,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/knowledge-orbit.tsx",
                    lineNumber: 86,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                    x: "300",
                    y: "26",
                    textAnchor: "middle",
                    className: "orbit-label",
                    fill: "#8ba297",
                    fontSize: "10",
                    letterSpacing: "3",
                    fontFamily: "var(--font-plex-mono), monospace",
                    children: "KNOWLEDGE · ORBIT"
                }, void 0, false, {
                    fileName: "[project]/src/components/knowledge-orbit.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                    x: "300",
                    y: "586",
                    textAnchor: "middle",
                    className: "orbit-label",
                    fill: "#8ba297",
                    fontSize: "10",
                    letterSpacing: "3",
                    fontFamily: "var(--font-plex-mono), monospace",
                    children: "RESEARCH · EXCELLENCE"
                }, void 0, false, {
                    fileName: "[project]/src/components/knowledge-orbit.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/knowledge-orbit.tsx",
            lineNumber: 13,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/knowledge-orbit.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_c = KnowledgeOrbit;
var _c;
__turbopack_context__.k.register(_c, "KnowledgeOrbit");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/hero-visual.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HeroVisual",
    ()=>HeroVisual
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$knowledge$2d$orbit$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/knowledge-orbit.tsx [app-client] (ecmascript)");
;
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const PearlScene = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/src/components/brand/pearl-scene.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/src/components/brand/pearl-scene.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = PearlScene;
/** كشف WebGL مع رفض المسعّرات البرمجية (نمط awwwards-3d) */ function detectRealWebGL() {
    try {
        const c = document.createElement("canvas");
        const gl = c.getContext("webgl2") || c.getContext("webgl");
        if (!gl) return false;
        const dbg = gl.getExtension("WEBGL_debug_renderer_info");
        const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
        return !/SwiftShader|Software|llvmpipe|Basic Render/i.test(renderer);
    } catch  {
        return false;
    }
}
function HeroVisual({ className = "", faint = false }) {
    _s();
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("pending");
    const [sceneError, setSceneError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [paused, setPaused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mobile, setMobile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const wrapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const { resolvedTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroVisual.useEffect": ()=>{
            let raf = 0;
            let timer = 0;
            /* نمط rAF المؤجل (المعتمد في المشروع) — الكشف بعد أول إطار */ raf = requestAnimationFrame({
                "HeroVisual.useEffect": ()=>{
                    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                    if (reduced) {
                        setMode("fallback");
                        return;
                    }
                    /* ?force3d=1 — مفتاح فحص/تشخيص: يتجاوز رفض المسعّرات البرمجية فقط
         (بيئات CI/headless) ولا يمس بوابة reduced-motion إطلاقاً */ const force3d = new URLSearchParams(window.location.search).has("force3d");
                    if (!force3d && !detectRealWebGL()) {
                        setMode("fallback");
                        return;
                    }
                    setMobile(window.matchMedia("(max-width: 1024px)").matches);
                    /* بعد اكتمال بناء الشعار SVG (~2.2s) — لحظة "استيقاظ" المشهد */ timer = window.setTimeout({
                        "HeroVisual.useEffect": ()=>setMode("scene3d")
                    }["HeroVisual.useEffect"], 2200);
                }
            }["HeroVisual.useEffect"]);
            return ({
                "HeroVisual.useEffect": ()=>{
                    cancelAnimationFrame(raf);
                    window.clearTimeout(timer);
                }
            })["HeroVisual.useEffect"];
        }
    }["HeroVisual.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroVisual.useEffect": ()=>{
            const el = wrapRef.current;
            if (!el || typeof IntersectionObserver === "undefined") return;
            const io = new IntersectionObserver({
                "HeroVisual.useEffect": ([entry])=>setPaused(!entry.isIntersecting)
            }["HeroVisual.useEffect"], {
                threshold: 0.04
            });
            io.observe(el);
            return ({
                "HeroVisual.useEffect": ()=>io.disconnect()
            })["HeroVisual.useEffect"];
        }
    }["HeroVisual.useEffect"], [
        mode
    ]);
    const showScene = mode === "scene3d" && !sceneError;
    /* v5.1: على الجوال تبقى طبقة SVG عند 20% (كما v4) بينما طبقة 3D أوضح (40%) */ const svgOpacity = showScene ? "opacity-0" : faint ? "opacity-20" : "opacity-100";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: wrapRef,
        className: `relative ${className}`,
        "aria-hidden": "true",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `h-full w-full transition-opacity duration-[1400ms] ease-out ${svgOpacity}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$knowledge$2d$orbit$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KnowledgeOrbit"], {
                    className: "h-full w-full"
                }, void 0, false, {
                    fileName: "[project]/src/components/hero-visual.tsx",
                    lineNumber: 104,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/hero-visual.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            showScene && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `animate-scene-in absolute inset-0 ${faint ? "opacity-35" : "opacity-100"}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PearlScene, {
                    theme: resolvedTheme === "light" ? "light" : "dark",
                    mobile: mobile,
                    paused: paused
                }, void 0, false, {
                    fileName: "[project]/src/components/hero-visual.tsx",
                    lineNumber: 114,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/hero-visual.tsx",
                lineNumber: 109,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/hero-visual.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_s(HeroVisual, "1aajrAZ0gON9tnx4wP/evq7aCu0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c1 = HeroVisual;
var _c, _c1;
__turbopack_context__.k.register(_c, "PearlScene");
__turbopack_context__.k.register(_c1, "HeroVisual");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/product-showcase.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductShowcase",
    ()=>ProductShowcase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/* ============================================================
   عرض المنتجات الرائد (v4) — «منتج كتحفة على مسرح»
   ------------------------------------------------------------
   دروس مرجع عرض المنتجات (Jacket Masters) معرّبة RTL:
   · بطاقة سينمائية 16:10 بنصف قطر 28px وحدّ شعري وظل متعدد الطبقات
   · تقسيم غير متماثل: معلومات 45% (يمين RTL) + فيجوال حي 55%
   · كبسولات تبديل — الفعّل مقلوب (ذهبي) كما في المرجع
   · فيزياء الانتقال: خروج +30% مع 0.92 حجم (300ms) / دخول من -30%
     مع 1.04→1 (450ms) على cubic-bezier(0.25,1,0.5,1)
   · هالة محيطية ديناميكية تتلوّن حسب المنتج (ذهبي/زمردي)
   · «المنتج» هنا خدمة: مجاز تجريدي حي بدل صورة — شعاع ATS / رادار أصالة
   · تسعير صادق: لا خصومات وهمية — بنية قيمة واضحة
   ============================================================ */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SearchCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search-check.js [app-client] (ecmascript) <export default as SearchCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$platform$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/platform-data.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
/* ---------- إعداد لكل منتج (بصري + قيمة صادقة) ---------- */ const SHOWCASE = {
    "cv-builder": {
        visual: "cv",
        eyebrow: "PRODUCT 01",
        valueChips: [
            "مجاني بالكامل",
            "بدون تسجيل",
            "تصدير PDF فوري"
        ],
        microTrust: "متوافق مع أنظمة التتبع الآلي ATS",
        footnote: "ابدأ مباشرة — لا تحتاج حساباً"
    },
    "plagiarism-check": {
        visual: "radar",
        eyebrow: "PRODUCT 02",
        valueChips: [
            "تسعير حسب نطاق الفحص",
            "تقرير مفصل",
            "إعادة صياغة عند الطلب"
        ],
        microTrust: "بصيغة مهنية — دون وعود بنسب مسبقة",
        footnote: "أرسل مستندك واحصل على خطة فحص واضحة"
    }
};
const EASE_SWIFT = [
    0.25,
    1,
    0.5,
    1
];
const panelVariants = {
    enter: (dir)=>({
            x: dir * -36,
            opacity: 0,
            scale: 0.96
        }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1
    },
    exit: (dir)=>({
            x: dir * 36,
            opacity: 0,
            scale: 0.92
        })
};
/* ---------- الفيجوال 1: وثيقة سيرة مع شعاع مسح ATS ---------- */ function CvVisual() {
    const lines = [
        "w-11/12",
        "w-full",
        "w-9/12",
        "w-10/12",
        "w-8/12",
        "w-11/12",
        "w-7/12",
        "w-9/12"
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-44 overflow-hidden rounded-xl bg-[#fffdf6] p-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/5 sm:w-52 sm:p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "size-9 rounded-full bg-gradient-to-br from-[#e8d48b] to-[#c5a059]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/product-showcase.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex-1 space-y-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "block h-2 w-3/4 rounded-full bg-[#0a231b]/70"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/product-showcase.tsx",
                                        lineNumber: 88,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "block h-1.5 w-1/2 rounded-full bg-[#0a231b]/25"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/product-showcase.tsx",
                                        lineNumber: 89,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/product-showcase.tsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/product-showcase.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-5 space-y-2.5",
                        children: lines.map((w, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("ats-line block h-1.5 rounded-full bg-[#0a231b]/20", w, i === 3 || i === 6 ? "bg-[#c5a059]/50" : undefined),
                                style: {
                                    animationDelay: `${i * 0.18}s`
                                }
                            }, i, false, {
                                fileName: "[project]/src/components/product-showcase.tsx",
                                lineNumber: 95,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/product-showcase.tsx",
                        lineNumber: 93,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ats-scan pointer-events-none absolute inset-x-0 top-0 h-9 bg-gradient-to-b from-[#e8d48b]/0 via-[#e8d48b]/40 to-[#e8d48b]/0",
                        "aria-hidden": "true",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "absolute inset-x-0 bottom-0 h-px bg-[#c5a059]"
                        }, void 0, false, {
                            fileName: "[project]/src/components/product-showcase.tsx",
                            lineNumber: 111,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/product-showcase.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/product-showcase.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "float-chip absolute -right-8 top-3 rounded-full border border-gold/40 bg-[#0d1613]/90 px-3.5 py-1.5 text-[10px] font-bold text-gold shadow-lg backdrop-blur",
                dir: "ltr",
                children: "ATS ✓ PASSED"
            }, void 0, false, {
                fileName: "[project]/src/components/product-showcase.tsx",
                lineNumber: 116,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "float-chip float-chip-2 absolute -left-6 bottom-6 rounded-full border border-primary/40 bg-[#0d1613]/90 px-3.5 py-1.5 text-[10px] font-bold text-primary shadow-lg backdrop-blur",
                dir: "ltr",
                children: "PDF · READY"
            }, void 0, false, {
                fileName: "[project]/src/components/product-showcase.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/product-showcase.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
}
_c = CvVisual;
/* ---------- الفيجوال 2: رادار فحص الأصالة فوق الوثيقة ---------- */ function RadarVisual() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute -left-10 -top-8 size-32 rounded-full border border-primary/35 bg-[#0d1613]/60 backdrop-blur-sm sm:size-36",
                "aria-hidden": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-3 rounded-full border border-primary/20"
                    }, void 0, false, {
                        fileName: "[project]/src/components/product-showcase.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-8 rounded-full border border-primary/15"
                    }, void 0, false, {
                        fileName: "[project]/src/components/product-showcase.tsx",
                        lineNumber: 133,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "plag-radar absolute inset-3 rounded-full bg-[conic-gradient(from_0deg,rgba(46,211,154,0.4),transparent_70deg)]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/product-showcase.tsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "plag-hit absolute left-6 top-8 size-2 rounded-full bg-gold-bright shadow-[0_0_8px_2px_rgba(232,212,139,0.5)]",
                        style: {
                            animationDelay: "-0.4s"
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/product-showcase.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "plag-hit absolute left-16 top-14 size-1.5 rounded-full bg-primary shadow-[0_0_6px_2px_rgba(46,211,154,0.5)]",
                        style: {
                            animationDelay: "-1.6s"
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/product-showcase.tsx",
                        lineNumber: 136,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/product-showcase.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-44 rotate-[2.5deg] rounded-xl bg-[#fffdf6] p-5 pt-7 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/5 sm:w-52 sm:p-6 sm:pt-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2.5",
                        children: [
                            "w-10/12",
                            "w-full",
                            "w-8/12",
                            "w-full",
                            "w-9/12"
                        ].map((w, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("block h-1.5 rounded-full bg-[#0a231b]/20", w)
                            }, i, false, {
                                fileName: "[project]/src/components/product-showcase.tsx",
                                lineNumber: 143,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/product-showcase.tsx",
                        lineNumber: 141,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 space-y-2.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "plag-hit block h-2 w-11/12 rounded bg-gold/30 ring-1 ring-gold/50"
                            }, void 0, false, {
                                fileName: "[project]/src/components/product-showcase.tsx",
                                lineNumber: 148,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "plag-hit block h-2 w-3/5 rounded bg-primary/25 ring-1 ring-primary/40",
                                style: {
                                    animationDelay: "-1.2s"
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/product-showcase.tsx",
                                lineNumber: 149,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "plag-hit block h-2 w-4/5 rounded bg-gold/20 ring-1 ring-gold/40",
                                style: {
                                    animationDelay: "-2.3s"
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/product-showcase.tsx",
                                lineNumber: 150,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/product-showcase.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute -top-3 right-5 rounded-full bg-gradient-to-l from-gold-bright to-gold px-3 py-1 text-[9px] font-black text-[#241a08] shadow-md",
                        dir: "ltr",
                        children: "REVIEWED"
                    }, void 0, false, {
                        fileName: "[project]/src/components/product-showcase.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/product-showcase.tsx",
                lineNumber: 140,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "float-chip absolute -bottom-5 right-2 rounded-full border border-primary/40 bg-[#0d1613]/90 px-3.5 py-1.5 text-[10px] font-bold text-primary shadow-lg backdrop-blur",
                children: "توثيق ومراجعة"
            }, void 0, false, {
                fileName: "[project]/src/components/product-showcase.tsx",
                lineNumber: 159,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/product-showcase.tsx",
        lineNumber: 129,
        columnNumber: 5
    }, this);
}
_c1 = RadarVisual;
function ProductShowcase() {
    _s();
    const [active, setActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [dir, setDir] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const product = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$platform$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCTS"][active];
    const config = SHOWCASE[product.slug];
    const go = (next, direction)=>{
        if (next === active) return;
        setDir(direction);
        setActive((next + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$platform$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCTS"].length) % __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$platform$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCTS"].length);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mt-14",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-8 flex items-center justify-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        role: "tablist",
                        "aria-label": "تبديل المنتجات",
                        className: "flex gap-1 rounded-full border border-border bg-card/70 p-1 backdrop-blur",
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$platform$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCTS"].map((p, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                role: "tab",
                                "aria-selected": i === active,
                                "aria-controls": "product-panel",
                                onClick: ()=>go(i, i > active ? 1 : -1),
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("btn-lift rounded-full px-4 py-2 text-sm font-bold transition-colors sm:px-6", i === active ? "bg-gradient-to-l from-gold-bright to-gold text-[#241a08] shadow-[0_4px_16px_-6px_rgba(197,160,89,0.6)]" : "text-muted-foreground hover:bg-gold-soft hover:text-foreground"),
                                children: p.name
                            }, p.slug, false, {
                                fileName: "[project]/src/components/product-showcase.tsx",
                                lineNumber: 185,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/product-showcase.tsx",
                        lineNumber: 183,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>go(active + 1, 1),
                                "aria-label": "المنتج التالي",
                                className: "btn-lift flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                    className: "size-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/product-showcase.tsx",
                                    lineNumber: 209,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/product-showcase.tsx",
                                lineNumber: 204,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>go(active - 1, -1),
                                "aria-label": "المنتج السابق",
                                className: "btn-lift flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold/50 hover:text-gold",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                    className: "size-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/product-showcase.tsx",
                                    lineNumber: 216,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/product-showcase.tsx",
                                lineNumber: 211,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/product-showcase.tsx",
                        lineNumber: 203,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/product-showcase.tsx",
                lineNumber: 182,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        mode: "wait",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0
                            },
                            animate: {
                                opacity: 1
                            },
                            exit: {
                                opacity: 0
                            },
                            transition: {
                                duration: 0.65
                            },
                            "aria-hidden": "true",
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute -inset-x-8 -top-16 bottom-0 -z-10 rounded-full blur-[110px]", product.slug === "cv-builder" ? "bg-gold/[0.13]" : "bg-primary/[0.15]")
                        }, `orb-${product.slug}`, false, {
                            fileName: "[project]/src/components/product-showcase.tsx",
                            lineNumber: 225,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/product-showcase.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        mode: "wait",
                        custom: dir,
                        initial: false,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            id: "product-panel",
                            role: "tabpanel",
                            "aria-label": product.name,
                            custom: dir,
                            variants: panelVariants,
                            initial: "enter",
                            animate: "center",
                            exit: "exit",
                            transition: {
                                x: {
                                    duration: 0.45,
                                    ease: EASE_SWIFT
                                },
                                opacity: {
                                    duration: 0.28
                                },
                                scale: {
                                    duration: 0.45,
                                    ease: EASE_SWIFT
                                }
                            },
                            drag: "x",
                            dragConstraints: {
                                left: 0,
                                right: 0
                            },
                            dragElastic: 0.18,
                            onDragEnd: (_, info)=>{
                                if (info.offset.x < -60) go(active + 1, 1);
                                else if (info.offset.x > 60) go(active - 1, -1);
                            },
                            className: "relative overflow-hidden rounded-[1.75rem] border border-border bg-card/70 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.5)] backdrop-blur-xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid lg:grid-cols-[0.95fr_1.05fr]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "order-2 flex flex-col p-7 sm:p-10 lg:order-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mono-chip text-[10px] text-gold/80",
                                                    dir: "ltr",
                                                    children: config.eyebrow
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/product-showcase.tsx",
                                                    lineNumber: 269,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-4 flex items-center gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "flex size-12 items-center justify-center rounded-xl border border-gold/25 bg-gold-soft text-gold",
                                                            children: product.slug === "cv-builder" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                className: "size-6",
                                                                strokeWidth: 1.6
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/product-showcase.tsx",
                                                                lineNumber: 275,
                                                                columnNumber: 23
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SearchCheck$3e$__["SearchCheck"], {
                                                                className: "size-6",
                                                                strokeWidth: 1.6
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/product-showcase.tsx",
                                                                lineNumber: 277,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/product-showcase.tsx",
                                                            lineNumber: 273,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "font-display text-2xl font-bold leading-tight",
                                                                    children: product.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/product-showcase.tsx",
                                                                    lineNumber: 281,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "font-serif-accent text-base text-gold",
                                                                    children: product.tagline
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/product-showcase.tsx",
                                                                    lineNumber: 284,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/product-showcase.tsx",
                                                            lineNumber: 280,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/product-showcase.tsx",
                                                    lineNumber: 272,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-5 text-sm leading-8 text-muted-foreground",
                                                    children: product.description
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/product-showcase.tsx",
                                                    lineNumber: 290,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2",
                                                    children: product.points.map((pt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            className: "flex items-center gap-2 text-xs leading-6 text-muted-foreground",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                    className: "size-4 shrink-0 text-primary"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/product-showcase.tsx",
                                                                    lineNumber: 297,
                                                                    columnNumber: 23
                                                                }, this),
                                                                pt
                                                            ]
                                                        }, pt, true, {
                                                            fileName: "[project]/src/components/product-showcase.tsx",
                                                            lineNumber: 296,
                                                            columnNumber: 21
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/product-showcase.tsx",
                                                    lineNumber: 294,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-6 flex flex-wrap items-center gap-2 border-t border-border/60 pt-5",
                                                    children: config.valueChips.map((chip, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-full px-3 py-1.5 text-[11px] font-bold", i === 0 ? "border border-gold/40 bg-gold-soft text-gold" : "border border-border bg-secondary text-muted-foreground"),
                                                            children: chip
                                                        }, chip, false, {
                                                            fileName: "[project]/src/components/product-showcase.tsx",
                                                            lineNumber: 306,
                                                            columnNumber: 21
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/product-showcase.tsx",
                                                    lineNumber: 304,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-7 flex flex-col gap-3 sm:flex-row sm:items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                            asChild: true,
                                                            className: "btn-lift shine h-12 rounded-full border border-gold/40 bg-gradient-to-l from-gold-bright to-gold px-7 text-base font-bold text-[#241a08] shadow-[0_10px_40px_-10px_rgba(197,160,89,0.55)]",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                href: product.slug === "cv-builder" ? "/cv-builder" : "/plagiarism-check",
                                                                "data-cursor": true,
                                                                children: [
                                                                    product.cta,
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                                                        className: "size-5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/product-showcase.tsx",
                                                                        lineNumber: 330,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/product-showcase.tsx",
                                                                lineNumber: 325,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/product-showcase.tsx",
                                                            lineNumber: 321,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[11px] leading-5 text-muted-foreground/80",
                                                            children: config.footnote
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/product-showcase.tsx",
                                                            lineNumber: 333,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/product-showcase.tsx",
                                                    lineNumber: 320,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/product-showcase.tsx",
                                            lineNumber: 268,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative order-1 flex min-h-[21rem] items-center justify-center overflow-hidden border-border/60 p-8 sm:min-h-[24rem] lg:order-2 lg:border-inline-start", product.slug === "cv-builder" ? "bg-[radial-gradient(ellipse_at_center,rgba(197,160,89,0.09),transparent_65%)]" : "bg-[radial-gradient(ellipse_at_center,rgba(22,163,122,0.10),transparent_65%)]"),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid-overlay absolute inset-0",
                                                    "aria-hidden": "true"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/product-showcase.tsx",
                                                    lineNumber: 349,
                                                    columnNumber: 17
                                                }, this),
                                                config.visual === "cv" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CvVisual, {}, void 0, false, {
                                                    fileName: "[project]/src/components/product-showcase.tsx",
                                                    lineNumber: 350,
                                                    columnNumber: 43
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RadarVisual, {}, void 0, false, {
                                                    fileName: "[project]/src/components/product-showcase.tsx",
                                                    lineNumber: 350,
                                                    columnNumber: 58
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/product-showcase.tsx",
                                            lineNumber: 340,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/product-showcase.tsx",
                                    lineNumber: 266,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2.5 border-t border-border/60 bg-background/40 px-7 py-3.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                            className: "size-3.5 shrink-0 text-gold"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/product-showcase.tsx",
                                            lineNumber: 356,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] text-muted-foreground",
                                            children: config.microTrust
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/product-showcase.tsx",
                                            lineNumber: 357,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "mono-chip ms-auto hidden text-[9px] text-muted-foreground/60 sm:block",
                                            dir: "ltr",
                                            children: product.slug === "cv-builder" ? "CV · BUILDER" : "ORIGINALITY · CHECK"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/product-showcase.tsx",
                                            lineNumber: 358,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/product-showcase.tsx",
                                    lineNumber: 355,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, product.slug, true, {
                            fileName: "[project]/src/components/product-showcase.tsx",
                            lineNumber: 242,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/product-showcase.tsx",
                        lineNumber: 241,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/product-showcase.tsx",
                lineNumber: 222,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/product-showcase.tsx",
        lineNumber: 180,
        columnNumber: 5
    }, this);
}
_s(ProductShowcase, "JxuD+67vKViL2Pua1H9KjW1Rmg8=");
_c2 = ProductShowcase;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "CvVisual");
__turbopack_context__.k.register(_c1, "RadarVisual");
__turbopack_context__.k.register(_c2, "ProductShowcase");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_57bd2f12._.js.map