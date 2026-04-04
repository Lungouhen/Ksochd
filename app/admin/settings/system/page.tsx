"use client";

import { useState } from "react";
import { Save } from "lucide-react";

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    homepage: "Custom landing page",
    topicsPerPage: 20,
    commentsStatus: "Automatic Publish",
    cookiesPolicy: "Active",
    dashboardLink: "Active",
    headerSearch: "Not Active",
  });

  const handleChange = (
    field: keyof typeof settings,
    value: string | number,
  ) => setSettings((prev) => ({ ...prev, [field]: value }));

  const handleSave = () =>
    alert(
      "✅ Settings saved successfully! (Connected to Supabase in next step)",
    );

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-amber-300/60 focus:outline-none";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">
              System
            </p>
            <h1 className="text-xl font-semibold text-white">
              System & Frontend Settings
            </h1>
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-400"
          >
            <Save className="h-4 w-4" />
            Save settings
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-200">
            <span>Homepage</span>
            <input
              className={inputClass}
              value={settings.homepage}
              onChange={(e) => handleChange("homepage", e.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            <span>Topics per page</span>
            <input
              type="number"
              className={inputClass}
              value={settings.topicsPerPage}
              onChange={(e) => handleChange("topicsPerPage", Number(e.target.value))}
            />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            <span>Comments status</span>
            <input
              className={inputClass}
              value={settings.commentsStatus}
              onChange={(e) => handleChange("commentsStatus", e.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            <span>Cookies policy</span>
            <input
              className={inputClass}
              value={settings.cookiesPolicy}
              onChange={(e) => handleChange("cookiesPolicy", e.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            <span>Dashboard link</span>
            <input
              className={inputClass}
              value={settings.dashboardLink}
              onChange={(e) => handleChange("dashboardLink", e.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            <span>Header search</span>
            <input
              className={inputClass}
              value={settings.headerSearch}
              onChange={(e) => handleChange("headerSearch", e.target.value)}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
