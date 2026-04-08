import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";
import type { Theme } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const result = await withPrisma(
    async (prisma) => {
      const theme = await prisma.theme.update({
        where: { id },
        data: body,
      });

      return { theme: theme as Theme | null };
    },
    () => ({ theme: null as Theme | null })
  );

  if (!result.theme) {
    return NextResponse.json(
      { error: "Failed to update theme" },
      { status: 500 }
    );
  }

  return NextResponse.json({ theme: result.theme });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const result = await withPrisma(
    async (prisma) => {
      // Check if theme is default or active
      const theme = await prisma.theme.findUnique({
        where: { id },
      });

      if (theme?.isDefault || theme?.isActive) {
        return { success: false, badRequest: true };
      }

      await prisma.theme.delete({
        where: { id },
      });

      return { success: true, badRequest: false };
    },
    () => ({ success: false, badRequest: false })
  );

  if (!result.success) {
    return NextResponse.json(
      { error: result.badRequest ? "Cannot delete active or default theme" : "Failed to delete theme" },
      { status: result.badRequest ? 400 : 500 }
    );
  }

  return NextResponse.json({ success: true });
}
