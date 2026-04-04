"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Notification = {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("/api/notifications?count=true");
      const data = await res.json();
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications/mark-all-read", {
        method: "POST",
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
        toast.success("All notifications marked as read");
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showDropdown) {
      fetchNotifications();
    }
  }, [showDropdown]);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:border-amber-300/60 hover:text-amber-100 transition"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-slate-950">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-white/10 bg-slate-900 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <h3 className="font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-amber-300 hover:text-amber-200 transition"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-sm text-slate-400">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-b border-white/5 p-4 transition hover:bg-white/5 ${
                    !notification.read ? "bg-amber-500/5" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-white">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {notification.createdAt}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="mt-1 h-2 w-2 rounded-full bg-amber-400"
                        aria-label="Mark as read"
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="border-t border-white/10 p-3 text-center">
              <a
                href="/notifications"
                className="text-xs text-emerald-300 hover:text-emerald-200 transition"
                onClick={() => setShowDropdown(false)}
              >
                View all notifications →
              </a>
            </div>
          )}
        </div>
      )}

      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
