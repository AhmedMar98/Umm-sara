"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, MessageCircle, CalendarClock, ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollProgress } from "@/components/scroll-progress";
import { LogoMark } from "@/components/brand/logo";
import { CartDrawer } from "@/components/cart-drawer";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/platform-data";
import { useCart } from "@/lib/cart";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/services", label: "الخدمات" },
  { href: "/works", label: "معرض الأعمال" },
  { href: "/cv-builder", label: "بنّاء السيرة" },
  { href: "/plagiarism-check", label: "فحص الأصالة" },
  { href: "/about", label: "من نحن" },
  { href: "/contact", label: "تواصل معنا" },
];

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

/** V10.1 — زر السلة بشارة عدد (الدرس 3): يظهر عند وجود عناصر فقط */
function CartButton() {
  const { count, setOpen, ready } = useCart();
  if (!ready || count === 0) return null;
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setOpen(true)}
      aria-label={`عرض سلة الطلبات — ${count} ${count === 1 ? "خدمة" : "خدمات"}`}
      className="relative rounded-full border-primary/40 text-primary hover:bg-accent hover:text-primary"
    >
      <ShoppingBasket className="size-[18px]" />
      <span
        className="absolute -top-1.5 -end-1.5 flex min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-black text-[#241a08] shadow-sm"
        dir="ltr"
        aria-hidden="true"
      >
        {count > 9 ? "9+" : count}
      </span>
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
        {/* الشعار — نبضة لؤلؤة عند التحويم (v4) */}
        <Link
          href="/"
          className="group btn-lift flex items-center gap-2.5 rounded-xl"
          aria-label="أم سارة — الرئيسية"
          data-cursor
        >
          <span className="logo-hover-pulse text-gold">
            <LogoMark size={38} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif-accent text-2xl text-foreground">
              أم سارة
            </span>
            <span
              className="font-serif-accent mt-1.5 text-[8px] font-medium tracking-[0.32em] text-muted-foreground"
              dir="ltr"
            >
              UMM SARA
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
          <CartButton />
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
      {/* V10.1 — درج السلة (الدرس 3): مثبت واحد على مستوى الشريط */}
      <CartDrawer />
    </header>
  );
}
