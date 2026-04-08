import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";
import type { Ad } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const result = await withPrisma(
    async (prisma) => {
      const ad = await prisma.ad.update({
        where: { id },
        data: body,
      });

      return { ad: ad as Ad | null };
    },
    () => ({ ad: null as Ad | null })
  );

  if (!result.ad) {
    return NextResponse.json(
      { error: "Failed to update ad" },
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
      await prisma.ad.delete({
        where: { id },
      });

      return { success: true };
    },
    () => ({ success: false })
  );

  if (!result.success) {
    return NextResponse.json(
      { error: "Failed to delete ad" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
