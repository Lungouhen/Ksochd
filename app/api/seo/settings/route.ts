import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function GET() {
  return withPrisma(async (prisma) => {
    const settings = await prisma.systemSetting.findMany({
      where: {
        key: {
          in: [
            "seo_default_title",
            "seo_default_description",
            "seo_default_keywords",
            "seo_default_og_image",
            "seo_site_url",
            "seo_twitter_handle",
            "gtm_container_id",
            "gtm_enabled",
            "seo_organization_name",
            "seo_organization_logo",
            "seo_organization_type",
          ],
        },
      },
    });

    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value || "";
    });

    return NextResponse.json({
      defaultTitle: settingsMap.seo_default_title || "KSO Chandigarh Portal",
      defaultDescription: settingsMap.seo_default_description || "",
      defaultKeywords: settingsMap.seo_default_keywords || "",
      defaultOgImage: settingsMap.seo_default_og_image || "",
      siteUrl: settingsMap.seo_site_url || "",
      twitterHandle: settingsMap.seo_twitter_handle || "",
      gtmContainerId: settingsMap.gtm_container_id || "",
      gtmEnabled: settingsMap.gtm_enabled === "true",
      organizationName: settingsMap.seo_organization_name || "",
      organizationLogo: settingsMap.seo_organization_logo || "",
      organizationType: settingsMap.seo_organization_type || "Organization",
    });
  });
}

export async function POST(req: NextRequest) {
  return withPrisma(async (prisma) => {
    try {
      const body = await req.json();

      const settingsToUpdate = [
        { key: "seo_default_title", value: body.defaultTitle },
        { key: "seo_default_description", value: body.defaultDescription },
        { key: "seo_default_keywords", value: body.defaultKeywords },
        { key: "seo_default_og_image", value: body.defaultOgImage },
        { key: "seo_site_url", value: body.siteUrl },
        { key: "seo_twitter_handle", value: body.twitterHandle },
        { key: "gtm_container_id", value: body.gtmContainerId },
        { key: "gtm_enabled", value: body.gtmEnabled ? "true" : "false" },
        { key: "seo_organization_name", value: body.organizationName },
        { key: "seo_organization_logo", value: body.organizationLogo },
        { key: "seo_organization_type", value: body.organizationType },
      ];

      for (const setting of settingsToUpdate) {
        await prisma.systemSetting.upsert({
          where: { key: setting.key },
          update: { value: setting.value },
          create: {
            key: setting.key,
            value: setting.value,
            isSecret: false,
            description: `SEO setting: ${setting.key}`,
          },
        });
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error saving SEO settings:", error);
      return NextResponse.json(
        { error: "Failed to save settings" },
        { status: 500 }
      );
    }
  });
}
