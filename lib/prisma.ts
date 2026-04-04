import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function withPrisma<T>(
  query: (client: PrismaClient) => Promise<T>,
  fallback: () => T | Promise<T>,
): Promise<T> {
  try {
    return await query(prisma);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[prisma:fallback]", (error as Error).message);
    }
    return fallback();
  }
}
