import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Role } from "@/types/domain";
import {
  createSettingsBackup,
  getSettingsBackups,
  getSettingsBackup,
} from "@/server/services/versioning.service";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (session.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const id = searchParams.get("id");

    if (id) {
      const backup = await getSettingsBackup(id);
      if (!backup) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(backup);
    }

    const backups = await getSettingsBackups(category);
    return NextResponse.json(backups);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch settings backups" },
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
    const { name, category, data, description } = body;

    if (!name || !category || !data) {
      return NextResponse.json(
        { error: "name, category, and data are required" },
        { status: 400 },
      );
    }

    const id = await createSettingsBackup(
      name,
      category,
      data,
      session.userId,
      description,
    );
    return NextResponse.json({ id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create settings backup" },
      { status: 500 },
    );
  }
}
