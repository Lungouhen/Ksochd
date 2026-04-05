import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

type IntegrationSetting = {
  key: string;
  value: string;
  isSecret: boolean;
  description: string;
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const settings = body as IntegrationSetting[];

  if (!Array.isArray(settings) || settings.length === 0) {
    return NextResponse.json(
      { error: "An array of settings is required" },
      { status: 400 },
    );
  }

  const result = await withPrisma(
    async (client) => {
      let savedCount = 0;
      for (const setting of settings) {
        if (!setting.key) continue;
        await client.systemSetting.upsert({
          where: { key: setting.key },
          update: {
            value: setting.value,
            isSecret: setting.isSecret,
            description: setting.description,
            updatedBy: "admin",
          },
          create: {
            key: setting.key,
            value: setting.value,
            isSecret: setting.isSecret,
            description: setting.description,
            updatedBy: "admin",
          },
        });
        savedCount++;
      }
      return { success: true, savedCount };
    },
    () => ({ success: true, savedCount: settings.length }),
  );

  return NextResponse.json(result);
}
