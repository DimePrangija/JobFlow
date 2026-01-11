"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import Link from "next/link";

type Job = {
  id: string;
  company: string;
  role: string;
  status: string;
  url: string | null;
  location: string | null;
  salaryRange: string | null;
  notes: string | null;
  appliedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const STATUSES = ["WISHLIST", "APPLIED", "SCREEN", "INTERVIEW", "OFFER", "REJECTED"];

export default function JobDetailPage({ job: initialJob }: { job: Job }) {
  const router = useRouter();
  const [job, setJob] = useState(initialJob);
  const [formData, setFormData] = useState({
    company: job.company,
    role: job.role,
    status: job.status,
    url: job.url || "",
    location: job.location || "",
    salaryRange: job.salaryRange || "",
    notes: job.notes || "",
    appliedAt: job.appliedAt ? new Date(job.appliedAt).toISOString().slice(0, 16) : "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updateData: any = { ...formData };
      if (!updateData.appliedAt) delete updateData.appliedAt;
      if (!updateData.url) updateData.url = "";
      if (!updateData.location) updateData.location = "";
      if (!updateData.salaryRange) updateData.salaryRange = "";
      if (!updateData.notes) updateData.notes = "";

      const res = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        const updated = await res.json();
        setJob(updated);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update job");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(`/api/jobs/${job.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/jobs");
      }
    } catch (error) {
      alert("Failed to delete job");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main className="ml-64 min-h-screen py-6 px-8">
        <div className="py-6 max-w-4xl">
          <div className="mb-4">
            <Link href="/jobs" className="text-purple-600 hover:text-purple-700 text-sm">
              ← Back to Jobs
            </Link>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Job</h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company *</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role *</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Salary Range</label>
                <input
                  type="text"
                  value={formData.salaryRange}
                  onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Applied At</label>
                <input
                  type="datetime-local"
                  value={formData.appliedAt}
                  onChange={(e) => setFormData({ ...formData, appliedAt: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

