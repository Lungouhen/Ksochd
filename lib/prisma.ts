import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: Pool;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required for Prisma");
}

const pool =
  globalForPrisma.pgPool ??
  new Pool({
    connectionString,
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pgPool = pool;
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
