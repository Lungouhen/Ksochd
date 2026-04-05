export default function MemberLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Welcome skeleton */}
      <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-4">
        <div className="h-12 w-12 rounded-full bg-slate-700/60" />
        <div className="space-y-2">
          <div className="h-3 w-20 rounded bg-slate-700/40" />
          <div className="h-5 w-36 rounded bg-slate-700/60" />
        </div>
      </div>

      {/* Stats row skeleton */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div className="h-11 w-11 rounded-lg bg-slate-700/60" />
            <div className="space-y-2">
              <div className="h-6 w-8 rounded bg-slate-700/60" />
              <div className="h-3 w-24 rounded bg-slate-700/40" />
            </div>
          </div>
        ))}
      </div>

      {/* Content grid skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 p-5"
          >
            <div className="h-4 w-32 rounded bg-slate-700/60 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-16 rounded-lg bg-slate-700/30" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
