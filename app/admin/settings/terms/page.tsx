"use client";

import { useEffect, useState } from "react";
import { Calendar, Plus, Trash2, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

type ExecutiveTerm = {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string | null;
  createdAt: string;
};

export default function ExecutiveTermsPage() {
  const [terms, setTerms] = useState<ExecutiveTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear() + 1,
    startDate: "",
    endDate: "",
    description: "",
  });

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const response = await fetch("/api/executive-terms");
      if (!response.ok) throw new Error("Failed to fetch terms");
      const data = await response.json();
      setTerms(data.terms || []);
    } catch (error) {
      toast.error("Failed to load executive terms");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.startDate || !formData.endDate) {
      toast.error("Please provide start and end dates");
      return;
    }

    if (formData.startYear >= formData.endYear) {
      toast.error("Start year must be before end year");
      return;
    }

    try {
      const response = await fetch("/api/executive-terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create term");
      }

      toast.success("Executive term created successfully");
      setShowCreateForm(false);
      setFormData({
        startYear: new Date().getFullYear(),
        endYear: new Date().getFullYear() + 1,
        startDate: "",
        endDate: "",
        description: "",
      });
      fetchTerms();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create term");
    }
  };

  const handleSetCurrent = async (id: string) => {
    if (!confirm("Set this term as the current active term?")) return;

    setProcessingIds((prev) => new Set(prev).add(id));
    try {
      const response = await fetch(`/api/executive-terms/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCurrent: true }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to set current term");
      }

      toast.success("Current term updated successfully");
      fetchTerms();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update term");
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleDelete = async (id: string, termName: string) => {
    if (!confirm(`Delete term "${termName}"? This action cannot be undone.`)) return;

    setProcessingIds((prev) => new Set(prev).add(id));
    try {
      const response = await fetch(`/api/executive-terms/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete term");
      }

      toast.success("Term deleted successfully");
      fetchTerms();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Cannot delete current term");
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-amber-300/60 focus:outline-none";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading executive terms...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Administration
            </p>
            <h1 className="text-xl font-semibold text-white">
              Executive Terms Management
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Manage portal term years and set the current active term
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-400"
            aria-label="Create new term"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Term
          </button>
        </div>

        {showCreateForm && (
          <form
            onSubmit={handleCreate}
            className="mb-6 rounded-xl border border-white/10 bg-slate-800/50 p-4"
          >
            <h2 className="mb-4 text-lg font-semibold text-white">
              Create New Term
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-200">
                <span>Start Year</span>
                <input
                  type="number"
                  className={inputClass}
                  value={formData.startYear}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startYear: Number(e.target.value),
                    }))
                  }
                  required
                  aria-required="true"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                <span>End Year</span>
                <input
                  type="number"
                  className={inputClass}
                  value={formData.endYear}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endYear: Number(e.target.value),
                    }))
                  }
                  required
                  aria-required="true"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                <span>Start Date</span>
                <input
                  type="date"
                  className={inputClass}
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  required
                  aria-required="true"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-200">
                <span>End Date</span>
                <input
                  type="date"
                  className={inputClass}
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  required
                  aria-required="true"
                />
              </label>
              <label className="space-y-2 text-sm text-slate-200 md:col-span-2">
                <span>Description (optional)</span>
                <textarea
                  className={inputClass}
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="e.g., Academic year for KSO Chongqing executive committee"
                />
              </label>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-teal-400"
              >
                Create Term
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {terms.length === 0 ? (
            <div className="rounded-xl border border-white/5 bg-slate-800/30 p-8 text-center">
              <Calendar className="mx-auto mb-3 h-12 w-12 text-slate-500" aria-hidden="true" />
              <p className="text-sm text-slate-400">
                No executive terms created yet. Create your first term to get started.
              </p>
            </div>
          ) : (
            terms.map((term) => (
              <div
                key={term.id}
                className={`rounded-xl border p-4 transition ${
                  term.isCurrent
                    ? "border-teal-500/30 bg-teal-500/10"
                    : "border-white/10 bg-slate-800/50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">
                        {term.startYear}-{term.endYear}
                      </h3>
                      {term.isCurrent && (
                        <span
                          className="inline-flex items-center gap-1 rounded-full bg-teal-500/20 px-2 py-1 text-xs font-semibold text-teal-300"
                          role="status"
                          aria-label="Current active term"
                        >
                          <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                          Current
                        </span>
                      )}
                    </div>
                    <div className="mb-2 flex items-center gap-4 text-sm text-slate-300">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-slate-400" aria-hidden="true" />
                        {new Date(term.startDate).toLocaleDateString()} -{" "}
                        {new Date(term.endDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-slate-400" aria-hidden="true" />
                        Created {new Date(term.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {term.description && (
                      <p className="text-sm text-slate-400">{term.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!term.isCurrent && (
                      <button
                        onClick={() => handleSetCurrent(term.id)}
                        disabled={processingIds.has(term.id)}
                        className="rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-2 text-sm font-semibold text-teal-300 transition hover:bg-teal-500/20 disabled:opacity-50"
                        aria-label={`Set ${term.startYear}-${term.endYear} as current term`}
                      >
                        Set Current
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(term.id, `${term.startYear}-${term.endYear}`)}
                      disabled={processingIds.has(term.id) || term.isCurrent}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                      aria-label={`Delete ${term.startYear}-${term.endYear} term`}
                      title={term.isCurrent ? "Cannot delete current term" : ""}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
