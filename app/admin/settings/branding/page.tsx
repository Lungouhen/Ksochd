"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Save, Palette, Type, Building2 } from "lucide-react";
import Link from "next/link";

type BrandingSettings = {
  logoUrl: string;
  logoLightUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headerBgColor: string;
  footerBgColor: string;
  fontFamily: string;
  headingFont: string;
  fontSize: string;
  orgName: string;
  orgTagline: string;
  orgAddress: string;
  orgPhone: string;
  orgEmail: string;
  orgWebsite: string;
};

const fieldGroups = [
  {
    title: "Organization Identity",
    icon: Building2,
    fields: [
      { key: "orgName", label: "Organization Name", type: "text" },
      { key: "orgTagline", label: "Tagline", type: "text" },
      { key: "orgAddress", label: "Address", type: "text" },
      { key: "orgPhone", label: "Phone", type: "text" },
      { key: "orgEmail", label: "Email", type: "email" },
      { key: "orgWebsite", label: "Website", type: "url" },
    ],
  },
  {
    title: "Logos & Icons",
    icon: Building2,
    fields: [
      { key: "logoUrl", label: "Logo URL (dark bg)", type: "text" },
      { key: "logoLightUrl", label: "Logo URL (light bg)", type: "text" },
      { key: "faviconUrl", label: "Favicon URL", type: "text" },
    ],
  },
  {
    title: "Colors",
    icon: Palette,
    fields: [
      { key: "primaryColor", label: "Primary Color", type: "color" },
      { key: "secondaryColor", label: "Secondary Color", type: "color" },
      { key: "accentColor", label: "Accent Color", type: "color" },
      { key: "headerBgColor", label: "Header Background", type: "color" },
      { key: "footerBgColor", label: "Footer Background", type: "color" },
    ],
  },
  {
    title: "Typography",
    icon: Type,
    fields: [
      { key: "fontFamily", label: "Body Font Family", type: "text" },
      { key: "headingFont", label: "Heading Font Family", type: "text" },
      { key: "fontSize", label: "Base Font Size", type: "text" },
    ],
  },
];

export default function BrandingSettingsPage() {
  const [settings, setSettings] = useState<BrandingSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/branding")
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/branding", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, category: "general" }),
      });
      if (res.ok) setMessage("Branding settings saved successfully.");
      else setMessage("Failed to save settings.");
    } catch {
      setMessage("An error occurred.");
    } finally {
      setSaving(false);
    }
  }

  if (!settings) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-400 border-t-transparent" />
      </div>
    );
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
            <h1 className="text-2xl font-semibold text-white">Branding & Identity</h1>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex w-fit items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {message && (
        <div className="rounded-lg border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-sm text-teal-300">
          {message}
        </div>
      )}

      {fieldGroups.map((group) => {
        const GroupIcon = group.icon;
        return (
          <div
            key={group.title}
            className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30"
          >
            <div className="mb-4 flex items-center gap-2">
              <GroupIcon className="h-5 w-5 text-teal-400" />
              <h2 className="text-base font-semibold text-white">{group.title}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.fields.map((field) => (
                <div key={field.key}>
                  <label className="mb-1 block text-xs font-medium text-slate-400">
                    {field.label}
                  </label>
                  <div className="flex gap-2">
                    {field.type === "color" && (
                      <input
                        type="color"
                        value={(settings as Record<string, string>)[field.key] ?? "#000000"}
                        onChange={(e) =>
                          setSettings((s) =>
                            s ? { ...s, [field.key]: e.target.value } : s,
                          )
                        }
                        className="h-10 w-10 shrink-0 cursor-pointer rounded border border-white/10 bg-transparent"
                      />
                    )}
                    <input
                      type={field.type === "color" ? "text" : field.type}
                      value={(settings as Record<string, string>)[field.key] ?? ""}
                      onChange={(e) =>
                        setSettings((s) =>
                          s ? { ...s, [field.key]: e.target.value } : s,
                        )
                      }
                      className="w-full rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-white outline-none focus:border-teal-500/50"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Live Preview */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30">
        <h2 className="mb-4 text-base font-semibold text-white">Live Preview</h2>
        <div
          className="rounded-xl border border-white/10 p-6"
          style={{ backgroundColor: settings.headerBgColor, fontFamily: settings.fontFamily }}
        >
          <div className="flex items-center gap-3">
            {settings.logoUrl && (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: settings.primaryColor }}>
                <span className="text-lg font-bold text-white">K</span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-white" style={{ fontFamily: settings.headingFont }}>
                {settings.orgName}
              </h3>
              <p className="text-xs text-slate-400">{settings.orgTagline}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <span className="rounded px-3 py-1 text-xs font-medium text-white" style={{ backgroundColor: settings.primaryColor }}>
              Primary
            </span>
            <span className="rounded px-3 py-1 text-xs font-medium text-white" style={{ backgroundColor: settings.secondaryColor }}>
              Secondary
            </span>
            <span className="rounded px-3 py-1 text-xs font-medium text-white" style={{ backgroundColor: settings.accentColor }}>
              Accent
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
