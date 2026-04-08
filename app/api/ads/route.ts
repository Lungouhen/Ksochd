import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  return withPrisma(async (prisma) => {
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

    const ads = await prisma.ad.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ads });
  });
}

export async function POST(req: NextRequest) {
  return withPrisma(async (prisma) => {
    try {
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

      return NextResponse.json({ ad }, { status: 201 });
    } catch (error) {
      console.error("Error creating ad:", error);
      return NextResponse.json(
        { error: "Failed to create ad" },
        { status: 500 }
      );
    }
  });
}
