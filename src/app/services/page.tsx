import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { CATEGORIES, PLATFORM_NAME } from "@/lib/platform-data";
import { SectionHeading } from "@/components/section-blocks";
import { ServicesExplorer } from "@/components/services-explorer";

export const metadata: Metadata = {
  title: "الخدمات",
  description:
    "ستة أقسام أكاديمية متكاملة: الخدمات الجامعية، الدراسات العليا، الخدمات المدرسية، الإحصاء والبحث العلمي، التصميم والخدمات المساندة، البرمجة والتقنية.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <SectionHeading
        kicker="ALL SERVICES"
        title={`خدمات منصة ${PLATFORM_NAME}`}
        description="ستة أقسام رئيسية تغطي احتياجاتك الأكاديمية والبحثية والتقنية — تصفح أو ابحث عن خدمتك مباشرة."
      />
      <ServicesExplorer categories={CATEGORIES} />
    </div>
  );
}
