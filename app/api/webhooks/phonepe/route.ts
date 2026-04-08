import { NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // PhonePe callback format
    const { response } = body;

    if (!response) {
      return NextResponse.json(
        { error: "Missing response data" },
        { status: 400 },
      );
    }

    // Decode base64 response
    const decodedResponse = JSON.parse(
      Buffer.from(response, "base64").toString("utf-8"),
    );

    const { code, data } = decodedResponse;
    const merchantTransactionId = data.merchantTransactionId;
    const transactionId = data.transactionId;

    if (code === "PAYMENT_SUCCESS") {
      // Update payment in database
      await withPrisma(
        async (client) => {
          const payment = await client.payment.findFirst({
            where: { gatewayOrderId: merchantTransactionId },
          });

          if (payment) {
            await client.payment.update({
              where: { id: payment.id },
              data: {
                status: "PAID",
                gatewayPaymentId: transactionId,
              },
            });
          }
        },
        () => null,
      );
    } else if (code === "PAYMENT_ERROR" || code === "PAYMENT_DECLINED") {
      // Update payment as failed
      await withPrisma(
        async (client) => {
          const payment = await client.payment.findFirst({
            where: { gatewayOrderId: merchantTransactionId },
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

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("PhonePe webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
