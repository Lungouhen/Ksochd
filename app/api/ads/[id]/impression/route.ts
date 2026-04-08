import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";
import type { Ad } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const result = await withPrisma(
    async (prisma) => {
      const ad = await prisma.ad.update({
        where: { id },
        data: {
          impressions: {
            increment: 1,
          },
        },
      });

      return { ad: ad as Ad | null };
    },
    () => ({ ad: null as Ad | null })
  );

  if (!result.ad) {
    return NextResponse.json(
      { error: "Failed to track impression" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ad: result.ad });
}
