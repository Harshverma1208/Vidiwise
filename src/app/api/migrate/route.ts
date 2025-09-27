/**
 * Database Migration API Route
 * 
 * This endpoint runs the database migration.
 * Only accessible in development or with proper authorization.
 * 
 * POST /api/migrate - Run the migration
 */

import { NextRequest, NextResponse } from "next/server";
import { setupDatabaseWithPg, testDatabaseQueries } from "~/lib/db/migrate-setup";
import { runServerMigration, testServerConnection } from "~/lib/db/server-migrate";

export async function POST(request: NextRequest) {
  try {
    // Check if running in development or if authorized
    if (process.env.NODE_ENV !== "development") {
      const authHeader = request.headers.get("authorization");
      const expectedToken = process.env.MIGRATION_TOKEN;
      
      if (!authHeader || !expectedToken || authHeader !== `Bearer ${expectedToken}`) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    console.log("🚀 Starting migration via API...");
    
    // Setup the database with pg
    const setupResult = await setupDatabaseWithPg();
    if (!setupResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Database setup failed: ${setupResult.error}`,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    // Test database queries
    const testResult = await testDatabaseQueries();
    
    // Test server connection
    const serverTestResult = await testServerConnection();
    
    if (testResult.success && serverTestResult.success) {
      return NextResponse.json({
        success: true,
        message: "Migration completed successfully",
        setup: setupResult,
        tests: testResult,
        serverTests: serverTestResult,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: testResult.error || serverTestResult.error || "Migration failed",
          setup: setupResult,
          tests: testResult,
          serverTests: serverTestResult,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("❌ Migration API error:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Migration endpoint - use POST to run migration",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
}