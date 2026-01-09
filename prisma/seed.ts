import { PrismaClient, JobStatus, OutreachType } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create demo user
  const passwordHash = await hash("demo123", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@jobflow.com" },
    update: {},
    create: {
      email: "demo@jobflow.com",
      passwordHash,
    },
  });

  console.log("Created user:", user.email);

  // Create job applications
  const jobs = [
    {
      userId: user.id,
      company: "TechCorp",
      role: "Senior Software Engineer",
      status: "INTERVIEW" as JobStatus,
      url: "https://techcorp.com/careers",
      location: "San Francisco, CA",
      salaryRange: "$150k - $200k",
      notes: "Great company culture, interesting tech stack",
      appliedAt: new Date("2024-01-15"),
    },
    {
      userId: user.id,
      company: "StartupXYZ",
      role: "Full Stack Developer",
      status: "APPLIED" as JobStatus,
      url: "https://startupxyz.com/jobs",
      location: "Remote",
      salaryRange: "$120k - $160k",
      notes: "Early stage startup, equity included",
      appliedAt: new Date("2024-01-20"),
    },
    {
      userId: user.id,
      company: "BigTech Inc",
      role: "Software Engineer II",
      status: "SCREEN" as JobStatus,
      url: "https://bigtech.com/careers",
      location: "Seattle, WA",
      salaryRange: "$180k - $220k",
      notes: "Phone screen scheduled for next week",
      appliedAt: new Date("2024-01-18"),
    },
    {
      userId: user.id,
      company: "DesignStudio",
      role: "Frontend Engineer",
      status: "WISHLIST" as JobStatus,
      url: "https://designstudio.com/jobs",
      location: "New York, NY",
      notes: "Interesting design-focused company",
    },
    {
      userId: user.id,
      company: "CloudServices",
      role: "Backend Engineer",
      status: "REJECTED" as JobStatus,
      url: "https://cloudservices.com/careers",
      location: "Austin, TX",
      notes: "Not a good fit for their team",
      appliedAt: new Date("2024-01-10"),
    },
  ];

  for (const job of jobs) {
    await prisma.jobApplication.create({
      data: job,
    });
  }

  console.log(`Created ${jobs.length} job applications`);

  // Create connections
  const connections = [
    {
      userId: user.id,
      name: "Sarah Johnson",
      company: "TechCorp",
      title: "Engineering Manager",
      email: "sarah.johnson@techcorp.com",
      linkedinUrl: "https://linkedin.com/in/sarahjohnson",
      notes: "Met at conference, very helpful",
    },
    {
      userId: user.id,
      name: "Mike Chen",
      company: "StartupXYZ",
      title: "CTO",
      email: "mike@startupxyz.com",
      linkedinUrl: "https://linkedin.com/in/mikechen",
      notes: "Referred me for the position",
    },
    {
      userId: user.id,
      name: "Emily Rodriguez",
      company: "DesignStudio",
      title: "Lead Designer",
      email: "emily@designstudio.com",
      notes: "Potential mentor",
    },
  ];

  const createdConnections = [];
  for (const conn of connections) {
    const created = await prisma.connection.create({
      data: conn,
    });
    createdConnections.push(created);
  }

  console.log(`Created ${connections.length} connections`);

  // Create outreach entries
  const outreachEntries = [
    {
      connectionId: createdConnections[0].id,
      userId: user.id,
      type: "EMAIL" as OutreachType,
      occurredAt: new Date("2024-01-16T10:00:00"),
      notes: "Sent follow-up email after interview",
    },
    {
      connectionId: createdConnections[0].id,
      userId: user.id,
      type: "CALL" as OutreachType,
      occurredAt: new Date("2024-01-14T14:30:00"),
      notes: "Initial phone call to discuss role",
    },
    {
      connectionId: createdConnections[1].id,
      userId: user.id,
      type: "LINKEDIN" as OutreachType,
      occurredAt: new Date("2024-01-19T09:00:00"),
      notes: "Thanked for referral via LinkedIn message",
    },
    {
      connectionId: createdConnections[2].id,
      userId: user.id,
      type: "EMAIL" as OutreachType,
      occurredAt: new Date("2024-01-22T11:00:00"),
      notes: "Reached out to learn more about the company",
    },
  ];

  for (const entry of outreachEntries) {
    await prisma.outreachEntry.create({
      data: entry,
    });
  }

  console.log(`Created ${outreachEntries.length} outreach entries`);

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

