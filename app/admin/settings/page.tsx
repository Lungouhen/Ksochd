import Link from "next/link";
import { Globe, Settings, Key, CreditCard, Bell, Shield, Receipt, Mail, Search, Calendar } from "lucide-react";

const settingCards = [
  {
    title: "Executive Terms",
    icon: Calendar,
    href: "/admin/settings/terms",
    desc: "Manage term years (2025-2026, 2026-2027, etc.)",
  },
  {
    title: "Website Settings",
    icon: Globe,
    href: "/admin/settings/website",
    desc: "Logos, branding, social links, multi-language",
  },
  {
    title: "SEO & Analytics",
    icon: Search,
    href: "/admin/settings/seo",
    desc: "SEO defaults, Google Tag Manager, structured data",
  },
  {
    title: "System & Frontend",
    icon: Settings,
    href: "/admin/settings/system",
    desc: "Pagination, menus, SEO, locale",
  },
  {
    title: "Integrations",
    icon: Key,
    href: "/admin/settings/integrations",
    desc: "Supabase, Razorpay, reCAPTCHA, Resend",
  },
  {
    title: "Security & Roles",
    icon: Shield,
    href: "/admin/settings/admin",
    desc: "RBAC policies, role distribution, audit log",
  },
  {
    title: "Billing & Invoices",
    icon: Receipt,
    href: "/admin/settings/billing",
    desc: "Plans, invoices, subscription management",
  },
  {
    title: "Notification Templates",
    icon: Mail,
    href: "/admin/settings/notifications",
    desc: "Email and in-app notification templates",
  },
  {
    title: "Payment Records",
    icon: CreditCard,
    href: "/admin/payments",
    desc: "Payment records, receipts, exports",
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/admin/notifications",
    desc: "View and manage portal notifications",
  },
];

export default function SettingsHub() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">Settings</p>
        <h1 className="text-2xl font-semibold text-white">Settings Hub</h1>
        <p className="text-sm text-slate-300">
          Manage your portal configuration, integrations, and preferences.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingCards.map((card) => {
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
  );
}
