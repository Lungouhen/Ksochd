import crypto from "crypto";
import { PaymentGateway } from "@prisma/client";
import type {
  IPaymentGateway,
  PaymentOrder,
  PaymentVerification,
} from "./gateway-interface";

export class CCAvenueGateway implements IPaymentGateway {
  readonly gateway = PaymentGateway.CCAVENUE;
  private merchantId: string | null = null;
  private accessCode: string | null = null;
  private workingKey: string | null = null;
  private baseUrl: string;

  constructor() {
    this.merchantId = process.env.CCAVENUE_MERCHANT_ID ?? null;
    this.accessCode = process.env.CCAVENUE_ACCESS_CODE ?? null;
    this.workingKey = process.env.CCAVENUE_WORKING_KEY ?? null;
    this.baseUrl =
      process.env.CCAVENUE_ENVIRONMENT === "production"
        ? "https://secure.ccavenue.com"
        : "https://test.ccavenue.com";
  }

  private encrypt(plainText: string): string {
    if (!this.workingKey) {
      throw new Error("CCAvenue working key not configured");
    }

    const key = crypto
      .createHash("md5")
      .update(this.workingKey)
      .digest("hex")
      .substring(0, 32);
    const iv = Buffer.alloc(16, 0);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);

    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  }

  private decrypt(encryptedText: string): string {
    if (!this.workingKey) {
      throw new Error("CCAvenue working key not configured");
    }

    const key = crypto
      .createHash("md5")
      .update(this.workingKey)
      .digest("hex")
      .substring(0, 32);
    const iv = Buffer.alloc(16, 0);
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(key),
      iv,
    );

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  async createOrder(params: {
    amount: number;
    currency: string;
    receipt: string;
    notes?: Record<string, string>;
  }): Promise<PaymentOrder> {
    if (!this.merchantId || !this.accessCode || !this.workingKey) {
      throw new Error("CCAvenue credentials not configured");
    }

    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const orderParams = [
      `merchant_id=${this.merchantId}`,
      `order_id=${orderId}`,
      `amount=${params.amount.toFixed(2)}`,
      `currency=${params.currency}`,
      `redirect_url=${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/ccavenue/redirect`,
      `cancel_url=${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/ccavenue/cancel`,
      `language=EN`,
      `billing_name=${params.notes?.name ?? "Customer"}`,
      `billing_tel=${params.notes?.phone ?? ""}`,
      `billing_email=${params.notes?.email ?? ""}`,
      `delivery_name=${params.notes?.name ?? "Customer"}`,
      `merchant_param1=${params.receipt}`,
      `merchant_param2=${params.notes?.userId ?? ""}`,
    ].join("&");

    const encryptedOrder = this.encrypt(orderParams);

    return {
      orderId,
      amount: params.amount,
      currency: params.currency,
      metadata: {
        encRequest: encryptedOrder,
        accessCode: this.accessCode,
        paymentUrl: `${this.baseUrl}/transaction/transaction.do?command=initiateTransaction`,
      },
    };
  }

  async verifyPayment(params: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): Promise<PaymentVerification> {
    if (!this.merchantId || !this.workingKey) {
      return { success: false, error: "CCAvenue credentials not configured" };
    }

    try {
      // Decrypt the response
      const decryptedData = this.decrypt(params.signature);
      const responseParams = new URLSearchParams(decryptedData);

      const orderStatus = responseParams.get("order_status");
      const trackingId = responseParams.get("tracking_id");
      const orderIdFromResponse = responseParams.get("order_id");

      if (
        orderStatus === "Success" &&
        orderIdFromResponse === params.orderId
      ) {
        return {
          success: true,
          paymentId: trackingId ?? params.paymentId,
          orderId: params.orderId,
        };
      }

      return {
        success: false,
        error: responseParams.get("failure_message") ?? "Payment failed",
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
    if (!this.merchantId || !this.accessCode || !this.workingKey) {
      throw new Error("CCAvenue credentials not configured");
    }

    // CCAvenue requires order_id for status inquiry, not tracking_id
    // This is a limitation - you'd need to maintain orderId mapping
    throw new Error(
      "CCAvenue requires orderId for status check. Use orderId instead of paymentId.",
    );
  }

  async refundPayment(
    paymentId: string,
    amount?: number,
  ): Promise<{ success: boolean; refundId?: string; error?: string }> {
    if (!this.merchantId || !this.accessCode || !this.workingKey) {
      return { success: false, error: "CCAvenue credentials not configured" };
    }

    try {
      // CCAvenue refund API requires specific merchant authorization
      // This is typically done through merchant panel or API (if enabled)
      const refundParams = [
        `merchant_id=${this.merchantId}`,
        `reference_no=${paymentId}`,
        `refund_amount=${amount?.toFixed(2) ?? ""}`,
        `refund_ref_no=REFUND_${Date.now()}`,
      ].join("&");

      const encryptedRequest = this.encrypt(refundParams);

      // Note: CCAvenue refund endpoint varies by merchant configuration
      const response = await fetch(`${this.baseUrl}/transaction/refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `enc_request=${encodeURIComponent(encryptedRequest)}&access_code=${this.accessCode}`,
      });

      const encryptedResponse = await response.text();
      const decryptedResponse = this.decrypt(encryptedResponse);
      const responseParams = new URLSearchParams(decryptedResponse);

      if (responseParams.get("refund_status") === "Success") {
        return {
          success: true,
          refundId: responseParams.get("refund_ref_no") ?? undefined,
        };
      }

      return {
        success: false,
        error: responseParams.get("status_message") ?? "Refund failed",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Refund failed",
      };
    }
  }
}
