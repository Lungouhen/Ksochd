import { Calendar } from 'lucide-react';

export default function EventsPage() {
  const events = [
    {
      id: '1',
      title: 'Annual General Meeting 2026',
      date: '2026-07-15',
      location: 'KSO Bhawan, Sector 38',
      status: 'Upcoming',
    },
    {
      id: '2',
      title: 'Youth Sports Tournament',
      date: '2026-06-20',
      location: 'Punjab University Ground',
      status: 'Upcoming',
    },
    {
      id: '3',
      title: 'Cultural Night – Chavang Kut',
      date: '2025-11-01',
      location: 'Community Hall, Sector 22',
      status: 'Completed',
    },
    {
      id: '4',
      title: 'Blood Donation Camp',
      date: '2025-10-10',
      location: 'PGI Chandigarh',
      status: 'Completed',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Events
          </p>
          <h1 className="text-2xl font-semibold text-white">
            Events Management
          </h1>
        </div>
        <button className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500">
          + New Event
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {events.map((event) => (
          <div
            key={event.id}
            className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 text-teal-300">
                  <Calendar className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-white">{event.title}</h3>
                  <p className="text-xs text-slate-400">{event.location}</p>
                </div>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  event.status === 'Upcoming'
                    ? 'bg-teal-500/20 text-teal-300'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {event.status}
              </span>
            </div>
            <p className="text-sm text-slate-300">
              {new Date(event.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
