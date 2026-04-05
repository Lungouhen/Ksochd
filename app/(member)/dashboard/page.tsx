import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CreditCard,
  IndianRupee,
} from "lucide-react";

import { SectionCard } from "@/components/ui/section-card";
import { Pill } from "@/components/ui/pill";
import { getFeaturedContent } from "@/server/services/content.service";
import { getUpcomingEvents } from "@/server/services/event.service";
import { getCurrentUser } from "@/server/services/user.service";

export default async function MemberDashboard() {
  const [user, events, content] = await Promise.all([
    getCurrentUser(),
    getUpcomingEvents(),
    getFeaturedContent(),
  ]);

  const quickLinks = [
    {
      title: "Events",
      href: "/events",
      description: `${events.length} upcoming`,
      icon: CalendarDays,
    },
    {
      title: "Payments",
      href: "/payments",
      description: "Membership dues & receipts",
      icon: CreditCard,
    },
    {
      title: "Notifications",
      href: "/notifications",
      description: "Alerts, approvals, event updates",
      icon: Bell,
    },
  ];

  const paymentTimeline = [
    { label: "Membership due", amount: "₹500", status: "Pending", href: "/payments" },
    { label: "Event: Cultural Evening", amount: "₹0", status: "Registered", href: "/events" },
    { label: "Last receipt", amount: "₹500", status: "Paid • Mar 12", href: "/payments" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-emerald-500/20 text-emerald-100 flex items-center justify-center text-lg font-semibold">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm text-slate-200/70">Welcome back</p>
            <p className="text-lg font-semibold text-white">{user.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Pill label={user.membershipStatus} tone="teal" />
          <Pill label={user.role} tone="slate" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:-translate-y-0.5 hover:border-teal-300/30 hover:bg-teal-500/10"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/15 text-teal-200">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-slate-300">{item.description}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-amber-200 opacity-0 transition group-hover:opacity-100" />
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Upcoming events"
          description="Stay on top of registrations and deadlines."
          items={events.map(
            (event) =>
              `${event.title} · ${event.venue} · ${event.date} (${event.status.toLowerCase()})`,
          )}
          cta={{ href: "/events", label: "Open events" }}
          tone="teal"
        />
        <SectionCard
          title="Featured content"
          description="Files and announcements targeted to members."
          items={content
            .filter((item) => item.visibility !== "ADMIN")
            .map(
            (item) =>
              `${item.title} · ${item.type.toLowerCase()} · ${item.visibility.toLowerCase()}`,
            )}
          cta={{ href: "/notifications", label: "View all notifications" }}
          tone="gold"
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Payments & receipts</p>
            <p className="text-xs text-slate-300">
              Membership dues, event payments, and Razorpay references.
            </p>
          </div>
          <Link
            href="/payments"
            className="text-xs font-semibold text-teal-200 transition hover:text-teal-100"
          >
            Open payments →
          </Link>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {paymentTimeline.map((payment) => (
            <Link
              key={payment.label}
              href={payment.href}
              className="rounded-lg border border-white/10 bg-slate-900/60 p-3 text-sm text-slate-200 transition hover:border-teal-300/30 hover:bg-teal-500/10"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white">{payment.label}</p>
                <IndianRupee className="h-4 w-4 text-amber-200" />
              </div>
              <p className="text-xl font-semibold text-amber-100">{payment.amount}</p>
              <p className="text-xs text-emerald-200">{payment.status}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
