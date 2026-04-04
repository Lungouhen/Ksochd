import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasources: {
    db: {
      provider: "postgresql",
      url: { fromEnvVar: "DATABASE_URL" },
    },
  },
});
