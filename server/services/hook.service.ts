import { withPrisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// ─── Types ──────────────────────────────────────────────────────────────

export type HookRegistrationInfo = {
  id: string;
  hookPoint: string;
  name: string;
  description: string | null;
  handlerType: string;
  handlerConfig: Record<string, unknown>;
  priority: number;
  isActive: boolean;
  conditions: Record<string, unknown> | null;
};

// Available hook points
export const HOOK_POINTS = [
  "before_member_create",
  "after_member_create",
  "before_member_approve",
  "after_member_approve",
  "before_member_reject",
  "after_member_reject",
  "before_payment_create",
  "after_payment_success",
  "after_payment_failure",
  "before_event_create",
  "after_event_create",
  "before_registration_create",
  "after_registration_confirm",
  "before_content_publish",
  "after_content_publish",
  "before_notification_send",
  "after_notification_send",
  "before_page_publish",
  "after_page_publish",
  "before_settings_update",
  "after_settings_update",
] as const;

export type HookPoint = (typeof HOOK_POINTS)[number];

// ─── Get all hooks ──────────────────────────────────────────────────────

export async function getHookRegistrations(
  hookPoint?: string,
): Promise<HookRegistrationInfo[]> {
  return withPrisma(
    async (client) => {
      const where = hookPoint
        ? { hookPoint, isActive: true }
        : {};
      const hooks = await client.hookRegistration.findMany({
        where,
        orderBy: [{ hookPoint: "asc" }, { priority: "asc" }],
      });
      return hooks.map(mapHook);
    },
    () => [],
  );
}

// ─── Execute hooks for a point ──────────────────────────────────────────

export async function executeHooks(
  hookPoint: string,
  context: Record<string, unknown>,
): Promise<void> {
  const hooks = await getHookRegistrations(hookPoint);
  for (const hook of hooks) {
    try {
      if (hook.handlerType === "webhook") {
        const url = hook.handlerConfig.url as string;
        if (url) {
          await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ hookPoint, context, hookId: hook.id }),
          });
        }
      }
      // "internal" and "script" types are reserved for future plugins
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[hook:error] ${hook.name}:`, (error as Error).message);
      }
    }
  }
}

// ─── Create hook ────────────────────────────────────────────────────────

export async function createHookRegistration(
  input: {
    hookPoint: string;
    name: string;
    description?: string;
    handlerType: string;
    handlerConfig: Record<string, unknown>;
    priority?: number;
    conditions?: Record<string, unknown>;
    createdBy: string;
  },
): Promise<string> {
  return withPrisma(
    async (client) => {
      const hook = await client.hookRegistration.create({
        data: {
          hookPoint: input.hookPoint,
          name: input.name,
          description: input.description ?? null,
          handlerType: input.handlerType,
          handlerConfig: input.handlerConfig as Prisma.InputJsonValue,
          priority: input.priority ?? 10,
          conditions: input.conditions !== undefined ? (input.conditions as Prisma.InputJsonValue) : Prisma.JsonNull,
          createdBy: input.createdBy,
        },
      });
      return hook.id;
    },
    () => "hook-fallback",
  );
}

// ─── Update hook ────────────────────────────────────────────────────────

export async function updateHookRegistration(
  id: string,
  input: Partial<{
    name: string;
    description: string;
    handlerType: string;
    handlerConfig: Record<string, unknown>;
    priority: number;
    isActive: boolean;
    conditions: Record<string, unknown>;
  }>,
): Promise<void> {
  await withPrisma(
    async (client) => {
      const data: Record<string, unknown> = { ...input };

      // Handle JSON fields with proper typing
      if ('handlerConfig' in input && input.handlerConfig !== undefined) {
        data.handlerConfig = input.handlerConfig as Prisma.InputJsonValue;
      }
      if ('conditions' in input && input.conditions !== undefined) {
        data.conditions = input.conditions as Prisma.InputJsonValue;
      }

      await client.hookRegistration.update({
        where: { id },
        data: data as Prisma.HookRegistrationUpdateInput,
      });
    },
    () => undefined,
  );
}

// ─── Delete hook ────────────────────────────────────────────────────────

export async function deleteHookRegistration(id: string): Promise<void> {
  await withPrisma(
    async (client) => {
      await client.hookRegistration.delete({ where: { id } });
    },
    () => undefined,
  );
}

// ─── Helper ─────────────────────────────────────────────────────────────

function mapHook(hook: {
  id: string;
  hookPoint: string;
  name: string;
  description: string | null;
  handlerType: string;
  handlerConfig: unknown;
  priority: number;
  isActive: boolean;
  conditions: unknown;
}): HookRegistrationInfo {
  return {
    id: hook.id,
    hookPoint: hook.hookPoint,
    name: hook.name,
    description: hook.description,
    handlerType: hook.handlerType,
    handlerConfig: hook.handlerConfig as Record<string, unknown>,
    priority: hook.priority,
    isActive: hook.isActive,
    conditions: hook.conditions as Record<string, unknown> | null,
  };
}
