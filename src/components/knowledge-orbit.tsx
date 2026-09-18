import { LogoConstruction } from "@/components/brand/logo-construction";

/**
 * مدار المعرفة — المرساة البصرية للهيرو (نمط الفيديوهات المرجعية:
 * مجاز تجريدي لـ «مسار المعالجة» بدل الصور الجاهزة).
 * SVG خالص + حركات CSS، دوران بطيء جداً متعاكس الحلقات،
 * عقد متوهجة ذهبية/زمردية، وقلب المدار: بناء الشعار الحي (v4).
 * prefers-reduced-motion: الحلقات ثابتة والشعار يظهر مكتملاً.
 */
export function KnowledgeOrbit({ className = "" }: { className?: string }) {
  return (
    <div className={`knowledge-orbit ${className}`} aria-hidden="true">
      <svg viewBox="0 0 600 600" fill="none" className="h-full w-full">
        <defs>
          <radialGradient id="orbit-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#16a37a" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#16a37a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="orbit-ring-a" x1="0" y1="0" x2="600" y2="600">
            <stop offset="0%" stopColor="#e8d48b" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#2ed39a" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* هالة مركزية */}
        <circle cx="300" cy="300" r="230" fill="url(#orbit-glow)" />

        {/* الحلقة الخارجية — تدور ببطء مع عقارب الساعة */}
        <g className="orbit-spin-slow">
          <circle
            cx="300" cy="300" r="252"
            stroke="url(#orbit-ring-a)"
            strokeWidth="1.2"
            strokeDasharray="3 9"
          />
          {/* عقد الحلقة الخارجية */}
          <circle cx="300" cy="48" r="6" fill="#e8d48b" className="orbit-node" />
          <circle cx="524" cy="428" r="4.5" fill="#2ed39a" className="orbit-node orbit-node-dim" />
          <circle cx="76" cy="428" r="5" fill="#c5a059" className="orbit-node" />
        </g>

        {/* الحلقة الوسطى — عكس اتجاه الساعة */}
        <g className="orbit-spin-rev">
          <circle
            cx="300" cy="300" r="186"
            stroke="#c5a059"
            strokeOpacity="0.42"
            strokeWidth="1"
            strokeDasharray="1 12"
          />
          <circle cx="300" cy="114" r="4.5" fill="#2ed39a" className="orbit-node" />
          <circle cx="462" cy="394" r="3.5" fill="#e8d48b" className="orbit-node orbit-node-dim" />
          <circle cx="138" cy="394" r="3.5" fill="#c5a059" className="orbit-node orbit-node-dim" />
        </g>

        {/* الحلقة الداخلية — سريعة نسبياً */}
        <g className="orbit-spin-fast">
          <circle
            cx="300" cy="300" r="122"
            stroke="#2ed39a"
            strokeOpacity="0.32"
            strokeWidth="1"
            strokeDasharray="2 7"
          />
          <circle cx="422" cy="300" r="3.5" fill="#e8d48b" className="orbit-node" />
          <circle cx="178" cy="300" r="3" fill="#2ed39a" className="orbit-node orbit-node-dim" />
        </g>

        {/* قوس زخرفي ثابت */}
        <path
          d="M 300 118 A 182 182 0 0 1 458 210"
          stroke="#c5a059"
          strokeOpacity="0.4"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M 300 482 A 182 182 0 0 1 142 390"
          stroke="#2ed39a"
          strokeOpacity="0.25"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* القلب المركزي — بناء الشعار الحي: يُرسم القوس وتحطّ اللؤلؤة عند التحميل */}
        <g>
          <circle cx="300" cy="300" r="86" fill="#0d1613" fillOpacity="0.7" />
          <circle cx="300" cy="300" r="86" stroke="#c5a059" strokeOpacity="0.45" strokeWidth="1" />
          <circle cx="300" cy="300" r="76" stroke="#c5a059" strokeOpacity="0.18" strokeWidth="1" />
          <foreignObject x="256" y="256" width="88" height="88">
            <div className="flex h-full w-full items-center justify-center">
              <LogoConstruction size={56} />
            </div>
          </foreignObject>
        </g>

        {/* تسميات mono تقنية */}
        <text x="300" y="26" textAnchor="middle" className="orbit-label" fill="#8ba297" fontSize="10" letterSpacing="3" fontFamily="var(--font-plex-mono), monospace">
          KNOWLEDGE · ORBIT
        </text>
        <text x="300" y="586" textAnchor="middle" className="orbit-label" fill="#8ba297" fontSize="10" letterSpacing="3" fontFamily="var(--font-plex-mono), monospace">
          RESEARCH · EXCELLENCE
        </text>
      </svg>
    </div>
  );
}
