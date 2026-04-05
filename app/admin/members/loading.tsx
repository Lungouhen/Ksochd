export default function MembersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-3 w-16 rounded bg-slate-700/40" />
        <div className="mt-2 h-6 w-48 rounded bg-slate-700/60" />
      </div>

      <div className="flex flex-wrap gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-9 w-32 rounded-lg bg-slate-700/30" />
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
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex gap-8 border-t border-white/5 px-4 py-3">
            {[1, 2, 3, 4, 5, 6, 7].map((j) => (
              <div
                key={j}
                className="h-4 rounded bg-slate-700/30"
                style={{ width: j === 1 ? "120px" : j === 7 ? "80px" : "90px" }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
