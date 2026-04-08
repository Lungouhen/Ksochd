import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Role } from "@/types/domain";

export async function GET(request: NextRequest) {
  const session = await getSession();

  // Only admins can view audit logs
  if (session.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const offset = parseInt(searchParams.get("offset") || "0");

  const result = await withPrisma(
    async (client) => {
      const [logs, total] = await Promise.all([
        client.auditLog.findMany({
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: offset,
        }),
        client.auditLog.count(),
      ]);

      return { logs, total };
    },
    () => ({ logs: [], total: 0 }),
  );

  return NextResponse.json(result);
}
