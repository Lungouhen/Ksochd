import { MemberApproval } from "@/components/forms/member-approval";
import { Pill } from "@/components/ui/pill";
import { getPendingMembers } from "@/server/services/user.service";

export default async function AdminApprovals() {
  const pending = await getPendingMembers();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Pill label="Approvals" tone="gold" />
        <p className="text-sm text-slate-200/80">
          Membership lifecycle moderation with the single-stream gate.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {pending.map((member) => (
          <div
            key={member.id}
            className="rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-white">{member.name}</p>
                <p className="text-xs text-slate-200/70">
                  {member.phone} · {member.college}
                </p>
              </div>
              <Pill label={member.membershipStatus} tone="teal" />
            </div>
            <p className="mt-2 text-xs text-slate-200/70">
              Clan: {member.clan ?? "n/a"}
            </p>
            <div className="mt-4">
              <MemberApproval />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
