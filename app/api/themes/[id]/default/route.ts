import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPrisma(async (prisma) => {
    try {
      const { id } = await params;

      // Unset all other defaults
      await prisma.theme.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });

      // Set this theme as default and active
      const theme = await prisma.theme.update({
        where: { id },
        data: {
          isDefault: true,
          isActive: true,
        },
      });

      return NextResponse.json({ theme });
    } catch (error) {
      console.error("Error setting default theme:", error);
      return NextResponse.json(
        { error: "Failed to set default theme" },
        { status: 500 }
      );
    }
  });
}
