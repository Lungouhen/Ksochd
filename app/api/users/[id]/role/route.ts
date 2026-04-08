import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";
import { Role } from "@/types/domain";
import { getSession } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  const { id } = await params;

  // Only admins can change roles
  if (session.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Prevent admins from changing their own role
  if (session.userId === id) {
    return NextResponse.json(
      { error: "Cannot change your own role" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { role } = body as { role: Role };

  if (!role || !Object.values(Role).includes(role)) {
    return NextResponse.json(
      { error: "Invalid role" },
      { status: 400 },
    );
  }

  const result = await withPrisma(
    async (client) => {
      // Get the user to update
      const targetUser = await client.user.findUnique({
        where: { id },
        select: { id: true, name: true, role: true },
      });

      if (!targetUser) {
        return { error: "User not found", status: 404 };
      }

      const oldRole = targetUser.role;

      // Skip if role is already the same
      if (oldRole === role) {
        return {
          success: true,
          user: {
            id: targetUser.id,
            name: targetUser.name,
            role: targetUser.role,
          },
        };
      }

      // Update the role
      const updatedUser = await client.user.update({
        where: { id },
        data: { role },
      });

      // Create audit log entry
      await client.auditLog.create({
        data: {
          action: "ROLE_CHANGED",
          targetUserId: id,
          targetUserName: targetUser.name,
          performedBy: session.userId || "unknown",
          performedByName: session.name || "Unknown Admin",
          details: {
            oldRole,
            newRole: role,
          },
        },
      });

      return {
        success: true,
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          role: updatedUser.role,
        },
      };
    },
    () => ({ error: "Database unavailable", status: 503 }),
  );

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status || 500 });
  }

  return NextResponse.json(result);
}
