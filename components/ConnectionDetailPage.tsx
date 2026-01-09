"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";
import Link from "next/link";

type OutreachEntry = {
  id: string;
  type: string;
  occurredAt: string;
  notes: string;
  createdAt: string;
};

type Connection = {
  id: string;
  name: string;
  company: string | null;
  title: string | null;
  email: string | null;
  linkedinUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  outreachEntries: OutreachEntry[];
};

const OUTREACH_TYPES = ["EMAIL", "LINKEDIN", "CALL", "OTHER"];

export default function ConnectionDetailPage({ connection: initialConnection }: { connection: Connection }) {
  const router = useRouter();
  const [connection, setConnection] = useState(initialConnection);
  const [formData, setFormData] = useState({
    name: connection.name,
    company: connection.company || "",
    title: connection.title || "",
    email: connection.email || "",
    linkedinUrl: connection.linkedinUrl || "",
    notes: connection.notes || "",
  });
  const [outreachForm, setOutreachForm] = useState({
    type: "EMAIL",
    occurredAt: new Date().toISOString().slice(0, 16),
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updateData: any = { ...formData };
      if (!updateData.company) updateData.company = "";
      if (!updateData.title) updateData.title = "";
      if (!updateData.email) updateData.email = "";
      if (!updateData.linkedinUrl) updateData.linkedinUrl = "";
      if (!updateData.notes) updateData.notes = "";

      const res = await fetch(`/api/connections/${connection.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (res.ok) {
        const updated = await res.json();
        setConnection(updated);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update connection");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOutreach = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/connections/${connection.id}/outreach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...outreachForm,
          occurredAt: new Date(outreachForm.occurredAt).toISOString(),
        }),
      });

      if (res.ok) {
        const newEntry = await res.json();
        setConnection({
          ...connection,
          outreachEntries: [newEntry, ...connection.outreachEntries],
        });
        setOutreachForm({
          type: "EMAIL",
          occurredAt: new Date().toISOString().slice(0, 16),
          notes: "",
        });
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to add outreach");
      }
    } catch (error) {
      alert("An error occurred");
    }
  };

  const handleDeleteOutreach = async (id: string) => {
    if (!confirm("Are you sure you want to delete this outreach entry?")) return;

    try {
      const res = await fetch(`/api/outreach/${id}`, { method: "DELETE" });
      if (res.ok) {
        setConnection({
          ...connection,
          outreachEntries: connection.outreachEntries.filter((e) => e.id !== id),
        });
        router.refresh();
      }
    } catch (error) {
      alert("Failed to delete outreach entry");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this connection?")) return;

    try {
      const res = await fetch(`/api/connections/${connection.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/connections");
      }
    } catch (error) {
      alert("Failed to delete connection");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-4">
            <Link href="/connections" className="text-blue-600 hover:text-blue-700 text-sm">
              ← Back to Connections
            </Link>
          </div>

          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Connection</h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
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
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
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

          {/* Outreach Timeline */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Outreach Timeline</h2>

            <form onSubmit={handleAddOutreach} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Add Outreach Entry</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Type</label>
                  <select
                    value={outreachForm.type}
                    onChange={(e) => setOutreachForm({ ...outreachForm, type: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                  >
                    {OUTREACH_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={outreachForm.occurredAt}
                    onChange={(e) => setOutreachForm({ ...outreachForm, occurredAt: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Notes *</label>
                  <input
                    type="text"
                    required
                    value={outreachForm.notes}
                    onChange={(e) => setOutreachForm({ ...outreachForm, notes: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                    placeholder="Brief description"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
              >
                Add Entry
              </button>
            </form>

            {connection.outreachEntries.length === 0 ? (
              <p className="text-gray-500 text-sm">No outreach entries yet.</p>
            ) : (
              <div className="flow-root">
                <ul className="-mb-8">
                  {connection.outreachEntries.map((entry, idx) => (
                    <li key={entry.id}>
                      <div className="relative pb-8">
                        {idx !== connection.outreachEntries.length - 1 && (
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
                                <span className="font-medium text-gray-900">{entry.type}</span>
                                {" - "}
                                {entry.notes}
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500 flex items-center gap-2">
                              <span>{new Date(entry.occurredAt).toLocaleString()}</span>
                              <button
                                onClick={() => handleDeleteOutreach(entry.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
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
      </main>
    </div>
  );
}

