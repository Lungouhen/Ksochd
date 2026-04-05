import Link from "next/link";
import { CreditCard, Globe, Key, Sparkles, Settings } from "lucide-react";

const settingCards = [
  {
    title: "Website & Branding",
    icon: Globe,
    href: "/admin/settings/website",
    desc: "Logos, hero copy, social links, public pages.",
    status: "Ready",
  },
  {
    title: "System & Navigation",
    icon: Settings,
    href: "/admin/settings/system",
    desc: "Menus, SEO, locales, pagination, feature flags.",
    status: "Autosave on",
  },
  {
    title: "Integrations",
    icon: Key,
    href: "/admin/settings/integrations",
    desc: "Supabase, Razorpay, reCAPTCHA, Resend webhooks.",
    status: "Connected",
  },
  {
    title: "Payment Records",
    icon: CreditCard,
    href: "/admin/payments",
    desc: "Membership dues, Razorpay IDs, downloadable receipts.",
    status: "Ledger",
  },
];

export default function SettingsHub() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-amber-200/80">
            Settings
          </p>
          <h1 className="text-2xl font-semibold text-white">Configuration hub</h1>
          <p className="text-sm text-slate-300">
            Every card opens a real workspace — branding, system defaults, integrations, and payments are one tap away.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-teal-400/25 hover:bg-teal-500/10"
          >
            <Sparkles className="h-4 w-4 text-amber-200" />
            Back to dashboard
          </Link>
          <Link
            href="/admin/payments"
            className="flex items-center gap-2 rounded-lg border border-teal-400/30 bg-teal-500/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-teal-300/50 hover:bg-teal-500/25"
          >
            Go to payments
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {settingCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/30 transition hover:-translate-y-1 hover:border-teal-400/25 hover:bg-slate-900/80"
            >
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-teal-500/20 via-transparent to-transparent opacity-70 blur-3xl" />
              <div className="relative mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/15 text-teal-200 ring-1 ring-white/5">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{card.title}</p>
                  <p className="text-xs text-slate-300">{card.desc}</p>
                </div>
              </div>
              <div className="relative flex items-center justify-between">
                <span className="rounded-full bg-amber-400/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-50">
                  {card.status}
                </span>
                <span className="text-xs font-semibold uppercase text-teal-200 opacity-0 transition group-hover:opacity-100">
                  Open →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
