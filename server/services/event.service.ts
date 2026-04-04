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
  return [
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
}
