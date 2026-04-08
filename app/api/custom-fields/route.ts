import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Role } from "@/types/domain";
import {
  getCustomFields,
  createCustomField,
} from "@/server/services/custom-field.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const module = searchParams.get("module");
    if (!module) {
      return NextResponse.json(
        { error: "module query param is required" },
        { status: 400 },
      );
    }
    const activeOnly = searchParams.get("activeOnly") !== "false";
    const fields = await getCustomFields(module, activeOnly);
    return NextResponse.json(fields);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch custom fields" },
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
    const id = await createCustomField({ ...body, createdBy: session.userId });
    return NextResponse.json({ id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create custom field" },
      { status: 500 },
    );
  }
}
