'use client';

import { Bell, Search } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";

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
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:border-amber-300/60 hover:text-amber-100">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-400" />
        </button>
      </div>
    </header>
  );
}
