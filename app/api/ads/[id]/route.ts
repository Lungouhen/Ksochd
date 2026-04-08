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

      const ad = await prisma.ad.update({
        where: { id },
        data: body,
      });

      return NextResponse.json({ ad });
    } catch (error) {
      console.error("Error updating ad:", error);
      return NextResponse.json(
        { error: "Failed to update ad" },
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

      await prisma.ad.delete({
        where: { id },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting ad:", error);
      return NextResponse.json(
        { error: "Failed to delete ad" },
        { status: 500 }
      );
    }
  });
}
