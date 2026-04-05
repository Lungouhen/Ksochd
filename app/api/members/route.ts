import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";
import { Status } from "@/types/domain";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { memberId, action } = body as { memberId: string; action: "approve" | "reject" };

  if (!memberId || !action) {
    return NextResponse.json(
      { error: "memberId and action are required" },
      { status: 400 },
    );
  }

  const newStatus = action === "approve" ? Status.ACTIVE : Status.REJECTED;

  const result = await withPrisma(
    async (client) => {
      const user = await client.user.update({
        where: { id: memberId },
        data: { membershipStatus: newStatus },
      });
      return { success: true, memberId: user.id, status: user.membershipStatus };
    },
    () => ({ success: true, memberId, status: newStatus }),
  );

  return NextResponse.json(result);
}
