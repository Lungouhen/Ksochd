"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Hash, Eye } from "lucide-react";
import Link from "next/link";

type IdFormat = {
  entityType: string;
  prefix: string;
  separator: string;
  padLength: number;
  nextSequence: number;
  format: string;
  suffix: string | null;
  includeYear: boolean;
  includeMonth: boolean;
  description: string | null;
};

export default function IdFormatsPage() {
  const [formats, setFormats] = useState<IdFormat[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/id-formats")
      .then((r) => r.json())
      .then((data: IdFormat[]) => {
        setFormats(data);
        data.forEach((f) => loadPreview(f.entityType));
      });
  }, []);

  async function loadPreview(entityType: string) {
    const res = await fetch(`/api/id-formats/preview?entityType=${entityType}`);
    const data = await res.json();
    setPreviews((p) => ({ ...p, [entityType]: data.preview }));
  }

  function updateFormat(entityType: string, key: string, value: unknown) {
    setFormats((prev) =>
      prev.map((f) =>
        f.entityType === entityType ? { ...f, [key]: value } : f,
      ),
    );
  }

  async function handleSave(format: IdFormat) {
    setSaving(format.entityType);
    setMessage("");
    try {
      const res = await fetch("/api/id-formats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(format),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`${format.entityType} format saved.`);
        setPreviews((p) => ({ ...p, [format.entityType]: data.preview }));
      } else {
        setMessage("Failed to save.");
      }
    } catch {
      setMessage("An error occurred.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/settings"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Settings</p>
          <h1 className="text-2xl font-semibold text-white">ID Format Configuration</h1>
        </div>
      </div>

      <p className="text-sm text-slate-400">
        Configure the format of auto-generated IDs for members, receipts, invoices, events, and payments.
        Use placeholders: <code className="rounded bg-slate-800 px-1 text-teal-300">{"{{prefix}}"}</code>,{" "}
        <code className="rounded bg-slate-800 px-1 text-teal-300">{"{{separator}}"}</code>,{" "}
        <code className="rounded bg-slate-800 px-1 text-teal-300">{"{{sequence}}"}</code>,{" "}
        <code className="rounded bg-slate-800 px-1 text-teal-300">{"{{year}}"}</code>,{" "}
        <code className="rounded bg-slate-800 px-1 text-teal-300">{"{{month}}"}</code>
      </p>

      {message && (
        <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-sm text-teal-300">
          {message}
        </div>
      )}

      {formats.map((format) => (
        <div
          key={format.entityType}
          className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-teal-400" />
              <h2 className="text-base font-semibold capitalize text-white">
                {format.entityType} ID
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {previews[format.entityType] && (
                <div className="flex items-center gap-1 rounded-lg bg-slate-800/80 px-3 py-1.5 text-sm">
                  <Eye className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-mono text-teal-300">
                    {previews[format.entityType]}
                  </span>
                </div>
              )}
              <button
                onClick={() => handleSave(format)}
                disabled={saving === format.entityType}
                className="flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-teal-500 disabled:opacity-50"
              >
                <Save className="h-3 w-3" />
                {saving === format.entityType ? "Saving…" : "Save"}
              </button>
            </div>
          </div>

          {format.description && (
            <p className="mb-3 text-xs text-slate-400">{format.description}</p>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Prefix</label>
              <input
                type="text"
                value={format.prefix}
                onChange={(e) => updateFormat(format.entityType, "prefix", e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none focus:border-teal-500/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Separator</label>
              <input
                type="text"
                value={format.separator}
                onChange={(e) => updateFormat(format.entityType, "separator", e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none focus:border-teal-500/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Pad Length</label>
              <input
                type="number"
                value={format.padLength}
                min={1}
                max={10}
                onChange={(e) => updateFormat(format.entityType, "padLength", parseInt(e.target.value) || 1)}
                className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none focus:border-teal-500/50"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Next Sequence</label>
              <input
                type="number"
                value={format.nextSequence}
                min={1}
                onChange={(e) => updateFormat(format.entityType, "nextSequence", parseInt(e.target.value) || 1)}
                className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none focus:border-teal-500/50"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-xs font-medium text-slate-400">Format Template</label>
            <input
              type="text"
              value={format.format}
              onChange={(e) => updateFormat(format.entityType, "format", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 font-mono text-sm text-white outline-none focus:border-teal-500/50"
            />
          </div>

          <div className="mt-4 flex gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={format.includeYear}
                onChange={(e) => updateFormat(format.entityType, "includeYear", e.target.checked)}
                className="rounded border-white/20"
              />
              Include Year
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={format.includeMonth}
                onChange={(e) => updateFormat(format.entityType, "includeMonth", e.target.checked)}
                className="rounded border-white/20"
              />
              Include Month
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
