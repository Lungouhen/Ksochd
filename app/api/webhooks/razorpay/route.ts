import { NextResponse } from "next/server";
import crypto from "crypto";
import { prismaInstance } from "@/lib/prisma";
import { PaymentStatus } from "@/types/domain";

/**
 * Verifies Razorpay webhook signature
 * https://razorpay.com/docs/webhooks/validate/
 */
function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string,
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
  } catch (error) {
    console.error("[Razorpay] Signature verification error:", error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[Razorpay] RAZORPAY_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 },
      );
    }

    // Get raw body as string for signature verification
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      console.error("[Razorpay] Missing signature header");
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 },
      );
    }

    // Verify signature
    const isValid = verifyWebhookSignature(body, signature, webhookSecret);

    if (!isValid) {
      console.error("[Razorpay] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse the verified payload
    const payload = JSON.parse(body);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;

    console.log("[Razorpay] Webhook event:", event);

    // Handle different event types
    switch (event) {
      case "payment.captured":
      case "payment.authorized": {
        if (!paymentEntity) {
          return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const razorpayId = paymentEntity.id;
        const amount = paymentEntity.amount; // Amount in paise
        const status = event === "payment.captured" ? PaymentStatus.PAID : PaymentStatus.PENDING;

        // Update payment in database
        if (prismaInstance) {
          await prismaInstance.payment.updateMany({
            where: { razorpayId },
            data: {
              status,
              amount: Math.floor(amount / 100), // Convert paise to rupees
            },
          });
          console.log(`[Razorpay] Payment ${razorpayId} updated to ${status}`);
        } else {
          console.warn("[Razorpay] Database not available, payment not updated");
        }
        break;
      }

      case "payment.failed": {
        if (!paymentEntity) {
          return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const razorpayId = paymentEntity.id;

        if (prismaInstance) {
          await prismaInstance.payment.updateMany({
            where: { razorpayId },
            data: { status: PaymentStatus.FAILED },
          });
          console.log(`[Razorpay] Payment ${razorpayId} marked as FAILED`);
        }
        break;
      }

      default:
        console.log(`[Razorpay] Unhandled event type: ${event}`);
    }

    return NextResponse.json({
      received: true,
      event,
      verified: true,
    });
  } catch (error) {
    console.error("[Razorpay] Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
