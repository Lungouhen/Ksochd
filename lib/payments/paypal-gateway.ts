import { PaymentGateway } from "@prisma/client";
import type {
  IPaymentGateway,
  PaymentOrder,
  PaymentVerification,
} from "./gateway-interface";

// PayPal SDK types
type PayPalOrderResponse = {
  id: string;
  status: string;
  purchase_units: Array<{
    amount: {
      currency_code: string;
      value: string;
    };
  }>;
};

export class PayPalGateway implements IPaymentGateway {
  readonly gateway = PaymentGateway.PAYPAL;
  private clientId: string | null = null;
  private clientSecret: string | null = null;
  private baseUrl: string;

  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID ?? null;
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET ?? null;
    this.baseUrl =
      process.env.PAYPAL_MODE === "live"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";
  }

  private async getAccessToken(): Promise<string> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error("PayPal credentials not configured");
    }

    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString(
      "base64",
    );

    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();
    return data.access_token;
  }

  async createOrder(params: {
    amount: number;
    currency: string;
    receipt: string;
    notes?: Record<string, string>;
  }): Promise<PaymentOrder> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error("PayPal client not initialized");
    }

    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: params.receipt,
            amount: {
              currency_code: params.currency,
              value: params.amount.toFixed(2),
            },
            custom_id: params.receipt,
            description: params.notes?.description ?? "Payment",
          },
        ],
      }),
    });

    const order: PayPalOrderResponse = await response.json();

    return {
      orderId: order.id,
      amount: params.amount,
      currency: params.currency,
      metadata: { notes: params.notes },
    };
  }

  async verifyPayment(params: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): Promise<PaymentVerification> {
    if (!this.clientId || !this.clientSecret) {
      return { success: false, error: "PayPal client not initialized" };
    }

    try {
      const accessToken = await this.getAccessToken();

      // Capture the order
      const response = await fetch(
        `${this.baseUrl}/v2/checkout/orders/${params.orderId}/capture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (data.status === "COMPLETED") {
        return {
          success: true,
          paymentId: data.id,
          orderId: params.orderId,
        };
      }

      return { success: false, error: `Payment status: ${data.status}` };
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
    if (!this.clientId || !this.clientSecret) {
      throw new Error("PayPal client not initialized");
    }

    const accessToken = await this.getAccessToken();

    const response = await fetch(
      `${this.baseUrl}/v2/checkout/orders/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const order: PayPalOrderResponse = await response.json();

    return {
      id: order.id,
      amount: parseFloat(order.purchase_units[0].amount.value),
      status: order.status,
      metadata: {},
    };
  }

  async refundPayment(
    paymentId: string,
    amount?: number,
  ): Promise<{ success: boolean; refundId?: string; error?: string }> {
    if (!this.clientId || !this.clientSecret) {
      return { success: false, error: "PayPal client not initialized" };
    }

    try {
      const accessToken = await this.getAccessToken();

      // First, get the capture ID from the order
      const orderResponse = await fetch(
        `${this.baseUrl}/v2/checkout/orders/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const orderData = await orderResponse.json();
      const captureId =
        orderData.purchase_units?.[0]?.payments?.captures?.[0]?.id;

      if (!captureId) {
        return { success: false, error: "No capture found for this order" };
      }

      // Perform the refund
      const refundResponse = await fetch(
        `${this.baseUrl}/v2/payments/captures/${captureId}/refund`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: amount
            ? JSON.stringify({
                amount: {
                  value: amount.toFixed(2),
                  currency_code: "INR",
                },
              })
            : undefined,
        },
      );

      const refundData = await refundResponse.json();

      return {
        success: true,
        refundId: refundData.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Refund failed",
      };
    }
  }
}
