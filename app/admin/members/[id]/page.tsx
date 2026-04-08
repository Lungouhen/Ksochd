import Link from "next/link";
import { redirect } from "next/navigation";
import { withPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Role } from "@/types/domain";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  Users,
  CreditCard,
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { RoleSelect } from "@/components/admin/RoleSelect";

const statusStyles: Record<string, { bg: string; text: string; icon: LucideIcon }> = {
  ACTIVE: { bg: "bg-teal-500/20", text: "text-teal-300", icon: CheckCircle2 },
  PENDING: { bg: "bg-amber-500/20", text: "text-amber-300", icon: Clock },
  REJECTED: { bg: "bg-red-500/20", text: "text-red-300", icon: XCircle },
  EXPIRED: { bg: "bg-slate-500/20", text: "text-slate-400", icon: ShieldAlert },
};

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  const { id } = await params;

  if (session.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  const userData = await withPrisma(
    async (client) => {
      const user = await client.user.findUnique({
        where: { id },
        include: {
          registrations: {
            include: {
              event: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 5,
          },
          payments: {
            orderBy: {
              createdAt: "desc",
            },
            take: 5,
          },
          notifications: {
            orderBy: {
              createdAt: "desc",
            },
            take: 5,
          },
        },
      });

      if (!user) {
        return null;
      }

      return user;
    },
    () => null,
  );

  if (!userData) {
    redirect("/admin/members");
  }

  const StatusIcon = statusStyles[userData.membershipStatus]?.icon || ShieldAlert;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">User Details</p>
          <h1 className="text-2xl font-semibold text-white">{userData.name}</h1>
        </div>
        <Link
          href="/admin/members"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Members
        </Link>
      </div>

      {/* User Info Card */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Personal Information</h2>

            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Full Name</p>
                <p className="text-sm text-white">{userData.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Phone</p>
                <p className="text-sm text-white">{userData.phone}</p>
              </div>
            </div>

            {userData.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="text-sm text-white">{userData.email}</p>
                </div>
              </div>
            )}

            {userData.clan && (
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Clan</p>
                  <p className="text-sm text-white">{userData.clan}</p>
                </div>
              </div>
            )}

            {userData.college && (
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">College</p>
                  <p className="text-sm text-white">{userData.college}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Member Since</p>
                <p className="text-sm text-white">
                  {new Date(userData.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Account Status</h2>

            <div>
              <p className="text-xs text-slate-400 mb-2">Membership Status</p>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${statusStyles[userData.membershipStatus]?.bg} ${statusStyles[userData.membershipStatus]?.text}`}
              >
                <StatusIcon className="h-4 w-4" />
                {userData.membershipStatus}
              </span>
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-2">User Role</p>
              <RoleSelect userId={userData.id} currentRole={userData.role} />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-teal-300" />
            <h3 className="text-sm font-semibold text-white">Event Registrations</h3>
          </div>
          <p className="text-2xl font-bold text-white">{userData.registrations.length}</p>
          <p className="text-xs text-slate-400">Total registrations</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="h-5 w-5 text-emerald-300" />
            <h3 className="text-sm font-semibold text-white">Payments</h3>
          </div>
          <p className="text-2xl font-bold text-white">{userData.payments.length}</p>
          <p className="text-xs text-slate-400">Total payments</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="h-5 w-5 text-purple-300" />
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
          </div>
          <p className="text-2xl font-bold text-white">{userData.notifications.length}</p>
          <p className="text-xs text-slate-400">Received</p>
        </div>
      </div>

      {/* Recent Activity */}
      {userData.registrations.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/30">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Event Registrations</h2>
          <div className="space-y-3">
            {userData.registrations.map((reg) => (
              <div
                key={reg.id}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">{reg.event.title}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(reg.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    reg.status === "CONFIRMED"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : reg.status === "PENDING"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {reg.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
