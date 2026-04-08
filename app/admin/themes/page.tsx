"use client";

import { useState } from "react";
import { Palette, Plus, Pencil, Trash2, Check, Eye } from "lucide-react";
import { toast } from "sonner";

type Theme = {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  isActive: boolean;
  isDefault: boolean;
  preview?: string;
  config: Record<string, unknown>;
  createdAt: string;
};

export default function ThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchThemes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/themes");
      if (res.ok) {
        const data = await res.json();
        setThemes(data.themes || []);
      } else {
        toast.error("Failed to load themes");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/themes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });

      if (res.ok) {
        toast.success(`Theme ${isActive ? "activated" : "deactivated"}`);
        fetchThemes();
      } else {
        toast.error("Failed to update theme");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const setDefaultTheme = async (id: string) => {
    try {
      const res = await fetch(`/api/themes/${id}/default`, {
        method: "POST",
      });

      if (res.ok) {
        toast.success("Default theme updated");
        fetchThemes();
      } else {
        toast.error("Failed to set default theme");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const deleteTheme = async (id: string) => {
    if (!confirm("Delete this theme? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/themes/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Theme deleted");
        fetchThemes();
      } else {
        toast.error("Cannot delete active or default theme");
      }
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/30 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-400/20 text-pink-200">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Appearance</p>
            <h1 className="text-2xl font-semibold text-white">Themes</h1>
          </div>
        </div>
        <a
          href="/admin/themes/new"
          className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-pink-400"
        >
          <Plus className="h-4 w-4" />
          Create Theme
        </a>
      </div>

      {/* Themes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full rounded-2xl border border-white/10 bg-slate-900/70 p-8 text-center text-slate-400">
            Loading themes...
          </div>
        ) : themes.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-white/10 bg-slate-900/70 p-8 text-center text-slate-400">
            No themes found. Create your first theme!
          </div>
        ) : (
          themes.map((theme) => (
            <div
              key={theme.id}
              className={`relative overflow-hidden rounded-2xl border bg-slate-900/70 shadow-lg shadow-black/30 transition ${
                theme.isActive
                  ? "border-pink-400/50 ring-2 ring-pink-400/20"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              {/* Preview */}
              <div className="aspect-video w-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                {theme.preview ? (
                  <img
                    src={theme.preview}
                    alt={theme.displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Palette className="h-12 w-12 text-slate-600" />
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{theme.displayName}</h3>
                    <p className="text-xs text-slate-400">{theme.name}</p>
                    {theme.description && (
                      <p className="mt-1 text-sm text-slate-300">{theme.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    {theme.isDefault && (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-300">
                        Default
                      </span>
                    )}
                    {theme.isActive && (
                      <span className="rounded-full bg-pink-500/20 px-2 py-0.5 text-xs font-medium text-pink-300">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleTheme(theme.id, !theme.isActive)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                      theme.isActive
                        ? "border-amber-300/50 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20"
                        : "border-pink-300/50 bg-pink-400/10 text-pink-200 hover:bg-pink-400/20"
                    }`}
                  >
                    {theme.isActive ? "Deactivate" : "Activate"}
                  </button>

                  {!theme.isDefault && theme.isActive && (
                    <button
                      onClick={() => setDefaultTheme(theme.id)}
                      className="rounded-lg border border-emerald-300/50 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-200 transition hover:bg-emerald-400/20"
                      title="Set as default"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}

                  <a
                    href={`/admin/themes/${theme.id}/edit`}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-300 transition hover:border-blue-300/50 hover:text-blue-200"
                    title="Edit theme"
                  >
                    <Pencil className="h-4 w-4" />
                  </a>

                  {!theme.isDefault && !theme.isActive && (
                    <button
                      onClick={() => deleteTheme(theme.id)}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-slate-300 transition hover:border-red-300/50 hover:text-red-200"
                      title="Delete theme"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Active Indicator */}
              {theme.isActive && (
                <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-pink-500/90 text-white backdrop-blur-sm">
                  <Eye className="h-4 w-4" />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="rounded-2xl border border-pink-200/30 bg-pink-100/10 p-5 text-sm text-pink-50">
        <p>
          💡 Multiple themes can be active at once. Users can select their preferred theme from active themes.
          The default theme is used for new users and guest visitors.
        </p>
      </div>
    </div>
  );
}
