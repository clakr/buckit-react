import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.POSTGRES_HOST ?? "",
    user: process.env.POSTGRES_USER ?? "",
    password: process.env.POSTGRES_PASSWORD ?? "",
    database: process.env.POSTGRES_DATABASE ?? "",
  },
});
