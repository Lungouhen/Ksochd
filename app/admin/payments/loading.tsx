export default function PaymentsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-3 w-16 rounded bg-slate-700/40" />
          <div className="mt-2 h-6 w-40 rounded bg-slate-700/60" />
        </div>
        <div className="h-10 w-28 rounded-lg bg-slate-700/30" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-slate-800/50 p-4"
          >
            <div className="h-3 w-24 rounded bg-slate-700/40" />
            <div className="mt-3 h-7 w-20 rounded bg-slate-700/60" />
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-800/50">
        <div className="bg-white/5 px-4 py-3">
          <div className="flex gap-8">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-4 w-16 rounded bg-slate-700/40" />
            ))}
          </div>
        </div>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex gap-8 border-t border-white/5 px-4 py-3">
            {[1, 2, 3, 4, 5, 6, 7].map((j) => (
              <div
                key={j}
                className="h-4 rounded bg-slate-700/30"
                style={{ width: j === 1 ? "100px" : j === 7 ? "70px" : "85px" }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
