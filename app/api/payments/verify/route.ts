import { NextRequest, NextResponse } from "next/server";
import { PaymentGateway } from "@prisma/client";
import { getPaymentGateway } from "@/lib/payments/gateway-factory";
import { withPrisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, orderId, paymentProof, gateway } = body;

    if (!paymentId || !orderId || !paymentProof) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get payment from database
    const payment = await withPrisma(
      async (client) => {
        return await client.payment.findUnique({
          where: { id: paymentId },
        });
      },
      () => null,
    );

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 },
      );
    }

    // Get gateway instance
    const gatewayInstance = getPaymentGateway(
      gateway ?? payment.gateway ?? PaymentGateway.RAZORPAY,
    );

    if (!gatewayInstance) {
      return NextResponse.json(
        { error: "Payment gateway not available" },
        { status: 400 },
      );
    }

    // Verify payment with gateway
    const verification = await gatewayInstance.verifyPayment({
      orderId,
      paymentId: paymentProof.paymentId ?? paymentProof,
      signature: paymentProof.signature ?? "",
    });

    if (!verification.success) {
      return NextResponse.json(
        { error: verification.error ?? "Payment verification failed" },
        { status: 400 },
      );
    }

    // Update payment status
    const updatedPayment = await withPrisma(
      async (client) => {
        return await client.payment.update({
          where: { id: paymentId },
          data: {
            status: "PAID",
            gatewayPaymentId: verification.paymentId,
          },
        });
      },
      () => null,
    );

    if (!updatedPayment) {
      return NextResponse.json(
        { error: "Failed to update payment" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 },
    );
  }
}
