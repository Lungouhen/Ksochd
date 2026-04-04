import { PaymentStatus } from "@/types/domain";

export type PaymentRecord = {
  id: string;
  purpose: string;
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  reference?: string;
};

export async function getRecentPayments(): Promise<PaymentRecord[]> {
  return [
    {
      id: "pay-1",
      purpose: "Membership 2026",
      amount: 500,
      status: PaymentStatus.PAID,
      createdAt: "2026-04-02",
      reference: "rzp_Abc123",
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
}
