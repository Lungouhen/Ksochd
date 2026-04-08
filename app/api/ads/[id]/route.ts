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
        const ad = await prisma.ad.update({
          where: { id },
          data: body,
        });

        return { success: true, ad };
      } catch (error) {
        console.error("Error updating ad:", error);
        return { success: false, error: "Failed to update ad" };
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

  return NextResponse.json({ ad: result.ad });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const result = await withPrisma(
    async (prisma) => {
      try {
        await prisma.ad.delete({
          where: { id },
        });

        return { success: true };
      } catch (error) {
        console.error("Error deleting ad:", error);
        return { success: false, error: "Failed to delete ad" };
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

  return NextResponse.json({ success: true });
}
