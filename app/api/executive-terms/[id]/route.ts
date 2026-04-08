import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Role } from "@/types/domain";

// PATCH - Update a term or set as current
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  const { id } = await params;

  // Only admins can update terms
  if (session.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { isCurrent, ...updateData } = body;

  const result = await withPrisma(
    async (client) => {
      // Check if term exists
      const existingTerm = await client.executiveTerm.findUnique({
        where: { id },
      });

      if (!existingTerm) {
        return { error: "Term not found", status: 404 };
      }

      // If setting as current, unset all other current terms
      if (isCurrent === true) {
        await client.executiveTerm.updateMany({
          where: { isCurrent: true, id: { not: id } },
          data: { isCurrent: false },
        });
      }

      // Update the term
      const term = await client.executiveTerm.update({
        where: { id },
        data: {
          ...updateData,
          isCurrent: isCurrent !== undefined ? isCurrent : existingTerm.isCurrent,
        },
      });

      // Create audit log
      await client.auditLog.create({
        data: {
          action: isCurrent ? "EXECUTIVE_TERM_SET_CURRENT" : "EXECUTIVE_TERM_UPDATED",
          targetUserId: null,
          targetUserName: null,
          performedBy: session.userId,
          performedByName: session.name || "Unknown Admin",
          details: {
            termId: term.id,
            termName: term.name,
            isCurrent: term.isCurrent,
            changes: updateData,
          },
        },
      });

      return { success: true, term };
    },
    () => ({ error: "Database unavailable", status: 503 }),
  );

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status || 500 }
    );
  }

  return NextResponse.json(result);
}

// DELETE - Delete a term
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  const { id } = await params;

  // Only admins can delete terms
  if (session.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const result = await withPrisma(
    async (client) => {
      const term = await client.executiveTerm.findUnique({
        where: { id },
      });

      if (!term) {
        return { error: "Term not found", status: 404 };
      }

      // Prevent deletion of current term
      if (term.isCurrent) {
        return {
          error: "Cannot delete current term. Set another term as current first.",
          status: 400,
        };
      }

      await client.executiveTerm.delete({
        where: { id },
      });

      // Create audit log
      await client.auditLog.create({
        data: {
          action: "EXECUTIVE_TERM_DELETED",
          targetUserId: null,
          targetUserName: null,
          performedBy: session.userId,
          performedByName: session.name || "Unknown Admin",
          details: {
            termId: id,
            termName: term.name,
          },
        },
      });

      return { success: true };
    },
    () => ({ error: "Database unavailable", status: 503 }),
  );

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status || 500 }
    );
  }

  return NextResponse.json(result);
}
