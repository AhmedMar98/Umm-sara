import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    // تثبيت جذر مساحة العمل صراحةً — يمنع استنتاج الجذر تلقائياً
    // عند وجود أكثر من ملف قفل (bun.lock + package-lock.json)
    root: path.resolve(__dirname),
  },
  /* config options here */
  /* V10: أزيل تجاهل أخطاء TS — tsc --noEmit = صفر أخطاء (مثبت 19-09). العلم كان يخفي أخطاء مستقبلية محتملة */
  reactStrictMode: false,
};

export default nextConfig;
