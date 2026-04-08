"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, FileCode, Eye, Save, Star } from "lucide-react";
import Link from "next/link";

type TemplateMeta = {
  id: string;
  name: string;
  type: string;
  isDefault: boolean;
  isActive: boolean;
  description: string | null;
};

type TemplateDetail = TemplateMeta & {
  layout: string;
  placeholders: Record<string, string> | null;
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateMeta[]>([]);
  const [selected, setSelected] = useState<TemplateDetail | null>(null);
  const [previewHtml, setPreviewHtml] = useState("");
  const [creating, setCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    type: "receipt",
    layout: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    const res = await fetch("/api/templates");
    setTemplates(await res.json());
  }

  async function selectTemplate(id: string) {
    const res = await fetch(`/api/templates/${id}`);
    setSelected(await res.json());
    setPreviewHtml("");
  }

  async function handlePreview() {
    if (!selected) return;
    const res = await fetch("/api/templates/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        templateId: selected.id,
        data: {
          name: "Sample Member",
          member_id: "KSO-000001",
          phone: "+91 98765 43210",
          email: "member@example.com",
          clan: "Haokip",
          college: "Chandigarh University",
          role: "Member",
          membershipStatus: "Active",
          profilePic: "/placeholder.png",
          joinedDate: "2025-01-15",
          receipt_id: "REC-2026-000001",
          invoice_id: "INV-202604-00001",
          purpose: "Annual Membership",
          amount: "1,200",
          date: new Date().toLocaleDateString("en-IN"),
          dueDate: new Date(Date.now() + 30 * 86400000).toLocaleDateString("en-IN"),
          razorpayId: "pay_demo123",
          status: "Paid",
        },
      }),
    });
    const data = await res.json();
    setPreviewHtml(data.html || "");
  }

  async function handleSave() {
    if (!selected) return;
    setMessage("");
    const res = await fetch(`/api/templates/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ layout: selected.layout }),
    });
    if (res.ok) setMessage("Template saved.");
    else setMessage("Failed to save template.");
  }

  async function handleSetDefault() {
    if (!selected) return;
    const res = await fetch(`/api/templates/${selected.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDefault: true }),
    });
    if (res.ok) {
      setMessage("Set as default.");
      loadTemplates();
    }
  }

  async function handleCreate() {
    setMessage("");
    const res = await fetch("/api/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTemplate),
    });
    if (res.ok) {
      setCreating(false);
      setNewTemplate({ name: "", type: "receipt", layout: "", description: "" });
      loadTemplates();
      setMessage("Template created.");
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
            <h1 className="text-2xl font-semibold text-white">Output Templates</h1>
          </div>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex w-fit items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
        >
          <Plus className="h-4 w-4" />
          New Template
        </button>
      </div>

      {message && (
        <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-sm text-teal-300">
          {message}
        </div>
      )}

      {/* Template List */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Templates</p>
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTemplate(t.id)}
              className={`w-full rounded-xl border p-3 text-left transition ${
                selected?.id === t.id
                  ? "border-teal-400/50 bg-teal-500/10"
                  : "border-white/10 bg-slate-900/70 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-teal-400" />
                <span className="text-sm font-medium text-white">{t.name}</span>
                {t.isDefault && (
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                )}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-full bg-slate-700/50 px-2 py-0.5 text-[10px] text-slate-300">
                  {t.type}
                </span>
                <span className={`text-[10px] ${t.isActive ? "text-emerald-300" : "text-red-300"}`}>
                  {t.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              {t.description && (
                <p className="mt-1 text-xs text-slate-400">{t.description}</p>
              )}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">{selected.name}</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handlePreview}
                    className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/5"
                  >
                    <Eye className="h-3 w-3" />
                    Preview
                  </button>
                  <button
                    onClick={handleSetDefault}
                    className="flex items-center gap-1 rounded-lg border border-amber-500/30 px-3 py-1.5 text-xs font-medium text-amber-300 transition hover:bg-amber-500/10"
                  >
                    <Star className="h-3 w-3" />
                    Set Default
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-teal-500"
                  >
                    <Save className="h-3 w-3" />
                    Save
                  </button>
                </div>
              </div>

              {/* Placeholders */}
              {selected.placeholders && (
                <div className="rounded-xl border border-white/10 bg-slate-800/50 p-3">
                  <p className="mb-2 text-xs font-medium text-slate-400">Available Placeholders</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(selected.placeholders).map(([key, desc]) => (
                      <span
                        key={key}
                        title={desc}
                        className="cursor-help rounded bg-slate-700/50 px-2 py-0.5 font-mono text-[11px] text-teal-300"
                      >
                        {`{{${key}}}`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Layout Editor */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">
                  Template Layout (HTML with placeholders)
                </label>
                <textarea
                  value={selected.layout}
                  onChange={(e) => setSelected((s) => s ? { ...s, layout: e.target.value } : s)}
                  rows={16}
                  className="w-full rounded-xl border border-white/10 bg-slate-800/50 p-4 font-mono text-xs text-white outline-none focus:border-teal-500/50"
                />
              </div>

              {/* Preview */}
              {previewHtml && (
                <div className="rounded-xl border border-white/10 bg-white p-6">
                  <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/10 text-slate-500">
              Select a template to edit
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Create Template</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Name</label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate((t) => ({ ...t, name: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Type</label>
                <select
                  value={newTemplate.type}
                  onChange={(e) => setNewTemplate((t) => ({ ...t, type: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none"
                >
                  <option value="id_card">ID Card</option>
                  <option value="receipt">Receipt</option>
                  <option value="invoice">Invoice</option>
                  <option value="report">Report</option>
                  <option value="certificate">Certificate</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Description</label>
                <input
                  type="text"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate((t) => ({ ...t, description: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Layout (HTML)</label>
                <textarea
                  value={newTemplate.layout}
                  onChange={(e) => setNewTemplate((t) => ({ ...t, layout: e.target.value }))}
                  rows={6}
                  className="w-full rounded-lg border border-white/10 bg-slate-800/50 p-3 font-mono text-xs text-white outline-none"
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
                disabled={!newTemplate.name || !newTemplate.layout}
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
