import { defineConfig } from "@prisma/config";
import fs from "fs";
import path from "path";

function getEnvUrl() {
  if (process.env.DIRECT_URL) return process.env.DIRECT_URL;
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const envLocalPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envLocalPath)) {
    const content = fs.readFileSync(envLocalPath, "utf-8");
    const directMatch = content.match(/DIRECT_URL=["']?([^"'\r\n]+)["']?/);
    if (directMatch && directMatch[1]) return directMatch[1];
    const dbMatch = content.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
    if (dbMatch && dbMatch[1]) return dbMatch[1];
  }
  return "postgresql://postgres.tiraknfedmxqzwoqsbej:Pestiq%40123s@aws-0-ca-central-1.pooler.supabase.com:5432/postgres";
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: getEnvUrl(),
  },
});
