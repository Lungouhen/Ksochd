import { NextRequest, NextResponse } from "next/server";
import { previewFormattedId } from "@/server/services/id-format.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get("entityType");

    if (!entityType) {
      return NextResponse.json(
        { error: "entityType query param is required" },
        { status: 400 },
      );
    }

    const preview = await previewFormattedId(entityType);
    return NextResponse.json({ preview });
  } catch {
    return NextResponse.json(
      { error: "Failed to preview ID" },
      { status: 500 },
    );
  }
}
