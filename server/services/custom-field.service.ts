import { withPrisma } from "@/lib/prisma";
import type { FieldType } from "@/types/domain";
import { Prisma } from "@prisma/client";

// ─── Types ──────────────────────────────────────────────────────────────

export type CustomFieldDef = {
  id: string;
  module: string;
  fieldName: string;
  label: string;
  fieldType: FieldType;
  placeholder: string | null;
  defaultValue: string | null;
  options: string[] | null;
  validationRules: Record<string, unknown> | null;
  order: number;
  isRequired: boolean;
  isActive: boolean;
  description: string | null;
};

export type CustomFieldWithValue = CustomFieldDef & {
  value: string | null;
};

// ─── Get custom fields for a module ─────────────────────────────────────

export async function getCustomFields(
  module: string,
  activeOnly = true,
): Promise<CustomFieldDef[]> {
  return withPrisma(
    async (client) => {
      const where = activeOnly
        ? { module, isActive: true }
        : { module };
      const fields = await client.customField.findMany({
        where,
        orderBy: { order: "asc" },
      });
      return fields.map(mapFieldDef);
    },
    () => [],
  );
}

// ─── Get custom field values for an entity ──────────────────────────────

export async function getCustomFieldValues(
  module: string,
  entityId: string,
): Promise<CustomFieldWithValue[]> {
  return withPrisma(
    async (client) => {
      const fields = await client.customField.findMany({
        where: { module, isActive: true },
        include: {
          values: {
            where: { entityId },
          },
        },
        orderBy: { order: "asc" },
      });
      return fields.map((field) => ({
        ...mapFieldDef(field),
        value: field.values[0]?.value ?? null,
      }));
    },
    () => [],
  );
}

// ─── Save custom field values for an entity ─────────────────────────────

export async function saveCustomFieldValues(
  entityId: string,
  values: { fieldId: string; value: string }[],
): Promise<void> {
  await withPrisma(
    async (client) => {
      const operations = values.map((v) =>
        client.customFieldValue.upsert({
          where: {
            fieldId_entityId: {
              fieldId: v.fieldId,
              entityId,
            },
          },
          update: { value: v.value },
          create: {
            fieldId: v.fieldId,
            entityId,
            value: v.value,
          },
        }),
      );
      await Promise.all(operations);
    },
    () => undefined,
  );
}

// ─── Create custom field ────────────────────────────────────────────────

export async function createCustomField(
  input: {
    module: string;
    fieldName: string;
    label: string;
    fieldType: FieldType;
    placeholder?: string;
    defaultValue?: string;
    options?: string[];
    validationRules?: Record<string, unknown>;
    isRequired?: boolean;
    description?: string;
    createdBy: string;
  },
): Promise<string> {
  return withPrisma(
    async (client) => {
      // Get next order number
      const maxOrder = await client.customField.aggregate({
        where: { module: input.module },
        _max: { order: true },
      });
      const nextOrder = (maxOrder._max.order ?? -1) + 1;

      const field = await client.customField.create({
        data: {
          module: input.module,
          fieldName: input.fieldName,
          label: input.label,
          fieldType: input.fieldType,
          placeholder: input.placeholder ?? null,
          defaultValue: input.defaultValue ?? null,
          options: input.options !== undefined ? input.options : Prisma.JsonNull,
          validationRules: input.validationRules !== undefined ? (input.validationRules as Prisma.InputJsonValue) : Prisma.JsonNull,
          isRequired: input.isRequired ?? false,
          description: input.description ?? null,
          order: nextOrder,
          createdBy: input.createdBy,
        },
      });
      return field.id;
    },
    () => "field-fallback",
  );
}

// ─── Update custom field ────────────────────────────────────────────────

export async function updateCustomField(
  id: string,
  input: Partial<{
    label: string;
    fieldType: FieldType;
    placeholder: string;
    defaultValue: string;
    options: string[];
    validationRules: Record<string, unknown>;
    order: number;
    isRequired: boolean;
    isActive: boolean;
    description: string;
  }>,
): Promise<void> {
  await withPrisma(
    async (client) => {
      const data: Record<string, unknown> = { ...input };

      // Handle JSON fields with proper typing
      if ('validationRules' in input && input.validationRules !== undefined) {
        data.validationRules = input.validationRules as Prisma.InputJsonValue;
      }

      await client.customField.update({
        where: { id },
        data: data as Prisma.CustomFieldUpdateInput,
      });
    },
    () => undefined,
  );
}

// ─── Delete custom field ────────────────────────────────────────────────

export async function deleteCustomField(id: string): Promise<void> {
  await withPrisma(
    async (client) => {
      await client.customField.delete({ where: { id } });
    },
    () => undefined,
  );
}

// ─── Helper ─────────────────────────────────────────────────────────────

function mapFieldDef(field: {
  id: string;
  module: string;
  fieldName: string;
  label: string;
  fieldType: FieldType;
  placeholder: string | null;
  defaultValue: string | null;
  options: unknown;
  validationRules: unknown;
  order: number;
  isRequired: boolean;
  isActive: boolean;
  description: string | null;
}): CustomFieldDef {
  return {
    id: field.id,
    module: field.module,
    fieldName: field.fieldName,
    label: field.label,
    fieldType: field.fieldType,
    placeholder: field.placeholder,
    defaultValue: field.defaultValue,
    options: field.options as string[] | null,
    validationRules: field.validationRules as Record<string, unknown> | null,
    order: field.order,
    isRequired: field.isRequired,
    isActive: field.isActive,
    description: field.description,
  };
}
