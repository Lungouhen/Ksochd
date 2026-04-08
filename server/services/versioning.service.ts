import { withPrisma } from "@/lib/prisma";
import type { PageStatus } from "@/types/domain";
import { Prisma } from "@prisma/client";

// ─── Types ──────────────────────────────────────────────────────────────

export type PageVersionInfo = {
  id: string;
  pageId: string;
  versionNumber: number;
  title: string;
  status: PageStatus;
  changeNote: string | null;
  createdBy: string;
  createdAt: string;
};

export type PageVersionDetail = PageVersionInfo & {
  content: string;
  customCss: string | null;
  customJs: string | null;
  blocks: unknown;
};

export type SettingsBackupInfo = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  createdBy: string;
  createdAt: string;
};

export type SavedReportViewInfo = {
  id: string;
  name: string;
  reportType: string;
  filters: Record<string, unknown>;
  columns: string[] | null;
  sortConfig: Record<string, string> | null;
  exportFormat: string | null;
  isDefault: boolean;
  isShared: boolean;
  createdBy: string;
};

// ─── Page Versioning ────────────────────────────────────────────────────

export async function createPageVersion(
  pageId: string,
  createdBy: string,
  changeNote?: string,
): Promise<string> {
  return withPrisma(
    async (client) => {
      const page = await client.page.findUnique({
        where: { id: pageId },
        include: { blocks: { orderBy: { order: "asc" } } },
      });
      if (!page) throw new Error("Page not found");

      // Get next version number
      const maxVersion = await client.pageVersion.aggregate({
        where: { pageId },
        _max: { versionNumber: true },
      });
      const nextVersion = (maxVersion._max.versionNumber ?? 0) + 1;

      const version = await client.pageVersion.create({
        data: {
          pageId,
          versionNumber: nextVersion,
          title: page.title,
          content: page.content,
          customCss: page.customCss,
          customJs: page.customJs,
          blocks: page.blocks.map((b) => ({
            type: b.type,
            content: b.content,
            settings: b.settings,
            order: b.order,
          })),
          status: page.status,
          changeNote: changeNote ?? null,
          createdBy,
        },
      });
      return version.id;
    },
    () => "version-fallback",
  );
}

export async function getPageVersions(
  pageId: string,
): Promise<PageVersionInfo[]> {
  return withPrisma(
    async (client) => {
      const versions = await client.pageVersion.findMany({
        where: { pageId },
        select: {
          id: true,
          pageId: true,
          versionNumber: true,
          title: true,
          status: true,
          changeNote: true,
          createdBy: true,
          createdAt: true,
        },
        orderBy: { versionNumber: "desc" },
      });
      return versions.map((v) => ({
        ...v,
        createdAt: v.createdAt.toISOString(),
      }));
    },
    () => [],
  );
}

export async function getPageVersion(
  id: string,
): Promise<PageVersionDetail | null> {
  return withPrisma(
    async (client) => {
      const version = await client.pageVersion.findUnique({
        where: { id },
      });
      if (!version) return null;
      return {
        id: version.id,
        pageId: version.pageId,
        versionNumber: version.versionNumber,
        title: version.title,
        content: version.content,
        customCss: version.customCss,
        customJs: version.customJs,
        blocks: version.blocks,
        status: version.status,
        changeNote: version.changeNote,
        createdBy: version.createdBy,
        createdAt: version.createdAt.toISOString(),
      };
    },
    () => null,
  );
}

export async function restorePageVersion(
  versionId: string,
  restoredBy: string,
): Promise<void> {
  await withPrisma(
    async (client) => {
      const version = await client.pageVersion.findUnique({
        where: { id: versionId },
      });
      if (!version) throw new Error("Version not found");

      // Create a snapshot of current state before restoring
      await createPageVersion(version.pageId, restoredBy, "Auto-saved before restore");

      // Delete existing blocks
      await client.pageBlock.deleteMany({ where: { pageId: version.pageId } });

      // Restore page content
      await client.page.update({
        where: { id: version.pageId },
        data: {
          title: version.title,
          content: version.content,
          customCss: version.customCss,
          customJs: version.customJs,
          updatedBy: restoredBy,
        },
      });

      // Restore blocks
      const blocks = version.blocks as Array<{
        type: string;
        content: string;
        settings: unknown;
        order: number;
      }>;
      if (blocks?.length) {
        await client.pageBlock.createMany({
          data: blocks.map((b) => ({
            pageId: version.pageId,
            type: b.type as never,
            content: b.content,
            settings: b.settings as never,
            order: b.order,
          })),
        });
      }
    },
    () => undefined,
  );
}

// ─── Settings Backup ────────────────────────────────────────────────────

export async function createSettingsBackup(
  name: string,
  category: string,
  data: unknown,
  createdBy: string,
  description?: string,
): Promise<string> {
  return withPrisma(
    async (client) => {
      const backup = await client.settingsBackup.create({
        data: {
          name,
          category,
          data: data as never,
          description: description ?? null,
          createdBy,
        },
      });
      return backup.id;
    },
    () => "backup-fallback",
  );
}

export async function getSettingsBackups(
  category?: string,
): Promise<SettingsBackupInfo[]> {
  return withPrisma(
    async (client) => {
      const where = category ? { category } : {};
      const backups = await client.settingsBackup.findMany({
        where,
        select: {
          id: true,
          name: true,
          category: true,
          description: true,
          createdBy: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return backups.map((b) => ({
        ...b,
        createdAt: b.createdAt.toISOString(),
      }));
    },
    () => [],
  );
}

export async function getSettingsBackup(
  id: string,
): Promise<{ data: unknown } | null> {
  return withPrisma(
    async (client) => {
      const backup = await client.settingsBackup.findUnique({
        where: { id },
        select: { data: true },
      });
      return backup;
    },
    () => null,
  );
}

// ─── Saved Report Views ─────────────────────────────────────────────────

export async function getSavedReportViews(
  reportType?: string,
  createdBy?: string,
): Promise<SavedReportViewInfo[]> {
  return withPrisma(
    async (client) => {
      const where: Record<string, unknown> = {};
      if (reportType) where.reportType = reportType;
      if (createdBy) {
        where.OR = [
          { createdBy },
          { isShared: true },
        ];
      }
      const views = await client.savedReportView.findMany({
        where,
        orderBy: [{ isDefault: "desc" }, { name: "asc" }],
      });
      return views.map((v) => ({
        id: v.id,
        name: v.name,
        reportType: v.reportType,
        filters: v.filters as Record<string, unknown>,
        columns: v.columns as string[] | null,
        sortConfig: v.sortConfig as Record<string, string> | null,
        exportFormat: v.exportFormat,
        isDefault: v.isDefault,
        isShared: v.isShared,
        createdBy: v.createdBy,
      }));
    },
    () => [],
  );
}

export async function createSavedReportView(
  input: {
    name: string;
    reportType: string;
    filters: Record<string, unknown>;
    columns?: string[];
    sortConfig?: Record<string, string>;
    exportFormat?: string;
    isShared?: boolean;
    createdBy: string;
  },
): Promise<string> {
  return withPrisma(
    async (client) => {
      const view = await client.savedReportView.create({
        data: {
          name: input.name,
          reportType: input.reportType,
          filters: input.filters as Prisma.InputJsonValue,
          columns: input.columns !== undefined ? (input.columns as Prisma.InputJsonValue) : Prisma.JsonNull,
          sortConfig: input.sortConfig !== undefined ? (input.sortConfig as Prisma.InputJsonValue) : Prisma.JsonNull,
          exportFormat: input.exportFormat ?? null,
          isShared: input.isShared ?? false,
          createdBy: input.createdBy,
        },
      });
      return view.id;
    },
    () => "view-fallback",
  );
}

export async function updateSavedReportView(
  id: string,
  input: Partial<{
    name: string;
    filters: Record<string, unknown>;
    columns: string[];
    sortConfig: Record<string, string>;
    exportFormat: string;
    isDefault: boolean;
    isShared: boolean;
  }>,
): Promise<void> {
  await withPrisma(
    async (client) => {
      const data: Record<string, unknown> = { ...input };

      // Handle JSON fields with proper typing
      if ('filters' in input && input.filters !== undefined) {
        data.filters = input.filters as Prisma.InputJsonValue;
      }
      if ('columns' in input && input.columns !== undefined) {
        data.columns = input.columns as Prisma.InputJsonValue;
      }
      if ('sortConfig' in input && input.sortConfig !== undefined) {
        data.sortConfig = input.sortConfig as Prisma.InputJsonValue;
      }

      await client.savedReportView.update({
        where: { id },
        data: data as Prisma.SavedReportViewUpdateInput,
      });
    },
    () => undefined,
  );
}

export async function deleteSavedReportView(id: string): Promise<void> {
  await withPrisma(
    async (client) => {
      await client.savedReportView.delete({ where: { id } });
    },
    () => undefined,
  );
}
