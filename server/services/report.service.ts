import { withPrisma } from "@/lib/prisma";
import { PaymentStatus, Status, Role, ContentType } from "@/types/domain";

// ─── Types ──────────────────────────────────────────────────────────────

export type MonthlyCount = { month: string; count: number };
export type MonthlyRevenue = { month: string; revenue: number };
export type StatusBreakdown = { status: string; count: number };
export type PurposeBreakdown = { purpose: string; count: number; revenue: number };
export type ClanBreakdown = { clan: string; count: number };
export type CollegeBreakdown = { college: string; count: number };
export type EventPerformance = {
  id: string;
  title: string;
  date: string;
  venue: string;
  fee: number;
  registrations: number;
  confirmed: number;
  cancelled: number;
  revenue: number;
};
export type ContentTypeBreakdown = { type: string; count: number };
export type AdPerformance = {
  id: string;
  name: string;
  type: string;
  impressions: number;
  clicks: number;
  ctr: number;
};

export type MemberReport = {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  rejectedMembers: number;
  expiredMembers: number;
  monthlySignups: MonthlyCount[];
  roleDistribution: StatusBreakdown[];
  statusDistribution: StatusBreakdown[];
  clanDistribution: ClanBreakdown[];
  collegeDistribution: CollegeBreakdown[];
};

export type FinancialReport = {
  totalRevenue: number;
  totalTransactions: number;
  paidCount: number;
  pendingCount: number;
  failedCount: number;
  avgPaymentAmount: number;
  successRate: number;
  monthlyRevenue: MonthlyRevenue[];
  paymentStatusBreakdown: StatusBreakdown[];
  purposeBreakdown: PurposeBreakdown[];
};

export type EventReport = {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalRegistrations: number;
  avgRegistrationsPerEvent: number;
  totalEventRevenue: number;
  monthlyRegistrations: MonthlyCount[];
  registrationStatusBreakdown: StatusBreakdown[];
  topEvents: EventPerformance[];
};

export type EngagementReport = {
  totalNotifications: number;
  readNotifications: number;
  unreadNotifications: number;
  readRate: number;
  totalContent: number;
  contentTypeBreakdown: ContentTypeBreakdown[];
  monthlyContent: MonthlyCount[];
  totalAds: number;
  totalImpressions: number;
  totalClicks: number;
  overallCtr: number;
  topAds: AdPerformance[];
  auditLogCount: number;
  monthlyAuditLogs: MonthlyCount[];
};

// ─── Helpers ────────────────────────────────────────────────────────────

function getLast12Months(): { label: string; start: Date; end: Date }[] {
  const months: { label: string; start: Date; end: Date }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
    const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    months.push({ label, start, end });
  }
  return months;
}

// ─── Fallback Data ──────────────────────────────────────────────────────

const fallbackMemberReport: MemberReport = {
  totalMembers: 1284,
  activeMembers: 1184,
  pendingMembers: 32,
  rejectedMembers: 18,
  expiredMembers: 50,
  monthlySignups: [
    { month: "May '25", count: 45 },
    { month: "Jun '25", count: 62 },
    { month: "Jul '25", count: 38 },
    { month: "Aug '25", count: 91 },
    { month: "Sep '25", count: 55 },
    { month: "Oct '25", count: 78 },
    { month: "Nov '25", count: 64 },
    { month: "Dec '25", count: 42 },
    { month: "Jan '26", count: 110 },
    { month: "Feb '26", count: 86 },
    { month: "Mar '26", count: 97 },
    { month: "Apr '26", count: 34 },
  ],
  roleDistribution: [
    { status: "Member", count: 1250 },
    { status: "Moderator", count: 24 },
    { status: "Admin", count: 10 },
  ],
  statusDistribution: [
    { status: "Active", count: 1184 },
    { status: "Pending", count: 32 },
    { status: "Rejected", count: 18 },
    { status: "Expired", count: 50 },
  ],
  clanDistribution: [
    { clan: "Vaiphei", count: 186 },
    { clan: "Haokip", count: 172 },
    { clan: "Kipgen", count: 148 },
    { clan: "Guite", count: 134 },
    { clan: "Singson", count: 120 },
    { clan: "Hmar", count: 108 },
    { clan: "Zou", count: 96 },
    { clan: "Mate", count: 88 },
    { clan: "Others", count: 232 },
  ],
  collegeDistribution: [
    { college: "Chandigarh University", count: 380 },
    { college: "Panjab University", count: 245 },
    { college: "Chitkara University", count: 178 },
    { college: "LPU", count: 156 },
    { college: "UIET Chandigarh", count: 112 },
    { college: "Others", count: 213 },
  ],
};

const fallbackFinancialReport: FinancialReport = {
  totalRevenue: 854200,
  totalTransactions: 648,
  paidCount: 580,
  pendingCount: 42,
  failedCount: 26,
  avgPaymentAmount: 1318,
  successRate: 89.5,
  monthlyRevenue: [
    { month: "May '25", revenue: 48500 },
    { month: "Jun '25", revenue: 62400 },
    { month: "Jul '25", revenue: 38200 },
    { month: "Aug '25", revenue: 91800 },
    { month: "Sep '25", revenue: 55600 },
    { month: "Oct '25", revenue: 78300 },
    { month: "Nov '25", revenue: 64100 },
    { month: "Dec '25", revenue: 42700 },
    { month: "Jan '26", revenue: 112500 },
    { month: "Feb '26", revenue: 86400 },
    { month: "Mar '26", revenue: 98200 },
    { month: "Apr '26", revenue: 75500 },
  ],
  paymentStatusBreakdown: [
    { status: "Paid", count: 580 },
    { status: "Pending", count: 42 },
    { status: "Failed", count: 26 },
  ],
  purposeBreakdown: [
    { purpose: "Membership", count: 420, revenue: 504000 },
    { purpose: "Event", count: 180, revenue: 286000 },
    { purpose: "Donation", count: 48, revenue: 64200 },
  ],
};

const fallbackEventReport: EventReport = {
  totalEvents: 24,
  upcomingEvents: 6,
  completedEvents: 18,
  totalRegistrations: 1860,
  avgRegistrationsPerEvent: 78,
  totalEventRevenue: 286000,
  monthlyRegistrations: [
    { month: "May '25", count: 120 },
    { month: "Jun '25", count: 185 },
    { month: "Jul '25", count: 95 },
    { month: "Aug '25", count: 240 },
    { month: "Sep '25", count: 165 },
    { month: "Oct '25", count: 210 },
    { month: "Nov '25", count: 175 },
    { month: "Dec '25", count: 85 },
    { month: "Jan '26", count: 155 },
    { month: "Feb '26", count: 130 },
    { month: "Mar '26", count: 180 },
    { month: "Apr '26", count: 120 },
  ],
  registrationStatusBreakdown: [
    { status: "Confirmed", count: 1620 },
    { status: "Pending", count: 145 },
    { status: "Cancelled", count: 95 },
  ],
  topEvents: [
    { id: "e1", title: "KSO Cultural Evening 2025", date: "2025-12-15", venue: "CU Auditorium", fee: 0, registrations: 320, confirmed: 295, cancelled: 12, revenue: 0 },
    { id: "e2", title: "Youth Sports Meet", date: "2026-01-20", venue: "Sector 42 Sports Complex", fee: 500, registrations: 245, confirmed: 220, cancelled: 15, revenue: 110000 },
    { id: "e3", title: "Career Mentorship Circle", date: "2026-02-10", venue: "Sector 17 Community Center", fee: 200, registrations: 198, confirmed: 185, cancelled: 8, revenue: 37000 },
    { id: "e4", title: "Annual General Meeting", date: "2026-03-05", venue: "Hotel Mountview", fee: 0, registrations: 180, confirmed: 165, cancelled: 10, revenue: 0 },
    { id: "e5", title: "Kut Festival Celebration", date: "2025-11-01", venue: "Rose Garden", fee: 300, registrations: 410, confirmed: 385, cancelled: 18, revenue: 115500 },
  ],
};

const fallbackEngagementReport: EngagementReport = {
  totalNotifications: 4820,
  readNotifications: 3856,
  unreadNotifications: 964,
  readRate: 80,
  totalContent: 86,
  contentTypeBreakdown: [
    { type: "News", count: 32 },
    { type: "Announcement", count: 24 },
    { type: "Gallery", count: 18 },
    { type: "Document", count: 12 },
  ],
  monthlyContent: [
    { month: "May '25", count: 6 },
    { month: "Jun '25", count: 8 },
    { month: "Jul '25", count: 5 },
    { month: "Aug '25", count: 10 },
    { month: "Sep '25", count: 7 },
    { month: "Oct '25", count: 9 },
    { month: "Nov '25", count: 8 },
    { month: "Dec '25", count: 4 },
    { month: "Jan '26", count: 11 },
    { month: "Feb '26", count: 7 },
    { month: "Mar '26", count: 8 },
    { month: "Apr '26", count: 3 },
  ],
  totalAds: 12,
  totalImpressions: 45200,
  totalClicks: 1356,
  overallCtr: 3.0,
  topAds: [
    { id: "a1", name: "Membership Drive Banner", type: "Banner", impressions: 12400, clicks: 496, ctr: 4.0 },
    { id: "a2", name: "Kut Festival Promo", type: "Banner", impressions: 9800, clicks: 392, ctr: 4.0 },
    { id: "a3", name: "Sports Meet Sidebar", type: "Sidebar", impressions: 7600, clicks: 190, ctr: 2.5 },
    { id: "a4", name: "Career Mentorship Inline", type: "Inline", impressions: 6200, clicks: 155, ctr: 2.5 },
    { id: "a5", name: "Annual Membership Popup", type: "Popup", impressions: 9200, clicks: 123, ctr: 1.3 },
  ],
  auditLogCount: 342,
  monthlyAuditLogs: [
    { month: "May '25", count: 18 },
    { month: "Jun '25", count: 24 },
    { month: "Jul '25", count: 15 },
    { month: "Aug '25", count: 42 },
    { month: "Sep '25", count: 28 },
    { month: "Oct '25", count: 35 },
    { month: "Nov '25", count: 30 },
    { month: "Dec '25", count: 20 },
    { month: "Jan '26", count: 48 },
    { month: "Feb '26", count: 32 },
    { month: "Mar '26", count: 38 },
    { month: "Apr '26", count: 12 },
  ],
};

// ─── Member Report ──────────────────────────────────────────────────────

export async function getMemberReport(): Promise<MemberReport> {
  return withPrisma(
    async (client) => {
      const months = getLast12Months();

      const [total, active, pending, rejected, expired, roles, allUsers] =
        await Promise.all([
          client.user.count(),
          client.user.count({ where: { membershipStatus: Status.ACTIVE } }),
          client.user.count({ where: { membershipStatus: Status.PENDING } }),
          client.user.count({ where: { membershipStatus: Status.REJECTED } }),
          client.user.count({ where: { membershipStatus: Status.EXPIRED } }),
          Promise.all([
            client.user.count({ where: { role: Role.MEMBER } }),
            client.user.count({ where: { role: Role.MODERATOR } }),
            client.user.count({ where: { role: Role.ADMIN } }),
          ]),
          client.user.findMany({
            select: { createdAt: true, clan: true, college: true },
          }),
        ]);

      // Monthly signups
      const monthlySignups: MonthlyCount[] = months.map(({ label, start, end }) => ({
        month: label,
        count: allUsers.filter(
          (u) => u.createdAt >= start && u.createdAt <= end,
        ).length,
      }));

      // Clan distribution
      const clanMap = new Map<string, number>();
      for (const u of allUsers) {
        const clan = u.clan || "Unknown";
        clanMap.set(clan, (clanMap.get(clan) || 0) + 1);
      }
      const clanDistribution = Array.from(clanMap.entries())
        .map(([clan, count]) => ({ clan, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // College distribution
      const collegeMap = new Map<string, number>();
      for (const u of allUsers) {
        const college = u.college || "Unknown";
        collegeMap.set(college, (collegeMap.get(college) || 0) + 1);
      }
      const collegeDistribution = Array.from(collegeMap.entries())
        .map(([college, count]) => ({ college, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      return {
        totalMembers: total,
        activeMembers: active,
        pendingMembers: pending,
        rejectedMembers: rejected,
        expiredMembers: expired,
        monthlySignups,
        roleDistribution: [
          { status: "Member", count: roles[0] },
          { status: "Moderator", count: roles[1] },
          { status: "Admin", count: roles[2] },
        ],
        statusDistribution: [
          { status: "Active", count: active },
          { status: "Pending", count: pending },
          { status: "Rejected", count: rejected },
          { status: "Expired", count: expired },
        ],
        clanDistribution,
        collegeDistribution,
      };
    },
    () => fallbackMemberReport,
  );
}

// ─── Financial Report ───────────────────────────────────────────────────

export async function getFinancialReport(): Promise<FinancialReport> {
  return withPrisma(
    async (client) => {
      const months = getLast12Months();

      const [allPayments, paid, pending, failed, total] = await Promise.all([
        client.payment.findMany({
          select: { amount: true, status: true, purpose: true, createdAt: true },
        }),
        client.payment.count({ where: { status: PaymentStatus.PAID } }),
        client.payment.count({ where: { status: PaymentStatus.PENDING } }),
        client.payment.count({ where: { status: PaymentStatus.FAILED } }),
        client.payment.count(),
      ]);

      const paidPayments = allPayments.filter(
        (p) => p.status === PaymentStatus.PAID,
      );
      const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);
      const avgPaymentAmount =
        paidPayments.length > 0
          ? Math.round(totalRevenue / paidPayments.length)
          : 0;
      const successRate =
        total > 0 ? Math.round((paid / total) * 1000) / 10 : 0;

      // Monthly revenue
      const monthlyRevenue: MonthlyRevenue[] = months.map(
        ({ label, start, end }) => ({
          month: label,
          revenue: paidPayments
            .filter((p) => p.createdAt >= start && p.createdAt <= end)
            .reduce((sum, p) => sum + p.amount, 0),
        }),
      );

      // Purpose breakdown
      const purposeMap = new Map<
        string,
        { count: number; revenue: number }
      >();
      for (const p of allPayments) {
        const purpose = p.purpose.toLowerCase().includes("membership")
          ? "Membership"
          : p.purpose.toLowerCase().includes("event")
            ? "Event"
            : p.purpose.toLowerCase().includes("donation")
              ? "Donation"
              : "Other";
        const existing = purposeMap.get(purpose) || { count: 0, revenue: 0 };
        existing.count += 1;
        if (p.status === PaymentStatus.PAID) {
          existing.revenue += p.amount;
        }
        purposeMap.set(purpose, existing);
      }
      const purposeBreakdown = Array.from(purposeMap.entries())
        .map(([purpose, data]) => ({ purpose, ...data }))
        .sort((a, b) => b.revenue - a.revenue);

      return {
        totalRevenue,
        totalTransactions: total,
        paidCount: paid,
        pendingCount: pending,
        failedCount: failed,
        avgPaymentAmount,
        successRate,
        monthlyRevenue,
        paymentStatusBreakdown: [
          { status: "Paid", count: paid },
          { status: "Pending", count: pending },
          { status: "Failed", count: failed },
        ],
        purposeBreakdown,
      };
    },
    () => fallbackFinancialReport,
  );
}

// ─── Event Report ───────────────────────────────────────────────────────

export async function getEventReport(): Promise<EventReport> {
  return withPrisma(
    async (client) => {
      const months = getLast12Months();
      const now = new Date();

      const [allEvents, allRegistrations] = await Promise.all([
        client.event.findMany({
          include: {
            registrations: {
              select: { status: true, createdAt: true },
            },
          },
          orderBy: { date: "desc" },
        }),
        client.eventRegistration.findMany({
          select: { status: true, createdAt: true },
        }),
      ]);

      const totalEvents = allEvents.length;
      const upcomingEvents = allEvents.filter((e) => e.date > now).length;
      const completedEvents = totalEvents - upcomingEvents;
      const totalRegistrations = allRegistrations.length;
      const avgRegistrationsPerEvent =
        totalEvents > 0 ? Math.round(totalRegistrations / totalEvents) : 0;

      // Monthly registrations
      const monthlyRegistrations: MonthlyCount[] = months.map(
        ({ label, start, end }) => ({
          month: label,
          count: allRegistrations.filter(
            (r) => r.createdAt >= start && r.createdAt <= end,
          ).length,
        }),
      );

      // Registration status breakdown
      const confirmed = allRegistrations.filter(
        (r) => r.status === "CONFIRMED",
      ).length;
      const pendingReg = allRegistrations.filter(
        (r) => r.status === "PENDING",
      ).length;
      const cancelled = allRegistrations.filter(
        (r) => r.status === "CANCELLED",
      ).length;

      // Top events by registrations
      const topEvents: EventPerformance[] = allEvents
        .map((e) => {
          const regs = e.registrations;
          const confirmedCount = regs.filter(
            (r) => r.status === "CONFIRMED",
          ).length;
          return {
            id: e.id,
            title: e.title,
            date: e.date.toISOString().split("T")[0],
            venue: e.venue,
            fee: e.fee,
            registrations: regs.length,
            confirmed: confirmedCount,
            cancelled: regs.filter((r) => r.status === "CANCELLED").length,
            revenue: confirmedCount * e.fee,
          };
        })
        .sort((a, b) => b.registrations - a.registrations)
        .slice(0, 10);

      const totalEventRevenue = topEvents.reduce(
        (sum, e) => sum + e.revenue,
        0,
      );

      return {
        totalEvents,
        upcomingEvents,
        completedEvents,
        totalRegistrations,
        avgRegistrationsPerEvent,
        totalEventRevenue,
        monthlyRegistrations,
        registrationStatusBreakdown: [
          { status: "Confirmed", count: confirmed },
          { status: "Pending", count: pendingReg },
          { status: "Cancelled", count: cancelled },
        ],
        topEvents,
      };
    },
    () => fallbackEventReport,
  );
}

// ─── Engagement Report ──────────────────────────────────────────────────

export async function getEngagementReport(): Promise<EngagementReport> {
  return withPrisma(
    async (client) => {
      const months = getLast12Months();

      const [
        totalNotifications,
        readNotifications,
        allContent,
        allAds,
        auditLogCount,
        allAuditLogs,
      ] = await Promise.all([
        client.notification.count(),
        client.notification.count({ where: { read: true } }),
        client.content.findMany({
          select: { type: true, createdAt: true },
        }),
        client.ad.findMany({
          select: {
            id: true,
            name: true,
            type: true,
            impressions: true,
            clicks: true,
          },
          orderBy: { impressions: "desc" },
          take: 10,
        }),
        client.auditLog.count(),
        client.auditLog.findMany({
          select: { createdAt: true },
        }),
      ]);

      const unreadNotifications = totalNotifications - readNotifications;
      const readRate =
        totalNotifications > 0
          ? Math.round((readNotifications / totalNotifications) * 1000) / 10
          : 0;

      // Content type breakdown
      const typeMap = new Map<string, number>();
      for (const c of allContent) {
        const typeName =
          c.type === ContentType.NEWS
            ? "News"
            : c.type === ContentType.ANNOUNCEMENT
              ? "Announcement"
              : c.type === ContentType.GALLERY
                ? "Gallery"
                : "Document";
        typeMap.set(typeName, (typeMap.get(typeName) || 0) + 1);
      }
      const contentTypeBreakdown = Array.from(typeMap.entries())
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);

      // Monthly content
      const monthlyContent: MonthlyCount[] = months.map(
        ({ label, start, end }) => ({
          month: label,
          count: allContent.filter(
            (c) => c.createdAt >= start && c.createdAt <= end,
          ).length,
        }),
      );

      // Ad performance
      const totalImpressions = allAds.reduce(
        (sum, a) => sum + a.impressions,
        0,
      );
      const totalClicks = allAds.reduce((sum, a) => sum + a.clicks, 0);
      const overallCtr =
        totalImpressions > 0
          ? Math.round((totalClicks / totalImpressions) * 1000) / 10
          : 0;

      const topAds: AdPerformance[] = allAds.slice(0, 5).map((a) => ({
        id: a.id,
        name: a.name,
        type: a.type,
        impressions: a.impressions,
        clicks: a.clicks,
        ctr:
          a.impressions > 0
            ? Math.round((a.clicks / a.impressions) * 1000) / 10
            : 0,
      }));

      // Monthly audit logs
      const monthlyAuditLogs: MonthlyCount[] = months.map(
        ({ label, start, end }) => ({
          month: label,
          count: allAuditLogs.filter(
            (l) => l.createdAt >= start && l.createdAt <= end,
          ).length,
        }),
      );

      return {
        totalNotifications,
        readNotifications,
        unreadNotifications,
        readRate,
        totalContent: allContent.length,
        contentTypeBreakdown,
        monthlyContent,
        totalAds: allAds.length,
        totalImpressions,
        totalClicks,
        overallCtr,
        topAds,
        auditLogCount,
        monthlyAuditLogs,
      };
    },
    () => fallbackEngagementReport,
  );
}
