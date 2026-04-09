import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { PortalShell } from "@/components/layout/portal-shell";
import { memberNav } from "@/lib/navigation";

export default async function MemberLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <PortalShell
      title="Member Workspace"
      subtitle="Unified dashboard for active and pending members with events, notifications, and payments."
      nav={memberNav}
      tone="teal"
    >
      {children}
    </PortalShell>
  );
}
