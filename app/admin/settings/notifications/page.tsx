import Link from "next/link";
import { Bell, Mail, Calendar, UserCheck, XCircle, ArrowLeft, Edit } from "lucide-react";

const templates = [
  {
    name: "Welcome Email",
    description: "Sent when a new member registers on the portal",
    icon: Mail,
    status: "Active",
    lastEdited: "2 days ago",
  },
  {
    name: "Payment Confirmation",
    description: "Sent after a successful Razorpay payment",
    icon: Mail,
    status: "Active",
    lastEdited: "1 week ago",
  },
  {
    name: "Event Registration",
    description: "Confirmation sent after registering for an event",
    icon: Calendar,
    status: "Active",
    lastEdited: "3 days ago",
  },
  {
    name: "Membership Approved",
    description: "Sent when admin approves a membership application",
    icon: UserCheck,
    status: "Active",
    lastEdited: "5 days ago",
  },
  {
    name: "Membership Rejected",
    description: "Sent when admin rejects a membership application",
    icon: XCircle,
    status: "Active",
    lastEdited: "5 days ago",
  },
  {
    name: "Event Reminder",
    description: "Sent 24 hours before an event starts",
    icon: Bell,
    status: "Active",
    lastEdited: "1 week ago",
  },
];

export default function NotificationTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Settings</p>
          <h1 className="text-2xl font-semibold text-white">Notification Templates</h1>
          <p className="mt-1 text-sm text-slate-300">
            Configure email and in-app notification templates sent to members.
          </p>
        </div>
        <Link
          href="/admin/settings"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <div
              key={template.name}
              className="group rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30 transition hover:border-teal-400/30"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/15 text-teal-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{template.name}</p>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                      {template.status}
                    </span>
                  </div>
                </div>
              </div>
              <p className="mb-3 text-xs text-slate-400">{template.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Edited {template.lastEdited}</span>
                <button className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-teal-300 transition hover:border-teal-400/30 hover:bg-teal-500/10">
                  <Edit className="h-3 w-3" />
                  Edit Template
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
