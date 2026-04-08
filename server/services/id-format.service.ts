import { withPrisma } from "@/lib/prisma";

// ─── Types ──────────────────────────────────────────────────────────────

export type IdFormatSettings = {
  entityType: string;
  prefix: string;
  separator: string;
  padLength: number;
  nextSequence: number;
  format: string;
  suffix: string | null;
  includeYear: boolean;
  includeMonth: boolean;
  description: string | null;
};

const defaultFormats: Record<string, IdFormatSettings> = {
  member: {
    entityType: "member",
    prefix: "KSO",
    separator: "-",
    padLength: 6,
    nextSequence: 1,
    format: "{{prefix}}{{separator}}{{sequence}}",
    suffix: null,
    includeYear: false,
    includeMonth: false,
    description: "Member ID format (e.g., KSO-000001)",
  },
  receipt: {
    entityType: "receipt",
    prefix: "REC",
    separator: "-",
    padLength: 6,
    nextSequence: 1,
    format: "{{prefix}}{{separator}}{{year}}{{separator}}{{sequence}}",
    suffix: null,
    includeYear: true,
    includeMonth: false,
    description: "Receipt ID format (e.g., REC-2026-000001)",
  },
  invoice: {
    entityType: "invoice",
    prefix: "INV",
    separator: "-",
    padLength: 5,
    nextSequence: 1,
    format: "{{prefix}}{{separator}}{{year}}{{month}}{{separator}}{{sequence}}",
    suffix: null,
    includeYear: true,
    includeMonth: true,
    description: "Invoice ID format (e.g., INV-202604-00001)",
  },
  event: {
    entityType: "event",
    prefix: "EVT",
    separator: "-",
    padLength: 4,
    nextSequence: 1,
    format: "{{prefix}}{{separator}}{{sequence}}",
    suffix: null,
    includeYear: false,
    includeMonth: false,
    description: "Event ID format (e.g., EVT-0001)",
  },
  payment: {
    entityType: "payment",
    prefix: "PAY",
    separator: "-",
    padLength: 6,
    nextSequence: 1,
    format: "{{prefix}}{{separator}}{{year}}{{separator}}{{sequence}}",
    suffix: null,
    includeYear: true,
    includeMonth: false,
    description: "Payment ID format (e.g., PAY-2026-000001)",
  },
};

// ─── Get ID format config for an entity type ────────────────────────────

export async function getIdFormat(
  entityType: string,
): Promise<IdFormatSettings> {
  return withPrisma(
    async (client) => {
      const config = await client.idFormatConfig.findUnique({
        where: { entityType },
      });
      if (!config) {
        return defaultFormats[entityType] ?? defaultFormats.member;
      }
      return {
        entityType: config.entityType,
        prefix: config.prefix,
        separator: config.separator,
        padLength: config.padLength,
        nextSequence: config.nextSequence,
        format: config.format,
        suffix: config.suffix,
        includeYear: config.includeYear,
        includeMonth: config.includeMonth,
        description: config.description,
      };
    },
    () => defaultFormats[entityType] ?? defaultFormats.member,
  );
}

// ─── Get all ID format configs ──────────────────────────────────────────

export async function getAllIdFormats(): Promise<IdFormatSettings[]> {
  return withPrisma(
    async (client) => {
      const configs = await client.idFormatConfig.findMany({
        orderBy: { entityType: "asc" },
      });
      if (!configs.length) return Object.values(defaultFormats);

      const result: IdFormatSettings[] = [];
      const found = new Set<string>();
      for (const config of configs) {
        found.add(config.entityType);
        result.push({
          entityType: config.entityType,
          prefix: config.prefix,
          separator: config.separator,
          padLength: config.padLength,
          nextSequence: config.nextSequence,
          format: config.format,
          suffix: config.suffix,
          includeYear: config.includeYear,
          includeMonth: config.includeMonth,
          description: config.description,
        });
      }
      // Include defaults for entity types not yet configured
      for (const [key, value] of Object.entries(defaultFormats)) {
        if (!found.has(key)) result.push(value);
      }
      return result;
    },
    () => Object.values(defaultFormats),
  );
}

// ─── Generate a formatted ID and increment the sequence ─────────────────

export async function generateFormattedId(
  entityType: string,
): Promise<string> {
  return withPrisma(
    async (client) => {
      // Upsert to ensure config exists, then atomically get and increment
      const config = await client.idFormatConfig.upsert({
        where: { entityType },
        update: { nextSequence: { increment: 1 } },
        create: {
          ...(defaultFormats[entityType] ?? defaultFormats.member),
          entityType,
        },
      });

      // The sequence used is the value BEFORE increment
      const sequence = config.nextSequence;
      return formatId(config, sequence);
    },
    () => {
      const config = defaultFormats[entityType] ?? defaultFormats.member;
      return formatId(config, config.nextSequence);
    },
  );
}

// ─── Update ID format config ────────────────────────────────────────────

export async function updateIdFormat(
  entityType: string,
  settings: Partial<Omit<IdFormatSettings, "entityType">>,
  updatedBy: string,
): Promise<void> {
  const defaults = defaultFormats[entityType] ?? defaultFormats.member;
  await withPrisma(
    async (client) => {
      await client.idFormatConfig.upsert({
        where: { entityType },
        update: { ...settings, updatedBy },
        create: {
          ...defaults,
          ...settings,
          entityType,
          updatedBy,
        },
      });
    },
    () => undefined,
  );
}

// ─── Format helper ──────────────────────────────────────────────────────

function formatId(
  config: IdFormatSettings,
  sequence: number,
): string {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const paddedSeq = sequence.toString().padStart(config.padLength, "0");

  let result = config.format;
  result = result.replace(/\{\{prefix\}\}/g, config.prefix);
  result = result.replace(/\{\{separator\}\}/g, config.separator);
  result = result.replace(/\{\{sequence\}\}/g, paddedSeq);
  result = result.replace(/\{\{year\}\}/g, year);
  result = result.replace(/\{\{month\}\}/g, month);
  if (config.suffix) {
    result = result.replace(/\{\{suffix\}\}/g, config.suffix);
  } else {
    result = result.replace(/\{\{suffix\}\}/g, "");
  }
  return result;
}

// ─── Preview formatted ID without incrementing ──────────────────────────

export async function previewFormattedId(
  entityType: string,
): Promise<string> {
  const config = await getIdFormat(entityType);
  return formatId(config, config.nextSequence);
}
