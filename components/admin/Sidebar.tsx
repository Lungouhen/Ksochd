'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Image,
  CreditCard,
  Bell,
  Settings,
  X,
  FileText,
  Palette,
  DollarSign,
  BarChart3,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  PieChart,
  Activity,
  Hash,
  FileCode,
  FormInput,
  ToggleLeft,
  Webhook,
  Archive,
} from 'lucide-react';
import { useSidebar } from './sidebar-context';

type MenuItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  children?: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
};

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Members', href: '/admin/members' },
  { icon: Calendar, label: 'Events', href: '/admin/events' },
  { icon: Image, label: 'Gallery', href: '/admin/gallery' },
  { icon: FileText, label: 'CMS', href: '/admin/cms/pages' },
  { icon: Palette, label: 'Themes', href: '/admin/themes' },
  { icon: DollarSign, label: 'Ads', href: '/admin/ads' },
  { icon: CreditCard, label: 'Payments', href: '/admin/payments' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  {
    icon: ClipboardList,
    label: 'Reports',
    href: '/admin/reports',
    children: [
      { label: 'Overview', href: '/admin/reports', icon: PieChart },
      { label: 'Members', href: '/admin/reports/members', icon: Users },
      { label: 'Financial', href: '/admin/reports/financial', icon: TrendingUp },
      { label: 'Events', href: '/admin/reports/events', icon: Calendar },
      { label: 'Engagement', href: '/admin/reports/engagement', icon: Activity },
    ],
  },
  { icon: Bell, label: 'Notifications', href: '/admin/notifications' },
  {
    icon: Settings,
    label: 'Settings',
    href: '/admin/settings',
    children: [
      { label: 'Hub', href: '/admin/settings', icon: Settings },
      { label: 'Branding', href: '/admin/settings/branding', icon: Palette },
      { label: 'ID Formats', href: '/admin/settings/id-formats', icon: Hash },
      { label: 'Templates', href: '/admin/settings/templates', icon: FileCode },
      { label: 'Custom Fields', href: '/admin/settings/custom-fields', icon: FormInput },
      { label: 'Modules', href: '/admin/settings/modules', icon: ToggleLeft },
      { label: 'Hooks', href: '/admin/settings/hooks', icon: Webhook },
      { label: 'Backups', href: '/admin/settings/backups', icon: Archive },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  function toggleExpanded(href: string) {
    setExpandedMenus((prev) => {
      const next = new Set(prev);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      return next;
    });
  }

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
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedMenus.has(item.href) || (isActive && hasChildren);

            return (
              <div key={item.href}>
                <div className="flex">
                  <Link
                    href={hasChildren ? item.children![0].href : item.href}
                    onClick={close}
                    className={`flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
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
                  {hasChildren && (
                    <button
                      onClick={() => toggleExpanded(item.href)}
                      className="flex items-center px-2 text-slate-400 transition hover:text-white"
                      aria-label={`Toggle ${item.label} submenu`}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </div>
                {hasChildren && isExpanded && (
                  <div className="ml-6 mt-1 space-y-0.5 border-l border-white/5 pl-3">
                    {item.children!.map((child) => {
                      const childActive = pathname === child.href;
                      const ChildIcon = child.icon;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={close}
                          className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition ${
                            childActive
                              ? 'bg-teal-500/15 text-teal-300'
                              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                          }`}
                        >
                          <ChildIcon className="h-3.5 w-3.5" />
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
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
