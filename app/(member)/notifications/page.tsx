import { Pill } from "@/components/ui/pill";
import { getNotifications } from "@/server/services/notification.service";
import { getCurrentUser } from "@/server/services/user.service";

export default async function MemberNotifications() {
  const user = await getCurrentUser();
  const notifications = await getNotifications(user.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Pill label="Notifications" tone="teal" />
        <p className="text-sm text-slate-200/80">
          Alerts tied to your membership, events, and content updates.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {notifications.map((note) => (
          <div
            key={note.id}
            className="rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                {note.visibility.toLowerCase()}
              </span>
              <span className="text-xs text-slate-200/70">{note.createdAt}</span>
            </div>
            <p className="mt-2 text-sm text-white">{note.message}</p>
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  note.read ? "bg-emerald-300" : "bg-amber-300"
                }`}
              />
              <span className="text-xs text-slate-200/70">
                {note.read ? "Read" : "Unread"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
