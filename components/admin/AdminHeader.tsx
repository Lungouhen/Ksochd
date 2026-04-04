'use client';

import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { NotificationBell } from "@/components/notifications/NotificationBell";

export function AdminHeader() {
  const pathname = usePathname();
  const title =
    pathname === "/admin"
      ? "Dashboard"
      : pathname?.split("/").filter(Boolean).slice(1).join(" · ") || "Admin";

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/10 bg-slate-900/70 px-6 py-3 backdrop-blur-lg">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-300">Admin</p>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            className="w-56 rounded-full border border-white/10 bg-slate-800/80 px-9 py-2 text-sm text-white placeholder:text-slate-400 focus:border-amber-300/60 focus:outline-none"
            placeholder="Search admin"
          />
        </div>
        <NotificationBell />
      </div>
    </header>
  );
}
