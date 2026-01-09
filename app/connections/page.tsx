import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import ConnectionsPage from "@/components/ConnectionsPage";

export default async function Connections() {
  const { user } = await validateRequest();
  
  if (!user) {
    redirect("/login");
  }

  return <ConnectionsPage />;
}

