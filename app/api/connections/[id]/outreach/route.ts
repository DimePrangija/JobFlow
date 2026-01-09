import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const outreachSchema = z.object({
  type: z.enum(["EMAIL", "LINKEDIN", "CALL", "OTHER"]),
  occurredAt: z.string().datetime(),
  notes: z.string().min(1, "Notes are required"),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await requireAuth();

    // Verify connection ownership
    const connection = await prisma.connection.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "Connection not found" },
        { status: 404 }
      );
    }

    const outreach = await prisma.outreachEntry.findMany({
      where: {
        connectionId: params.id,
        userId: user.id,
      },
      orderBy: {
        occurredAt: "desc",
      },
    });

    return NextResponse.json({ outreach });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Get outreach error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { user } = await requireAuth();
    const body = await request.json();
    const data = outreachSchema.parse(body);

    // Verify connection ownership
    const connection = await prisma.connection.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!connection) {
      return NextResponse.json(
        { error: "Connection not found" },
        { status: 404 }
      );
    }

    const outreach = await prisma.outreachEntry.create({
      data: {
        connectionId: params.id,
        userId: user.id,
        type: data.type,
        occurredAt: new Date(data.occurredAt),
        notes: data.notes,
      },
    });

    return NextResponse.json(outreach, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("Create outreach error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

