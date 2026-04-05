"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Shield, Lock, CreditCard, Loader2, ArrowLeft } from "lucide-react";

export default function PaymentCheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const amount = searchParams.get("amount") ?? "0";
  const purpose = searchParams.get("purpose") ?? "Event Registration";

  function handlePayment() {
    setProcessing(true);
    setTimeout(() => {
      const paymentId = `pay_${Date.now().toString(36)}`;
      router.push(
        `/payments/success?id=${paymentId}&amount=${amount}&purpose=${encodeURIComponent(purpose)}&date=${new Date().toISOString().split("T")[0]}&ref=rzp_${paymentId}`,
      );
    }, 2000);
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-white/10 bg-white/5 p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-500/20">
            <CreditCard className="h-7 w-7 text-teal-400" />
          </div>
          <h1 className="text-xl font-bold text-white">Checkout</h1>
          <p className="mt-1 text-sm text-slate-400">
            Complete your payment securely
          </p>
        </div>

        <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Order Summary
          </h2>
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">{purpose}</span>
            <span className="font-medium text-white">₹{amount}</span>
          </div>
          <div className="border-t border-white/10 pt-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-white">Total</span>
              <span className="text-lg font-bold text-teal-400">₹{amount}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Shield className="h-3.5 w-3.5" />
            <span>SSL Secure</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="h-3.5 w-3.5" />
            <span>Encrypted</span>
          </div>
          <div className="flex items-center gap-1">
            <CreditCard className="h-3.5 w-3.5" />
            <span>Razorpay</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={processing}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              Pay ₹{amount} with Razorpay
            </>
          )}
        </button>

        <div className="text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Cancel and return to events
          </Link>
        </div>
      </div>
    </div>
  );
}
