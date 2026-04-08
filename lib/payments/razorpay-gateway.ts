import Razorpay from "razorpay";
import crypto from "crypto";
import { PaymentGateway } from "@prisma/client";
import type {
  IPaymentGateway,
  PaymentOrder,
  PaymentVerification,
} from "./gateway-interface";

export class RazorpayGateway implements IPaymentGateway {
  readonly gateway = PaymentGateway.RAZORPAY;
  private client: Razorpay | null = null;

  constructor() {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (keyId && keySecret) {
      this.client = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
    }
  }

  async createOrder(params: {
    amount: number;
    currency: string;
    receipt: string;
    notes?: Record<string, string>;
  }): Promise<PaymentOrder> {
    if (!this.client) {
      throw new Error("Razorpay client not initialized");
    }

    const order = await this.client.orders.create({
      amount: params.amount * 100, // Convert to paise
      currency: params.currency,
      receipt: params.receipt,
      notes: params.notes,
    });

    return {
      orderId: order.id,
      amount: order.amount / 100,
      currency: order.currency,
      metadata: { notes: order.notes },
    };
  }

  async verifyPayment(params: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): Promise<PaymentVerification> {
    if (!this.client) {
      return { success: false, error: "Razorpay client not initialized" };
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return { success: false, error: "Razorpay secret key not configured" };
    }

    const body = `${params.orderId}|${params.paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature === params.signature) {
      return {
        success: true,
        paymentId: params.paymentId,
        orderId: params.orderId,
      };
    }

    return { success: false, error: "Invalid signature" };
  }

  async getPaymentDetails(paymentId: string): Promise<{
    id: string;
    amount: number;
    status: string;
    metadata?: Record<string, unknown>;
  }> {
    if (!this.client) {
      throw new Error("Razorpay client not initialized");
    }

    const payment = await this.client.payments.fetch(paymentId);

    return {
      id: payment.id,
      amount: payment.amount / 100,
      status: payment.status,
      metadata: { method: payment.method, email: payment.email },
    };
  }

  async refundPayment(
    paymentId: string,
    amount?: number,
  ): Promise<{ success: boolean; refundId?: string; error?: string }> {
    if (!this.client) {
      return { success: false, error: "Razorpay client not initialized" };
    }

    try {
      const refund = await this.client.payments.refund(paymentId, {
        amount: amount ? amount * 100 : undefined, // Convert to paise if provided
      });

      return {
        success: true,
        refundId: refund.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Refund failed",
      };
    }
  }
}
