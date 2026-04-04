import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getNotifications,
  createNotification,
  getUnreadCount,
} from "@/server/services/notification.service";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const searchParams = request.nextUrl.searchParams;
    const countOnly = searchParams.get("count") === "true";

    if (countOnly) {
      const count = await getUnreadCount(session.userId);
      return NextResponse.json({ count });
    }

    const notifications = await getNotifications(session.userId);
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();
    const { message, userId } = body;

    // Allow users to create notifications for themselves or admins to create for others
    const targetUserId = userId || session.userId;

    const success = await createNotification(targetUserId, message);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to create notification" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 },
    );
  }
}
