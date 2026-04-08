import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { Role } from "@/types/domain";
import { getFinancialReport } from "@/server/services/report.service";

export async function GET() {
  try {
    const session = await getSession();
    if (session.role !== Role.ADMIN) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const report = await getFinancialReport();

    const rows: string[] = [];
    rows.push("Section,Metric,Value");

    // Summary
    rows.push(`Summary,Total Revenue,${report.totalRevenue}`);
    rows.push(`Summary,Total Transactions,${report.totalTransactions}`);
    rows.push(`Summary,Paid Count,${report.paidCount}`);
    rows.push(`Summary,Pending Count,${report.pendingCount}`);
    rows.push(`Summary,Failed Count,${report.failedCount}`);
    rows.push(`Summary,Avg Payment Amount,${report.avgPaymentAmount}`);
    rows.push(`Summary,Success Rate,${report.successRate}%`);

    // Monthly revenue
    rows.push("");
    rows.push("Month,Revenue (INR)");
    for (const m of report.monthlyRevenue) {
      rows.push(`${m.month},${m.revenue}`);
    }

    // Payment status breakdown
    rows.push("");
    rows.push("Payment Status,Count");
    for (const s of report.paymentStatusBreakdown) {
      rows.push(`${s.status},${s.count}`);
    }

    // Purpose breakdown
    rows.push("");
    rows.push("Purpose,Transactions,Revenue (INR)");
    for (const p of report.purposeBreakdown) {
      rows.push(`"${p.purpose}",${p.count},${p.revenue}`);
    }

    const csv = rows.join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="financial-report-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 },
    );
  }
}
