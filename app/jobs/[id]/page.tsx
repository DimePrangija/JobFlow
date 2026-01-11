import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import JobDetailPage from "@/components/JobDetailPage";

export default async function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await validateRequest();
  const { id } = await params;
  
  if (!user) {
    redirect("/login");
  }

  const job = await prisma.jobApplication.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!job) {
    redirect("/jobs");
  }

  // Convert Date objects to strings for the component
  const jobWithStringDates = {
    ...job,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
    appliedAt: job.appliedAt?.toISOString() || null,
  };

  return <JobDetailPage job={jobWithStringDates} />;
}

