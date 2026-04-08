import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Role } from "@/types/domain";
import {
  createPageVersion,
  getPageVersions,
} from "@/server/services/versioning.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get("pageId");

    if (!pageId) {
      return NextResponse.json(
        { error: "pageId query param is required" },
        { status: 400 },
      );
    }

    const versions = await getPageVersions(pageId);
    return NextResponse.json(versions);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch page versions" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (session.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { pageId, changeNote } = body;

    if (!pageId) {
      return NextResponse.json(
        { error: "pageId is required" },
        { status: 400 },
      );
    }

    const id = await createPageVersion(pageId, session.userId, changeNote);
    return NextResponse.json({ id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create page version" },
      { status: 500 },
    );
  }
}
