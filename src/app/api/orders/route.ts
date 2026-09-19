import { NextResponse } from "next/server";
import { z } from "zod";
import { insertOrder, supabaseConfigured } from "@/lib/supabase";

const OrderSchema = z.object({
  name: z.string().min(2).max(120),
  contact: z.string().min(5).max(160),
  service: z.string().min(2).max(200),
  details: z.string().min(5).max(4000),
  deadline: z.string().max(200).optional().default(""),
  type: z.enum(["service", "product", "contact"]).default("service"),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "صيغة غير صالحة" }, { status: 400 });
  }

  const parsed = OrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "حقول ناقصة أو غير صحيحة", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const result = await insertOrder(parsed.data);
    return NextResponse.json({
      ok: true,
      persisted: result.persisted,
      note: supabaseConfigured
        ? undefined
        : "قاعدة البيانات غير مُهيأة في هذه البيئة — تم قبول الطلب منطقياً.",
    });
  } catch (err) {
    console.error("[api/orders]", err);
    return NextResponse.json(
      { error: "تعذر حفظ الطلب حالياً" },
      { status: 503 }
    );
  }
}
