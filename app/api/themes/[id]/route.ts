import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPrisma(async (prisma) => {
    try {
      const { id } = await params;
      const body = await req.json();

      const theme = await prisma.theme.update({
        where: { id },
        data: body,
      });

      return NextResponse.json({ theme });
    } catch (error) {
      console.error("Error updating theme:", error);
      return NextResponse.json(
        { error: "Failed to update theme" },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPrisma(async (prisma) => {
    try {
      const { id } = await params;

      // Check if theme is default or active
      const theme = await prisma.theme.findUnique({
        where: { id },
      });

      if (theme?.isDefault || theme?.isActive) {
        return NextResponse.json(
          { error: "Cannot delete active or default theme" },
          { status: 400 }
        );
      }

      await prisma.theme.delete({
        where: { id },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting theme:", error);
      return NextResponse.json(
        { error: "Failed to delete theme" },
        { status: 500 }
      );
    }
  });
}
