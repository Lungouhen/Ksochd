"use client";

import { useState } from "react";
import { FileText, Plus, Search, Eye, Pencil, Trash2, Globe } from "lucide-react";
import { toast } from "sonner";

type Page = {
  id: string;
  slug: string;
  title: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: string | null;
  updatedAt: string;
};

export default function CMSPagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/pages");
      if (res.ok) {
        const data = await res.json();
        setPages(data.pages || []);
      } else {
        toast.error("Failed to load pages");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const deletePage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      const res = await fetch(`/api/cms/pages/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Page deleted");
        fetchPages();
      } else {
        toast.error("Failed to delete page");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const filteredPages = pages.filter((page) => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || page.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "DRAFT":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "ARCHIVED":
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/30 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-400/20 text-blue-200">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">CMS</p>
            <h1 className="text-2xl font-semibold text-white">Pages</h1>
          </div>
        </div>
        <a
          href="/admin/cms/pages/new"
          className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-400"
        >
          <Plus className="h-4 w-4" />
          New Page
        </a>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-900/60 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:border-blue-300/60 focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-white/10 bg-slate-900/60 px-4 py-2 text-sm text-white focus:border-blue-300/60 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Pages List */}
      <div className="space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-8 text-center text-slate-400">
            Loading pages...
          </div>
        ) : filteredPages.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-8 text-center text-slate-400">
            No pages found. Create your first page!
          </div>
        ) : (
          filteredPages.map((page) => (
            <div
              key={page.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30 transition hover:border-white/20"
            >
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-3">
                  <h3 className="font-semibold text-white">{page.title}</h3>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(page.status)}`}
                  >
                    {page.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400">/{page.slug}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Updated {new Date(page.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-blue-300/50 hover:text-blue-200"
                  title="View page"
                >
                  <Globe className="h-4 w-4" />
                </a>
                <a
                  href={`/admin/cms/pages/${page.id}/edit`}
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-amber-300/50 hover:text-amber-200"
                  title="Edit page"
                >
                  <Pencil className="h-4 w-4" />
                </a>
                <button
                  onClick={() => deletePage(page.id)}
                  className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-red-300/50 hover:text-red-200"
                  title="Delete page"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
