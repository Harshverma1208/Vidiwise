import { defineConfig } from 'drizzle-kit'
import { env } from '~/env'
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/server/db/schema.ts",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  out: "./drizzle",
  tablesFilter: ["vid-b-web_*"],
})

