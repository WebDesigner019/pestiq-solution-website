import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
function getDbUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  // Route modules are loaded during builds even when they do not use the database.
  // This non-routable placeholder permits that compilation only; every route that
  // accesses data separately checks DATABASE_URL before making a query.
  return "postgresql://unconfigured:unconfigured@127.0.0.1:1/pestiq_unconfigured";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = getDbUrl();
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
