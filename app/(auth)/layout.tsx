import { ReactNode } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { authNav } from "@/lib/navigation";
import { Toaster } from "sonner";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <PortalShell
        title="Authentication"
        subtitle="Phone-first login with JWT sessions and optional OTP fallback for low-friction access."
        nav={authNav}
        tone="teal"
      >
        {children}
      </PortalShell>
      <Toaster richColors theme="dark" />
    </>
  );
}
