import { NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const signature = request.headers.get("X-Razorpay-Signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 },
      );
    }

    // TODO: Verify webhook signature using RazorpayGateway
    const event = body.event;
    const paymentEntity = body.payload?.payment?.entity;

    if (event === "payment.captured" && paymentEntity) {
      // Update payment in database
      await withPrisma(
        async (client) => {
          const payment = await client.payment.findFirst({
            where: { gatewayOrderId: paymentEntity.order_id },
          });

          if (payment) {
            await client.payment.update({
              where: { id: payment.id },
              data: {
                status: "PAID",
                gatewayPaymentId: paymentEntity.id,
              },
            });
          }
        },
        () => null,
      );
    } else if (event === "payment.failed" && paymentEntity) {
      // Update payment as failed
      await withPrisma(
        async (client) => {
          const payment = await client.payment.findFirst({
            where: { gatewayOrderId: paymentEntity.order_id },
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

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
