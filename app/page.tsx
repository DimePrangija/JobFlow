import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import Dashboard from "@/components/Dashboard";

export default async function Home() {
  const { user } = await validateRequest();
  
  if (!user) {
    redirect("/login");
  }

  return <Dashboard />;
}

