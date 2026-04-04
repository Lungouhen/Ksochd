import { withPrisma } from "@/lib/prisma";
import { PaymentStatus } from "@/types/domain";

export type PaymentRecord = {
  id: string;
  purpose: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  reference?: string;
  membershipType?: string;
  eventId?: string;
};

const fallbackPayments: PaymentRecord[] = [
  {
    id: "pay-1",
    purpose: "Membership 2026",
    amount: 500,
    status: PaymentStatus.PAID,
    createdAt: "2026-04-02",
    reference: "rzp_Abc123",
    membershipType: "individual",
  },
  {
    id: "pay-2",
    purpose: "Event: Career Mentorship",
    amount: 200,
    status: PaymentStatus.PENDING,
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
        createdAt: payment.createdAt.toISOString().split("T")[0],
        reference: payment.razorpayPaymentId ?? payment.razorpayOrderId ?? undefined,
        membershipType: payment.membershipType ?? undefined,
        eventId: payment.eventId ?? undefined,
      }));
    },
    () => fallbackPayments,
  );
}

export async function getUserPayments(userId: string): Promise<PaymentRecord[]> {
  return withPrisma(
    async (client) => {
      const payments = await client.payment.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      return payments.map((payment) => ({
        id: payment.id,
        purpose: payment.purpose,
        amount: payment.amount,
        status: payment.status,
        createdAt: payment.createdAt.toISOString().split("T")[0],
        reference: payment.razorpayPaymentId ?? payment.razorpayOrderId ?? undefined,
        membershipType: payment.membershipType ?? undefined,
        eventId: payment.eventId ?? undefined,
      }));
    },
    () => fallbackPayments,
  );
}

export async function getPaymentMetrics() {
  return withPrisma(
    async (client) => {
      const [paid, pending, failed, total, totalRevenue, membershipRev, eventRev] = await Promise.all([
        client.payment.count({ where: { status: PaymentStatus.PAID } }),
        client.payment.count({ where: { status: PaymentStatus.PENDING } }),
        client.payment.count({ where: { status: PaymentStatus.FAILED } }),
        client.payment.count(),
        client.payment.aggregate({
          where: { status: PaymentStatus.PAID },
          _sum: { amount: true },
        }),
        client.payment.aggregate({
          where: { status: PaymentStatus.PAID, purpose: { contains: "Membership" } },
          _sum: { amount: true },
        }),
        client.payment.aggregate({
          where: { status: PaymentStatus.PAID, purpose: { contains: "Event" } },
          _sum: { amount: true },
        }),
      ]);

      return {
        total,
        paid,
        pending,
        failed,
        totalRevenue: totalRevenue._sum.amount || 0,
        membershipRevenue: membershipRev._sum.amount || 0,
        eventRevenue: eventRev._sum.amount || 0,
      };
    },
    () => ({
      total: 42,
      paid: 36,
      pending: 4,
      failed: 2,
      totalRevenue: 18000,
      membershipRevenue: 12000,
      eventRevenue: 6000,
    }),
  );
}

export async function createPaymentRecord(data: {
  userId: string;
  amount: number;
  purpose: string;
  membershipType?: string;
  eventId?: string;
  razorpayOrderId?: string;
}) {
  return withPrisma(
    async (client) => {
      return await client.payment.create({
        data: {
          userId: data.userId,
          amount: data.amount,
          purpose: data.purpose,
          membershipType: data.membershipType,
          eventId: data.eventId,
          razorpayOrderId: data.razorpayOrderId,
          status: PaymentStatus.PENDING,
        },
      });
    },
    () => null,
  );
}

export async function updatePaymentStatus(
  razorpayOrderId: string,
  status: PaymentStatus,
  razorpayPaymentId?: string,
  razorpaySignature?: string,
) {
  return withPrisma(
    async (client) => {
      return await client.payment.updateMany({
        where: { razorpayOrderId },
        data: {
          status,
          razorpayPaymentId,
          razorpaySignature,
          updatedAt: new Date(),
        },
      });
    },
    () => null,
  );
}

export async function getPaymentByOrderId(orderId: string) {
  return withPrisma(
    async (client) => {
      return await client.payment.findFirst({
        where: { razorpayOrderId: orderId },
        include: { user: true },
      });
    },
    () => null,
  );
}
