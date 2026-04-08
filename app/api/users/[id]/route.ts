import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Role } from "@/types/domain";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  const { id } = await params;

  // Only admins can view user details
  if (session.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const result = await withPrisma(
    async (client) => {
      const user = await client.user.findUnique({
        where: { id },
        include: {
          registrations: {
            include: {
              event: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 10,
          },
          payments: {
            orderBy: {
              createdAt: "desc",
            },
            take: 10,
          },
          notifications: {
            orderBy: {
              createdAt: "desc",
            },
            take: 10,
          },
        },
      });

      if (!user) {
        return { error: "User not found", status: 404 };
      }

      return { user };
    },
    () => ({ error: "Database unavailable", status: 503 }),
  );

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status || 500 });
  }

  return NextResponse.json(result);
}
