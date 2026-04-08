import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";
import type { AdType, AdPosition, Ad } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const position = searchParams.get("position");
  const activeOnly = searchParams.get("active") === "true";

  const where: {
    type?: AdType;
    position?: AdPosition;
    isActive?: boolean;
  } = {};

  if (type && type !== "all") where.type = type as AdType;
  if (position) where.position = position as AdPosition;
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

      return { ad: ad as Ad | null };
    },
    () => ({ ad: null as Ad | null })
  );

  if (!result.ad) {
    return NextResponse.json(
      { error: "Failed to create ad" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ad: result.ad }, { status: 201 });
}
