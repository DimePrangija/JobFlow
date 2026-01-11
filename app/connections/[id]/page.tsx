import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ConnectionDetailPage from "@/components/ConnectionDetailPage";

export default async function ConnectionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { user } = await validateRequest();
  const { id } = await params;
  
  if (!user) {
    redirect("/login");
  }

  const connection = await prisma.connection.findFirst({
    where: {
      id,
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

  // Convert Date objects to strings for the component
  const connectionWithStringDates = {
    ...connection,
    createdAt: connection.createdAt.toISOString(),
    updatedAt: connection.updatedAt.toISOString(),
    outreachEntries: connection.outreachEntries.map(entry => ({
      ...entry,
      occurredAt: entry.occurredAt.toISOString(),
      createdAt: entry.createdAt.toISOString(),
    })),
  };

  return <ConnectionDetailPage connection={connectionWithStringDates} />;
}

