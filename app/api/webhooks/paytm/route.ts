import { NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Paytm sends CHECKSUMHASH in the response
    const { STATUS, ORDERID, TXNID, CHECKSUMHASH } = body;

    if (!CHECKSUMHASH) {
      return NextResponse.json(
        { error: "Missing checksum" },
        { status: 400 },
      );
    }

    // TODO: Verify checksum using PaytmGateway

    if (STATUS === "TXN_SUCCESS") {
      // Update payment in database
      await withPrisma(
        async (client) => {
          const payment = await client.payment.findFirst({
            where: { gatewayOrderId: ORDERID },
          });

          if (payment) {
            await client.payment.update({
              where: { id: payment.id },
              data: {
                status: "PAID",
                gatewayPaymentId: TXNID,
              },
            });
          }
        },
        () => null,
      );
    } else if (STATUS === "TXN_FAILURE") {
      // Update payment as failed
      await withPrisma(
        async (client) => {
          const payment = await client.payment.findFirst({
            where: { gatewayOrderId: ORDERID },
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
    console.error("Paytm webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
