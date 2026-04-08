import crypto from "crypto";
import { PaymentGateway } from "@prisma/client";
import type {
  IPaymentGateway,
  PaymentOrder,
  PaymentVerification,
} from "./gateway-interface";

export class PhonePeGateway implements IPaymentGateway {
  readonly gateway = PaymentGateway.PHONEPE;
  private merchantId: string | null = null;
  private saltKey: string | null = null;
  private saltIndex: string | null = null;
  private baseUrl: string;

  constructor() {
    this.merchantId = process.env.PHONEPE_MERCHANT_ID ?? null;
    this.saltKey = process.env.PHONEPE_SALT_KEY ?? null;
    this.saltIndex = process.env.PHONEPE_SALT_INDEX ?? "1";
    this.baseUrl =
      process.env.PHONEPE_ENVIRONMENT === "production"
        ? "https://api.phonepe.com/apis/hermes"
        : "https://api-preprod.phonepe.com/apis/pg-sandbox";
  }

  private generateChecksum(payload: string, endpoint: string): string {
    if (!this.saltKey || !this.saltIndex) {
      throw new Error("PhonePe salt key not configured");
    }

    const checksumString = payload + endpoint + this.saltKey;
    const checksum = crypto
      .createHash("sha256")
      .update(checksumString)
      .digest("hex");
    return `${checksum}###${this.saltIndex}`;
  }

  async createOrder(params: {
    amount: number;
    currency: string;
    receipt: string;
    notes?: Record<string, string>;
  }): Promise<PaymentOrder> {
    if (!this.merchantId || !this.saltKey) {
      throw new Error("PhonePe credentials not configured");
    }

    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const merchantTransactionId = `MT_${transactionId}`;

    const paymentRequest = {
      merchantId: this.merchantId,
      merchantTransactionId,
      merchantUserId: params.notes?.userId ?? `USER_${Date.now()}`,
      amount: Math.round(params.amount * 100), // Convert to paise
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/phonepe/redirect`,
      redirectMode: "POST",
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/phonepe`,
      mobileNumber: params.notes?.phone ?? "9999999999",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const base64Payload = Buffer.from(JSON.stringify(paymentRequest)).toString(
      "base64",
    );
    const checksum = this.generateChecksum(base64Payload, "/pg/v1/pay");

    const response = await fetch(`${this.baseUrl}/pg/v1/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      body: JSON.stringify({
        request: base64Payload,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message ?? "Failed to create PhonePe order");
    }

    return {
      orderId: merchantTransactionId,
      amount: params.amount,
      currency: params.currency,
      metadata: {
        instrumentResponse: data.data.instrumentResponse,
        redirectUrl: data.data.instrumentResponse.redirectInfo?.url,
      },
    };
  }

  async verifyPayment(params: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): Promise<PaymentVerification> {
    if (!this.merchantId || !this.saltKey) {
      return { success: false, error: "PhonePe credentials not configured" };
    }

    try {
      // Check transaction status
      const endpoint = `/pg/v1/status/${this.merchantId}/${params.orderId}`;
      const checksum = this.generateChecksum("", endpoint);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": this.merchantId,
        },
      });

      const data = await response.json();

      if (data.success && data.code === "PAYMENT_SUCCESS") {
        return {
          success: true,
          paymentId: data.data.transactionId,
          orderId: params.orderId,
        };
      }

      return {
        success: false,
        error: data.message ?? "Payment verification failed",
      };
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
    if (!this.merchantId || !this.saltKey) {
      throw new Error("PhonePe credentials not configured");
    }

    const endpoint = `/pg/v1/status/${this.merchantId}/${paymentId}`;
    const checksum = this.generateChecksum("", endpoint);

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": this.merchantId,
      },
    });

    const data = await response.json();

    return {
      id: data.data.transactionId,
      amount: data.data.amount / 100, // Convert from paise
      status: data.code,
      metadata: {
        paymentInstrument: data.data.paymentInstrument,
      },
    };
  }

  async refundPayment(
    paymentId: string,
    amount?: number,
  ): Promise<{ success: boolean; refundId?: string; error?: string }> {
    if (!this.merchantId || !this.saltKey) {
      return { success: false, error: "PhonePe credentials not configured" };
    }

    try {
      const merchantRefundId = `REFUND_${Date.now()}`;

      const refundRequest = {
        merchantId: this.merchantId,
        merchantTransactionId: paymentId,
        originalTransactionId: paymentId,
        amount: amount ? Math.round(amount * 100) : undefined, // Convert to paise
        callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/phonepe/refund`,
      };

      const base64Payload = Buffer.from(JSON.stringify(refundRequest)).toString(
        "base64",
      );
      const checksum = this.generateChecksum(base64Payload, "/pg/v1/refund");

      const response = await fetch(`${this.baseUrl}/pg/v1/refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
        body: JSON.stringify({
          request: base64Payload,
        }),
      });

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          refundId: merchantRefundId,
        };
      }

      return {
        success: false,
        error: data.message ?? "Refund failed",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Refund failed",
      };
    }
  }
}
