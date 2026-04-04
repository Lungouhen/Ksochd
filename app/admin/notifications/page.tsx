"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";

export default function AdminNotificationsPage() {
  const [message, setMessage] = useState("");
  const [targetType, setTargetType] = useState<"all" | "members" | "pending">(
    "all",
  );
  const [sending, setSending] = useState(false);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setSending(true);

    try {
      const res = await fetch("/api/notifications/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          targetType,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Notification sent to ${data.count} users`);
        setMessage("");
      } else {
        toast.error(data.error || "Failed to send notification");
      }
    } catch (error) {
      console.error("Failed to send notification:", error);
      toast.error("Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Notifications
          </p>
          <h1 className="text-2xl font-semibold text-white">
            Broadcast Notifications
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Send notifications to members based on their status.
          </p>
        </div>

        <form onSubmit={handleSendNotification} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Target Audience
            </label>
            <select
              value={targetType}
              onChange={(e) =>
                setTargetType(e.target.value as "all" | "members" | "pending")
              }
              className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-white focus:border-amber-300/60 focus:outline-none"
            >
              <option value="all">All Users</option>
              <option value="members">Active Members Only</option>
              <option value="pending">Pending Members Only</option>
            </select>
            <p className="mt-1 text-xs text-slate-400">
              {targetType === "all" && "Send to all registered users"}
              {targetType === "members" &&
                "Send only to users with ACTIVE membership"}
              {targetType === "pending" &&
                "Send only to users with PENDING membership"}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your notification message..."
              rows={5}
              className="w-full rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3 text-white placeholder:text-slate-500 focus:border-amber-300/60 focus:outline-none"
            />
            <p className="mt-1 text-xs text-slate-400">
              {message.length} characters
            </p>
          </div>

          <button
            type="submit"
            disabled={sending || !message.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {sending ? "Sending..." : "Send Notification"}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-amber-200/30 bg-amber-100/10 p-5 text-xs text-amber-50">
        💡 <strong>Note:</strong> Notifications will be sent immediately to all
        selected users. Make sure to review your message before sending.
      </div>
    </div>
  );
}
