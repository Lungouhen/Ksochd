import { ReactNode } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { adminNav } from "@/lib/navigation";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PortalShell
      title="Admin Control Room"
      subtitle="Moderation, content workflows, and analytics backed by the single-stream core."
      nav={adminNav}
      tone="gold"
    >
      {children}
    </PortalShell>
  );
}
