import { SectionCard } from "@/components/ui/section-card";
import { getRecentPayments } from "@/server/services/payment.service";

export default async function MemberPayments() {
  const payments = await getRecentPayments();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Payments</h2>
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
            tone="gold"
          />
        ))}
      </div>
    </div>
  );
}
