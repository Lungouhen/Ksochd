import { prisma } from "@/lib/prisma";

type MemberRow = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  role?: string | null;
  membershipStatus?: string | null;
  createdAt?: Date | string;
};

export default async function MembersPage() {
  let members: MemberRow[] = [];

  try {
    members = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    members = [
      {
        id: "mock-1",
        name: "Chinglen Vaiphei",
        phone: "+91-9876543210",
        email: "member@ksochd.org",
        role: "MEMBER",
        membershipStatus: "ACTIVE",
        createdAt: "2026-04-01",
      },
      {
        id: "mock-2",
        name: "Vungtin Guite",
        phone: "+91-9876501234",
        email: "moderator@ksochd.org",
        role: "MODERATOR",
        membershipStatus: "PENDING",
        createdAt: "2026-03-28",
      },
    ];
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">Members</p>
        <h1 className="text-xl font-semibold text-white">Members management</h1>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-lg shadow-black/30">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Name</th>
              <th className="px-4 py-3 text-left font-semibold">Phone</th>
              <th className="px-4 py-3 text-left font-semibold">Email</th>
              <th className="px-4 py-3 text-left font-semibold">Role</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Joined</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, idx) => (
              <tr
                key={member.id}
                className={idx % 2 ? "bg-white/5" : "bg-white/[0.02]"}
              >
                <td className="px-4 py-3 font-medium text-white">{member.name}</td>
                <td className="px-4 py-3 text-slate-200">{member.phone}</td>
                <td className="px-4 py-3 text-slate-200">
                  {member.email ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-200">
                  {member.role ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-200">
                  {member.membershipStatus ?? "—"}
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {member.createdAt
                    ? new Date(member.createdAt).toISOString().split("T")[0]
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
