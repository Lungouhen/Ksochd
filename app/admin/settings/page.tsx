import Link from "next/link";
import {
  Globe, Settings, Key, CreditCard, Bell, Shield, Receipt, Mail, Search, Calendar,
  Palette, Hash, FileCode, FormInput, ToggleLeft, Webhook, Archive,
} from "lucide-react";

const settingCards = [
  // ─ Branding & Configuration ─
  {
    title: "Branding & Identity",
    icon: Palette,
    href: "/admin/settings/branding",
    desc: "Logos, colors, typography, organization details",
    category: "Configuration",
  },
  {
    title: "ID Format Configuration",
    icon: Hash,
    href: "/admin/settings/id-formats",
    desc: "Configurable prefixes, formats, auto-increment for all IDs",
    category: "Configuration",
  },
  {
    title: "Output Templates",
    icon: FileCode,
    href: "/admin/settings/templates",
    desc: "Editable templates for ID cards, receipts, invoices",
    category: "Configuration",
  },
  {
    title: "Custom Fields Builder",
    icon: FormInput,
    href: "/admin/settings/custom-fields",
    desc: "Dynamic form fields for members, events, payments",
    category: "Configuration",
  },
  {
    title: "Module Toggles",
    icon: ToggleLeft,
    href: "/admin/settings/modules",
    desc: "Enable/disable features with role-based permissions",
    category: "Configuration",
  },
  {
    title: "Hooks & Extensions",
    icon: Webhook,
    href: "/admin/settings/hooks",
    desc: "Before/after action hooks for plugins and automations",
    category: "Configuration",
  },
  {
    title: "Backups & Versioning",
    icon: Archive,
    href: "/admin/settings/backups",
    desc: "Backup and restore settings, page version history",
    category: "Configuration",
  },
  // ─ Existing ─
  {
    title: "Executive Terms",
    icon: Calendar,
    href: "/admin/settings/terms",
    desc: "Manage term years (2025-2026, 2026-2027, etc.)",
    category: "General",
  },
  {
    title: "Website Settings",
    icon: Globe,
    href: "/admin/settings/website",
    desc: "General site name, description, social links",
    category: "General",
  },
  {
    title: "SEO & Analytics",
    icon: Search,
    href: "/admin/settings/seo",
    desc: "SEO defaults, Google Tag Manager, structured data",
    category: "General",
  },
  {
    title: "System & Frontend",
    icon: Settings,
    href: "/admin/settings/system",
    desc: "Pagination, menus, SEO, locale",
    category: "General",
  },
  {
    title: "Integrations",
    icon: Key,
    href: "/admin/settings/integrations",
    desc: "Supabase, Razorpay, reCAPTCHA, Resend",
    category: "Integrations",
  },
  {
    title: "Security & Roles",
    icon: Shield,
    href: "/admin/settings/admin",
    desc: "RBAC policies, role distribution, audit log",
    category: "Security",
  },
  {
    title: "Billing & Invoices",
    icon: Receipt,
    href: "/admin/settings/billing",
    desc: "Plans, invoices, subscription management",
    category: "Payments",
  },
  {
    title: "Notification Templates",
    icon: Mail,
    href: "/admin/settings/notifications",
    desc: "Email and in-app notification templates",
    category: "Notifications",
  },
  {
    title: "Payment Records",
    icon: CreditCard,
    href: "/admin/payments",
    desc: "Payment records, receipts, exports",
    category: "Payments",
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/admin/notifications",
    desc: "View and manage portal notifications",
    category: "Notifications",
  },
];

export default function SettingsHub() {
  // Group cards by category
  const categories = Array.from(new Set(settingCards.map((c) => c.category)));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">Settings</p>
        <h1 className="text-2xl font-semibold text-white">Settings Hub</h1>
        <p className="text-sm text-slate-300">
          Manage your portal configuration, integrations, and preferences.
        </p>
      </div>

      {categories.map((category) => (
        <div key={category}>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-teal-400">
            {category}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {settingCards
              .filter((card) => card.category === category)
              .map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.href}
                    href={card.href}
                    className="group rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30 transition hover:-translate-y-1 hover:border-teal-400/30 hover:bg-slate-900/80"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 text-teal-200">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{card.title}</p>
                        <p className="text-xs text-slate-300">{card.desc}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold uppercase text-teal-300 opacity-0 transition group-hover:opacity-100">
                      Open →
                    </span>
                  </Link>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
