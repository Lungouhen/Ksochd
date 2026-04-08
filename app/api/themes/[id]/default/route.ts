import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";
import type { Theme } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const result = await withPrisma(
    async (prisma) => {
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

      return { theme: theme as Theme | null };
    },
    () => ({ theme: null as Theme | null })
  );

  if (!result.theme) {
    return NextResponse.json(
      { error: "Failed to set default theme" },
      { status: 500 }
    );
  }

  return NextResponse.json({ theme: result.theme });
}
