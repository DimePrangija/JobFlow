import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import Nav from "@/components/Nav";
import Link from "next/link";

const statusColors: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  WISHLIST: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", icon: "⭐" },
  APPLIED: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: "📝" },
  SCREEN: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200", icon: "📞" },
  INTERVIEW: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: "🎯" },
  OFFER: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", icon: "🎉" },
  REJECTED: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: "❌" },
};

export default async function Dashboard() {
  const { user } = await requireAuth();

  const [jobStats, recentOutreach, connectionCount, totalOutreach, recentJobs] = await Promise.all([
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
    prisma.connection.count({ where: { userId: user.id } }),
    prisma.outreachEntry.count({ where: { userId: user.id } }),
    prisma.jobApplication.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        company: true,
        role: true,
        status: true,
        createdAt: true,
      },
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
  const activeJobs = statusCounts.APPLIED + statusCounts.SCREEN + statusCounts.INTERVIEW;
  const maxCount = Math.max(...Object.values(statusCounts), 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Nav />
      <main className="lg:ml-64 min-h-screen py-8 px-4 sm:px-6 lg:px-10 pt-16 lg:pt-8">
        <div className="py-6">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600 text-sm sm:text-base">Overview of your job search and network</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-purple-200 text-sm font-medium">Total</span>
              </div>
              <div className="text-4xl font-bold mb-1">{totalJobs}</div>
              <div className="text-purple-100 text-sm">Job Applications</div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-blue-200 text-sm font-medium">Active</span>
              </div>
              <div className="text-4xl font-bold mb-1">{activeJobs}</div>
              <div className="text-blue-100 text-sm">In Progress</div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-green-200 text-sm font-medium">Network</span>
              </div>
              <div className="text-4xl font-bold mb-1">{connectionCount}</div>
              <div className="text-green-100 text-sm">Connections</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="text-orange-200 text-sm font-medium">Outreach</span>
              </div>
              <div className="text-4xl font-bold mb-1">{totalOutreach}</div>
              <div className="text-orange-100 text-sm">Total Activities</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Job Status Breakdown */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">Job Status Breakdown</h2>
                <p className="text-sm text-gray-500 mt-1">Distribution across all stages</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Object.entries(statusCounts).map(([status, count]) => {
                    const colors = statusColors[status];
                    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    return (
                      <div key={status} className="group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{colors.icon}</span>
                            <span className="font-semibold text-gray-700">
                              {status.charAt(0) + status.slice(1).toLowerCase()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl font-bold text-gray-900">{count}</span>
                            {count > 0 && (
                              <span className="text-sm text-gray-500 w-12 text-right">
                                {Math.round(percentage)}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colors.bg} rounded-full transition-all duration-500 group-hover:shadow-md`}
                            style={{ width: `${percentage}%` }}
                          />
                  </div>
                  </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">Quick Stats</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <div>
                    <div className="text-2xl font-bold text-purple-900">{statusCounts.OFFER}</div>
                    <div className="text-sm text-purple-700 font-medium">Offers Received</div>
                  </div>
                  <div className="text-3xl">🎉</div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div>
                    <div className="text-2xl font-bold text-blue-900">{statusCounts.INTERVIEW}</div>
                    <div className="text-sm text-blue-700 font-medium">Interviews</div>
                    </div>
                  <div className="text-3xl">🎯</div>
                    </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div>
                    <div className="text-2xl font-bold text-green-900">{statusCounts.APPLIED}</div>
                    <div className="text-sm text-green-700 font-medium">Applications Sent</div>
                  </div>
                  <div className="text-3xl">📝</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Jobs */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Jobs</h2>
                  <p className="text-sm text-gray-500 mt-1">Latest applications</p>
                </div>
                <Link href="/jobs" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  View All →
                </Link>
              </div>
              <div className="p-6">
                {recentJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No jobs yet.</p>
                    <Link href="/jobs" className="text-purple-600 hover:text-purple-700 text-sm font-medium mt-2 inline-block">
                      Add your first job
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentJobs.map((job) => {
                      const colors = statusColors[job.status];
                      return (
                        <Link
                          key={job.id}
                          href={`/jobs/${job.id}`}
                          className="block p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 group"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600">
                                  {job.company}
                                </h3>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text} ${colors.border} border`}>
                                  {job.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{job.role}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(job.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
          </div>

          {/* Recent Outreach */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Outreach</h2>
                  <p className="text-sm text-gray-500 mt-1">Latest activities</p>
                </div>
                <Link href="/connections" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  View All →
                </Link>
              </div>
              <div className="p-6">
              {recentOutreach.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No outreach entries yet.</p>
                    <Link href="/connections" className="text-purple-600 hover:text-purple-700 text-sm font-medium mt-2 inline-block">
                      Start networking
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOutreach.map((entry, idx) => (
                      <div key={entry.id} className="relative">
                          {idx !== recentOutreach.length - 1 && (
                          <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-purple-200 to-transparent" />
                        )}
                        <div className="flex items-start space-x-4 group">
                          <div className="relative z-10 flex-shrink-0">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                              <span className="text-white text-lg font-bold">
                                  {entry.type.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 pt-1">
                                  <Link
                                    href={`/connections/${entry.connection.id}`}
                              className="font-semibold text-gray-900 hover:text-purple-600 transition-colors block"
                                  >
                                    {entry.connection.name}
                                  </Link>
                            <p className="text-sm text-gray-600 mt-0.5">
                              <span className="font-medium text-purple-600">{entry.type}</span>
                              {" • "}
                              {entry.connection.company || "No company"}
                            </p>
                            {entry.notes && (
                              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{entry.notes}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(entry.occurredAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

