import { NextRequest, NextResponse } from "next/server";
import { getPageVersion } from "@/server/services/versioning.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const version = await getPageVersion(id);
    if (!version) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(version);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch page version" },
      { status: 500 },
    );
  }
}
