import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  CalendarDays,
  CalendarCheck2,
  CalendarClock,
  Users,
  TrendingUp,
  IndianRupee,
  ArrowLeft,
} from "lucide-react";
import { getEventReport } from "@/server/services/report.service";
import { ExportButton } from "@/components/admin/reports/ExportButton";

const RegistrationTrendChart = dynamic(
  () =>
    import("@/components/admin/reports/RegistrationTrendChart").then((mod) => ({
      default: mod.RegistrationTrendChart,
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

export const metadata: Metadata = {
  title: "Events Report – KSO Admin",
  description:
    "Event performance analytics, registration trends, and attendance reports for KSO Chandigarh.",
  robots: { index: false, follow: false },
};

export default async function EventsReportPage() {
  const report = await getEventReport();

  const summaryCards = [
    {
      label: "Total Events",
      value: String(report.totalEvents),
      icon: CalendarDays,
      bg: "bg-blue-500/15",
      color: "text-blue-300",
    },
    {
      label: "Upcoming",
      value: String(report.upcomingEvents),
      icon: CalendarClock,
      bg: "bg-teal-500/15",
      color: "text-teal-300",
    },
    {
      label: "Completed",
      value: String(report.completedEvents),
      icon: CalendarCheck2,
      bg: "bg-emerald-500/15",
      color: "text-emerald-300",
    },
    {
      label: "Total Registrations",
      value: report.totalRegistrations.toLocaleString("en-IN"),
      icon: Users,
      bg: "bg-purple-500/15",
      color: "text-purple-300",
    },
    {
      label: "Avg. Per Event",
      value: String(report.avgRegistrationsPerEvent),
      icon: TrendingUp,
      bg: "bg-amber-500/15",
      color: "text-amber-300",
    },
    {
      label: "Event Revenue",
      value: `₹${report.totalEventRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      bg: "bg-emerald-500/15",
      color: "text-emerald-300",
    },
  ];

  const registrationStatusPie = report.registrationStatusBreakdown.map(
    (d) => ({
      name: d.status,
      value: d.count,
    }),
  );

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
            <h1 className="text-2xl font-semibold text-white">Events Report</h1>
          </div>
        </div>
        <ExportButton href="/api/reports/events" label="Export Events CSV" />
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

      {/* Registration Trend Chart */}
      <RegistrationTrendChart data={report.monthlyRegistrations} />

      {/* Registration Status Pie */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StatusPieChart
          data={registrationStatusPie}
          title="Registration Status"
          description="Breakdown by registration status"
          colors={["#10b981", "#f59e0b", "#ef4444"]}
        />

        {/* Monthly Registrations Table */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30">
          <div className="mb-3 space-y-1">
            <p className="text-sm font-semibold text-white">
              Monthly Registrations
            </p>
            <p className="text-xs text-slate-300">
              Event registrations per month
            </p>
          </div>
          <div className="max-h-72 overflow-y-auto">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 bg-slate-900 text-slate-200">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Month</th>
                  <th className="px-4 py-2 text-left font-semibold">
                    Registrations
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.monthlyRegistrations.map((m, idx) => (
                  <tr
                    key={m.month}
                    className={idx % 2 ? "bg-white/5" : "bg-white/[0.02]"}
                  >
                    <td className="px-4 py-2 text-white">{m.month}</td>
                    <td className="px-4 py-2 text-slate-300">{m.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Events Table */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30">
        <div className="mb-3 space-y-1">
          <p className="text-sm font-semibold text-white">
            Top Events by Registration
          </p>
          <p className="text-xs text-slate-300">
            Events ranked by total registrations
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">Event</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-left font-semibold">Venue</th>
                <th className="px-4 py-3 text-left font-semibold">Fee</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Registrations
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Confirmed
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Cancelled
                </th>
                <th className="px-4 py-3 text-left font-semibold">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {report.topEvents.map((event, idx) => (
                <tr
                  key={event.id}
                  className={idx % 2 ? "bg-white/5" : "bg-white/[0.02]"}
                >
                  <td className="px-4 py-3 text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-white">
                    {event.title}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{event.date}</td>
                  <td className="px-4 py-3 text-slate-400">{event.venue}</td>
                  <td className="px-4 py-3 text-slate-300">
                    {event.fee > 0
                      ? `₹${event.fee.toLocaleString("en-IN")}`
                      : "Free"}
                  </td>
                  <td className="px-4 py-3 font-medium text-blue-300">
                    {event.registrations}
                  </td>
                  <td className="px-4 py-3 text-emerald-300">
                    {event.confirmed}
                  </td>
                  <td className="px-4 py-3 text-red-300">{event.cancelled}</td>
                  <td className="px-4 py-3 font-medium text-emerald-300">
                    {event.revenue > 0
                      ? `₹${event.revenue.toLocaleString("en-IN")}`
                      : "—"}
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
