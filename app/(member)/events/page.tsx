import { SectionCard } from "@/components/ui/section-card";
import { getUpcomingEvents } from "@/server/services/event.service";

export default async function MemberEvents() {
  const events = await getUpcomingEvents();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Events & registrations</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {events.map((event) => (
          <SectionCard
            key={event.id}
            title={event.title}
            description={`${event.venue} · ${event.date}`}
            items={[
              `Status: ${event.status.toLowerCase()}`,
              `Fee: ₹${event.fee}`,
              "Managed through Razorpay for instant confirmations.",
            ]}
            cta={{ href: `/events/${event.id}`, label: "View details" }}
            tone="teal"
          />
        ))}
      </div>
    </div>
  );
}
