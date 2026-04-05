import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: Pool;
};

const connectionString = process.env.DATABASE_URL;

let prismaInstance: PrismaClient | null = null;

if (connectionString) {
  const pool =
    globalForPrisma.pgPool ??
    new Pool({
      connectionString,
    });

  const adapter = new PrismaPg(pool);

  prismaInstance =
    globalForPrisma.prisma ??
    new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
    globalForPrisma.pgPool = pool;
  }
}

export const prisma = prismaInstance as PrismaClient;

export async function withPrisma<T>(
  query: (client: PrismaClient) => Promise<T>,
  fallback: () => T | Promise<T>,
): Promise<T> {
  if (!prismaInstance) {
    return fallback();
  }
  try {
    return await query(prismaInstance);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[prisma:fallback]", (error as Error).message);
    }
    return fallback();
  }
}
