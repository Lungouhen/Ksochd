import { withPrisma } from "@/lib/prisma";
import { RegistrationStatus } from "@/types/domain";

export type EventSummary = {
  id: string;
  title: string;
  date: string;
  venue: string;
  status: RegistrationStatus;
  fee: number;
};

export async function getUpcomingEvents(): Promise<EventSummary[]> {
  const fallback: EventSummary[] = [
    {
      id: "event-1",
      title: "KSO Cultural Evening",
      date: "2026-04-18",
      venue: "Chandigarh University Auditorium",
      status: RegistrationStatus.CONFIRMED,
      fee: 0,
    },
    {
      id: "event-2",
      title: "Career Mentorship Circle",
      date: "2026-05-05",
      venue: "Sector 17 Community Center",
      status: RegistrationStatus.PENDING,
      fee: 200,
    },
  ];

  return withPrisma(
    async (client) => {
      const events = await client.event.findMany({
        orderBy: { date: "asc" },
        take: 6,
      });

      if (!events.length) return fallback;

      return events.map((event) => ({
        id: event.id,
        title: event.title,
        date: event.date.toISOString().split("T")[0],
        venue: event.venue,
        status: RegistrationStatus.PENDING,
        fee: event.fee,
      }));
    },
    () => fallback,
  );
}
