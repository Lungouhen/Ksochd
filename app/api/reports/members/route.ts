import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Role } from "@/types/domain";
import { getMemberReport } from "@/server/services/report.service";

export async function GET() {
  try {
    const session = await getSession();
    if (session.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const report = await getMemberReport();

    const rows: string[] = [];
    rows.push("Section,Metric,Value");

    // Summary
    rows.push(`Summary,Total Members,${report.totalMembers}`);
    rows.push(`Summary,Active Members,${report.activeMembers}`);
    rows.push(`Summary,Pending Members,${report.pendingMembers}`);
    rows.push(`Summary,Rejected Members,${report.rejectedMembers}`);
    rows.push(`Summary,Expired Members,${report.expiredMembers}`);

    // Monthly signups
    rows.push("");
    rows.push("Month,New Signups");
    for (const m of report.monthlySignups) {
      rows.push(`${m.month},${m.count}`);
    }

    // Role distribution
    rows.push("");
    rows.push("Role,Count");
    for (const r of report.roleDistribution) {
      rows.push(`${r.status},${r.count}`);
    }

    // Status distribution
    rows.push("");
    rows.push("Status,Count");
    for (const s of report.statusDistribution) {
      rows.push(`${s.status},${s.count}`);
    }

    // Clan distribution
    rows.push("");
    rows.push("Clan,Members");
    for (const c of report.clanDistribution) {
      rows.push(`"${c.clan}",${c.count}`);
    }

    // College distribution
    rows.push("");
    rows.push("College,Members");
    for (const c of report.collegeDistribution) {
      rows.push(`"${c.college}",${c.count}`);
    }

    const csv = rows.join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="members-report-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 },
    );
  }
}
