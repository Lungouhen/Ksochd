"use client";

import { useState } from "react";
import { Search as SearchIcon, Save, Loader2, Globe } from "lucide-react";
import { toast } from "sonner";

export default function SEOSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    // Global SEO
    defaultTitle: "KSO Chandigarh Portal",
    defaultDescription: "Single-stream portal for Kuki Students Organisation members, admins, and guests.",
    defaultKeywords: "kso, chandigarh, kuki, students, organisation",
    defaultOgImage: "",
    siteUrl: "https://ksochd.org",
    twitterHandle: "@ksochandigarh",

    // GTM
    gtmContainerId: "",
    gtmEnabled: false,

    // Structured Data
    organizationName: "Kuki Students Organisation - Chandigarh",
    organizationLogo: "",
    organizationType: "Organization",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/seo/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("SEO settings saved successfully");
      } else {
        toast.error("Failed to save settings");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:border-emerald-300/60 focus:outline-none";

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/30 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">
            <SearchIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Settings</p>
            <h1 className="text-2xl font-semibold text-white">SEO & Analytics</h1>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {/* Default Meta Tags */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
        <h2 className="mb-4 text-lg font-semibold text-white">Default Meta Tags</h2>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Default Title</span>
            <input
              type="text"
              value={formData.defaultTitle}
              onChange={(e) => setFormData({ ...formData, defaultTitle: e.target.value })}
              className={inputClass}
              placeholder="Your site title"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Default Description</span>
            <textarea
              value={formData.defaultDescription}
              onChange={(e) => setFormData({ ...formData, defaultDescription: e.target.value })}
              className={inputClass}
              rows={3}
              placeholder="A brief description of your site"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Default Keywords</span>
            <input
              type="text"
              value={formData.defaultKeywords}
              onChange={(e) => setFormData({ ...formData, defaultKeywords: e.target.value })}
              className={inputClass}
              placeholder="keyword1, keyword2, keyword3"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Default OG Image</span>
            <input
              type="url"
              value={formData.defaultOgImage}
              onChange={(e) => setFormData({ ...formData, defaultOgImage: e.target.value })}
              className={inputClass}
              placeholder="https://example.com/og-image.jpg"
            />
          </label>
        </div>
      </div>

      {/* Site Configuration */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
        <h2 className="mb-4 text-lg font-semibold text-white">Site Configuration</h2>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Site URL</span>
            <input
              type="url"
              value={formData.siteUrl}
              onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
              className={inputClass}
              placeholder="https://example.com"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Twitter Handle</span>
            <input
              type="text"
              value={formData.twitterHandle}
              onChange={(e) => setFormData({ ...formData, twitterHandle: e.target.value })}
              className={inputClass}
              placeholder="@yourhandle"
            />
          </label>
        </div>
      </div>

      {/* Google Tag Manager */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
        <h2 className="mb-4 text-lg font-semibold text-white">Google Tag Manager</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.gtmEnabled}
              onChange={(e) => setFormData({ ...formData, gtmEnabled: e.target.checked })}
              className="h-4 w-4 accent-emerald-400"
            />
            <span className="text-sm text-slate-200">Enable Google Tag Manager</span>
          </label>

          {formData.gtmEnabled && (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">GTM Container ID</span>
              <input
                type="text"
                value={formData.gtmContainerId}
                onChange={(e) => setFormData({ ...formData, gtmContainerId: e.target.value })}
                className={inputClass}
                placeholder="GTM-XXXXXX"
              />
              <p className="mt-1 text-xs text-slate-400">
                Find your container ID in your Google Tag Manager account
              </p>
            </label>
          )}
        </div>
      </div>

      {/* Structured Data */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
        <h2 className="mb-4 text-lg font-semibold text-white">Structured Data (Schema.org)</h2>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Organization Name</span>
            <input
              type="text"
              value={formData.organizationName}
              onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              className={inputClass}
              placeholder="Your Organization Name"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Organization Logo URL</span>
            <input
              type="url"
              value={formData.organizationLogo}
              onChange={(e) => setFormData({ ...formData, organizationLogo: e.target.value })}
              className={inputClass}
              placeholder="https://example.com/logo.png"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Organization Type</span>
            <select
              value={formData.organizationType}
              onChange={(e) => setFormData({ ...formData, organizationType: e.target.value })}
              className={inputClass}
            >
              <option value="Organization">Organization</option>
              <option value="Corporation">Corporation</option>
              <option value="EducationalOrganization">Educational Organization</option>
              <option value="GovernmentOrganization">Government Organization</option>
              <option value="NGO">NGO</option>
            </select>
          </label>
        </div>
      </div>

      {/* Info */}
      <div className="rounded-2xl border border-blue-200/30 bg-blue-100/10 p-5 text-sm text-blue-50">
        <p className="flex items-start gap-2">
          <Globe className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            These settings apply globally to all pages unless overridden at the page level.
            Configure GTM for advanced analytics and tracking.
          </span>
        </p>
      </div>
    </div>
  );
}
