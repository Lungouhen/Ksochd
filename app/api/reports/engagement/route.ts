import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Role } from "@/types/domain";
import { getEngagementReport } from "@/server/services/report.service";

export async function GET() {
  try {
    const session = await getSession();
    if (session.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const report = await getEngagementReport();

    const rows: string[] = [];
    rows.push("Section,Metric,Value");

    // Notification summary
    rows.push(`Notifications,Total Sent,${report.totalNotifications}`);
    rows.push(`Notifications,Read,${report.readNotifications}`);
    rows.push(`Notifications,Unread,${report.unreadNotifications}`);
    rows.push(`Notifications,Read Rate,${report.readRate}%`);

    // Content summary
    rows.push(`Content,Total Published,${report.totalContent}`);

    // Content type breakdown
    rows.push("");
    rows.push("Content Type,Count");
    for (const c of report.contentTypeBreakdown) {
      rows.push(`${c.type},${c.count}`);
    }

    // Monthly content
    rows.push("");
    rows.push("Month,Content Published");
    for (const m of report.monthlyContent) {
      rows.push(`${m.month},${m.count}`);
    }

    // Ad summary
    rows.push("");
    rows.push(`Ads,Total Ads,${report.totalAds}`);
    rows.push(`Ads,Total Impressions,${report.totalImpressions}`);
    rows.push(`Ads,Total Clicks,${report.totalClicks}`);
    rows.push(`Ads,Overall CTR,${report.overallCtr}%`);

    // Ad performance
    rows.push("");
    rows.push("Ad Name,Type,Impressions,Clicks,CTR");
    for (const a of report.topAds) {
      rows.push(`"${a.name}",${a.type},${a.impressions},${a.clicks},${a.ctr}%`);
    }

    // Audit logs
    rows.push("");
    rows.push(`Audit,Total Audit Logs,${report.auditLogCount}`);
    rows.push("");
    rows.push("Month,Audit Logs");
    for (const m of report.monthlyAuditLogs) {
      rows.push(`${m.month},${m.count}`);
    }

    const csv = rows.join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="engagement-report-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 },
    );
  }
}
