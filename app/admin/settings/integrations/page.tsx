"use client";

import { useState } from "react";
import { Copy, Eye, EyeOff, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Setting = {
  key: string;
  value: string;
  isSecret: boolean;
  description: string;
};

const defaultSettings: Setting[] = [
  { key: "SUPABASE_URL", value: "", isSecret: false, description: "Supabase Project URL" },
  { key: "SUPABASE_ANON_KEY", value: "", isSecret: true, description: "Supabase Anon/Public Key" },
  { key: "SUPABASE_SERVICE_ROLE_KEY", value: "", isSecret: true, description: "Service Role Key (for admin actions)" },
  { key: "RAZORPAY_KEY_ID", value: "", isSecret: false, description: "Razorpay Key ID" },
  { key: "RAZORPAY_KEY_SECRET", value: "", isSecret: true, description: "Razorpay Secret Key" },
  { key: "STRIPE_PUBLIC_KEY", value: "", isSecret: false, description: "Stripe Publishable Key" },
  { key: "STRIPE_SECRET_KEY", value: "", isSecret: true, description: "Stripe Secret Key" },
  { key: "STRIPE_WEBHOOK_SECRET", value: "", isSecret: true, description: "Stripe Webhook Secret" },
  { key: "PAYPAL_CLIENT_ID", value: "", isSecret: false, description: "PayPal Client ID" },
  { key: "PAYPAL_CLIENT_SECRET", value: "", isSecret: true, description: "PayPal Secret Key" },
  { key: "PAYPAL_MODE", value: "sandbox", isSecret: false, description: "PayPal Mode (sandbox/live)" },
  { key: "ACTIVE_PAYMENT_GATEWAY", value: "RAZORPAY", isSecret: false, description: "Active Payment Gateway (RAZORPAY/STRIPE/PAYPAL)" },
  { key: "RECAPTCHA_SITE_KEY", value: "", isSecret: false, description: "Google reCAPTCHA v3 Site Key" },
  { key: "RECAPTCHA_SECRET_KEY", value: "", isSecret: true, description: "reCAPTCHA Secret Key" },
  { key: "RESEND_API_KEY", value: "", isSecret: true, description: "Resend Email API Key" },
  { key: "GOOGLE_MAPS_API_KEY", value: "", isSecret: false, description: "Google Maps API Key (for event venues)" },
];

export default function IntegrationsSettings() {
  const [settings, setSettings] = useState<Setting[]>(defaultSettings);
  const [revealed, setRevealed] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    defaultSettings.forEach((setting) => {
      initial[setting.key] = !setting.isSecret;
    });
    return initial;
  });

  const toggleReveal = (key: string) =>
    setRevealed((prev) => ({ ...prev, [key]: !prev[key] }));

  const updateValue = (key: string, value: string) =>
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s)),
    );

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`${data.savedCount} integration settings saved successfully.`);
      } else {
        toast.error(data.error ?? "Failed to save settings.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-10">
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/30 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Settings
          </p>
          <h1 className="text-2xl font-semibold text-white">Integrations</h1>
          <p className="text-sm text-slate-300">
            Configure Supabase, payment gateways (Razorpay, Stripe, PayPal), reCAPTCHA, Resend, and other services.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : "Save all changes"}
        </button>
      </div>

      <div className="space-y-6">
        {settings.map((setting) => (
          <div
            key={setting.key}
            className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30"
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-sm font-semibold text-amber-200">
                  {setting.key}
                </div>
                <p className="text-sm text-slate-300">{setting.description}</p>
              </div>
              {setting.isSecret ? (
                <button
                  type="button"
                  onClick={() => toggleReveal(setting.key)}
                  className="text-slate-300 hover:text-white"
                >
                  {revealed[setting.key] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              ) : null}
            </div>

            <div className="relative">
              <input
                type={
                  setting.isSecret && !revealed[setting.key] ? "password" : "text"
                }
                value={setting.value}
                onChange={(e) => updateValue(setting.key, e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 font-mono text-sm text-white focus:border-amber-300/60 focus:outline-none"
                placeholder={`Enter ${setting.key}`}
              />
              {setting.value ? (
                <button
                  type="button"
                  onClick={() => copyToClipboard(setting.value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-amber-200"
                >
                  <Copy className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-amber-200/30 bg-amber-100/10 p-5 text-xs text-amber-50">
        💡 These values are stored in the database and can override your .env
        file at runtime. For Supabase linking: use the Service Role Key only for
        admin operations.
      </div>
    </div>
  );
}
