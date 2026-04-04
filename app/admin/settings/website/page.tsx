"use client";

import { useState } from "react";
import { Globe, Save, Upload } from "lucide-react";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "th", name: "ไทย", flag: "🇹🇭" },
  { code: "kuki", name: "Kuki", flag: "🏔️" },
];

export default function WebsiteSettings() {
  const [formData, setFormData] = useState({
    siteName: "KSO Chandigarh",
    tagline: "Single-stream portal for KSO members",
    defaultLanguage: "en",
    maintenance: false,
    favicon: "",
  });

  const toggleLanguage = (code: string) =>
    setFormData((prev) => ({
      ...prev,
      defaultLanguage: code,
    }));

  const handleSave = () =>
    alert("✅ Website settings saved! (Wire to Supabase next)");

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white focus:border-amber-300/60 focus:outline-none";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/20 text-amber-200">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Website
              </p>
              <h1 className="text-xl font-semibold text-white">
                Website Settings
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:border-amber-300/50 hover:text-amber-100"
            >
              <Upload className="h-4 w-4" />
              Upload assets
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-400"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-200">
            <span>Site name</span>
            <input
              className={inputClass}
              value={formData.siteName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, siteName: e.target.value }))
              }
            />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            <span>Tagline</span>
            <input
              className={inputClass}
              value={formData.tagline}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tagline: e.target.value }))
              }
            />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            <span>Favicon URL</span>
            <input
              className={inputClass}
              value={formData.favicon}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, favicon: e.target.value }))
              }
              placeholder="https://..."
            />
          </label>
          <label className="flex items-center gap-3 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={formData.maintenance}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, maintenance: e.target.checked }))
              }
              className="h-4 w-4 accent-amber-400"
            />
            <span>Maintenance mode</span>
          </label>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-sm font-semibold text-white">Languages</p>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {languages.map((lang) => {
              const active = formData.defaultLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => toggleLanguage(lang.code)}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
                    active
                      ? "border-amber-300/60 bg-amber-400/10 text-white"
                      : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{lang.flag}</span>
                    {lang.name}
                  </span>
                  {active ? (
                    <span className="text-xs font-semibold text-amber-200">
                      Default
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
