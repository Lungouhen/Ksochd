import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Role } from "@/types/domain";
import { getEventReport } from "@/server/services/report.service";

export async function GET() {
  try {
    const session = await getSession();
    if (session.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const report = await getEventReport();

    const rows: string[] = [];
    rows.push("Section,Metric,Value");

    // Summary
    rows.push(`Summary,Total Events,${report.totalEvents}`);
    rows.push(`Summary,Upcoming Events,${report.upcomingEvents}`);
    rows.push(`Summary,Completed Events,${report.completedEvents}`);
    rows.push(`Summary,Total Registrations,${report.totalRegistrations}`);
    rows.push(`Summary,Avg Registrations Per Event,${report.avgRegistrationsPerEvent}`);
    rows.push(`Summary,Total Event Revenue,${report.totalEventRevenue}`);

    // Monthly registrations
    rows.push("");
    rows.push("Month,Registrations");
    for (const m of report.monthlyRegistrations) {
      rows.push(`${m.month},${m.count}`);
    }

    // Registration status breakdown
    rows.push("");
    rows.push("Registration Status,Count");
    for (const s of report.registrationStatusBreakdown) {
      rows.push(`${s.status},${s.count}`);
    }

    // Top events
    rows.push("");
    rows.push("Event,Date,Venue,Fee,Registrations,Confirmed,Cancelled,Revenue");
    for (const e of report.topEvents) {
      rows.push(
        `"${e.title}",${e.date},"${e.venue}",${e.fee},${e.registrations},${e.confirmed},${e.cancelled},${e.revenue}`,
      );
    }

    const csv = rows.join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="events-report-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 },
    );
  }
}
