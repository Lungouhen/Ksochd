import { SectionCard } from "@/components/ui/section-card";
import { Pill } from "@/components/ui/pill";
import { getAdminSummary } from "@/server/services/user.service";
import { getRecentPayments } from "@/server/services/payment.service";

export default async function AdminDashboard() {
  const [summary, payments] = await Promise.all([
    getAdminSummary(),
    getRecentPayments(),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Pill label="Ops Health" tone="gold" />
        <p className="text-sm text-slate-200/80">
          Single-stream RBAC ensures admins see the same core with elevated
          controls.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Membership snapshot"
          description="Live counts pulled from Prisma once wired."
          items={[
            `${summary.activeMembers} active members`,
            `${summary.pendingApprovals} pending approvals`,
            `${summary.moderators} moderators`,
            `Last payment on ${summary.lastPayment}`,
          ]}
          tone="gold"
        />
        <SectionCard
          title="Latest payments"
          description="Razorpay-ready webhook path lives under /api/webhooks/razorpay."
          items={payments.map(
            (payment) =>
              `${payment.purpose} · ₹${payment.amount} · ${payment.status.toLowerCase()}`,
          )}
          cta={{ href: "/admin/analytics", label: "View analytics" }}
          tone="teal"
        />
      </div>
    </div>
  );
}
