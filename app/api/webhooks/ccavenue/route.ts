import { NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const encResp = formData.get("encResp") as string;

    if (!encResp) {
      return NextResponse.json(
        { error: "Missing encrypted response" },
        { status: 400 },
      );
    }

    // TODO: Decrypt using CCAvenueGateway
    // For now, we'll handle it in a simplified way
    // In production, you should decrypt and verify the response

    // The decrypted response will contain order_status, order_id, tracking_id, etc.
    // Parse the response and update payment status accordingly

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("CCAvenue webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
