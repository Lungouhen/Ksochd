import { withPrisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// ─── Types ──────────────────────────────────────────────────────────────

export type ModuleToggleInfo = {
  id: string;
  moduleKey: string;
  displayName: string;
  description: string | null;
  isEnabled: boolean;
  permissions: Record<string, boolean> | null;
  config: Record<string, unknown> | null;
  order: number;
};

// Default module definitions
const defaultModules: ModuleToggleInfo[] = [
  { id: "mod-events", moduleKey: "events", displayName: "Events", description: "Event creation, registration, and management", isEnabled: true, permissions: null, config: null, order: 0 },
  { id: "mod-payments", moduleKey: "payments", displayName: "Payments", description: "Payment processing and receipt generation", isEnabled: true, permissions: null, config: null, order: 1 },
  { id: "mod-gallery", moduleKey: "gallery", displayName: "Gallery", description: "Photo and media galleries", isEnabled: true, permissions: null, config: null, order: 2 },
  { id: "mod-cms", moduleKey: "cms", displayName: "CMS", description: "Content management system with page builder", isEnabled: true, permissions: null, config: null, order: 3 },
  { id: "mod-ads", moduleKey: "ads", displayName: "Advertisements", description: "Banner and ad management", isEnabled: true, permissions: null, config: null, order: 4 },
  { id: "mod-reports", moduleKey: "reports", displayName: "Reports", description: "Analytics and reporting dashboards", isEnabled: true, permissions: null, config: null, order: 5 },
  { id: "mod-notifications", moduleKey: "notifications", displayName: "Notifications", description: "Push and in-app notifications", isEnabled: true, permissions: null, config: null, order: 6 },
  { id: "mod-themes", moduleKey: "themes", displayName: "Themes", description: "UI theming and customization", isEnabled: true, permissions: null, config: null, order: 7 },
  { id: "mod-seo", moduleKey: "seo", displayName: "SEO", description: "Search engine optimization tools", isEnabled: true, permissions: null, config: null, order: 8 },
  { id: "mod-audit", moduleKey: "audit", displayName: "Audit Logs", description: "Activity tracking and audit trail", isEnabled: true, permissions: null, config: null, order: 9 },
  { id: "mod-custom-fields", moduleKey: "custom_fields", displayName: "Custom Fields", description: "Dynamic form field builder", isEnabled: true, permissions: null, config: null, order: 10 },
  { id: "mod-templates", moduleKey: "templates", displayName: "Templates", description: "Output template management", isEnabled: true, permissions: null, config: null, order: 11 },
  { id: "mod-hooks", moduleKey: "hooks", displayName: "Hooks & Extensions", description: "Before/after action hooks for extensibility", isEnabled: false, permissions: null, config: null, order: 12 },
];

// ─── Get all module toggles ─────────────────────────────────────────────

export async function getModuleToggles(): Promise<ModuleToggleInfo[]> {
  return withPrisma(
    async (client) => {
      const modules = await client.moduleToggle.findMany({
        orderBy: { order: "asc" },
      });
      if (!modules.length) return defaultModules;

      return modules.map((m) => ({
        id: m.id,
        moduleKey: m.moduleKey,
        displayName: m.displayName,
        description: m.description,
        isEnabled: m.isEnabled,
        permissions: m.permissions as Record<string, boolean> | null,
        config: m.config as Record<string, unknown> | null,
        order: m.order,
      }));
    },
    () => defaultModules,
  );
}

// ─── Check if a module is enabled ───────────────────────────────────────

export async function isModuleEnabled(moduleKey: string): Promise<boolean> {
  return withPrisma(
    async (client) => {
      const mod = await client.moduleToggle.findUnique({
        where: { moduleKey },
        select: { isEnabled: true },
      });
      if (!mod) {
        const def = defaultModules.find((m) => m.moduleKey === moduleKey);
        return def?.isEnabled ?? true;
      }
      return mod.isEnabled;
    },
    () => {
      const def = defaultModules.find((m) => m.moduleKey === moduleKey);
      return def?.isEnabled ?? true;
    },
  );
}

// ─── Toggle a module ────────────────────────────────────────────────────

export async function toggleModule(
  moduleKey: string,
  isEnabled: boolean,
  updatedBy: string,
): Promise<void> {
  await withPrisma(
    async (client) => {
      const existing = defaultModules.find((m) => m.moduleKey === moduleKey);
      await client.moduleToggle.upsert({
        where: { moduleKey },
        update: { isEnabled, updatedBy },
        create: {
          moduleKey,
          displayName: existing?.displayName ?? moduleKey,
          description: existing?.description ?? null,
          isEnabled,
          order: existing?.order ?? 99,
          updatedBy,
        },
      });
    },
    () => undefined,
  );
}

// ─── Update module permissions ──────────────────────────────────────────

export async function updateModulePermissions(
  moduleKey: string,
  permissions: Record<string, boolean>,
  updatedBy: string,
): Promise<void> {
  await withPrisma(
    async (client) => {
      const existing = defaultModules.find((m) => m.moduleKey === moduleKey);
      await client.moduleToggle.upsert({
        where: { moduleKey },
        update: { permissions, updatedBy },
        create: {
          moduleKey,
          displayName: existing?.displayName ?? moduleKey,
          description: existing?.description ?? null,
          permissions,
          order: existing?.order ?? 99,
          updatedBy,
        },
      });
    },
    () => undefined,
  );
}

// ─── Update module config ───────────────────────────────────────────────

export async function updateModuleConfig(
  moduleKey: string,
  config: Record<string, unknown>,
  updatedBy: string,
): Promise<void> {
  await withPrisma(
    async (client) => {
      const existing = defaultModules.find((m) => m.moduleKey === moduleKey);
      await client.moduleToggle.upsert({
        where: { moduleKey },
        update: { config: config as Prisma.InputJsonValue, updatedBy },
        create: {
          moduleKey,
          displayName: existing?.displayName ?? moduleKey,
          description: existing?.description ?? null,
          config: config as Prisma.InputJsonValue,
          order: existing?.order ?? 99,
          updatedBy,
        },
      });
    },
    () => undefined,
  );
}
