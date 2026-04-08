import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Role } from "@/types/domain";
import {
  getAllIdFormats,
  updateIdFormat,
  previewFormattedId,
} from "@/server/services/id-format.service";

export async function GET() {
  try {
    const formats = await getAllIdFormats();
    return NextResponse.json(formats);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch ID formats" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (session.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { entityType, ...settings } = body;

    if (!entityType) {
      return NextResponse.json(
        { error: "entityType is required" },
        { status: 400 },
      );
    }

    await updateIdFormat(entityType, settings, session.userId);

    const preview = await previewFormattedId(entityType);
    return NextResponse.json({ success: true, preview });
  } catch {
    return NextResponse.json(
      { error: "Failed to update ID format" },
      { status: 500 },
    );
  }
}
