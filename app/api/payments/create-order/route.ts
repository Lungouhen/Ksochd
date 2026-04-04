import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createRazorpayOrder, getPaymentConfig } from "@/lib/razorpay";
import { createPaymentRecord } from "@/server/services/payment.service";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();
    const { type, membershipType, eventId, customAmount } = body;

    let amount: number;
    let purpose: string;

    if (type === "membership") {
      const config = getPaymentConfig();
      if (membershipType === "individual") {
        amount = config.membershipFees.individual;
        purpose = "Membership Fee - Individual";
      } else if (membershipType === "family") {
        amount = config.membershipFees.family;
        purpose = "Membership Fee - Family";
      } else {
        return NextResponse.json(
          { error: "Invalid membership type" },
          { status: 400 },
        );
      }
    } else if (type === "event" && customAmount) {
      amount = customAmount * 100; // Convert rupees to paise
      purpose = `Event Registration Fee`;
    } else {
      return NextResponse.json(
        { error: "Invalid payment type or missing amount" },
        { status: 400 },
      );
    }

    // Create Razorpay order
    const receipt = `rcpt_${Date.now()}_${session.userId.slice(-6)}`;
    const order = await createRazorpayOrder({
      amount,
      receipt,
      notes: {
        userId: session.userId,
        type,
        membershipType: membershipType || "",
        eventId: eventId || "",
      },
    });

    // Create payment record in database
    await createPaymentRecord({
      userId: session.userId,
      amount: amount / 100, // Store in rupees
      purpose,
      membershipType,
      eventId,
      razorpayOrderId: order.id,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating payment order:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 },
    );
  }
}
