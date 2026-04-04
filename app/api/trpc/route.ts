import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: "tRPC endpoint placeholder. Wire to routers in server/ when ready.",
  });
}
