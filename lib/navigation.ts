import { NavItem } from "@/components/layout/portal-shell";

export const memberNav: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    description: "Membership status, upcoming events, and notifications.",
  },
  {
    label: "Events",
    href: "/events",
    description: "Browse, register, and view payment status for events.",
  },
  {
    label: "Profile",
    href: "/profile",
    description: "Personal details, clan/college info, and preferences.",
  },
  {
    label: "Payments",
    href: "/payments",
    description: "Membership dues, receipts, and Razorpay references.",
  },
  {
    label: "Notifications",
    href: "/notifications",
    description: "Unread alerts, approvals, and event updates.",
  },
  {
    label: "Gallery",
    href: "/gallery",
    description: "Photos and cultural highlights for members.",
  },
];

export const adminNav: NavItem[] = [
  {
    label: "Admin Dashboard",
    href: "/admin/dashboard",
    description: "Org health, KPIs, and pending approvals.",
  },
  {
    label: "Users",
    href: "/admin/users",
    description: "RBAC roles, membership lifecycle, and moderation.",
  },
  {
    label: "Content",
    href: "/admin/content",
    description: "Announcements, documents, and gallery assets.",
  },
  {
    label: "Events",
    href: "/admin/events",
    description: "Event creation, capacity, and registration oversight.",
  },
  {
    label: "CMS Pages",
    href: "/admin/cms/pages",
    description: "CMS page builder with drag-and-drop blocks.",
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    description: "Engagement, payments, and operational dashboards.",
  },
  {
    label: "Reports",
    href: "/admin/reports",
    description: "In-depth member, financial, event, and engagement reports.",
  },
  {
    label: "Approvals",
    href: "/admin/approvals",
    description: "Membership approvals and moderation queue.",
  },
  {
    label: "Payments",
    href: "/admin/payments",
    description: "Membership/event payment overview and status.",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    description: "Branding, ID formats, templates, modules, hooks, and backups.",
  },
];

export const authNav: NavItem[] = [
  {
    label: "Login",
    href: "/login",
    description: "JWT session with OTP fallback for phone-first access.",
  },
  {
    label: "Register",
    href: "/register",
    description: "Membership application with clan and college context.",
  },
  {
    label: "OTP",
    href: "/otp",
    description: "One-time-pass for device trust and low-friction flows.",
  },
];
