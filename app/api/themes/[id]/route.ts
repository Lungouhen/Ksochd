import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const result = await withPrisma(
    async (prisma) => {
      try {
        const theme = await prisma.theme.update({
          where: { id },
          data: body,
        });

        return { success: true, theme };
      } catch (error) {
        console.error("Error updating theme:", error);
        return { success: false, error: "Failed to update theme" };
      }
    },
    () => ({ success: false, error: "Database unavailable" })
  );

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
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
      try {
        // Check if theme is default or active
        const theme = await prisma.theme.findUnique({
          where: { id },
        });

        if (theme?.isDefault || theme?.isActive) {
          return { success: false, error: "Cannot delete active or default theme", badRequest: true };
        }

        await prisma.theme.delete({
          where: { id },
        });

        return { success: true };
      } catch (error) {
        console.error("Error deleting theme:", error);
        return { success: false, error: "Failed to delete theme" };
      }
    },
    () => ({ success: false, error: "Database unavailable" })
  );

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { status: result.badRequest ? 400 : 500 }
    );
  }

  return NextResponse.json({ success: true });
}
