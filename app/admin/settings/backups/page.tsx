"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Download, Archive } from "lucide-react";
import Link from "next/link";

type BackupInfo = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  createdBy: string;
  createdAt: string;
};

const CATEGORIES = ["branding", "id_formats", "templates", "modules", "all"];

export default function BackupsPage() {
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [filter, setFilter] = useState("");
  const [creating, setCreating] = useState(false);
  const [newBackup, setNewBackup] = useState({
    name: "",
    category: "all",
    description: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadBackups();
  }, [filter]);

  async function loadBackups() {
    const url = filter
      ? `/api/settings-backups?category=${filter}`
      : "/api/settings-backups";
    const res = await fetch(url);
    if (res.ok) setBackups(await res.json());
  }

  async function handleCreate() {
    setMessage("");
    // Gather current settings data for the backup
    const data: Record<string, unknown> = {};
    if (newBackup.category === "all" || newBackup.category === "branding") {
      const res = await fetch("/api/branding");
      data.branding = await res.json();
    }
    if (newBackup.category === "all" || newBackup.category === "id_formats") {
      const res = await fetch("/api/id-formats");
      data.idFormats = await res.json();
    }
    if (newBackup.category === "all" || newBackup.category === "modules") {
      const res = await fetch("/api/module-toggles");
      data.modules = await res.json();
    }

    const res = await fetch("/api/settings-backups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newBackup.name,
        category: newBackup.category,
        data,
        description: newBackup.description || undefined,
      }),
    });
    if (res.ok) {
      setCreating(false);
      setNewBackup({ name: "", category: "all", description: "" });
      loadBackups();
      setMessage("Backup created successfully.");
    }
  }

  async function downloadBackup(id: string, name: string) {
    const res = await fetch(`/api/settings-backups?id=${id}`);
    if (res.ok) {
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${name.replace(/\s+/g, "-").toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/settings"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Settings</p>
            <h1 className="text-2xl font-semibold text-white">Backups & Versioning</h1>
          </div>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex w-fit items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
        >
          <Plus className="h-4 w-4" />
          Create Backup
        </button>
      </div>

      {message && (
        <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-sm text-teal-300">
          {message}
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("")}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            !filter ? "bg-teal-600 text-white" : "border border-white/10 text-slate-300 hover:bg-white/5"
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
              filter === cat ? "bg-teal-600 text-white" : "border border-white/10 text-slate-300 hover:bg-white/5"
            }`}
          >
            {cat.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Backup List */}
      <div className="space-y-3">
        {backups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">
            No backups found. Create one to preserve your current settings.
          </div>
        ) : (
          backups.map((backup) => (
            <div
              key={backup.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/70 p-4"
            >
              <div className="flex items-center gap-3">
                <Archive className="h-5 w-5 text-teal-400" />
                <div>
                  <p className="text-sm font-medium text-white">{backup.name}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 capitalize text-slate-300">
                      {backup.category.replace(/_/g, " ")}
                    </span>
                    <span>·</span>
                    <span>{new Date(backup.createdAt).toLocaleDateString("en-IN")}</span>
                    {backup.description && (
                      <>
                        <span>·</span>
                        <span>{backup.description}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => downloadBackup(backup.id, backup.name)}
                className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/5"
              >
                <Download className="h-3 w-3" />
                Download
              </button>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Create Backup</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Name</label>
                <input
                  type="text"
                  value={newBackup.name}
                  onChange={(e) => setNewBackup((b) => ({ ...b, name: e.target.value }))}
                  placeholder="e.g., Pre-launch backup"
                  className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Category</label>
                <select
                  value={newBackup.category}
                  onChange={(e) => setNewBackup((b) => ({ ...b, category: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Description</label>
                <input
                  type="text"
                  value={newBackup.description}
                  onChange={(e) => setNewBackup((b) => ({ ...b, description: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setCreating(false)}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!newBackup.name}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
