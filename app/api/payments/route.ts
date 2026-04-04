import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserPayments } from "@/server/services/payment.service";

export async function GET() {
  try {
    const session = await getSession();
    const payments = await getUserPayments(session.userId);

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 },
    );
  }
}
