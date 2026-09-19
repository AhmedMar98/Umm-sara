-- ============================================================
-- منصة أم سارة — مخطط قاعدة بيانات Supabase (PostgreSQL)
-- المصدر المرجعي: services-data.md
-- طريقة التطبيق: Supabase Dashboard → SQL Editor → تشغيل هذا الملف
-- ============================================================

-- ---------- الأقسام ----------
create table if not exists public.categories (
  id          serial primary key,
  name        varchar(160) not null,
  slug        varchar(160) not null unique,
  icon        varchar(60),
  tagline     varchar(240),
  description text,
  long_description text,
  sort_order  int default 0,
  is_active   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ---------- الأقسام الفرعية ----------
create table if not exists public.subcategories (
  id          serial primary key,
  name        varchar(160) not null,
  slug        varchar(160) not null unique,
  category_id int not null references public.categories(id) on delete cascade,
  sort_order  int default 0,
  is_active   boolean default true
);

-- ---------- الخدمات ----------
create table if not exists public.services (
  id                serial primary key,
  name              varchar(200) not null,
  slug              varchar(200) not null unique,
  description       text,
  short_description varchar(400),
  category_id       int not null references public.categories(id) on delete cascade,
  subcategory_id    int references public.subcategories(id) on delete set null,
  price             numeric(10,2),
  price_type        varchar(20) check (price_type in ('fixed','hourly','per_page','per_word','on_request')) default 'on_request',
  image             text,
  icon              varchar(60),
  is_active         boolean default true,
  is_featured        boolean default false,
  sort_order        int default 0,
  meta_title        varchar(200),
  meta_description  text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- ---------- الطلبات ----------
create table if not exists public.orders (
  id         serial primary key,
  name       varchar(120) not null,
  contact    varchar(160) not null,
  service    varchar(200) not null,
  details    text not null,
  deadline   varchar(200),
  type       varchar(20) default 'service',
  status     varchar(20) default 'new' check (status in ('new','contacted','in_progress','delivered','closed')),
  created_at timestamptz default now()
);

-- ---------- حجوزات الاستشارات ----------
create table if not exists public.consultations (
  id         serial primary key,
  name       varchar(120) not null,
  contact    varchar(160) not null,
  field      varchar(200) not null,
  date       varchar(60),
  time       varchar(60),
  notes      text,
  status     varchar(20) default 'pending' check (status in ('pending','confirmed','done','cancelled')),
  created_at timestamptz default now()
);

-- ---------- آراء العملاء ----------
create table if not exists public.testimonials (
  id         serial primary key,
  name       varchar(120) not null,
  role       varchar(200),
  text       text not null,
  rating     int default 5 check (rating between 1 and 5),
  is_visible boolean default true,
  created_at timestamptz default now()
);

-- ---------- فهارس ----------
create index if not exists idx_services_category on public.services(category_id);
create index if not exists idx_services_active on public.services(is_active) where is_active;
create index if not exists idx_subcategories_category on public.subcategories(category_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created on public.orders(created_at desc);
create index if not exists idx_consultations_status on public.consultations(status);

-- ============================================================
-- البيانات الأولية (Seed) — من services-data.md
-- ============================================================

insert into public.categories (name, slug, icon, tagline, description, sort_order) values
  ('الخدمات الجامعية', 'university-services', 'graduation-cap', 'لبكالوريوس في كل التخصصات', 'خدمات متكاملة لطلاب البكالوريوس في مختلف التخصصات الجامعية.', 1),
  ('الدراسات العليا', 'graduate-services', 'scroll-text', 'للماجستير والدكتوراه', 'خدمات متخصصة لطلاب الماجستير والدكتوراه والباحثين.', 2),
  ('الخدمات المدرسية', 'school-services', 'school', 'للثانوية وما دونها', 'خدمات موجهة لطلاب المرحلة الثانوية وما دونها.', 3),
  ('الإحصاء والبحث العلمي', 'statistics-and-data-analysis', 'bar-chart-3', 'SPSS · R · Excel', 'خدمات التحليل الإحصائي والبيانات البحثية باحترافية.', 4),
  ('التصميم والخدمات المساندة', 'design-and-support', 'palette', 'هوية بصرية أكاديمية', 'تصميم جرافيكي متخصص للأغراض الأكاديمية والبحثية.', 5),
  ('البرمجة والتقنية', 'programming-and-tech', 'code-2', 'مواقع · تطبيقات · AI', 'حلول برمجية وتقنية: تطوير، ذكاء اصطناعي، قواعد بيانات.', 6)
on conflict (slug) do nothing;

insert into public.subcategories (name, slug, category_id, sort_order) values
  -- الجامعية
  ('الأبحاث والتقارير', 'university-research-reports', 1, 1),
  ('مشاريع التخرج', 'graduation-projects', 1, 2),
  ('الاختبارات والواجبات', 'exams-and-assignments', 1, 3),
  ('الشرح والدروس الخصوصية', 'tutoring-and-explanation', 1, 4),
  ('التدقيق والتنسيق', 'proofreading-and-formatting', 1, 5),
  ('الترجمة الأكاديمية', 'translation', 1, 6),
  ('التلخيص', 'summarization', 1, 7),
  ('العروض التقديمية', 'presentations', 1, 8),
  -- الدراسات العليا
  ('الرسائل العلمية', 'theses-and-dissertations', 2, 1),
  ('خطط البحث', 'research-proposals', 2, 2),
  ('البحث العلمي المتقدم', 'advanced-research', 2, 3),
  ('النشر العلمي', 'scientific-publishing', 2, 4),
  ('الإشراف والاستشارات', 'supervision-and-consulting', 2, 5),
  ('دراسات الحالة', 'case-studies', 2, 6),
  -- المدرسية
  ('الدروس والشرح', 'school-tutoring', 3, 1),
  ('الواجبات المدرسية', 'school-homework', 3, 2),
  ('المشاريع والتقارير', 'school-projects', 3, 3),
  ('تنمية المهارات', 'skills-development', 3, 4),
  ('الاختبارات', 'school-exams', 3, 5),
  -- الإحصاء
  ('تصميم الاستبيانات', 'survey-design', 4, 1),
  ('التحليل الإحصائي', 'statistical-analysis', 4, 2),
  ('تحليل البيانات البحثية', 'research-data', 4, 3),
  ('تفسير النتائج', 'results-interpretation', 4, 4),
  ('لوحات البيانات', 'dashboards', 4, 5),
  -- التصميم
  ('التصميم الأكاديمي', 'academic-design', 5, 1),
  ('التفريغ الصوتي', 'audio-transcription', 5, 2),
  ('التدقيق والتنسيق', 'proofreading', 5, 3),
  ('تصميم العروض', 'presentations-design', 5, 4),
  -- البرمجة
  ('تطوير البرمجيات', 'software-development', 6, 1),
  ('الذكاء الاصطناعي والبيانات', 'ai-and-data', 6, 2),
  ('قواعد البيانات', 'databases', 6, 3),
  ('الأنظمة المدمجة وIoT', 'embedded-systems', 6, 4),
  ('تقنيات الويب', 'web-technologies', 6, 5)
on conflict (slug) do nothing;

insert into public.testimonials (name, role, text, rating) values
  ('أ. محمد العتيبي', 'طالب ماجستير — إدارة أعمال', 'من خطة البحث حتى المناقشة، الفريق كان معي خطوة بخطوة. التحليل الإحصائي لـ SPSS كان أبعد من توقعاتي بكثير.', 5),
  ('أ. نورة القحطاني', 'طالبة بكالوريوس — علوم حاسب', 'مشروع التخرج البرمجي طلع متكامل: كود نظيف، توثيق كامل، وعرض تقديمي أحترف فيه يوم المناقشة.', 5),
  ('د. سالم الشمري', 'باحث دكتوراه — تربية', 'التدقيق اللغوي وتنسيق المراجع APA وفّر عليّ أسابيع من المراجعة اليدوية. التزام تام بالمواعيد.', 5)
on conflict do nothing;

-- ============================================================
-- أمان على مستوى الصفوف (RLS)
-- الطلبات والاستشارات: كتابة عامة عبر service_role فقط (من مسارات API
-- بسرية الخادم)، وقراءة إدارية. لا حاجة لسياسات عامة على الواجهة.
-- ============================================================
alter table public.orders enable row level security;
alter table public.consultations enable row level security;
alter table public.services enable row level security;
alter table public.categories enable row level security;
alter table public.subcategories enable row level security;
alter table public.testimonials enable row level security;

-- قراءة عامة للمحتوى (الخدمات والأقسام والآراء) عبر المفتاح المجهول
create policy "public read categories" on public.categories for select using (true);
create policy "public read subcategories" on public.subcategories for select using (true);
create policy "public read services" on public.services for select using (is_active = true);
create policy "public read testimonials" on public.testimonials for select using (is_visible = true);
