import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const where = type && type !== "all" ? { type: type as "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO" } : {};

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
      try {
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

        return { success: true, media };
      } catch (error) {
        console.error("Error creating media:", error);
        return { success: false, error: "Failed to create media" };
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

  return NextResponse.json({ media: result.media }, { status: 201 });
}
