import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import JobDetailPage from "@/components/JobDetailPage";

export default async function JobDetail({ params }: { params: { id: string } }) {
  const { user } = await validateRequest();
  
  if (!user) {
    redirect("/login");
  }

  const job = await prisma.jobApplication.findFirst({
    where: {
      id: params.id,
      userId: user.id,
    },
  });

  if (!job) {
    redirect("/jobs");
  }

  return <JobDetailPage job={job} />;
}

