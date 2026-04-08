import { withPrisma } from "@/lib/prisma";
import { PaymentStatus, PaymentGateway } from "@/types/domain";

export type PaymentRecord = {
  id: string;
  purpose: string;
  amount: number;
  status: PaymentStatus;
  gateway: PaymentGateway;
  createdAt: string;
  reference?: string;
};

const fallbackPayments: PaymentRecord[] = [
  {
    id: "pay-1",
    purpose: "Membership 2026",
    amount: 500,
    status: PaymentStatus.PAID,
    gateway: PaymentGateway.RAZORPAY,
    createdAt: "2026-04-02",
    reference: "rzp_Abc123",
  },
  {
    id: "pay-2",
    purpose: "Event: Career Mentorship",
    amount: 200,
    status: PaymentStatus.PENDING,
    gateway: PaymentGateway.RAZORPAY,
    createdAt: "2026-04-01",
    reference: "rzp_Xyz789",
  },
];

export async function getRecentPayments(): Promise<PaymentRecord[]> {
  return withPrisma(
    async (client) => {
      const payments = await client.payment.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
      });
      if (!payments.length) return fallbackPayments;

      return payments.map((payment) => ({
        id: payment.id,
        purpose: payment.purpose,
        amount: payment.amount,
        status: payment.status,
        gateway: payment.gateway,
        createdAt: payment.createdAt.toISOString().split("T")[0],
        reference: payment.gatewayPaymentId ?? undefined,
      }));
    },
    () => fallbackPayments,
  );
}

export async function getPaymentMetrics() {
  return withPrisma(
    async (client) => {
      const [paid, pending, failed, total] = await Promise.all([
        client.payment.count({ where: { status: PaymentStatus.PAID } }),
        client.payment.count({ where: { status: PaymentStatus.PENDING } }),
        client.payment.count({ where: { status: PaymentStatus.FAILED } }),
        client.payment.count(),
      ]);

      return { total, paid, pending, failed };
    },
    () => ({ total: 42, paid: 36, pending: 4, failed: 2 }),
  );
}
