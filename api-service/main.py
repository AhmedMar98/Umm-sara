# ============================================================
# خدمة أم سارة البرمجية (FastAPI) — الجانب Python من المعمارية
# المُهام: توليد PDF للسيرة الذاتية بدقة عربية، وجاهزية مستقبلية
# لميزات الذكاء الاصطناعي (تحليل، تفريغ، فحص أصالة).
# النشر: Render (خدمة Docker ثانية) — انظر render.yaml بالجذر
# ============================================================

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import uvicorn

app = FastAPI(
    title="Umm Sarah API",
    description="خدمات Python المساندة لمنصة أم سارة الأكاديمية",
    version="1.0.0",
)

# السماح للواجهة (Next.js على Render) بالوصول
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # قيّدها بدومينك في الإنتاج
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class CVSection(BaseModel):
    title: str
    body: str


class CVRequest(BaseModel):
    fullName: str = Field(min_length=2, max_length=120)
    jobTitle: str = ""
    email: str = ""
    phone: str = ""
    city: str = ""
    summary: str = ""
    sections: List[CVSection] = []
    template: str = "modern"


@app.get("/health")
def health():
    return {"status": "ok", "service": "umm-sarah-api"}


@app.post("/api/cv/pdf")
def generate_cv_pdf(req: CVRequest):
    """
    توليد PDF للسيرة الذاتية.
    ملاحظة إنتاجية: فعّل التوليد الفعلي بـ reportlab + arabic-reshaper
    + python-bidi (موجودة في requirements.txt) واستخدم مسار ملفات
    خطوط عربية (Cairo / Amiri) من مجلد fonts/.
    """
    if not req.fullName.strip():
        raise HTTPException(status_code=422, detail="الاسم مطلوب")

    # TODO(production): reportlab implementation with Arabic shaping.
    # الحالي: استجابة تأكيدية تُبقي العقد مستقراً حتى ربط الخطوط.
    return {
        "ok": True,
        "filename": f"cv-{req.fullName.strip().replace(' ', '-')}.pdf",
        "template": req.template,
        "sections": len(req.sections),
        "note": "فعّل توليد reportlab بملفات الخطوط العربية قبل الإطلاق.",
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
