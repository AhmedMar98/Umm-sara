import { NextResponse } from "next/server";

// فحص صحة الخدمة (health check) — مسار قياسي تطلبه منصات النشر.
// التاريخ: الخدمة المعاد توظيفها على Render كانت تفحص /healthz
// (قيمة قديمة من التطبيق السابق) والمسار لم يكن موجوداً هنا —
// إضافة المسار تضمن نجاح الفحص أياً كان المسار المضبوط على المنصة.
// يعكس حياة الخادم فقط ولا يفحص قاعدة البيانات عمداً:
// إسناد حياة الواجهة لقاعدة خارجية يجعل الخدمة تبدو ميتة
// كلما تعثر اتصال خارجي مؤقت، مع أن الصفحات الثابتة تعمل.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { status: "ok", service: "umm-sara", time: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
