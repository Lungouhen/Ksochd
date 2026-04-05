'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Image,
  CreditCard,
  Bell,
  Settings,
  X,
  ArrowRightLeft,
  Sparkles,
} from 'lucide-react';
import { useSidebar } from './sidebar-context';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard', badge: 'Live' },
  { icon: Users, label: 'Members', href: '/admin/members', badge: '12 pending' },
  { icon: Calendar, label: 'Events', href: '/admin/events', badge: '3 open' },
  { icon: Image, label: 'Gallery', href: '/admin/gallery' },
  { icon: CreditCard, label: 'Payments', href: '/admin/payments', badge: '₹7.2L' },
  { icon: Bell, label: 'Notifications', href: '/admin/notifications', badge: '5' },
  { icon: Settings, label: 'Settings', href: '/admin/settings', badge: 'Config' },
];

export function Sidebar() {
  const pathname = usePathname() || '';
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10
          bg-slate-950/90 backdrop-blur-2xl transition-transform duration-300 ease-in-out
          md:static md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3"
            onClick={close}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/25 via-teal-500/10 to-amber-400/20 text-white ring-1 ring-teal-400/30">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <p className="text-xs uppercase tracking-[0.12em] text-amber-200/80">
                KSO Chandigarh
              </p>
              <p className="text-lg font-semibold text-white">
                Admin Control
              </p>
            </div>
          </Link>
          <button
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 pb-3">
          <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-xs text-slate-300">
            <p className="font-semibold text-white">Ops Control</p>
            <p className="mt-1 text-[11px] text-slate-400">
              Everything is wired up — every menu item routes to a live screen.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-3">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`) ||
              (item.href === '/admin/dashboard' && pathname === '/admin');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                aria-current={isActive ? 'page' : undefined}
                className={`group relative flex items-center justify-between gap-3 rounded-xl border px-3 py-3 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'border-teal-400/40 bg-teal-500/15 text-white shadow-[0_10px_30px_-15px_rgba(20,184,166,0.75)] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:rounded-full before:bg-gradient-to-b before:from-teal-300 before:to-amber-200'
                    : 'border-white/5 text-slate-300 hover:border-teal-300/20 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                      isActive
                        ? 'border-teal-400/50 bg-teal-500/20 text-teal-200'
                        : 'border-white/5 bg-white/5 text-slate-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="leading-tight">
                    <p className="text-sm">{item.label}</p>
                    <p className="text-[11px] text-slate-400">
                      {item.label === 'Dashboard'
                        ? 'Org pulse & KPIs'
                        : item.label === 'Members'
                          ? 'Approvals & rosters'
                          : item.label === 'Events'
                            ? 'Calendar & registrations'
                            : item.label === 'Payments'
                              ? 'Razorpay & receipts'
                              : item.label === 'Notifications'
                                ? 'Broadcast & bell center'
                                : item.label === 'Settings'
                                  ? 'Branding & integrations'
                                  : 'Media & stories'}
                    </p>
                  </div>
                </div>
                {item.badge ? (
                  <span
                    className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                      isActive
                        ? 'bg-amber-400/20 text-amber-100'
                        : 'bg-white/5 text-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="space-y-3 border-t border-white/10 p-5">
          <Link
            href="/admin/settings"
            onClick={close}
            className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2.5 transition-colors hover:border-teal-300/25 hover:bg-white/10"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-teal-500/40 to-amber-300/40 text-sm font-semibold text-white ring-1 ring-teal-400/30">
              A
            </div>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-semibold text-white">
                Admin User
              </p>
              <p className="truncate text-xs text-slate-400">
                admin@ksochd.org
              </p>
              <p className="mt-1 text-[11px] text-amber-200/80">
                Settings & audit trail →
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard"
            onClick={close}
            className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-teal-300/25 hover:bg-white/10"
          >
            <span className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-teal-300" />
              Switch to member view
            </span>
            <span className="text-[11px] text-amber-200">Live</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
