"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UserNotification } from "@/server/services/notification.service";
import { Trash2, Check } from "lucide-react";

type Props = {
  initialNotifications: UserNotification[];
};

export function NotificationList({ initialNotifications }: Props) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
        toast.success("Marked as read");
      } else {
        toast.error("Failed to mark as read");
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        toast.success("Notification deleted");
      } else {
        toast.error("Failed to delete notification");
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications/mark-all-read", {
        method: "POST",
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        toast.success("All notifications marked as read");
      } else {
        toast.error("Failed to mark all as read");
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-300/30 bg-emerald-100/10 p-4">
          <div>
            <p className="text-sm font-semibold text-emerald-200">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={markAllAsRead}
            className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Mark all as read
          </button>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-slate-400">No notifications yet</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {notifications.map((note) => (
            <div
              key={note.id}
              className={`rounded-xl border p-4 transition hover:border-white/20 ${
                note.read
                  ? "border-white/10 bg-white/5"
                  : "border-amber-300/30 bg-amber-100/10"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                  {note.visibility.toLowerCase()}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-200/70">
                    {note.createdAt}
                  </span>
                  {!note.read && (
                    <button
                      onClick={() => markAsRead(note.id)}
                      className="rounded-full p-1 text-emerald-300 transition hover:bg-emerald-300/20"
                      aria-label="Mark as read"
                      title="Mark as read"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(note.id)}
                    className="rounded-full p-1 text-red-300 transition hover:bg-red-300/20"
                    aria-label="Delete notification"
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
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
      )}
    </div>
  );
}
