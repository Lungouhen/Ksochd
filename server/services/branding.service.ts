import { withPrisma } from "@/lib/prisma";

// ─── Types ──────────────────────────────────────────────────────────────

export type BrandingSettings = {
  // Logos
  logoUrl: string;
  logoLightUrl: string;
  faviconUrl: string;
  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headerBgColor: string;
  footerBgColor: string;
  // Typography
  fontFamily: string;
  headingFont: string;
  fontSize: string;
  // Organization
  orgName: string;
  orgTagline: string;
  orgAddress: string;
  orgPhone: string;
  orgEmail: string;
  orgWebsite: string;
};

const defaultBranding: BrandingSettings = {
  logoUrl: "/logo.png",
  logoLightUrl: "/logo-light.png",
  faviconUrl: "/favicon.ico",
  primaryColor: "#0ea5a6",
  secondaryColor: "#f6c453",
  accentColor: "#8b5cf6",
  headerBgColor: "#0f172a",
  footerBgColor: "#020617",
  fontFamily: "Inter, system-ui, sans-serif",
  headingFont: "Inter, system-ui, sans-serif",
  fontSize: "16px",
  orgName: "KSO Chandigarh",
  orgTagline: "Kuki Students Organisation, Chandigarh",
  orgAddress: "Chandigarh, India",
  orgPhone: "",
  orgEmail: "contact@ksochd.org",
  orgWebsite: "https://ksochd.org",
};

// ─── Get all branding settings ──────────────────────────────────────────

export async function getBrandingSettings(): Promise<BrandingSettings> {
  return withPrisma(
    async (client) => {
      const configs = await client.brandingConfig.findMany();

      const settings = { ...defaultBranding };
      for (const config of configs) {
        if (config.key in settings && config.value !== null) {
          (settings as Record<string, string>)[config.key] = config.value;
        }
      }
      return settings;
    },
    () => defaultBranding,
  );
}

// ─── Update a branding setting ──────────────────────────────────────────

export async function updateBrandingSetting(
  key: string,
  value: string,
  category: string,
  updatedBy: string,
): Promise<void> {
  await withPrisma(
    async (client) => {
      await client.brandingConfig.upsert({
        where: { key },
        update: { value, category, updatedBy },
        create: { key, value, category, updatedBy },
      });
    },
    () => undefined,
  );
}

// ─── Update multiple branding settings at once ──────────────────────────

export async function updateBrandingSettings(
  settings: Partial<BrandingSettings>,
  category: string,
  updatedBy: string,
): Promise<void> {
  await withPrisma(
    async (client) => {
      const operations = Object.entries(settings)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) =>
          client.brandingConfig.upsert({
            where: { key },
            update: { value: value as string, category, updatedBy },
            create: { key, value: value as string, category, updatedBy },
          }),
        );
      await Promise.all(operations);
    },
    () => undefined,
  );
}

// ─── Get branding by category ───────────────────────────────────────────

export async function getBrandingByCategory(
  category: string,
): Promise<Record<string, string>> {
  return withPrisma(
    async (client) => {
      const configs = await client.brandingConfig.findMany({
        where: { category },
      });
      const result: Record<string, string> = {};
      for (const config of configs) {
        if (config.value !== null) {
          result[config.key] = config.value;
        }
      }
      return result;
    },
    () => ({}),
  );
}
