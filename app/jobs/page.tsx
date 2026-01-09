import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import JobsPage from "@/components/JobsPage";

export default async function Jobs() {
  const { user } = await validateRequest();
  
  if (!user) {
    redirect("/login");
  }

  return <JobsPage />;
}

