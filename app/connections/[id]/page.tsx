import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ConnectionDetailPage from "@/components/ConnectionDetailPage";

export default async function ConnectionDetail({ params }: { params: { id: string } }) {
  const { user } = await validateRequest();
  
  if (!user) {
    redirect("/login");
  }

  const connection = await prisma.connection.findFirst({
    where: {
      id: params.id,
      userId: user.id,
    },
    include: {
      outreachEntries: {
        orderBy: {
          occurredAt: "desc",
        },
      },
    },
  });

  if (!connection) {
    redirect("/connections");
  }

  return <ConnectionDetailPage connection={connection} />;
}

