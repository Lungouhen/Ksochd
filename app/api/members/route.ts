import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";
import { Status, Role } from "@/types/domain";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getSession();

  // Only admins can approve/reject members
  if (!session || session.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

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
      const user = await client.user.findUnique({
        where: { id: memberId },
        select: { id: true, name: true },
      });

      if (!user) {
        return { error: "User not found", success: false, memberId: "", status: newStatus };
      }

      const updatedUser = await client.user.update({
        where: { id: memberId },
        data: { membershipStatus: newStatus },
      });

      // Create audit log entry
      await client.auditLog.create({
        data: {
          action: action === "approve" ? "MEMBER_APPROVED" : "MEMBER_REJECTED",
          targetUserId: memberId,
          targetUserName: user.name,
          performedBy: session.userId,
          performedByName: session.name || "Unknown Admin",
          details: {
            newStatus,
          },
        },
      });

      return { success: true, memberId: updatedUser.id, status: updatedUser.membershipStatus, error: "" };
    },
    () => ({ success: true, memberId, status: newStatus, error: "" }),
  );

  return NextResponse.json(result);
}
