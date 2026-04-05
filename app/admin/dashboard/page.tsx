import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarClock,
  CheckCircle2,
  Clock,
  CreditCard,
  IndianRupee,
  Settings,
  UserCheck,
  UserPlus,
} from "lucide-react";

import { VisitorsChart } from "@/components/admin/VisitorsChart";
import { getAdminSummary, getPendingMembers } from "@/server/services/user.service";

const paymentSnapshots = [
  {
    id: "pay-1",
    name: "Membership dues",
    amount: "₹42,500",
    status: "Settled",
    time: "Today, 09:40 AM",
  },
  {
    id: "pay-2",
    name: "Event registrations",
    amount: "₹18,900",
    status: "Processing",
    time: "Today, 07:15 AM",
  },
  {
    id: "pay-3",
    name: "Sponsorship block",
    amount: "₹65,000",
    status: "In escrow",
    time: "Yesterday",
  },
];

const upcomingEvents = [
  {
    id: "event-1",
    title: "KSO Cultural Evening",
    date: "18 Apr · Sector 17 Auditorium",
    status: "Registrations open",
  },
  {
    id: "event-2",
    title: "Career Mentorship Circle",
    date: "05 May · Community Center",
    status: "Seats filling",
  },
  {
    id: "event-3",
    title: "Sports & Wellness Drive",
    date: "28 May · University Grounds",
    status: "Drafting lineup",
  },
];

const quickActions = [
  {
    label: "Review approvals",
    href: "/admin/members",
    description: "Verify new memberships and move them to ACTIVE.",
    icon: UserCheck,
  },
  {
    label: "Broadcast update",
    href: "/admin/notifications",
    description: "Send a bell + email notification to everyone.",
    icon: Bell,
  },
  {
    label: "Update branding",
    href: "/admin/settings/website",
    description: "Logos, hero copy, and public links.",
    icon: Settings,
  },
];

export default async function AdminDashboard() {
  const [summary, pendingMembers] = await Promise.all([
    getAdminSummary(),
    getPendingMembers(),
  ]);

  const stats = [
    {
      label: "Active members",
      value: summary.activeMembers.toLocaleString("en-IN"),
      change: "+18 today",
      href: "/admin/members",
      icon: UserPlus,
      accent: "from-teal-500/30 to-emerald-500/20",
    },
    {
      label: "Pending approvals",
      value: summary.pendingApprovals.toLocaleString("en-IN"),
      change: "Needs review",
      href: "/admin/members",
      icon: CheckCircle2,
      accent: "from-amber-500/30 to-orange-500/20",
    },
    {
      label: "Revenue (MTD)",
      value: "₹72,400",
      change: "+8.2%",
      href: "/admin/payments",
      icon: IndianRupee,
      accent: "from-amber-400/30 to-yellow-400/15",
    },
    {
      label: "Moderators",
      value: summary.moderators.toLocaleString("en-IN"),
      change: "Roles & RBAC",
      href: "/admin/settings/admin",
      icon: Settings,
      accent: "from-sky-500/25 to-indigo-500/15",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.12em] text-amber-200/80">
            Control center
          </p>
          <h1 className="text-2xl font-semibold text-white">
            Operations heartbeat
          </h1>
          <p className="text-sm text-slate-300">
            Every card, row, and button opens a real screen — no dead ends.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-teal-400/30 hover:bg-teal-500/10"
          >
            <CalendarClock className="h-4 w-4 text-amber-200" />
            Create or manage events
          </Link>
          <Link
            href="/admin/payments"
            className="inline-flex items-center gap-2 rounded-lg border border-teal-400/30 bg-teal-500/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-teal-300/50 hover:bg-teal-500/25"
          >
            <CreditCard className="h-4 w-4 text-amber-200" />
            Collect payment
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:border-teal-300/30 hover:bg-slate-900/80"
            >
              <div
                className={`absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t ${stat.accent} opacity-70 blur-3xl`}
              />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-emerald-200">{stat.change}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-teal-200 ring-1 ring-white/10">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <span className="relative mt-3 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-amber-100">
                Open
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          );
        })}
      </div>

      {/* Chart + Actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">
                Engagement & collections
              </p>
              <p className="text-xs text-slate-300">
                Live pulse across visitors, signups, and payments
              </p>
            </div>
            <Link
              href="/admin/analytics"
              className="text-xs font-semibold text-teal-200 transition hover:text-teal-100"
            >
              Open analytics →
            </Link>
          </div>
          <VisitorsChart />
        </div>

        <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30">
          <p className="text-sm font-semibold text-white">Operational actions</p>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-3 text-sm text-slate-200 transition hover:border-teal-300/25 hover:bg-teal-500/5"
                >
                  <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/15 text-teal-200">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="space-y-1">
                    <p className="font-semibold text-white">{action.label}</p>
                    <p className="text-xs text-slate-400">{action.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Pending approvals</p>
              <p className="text-xs text-slate-300">
                Tap into a profile to approve or review details.
              </p>
            </div>
            <Link
              href="/admin/members"
              className="text-xs font-semibold text-teal-200 transition hover:text-teal-100"
            >
              Open members →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(pendingMembers.length ? pendingMembers : []).slice(0, 6).map((member) => (
              <Link
                key={member.id}
                href="/admin/members"
                className="rounded-xl border border-white/5 bg-white/5 p-3 transition hover:border-teal-300/30 hover:bg-teal-500/5"
              >
                <p className="font-semibold text-white">{member.name}</p>
                <p className="text-xs text-slate-400">{member.phone}</p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-amber-100">
                  <Clock className="h-3 w-3" />
                  Awaiting approval
                </div>
                <div className="mt-2 flex gap-2 text-xs text-slate-300">
                  <span className="rounded-full bg-white/10 px-2 py-1">
                    {member.clan ?? "Clan tbd"}
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-1">
                    {member.college ?? "College tbd"}
                  </span>
                </div>
              </Link>
            ))}
            {pendingMembers.length === 0 ? (
              <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-sm text-slate-300">
                Everyone is up to date — check back after new signups land.
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Payment snapshots</p>
            <Link
              href="/admin/payments"
              className="text-xs font-semibold text-teal-200 transition hover:text-teal-100"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {paymentSnapshots.map((payment) => (
              <Link
                key={payment.id}
                href="/admin/payments"
                className="flex items-start justify-between rounded-xl border border-white/5 bg-white/5 p-3 transition hover:border-teal-300/30 hover:bg-teal-500/5"
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">{payment.name}</p>
                  <p className="text-xs text-slate-400">{payment.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-100">{payment.amount}</p>
                  <p className="text-[11px] text-emerald-200">{payment.status}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="rounded-xl border border-white/5 bg-teal-500/10 p-3 text-xs text-teal-100">
            Last payment recorded on {summary.lastPayment}. Reconcile in Payments.
          </div>
        </div>
      </div>

      {/* Events */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Upcoming events</p>
            <p className="text-xs text-slate-300">
              Every row clicks through to the events workspace.
            </p>
          </div>
          <Link
            href="/admin/events"
            className="text-xs font-semibold text-teal-200 transition hover:text-teal-100"
          >
            Manage events →
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event) => (
            <Link
              key={event.id}
              href="/admin/events"
              className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3 transition hover:border-teal-300/25 hover:bg-teal-500/5"
            >
              <div>
                <p className="text-sm font-semibold text-white">{event.title}</p>
                <p className="text-xs text-slate-400">{event.date}</p>
              </div>
              <span className="rounded-full bg-amber-400/20 px-2 py-1 text-[11px] font-semibold text-amber-50">
                {event.status}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
