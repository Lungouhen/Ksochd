"use client";

import { useState, useEffect } from "react";
import { PaymentStatus } from "@prisma/client";
import { toast } from "sonner";

type Payment = {
  id: string;
  amount: number;
  status: PaymentStatus;
  purpose: string;
  membershipType?: string | null;
  createdAt: string;
  razorpayPaymentId?: string | null;
};

export function PaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch("/api/payments");
      if (!response.ok) throw new Error("Failed to fetch payments");
      const data = await response.json();
      setPayments(data.payments || []);
    } catch {
      toast.error("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    const styles: Record<PaymentStatus, string> = {
      PAID: "bg-green-500/20 text-green-300",
      PENDING: "bg-yellow-500/20 text-yellow-300",
      FAILED: "bg-red-500/20 text-red-300",
    };

    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading payment history...</div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center text-slate-400">
          <p className="text-lg">No payment history</p>
          <p className="text-sm">Your payments will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th className="pb-3 text-sm font-medium text-slate-300">Date</th>
            <th className="pb-3 text-sm font-medium text-slate-300">Purpose</th>
            <th className="pb-3 text-sm font-medium text-slate-300">Amount</th>
            <th className="pb-3 text-sm font-medium text-slate-300">Status</th>
            <th className="pb-3 text-sm font-medium text-slate-300">
              Transaction ID
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b border-white/5">
              <td className="py-4 text-sm text-slate-200">
                {new Date(payment.createdAt).toLocaleDateString("en-IN")}
              </td>
              <td className="py-4 text-sm text-slate-200">
                {payment.purpose}
                {payment.membershipType && (
                  <span className="ml-2 text-xs text-slate-400">
                    ({payment.membershipType})
                  </span>
                )}
              </td>
              <td className="py-4 text-sm font-medium text-white">
                ₹{payment.amount}
              </td>
              <td className="py-4">{getStatusBadge(payment.status)}</td>
              <td className="py-4 text-xs text-slate-400">
                {payment.razorpayPaymentId || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
