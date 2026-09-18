import Link from "next/link";
import {
  GraduationCap,
  ScrollText,
  School,
  BarChart3,
  Palette,
  Code2,
  FileText,
  SearchCheck,
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

export const ICONS: Record<string, LucideIcon> = {
  "graduation-cap": GraduationCap,
  "scroll-text": ScrollText,
  school: School,
  "bar-chart-3": BarChart3,
  palette: Palette,
  "code-2": Code2,
  "file-text": FileText,
  "search-check": SearchCheck,
};

export function SectionHeading({
  kicker,
  title,
  description,
  center = true,
}: {
  kicker?: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      {kicker && (
        <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.25em] text-primary" dir="ltr">
          {kicker}
        </p>
      )}
      <h2 className="font-display text-2xl font-extrabold leading-snug tracking-tight sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-sm leading-8 text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

export function CategoryCard({
  name,
  slug,
  icon,
  tagline,
  description,
  subCount,
  delay = 0,
}: {
  name: string;
  slug: string;
  icon: string;
  tagline: string;
  description: string;
  subCount: number;
  delay?: number;
}) {
  const Icon = ICONS[icon] ?? GraduationCap;
  return (
    <Reveal delay={delay}>
      <Link
        href={`/services/${slug}`}
        className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 card-glow transition-all duration-300 hover:-translate-y-1"
      >
        <div className="flex items-start justify-between">
          <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary transition-transform duration-300 group-hover:scale-110">
            <Icon className="size-6" strokeWidth={1.8} />
          </span>
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground" dir="ltr">
            {String(subCount).padStart(2, "0")} SVC
          </span>
        </div>
        <h3 className="mt-5 font-display text-lg font-bold transition-colors group-hover:text-primary">
          {name}
        </h3>
        <p className="mt-1 text-xs font-medium text-gold">{tagline}</p>
        <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
          {description}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
          استكشف القسم
          <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
        </span>
      </Link>
    </Reveal>
  );
}

export function TrustRow({ className }: { className?: string }) {
  const items = [
    { icon: "🔒", label: "خصوصية وأمان" },
    { icon: "⚡", label: "دعم فوري" },
    { icon: "✓", label: "جودة أكاديمية" },
  ];
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-8 gap-y-3", className)}>
      {items.map((i) => (
        <li
          key={i.label}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <span aria-hidden="true">{i.icon}</span>
          {i.label}
        </li>
      ))}
    </ul>
  );
}
