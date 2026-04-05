import Link from "next/link";
import { getUpcomingEvents } from "@/server/services/event.service";
import {
  Calendar,
  CalendarPlus,
  CalendarCheck2,
  Users,
  MapPin,
  IndianRupee,
  Settings2,
} from "lucide-react";

type EventCard = {
  id: string;
  title: string;
  date: string;
  venue: string;
  status: "Upcoming" | "Completed" | "Cancelled";
  registrations: number;
  fee: number;
};

const fallbackEvents: EventCard[] = [
  { id: "e-1", title: "Annual General Meeting 2026", date: "2026-07-15", venue: "KSO Bhawan, Sector 38", status: "Upcoming", registrations: 84, fee: 0 },
  { id: "e-2", title: "Youth Sports Tournament", date: "2026-06-20", venue: "Punjab University Ground", status: "Upcoming", registrations: 62, fee: 200 },
  { id: "e-3", title: "Career Mentorship Circle", date: "2026-05-05", venue: "Sector 17 Community Center", status: "Upcoming", registrations: 45, fee: 200 },
  { id: "e-4", title: "Cultural Night – Chavang Kut", date: "2025-11-01", venue: "Community Hall, Sector 22", status: "Completed", registrations: 120, fee: 0 },
  { id: "e-5", title: "Blood Donation Camp", date: "2025-10-10", venue: "PGI Chandigarh", status: "Completed", registrations: 38, fee: 0 },
  { id: "e-6", title: "Freshers Welcome 2025", date: "2025-08-20", venue: "Chandigarh University Auditorium", status: "Completed", registrations: 95, fee: 100 },
  { id: "e-7", title: "KSO Cultural Evening", date: "2026-04-18", venue: "Chandigarh University Auditorium", status: "Upcoming", registrations: 56, fee: 0 },
  { id: "e-8", title: "Independence Day Celebration", date: "2025-08-15", venue: "Sector 17 Plaza", status: "Completed", registrations: 72, fee: 0 },
  { id: "e-9", title: "Inter-College Debate", date: "2026-05-25", venue: "Panjab University, Sector 14", status: "Upcoming", registrations: 28, fee: 150 },
  { id: "e-10", title: "Christmas Gathering", date: "2025-12-25", venue: "KSO Bhawan, Sector 38", status: "Completed", registrations: 110, fee: 0 },
  { id: "e-11", title: "New Year Meet & Greet", date: "2026-01-01", venue: "Elante Mall Event Hall", status: "Completed", registrations: 88, fee: 0 },
  { id: "e-12", title: "Community Clean-Up Drive", date: "2025-09-15", venue: "Sukhna Lake Promenade", status: "Completed", registrations: 42, fee: 0 },
  { id: "e-13", title: "Women's Day Workshop", date: "2026-03-08", venue: "Sector 22 Community Center", status: "Completed", registrations: 55, fee: 0 },
  { id: "e-14", title: "Fundraiser Gala Dinner", date: "2026-08-10", venue: "Hotel Mountview, Sector 10", status: "Upcoming", registrations: 35, fee: 500 },
  { id: "e-15", title: "Spring Football League", date: "2025-09-28", venue: "Punjab University Ground", status: "Completed", registrations: 48, fee: 100 },
  { id: "e-16", title: "Photography Contest", date: "2025-10-25", venue: "Rock Garden, Chandigarh", status: "Completed", registrations: 30, fee: 50 },
  { id: "e-17", title: "Educational Seminar", date: "2026-06-05", venue: "Chandigarh University, LH-1", status: "Cancelled", registrations: 0, fee: 0 },
  { id: "e-18", title: "KSO Foundation Day", date: "2026-09-12", venue: "KSO Bhawan, Sector 38", status: "Upcoming", registrations: 0, fee: 0 },
];

const statusStyles: Record<string, string> = {
  Upcoming: "bg-teal-500/20 text-teal-300",
  Completed: "bg-slate-700 text-slate-300",
  Cancelled: "bg-red-500/20 text-red-300",
};

export default async function EventsPage() {
  await getUpcomingEvents();

  const events = fallbackEvents;
  const upcoming = events.filter((e) => e.status === "Upcoming").length;
  const completed = events.filter((e) => e.status === "Completed").length;
  const totalRegs = events.reduce((sum, e) => sum + e.registrations, 0);

  const statCards = [
    { label: "Total Events", value: events.length, icon: Calendar, bg: "bg-teal-500/15", color: "text-teal-300" },
    { label: "Upcoming", value: upcoming, icon: CalendarPlus, bg: "bg-blue-500/15", color: "text-blue-300" },
    { label: "Completed", value: completed, icon: CalendarCheck2, bg: "bg-emerald-500/15", color: "text-emerald-300" },
    { label: "Registrations", value: totalRegs, icon: Users, bg: "bg-purple-500/15", color: "text-purple-300" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Events</p>
          <h1 className="text-2xl font-semibold text-white">Events Management</h1>
        </div>
        <Link
          href="/admin/events"
          className="flex w-fit items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500"
        >
          <CalendarPlus className="h-4 w-4" />
          Create Event
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-slate-400">{s.label}</p>
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.bg}`}>
                  <Icon className={`h-4 w-4 ${s.color}`} />
                </span>
              </div>
              <p className="mt-1 text-2xl font-semibold text-white">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Events Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {events.map((event) => (
          <div
            key={event.id}
            className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 text-teal-300">
                  <Calendar className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-white">{event.title}</h3>
                  <p className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="h-3 w-3" />
                    {event.venue}
                  </p>
                </div>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[event.status]}`}>
                {event.status}
              </span>
            </div>

            <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-300">
              <span>
                {new Date(event.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                {event.registrations} registered
              </span>
              {event.fee > 0 && (
                <span className="flex items-center gap-1">
                  <IndianRupee className="h-3.5 w-3.5 text-slate-400" />
                  ₹{event.fee}
                </span>
              )}
              {event.fee === 0 && (
                <span className="text-emerald-400">Free</span>
              )}
            </div>

            <Link
              href="#"
              className="flex w-fit items-center gap-1.5 rounded-lg bg-teal-600/20 px-3 py-1.5 text-xs font-medium text-teal-300 transition hover:bg-teal-600/30"
            >
              <Settings2 className="h-3.5 w-3.5" />
              Manage
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
