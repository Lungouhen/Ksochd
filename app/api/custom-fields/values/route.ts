import { NextRequest, NextResponse } from "next/server";
import {
  getCustomFieldValues,
  saveCustomFieldValues,
} from "@/server/services/custom-field.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleName = searchParams.get("module");
    const entityId = searchParams.get("entityId");

    if (!moduleName || !entityId) {
      return NextResponse.json(
        { error: "module and entityId query params are required" },
        { status: 400 },
      );
    }

    const values = await getCustomFieldValues(moduleName, entityId);
    return NextResponse.json(values);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch custom field values" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { entityId, values } = body;

    if (!entityId || !Array.isArray(values)) {
      return NextResponse.json(
        { error: "entityId and values array are required" },
        { status: 400 },
      );
    }

    await saveCustomFieldValues(entityId, values);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to save custom field values" },
      { status: 500 },
    );
  }
}
