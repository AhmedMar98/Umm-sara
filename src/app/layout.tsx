import type { Metadata, Viewport } from "next";
import { Cairo, IBM_Plex_Sans_Arabic, IBM_Plex_Mono, Amiri } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FilmGrain } from "@/components/film-grain";
import { CursorGlow } from "@/components/cursor-glow";
import { SmoothScroll } from "@/components/smooth-scroll";

/* v3 — خفض أوزان الخطوط (أداء LCP): 16 ملفاً → 11 ملفاً */
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["700", "800", "900"],
  variable: "--font-cairo",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-arabic",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

export const metadata: Metadata = {
  title: {
    default: "أم سارة | منصة الخدمات الأكاديمية والبحثية",
    template: "%s | أم سارة",
  },
  description:
    "منصة سعودية متخصصة في الخدمات الأكاديمية والبحثية: الأبحاث، الرسائل العلمية، التحليل الإحصائي، مشاريع التخرج، بناء السيرة الذاتية، وفحص الأصالة الأكاديمية.",
  keywords: [
    "خدمات أكاديمية",
    "أبحاث جامعية",
    "رسائل ماجستير",
    "تحليل إحصائي",
    "CV Builder",
    "فحص أصالة",
    "السعودية",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "أم سارة | منصة الخدمات الأكاديمية والبحثية",
    description: "وجهتك نحو التميز الأكاديمي والبحثي",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#080e0b" },
    { media: "(prefers-color-scheme: light)", color: "#f7f4ec" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${cairo.variable} ${plexArabic.variable} ${plexMono.variable} ${amiri.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SmoothScroll />
          <CursorGlow />
          <FilmGrain />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
