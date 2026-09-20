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
   ============================================================ */

import { ARCH_PATH, KASHIDA_PATH } from "@/components/brand/logo";

export function LogoConstruction({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="text-gold"
    >
      <g className="logo-construct">
        {/* 1) دليل القياس — شعرة باهتة تحت مستوى الأقدام ثم تتلاشى */}
        <line
          className="logo-guide"
          x1={58}
          y1={52}
          x2={6}
          y2={52}
          pathLength={1}
          stroke="currentColor"
          strokeOpacity={0.28}
          strokeWidth={0.9}
          strokeDasharray="1"
          strokeDashoffset={1}
        />

        {/* 4) الكاشدة — توقيع أفقي (زمن متأخر) */}
        <path
          className="logo-kashida"
          d={KASHIDA_PATH}
          pathLength={1}
          stroke="currentColor"
          strokeOpacity={0.75}
          strokeWidth={2.5}
          strokeLinecap="round"
        />

        {/* 2) القوس — كتابة متصلة، تبدأ من اليمين (RTL) */}
        <path
          className="logo-arch"
          d={ARCH_PATH}
          pathLength={1}
          stroke="currentColor"
          strokeWidth={3.4}
          strokeLinecap="round"
        />

        {/* 3) توهج اللؤلؤة — طبقة ضوء متأخرة تحت الجوهرة */}
        <circle className="logo-pearl-glow" cx={32} cy={30.5} r={9} fill="#e8d48b" opacity={0} />

        {/* 3) اللؤلؤة — تحطّ وتستقر */}
        <g className="logo-pearl">
          <circle cx={32} cy={30.5} r={5.2} fill="#c5a059" />
          <circle cx={30.2} cy={28.7} r={1.7} fill="#f4e9c8" opacity={0.9} />
        </g>
      </g>
    </svg>
  );
}
