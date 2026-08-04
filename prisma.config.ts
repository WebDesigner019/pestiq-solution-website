import { defineConfig } from "@prisma/config";

function getEnvUrl() {
  if (process.env.DIRECT_URL) return process.env.DIRECT_URL;
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  // Allows Prisma generation during a source-only build. It is never a real database credential.
  return "postgresql://unconfigured:unconfigured@127.0.0.1:1/pestiq_unconfigured";
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: getEnvUrl(),
  },
});
