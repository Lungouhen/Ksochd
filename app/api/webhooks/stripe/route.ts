import { NextResponse } from "next/server";
import { StripeGateway } from "@/lib/payments/stripe-gateway";
import { withPrisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 },
      );
    }

    // Verify webhook signature
    const gateway = new StripeGateway();
    const event = gateway.verifyWebhookSignature(body, signature);

    if (!event) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 },
      );
    }

    // Handle different event types
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as {
        id: string;
        metadata: { receipt?: string };
      };

      // Update payment in database
      await withPrisma(
        async (client) => {
          const payment = await client.payment.findFirst({
            where: { gatewayOrderId: paymentIntent.id },
          });

          if (payment) {
            await client.payment.update({
              where: { id: payment.id },
              data: {
                status: "PAID",
                gatewayPaymentId: paymentIntent.id,
              },
            });
          }
        },
        () => null,
      );
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as { id: string };

      // Update payment as failed
      await withPrisma(
        async (client) => {
          const payment = await client.payment.findFirst({
            where: { gatewayOrderId: paymentIntent.id },
          });

          if (payment) {
            await client.payment.update({
              where: { id: payment.id },
              data: { status: "FAILED" },
            });
          }
        },
        () => null,
      );
    } else if (event.type === "charge.refunded") {
      const charge = event.data.object as { payment_intent: string };

      // Update payment as refunded
      await withPrisma(
        async (client) => {
          const payment = await client.payment.findFirst({
            where: { gatewayOrderId: charge.payment_intent },
          });

          if (payment) {
            await client.payment.update({
              where: { id: payment.id },
              data: { status: "REFUNDED" },
            });
          }
        },
        () => null,
      );
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
