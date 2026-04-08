"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, GripVertical, ToggleLeft, ToggleRight } from "lucide-react";
import Link from "next/link";

const FIELD_TYPES = [
  "TEXT", "TEXTAREA", "NUMBER", "EMAIL", "PHONE", "DATE", "DATETIME",
  "SELECT", "MULTI_SELECT", "RADIO", "CHECKBOX", "FILE", "URL", "COLOR", "RICH_TEXT",
];

const MODULES = ["members", "events", "payments", "content"];

type CustomField = {
  id: string;
  module: string;
  fieldName: string;
  label: string;
  fieldType: string;
  placeholder: string | null;
  defaultValue: string | null;
  options: string[] | null;
  isRequired: boolean;
  isActive: boolean;
  description: string | null;
};

export default function CustomFieldsPage() {
  const [activeModule, setActiveModule] = useState("members");
  const [fields, setFields] = useState<CustomField[]>([]);
  const [creating, setCreating] = useState(false);
  const [newField, setNewField] = useState({
    fieldName: "",
    label: "",
    fieldType: "TEXT",
    placeholder: "",
    defaultValue: "",
    options: "",
    isRequired: false,
    description: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadFields();
  }, [activeModule]);

  async function loadFields() {
    const res = await fetch(`/api/custom-fields?module=${activeModule}&activeOnly=false`);
    setFields(await res.json());
  }

  async function handleCreate() {
    setMessage("");
    const body = {
      module: activeModule,
      fieldName: newField.fieldName,
      label: newField.label,
      fieldType: newField.fieldType,
      placeholder: newField.placeholder || undefined,
      defaultValue: newField.defaultValue || undefined,
      options: newField.options ? newField.options.split(",").map((o) => o.trim()) : undefined,
      isRequired: newField.isRequired,
      description: newField.description || undefined,
    };
    const res = await fetch("/api/custom-fields", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setCreating(false);
      setNewField({ fieldName: "", label: "", fieldType: "TEXT", placeholder: "", defaultValue: "", options: "", isRequired: false, description: "" });
      loadFields();
      setMessage("Custom field created.");
    }
  }

  async function toggleField(id: string, isActive: boolean) {
    await fetch(`/api/custom-fields/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    loadFields();
  }

  async function deleteField(id: string) {
    if (!confirm("Delete this custom field and all its values?")) return;
    await fetch(`/api/custom-fields/${id}`, { method: "DELETE" });
    loadFields();
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
            <h1 className="text-2xl font-semibold text-white">Custom Fields Builder</h1>
          </div>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex w-fit items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
        >
          <Plus className="h-4 w-4" />
          Add Field
        </button>
      </div>

      {message && (
        <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-sm text-teal-300">
          {message}
        </div>
      )}

      {/* Module Tabs */}
      <div className="flex gap-2">
        {MODULES.map((mod) => (
          <button
            key={mod}
            onClick={() => setActiveModule(mod)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
              activeModule === mod
                ? "bg-teal-600 text-white"
                : "border border-white/10 text-slate-300 hover:bg-white/5"
            }`}
          >
            {mod}
          </button>
        ))}
      </div>

      {/* Fields List */}
      <div className="space-y-3">
        {fields.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">
            No custom fields defined for &quot;{activeModule}&quot; module.
          </div>
        ) : (
          fields.map((field) => (
            <div
              key={field.id}
              className={`rounded-xl border p-4 transition ${
                field.isActive
                  ? "border-white/10 bg-slate-900/70"
                  : "border-white/5 bg-slate-900/30 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-slate-600" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{field.label}</span>
                      <code className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-teal-300">
                        {field.fieldName}
                      </code>
                      <span className="rounded-full bg-slate-700/50 px-2 py-0.5 text-[10px] text-slate-300">
                        {field.fieldType}
                      </span>
                      {field.isRequired && (
                        <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] text-red-300">
                          Required
                        </span>
                      )}
                    </div>
                    {field.description && (
                      <p className="mt-0.5 text-xs text-slate-500">{field.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleField(field.id, !field.isActive)}
                    className="text-slate-400 transition hover:text-white"
                    title={field.isActive ? "Disable" : "Enable"}
                  >
                    {field.isActive ? (
                      <ToggleRight className="h-5 w-5 text-teal-400" />
                    ) : (
                      <ToggleLeft className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteField(field.id)}
                    className="text-slate-400 transition hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {field.options && field.options.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {field.options.map((opt) => (
                    <span
                      key={opt}
                      className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300"
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Add Custom Field to &quot;{activeModule}&quot;
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-400">Field Key</label>
                  <input
                    type="text"
                    value={newField.fieldName}
                    onChange={(e) => setNewField((f) => ({ ...f, fieldName: e.target.value.replace(/[^a-z0-9_]/g, "") }))}
                    placeholder="e.g., blood_group"
                    className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-400">Label</label>
                  <input
                    type="text"
                    value={newField.label}
                    onChange={(e) => setNewField((f) => ({ ...f, label: e.target.value }))}
                    placeholder="e.g., Blood Group"
                    className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Field Type</label>
                <select
                  value={newField.fieldType}
                  onChange={(e) => setNewField((f) => ({ ...f, fieldType: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none"
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>
              {["SELECT", "MULTI_SELECT", "RADIO"].includes(newField.fieldType) && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-400">Options (comma-separated)</label>
                  <input
                    type="text"
                    value={newField.options}
                    onChange={(e) => setNewField((f) => ({ ...f, options: e.target.value }))}
                    placeholder="Option 1, Option 2, Option 3"
                    className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none"
                  />
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Placeholder</label>
                <input
                  type="text"
                  value={newField.placeholder}
                  onChange={(e) => setNewField((f) => ({ ...f, placeholder: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Description</label>
                <input
                  type="text"
                  value={newField.description}
                  onChange={(e) => setNewField((f) => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={newField.isRequired}
                  onChange={(e) => setNewField((f) => ({ ...f, isRequired: e.target.checked }))}
                />
                Required field
              </label>
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
                disabled={!newField.fieldName || !newField.label}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500 disabled:opacity-50"
              >
                Create Field
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
