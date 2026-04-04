import Link from "next/link";
import { Pill } from "./pill";

type SectionCardProps = {
  title: string;
  description: string;
  items?: string[];
  cta?: { href: string; label: string };
  tone?: "teal" | "gold" | "slate";
  badge?: string;
};

export function SectionCard({
  title,
  description,
  items,
  cta,
  tone = "teal",
  badge,
}: SectionCardProps) {
  const accent =
    tone === "teal"
      ? "from-emerald-400/15 via-emerald-300/5 to-transparent border-emerald-300/30"
      : tone === "gold"
        ? "from-amber-400/20 via-amber-300/5 to-transparent border-amber-300/30"
        : "from-slate-300/10 via-slate-200/5 to-transparent border-slate-200/20";

  return (
    <div
      className={`glass-panel relative overflow-hidden border ${accent} p-6 transition hover:-translate-y-1 hover:shadow-2xl`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center text-sm font-semibold text-white">
              {title.charAt(0)}
            </div>
            {badge ? <Pill label={badge} tone={tone} /> : null}
          </div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-sm text-slate-200/90">{description}</p>
        </div>
        {cta ? (
          <Link
            href={cta.href}
            className="relative inline-flex h-9 items-center rounded-full border border-white/15 px-3 text-xs font-semibold uppercase tracking-wide text-white/90 transition hover:border-white/40 hover:text-white"
          >
            {cta.label}
          </Link>
        ) : null}
      </div>

      {items?.length ? (
        <ul className="relative mt-4 space-y-2 text-sm text-slate-200/85">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 rounded-lg bg-white/5 p-2"
            >
              <span className="mt-1 h-2 w-2 rounded-full bg-white/70" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
