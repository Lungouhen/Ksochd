import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  Eye,
  MousePointerClick,
  Percent,
  Shield,
  ArrowLeft,
  Megaphone,
} from "lucide-react";
import { getEngagementReport } from "@/server/services/report.service";
import { ExportButton } from "@/components/admin/reports/ExportButton";

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

const ActivityLineChart = dynamic(
  () =>
    import("@/components/admin/reports/ActivityLineChart").then((mod) => ({
      default: mod.ActivityLineChart,
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
  title: "Engagement Report – KSO Admin",
  description:
    "Content engagement, notification analytics, and ad performance for KSO Chandigarh.",
  robots: { index: false, follow: false },
};

export default async function EngagementReportPage() {
  const report = await getEngagementReport();

  const summaryCards = [
    {
      label: "Notifications Sent",
      value: report.totalNotifications.toLocaleString("en-IN"),
      icon: Bell,
      bg: "bg-blue-500/15",
      color: "text-blue-300",
    },
    {
      label: "Read Rate",
      value: `${report.readRate}%`,
      icon: Eye,
      bg: "bg-emerald-500/15",
      color: "text-emerald-300",
    },
    {
      label: "Content Published",
      value: String(report.totalContent),
      icon: BookOpen,
      bg: "bg-purple-500/15",
      color: "text-purple-300",
    },
    {
      label: "Ad Impressions",
      value: report.totalImpressions.toLocaleString("en-IN"),
      icon: Megaphone,
      bg: "bg-amber-500/15",
      color: "text-amber-300",
    },
    {
      label: "Ad Clicks",
      value: report.totalClicks.toLocaleString("en-IN"),
      icon: MousePointerClick,
      bg: "bg-teal-500/15",
      color: "text-teal-300",
    },
    {
      label: "Overall CTR",
      value: `${report.overallCtr}%`,
      icon: Percent,
      bg: "bg-rose-500/15",
      color: "text-rose-300",
    },
    {
      label: "Audit Logs",
      value: report.auditLogCount.toLocaleString("en-IN"),
      icon: Shield,
      bg: "bg-indigo-500/15",
      color: "text-indigo-300",
    },
  ];

  const notificationPieData = [
    { name: "Read", value: report.readNotifications },
    { name: "Unread", value: report.unreadNotifications },
  ];

  const contentTypePieData = report.contentTypeBreakdown.map((d) => ({
    name: d.type,
    value: d.count,
  }));

  const adBarData = report.topAds.map((ad) => ({
    name: ad.name.length > 20 ? ad.name.substring(0, 18) + "…" : ad.name,
    value: ad.clicks,
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
            <h1 className="text-2xl font-semibold text-white">
              Engagement Report
            </h1>
          </div>
        </div>
        <ExportButton href="/api/reports/engagement" label="Export Engagement CSV" />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                  {card.label}
                </p>
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${card.bg}`}
                >
                  <Icon className={`h-3.5 w-3.5 ${card.color}`} />
                </span>
              </div>
              <p className="mt-1 text-xl font-semibold text-white">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Notification & Content Breakdown */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StatusPieChart
          data={notificationPieData}
          title="Notification Read Rate"
          description="Read vs unread notifications"
          colors={["#10b981", "#94a3b8"]}
        />
        <StatusPieChart
          data={contentTypePieData}
          title="Content by Type"
          description="Published content type distribution"
          colors={["#14b8a6", "#f59e0b", "#8b5cf6", "#3b82f6"]}
        />
      </div>

      {/* Content Publishing Trend */}
      <ActivityLineChart
        data={report.monthlyContent}
        title="Content Publishing Trend"
        description="Content items published per month over the last 12 months"
        color="#8b5cf6"
      />

      {/* Ad Performance */}
      <DistributionBar
        data={adBarData}
        title="Top Ads by Clicks"
        description="Best performing ads ranked by click count"
        color="#f59e0b"
      />

      {/* Ad Performance Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30">
        <div className="mb-3 space-y-1">
          <p className="text-sm font-semibold text-white">
            Ad Performance Details
          </p>
          <p className="text-xs text-slate-300">
            Impressions, clicks, and click-through rate for each ad
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">Ad Name</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Impressions
                </th>
                <th className="px-4 py-3 text-left font-semibold">Clicks</th>
                <th className="px-4 py-3 text-left font-semibold">CTR</th>
              </tr>
            </thead>
            <tbody>
              {report.topAds.map((ad, idx) => (
                <tr
                  key={ad.id}
                  className={idx % 2 ? "bg-white/5" : "bg-white/[0.02]"}
                >
                  <td className="px-4 py-3 text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-white">
                    {ad.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-700/50 px-2 py-0.5 text-xs text-slate-300">
                      {ad.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {ad.impressions.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-amber-300">
                    {ad.clicks.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 font-medium text-teal-300">
                    {ad.ctr}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Trend */}
      <ActivityLineChart
        data={report.monthlyAuditLogs}
        title="Admin Activity (Audit Logs)"
        description="Number of admin actions logged per month"
        color="#6366f1"
      />
    </div>
  );
}
