import Stripe from "stripe";
import { PaymentGateway } from "@prisma/client";
import type {
  IPaymentGateway,
  PaymentOrder,
  PaymentVerification,
} from "./gateway-interface";

export class StripeGateway implements IPaymentGateway {
  readonly gateway = PaymentGateway.STRIPE;
  private client: Stripe | null = null;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (secretKey) {
      this.client = new Stripe(secretKey, {
        apiVersion: "2025-01-27.acacia",
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
      throw new Error("Stripe client not initialized");
    }

    const paymentIntent = await this.client.paymentIntents.create({
      amount: Math.round(params.amount * 100), // Convert to cents
      currency: params.currency.toLowerCase(),
      metadata: {
        receipt: params.receipt,
        ...params.notes,
      },
    });

    return {
      orderId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency.toUpperCase(),
      metadata: {
        clientSecret: paymentIntent.client_secret,
      },
    };
  }

  async verifyPayment(params: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): Promise<PaymentVerification> {
    if (!this.client) {
      return { success: false, error: "Stripe client not initialized" };
    }

    try {
      // For Stripe, we verify using webhook signature
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        return { success: false, error: "Stripe webhook secret not configured" };
      }

      // This is typically called from webhook handler with raw body
      // For now, we'll fetch the payment intent to verify
      const paymentIntent = await this.client.paymentIntents.retrieve(
        params.paymentId,
      );

      if (paymentIntent.status === "succeeded") {
        return {
          success: true,
          paymentId: paymentIntent.id,
          orderId: params.orderId,
        };
      }

      return { success: false, error: `Payment status: ${paymentIntent.status}` };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Verification failed",
      };
    }
  }

  async getPaymentDetails(paymentId: string): Promise<{
    id: string;
    amount: number;
    status: string;
    metadata?: Record<string, unknown>;
  }> {
    if (!this.client) {
      throw new Error("Stripe client not initialized");
    }

    const paymentIntent = await this.client.paymentIntents.retrieve(paymentId);

    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      status: paymentIntent.status,
      metadata: paymentIntent.metadata,
    };
  }

  async refundPayment(
    paymentId: string,
    amount?: number,
  ): Promise<{ success: boolean; refundId?: string; error?: string }> {
    if (!this.client) {
      return { success: false, error: "Stripe client not initialized" };
    }

    try {
      const refund = await this.client.refunds.create({
        payment_intent: paymentId,
        amount: amount ? Math.round(amount * 100) : undefined,
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

  /**
   * Verify webhook signature (to be called from webhook handler)
   */
  verifyWebhookSignature(
    payload: string,
    signature: string,
  ): Stripe.Event | null {
    if (!this.client) {
      return null;
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return null;
    }

    try {
      return this.client.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch {
      return null;
    }
  }
}
