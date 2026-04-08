import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";
import type { MediaType, MediaLibrary } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const where = type && type !== "all" ? { type: type as MediaType } : {};

  const result = await withPrisma(
    async (prisma) => {
      const media = await prisma.mediaLibrary.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      return { media };
    },
    () => ({ media: [] })
  );

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { filename, url, type, size, alt, caption, uploadedBy } = body;

  const result = await withPrisma(
    async (prisma) => {
      const media = await prisma.mediaLibrary.create({
        data: {
          filename,
          url,
          type,
          size,
          alt,
          caption,
          uploadedBy,
        },
      });

      return { media: media as MediaLibrary | null };
    },
    () => ({ media: null as MediaLibrary | null })
  );

  if (!result.media) {
    return NextResponse.json(
      { error: "Failed to create media" },
      { status: 500 }
    );
  }

  return NextResponse.json({ media: result.media }, { status: 201 });
}
