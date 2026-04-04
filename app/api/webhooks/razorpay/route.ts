import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Stub for Razorpay signature verification
  const body = await request.text();
  return NextResponse.json(
    {
      received: true,
      note: "Validate X-Razorpay-Signature before processing.",
      length: body.length,
    },
    { status: 200 },
  );
}
