import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getSavedReportViews,
  createSavedReportView,
} from "@/server/services/versioning.service";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get("reportType") ?? undefined;
    const views = await getSavedReportViews(reportType, session.userId);
    return NextResponse.json(views);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch saved views" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();
    const id = await createSavedReportView({
      ...body,
      createdBy: session.userId,
    });
    return NextResponse.json({ id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create saved view" },
      { status: 500 },
    );
  }
}
