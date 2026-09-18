import Link from "next/link";
import { MessageCircle, Mail, Clock } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { CATEGORIES, whatsappLink, PLATFORM_NAME } from "@/lib/platform-data";

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-border bg-background">
      {/* توهج ختامي خفيف أعلى الفوتر */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-glow/10 to-transparent"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-12">
          {/* العلامة — تكوين أفقي بشعار القوس واللؤلؤة */}
          <div className="md:col-span-5">
            <div className="logo-hover-pulse flex items-center gap-2.5">
              <span className="text-gold">
                <LogoMark size={38} />
              </span>
              <div className="leading-none">
                <p className="font-serif-accent text-2xl">{PLATFORM_NAME}</p>
                <p
                  className="font-serif-accent mt-1.5 text-[8px] font-medium tracking-[0.32em] text-muted-foreground"
                  dir="ltr"
                >
                  UMM SARA
                </p>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
              منصة سعودية متخصصة في الخدمات الأكاديمية والبحثية — من البحث
              الجامعي إلى رسائل الدكتوراه، بمعايير علمية صارمة وشفافية كاملة.
            </p>
            <div className="mt-5 flex flex-col gap-2.5 text-sm text-muted-foreground">
              <a
                href={whatsappLink("السلام عليكم، لدي استفسار.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-primary"
              >
                <MessageCircle className="size-4 text-primary" />
                <span dir="ltr" className="font-mono">+966 50 000 0000</span>
              </a>
              <span className="inline-flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                <span dir="ltr" className="font-mono">info@ummsarah.sa</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="size-4 text-primary" />
                الأحد — الخميس · 9 صباحاً — 11 مساءً
              </span>
            </div>
          </div>

          {/* الأقسام */}
          <nav className="md:col-span-3" aria-label="أقسام الخدمات">
            <h3 className="mb-4 font-display text-sm font-bold tracking-wide text-foreground">
              الأقسام
            </h3>
            <ul className="grid gap-2.5 text-sm text-muted-foreground">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/services/${c.slug}`}
                    className="transition-colors hover:text-primary"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* روابط سريعة */}
          <nav className="md:col-span-4" aria-label="روابط سريعة">
            <h3 className="mb-4 font-display text-sm font-bold tracking-wide text-foreground">
              روابط سريعة
            </h3>
            <ul className="grid grid-cols-2 gap-2.5 text-sm text-muted-foreground">
              <li><Link href="/services" className="transition-colors hover:text-primary">كل الخدمات</Link></li>
              <li><Link href="/cv-builder" className="transition-colors hover:text-primary">بنّاء السيرة</Link></li>
              <li><Link href="/plagiarism-check" className="transition-colors hover:text-primary">فحص الأصالة</Link></li>
              <li><Link href="/consultation" className="transition-colors hover:text-primary">حجز استشارة</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-primary">من نحن</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-primary">تواصل معنا</Link></li>
            </ul>
            <div className="frame-inset mt-6 rounded-xl border border-border bg-card p-4">
              <p className="font-display text-sm font-semibold">جاهز لتبدأ؟</p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                استشارتك الأولى مجانية — أخبرنا عن مشروعك ونقترح المسار الأمثل.
              </p>
              <Link
                href="/consultation"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors hover:text-gold"
              >
                احجز موعدك ←
              </Link>
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-gold/10 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} منصة {PLATFORM_NAME} — جميع الحقوق محفوظة.</p>
          <p className="mono-chip text-[9px]" dir="ltr">
            MADE IN KSA · NEXT.JS · SUPABASE
          </p>
        </div>
      </div>
    </footer>
  );
}
