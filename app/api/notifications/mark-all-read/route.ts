import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { markAllAsRead } from "@/server/services/notification.service";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    const success = await markAllAsRead(session.userId);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to mark all notifications as read" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      { error: "Failed to mark all notifications as read" },
      { status: 500 },
    );
  }
}
