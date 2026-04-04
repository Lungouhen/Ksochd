import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay instance (server-side only)
export function getRazorpayInstance() {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials not configured");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

// Create a Razorpay order
export async function createRazorpayOrder(options: {
  amount: number; // in paise (e.g., 50000 for ₹500)
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}) {
  const razorpay = getRazorpayInstance();

  const order = await razorpay.orders.create({
    amount: options.amount,
    currency: options.currency || "INR",
    receipt: options.receipt,
    notes: options.notes,
  });

  return order;
}

// Verify Razorpay payment signature
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    throw new Error("Razorpay key secret not configured");
  }

  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
}

// Verify webhook signature
export function verifyWebhookSignature(
  payload: string,
  signature: string,
): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("Razorpay webhook secret not configured");
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(payload)
    .digest("hex");

  return expectedSignature === signature;
}

// Get payment fees configuration
export function getPaymentConfig() {
  return {
    membershipFees: {
      individual:
        parseInt(process.env.MEMBERSHIP_FEE_INDIVIDUAL || "500", 10) * 100, // Convert to paise
      family: parseInt(process.env.MEMBERSHIP_FEE_FAMILY || "1000", 10) * 100,
    },
  };
}
