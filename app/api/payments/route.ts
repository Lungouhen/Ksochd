import { NextResponse } from "next/server";
import { prismaInstance } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { PaymentStatus } from "@/types/domain";
import { verifyCSRF } from "@/lib/csrf";
import Razorpay from "razorpay";

// Initialize Razorpay
const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

export async function GET() {
  try {
    const session = await requireAuth();

    if (!prismaInstance) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 },
      );
    }

    const payments = await prismaInstance.payment.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("[Payments API] GET error:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();

    // Verify CSRF token
    const csrfValid = await verifyCSRF(request);
    if (!csrfValid) {
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 },
      );
    }

    if (!prismaInstance) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 },
      );
    }

    if (!razorpay) {
      return NextResponse.json(
        { error: "Payment gateway not configured" },
        { status: 503 },
      );
    }

    const body = await request.json();
    const { amount, purpose, currency = "INR" } = body;

    if (!amount || !purpose) {
      return NextResponse.json(
        { error: "Missing required fields: amount, purpose" },
        { status: 400 },
      );
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: session.userId,
        purpose,
      },
    });

    // Create payment record in database
    const payment = await prismaInstance.payment.create({
      data: {
        userId: session.userId,
        amount,
        status: PaymentStatus.PENDING,
        razorpayId: razorpayOrder.id,
        purpose,
      },
    });

    return NextResponse.json({
      payment,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    }, { status: 201 });
  } catch (error) {
    console.error("[Payments API] POST error:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to initiate payment" },
      { status: 500 },
    );
  }
}
