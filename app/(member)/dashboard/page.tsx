import type { Metadata } from "next";
import { SectionCard } from "@/components/ui/section-card";
import { Pill } from "@/components/ui/pill";
import { getFeaturedContent } from "@/server/services/content.service";
import { getUpcomingEvents } from "@/server/services/event.service";
import { getCurrentUser } from "@/server/services/user.service";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Member dashboard with events, notifications, and featured content.",
};

export default async function MemberDashboard() {
  const [user, events, content] = await Promise.all([
    getCurrentUser(),
    getUpcomingEvents(),
    getFeaturedContent(),
  ]);

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
          cta={{ href: "/profile", label: "Update profile" }}
          tone="gold"
        />
      </div>
    </div>
  );
}
