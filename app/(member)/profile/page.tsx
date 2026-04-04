import { Pill } from "@/components/ui/pill";
import { getCurrentUser } from "@/server/services/user.service";

export default async function MemberProfile() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-200/70">Profile</p>
          <h2 className="text-xl font-semibold text-white">{user.name}</h2>
          <p className="text-sm text-slate-200/80">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Pill label={user.role} tone="slate" />
          <Pill label={user.membershipStatus} tone="teal" />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-300">
            Contact
          </p>
          <p className="text-sm text-white">{user.phone}</p>
          {user.email ? (
            <p className="text-sm text-slate-200/80">{user.email}</p>
          ) : null}
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-300">
            Academic
          </p>
          <p className="text-sm text-white">{user.college}</p>
          <p className="text-sm text-slate-200/80">Clan: {user.clan}</p>
        </div>
      </div>

      <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-50">
        Next step: connect Supabase auth and Prisma client in{" "}
        <code className="font-mono text-emerald-100">lib/auth.ts</code> and
        <code className="font-mono text-emerald-100"> prisma/</code>.
      </div>
    </div>
  );
}
