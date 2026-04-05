export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stats row skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-slate-800/50 p-4"
          >
            <div className="h-3 w-24 rounded bg-slate-700/60" />
            <div className="mt-3 h-7 w-16 rounded bg-slate-700/60" />
            <div className="mt-2 h-2.5 w-20 rounded bg-slate-700/40" />
          </div>
        ))}
      </div>

      {/* Chart + activity skeleton */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-slate-800/50 p-4">
          <div className="h-4 w-32 rounded bg-slate-700/60 mb-4" />
          <div className="h-48 rounded-xl bg-slate-700/30" />
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-4">
          <div className="h-4 w-28 rounded bg-slate-700/60 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 rounded-lg bg-slate-700/30" />
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions skeleton */}
      <div className="rounded-2xl border border-white/10 bg-slate-800/50 p-4">
        <div className="h-4 w-24 rounded bg-slate-700/60 mb-3" />
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-32 rounded-lg bg-slate-700/30" />
          ))}
        </div>
      </div>
    </div>
  );
}
