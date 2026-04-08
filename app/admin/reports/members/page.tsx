import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Users,
  UserCheck,
  Clock,
  XCircle,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { getMemberReport } from "@/server/services/report.service";
import { ExportButton } from "@/components/admin/reports/ExportButton";

const MemberGrowthChart = dynamic(
  () =>
    import("@/components/admin/reports/MemberGrowthChart").then((mod) => ({
      default: mod.MemberGrowthChart,
    })),
  {
    loading: () => (
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <div className="h-72 animate-pulse rounded-lg bg-slate-800" />
      </div>
    ),
  },
);

const StatusPieChart = dynamic(
  () =>
    import("@/components/admin/reports/StatusPieChart").then((mod) => ({
      default: mod.StatusPieChart,
    })),
  {
    loading: () => (
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <div className="h-72 animate-pulse rounded-lg bg-slate-800" />
      </div>
    ),
  },
);

const DistributionBar = dynamic(
  () =>
    import("@/components/admin/reports/DistributionBar").then((mod) => ({
      default: mod.DistributionBar,
    })),
  {
    loading: () => (
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
        <div className="h-72 animate-pulse rounded-lg bg-slate-800" />
      </div>
    ),
  },
);

export const metadata: Metadata = {
  title: "Members Report – KSO Admin",
  description: "Detailed member analytics and demographics for KSO Chandigarh.",
  robots: { index: false, follow: false },
};

export default async function MembersReportPage() {
  const report = await getMemberReport();

  const summaryCards = [
    {
      label: "Total Members",
      value: report.totalMembers.toLocaleString("en-IN"),
      icon: Users,
      bg: "bg-teal-500/15",
      color: "text-teal-300",
    },
    {
      label: "Active",
      value: report.activeMembers.toLocaleString("en-IN"),
      icon: UserCheck,
      bg: "bg-emerald-500/15",
      color: "text-emerald-300",
    },
    {
      label: "Pending",
      value: String(report.pendingMembers),
      icon: Clock,
      bg: "bg-amber-500/15",
      color: "text-amber-300",
    },
    {
      label: "Rejected",
      value: String(report.rejectedMembers),
      icon: XCircle,
      bg: "bg-red-500/15",
      color: "text-red-300",
    },
    {
      label: "Expired",
      value: String(report.expiredMembers),
      icon: AlertTriangle,
      bg: "bg-orange-500/15",
      color: "text-orange-300",
    },
  ];

  const statusPieData = report.statusDistribution.map((d) => ({
    name: d.status,
    value: d.count,
  }));

  const rolePieData = report.roleDistribution.map((d) => ({
    name: d.status,
    value: d.count,
  }));

  const clanBarData = report.clanDistribution.map((d) => ({
    name: d.clan,
    value: d.count,
  }));

  const collegeBarData = report.collegeDistribution.map((d) => ({
    name: d.college,
    value: d.count,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/reports"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Reports
            </p>
            <h1 className="text-2xl font-semibold text-white">Members Report</h1>
          </div>
        </div>
        <ExportButton href="/api/reports/members" label="Export Members CSV" />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {card.label}
                </p>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bg}`}
                >
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </span>
              </div>
              <p className="mt-1 text-2xl font-semibold text-white">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Growth Chart */}
      <MemberGrowthChart data={report.monthlySignups} />

      {/* Status & Role Distribution */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StatusPieChart
          data={statusPieData}
          title="Membership Status"
          description="Distribution by membership status"
          colors={["#10b981", "#f59e0b", "#ef4444", "#f97316"]}
        />
        <StatusPieChart
          data={rolePieData}
          title="Role Distribution"
          description="Distribution by user role"
          colors={["#14b8a6", "#8b5cf6", "#3b82f6"]}
        />
      </div>

      {/* Clan Distribution */}
      <DistributionBar
        data={clanBarData}
        title="Clan Distribution"
        description="Members by clan"
        color="#14b8a6"
      />

      {/* College Distribution */}
      <DistributionBar
        data={collegeBarData}
        title="College Distribution"
        description="Members by college/university"
        color="#3b82f6"
        layout="vertical"
      />

      {/* Detailed Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30">
        <div className="mb-3 space-y-1">
          <p className="text-sm font-semibold text-white">
            Clan Membership Details
          </p>
          <p className="text-xs text-slate-300">
            Breakdown of members by clan affiliation
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">Clan</th>
                <th className="px-4 py-3 text-left font-semibold">Members</th>
                <th className="px-4 py-3 text-left font-semibold">
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody>
              {report.clanDistribution.map((clan, idx) => (
                <tr
                  key={clan.clan}
                  className={idx % 2 ? "bg-white/5" : "bg-white/[0.02]"}
                >
                  <td className="px-4 py-3 text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-white">
                    {clan.clan}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {clan.count.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {report.totalMembers > 0
                      ? ((clan.count / report.totalMembers) * 100).toFixed(1)
                      : 0}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
