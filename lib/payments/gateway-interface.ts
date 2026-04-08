import { PaymentGateway } from "@prisma/client";

export type PaymentOrder = {
  orderId: string;
  amount: number;
  currency: string;
  metadata?: Record<string, unknown>;
};

export type PaymentVerification = {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  error?: string;
};

export interface IPaymentGateway {
  readonly gateway: PaymentGateway;

  /**
   * Create a payment order
   */
  createOrder(params: {
    amount: number;
    currency: string;
    receipt: string;
    notes?: Record<string, string>;
  }): Promise<PaymentOrder>;

  /**
   * Verify payment signature/webhook
   */
  verifyPayment(params: {
    orderId: string;
    paymentId: string;
    signature: string;
  }): Promise<PaymentVerification>;

  /**
   * Get payment details
   */
  getPaymentDetails(paymentId: string): Promise<{
    id: string;
    amount: number;
    status: string;
    metadata?: Record<string, unknown>;
  }>;

  /**
   * Refund payment
   */
  refundPayment(paymentId: string, amount?: number): Promise<{
    success: boolean;
    refundId?: string;
    error?: string;
  }>;
}
