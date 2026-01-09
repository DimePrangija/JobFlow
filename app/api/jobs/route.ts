import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { z } from "zod";

const jobSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  status: z.enum(["WISHLIST", "APPLIED", "SCREEN", "INTERVIEW", "OFFER", "REJECTED"]).optional(),
  url: z.string().url().optional().or(z.literal("")),
  location: z.string().optional(),
  salaryRange: z.string().optional(),
  notes: z.string().optional(),
  appliedAt: z.string().datetime().optional().or(z.literal("")),
});

export async function GET(request: Request) {
  try {
    const { user } = await requireAuth();
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get("status");
    const q = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    const where: any = {
      userId: user.id,
    };

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (q) {
      where.company = {
        contains: q,
        mode: "insensitive",
      };
    }

    const [jobs, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.jobApplication.count({ where }),
    ]);

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Get jobs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { user } = await requireAuth();
    const body = await request.json();
    const data = jobSchema.parse(body);

    const job = await prisma.jobApplication.create({
      data: {
        userId: user.id,
        company: data.company,
        role: data.role,
        status: data.status || "WISHLIST",
        url: data.url || null,
        location: data.location || null,
        salaryRange: data.salaryRange || null,
        notes: data.notes || null,
        appliedAt: data.appliedAt ? new Date(data.appliedAt) : null,
      },
    });

    return NextResponse.json(job, { status: 201 });
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
    console.error("Create job error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

