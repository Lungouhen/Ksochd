'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Search, Menu, ArrowLeftRight, Calendar } from 'lucide-react';
import { useSidebar } from './sidebar-context';
import { useEffect, useState } from 'react';

const routeLabels: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/dashboard': 'Dashboard',
  '/admin/members': 'Members',
  '/admin/events': 'Events',
  '/admin/gallery': 'Gallery',
  '/admin/payments': 'Payments',
  '/admin/notifications': 'Notifications',
  '/admin/settings': 'Settings',
};

function getBreadcrumb(pathname: string): string {
  if (routeLabels[pathname]) return routeLabels[pathname];

  // Match parent route for nested pages (e.g. /admin/settings/website → "Settings › Website")
  const segments = pathname.split('/').filter(Boolean);
  for (let i = segments.length - 1; i >= 1; i--) {
    const parentPath = '/' + segments.slice(0, i).join('/');
    if (routeLabels[parentPath]) {
      const child = segments[i];
      return `${routeLabels[parentPath]} › ${child.charAt(0).toUpperCase() + child.slice(1)}`;
    }
  }

  return 'Admin';
}

export function AdminHeader() {
  const pathname = usePathname();
  const { toggle } = useSidebar();
  const title = getBreadcrumb(pathname || '/admin');
  const [currentTerm, setCurrentTerm] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/executive-terms/current')
      .then((res) => res.json())
      .then((data) => {
        if (data.term) {
          setCurrentTerm(`${data.term.startYear}-${data.term.endYear}`);
        }
      })
      .catch(() => {
        // Silently fail
      });
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/10 bg-slate-900/70 px-4 py-3 backdrop-blur-lg md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Admin Portal
            </p>
            {currentTerm && (
              <span
                className="flex items-center gap-1 rounded-full bg-teal-500/20 px-2 py-0.5 text-xs font-semibold text-teal-300"
                title="Current Executive Term"
              >
                <Calendar className="h-3 w-3" aria-hidden="true" />
                {currentTerm}
              </span>
            )}
          </div>
          <h1 className="text-lg font-semibold text-white">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            className="w-48 rounded-full border border-white/10 bg-slate-800/80 py-2 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-teal-400/60 focus:outline-none lg:w-56"
            placeholder="Search…"
          />
        </div>

        {/* Switch to member dashboard */}
        <Link
          href="/dashboard"
          className="flex h-9 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-xs font-medium text-slate-300 transition-colors hover:border-teal-400/40 hover:text-teal-300"
          title="Member Dashboard"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        {/* Notifications */}
        <Link
          href="/admin/notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 transition-colors hover:border-teal-400/40 hover:text-teal-300"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-teal-400" />
        </Link>
      </div>
    </header>
  );
}
