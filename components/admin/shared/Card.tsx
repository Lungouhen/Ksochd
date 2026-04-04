type CardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function Card({ title, description, children }: CardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30">
      <div className="mb-3 space-y-1">
        <p className="text-sm font-semibold text-white">{title}</p>
        {description ? (
          <p className="text-xs text-slate-300">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
