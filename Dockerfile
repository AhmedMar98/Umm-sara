# ============================================================
# منصة أم سارة — Docker متعدد المراحل
#
# لماذا Docker وليس Node runtime المباشر؟ (مثبت بالقياس — worklog Task 18)
#   البناء (npm ci + next build) يستهلك ~1.8GB ذاكرة ذروة
#   والخطة المجانية على Render تقدم 512MB لعملية البناء على runtime الأصلي.
#   حاويات Docker تُبنى على بنّاة منفصلين بذاكرة أكبر،
#   ثم التشغيل: خادم standalone خفيف (~100MB RSS — مثبت بالقياس).
# ============================================================

# ---------- المرحلة 1: البناء (على بناة Docker بذاكرة أكبر) ----------
FROM node:20-alpine AS builder
WORKDIR /app

# التبعيات أولاً — طبقة قابلة للتخزين المؤقت
# --legacy-peer-deps إلزامي (موثق في DEPLOYMENT.md): يثبّت الشجرة المقفلة
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --no-audit --no-fund

# بناء التطبيق — سكربت build ينسخ static/ و public/ داخل standalone/ تلقائياً
COPY . .
RUN npm run build

# ---------- المرحلة 2: التشغيل (512MB كافية جداً) ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# خادم standalone يقرأ PORT من البيئة — Render يضبطه تلقائياً
COPY --from=builder /app/.next/standalone ./

EXPOSE 10000
CMD ["node", "server.js"]
