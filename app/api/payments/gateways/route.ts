import { NextResponse } from "next/server";
import { getAvailableGateways } from "@/lib/payments/gateway-factory";
import { withPrisma } from "@/lib/prisma";
import { PaymentGateway } from "@prisma/client";

export async function GET() {
  try {
    const availableGateways = getAvailableGateways();

    // Get active gateway from settings
    const activeGateway = await withPrisma(
      async (client) => {
        const setting = await client.systemSetting.findUnique({
          where: { key: "ACTIVE_PAYMENT_GATEWAY" },
        });
        return (setting?.value as PaymentGateway) ?? PaymentGateway.RAZORPAY;
      },
      () => PaymentGateway.RAZORPAY,
    );

    return NextResponse.json({
      gateways: availableGateways,
      active: activeGateway,
    });
  } catch (error) {
    console.error("Error fetching payment gateways:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment gateways" },
      { status: 500 },
    );
  }
}
