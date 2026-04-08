import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const result = await withPrisma(
    async (prisma) => {
      try {
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

        return { success: true, theme };
      } catch (error) {
        console.error("Error setting default theme:", error);
        return { success: false, error: "Failed to set default theme" };
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
