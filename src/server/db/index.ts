import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  pool: Pool | undefined;
};

// Create connection pool with pg
const pool = globalForDb.pool ?? new Pool({
  connectionString: env.DATABASE_URL,
  // Connection pool settings for better performance
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

if (env.NODE_ENV !== "production") globalForDb.pool = pool;

// Export the pool for direct access if needed
export { pool };

// Create Drizzle instance with the pool
export const db = drizzle(pool, { schema });

// Note: Migration functions are moved to separate files to avoid bundling issues