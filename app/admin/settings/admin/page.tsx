import Link from "next/link";
import { Shield, Users, UserCheck, Crown, ScrollText, ArrowLeft } from "lucide-react";

const roles = [
  {
    name: "Admin",
    count: 3,
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
    count: 14,
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
    count: 1267,
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

const auditLog = [
  { action: "Role changed to MODERATOR", user: "Mangkhosei Zou", by: "Chinglen Vaiphei", time: "2 hours ago" },
  { action: "Member approved", user: "Thangsei Kipgen", by: "Chinglen Vaiphei", time: "4 hours ago" },
  { action: "Member rejected", user: "Lhingneithang Mate", by: "Vungtin Guite", time: "1 day ago" },
  { action: "Settings updated", user: "System", by: "Chinglen Vaiphei", time: "2 days ago" },
  { action: "New admin added", user: "Lalrinsangi Hmar", by: "Chinglen Vaiphei", time: "5 days ago" },
];

export default function SecurityRolesPage() {
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
        {roles.map((role) => {
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
        <div className="space-y-2">
          {auditLog.map((entry, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-4 rounded-lg border border-white/5 bg-white/5 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm text-white">{entry.action}</p>
                <p className="text-xs text-slate-400">
                  {entry.user} · by {entry.by}
                </p>
              </div>
              <span className="shrink-0 text-xs text-slate-500">{entry.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
