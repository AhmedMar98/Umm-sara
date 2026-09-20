"use client";

/**
 * شريط موافقة التخزين (V10.1 — الدرس 7 من مقارنة أم رهام)
 * ------------------------------------------------------
 * صادق مع الواقع: الموقع لا يستخدم أي أدوات تتبع أو إعلانات —
 * التخزين المحلي لدينا وظيفي فقط (السمة المفضلة، سلة الطلبات،
 * مسودات بنّاء السيرة). لذلك يعرب الشريط عن ذلك بوضوح ويطلب
 * الموافقة على مستويين (كامل / أساسي فقط) ويسجل القرار محلياً —
 * جاهز للامتثال لأنظمة حماية البيانات السعودية (PDPL) عند
 * تفعيل أي قياس مجهول مستقبلاً.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "umm-sara-consent-v1";

interface Consent {
  decision: "full" | "essential";
  at: string;
}

function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    return p?.decision === "full" || p?.decision === "essential"
      ? (p as Consent)
      : null;
  } catch {
    return null;
  }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    /* نمط rAF المؤجل (المعتمد في المشروع): فحص القرار بعد أول إطار */
    const raf = requestAnimationFrame(() => {
      if (!readConsent()) setVisible(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  function decide(decision: "full" | "essential") {
    try {
      window.localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ decision, at: new Date().toISOString() })
      );
    } catch {
      /* القرار يبقى فعّالاً لهذه الجلسة حتى دون تخزين */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="موافقة استخدام التخزين المحلي"
      className="animate-cookie-in fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-2xl rounded-2xl border border-gold/25 bg-card/95 p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-gold/25 bg-gold-soft text-gold"
          aria-hidden="true"
        >
          <Cookie className="size-5" />
        </span>
        <p className="flex-1 text-xs leading-6 text-muted-foreground sm:text-[13px] sm:leading-7">
          نستخدم التخزين المحلي لتشغيل الموقع فقط — سمتك المفضلة، سلة طلباتك،
          ومسوداتك المحفوظة. <b className="text-foreground">لا تتبع ولا إعلانات إطلاقاً</b>،
          وأي قياس مستقبلي سيكون مجهولاً وبموافقتك.{" "}
          <Link href="/privacy" className="font-bold text-primary underline-offset-4 hover:underline">
            سياسة الخصوصية
          </Link>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            size="sm"
            className="h-10 rounded-full font-bold"
            onClick={() => decide("full")}
          >
            أوافق
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-10 rounded-full text-xs"
            onClick={() => decide("essential")}
          >
            الأساسي فقط
          </Button>
        </div>
      </div>
    </div>
  );
}
