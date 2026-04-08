import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Role } from "@/types/domain";
import {
  getBrandingSettings,
  updateBrandingSettings,
} from "@/server/services/branding.service";

export async function GET() {
  try {
    const branding = await getBrandingSettings();
    return NextResponse.json(branding);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch branding settings" },
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
    const { category = "general", ...settings } = body;

    await updateBrandingSettings(settings, category, session.userId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update branding settings" },
      { status: 500 },
    );
  }
}
