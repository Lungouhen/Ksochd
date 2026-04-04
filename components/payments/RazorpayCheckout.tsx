"use client";

import { useState } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: {
      new (options: Record<string, unknown>): {
        open: () => void;
      };
    };
  }
}

type CheckoutProps = {
  type: "membership" | "event";
  membershipType?: "individual" | "family";
  eventId?: string;
  customAmount?: number;
  onSuccess?: () => void;
  onFailure?: () => void;
};

export function RazorpayCheckout({
  type,
  membershipType,
  eventId,
  customAmount,
  onSuccess,
  onFailure,
}: CheckoutProps) {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway");
        setLoading(false);
        return;
      }

      // Create order
      const response = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          membershipType,
          eventId,
          customAmount,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Failed to create order");
        setLoading(false);
        return;
      }

      const order = await response.json();

      // Initialize Razorpay
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "KSOCHD",
        description:
          type === "membership" ? "Membership Fee" : "Event Registration",
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyResponse.ok) {
              toast.success("Payment successful!");
              onSuccess?.();
            } else {
              toast.error("Payment verification failed");
              onFailure?.();
            }
          } catch {
            toast.error("Payment verification failed");
            onFailure?.();
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled");
            setLoading(false);
            onFailure?.();
          },
        },
        theme: {
          color: "#14b8a6",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch {
      toast.error("Failed to initiate payment");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="rounded-lg bg-teal-500 px-6 py-3 font-medium text-white transition hover:bg-teal-600 disabled:opacity-50"
    >
      {loading ? "Processing..." : "Pay Now"}
    </button>
  );
}
