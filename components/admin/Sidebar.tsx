'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Inbox,
  Calendar,
  FileText,
  Image,
  Video,
  Music,
  Newspaper,
  Users2,
  Trophy,
  MapPin,
  MessageSquare,
  Settings,
  Globe,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Users, label: "Members", href: "/admin/members" },
  { icon: Inbox, label: "Inbox", href: "/admin/inbox" },
  { icon: Calendar, label: "Events", href: "/admin/events" },
  { icon: FileText, label: "News", href: "/admin/news" },
  { icon: Image, label: "Gallery", href: "/admin/gallery" },
  { icon: Video, label: "Videos", href: "/admin/videos" },
  { icon: Music, label: "Audio", href: "/admin/audio" },
  { icon: Newspaper, label: "Blog", href: "/admin/blog" },
  { icon: Users2, label: "Office Bearers", href: "/admin/staff" },
  { icon: Trophy, label: "Testimonials", href: "/admin/testimonials" },
  { icon: MapPin, label: "Branches", href: "/admin/branches" },
  { icon: MessageSquare, label: "Forum", href: "/admin/forum" },
  { icon: Globe, label: "Website Settings", href: "/admin/settings/website" },
  { icon: Settings, label: "System Settings", href: "/admin/settings/system" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-white/10 bg-slate-900/80 backdrop-blur-lg">
      <div className="px-4 py-5">
        <Link
          href="/admin"
          className="flex items-center gap-2 text-lg font-semibold text-white"
        >
          <LayoutDashboard className="h-5 w-5 text-amber-300" />
          KSO Admin
        </Link>
      </div>
      <nav className="px-2 pb-6 space-y-1">
        {menuItems.map((item) => {
          const active =
            pathname === item.href ||
            (pathname?.startsWith(item.href) && item.href !== "/admin");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-amber-400/20 text-white border border-amber-300/40"
                  : "text-slate-200/80 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
