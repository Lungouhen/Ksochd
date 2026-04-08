import crypto from "crypto";
import { PaymentGateway } from "@prisma/client";
import type {
  IPaymentGateway,
  PaymentOrder,
  PaymentVerification,
} from "./gateway-interface";

export class PaytmGateway implements IPaymentGateway {
  readonly gateway = PaymentGateway.PAYTM;
  private merchantId: string | null = null;
  private merchantKey: string | null = null;
  private baseUrl: string;

  constructor() {
    this.merchantId = process.env.PAYTM_MERCHANT_ID ?? null;
    this.merchantKey = process.env.PAYTM_MERCHANT_KEY ?? null;
    this.baseUrl =
      process.env.PAYTM_ENVIRONMENT === "production"
        ? "https://securegw.paytm.in"
        : "https://securegw-stage.paytm.in";
  }

  private generateChecksum(data: Record<string, unknown>): string {
    if (!this.merchantKey) {
      throw new Error("Paytm merchant key not configured");
    }

    const sortedData = Object.keys(data)
      .sort()
      .reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {} as Record<string, unknown>);

    const dataString = JSON.stringify(sortedData);
    return crypto
      .createHmac("sha256", this.merchantKey)
      .update(dataString)
      .digest("hex");
  }

  async createOrder(params: {
    amount: number;
    currency: string;
    receipt: string;
    notes?: Record<string, string>;
  }): Promise<PaymentOrder> {
    if (!this.merchantId || !this.merchantKey) {
      throw new Error("Paytm credentials not configured");
    }

    const orderId = `ORDER_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const requestBody = {
      body: {
        requestType: "Payment",
        mid: this.merchantId,
        websiteName: process.env.PAYTM_WEBSITE ?? "DEFAULT",
        orderId,
        txnAmount: {
          value: params.amount.toFixed(2),
          currency: params.currency,
        },
        userInfo: {
          custId: params.notes?.userId ?? "CUST_001",
        },
        callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/paytm`,
      },
    };

    const checksum = this.generateChecksum(requestBody.body);

    const response = await fetch(
      `${this.baseUrl}/theia/api/v1/initiateTransaction?mid=${this.merchantId}&orderId=${orderId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-mid": this.merchantId,
          "x-checksum": checksum,
        },
        body: JSON.stringify(requestBody),
      },
    );

    const data = await response.json();

    if (data.body.resultInfo.resultStatus !== "S") {
      throw new Error(
        data.body.resultInfo.resultMsg ?? "Failed to create Paytm order",
      );
    }

    return {
      orderId,
      amount: params.amount,
      currency: params.currency,
      metadata: {
        txnToken: data.body.txnToken,
        mid: this.merchantId,
      },
    };
  }

  async verifyPayment(params: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): Promise<PaymentVerification> {
    if (!this.merchantId || !this.merchantKey) {
      return { success: false, error: "Paytm credentials not configured" };
    }

    try {
      // Verify checksum
      const checksumData = { orderId: params.orderId, ...JSON.parse(params.signature) };
      const expectedChecksum = this.generateChecksum(checksumData);

      // Fetch transaction status from Paytm
      const statusBody = {
        body: {
          mid: this.merchantId,
          orderId: params.orderId,
        },
      };

      const checksum = this.generateChecksum(statusBody.body);

      const response = await fetch(
        `${this.baseUrl}/v3/order/status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-mid": this.merchantId,
            "x-checksum": checksum,
          },
          body: JSON.stringify(statusBody),
        },
      );

      const data = await response.json();

      if (
        data.body.resultInfo.resultStatus === "TXN_SUCCESS" &&
        data.body.txnId === params.paymentId
      ) {
        return {
          success: true,
          paymentId: params.paymentId,
          orderId: params.orderId,
        };
      }

      return {
        success: false,
        error: data.body.resultInfo.resultMsg ?? "Payment verification failed",
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
    if (!this.merchantId || !this.merchantKey) {
      throw new Error("Paytm credentials not configured");
    }

    // Note: Paytm uses orderId for status check, not txnId
    // This is a limitation - in practice, you'd need to store orderId mapping
    throw new Error("Use orderId to fetch payment details from Paytm");
  }

  async refundPayment(
    paymentId: string,
    amount?: number,
  ): Promise<{ success: boolean; refundId?: string; error?: string }> {
    if (!this.merchantId || !this.merchantKey) {
      return { success: false, error: "Paytm credentials not configured" };
    }

    try {
      const refundId = `REFUND_${Date.now()}`;

      const refundBody = {
        body: {
          mid: this.merchantId,
          txnId: paymentId,
          orderId: `ORDER_${paymentId}`, // This should come from your database
          refundAmount: amount?.toFixed(2) ?? undefined,
          refId: refundId,
        },
      };

      const checksum = this.generateChecksum(refundBody.body);

      const response = await fetch(`${this.baseUrl}/refund/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-mid": this.merchantId,
          "x-checksum": checksum,
        },
        body: JSON.stringify(refundBody),
      });

      const data = await response.json();

      if (data.body.resultInfo.resultStatus === "TXN_SUCCESS") {
        return {
          success: true,
          refundId: data.body.refundId,
        };
      }

      return {
        success: false,
        error: data.body.resultInfo.resultMsg ?? "Refund failed",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Refund failed",
      };
    }
  }
}
