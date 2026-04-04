import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  markAsRead,
  deleteNotification,
} from "@/server/services/notification.service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getSession();
    const { id } = params;

    const success = await markAsRead(id, session.userId);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to mark notification as read" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getSession();
    const { id } = params;

    const success = await deleteNotification(id, session.userId);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to delete notification" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 },
    );
  }
}
