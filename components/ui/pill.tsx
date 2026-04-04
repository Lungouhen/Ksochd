type PillTone = "teal" | "gold" | "slate";

const toneStyles: Record<PillTone, string> = {
  teal: "bg-emerald-300/15 text-emerald-200 border-emerald-300/30",
  gold: "bg-amber-200/15 text-amber-200 border-amber-300/30",
  slate: "bg-slate-300/10 text-slate-200 border-slate-200/20",
};

type PillProps = {
  label: string;
  tone?: PillTone;
};

export function Pill({ label, tone = "slate" }: PillProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${toneStyles[tone]}`}
    >
      {label}
    </span>
  );
}
