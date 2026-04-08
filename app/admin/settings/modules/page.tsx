"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ToggleLeft, ToggleRight, Shield, Settings2 } from "lucide-react";
import Link from "next/link";

type ModuleToggle = {
  id: string;
  moduleKey: string;
  displayName: string;
  description: string | null;
  isEnabled: boolean;
  permissions: Record<string, boolean> | null;
  config: Record<string, unknown> | null;
  order: number;
};

export default function ModuleTogglesPage() {
  const [modules, setModules] = useState<ModuleToggle[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/module-toggles")
      .then((res) => (res.ok ? res.json() : []))
      .then(setModules);
  }, []);

  async function handleToggle(moduleKey: string, isEnabled: boolean) {
    setMessage("");
    const res = await fetch("/api/module-toggles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleKey, isEnabled }),
    });
    if (res.ok) {
      setModules((prev) =>
        prev.map((m) =>
          m.moduleKey === moduleKey ? { ...m, isEnabled } : m,
        ),
      );
      setMessage(`${moduleKey} ${isEnabled ? "enabled" : "disabled"}.`);
    }
  }

  async function handlePermissions(
    moduleKey: string,
    role: string,
    allowed: boolean,
  ) {
    const mod = modules.find((m) => m.moduleKey === moduleKey);
    const permissions = { ...(mod?.permissions ?? {}), [role]: allowed };
    await fetch("/api/module-toggles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleKey, permissions }),
    });
    setModules((prev) =>
      prev.map((m) =>
        m.moduleKey === moduleKey ? { ...m, permissions } : m,
      ),
    );
  }

  const roles = ["MEMBER", "MODERATOR", "ADMIN"];

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
          <h1 className="text-2xl font-semibold text-white">Module Toggles & Permissions</h1>
        </div>
      </div>

      <p className="text-sm text-slate-400">
        Enable or disable system modules and configure role-based access for each feature.
      </p>

      {message && (
        <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-sm text-teal-300">
          {message}
        </div>
      )}

      <div className="space-y-3">
        {modules.map((mod) => (
          <div
            key={mod.moduleKey}
            className={`rounded-2xl border p-5 transition ${
              mod.isEnabled
                ? "border-white/10 bg-slate-900/70 shadow-lg shadow-black/30"
                : "border-white/5 bg-slate-900/30 opacity-70"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings2 className={`h-5 w-5 ${mod.isEnabled ? "text-teal-400" : "text-slate-600"}`} />
                <div>
                  <h3 className="text-sm font-semibold text-white">{mod.displayName}</h3>
                  {mod.description && (
                    <p className="text-xs text-slate-400">{mod.description}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleToggle(mod.moduleKey, !mod.isEnabled)}
                className="transition"
              >
                {mod.isEnabled ? (
                  <ToggleRight className="h-7 w-7 text-teal-400" />
                ) : (
                  <ToggleLeft className="h-7 w-7 text-slate-600" />
                )}
              </button>
            </div>

            {mod.isEnabled && (
              <div className="mt-4 rounded-xl border border-white/5 bg-slate-800/30 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-slate-400" />
                  <p className="text-xs font-medium text-slate-400">Role Permissions</p>
                </div>
                <div className="flex gap-4">
                  {roles.map((role) => {
                    const isAllowed =
                      mod.permissions?.[role] ?? (role === "ADMIN");
                    return (
                      <label
                        key={role}
                        className="flex items-center gap-2 text-sm text-slate-300"
                      >
                        <input
                          type="checkbox"
                          checked={isAllowed}
                          onChange={(e) =>
                            handlePermissions(mod.moduleKey, role, e.target.checked)
                          }
                          className="rounded border-white/20"
                        />
                        {role}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
