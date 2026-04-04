import { BrowserPie } from "@/components/admin/BrowserPie";
import { VisitorsChart } from "@/components/admin/VisitorsChart";
import { Card } from "@/components/admin/shared/Card";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Visitors", value: "12.4k", change: "+8.2%" },
          { label: "Members", value: "1,284", change: "+3.1%" },
          { label: "Payments", value: "₹72.4k", change: "+5.6%" },
          { label: "Events", value: "18 active", change: "+1" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30"
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {stat.label}
            </p>
            <p className="text-2xl font-semibold text-white">{stat.value}</p>
            <p className="text-xs text-emerald-300">{stat.change} vs last week</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <VisitorsChart />
        </div>
        <BrowserPie />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Top Country", value: "India", sub: "82% of sessions" },
          { title: "Bounce Rate", value: "38%", sub: "-4% improvement" },
          { title: "Avg. Session", value: "3m 42s", sub: "+12s" },
        ].map((item) => (
          <Card key={item.title} title={item.title} description={item.sub}>
            <p className="text-xl font-semibold text-white">{item.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
