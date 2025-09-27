/**
 * Database Migration Setup for pg (node-postgres)
 * 
 * This script handles the complete migration setup from postgres to pg.
 * It ensures all tables are created properly and migrations work correctly.
 */

import { db, pool } from "~/server/db";
import { sql } from "drizzle-orm";

export async function setupDatabaseWithPg() {
  console.log("🚀 Setting up database with pg (node-postgres)...");

  try {
    // Test database connection
    console.log("📡 Testing database connection...");
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log("✅ Database connection successful:", result.rows[0]);
    client.release();

    // Create user role enum if it doesn't exist
    console.log("📋 Creating user role enum...");
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE "user_role" AS ENUM('user', 'admin', 'moderator');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create NextAuth tables
    console.log("📋 Creating NextAuth tables...");
    
    // User table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" text PRIMARY KEY NOT NULL,
        "name" text,
        "email" text NOT NULL,
        "emailVerified" timestamp,
        "image" text,
        "role" "user_role" DEFAULT 'user' NOT NULL,
        "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    // Account table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "account" (
        "userId" text NOT NULL,
        "type" text NOT NULL,
        "provider" text NOT NULL,
        "providerAccountId" text NOT NULL,
        "refresh_token" text,
        "access_token" text,
        "expires_at" integer,
        "token_type" text,
        "scope" text,
        "id_token" text,
        "session_state" text,
        CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
      );
    `);

    // Session table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "session" (
        "sessionToken" text PRIMARY KEY NOT NULL,
        "userId" text NOT NULL,
        "expires" timestamp NOT NULL
      );
    `);

    // Verification token table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "verificationToken" (
        "identifier" text NOT NULL,
        "token" text NOT NULL,
        "expires" timestamp NOT NULL,
        CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
      );
    `);

    // Add foreign key constraints
    console.log("📋 Adding foreign key constraints...");
    await db.execute(sql`
      ALTER TABLE "account" 
      ADD CONSTRAINT "account_userId_user_id_fk" 
      FOREIGN KEY ("userId") REFERENCES "user"("id") 
      ON DELETE cascade ON UPDATE no action;
    `);

    await db.execute(sql`
      ALTER TABLE "session" 
      ADD CONSTRAINT "session_userId_user_id_fk" 
      FOREIGN KEY ("userId") REFERENCES "user"("id") 
      ON DELETE cascade ON UPDATE no action;
    `);

    // Create indexes for better performance
    console.log("📋 Creating performance indexes...");
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "user_email_idx" ON "user" ("email");
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account" ("userId");
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session" ("userId");
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "session_expires_idx" ON "session" ("expires");
    `);

    // Update existing application tables to reference new user table
    console.log("📋 Updating application tables...");
    
    // Update profiles table
    await db.execute(sql`
      ALTER TABLE "vid-b-web_profiles" 
      ADD CONSTRAINT "profiles_userId_user_id_fk" 
      FOREIGN KEY ("userId") REFERENCES "user"("id") 
      ON DELETE cascade ON UPDATE no action;
    `);

    // Update transcriptions table
    await db.execute(sql`
      ALTER TABLE "vid-b-web_transcriptions" 
      ADD CONSTRAINT "transcriptions_userId_user_id_fk" 
      FOREIGN KEY ("userId") REFERENCES "user"("id") 
      ON DELETE cascade ON UPDATE no action;
    `);

    console.log("✅ Database setup with pg completed successfully!");
    
    return {
      success: true,
      message: "Database setup completed successfully",
      tables: [
        "user", "account", "session", "verificationToken",
        "vid-b-web_profiles", "vid-b-web_transcriptions", "vid-b-web_transcriptRows"
      ]
    };

  } catch (error) {
    console.error("❌ Database setup failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Test database queries
export async function testDatabaseQueries() {
  console.log("🧪 Testing database queries...");

  try {
    // Test basic query
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log("✅ Basic query test passed:", result);

    // Test user table query
    const userCount = await db.execute(sql`SELECT COUNT(*) as count FROM "user"`);
    console.log("✅ User table query test passed:", userCount);

    // Test connection pool
    const client = await pool.connect();
    const poolTest = await client.query('SELECT current_database()');
    console.log("✅ Connection pool test passed:", poolTest.rows[0]);
    client.release();

    return {
      success: true,
      message: "All database tests passed"
    };

  } catch (error) {
    console.error("❌ Database query test failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export default setupDatabaseWithPg;

