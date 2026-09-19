import type { Metadata } from "next";
import { CVBuilder } from "@/components/cv-builder";

export const metadata: Metadata = {
  title: "بنّاء السيرة الذاتية",
  description:
    "أنشئ سيرة ذاتية احترافية متوافقة مع ATS — قوالب متعددة، محرر مباشر، معاينة حية، وتصدير PDF مجاني.",
};

export default function CVBuilderPage() {
  return <CVBuilder />;
}
