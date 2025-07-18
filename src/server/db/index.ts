import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "~/env";
import * as schema from "./schema";
import { migrate } from "drizzle-orm/postgres-js/migrator";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

export const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;


export const db = drizzle(conn, { schema });

// const migrateDb = async () => {
//   try {
//    await migrate(db, { migrationsFolder: "./drizzle" }); 
//   } catch (error: any) {
//     console.log(error.message) 
//   }
// }

// migrateDb().catch(console.error);