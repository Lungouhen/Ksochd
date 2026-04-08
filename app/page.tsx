import Link from "next/link";
import type { Metadata } from "next";
import { SectionCard } from "@/components/ui/section-card";
import { Pill } from "@/components/ui/pill";
import { adminNav, authNav, memberNav } from "@/lib/navigation";
import { getSiteSettings } from "@/server/services/settings.service";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "Home",
    description: settings.siteDescription,
    openGraph: {
      title: settings.siteName,
      description: settings.siteDescription,
      type: "website",
      images: settings.ogImageUrl ? [{ url: settings.ogImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteName,
      description: settings.siteDescription,
      images: settings.twitterImageUrl ? [settings.twitterImageUrl] : undefined,
    },
  };
}

const pipeline = [
  {
    title: "Public → Awareness",
    description:
      "Visitors discover KSO Chandigarh, browse news, and view galleries before opting in.",
    items: [
      "Mobile-first landing with Kuki cultural accents",
      "Announcements & gallery for open visibility",
      "Lightweight contact/interest capture",
    ],
    cta: { href: "/register", label: "Join" },
    tone: "teal" as const,
    badge: "Step A",
  },
  {
    title: "Members → Single Stream",
    description:
      "OTP-first authentication flows into a unified member workspace with RBAC-aware screens.",
    items: [
      "JWT session with device trust",
      "Membership state & payments surfaced instantly",
      "Events, notifications, and content scoped to role",
    ],
    cta: { href: "/dashboard", label: "Member Space" },
    tone: "gold" as const,
    badge: "Step B",
  },
  {
    title: "Admins → Governance",
    description:
      "Admins and moderators share the same core, with elevated controls and audit-friendly actions.",
    items: [
      "User lifecycle & role promotions",
      "Content workflows and approvals",
      "Payments, analytics, and escalations",
    ],
    cta: { href: "/admin/dashboard", label: "Admin HQ" },
    tone: "slate" as const,
    badge: "Step C",
  },
];

const core = [
  {
    title: "RBAC + JWT Gate",
    description:
      "Every route is permission-checked once, then streamed to the correct experience without branching code per screen.",
    items: [
      "Role set: MEMBER, MODERATOR, ADMIN",
      "Membership status gates key actions",
      "Client hints for low-latency hydration",
    ],
  },
  {
    title: "Experience Packs",
    description:
      "Dashboards, events, and payments reuse the same primitives (tables, forms, toasts) for members and admins.",
    items: [
      "Shared UI kit for cards, shells, and data lists",
      "Forms ready for tRPC/Prisma binding",
      "Consistent empty/error/loading handling",
    ],
  },
  {
    title: "Operational Hooks",
    description:
      "Razorpay webhooks, notifications, and approvals are modeled up-front so nothing blocks going live.",
    items: [
      "Webhook routes ready for Razorpay signing",
      "Notification queue abstraction",
      "Audit-friendly service boundaries",
    ],
  },
];

export default function PublicHome() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12">
      <header className="glass-panel relative overflow-hidden border-white/15 px-8 py-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-transparent to-amber-300/10" />
        <div className="relative flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <Pill label="KSO Chandigarh" tone="teal" />
            <Pill label="CMS + Portal" tone="gold" />
            <Pill label="Production-ready" tone="slate" />
          </div>
          <h1 className="text-4xl font-semibold leading-tight text-white">
            Single-stream portal for members, admins, and guests—built in the
            exact architecture shown in the transformer-style diagram.
          </h1>
          <p className="max-w-3xl text-lg text-slate-200/85">
            A Next.js 15 (App Router) foundation with Prisma schema, Supabase
            compatibility, Razorpay webhook stubs, and role-aware layouts. Ready
            to import into Vercel in minutes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
            >
              Member workspace
            </Link>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center rounded-full border border-amber-200/40 bg-amber-100/10 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:-translate-y-0.5 hover:border-amber-200/80 hover:bg-amber-100/20"
            >
              Admin console
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/50"
            >
              Register + OTP
            </Link>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Pill label="(a) Pipeline" tone="teal" />
          <h2 className="text-xl font-semibold text-white">
            Public → Members → Admins
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {pipeline.map((item) => (
            <SectionCard
              key={item.title}
              title={item.title}
              description={item.description}
              items={item.items}
              cta={item.cta}
              tone={item.tone}
              badge={item.badge}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Pill label="(b) Single Stream Core" tone="gold" />
          <h2 className="text-xl font-semibold text-white">
            RBAC + JWT gate powering every screen
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {core.map((item) => (
            <SectionCard
              key={item.title}
              title={item.title}
              description={item.description}
              items={item.items}
              tone="slate"
            />
          ))}
        </div>
      </section>

      <section className="glass-panel grid gap-4 border-white/10 p-6 lg:grid-cols-3">
        <div className="space-y-3">
          <Pill label="Quick Links" tone="teal" />
          <h3 className="text-lg font-semibold text-white">
            Move into the working areas
          </h3>
          <p className="text-sm text-slate-200/80">
            These are real routes and layouts; swap in live data when ready.
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-slate-300">
            Auth
          </p>
          <div className="flex flex-wrap gap-2">
            {authNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-white/10 px-3 py-2 text-sm font-medium text-white/90 transition hover:-translate-y-0.5 hover:border-emerald-300/40 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-slate-300">
            Workspaces
          </p>
          <div className="flex flex-wrap gap-2">
            {[...memberNav, ...adminNav].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-white/10 px-3 py-2 text-sm font-medium text-white/90 transition hover:-translate-y-0.5 hover:border-amber-300/40 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
