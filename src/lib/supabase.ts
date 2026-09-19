/**
 * عميل Supabase من طرف الخادم — عبر PostgREST مباشرة (بلا حزم إضافية).
 * يعمل فقط عند ضبط متغيرات البيئة في الإنتاج؛ وإلا تُرجع المسارات
 * نجاحاً منطقياً (persisted: false) كي لا ينكسر التشغيل المحلي.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabaseConfigured = Boolean(SUPABASE_URL && SERVICE_KEY);

async function insertRow(table: string, row: Record<string, unknown>) {
  if (!supabaseConfigured) {
    console.info(`[supabase] غير مُهيأ — تخطي إدراج ${table}`);
    return { persisted: false as const };
  }
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "apikey": SERVICE_KEY,
      "Authorization": `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Supabase ${table} insert failed: ${res.status} ${body}`);
  }
  return { persisted: true as const };
}

export async function insertOrder(order: {
  name: string;
  contact: string;
  service: string;
  details: string;
  deadline?: string;
  type: string;
}) {
  return insertRow("orders", order);
}

export async function insertConsultation(c: {
  name: string;
  contact: string;
  field: string;
  date?: string;
  time?: string;
  notes?: string;
}) {
  return insertRow("consultations", c);
}
