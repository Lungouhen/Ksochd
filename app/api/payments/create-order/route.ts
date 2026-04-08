import { NextRequest, NextResponse } from "next/server";
import { PaymentGateway } from "@prisma/client";
import { getPaymentGateway } from "@/lib/payments/gateway-factory";
import { withPrisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = "INR", purpose, userId, gateway } = body;

    if (!amount || !purpose || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get gateway (default to RAZORPAY if not specified)
    const selectedGateway: PaymentGateway = gateway ?? PaymentGateway.RAZORPAY;
    const gatewayInstance = getPaymentGateway(selectedGateway);

    if (!gatewayInstance) {
      return NextResponse.json(
        { error: "Payment gateway not available" },
        { status: 400 },
      );
    }

    // Create order in payment gateway
    const receipt = `rcpt_${Date.now()}`;
    const order = await gatewayInstance.createOrder({
      amount,
      currency,
      receipt,
      notes: {
        purpose,
        userId,
      },
    });

    // Save to database
    const payment = await withPrisma(
      async (client) => {
        return await client.payment.create({
          data: {
            userId,
            amount,
            purpose,
            gateway: selectedGateway,
            gatewayOrderId: order.orderId,
            status: "PENDING",
            metadata: JSON.stringify(order.metadata ?? {}),
          },
        });
      },
      () => null,
    );

    if (!payment) {
      return NextResponse.json(
        { error: "Failed to create payment record" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      orderId: order.orderId,
      amount: order.amount,
      currency: order.currency,
      gateway: selectedGateway,
      metadata: order.metadata,
    });
  } catch (error) {
    console.error("Payment order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 },
    );
  }
}
