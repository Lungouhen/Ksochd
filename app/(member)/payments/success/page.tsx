"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Download, ArrowLeft, CreditCard } from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();

  const paymentId = searchParams.get("id") ?? "pay_unknown";
  const amount = searchParams.get("amount") ?? "0";
  const purpose = searchParams.get("purpose") ?? "Payment";
  const date =
    searchParams.get("date") ?? new Date().toISOString().split("T")[0];
  const reference = searchParams.get("ref") ?? paymentId;

  function handleDownloadReceipt() {
    const receiptContent = [
      "═══════════════════════════════════════",
      "        KSO CHANDIGARH - RECEIPT       ",
      "═══════════════════════════════════════",
      "",
      `  Payment ID:    ${paymentId}`,
      `  Purpose:       ${purpose}`,
      `  Amount:        ₹${amount}`,
      `  Date:          ${date}`,
      `  Reference:     ${reference}`,
      `  Status:        PAID`,
      "",
      "═══════════════════════════════════════",
      "  Thank you for your payment!          ",
      "  KSO Chandigarh | ksochd.org          ",
      "═══════════════════════════════════════",
    ].join("\n");

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `KSO-Receipt-${paymentId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-white/10 bg-white/5 p-8 text-center">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white">Payment Successful!</h1>
          <p className="mt-2 text-sm text-slate-400">
            Your payment has been processed successfully.
          </p>
        </div>

        <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Purpose</span>
            <span className="font-medium text-white">{purpose}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Amount</span>
            <span className="font-medium text-emerald-400">₹{amount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Date</span>
            <span className="font-medium text-white">{date}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Reference</span>
            <span className="font-mono text-xs text-white">{reference}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleDownloadReceipt}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-teal-500"
          >
            <Download className="h-4 w-4" />
            Download Receipt
          </button>

          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/payments"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:text-white"
            >
              <CreditCard className="h-4 w-4" />
              All Payments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
