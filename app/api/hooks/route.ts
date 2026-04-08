import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Role } from "@/types/domain";
import {
  getHookRegistrations,
  createHookRegistration,
  HOOK_POINTS,
} from "@/server/services/hook.service";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (session.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const hookPoint = searchParams.get("hookPoint") ?? undefined;
    const hooks = await getHookRegistrations(hookPoint);
    return NextResponse.json({ hooks, availableHookPoints: HOOK_POINTS });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch hooks" },
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
    const id = await createHookRegistration({
      ...body,
      createdBy: session.userId,
    });
    return NextResponse.json({ id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create hook" },
      { status: 500 },
    );
  }
}
