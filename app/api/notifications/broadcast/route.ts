import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Role, Status } from "@/types/domain";
import { createBulkNotifications } from "@/server/services/notification.service";
import { withPrisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    // Only admins can broadcast notifications
    if (session.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { message, targetType } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Get user IDs based on target type
    const userIds = await withPrisma(
      async (client) => {
        let where = {};

        if (targetType === "members") {
          where = { membershipStatus: Status.ACTIVE };
        } else if (targetType === "pending") {
          where = { membershipStatus: Status.PENDING };
        }
        // For "all", where remains empty (no filter)

        const users = await client.user.findMany({
          where,
          select: { id: true },
        });

        return users.map((u) => u.id);
      },
      () => [],
    );

    if (userIds.length === 0) {
      return NextResponse.json(
        { error: "No users found matching criteria" },
        { status: 404 },
      );
    }

    const count = await createBulkNotifications(userIds, message);

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("Error broadcasting notification:", error);
    return NextResponse.json(
      { error: "Failed to broadcast notification" },
      { status: 500 },
    );
  }
}
