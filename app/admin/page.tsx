import { VisitorsChart } from "@/components/admin/VisitorsChart";
import { getAdminSummary, getPendingMembers } from "@/server/services/user.service";
import Link from "next/link";
import {
  Users,
  CalendarDays,
  IndianRupee,
  AlertCircle,
  UserPlus,
  Calendar,
  CreditCard,
  Bell,
  Settings,
  UserCheck,
  Banknote,
  CalendarPlus,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Palette,
  DollarSign,
} from "lucide-react";

export default async function AdminDashboard() {
  const [summary, pendingMembers] = await Promise.all([
    getAdminSummary(),
    getPendingMembers(),
  ]);

  const stats = [
    {
      label: "Total Members",
      value: "1,284",
      change: "+12 this week",
      href: "/admin/members",
      icon: Users,
      iconBg: "bg-teal-500/15",
      iconColor: "text-teal-300",
    },
    {
      label: "Active Events",
      value: "6",
      change: "2 this month",
      href: "/admin/events",
      icon: CalendarDays,
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-300",
    },
    {
      label: "Revenue This Month",
      value: "₹72,400",
      change: "+8.2%",
      href: "/admin/payments",
      icon: IndianRupee,
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-300",
    },
    {
      label: "Pending Approvals",
      value: String(summary.pendingApprovals),
      change: "Needs attention",
      href: "/admin/members",
      icon: AlertCircle,
      iconBg: "bg-amber-500/15",
      iconColor: "text-amber-300",
      badge: true,
    },
  ];

  const recentActivity = [
    {
      icon: UserCheck,
      text: "Thangsei Kipgen joined as a new member",
      time: "2 hours ago",
      href: "/admin/members",
    },
    {
      icon: Banknote,
      text: "Payment of ₹500 received from Vungtin Guite",
      time: "4 hours ago",
      href: "/admin/payments",
    },
    {
      icon: CalendarPlus,
      text: "New event 'Youth Sports Meet' created",
      time: "6 hours ago",
      href: "/admin/events",
    },
    {
      icon: MessageSquare,
      text: "Notification sent to 120 members",
      time: "1 day ago",
      href: "/admin/notifications",
    },
    {
      icon: UserCheck,
      text: "Nemkhohat Singson membership approved",
      time: "1 day ago",
      href: "/admin/members",
    },
  ];

  const quickActions = [
    { label: "Add Member", href: "/admin/members", icon: UserPlus },
    { label: "Create Event", href: "/admin/events", icon: Calendar },
    { label: "Create Page", href: "/admin/cms/pages", icon: FileText },
    { label: "Manage Themes", href: "/admin/themes", icon: Palette },
    { label: "Manage Ads", href: "/admin/ads", icon: DollarSign },
    { label: "View Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Send Notification", href: "/admin/notifications", icon: Bell },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:border-teal-400/30 hover:bg-slate-900/90"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {stat.label}
                </p>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.iconBg}`}
                >
                  <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                </span>
              </div>
              <p className="mt-1 text-2xl font-semibold text-white">{stat.value}</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-xs text-emerald-300">{stat.change}</p>
                {stat.badge && (
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-300">
                    Needs attention
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Charts + Recent Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VisitorsChart />
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30">
          <div className="mb-3 space-y-1">
            <p className="text-sm font-semibold text-white">Recent Activity</p>
            <p className="text-xs text-slate-300">Latest updates</p>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item, idx) => {
              const ItemIcon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className="flex items-start gap-3 rounded-lg p-2 transition hover:bg-white/5"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-teal-500/15">
                    <ItemIcon className="h-3.5 w-3.5 text-teal-300" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-snug text-slate-200">{item.text}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-500">
                      <Clock className="h-2.5 w-2.5" />
                      {item.time}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30">
        <p className="mb-3 text-sm font-semibold text-white">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => {
            const ActionIcon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-teal-400/30 hover:bg-teal-600/20 hover:text-white"
              >
                <ActionIcon className="h-4 w-4 text-teal-400" />
                {action.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Pending Approvals</p>
            <p className="text-xs text-slate-300">Members awaiting verification</p>
          </div>
          <Link
            href="/admin/members"
            className="text-xs font-medium text-teal-400 transition hover:text-teal-300"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pendingMembers.slice(0, 3).map((member) => (
            <div
              key={member.id}
              className="rounded-xl border border-white/10 bg-slate-800/50 p-4"
            >
              <p className="font-medium text-white">{member.name}</p>
              <div className="mt-2 space-y-1 text-xs text-slate-400">
                <p>College: {member.college ?? "—"}</p>
                <p>Clan: {member.clan ?? "—"}</p>
                <p>Phone: {member.phone}</p>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex items-center gap-1 rounded-lg bg-emerald-600/20 px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-600/30">
                  <CheckCircle2 className="h-3 w-3" />
                  Approve
                </button>
                <button className="flex items-center gap-1 rounded-lg bg-red-600/20 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-600/30">
                  <XCircle className="h-3 w-3" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
