import Link from "next/link";
import { ReactNode } from "react";
import { Pill } from "../ui/pill";

export type NavItem = {
  label: string;
  href: string;
  description?: string;
  badge?: string;
};

type PortalShellProps = {
  title: string;
  subtitle: string;
  nav?: NavItem[];
  children: ReactNode;
  tone?: "teal" | "gold";
};

export function PortalShell({
  title,
  subtitle,
  nav = [],
  children,
  tone = "teal",
}: PortalShellProps) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="space-y-3">
          <div className="flex items-center gap-3">
            <Pill label="Single Stream" tone={tone} />
            <Pill
              label={tone === "gold" ? "Admin" : "Member"}
              tone={tone === "gold" ? "gold" : "teal"}
            />
          </div>
          <h1 className="text-3xl font-semibold text-white">{title}</h1>
          <p className="max-w-3xl text-base text-slate-200/85">{subtitle}</p>
        </header>

        {nav.length ? (
          <nav className="glass-panel grid gap-4 border-white/10 p-4 md:grid-cols-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex flex-col gap-2 rounded-xl border border-white/5 bg-white/5 p-3 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    {item.label}
                  </span>
                  {item.badge ? <Pill label={item.badge} tone="slate" /> : null}
                </div>
                {item.description ? (
                  <p className="text-xs text-slate-200/80">{item.description}</p>
                ) : null}
              </Link>
            ))}
          </nav>
        ) : null}

        <main className="glass-panel border-white/10 p-6">{children}</main>
      </div>
    </div>
  );
}
