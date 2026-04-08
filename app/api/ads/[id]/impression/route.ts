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
        const ad = await prisma.ad.update({
          where: { id },
          data: {
            impressions: {
              increment: 1,
            },
          },
        });

        return { success: true, ad };
      } catch (error) {
        console.error("Error tracking impression:", error);
        return { success: false, error: "Failed to track impression" };
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
