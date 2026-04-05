'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import type { NavItem } from "@/components/layout/portal-shell";

type MemberShellProps = {
  nav: NavItem[];
  userId: string;
  children: React.ReactNode;
};

export function MemberShell({ nav, userId, children }: MemberShellProps) {
  const pathname = usePathname() || "";
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(20,184,166,0.12),transparent_30%),radial-gradient(circle_at_90%_0%,rgba(251,191,36,0.08),transparent_25%)]" />

      {/* Mobile backdrop */}
      {open ? (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      <div className="relative z-10 flex">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-slate-900/90 backdrop-blur-xl transition-transform duration-300 md:static md:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-5">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-white"
              onClick={() => setOpen(false)}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500/25 via-teal-500/10 to-amber-400/20 text-lg font-semibold">
                K
              </span>
              <div className="leading-tight">
                <p className="text-xs uppercase tracking-[0.14em] text-amber-200/80">
                  KSO Member
                </p>
                <p className="text-base font-semibold">Workspace</p>
              </div>
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white md:hidden"
              aria-label="Close member menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="space-y-1 px-3 pb-6">
            {nav.map((item) => {
              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg border px-3 py-3 text-sm transition ${
                    active
                      ? "border-teal-400/40 bg-teal-500/15 text-white shadow-[0_10px_30px_-15px_rgba(20,184,166,0.7)]"
                      : "border-white/5 text-slate-300 hover:border-teal-300/20 hover:bg-white/5 hover:text-white"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{item.label}</span>
                    {item.badge ? (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] uppercase tracking-wide text-amber-100">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                  {item.description ? (
                    <p className="mt-1 text-xs text-slate-400">
                      {item.description}
                    </p>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-white/10 bg-slate-900/70 px-4 py-3 backdrop-blur-lg md:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white md:hidden"
                aria-label="Open member menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                  Member portal
                </p>
                <p className="text-base font-semibold text-white">
                  Welcome back
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              Signed in as
              <span className="font-semibold text-white">{userId}</span>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
            <div className="mx-auto w-full max-w-5xl space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
