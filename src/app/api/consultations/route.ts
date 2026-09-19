import { NextResponse } from "next/server";
import { z } from "zod";
import { insertConsultation, supabaseConfigured } from "@/lib/supabase";

const ConsultationSchema = z.object({
  name: z.string().min(2).max(120),
  contact: z.string().min(5).max(160),
  field: z.string().min(2).max(200),
  date: z.string().max(60).optional().default(""),
  time: z.string().max(60).optional().default(""),
  notes: z.string().max(3000).optional().default(""),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "صيغة غير صالحة" }, { status: 400 });
  }

  const parsed = ConsultationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "حقول ناقصة أو غير صحيحة", issues: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const result = await insertConsultation(parsed.data);
    return NextResponse.json({
      ok: true,
      persisted: result.persisted,
      note: supabaseConfigured
        ? undefined
        : "قاعدة البيانات غير مُهيأة في هذه البيئة — تم قبول الحجز منطقياً.",
    });
  } catch (err) {
    console.error("[api/consultations]", err);
    return NextResponse.json(
      { error: "تعذر حفظ الحجز حالياً" },
      { status: 503 }
    );
  }
}
