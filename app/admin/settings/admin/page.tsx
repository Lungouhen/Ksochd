export default function AdminSettings() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Admin
        </p>
        <h1 className="text-xl font-semibold text-white">Admin Settings</h1>
      </div>
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
        <p className="text-sm text-slate-200">
          Configure admin notifications, security policies, and audit preferences
          in a future step. Hook this page to Supabase/Prisma when ready.
        </p>
      </div>
    </div>
  );
}
