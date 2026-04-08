import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  updateSavedReportView,
  deleteSavedReportView,
} from "@/server/services/versioning.service";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await getSession();
    const { id } = await params;
    const body = await request.json();
    await updateSavedReportView(id, body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update saved view" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await getSession();
    const { id } = await params;
    await deleteSavedReportView(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete saved view" },
      { status: 500 },
    );
  }
}
