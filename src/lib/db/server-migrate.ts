/**
 * Server-only Migration Utility
 * 
 * This file contains server-only migration functions to avoid
 * bundling Node.js modules in the client build.
 */

import { db, pool } from "~/server/db";
import { sql } from "drizzle-orm";

export async function runServerMigration() {
  // Dynamic import to avoid bundling migrator in client
  const { migrate } = await import("drizzle-orm/node-postgres/migrator");
  
  try {
    console.log("🔄 Starting server migration...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Server migration completed successfully!");
    return { success: true };
  } catch (error: any) {
    console.error("❌ Server migration failed:", error.message);
    return { success: false, error: error.message };
  }
}

export async function testServerConnection() {
  try {
    console.log("🧪 Testing server database connection...");
    
    // Test basic connection
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    console.log("✅ Server connection test passed:", result.rows[0]);
    client.release();

    // Test Drizzle query
    const drizzleResult = await db.execute(sql`SELECT 1 as test`);
    console.log("✅ Server Drizzle query test passed:", drizzleResult);

    return { success: true };
  } catch (error: any) {
    console.error("❌ Server connection test failed:", error.message);
    return { success: false, error: error.message };
  }
}

