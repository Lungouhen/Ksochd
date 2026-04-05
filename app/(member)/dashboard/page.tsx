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
import { getNotifications } from "@/server/services/notification.service";
import { getCurrentUser } from "@/server/services/user.service";

export default async function MemberDashboard() {
  const user = await getCurrentUser();
  const [events, content, notifications] = await Promise.all([
    getUpcomingEvents(),
    getFeaturedContent(),
    getNotifications(user.id),
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

  const stats = [
    {
      label: "Membership status",
      value: user.membershipStatus,
      hint: "Tap to view profile",
      href: "/profile",
    },
    {
      label: "Upcoming events",
      value: `${events.length}`,
      hint: "Including your registrations",
      href: "/events",
    },
    {
      label: "Payments",
      value: "₹500",
      hint: "Last paid • Mar 12",
      href: "/payments",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="md:col-span-2 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
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
        <Link
          href="/profile"
          className="group flex items-center justify-between rounded-xl border border-white/10 bg-teal-600/15 px-4 py-3 transition hover:-translate-y-0.5 hover:border-teal-300/40 hover:bg-teal-600/25"
        >
          <div>
            <p className="text-xs uppercase tracking-wide text-teal-100">Membership</p>
            <p className="text-lg font-semibold text-white">Manage profile</p>
            <p className="text-xs text-emerald-100">Status: {user.membershipStatus}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-amber-200 transition group-hover:translate-x-1" />
        </Link>
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

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:border-teal-300/30 hover:bg-teal-500/10"
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold text-white">{stat.value}</p>
            <p className="text-xs text-emerald-200">{stat.hint}</p>
          </Link>
        ))}
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
            <p className="text-sm font-semibold text-white">Upcoming events</p>
            <p className="text-xs text-slate-300">Register with one tap.</p>
          </div>
          <Link
            href="/events"
            className="text-xs font-semibold text-teal-200 transition hover:text-teal-100"
          >
            View all →
          </Link>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {events.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="rounded-lg border border-white/10 bg-slate-900/60 p-3 text-sm text-slate-200"
            >
              <p className="font-semibold text-white">{event.title}</p>
              <p className="text-xs text-slate-400">{event.date} · {event.venue}</p>
              <p className="mt-1 text-[11px] uppercase tracking-wide text-amber-200">
                {event.status.toLowerCase()}
              </p>
              <Link
                href="/events"
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-teal-300/30 bg-teal-600/20 px-3 py-2 text-xs font-semibold text-white transition hover:border-teal-300/50 hover:bg-teal-600/30"
              >
                Register
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
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

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Recent notifications</p>
            <p className="text-xs text-slate-300">Stay current on approvals and updates.</p>
          </div>
          <Link
            href="/notifications"
            className="text-xs font-semibold text-teal-200 transition hover:text-teal-100"
          >
            Open inbox →
          </Link>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {notifications.slice(0, 4).map((note) => (
            <Link
              key={note.id}
              href="/notifications"
              className="flex items-start gap-3 rounded-lg border border-white/10 bg-slate-900/60 p-3 text-sm text-slate-200 transition hover:border-teal-300/30 hover:bg-teal-500/10"
            >
              <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/15 text-teal-200">
                <Bell className="h-4 w-4" />
              </span>
              <div className="space-y-1">
                <p className="font-semibold text-white">{note.message}</p>
                <p className="text-xs text-slate-400">{note.createdAt}</p>
                <p className="text-[11px] uppercase tracking-wide text-amber-200">
                  {note.read ? "Read" : "Unread"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
