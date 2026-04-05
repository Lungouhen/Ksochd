import { CheckCircle, AlertTriangle, Info, UserPlus } from 'lucide-react';

export default function NotificationsPage() {
  const notifications = [
    {
      id: '1',
      title: 'New member registration',
      message: 'Thangsei Haokip has requested membership approval.',
      time: '2 hours ago',
      type: 'user' as const,
      read: false,
    },
    {
      id: '2',
      title: 'Payment received',
      message: 'Chinglen Vaiphei paid ₹1,200 for annual membership.',
      time: '5 hours ago',
      type: 'success' as const,
      read: false,
    },
    {
      id: '3',
      title: 'Event registration milestone',
      message: 'Annual General Meeting 2026 has reached 50 registrations.',
      time: '1 day ago',
      type: 'info' as const,
      read: true,
    },
    {
      id: '4',
      title: 'Payment failed',
      message: 'Payment by Nemkhohat Kipgen failed. Please follow up.',
      time: '2 days ago',
      type: 'warning' as const,
      read: true,
    },
    {
      id: '5',
      title: 'New member approved',
      message: 'Vungtin Guite membership has been approved successfully.',
      time: '3 days ago',
      type: 'success' as const,
      read: true,
    },
  ];

  const typeIcons = {
    user: UserPlus,
    success: CheckCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const typeColors = {
    user: 'bg-teal-500/15 text-teal-300',
    success: 'bg-emerald-500/15 text-emerald-300',
    info: 'bg-blue-500/15 text-blue-300',
    warning: 'bg-amber-500/15 text-amber-300',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Notifications
          </p>
          <h1 className="text-2xl font-semibold text-white">Notifications</h1>
        </div>
        <button className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-teal-400/40 hover:text-teal-300">
          Mark all as read
        </button>
      </div>

      <div className="space-y-2">
        {notifications.map((notif) => {
          const Icon = typeIcons[notif.type];
          return (
            <div
              key={notif.id}
              className={`flex items-start gap-4 rounded-xl border p-4 transition ${
                notif.read
                  ? 'border-white/5 bg-slate-900/40'
                  : 'border-teal-400/20 bg-slate-900/70'
              }`}
            >
              <span
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${typeColors[notif.type]}`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">
                    {notif.title}
                  </h3>
                  {!notif.read && (
                    <span className="h-2 w-2 rounded-full bg-teal-400" />
                  )}
                </div>
                <p className="mt-0.5 text-sm text-slate-300">
                  {notif.message}
                </p>
                <p className="mt-1 text-xs text-slate-500">{notif.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
