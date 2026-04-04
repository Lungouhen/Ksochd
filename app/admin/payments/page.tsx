import { SectionCard } from "@/components/ui/section-card";
import {
  getPaymentMetrics,
  getRecentPayments,
} from "@/server/services/payment.service";

export default async function AdminPayments() {
  const [metrics, payments] = await Promise.all([
    getPaymentMetrics(),
    getRecentPayments(),
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Payments Overview</h2>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Payments", value: metrics.total, tone: "slate" },
          { label: "Completed", value: metrics.paid, tone: "teal" },
          { label: "Pending", value: metrics.pending, tone: "gold" },
          { label: "Failed", value: metrics.failed, tone: "slate" },
        ].map((metric) => (
          <div
            key={metric.label}
            className="glass-panel space-y-2 border-white/10 p-5"
          >
            <p className="text-xs uppercase tracking-wide text-slate-300">
              {metric.label}
            </p>
            <p className="text-3xl font-bold text-white">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-panel border-white/10 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">
            Revenue Summary
          </h3>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm text-slate-300">Total Revenue</p>
            <p className="text-2xl font-bold text-teal-400">
              ₹{metrics.totalRevenue}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-300">Membership Revenue</p>
            <p className="text-2xl font-bold text-teal-400">
              ₹{metrics.membershipRevenue}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-300">Event Revenue</p>
            <p className="text-2xl font-bold text-teal-400">
              ₹{metrics.eventRevenue}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-semibold text-white">
          Recent Payments
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {payments.map((payment) => (
            <SectionCard
              key={payment.id}
              title={payment.purpose}
              description={`₹${payment.amount} · ${payment.createdAt}`}
              items={[
                `Status: ${payment.status.toLowerCase()}`,
                payment.reference
                  ? `Razorpay reference: ${payment.reference}`
                  : "Awaiting Razorpay confirmation",
              ]}
              tone={payment.status === "PAID" ? "teal" : "gold"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
