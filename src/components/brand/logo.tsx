/* ============================================================
   علامة «أم سارة» — قوس المعرفة واللؤلؤة (v4)
   ------------------------------------------------------------
   المفهوم: قوس/محراب مفتوح يرمز للأمّ الحاضنة والكتاب المفتوح،
   تحتضن لؤلؤة (نقطة المعرفة)، وتحتها كاشدة توقيع أفقية.
   دروس مرجع RUNAQ: خط قاعدي معماري، فراغ سلبي ذو معنى،
   صمت أحادي اللون، توقيع-كاشدة. النسب: قوس 40×35 على شبكة 64.
   ============================================================ */

/** الأشكال الهندسية المشتركة — viewBox 0 0 64 64 */
export const ARCH_PATH = "M 52 46.5 C 52 29.5 43.5 17 32 11.5 C 20.5 17 12 29.5 12 46.5";
/* تبدأ من اليمين — لتُرسم باتجاه القراءة RTL عند التحريك */
export const KASHIDA_PATH = "M 55 54 Q 32 58.5 9 54";

/* ---------- 1) الرمز المفرد (Symbol / Mark) ----------
   القوس والكاشدة بـ currentColor (يتكيف مع السمة)،
   اللؤلؤة ذهبية ثابتة — الجوهرة تحتفظ بلونها على أي خلفية. */
export function LogoMark({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="شعار أم سارة"
      className={className}
    >
      {/* الكاشدة — خط التوقيع الأفقي (مهد يحتضن القوس) */}
      <path
        d={KASHIDA_PATH}
        stroke="currentColor"
        strokeOpacity={0.75}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      {/* القوس — كتاب مفتوح / محراب / حضن الأم */}
      <path
        d={ARCH_PATH}
        stroke="currentColor"
        strokeWidth={3.4}
        strokeLinecap="round"
      />
      {/* اللؤلؤة — نقطة المعرفة (جوهرة بلونين مسطحين: حافة ثم لمعان) */}
      <circle className="logo-pearl" cx={32} cy={30.5} r={5.2} fill="#c5a059" />
      <circle cx={30.2} cy={28.7} r={1.7} fill="#f4e9c8" opacity={0.9} />
    </svg>
  );
}

/* ---------- 2) الكلمة (Wordmark) ---------- */
export function LogoWordmark({
  className = "",
  latin = true,
}: {
  className?: string;
  latin?: boolean;
}) {
  return (
    <span className={`flex flex-col leading-none ${className}`}>
      <span className="font-serif-accent text-2xl text-foreground">أم سارة</span>
      {latin && (
        <span
          className="font-serif-accent mt-1.5 text-[9px] font-medium tracking-[0.38em] text-muted-foreground"
          dir="ltr"
        >
          UMM SARA
        </span>
      )}
    </span>
  );
}

/* ---------- 3) التكوين الأفقي (Combined — شريط علوي) ---------- */
export function LogoFull({
  size = 40,
  markClassName = "text-gold",
}: {
  size?: number;
  markClassName?: string;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <span className={markClassName}>
        <LogoMark size={size} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-serif-accent text-2xl text-foreground">أم سارة</span>
        <span
          className="font-serif-accent mt-1.5 text-[9px] font-medium tracking-[0.38em] text-muted-foreground"
          dir="ltr"
        >
          UMM SARA
        </span>
      </span>
    </span>
  );
}

/* ---------- 4) التكوين الرأسي المركّز (Stacked — فوتر/ترويسات) ---------- */
export function LogoStacked({
  size = 48,
  markClassName = "text-gold",
  className = "",
}: {
  size?: number;
  markClassName?: string;
  className?: string;
}) {
  return (
    <span className={`flex flex-col items-center text-center ${className}`}>
      <span className={markClassName}>
        <LogoMark size={size} />
      </span>
      <span className="font-serif-accent mt-3 text-2xl leading-none text-foreground">
        أم سارة
      </span>
      {/* قاعدة لاتينية أضيق من العرض البصري — أثر البيدستال (درس RUNAQ) */}
      <span
        className="font-serif-accent mt-2 text-[9px] font-medium tracking-[0.42em] text-muted-foreground"
        dir="ltr"
      >
        UMM SARA
      </span>
    </span>
  );
}
