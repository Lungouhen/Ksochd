import { withPrisma } from "@/lib/prisma";

export type SiteSettings = {
  siteName: string;
  siteDescription: string;
  logoUrl: string;
  faviconUrl: string;
  appleTouchIconUrl: string;
  icon192Url: string;
  icon512Url: string;
  ogImageUrl: string;
  twitterImageUrl: string;
  primaryColor: string;
  secondaryColor: string;
};

const defaultSettings: SiteSettings = {
  siteName: "KSO Chandigarh Portal",
  siteDescription:
    "Single-stream portal for Kuki Students Organisation (Chandigarh) members, admins, and guests.",
  logoUrl: "/logo.svg",
  faviconUrl: "/favicon.ico",
  appleTouchIconUrl: "/apple-touch-icon.svg",
  icon192Url: "/icon-192.svg",
  icon512Url: "/icon-512.svg",
  ogImageUrl: "/og-image.svg",
  twitterImageUrl: "/twitter-image.svg",
  primaryColor: "#0ea5a6",
  secondaryColor: "#f6c453",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  return withPrisma(
    async (prisma) => {
      const settings = await prisma.systemSetting.findMany({
        where: {
          key: {
            in: [
              "siteName",
              "siteDescription",
              "logoUrl",
              "faviconUrl",
              "appleTouchIconUrl",
              "icon192Url",
              "icon512Url",
              "ogImageUrl",
              "twitterImageUrl",
              "primaryColor",
              "secondaryColor",
            ],
          },
        },
      });

      const settingsMap = settings.reduce(
        (acc, setting) => {
          acc[setting.key] = setting.value || "";
          return acc;
        },
        {} as Record<string, string>
      );

      return {
        siteName: settingsMap.siteName || defaultSettings.siteName,
        siteDescription:
          settingsMap.siteDescription || defaultSettings.siteDescription,
        logoUrl: settingsMap.logoUrl || defaultSettings.logoUrl,
        faviconUrl: settingsMap.faviconUrl || defaultSettings.faviconUrl,
        appleTouchIconUrl:
          settingsMap.appleTouchIconUrl || defaultSettings.appleTouchIconUrl,
        icon192Url: settingsMap.icon192Url || defaultSettings.icon192Url,
        icon512Url: settingsMap.icon512Url || defaultSettings.icon512Url,
        ogImageUrl: settingsMap.ogImageUrl || defaultSettings.ogImageUrl,
        twitterImageUrl:
          settingsMap.twitterImageUrl || defaultSettings.twitterImageUrl,
        primaryColor: settingsMap.primaryColor || defaultSettings.primaryColor,
        secondaryColor:
          settingsMap.secondaryColor || defaultSettings.secondaryColor,
      };
    },
    () => defaultSettings
  );
}

export async function updateSiteSetting(
  key: keyof SiteSettings,
  value: string,
  updatedBy: string
): Promise<void> {
  return withPrisma(
    async (prisma) => {
      await prisma.systemSetting.upsert({
        where: { key },
        update: {
          value,
          updatedBy,
          updatedAt: new Date(),
        },
        create: {
          key,
          value,
          updatedBy,
          isSecret: false,
          description: `Site setting for ${key}`,
        },
      });
    },
    () => undefined
  );
}

export async function getSiteSetting(
  key: keyof SiteSettings
): Promise<string> {
  return withPrisma(
    async (prisma) => {
      const setting = await prisma.systemSetting.findUnique({
        where: { key },
      });
      return setting?.value || defaultSettings[key];
    },
    () => defaultSettings[key]
  );
}
