import { EventForm } from "@/components/forms/event-form";
import { SectionCard } from "@/components/ui/section-card";
import { getUpcomingEvents } from "@/server/services/event.service";

export default async function AdminEvents() {
  const events = await getUpcomingEvents();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Events control</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {events.map((event) => (
          <SectionCard
            key={event.id}
            title={event.title}
            description={`${event.venue} · ${event.date}`}
            items={[
              `Registration status: ${event.status.toLowerCase()}`,
              "Track payments via Razorpay webhooks.",
              "Editable form lives under components/forms when wired.",
            ]}
            tone="gold"
            cta={{ href: `/admin/events/${event.id}`, label: "Manage" }}
          />
        ))}
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 text-sm font-semibold text-white">Create / edit</p>
        <EventForm />
      </div>
    </div>
  );
}
