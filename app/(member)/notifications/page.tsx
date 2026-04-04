import { Pill } from "@/components/ui/pill";
import { getNotifications } from "@/server/services/notification.service";
import { getCurrentUser } from "@/server/services/user.service";
import { NotificationList } from "@/components/notifications/NotificationList";

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

      <NotificationList initialNotifications={notifications} />
    </div>
  );
}
