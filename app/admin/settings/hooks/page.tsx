"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Webhook,
  Zap,
} from "lucide-react";
import Link from "next/link";

type HookInfo = {
  id: string;
  hookPoint: string;
  name: string;
  description: string | null;
  handlerType: string;
  handlerConfig: Record<string, unknown>;
  priority: number;
  isActive: boolean;
};

export default function HooksPage() {
  const [hooks, setHooks] = useState<HookInfo[]>([]);
  const [hookPoints, setHookPoints] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [newHook, setNewHook] = useState({
    hookPoint: "",
    name: "",
    description: "",
    handlerType: "webhook",
    url: "",
    priority: 10,
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/hooks")
      .then((res) => res.json())
      .then((data) => {
        setHooks(data.hooks || []);
        setHookPoints(data.availableHookPoints || []);
      });
  }, []);

  async function refreshHooks() {
    const res = await fetch("/api/hooks");
    const data = await res.json();
    setHooks(data.hooks || []);
    setHookPoints(data.availableHookPoints || []);
  }

  async function handleCreate() {
    setMessage("");
    const body = {
      hookPoint: newHook.hookPoint,
      name: newHook.name,
      description: newHook.description || undefined,
      handlerType: newHook.handlerType,
      handlerConfig: { url: newHook.url },
      priority: newHook.priority,
    };
    const res = await fetch("/api/hooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setCreating(false);
      setNewHook({ hookPoint: "", name: "", description: "", handlerType: "webhook", url: "", priority: 10 });
      refreshHooks();
      setMessage("Hook registered.");
    }
  }

  async function toggleHook(id: string, isActive: boolean) {
    await fetch(`/api/hooks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    refreshHooks();
  }

  async function deleteHook(id: string) {
    if (!confirm("Delete this hook registration?")) return;
    await fetch(`/api/hooks/${id}`, { method: "DELETE" });
    refreshHooks();
  }

  // Group hooks by hook point
  const groupedHooks = hooks.reduce(
    (acc, hook) => {
      if (!acc[hook.hookPoint]) acc[hook.hookPoint] = [];
      acc[hook.hookPoint].push(hook);
      return acc;
    },
    {} as Record<string, HookInfo[]>,
  );

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
            <h1 className="text-2xl font-semibold text-white">Hooks & Extensions</h1>
          </div>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex w-fit items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
        >
          <Plus className="h-4 w-4" />
          Register Hook
        </button>
      </div>

      <p className="text-sm text-slate-400">
        Register before/after action hooks to extend system behavior. Webhooks are called with event context when triggered.
      </p>

      {message && (
        <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-sm text-teal-300">
          {message}
        </div>
      )}

      {/* Available Hook Points */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30">
        <h2 className="mb-3 text-sm font-semibold text-white">Available Hook Points</h2>
        <div className="flex flex-wrap gap-1.5">
          {hookPoints.map((hp) => (
            <span
              key={hp}
              className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-slate-300"
            >
              {hp}
            </span>
          ))}
        </div>
      </div>

      {/* Registered Hooks */}
      {Object.keys(groupedHooks).length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">
          No hooks registered yet. Click &quot;Register Hook&quot; to add one.
        </div>
      ) : (
        Object.entries(groupedHooks).map(([hookPoint, hooksInGroup]) => (
          <div
            key={hookPoint}
            className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30"
          >
            <div className="mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <h3 className="font-mono text-sm font-semibold text-white">{hookPoint}</h3>
            </div>
            <div className="space-y-2">
              {hooksInGroup.map((hook) => (
                <div
                  key={hook.id}
                  className={`flex items-center justify-between rounded-xl border p-3 ${
                    hook.isActive
                      ? "border-white/10 bg-slate-800/50"
                      : "border-white/5 bg-slate-800/20 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Webhook className="h-4 w-4 text-teal-400" />
                    <div>
                      <p className="text-sm font-medium text-white">{hook.name}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{hook.handlerType}</span>
                        <span>·</span>
                        <span>Priority: {hook.priority}</span>
                        {hook.description && (
                          <>
                            <span>·</span>
                            <span>{hook.description}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleHook(hook.id, !hook.isActive)}>
                      {hook.isActive ? (
                        <ToggleRight className="h-5 w-5 text-teal-400" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-slate-600" />
                      )}
                    </button>
                    <button onClick={() => deleteHook(hook.id)}>
                      <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Create Modal */}
      {creating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Register Hook</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Hook Point</label>
                <select
                  value={newHook.hookPoint}
                  onChange={(e) => setNewHook((h) => ({ ...h, hookPoint: e.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none"
                >
                  <option value="">Select...</option>
                  {hookPoints.map((hp) => (
                    <option key={hp} value={hp}>{hp}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Name</label>
                <input
                  type="text"
                  value={newHook.name}
                  onChange={(e) => setNewHook((h) => ({ ...h, name: e.target.value }))}
                  placeholder="e.g., Send welcome email"
                  className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Webhook URL</label>
                <input
                  type="url"
                  value={newHook.url}
                  onChange={(e) => setNewHook((h) => ({ ...h, url: e.target.value }))}
                  placeholder="https://example.com/webhook"
                  className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Priority (lower = first)</label>
                <input
                  type="number"
                  value={newHook.priority}
                  min={1}
                  max={100}
                  onChange={(e) => setNewHook((h) => ({ ...h, priority: parseInt(e.target.value) || 10 }))}
                  className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Description</label>
                <input
                  type="text"
                  value={newHook.description}
                  onChange={(e) => setNewHook((h) => ({ ...h, description: e.target.value }))}
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
                disabled={!newHook.hookPoint || !newHook.name || !newHook.url}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500 disabled:opacity-50"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
