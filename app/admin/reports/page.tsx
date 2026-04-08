import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  IndianRupee,
  CalendarDays,
  Activity,
  ArrowRight,
  TrendingUp,
  BarChart3,
  PieChart,
  FileText,
} from "lucide-react";
import { getMemberReport } from "@/server/services/report.service";
import { getPaymentMetrics } from "@/server/services/payment.service";

export const metadata: Metadata = {
  title: "Reports – KSO Admin",
  description: "Comprehensive reporting and analytics for KSO Chandigarh.",
  robots: { index: false, follow: false },
};

export default async function ReportsHub() {
  const [memberReport, paymentMetrics] = await Promise.all([
    getMemberReport(),
    getPaymentMetrics(),
  ]);

  const reportCards = [
    {
      title: "Members Report",
      description:
        "Member growth trends, demographics by clan and college, membership status distribution, and role analytics.",
      href: "/admin/reports/members",
      icon: Users,
      iconBg: "bg-teal-500/15",
      iconColor: "text-teal-300",
      stats: [
        { label: "Total Members", value: memberReport.totalMembers.toLocaleString("en-IN") },
        { label: "Active", value: memberReport.activeMembers.toLocaleString("en-IN") },
        { label: "Pending", value: String(memberReport.pendingMembers) },
      ],
    },
    {
      title: "Financial Report",
      description:
        "Revenue trends, payment status breakdown, collection by purpose (membership vs events), and success rates.",
      href: "/admin/reports/financial",
      icon: IndianRupee,
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-300",
      stats: [
        { label: "Total Transactions", value: String(paymentMetrics.total) },
        { label: "Paid", value: String(paymentMetrics.paid) },
        { label: "Pending", value: String(paymentMetrics.pending) },
      ],
    },
    {
      title: "Events Report",
      description:
        "Event performance metrics, registration trends, attendance analysis, and revenue generated per event.",
      href: "/admin/reports/events",
      icon: CalendarDays,
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-300",
      stats: [
        { label: "Reports", value: "12 months" },
        { label: "Metrics", value: "Performance" },
        { label: "Data", value: "Registrations" },
      ],
    },
    {
      title: "Engagement Report",
      description:
        "Notification delivery rates, content analytics, ad performance (impressions, clicks, CTR), and audit trail.",
      href: "/admin/reports/engagement",
      icon: Activity,
      iconBg: "bg-purple-500/15",
      iconColor: "text-purple-300",
      stats: [
        { label: "Scope", value: "Content" },
        { label: "Ads", value: "CTR" },
        { label: "Audit", value: "Logs" },
      ],
    },
  ];

  const highlights = [
    {
      icon: TrendingUp,
      label: "Growth Tracking",
      detail: "12-month member sign-up and revenue trends with visual charts",
    },
    {
      icon: PieChart,
      label: "Demographics",
      detail: "Clan, college, and role distribution across the membership",
    },
    {
      icon: BarChart3,
      label: "Performance",
      detail: "Event attendance rates, payment success, and engagement metrics",
    },
    {
      icon: FileText,
      label: "Export & Audit",
      detail: "CSV exports for all reports and admin action audit trail",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Admin
        </p>
        <h1 className="text-2xl font-semibold text-white">
          Reports &amp; Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          In-depth reporting across members, finances, events, and engagement.
        </p>
      </div>

      {/* Highlights Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((h) => {
          const Icon = h.icon;
          return (
            <div
              key={h.label}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30"
            >
              <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/15">
                <Icon className="h-4 w-4 text-teal-300" />
              </div>
              <p className="text-sm font-semibold text-white">{h.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                {h.detail}
              </p>
            </div>
          );
        })}
      </div>

      {/* Report Cards */}
      <div className="grid gap-4 lg:grid-cols-2">
        {reportCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30 transition hover:-translate-y-0.5 hover:border-teal-400/30 hover:bg-slate-900/90"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg}`}
                  >
                    <Icon className={`h-5 w-5 ${card.iconColor}`} />
                  </span>
                  <h2 className="text-lg font-semibold text-white">
                    {card.title}
                  </h2>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:text-teal-400" />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {card.description}
              </p>
              <div className="mt-4 flex gap-4">
                {card.stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-lg font-semibold text-white">
                      {stat.value}
                    </p>
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
