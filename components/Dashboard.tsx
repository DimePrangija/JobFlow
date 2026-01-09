import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import Nav from "@/components/Nav";
import Link from "next/link";

export default async function Dashboard() {
  const { user } = await requireAuth();

  const [jobStats, recentOutreach] = await Promise.all([
    prisma.jobApplication.groupBy({
      by: ["status"],
      where: { userId: user.id },
      _count: true,
    }),
    prisma.outreachEntry.findMany({
      where: { userId: user.id },
      include: {
        connection: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
      },
      orderBy: { occurredAt: "desc" },
      take: 5,
    }),
  ]);

  const statusCounts: Record<string, number> = {
    WISHLIST: 0,
    APPLIED: 0,
    SCREEN: 0,
    INTERVIEW: 0,
    OFFER: 0,
    REJECTED: 0,
  };

  jobStats.forEach((stat) => {
    statusCounts[stat.status] = stat._count;
  });

  const totalJobs = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

          {/* Job Status Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="text-2xl font-bold text-gray-900">{totalJobs}</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Jobs</dt>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="text-2xl font-bold text-gray-900">{count}</div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {status.charAt(0) + status.slice(1).toLowerCase()}
                        </dt>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Outreach */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Outreach</h2>
              {recentOutreach.length === 0 ? (
                <p className="text-gray-500 text-sm">No outreach entries yet.</p>
              ) : (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {recentOutreach.map((entry, idx) => (
                      <li key={entry.id}>
                        <div className="relative pb-8">
                          {idx !== recentOutreach.length - 1 && (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                <span className="text-white text-xs font-medium">
                                  {entry.type.charAt(0)}
                                </span>
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">
                                  <Link
                                    href={`/connections/${entry.connection.id}`}
                                    className="font-medium text-gray-900 hover:text-blue-600"
                                  >
                                    {entry.connection.name}
                                  </Link>
                                  {" - "}
                                  <span className="font-medium">{entry.type}</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-1">{entry.notes}</p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                {new Date(entry.occurredAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

