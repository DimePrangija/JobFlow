import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check if tables exist
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: "ok",
      database: "connected",
      tables: "exist",
      userCount,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasAuthSecret: !!process.env.AUTH_SECRET,
        nodeEnv: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        status: "error",
        error: errorMessage,
        env: {
          hasDatabaseUrl: !!process.env.DATABASE_URL,
          hasAuthSecret: !!process.env.AUTH_SECRET,
          nodeEnv: process.env.NODE_ENV,
        },
      },
      { status: 500 }
    );
  }
}
