import { NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // PayPal sends webhook events with event_type
    const eventType = body.event_type;
    const resource = body.resource;

    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      // Payment completed
      const orderId = resource.supplementary_data?.related_ids?.order_id;

      if (orderId) {
        await withPrisma(
          async (client) => {
            const payment = await client.payment.findFirst({
              where: { gatewayOrderId: orderId },
            });

            if (payment) {
              await client.payment.update({
                where: { id: payment.id },
                data: {
                  status: "PAID",
                  gatewayPaymentId: resource.id,
                },
              });
            }
          },
          () => null,
        );
      }
    } else if (eventType === "PAYMENT.CAPTURE.DENIED") {
      // Payment failed
      const orderId = resource.supplementary_data?.related_ids?.order_id;

      if (orderId) {
        await withPrisma(
          async (client) => {
            const payment = await client.payment.findFirst({
              where: { gatewayOrderId: orderId },
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
      }
    } else if (eventType === "PAYMENT.CAPTURE.REFUNDED") {
      // Payment refunded
      const orderId = resource.supplementary_data?.related_ids?.order_id;

      if (orderId) {
        await withPrisma(
          async (client) => {
            const payment = await client.payment.findFirst({
              where: { gatewayOrderId: orderId },
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
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
