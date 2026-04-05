import Link from "next/link";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { PortalShell } from "@/components/layout/portal-shell";
import { getSession } from "@/lib/auth";
import { memberNav } from "@/lib/navigation";
import { Role } from "@/types/domain";

export default async function MemberLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (session.role === Role.ADMIN) {
    redirect("/admin/dashboard");
  }

  if (session.role !== Role.MEMBER && session.role !== Role.MODERATOR) {
    redirect("/login");
  }

  return (
    <PortalShell
      title="Member Workspace"
      subtitle="Unified dashboard for active and pending members with events, notifications, and payments."
      nav={memberNav}
      tone="teal"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-200">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Signed in as <strong className="font-semibold text-white">{session.userId}</strong>
        </span>
        <Link
          href="/profile"
          className="flex items-center gap-1 font-semibold text-teal-200 transition hover:text-teal-100"
        >
          Manage profile →
        </Link>
      </div>
      {children}
    </PortalShell>
  );
}
