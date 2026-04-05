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
} from 'lucide-react';
import { useSidebar } from './sidebar-context';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Members', href: '/admin/members' },
  { icon: Calendar, label: 'Events', href: '/admin/events' },
  { icon: Image, label: 'Gallery', href: '/admin/gallery' },
  { icon: CreditCard, label: 'Payments', href: '/admin/payments' },
  { icon: Bell, label: 'Notifications', href: '/admin/notifications' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
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
          fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10
          bg-slate-900/95 backdrop-blur-xl transition-transform duration-300 ease-in-out
          md:static md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5">
          <Link
            href="/admin"
            className="flex items-center gap-2.5"
            onClick={close}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20">
              <LayoutDashboard className="h-4 w-4 text-teal-400" />
            </span>
            <span className="text-lg font-semibold text-white">
              KSO <span className="text-teal-400">Admin</span>
            </span>
          </Link>
          <button
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {menuItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname?.startsWith(item.href) ?? false;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'border border-teal-400/40 bg-teal-500/20 text-teal-300'
                    : 'border border-transparent text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] ${isActive ? 'text-teal-400' : ''}`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-white/10 p-4">
          <Link
            href="/admin/settings"
            onClick={close}
            className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500/20 text-sm font-semibold text-teal-300">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                Admin User
              </p>
              <p className="truncate text-xs text-slate-400">
                admin@ksochd.org
              </p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}
