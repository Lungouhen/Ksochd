"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Shield, Lock, CreditCard, Loader2, ArrowLeft } from "lucide-react";

type PaymentGateway = "RAZORPAY" | "STRIPE" | "PAYPAL";

export default function PaymentCheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [selectedGateway, setSelectedGateway] =
    useState<PaymentGateway>("RAZORPAY");
  const [availableGateways, setAvailableGateways] = useState<PaymentGateway[]>(
    ["RAZORPAY"],
  );

  const amount = searchParams.get("amount") ?? "0";
  const purpose = searchParams.get("purpose") ?? "Event Registration";

  useEffect(() => {
    // Fetch available payment gateways
    fetch("/api/payments/gateways")
      .then((res) => res.json())
      .then((data) => {
        if (data.gateways && data.gateways.length > 0) {
          setAvailableGateways(data.gateways);
          setSelectedGateway(data.active ?? data.gateways[0]);
        }
      })
      .catch(() => {
        // Keep default gateway
      });
  }, []);

  async function handlePayment() {
    setProcessing(true);
    try {
      // Create payment order
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          purpose,
          userId: "user_temp", // TODO: Get from session
          gateway: selectedGateway,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to create payment order");
      }

      // Redirect to success page (in production, integrate with actual gateway SDKs)
      setTimeout(() => {
        router.push(
          `/payments/success?id=${data.paymentId}&amount=${amount}&purpose=${encodeURIComponent(purpose)}&date=${new Date().toISOString().split("T")[0]}&ref=${data.orderId}&gateway=${selectedGateway}`,
        );
      }, 2000);
    } catch (error) {
      console.error("Payment error:", error);
      setProcessing(false);
      alert("Payment failed. Please try again.");
    }
  }

  const gatewayLabels: Record<PaymentGateway, string> = {
    RAZORPAY: "Razorpay",
    STRIPE: "Stripe",
    PAYPAL: "PayPal",
  };

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

        {availableGateways.length > 1 && (
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableGateways.map((gateway) => (
                <button
                  key={gateway}
                  onClick={() => setSelectedGateway(gateway)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    selectedGateway === gateway
                      ? "border-teal-400 bg-teal-400/10 text-teal-400"
                      : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {gatewayLabels[gateway]}
                </button>
              ))}
            </div>
          </div>
        )}

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
            <span>{gatewayLabels[selectedGateway]}</span>
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
              Pay ₹{amount} with {gatewayLabels[selectedGateway]}
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
