import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withPrisma(async (prisma) => {
    try {
      const { id } = await params;

      const ad = await prisma.ad.update({
        where: { id },
        data: {
          clicks: {
            increment: 1,
          },
        },
      });

      return NextResponse.json({ ad });
    } catch (error) {
      console.error("Error tracking click:", error);
      return NextResponse.json(
        { error: "Failed to track click" },
        { status: 500 }
      );
    }
  });
}
