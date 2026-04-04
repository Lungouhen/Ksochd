import { ReactNode } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { memberNav } from "@/lib/navigation";

export default function MemberLayout({
  children,
}: {
  children: ReactNode;
}) {
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
