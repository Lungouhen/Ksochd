import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";
import type { Theme } from "@prisma/client";

export async function GET() {
  const result = await withPrisma(
    async (prisma) => {
      const themes = await prisma.theme.findMany({
        orderBy: { createdAt: "desc" },
      });

      return { themes };
    },
    () => ({ themes: [] })
  );

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, displayName, description, config, preview, isDefault } = body;

  const result = await withPrisma(
    async (prisma) => {
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

      return { theme: theme as Theme | null };
    },
    () => ({ theme: null as Theme | null })
  );

  if (!result.theme) {
    return NextResponse.json(
      { error: "Failed to create theme" },
      { status: 500 }
    );
  }

  return NextResponse.json({ theme: result.theme }, { status: 201 });
}
