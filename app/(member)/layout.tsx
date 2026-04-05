import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { MemberShell } from "@/components/member/MemberShell";
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

  return <MemberShell nav={memberNav} userId={session.userId}>{children}</MemberShell>;
}
