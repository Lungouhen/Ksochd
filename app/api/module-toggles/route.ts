import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Role } from "@/types/domain";
import {
  getModuleToggles,
  toggleModule,
  updateModulePermissions,
  updateModuleConfig,
} from "@/server/services/module-toggle.service";

export async function GET() {
  try {
    const session = await getSession();
    if (session.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const modules = await getModuleToggles();
    return NextResponse.json(modules);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch module toggles" },
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
    const { moduleKey, isEnabled, permissions, config } = body;

    if (!moduleKey) {
      return NextResponse.json(
        { error: "moduleKey is required" },
        { status: 400 },
      );
    }

    if (typeof isEnabled === "boolean") {
      await toggleModule(moduleKey, isEnabled, session.userId);
    }
    if (permissions) {
      await updateModulePermissions(moduleKey, permissions, session.userId);
    }
    if (config) {
      await updateModuleConfig(moduleKey, config, session.userId);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update module toggle" },
      { status: 500 },
    );
  }
}
