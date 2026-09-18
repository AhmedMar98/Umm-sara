"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, MessageCircle, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollProgress } from "@/components/scroll-progress";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/platform-data";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/services", label: "الخدمات" },
  { href: "/cv-builder", label: "بنّاء السيرة" },
  { href: "/plagiarism-check", label: "فحص الأصالة" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
];

export function LogoMark({ size = 38 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="24"
        y="3"
        width="29.4"
        height="29.4"
        rx="6"
        transform="rotate(45 24 3)"
        stroke="url(#g1)"
        strokeWidth="2.4"
      />
      <rect
        x="24"
        y="12.5"
        width="16.2"
        height="16.2"
        rx="4"
        transform="rotate(45 24 12.5)"
        stroke="#c5a059"
        strokeWidth="1.6"
        opacity="0.85"
      />
      <circle cx="24" cy="24" r="3.4" fill="#2ed39a" />
      <defs>
        <linearGradient id="g1" x1="8" y1="8" x2="40" y2="40">
          <stop stopColor="#e8d48b" />
          <stop offset="0.5" stopColor="#c5a059" />
          <stop offset="1" stopColor="#2ed39a" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="تبديل السمة"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="rounded-full"
    >
      <Sun className="size-[18px] hidden dark:block" />
      <Moon className="size-[18px] dark:hidden" />
    </Button>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold/10 bg-background/70 backdrop-blur-xl">
      {/* خط شعري ذهبي أسفل الشريط (نمط الفخامة الهادئة) */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-gold/40 to-transparent"
        aria-hidden="true"
      />
      {/* خط تقدم القراءة — شعرة ذهبية تنمو مع التمرير (v3) */}
      <ScrollProgress />
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* الشعار */}
        <Link href="/" className="group flex items-center gap-2.5 transition-transform duration-300 hover:scale-[1.02]" aria-label="أم سارة — الرئيسية" data-cursor>
          <LogoMark />
          <span className="flex flex-col leading-none">
            <span className="font-serif-accent text-2xl text-foreground">
              أم سارة
            </span>
            <span className="mono-chip text-[8px] text-muted-foreground">
              ACADEMIC · RESEARCH
            </span>
          </span>
        </Link>

        {/* روابط سطح المكتب — كشف خط سفلي عند التحويم */}
        <nav
          aria-label="التنقل الرئيسي"
          className="hidden items-center gap-1 lg:flex"
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "group relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-300 hover:text-gold",
                pathname === l.href
                  ? "text-gold"
                  : "text-muted-foreground"
              )}
            >
              {l.label}
              <span
                className={cn(
                  "absolute inset-x-3 -bottom-0.5 h-px origin-center bg-gradient-to-l from-transparent via-gold to-transparent transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
                  pathname === l.href
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                )}
                aria-hidden="true"
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden rounded-full border-gold/40 text-gold hover:bg-gold-soft hover:text-gold sm:inline-flex"
          >
            <Link href="/consultation">
              <CalendarClock className="size-4" />
              احجز استشارة
            </Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="hidden rounded-full sm:inline-flex"
          >
            <a
              href={whatsappLink("السلام عليكم، أود الاستفسار عن خدمات منصة أم سارة الأكاديمية.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" />
              واتساب
            </a>
          </Button>

          {/* قائمة الجوال */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="فتح القائمة"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="flex items-center gap-2 border-b pb-4 font-display text-lg font-bold">
                <LogoMark size={30} />
                أم سارة
              </SheetTitle>
              <nav className="mt-4 flex flex-col gap-1" aria-label="قائمة الجوال">
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      pathname === l.href
                        ? "bg-accent text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  href="/consultation"
                  onClick={() => setOpen(false)}
                  className="mt-3 rounded-lg px-3 py-2.5 text-center text-sm font-bold text-gold ring-gold"
                >
                  احجز استشارة مجانية
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
