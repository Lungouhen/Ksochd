import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function GET() {
  return withPrisma(async (prisma) => {
    const themes = await prisma.theme.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ themes });
  });
}

export async function POST(req: NextRequest) {
  return withPrisma(async (prisma) => {
    try {
      const body = await req.json();
      const { name, displayName, description, config, preview, isDefault } = body;

      // If setting as default, unset other defaults
      if (isDefault) {
        await prisma.theme.updateMany({
          where: { isDefault: true },
          data: { isDefault: false },
        });
      }

      const theme = await prisma.theme.create({
        data: {
          name,
          displayName,
          description,
          config: JSON.stringify(config || {}),
          preview,
          isActive: true,
          isDefault: isDefault || false,
        },
      });

      return NextResponse.json({ theme }, { status: 201 });
    } catch (error) {
      console.error("Error creating theme:", error);
      return NextResponse.json(
        { error: "Failed to create theme" },
        { status: 500 }
      );
    }
  });
}
