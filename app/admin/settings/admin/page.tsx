import Link from "next/link";
import { Shield, Users, UserCheck, Crown, ScrollText, ArrowLeft } from "lucide-react";
import { withPrisma } from "@/lib/prisma";

function getActionLabel(action: string): string {
  switch (action) {
    case "ROLE_CHANGED":
      return "Role changed";
    case "MEMBER_APPROVED":
      return "Member approved";
    case "MEMBER_REJECTED":
      return "Member rejected";
    default:
      return action.replace(/_/g, " ").toLowerCase();
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
}

export default async function SecurityRolesPage() {
  // Get actual role counts from database
  const roleCounts = await withPrisma(
    async (client) => {
      const [adminCount, moderatorCount, memberCount] = await Promise.all([
        client.user.count({ where: { role: "ADMIN" } }),
        client.user.count({ where: { role: "MODERATOR" } }),
        client.user.count({ where: { role: "MEMBER" } }),
      ]);
      return { adminCount, moderatorCount, memberCount };
    },
    () => ({ adminCount: 3, moderatorCount: 14, memberCount: 1267 }),
  );

  // Create roles with actual counts
  const rolesWithCounts = [
    {
      name: "Admin",
      count: roleCounts.adminCount,
      icon: Crown,
      color: "text-amber-300 bg-amber-500/15",
      capabilities: [
        "Full portal access and configuration",
        "Approve/reject member applications",
        "Manage events, payments, and content",
        "Configure integrations and settings",
        "Assign and modify user roles",
      ],
    },
    {
      name: "Moderator",
      count: roleCounts.moderatorCount,
      icon: Shield,
      color: "text-purple-300 bg-purple-500/15",
      capabilities: [
        "Manage events and registrations",
        "Moderate content and galleries",
        "View member profiles",
        "Send notifications",
        "Access analytics dashboard",
      ],
    },
    {
      name: "Member",
      count: roleCounts.memberCount,
      icon: Users,
      color: "text-teal-300 bg-teal-500/15",
      capabilities: [
        "View and register for events",
        "Make payments and download receipts",
        "Update personal profile",
        "View gallery and content",
        "Receive notifications",
      ],
    },
  ];

  // Get recent audit logs
  const auditLogs = await withPrisma(
    async (client) => {
      const logs = await client.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
      });
      return logs.map((log) => ({
        action: getActionLabel(log.action),
        details: log.details as Record<string, string>,
        user: log.targetUserName || "Unknown",
        by: log.performedByName || "Unknown Admin",
        time: getTimeAgo(log.createdAt),
      }));
    },
    () => [
      { action: "Role changed to MODERATOR", details: {}, user: "Mangkhosei Zou", by: "Chinglen Vaiphei", time: "2 hours ago" },
      { action: "Member approved", details: {}, user: "Thangsei Kipgen", by: "Chinglen Vaiphei", time: "4 hours ago" },
      { action: "Member rejected", details: {}, user: "Lhingneithang Mate", by: "Vungtin Guite", time: "1 day ago" },
    ],
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Settings</p>
          <h1 className="text-2xl font-semibold text-white">Security & Roles</h1>
          <p className="mt-1 text-sm text-slate-300">
            Manage role-based access control and view audit history.
          </p>
        </div>
        <Link
          href="/admin/settings"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </Link>
      </div>

      {/* Role cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {rolesWithCounts.map((role) => {
          const Icon = role.icon;
          return (
            <div
              key={role.name}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${role.color}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-base font-semibold text-white">{role.name}</p>
                    <p className="text-sm text-slate-400">{role.count.toLocaleString()} users</p>
                  </div>
                </div>
              </div>
              <ul className="space-y-2">
                {role.capabilities.map((cap) => (
                  <li key={cap} className="flex items-start gap-2 text-sm text-slate-300">
                    <UserCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    {cap}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Audit log */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30">
        <div className="mb-4 flex items-center gap-3">
          <ScrollText className="h-5 w-5 text-teal-300" />
          <h2 className="text-base font-semibold text-white">Recent Audit Log</h2>
        </div>
        {auditLogs.length > 0 ? (
          <div className="space-y-2">
            {auditLogs.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4 rounded-lg border border-white/5 bg-white/5 p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white">
                    {entry.action}
                    {entry.details?.oldRole && entry.details?.newRole && (
                      <span className="text-slate-400">
                        {" "}
                        from <span className="text-purple-300">{entry.details.oldRole}</span> to{" "}
                        <span className="text-amber-300">{entry.details.newRole}</span>
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-400">
                    {entry.user} · by {entry.by}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-slate-500">{entry.time}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-4">No audit logs yet</p>
        )}
      </div>
    </div>
  );
}
