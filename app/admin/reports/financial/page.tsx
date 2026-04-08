import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  IndianRupee,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Percent,
  ArrowLeft,
} from "lucide-react";
import { getFinancialReport } from "@/server/services/report.service";
import { ExportButton } from "@/components/admin/reports/ExportButton";

const RevenueChart = dynamic(
  () =>
    import("@/components/admin/reports/RevenueChart").then((mod) => ({
      default: mod.RevenueChart,
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
  title: "Financial Report – KSO Admin",
  description:
    "Revenue analytics, payment breakdown, and financial insights for KSO Chandigarh.",
  robots: { index: false, follow: false },
};

export default async function FinancialReportPage() {
  const report = await getFinancialReport();

  const summaryCards = [
    {
      label: "Total Revenue",
      value: `₹${report.totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      bg: "bg-emerald-500/15",
      color: "text-emerald-300",
    },
    {
      label: "Paid",
      value: `${report.paidCount} txns`,
      icon: CheckCircle2,
      bg: "bg-teal-500/15",
      color: "text-teal-300",
    },
    {
      label: "Pending",
      value: `${report.pendingCount} txns`,
      icon: Clock,
      bg: "bg-amber-500/15",
      color: "text-amber-300",
    },
    {
      label: "Failed",
      value: `${report.failedCount} txns`,
      icon: XCircle,
      bg: "bg-red-500/15",
      color: "text-red-300",
    },
    {
      label: "Avg. Payment",
      value: `₹${report.avgPaymentAmount.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      bg: "bg-blue-500/15",
      color: "text-blue-300",
    },
    {
      label: "Success Rate",
      value: `${report.successRate}%`,
      icon: Percent,
      bg: "bg-purple-500/15",
      color: "text-purple-300",
    },
  ];

  const statusPieData = report.paymentStatusBreakdown.map((d) => ({
    name: d.status,
    value: d.count,
  }));

  const purposeBarData = report.purposeBreakdown.map((d) => ({
    name: d.purpose,
    value: d.revenue,
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
              Financial Report
            </h1>
          </div>
        </div>
        <ExportButton href="/api/reports/financial" label="Export Financial CSV" />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
              <p className="mt-1 text-xl font-semibold text-white">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <RevenueChart data={report.monthlyRevenue} />

      {/* Status & Purpose Breakdown */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StatusPieChart
          data={statusPieData}
          title="Payment Status"
          description="Breakdown by payment status"
          colors={["#10b981", "#f59e0b", "#ef4444"]}
        />
        <DistributionBar
          data={purposeBarData}
          title="Revenue by Purpose"
          description="Revenue generated by payment purpose"
          color="#10b981"
        />
      </div>

      {/* Monthly Revenue Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30">
        <div className="mb-3 space-y-1">
          <p className="text-sm font-semibold text-white">
            Monthly Revenue Summary
          </p>
          <p className="text-xs text-slate-300">
            Revenue collected each month over the last 12 months
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Month</th>
                <th className="px-4 py-3 text-left font-semibold">Revenue</th>
                <th className="px-4 py-3 text-left font-semibold">
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody>
              {report.monthlyRevenue.map((month, idx) => (
                <tr
                  key={month.month}
                  className={idx % 2 ? "bg-white/5" : "bg-white/[0.02]"}
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {month.month}
                  </td>
                  <td className="px-4 py-3 text-emerald-300">
                    ₹{month.revenue.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {report.totalRevenue > 0
                      ? (
                          (month.revenue / report.totalRevenue) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Purpose Breakdown Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30">
        <div className="mb-3 space-y-1">
          <p className="text-sm font-semibold text-white">
            Revenue by Purpose
          </p>
          <p className="text-xs text-slate-300">
            Breakdown of revenue and transactions by payment purpose
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Purpose</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Transactions
                </th>
                <th className="px-4 py-3 text-left font-semibold">Revenue</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Avg. Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {report.purposeBreakdown.map((p, idx) => (
                <tr
                  key={p.purpose}
                  className={idx % 2 ? "bg-white/5" : "bg-white/[0.02]"}
                >
                  <td className="px-4 py-3 font-medium text-white">
                    {p.purpose}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{p.count}</td>
                  <td className="px-4 py-3 text-emerald-300">
                    ₹{p.revenue.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    ₹
                    {p.count > 0
                      ? Math.round(p.revenue / p.count).toLocaleString("en-IN")
                      : 0}
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
