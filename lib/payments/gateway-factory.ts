import { PaymentGateway } from "@prisma/client";
import type { IPaymentGateway } from "./gateway-interface";
import { RazorpayGateway } from "./razorpay-gateway";
import { StripeGateway } from "./stripe-gateway";
import { PayPalGateway } from "./paypal-gateway";

const gatewayInstances = new Map<PaymentGateway, IPaymentGateway>();

/**
 * Get payment gateway instance
 */
export function getPaymentGateway(
  gateway: PaymentGateway,
): IPaymentGateway | null {
  // Return cached instance if available
  if (gatewayInstances.has(gateway)) {
    return gatewayInstances.get(gateway)!;
  }

  // Create new instance
  let instance: IPaymentGateway | null = null;

  switch (gateway) {
    case PaymentGateway.RAZORPAY:
      instance = new RazorpayGateway();
      break;
    case PaymentGateway.STRIPE:
      instance = new StripeGateway();
      break;
    case PaymentGateway.PAYPAL:
      instance = new PayPalGateway();
      break;
    default:
      return null;
  }

  // Cache the instance
  gatewayInstances.set(gateway, instance);
  return instance;
}

/**
 * Get the default/active payment gateway
 */
export async function getActivePaymentGateway(): Promise<IPaymentGateway> {
  // Try to get from SystemSetting
  const { withPrisma } = await import("@/lib/prisma");

  const activeGateway = await withPrisma(
    async (client) => {
      const setting = await client.systemSetting.findUnique({
        where: { key: "ACTIVE_PAYMENT_GATEWAY" },
      });
      return (setting?.value as PaymentGateway) ?? PaymentGateway.RAZORPAY;
    },
    () => PaymentGateway.RAZORPAY,
  );

  const gateway = getPaymentGateway(activeGateway);
  if (!gateway) {
    // Fallback to Razorpay
    return getPaymentGateway(PaymentGateway.RAZORPAY)!;
  }

  return gateway;
}

/**
 * Get all available payment gateways
 */
export function getAvailableGateways(): PaymentGateway[] {
  const available: PaymentGateway[] = [];

  // Check Razorpay
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    available.push(PaymentGateway.RAZORPAY);
  }

  // Check Stripe
  if (process.env.STRIPE_SECRET_KEY) {
    available.push(PaymentGateway.STRIPE);
  }

  // Check PayPal
  if (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET) {
    available.push(PaymentGateway.PAYPAL);
  }

  return available;
}
