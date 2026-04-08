import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  return withPrisma(async (prisma) => {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    const where = type && type !== "all" ? { type: type as "IMAGE" | "VIDEO" | "DOCUMENT" | "AUDIO" } : {};

    const media = await prisma.mediaLibrary.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ media });
  });
}

export async function POST(req: NextRequest) {
  return withPrisma(async (prisma) => {
    try {
      const body = await req.json();
      const { filename, url, type, size, alt, caption, uploadedBy } = body;

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

      return NextResponse.json({ media }, { status: 201 });
    } catch (error) {
      console.error("Error creating media:", error);
      return NextResponse.json(
        { error: "Failed to create media" },
        { status: 500 }
      );
    }
  });
}
