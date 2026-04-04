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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Payments overview</h2>

      <div className="grid gap-3 md:grid-cols-4">
        {[
          { label: "Total", value: metrics.total, tone: "slate" },
          { label: "Paid", value: metrics.paid, tone: "teal" },
          { label: "Pending", value: metrics.pending, tone: "gold" },
          { label: "Failed", value: metrics.failed, tone: "slate" },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <p className="text-xs uppercase tracking-wide text-slate-300">
              {metric.label}
            </p>
            <p className="text-2xl font-semibold text-white">{metric.value}</p>
          </div>
        ))}
      </div>

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
  );
}
