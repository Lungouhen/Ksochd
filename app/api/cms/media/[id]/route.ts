import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPrisma(async (prisma) => {
    try {
      const { id } = await params;

      await prisma.mediaLibrary.delete({
        where: { id },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error deleting media:", error);
      return NextResponse.json(
        { error: "Failed to delete media" },
        { status: 500 }
      );
    }
  });
}
