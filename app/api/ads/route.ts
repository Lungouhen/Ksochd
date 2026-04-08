import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const position = searchParams.get("position");
  const activeOnly = searchParams.get("active") === "true";

  const where: {
    type?: string;
    position?: string;
    isActive?: boolean;
  } = {};

  if (type && type !== "all") where.type = type;
  if (position) where.position = position;
  if (activeOnly) where.isActive = true;

  const result = await withPrisma(
    async (prisma) => {
      const ads = await prisma.ad.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      return { ads };
    },
    () => ({ ads: [] })
  );

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    name,
    type,
    position,
    content,
    imageUrl,
    linkUrl,
    startDate,
    endDate,
    createdBy,
  } = body;

  const result = await withPrisma(
    async (prisma) => {
      try {
        const ad = await prisma.ad.create({
          data: {
            name,
            type,
            position,
            content,
            imageUrl,
            linkUrl,
            isActive: true,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
            createdBy,
          },
        });

        return { success: true, ad };
      } catch (error) {
        console.error("Error creating ad:", error);
        return { success: false, error: "Failed to create ad" };
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

  return NextResponse.json({ ad: result.ad }, { status: 201 });
}
