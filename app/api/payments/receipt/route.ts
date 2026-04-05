import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") ?? "pay_unknown";
  const amount = searchParams.get("amount") ?? "0";
  const purpose = searchParams.get("purpose") ?? "Payment";
  const date = searchParams.get("date") ?? new Date().toISOString().split("T")[0];
  const ref = searchParams.get("ref") ?? id;

  return NextResponse.json({
    receipt: {
      id,
      amount: Number(amount),
      purpose,
      date,
      reference: ref,
      status: "PAID",
      organization: "KSO Chandigarh",
      issuedAt: new Date().toISOString(),
    },
  });
}
