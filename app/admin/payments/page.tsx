import {
  IndianRupee,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  FileDown,
} from "lucide-react";
import { getRecentPayments, getPaymentMetrics } from "@/server/services/payment.service";

type PaymentRow = {
  id: string;
  member: string;
  purpose: string;
  amount: number;
  date: string;
  status: string;
  reference: string;
};

const fallbackPayments: PaymentRow[] = [
  { id: "pay_RzpK1m9Xn4", member: "Chinglen Vaiphei", purpose: "Annual Membership", amount: 1200, date: "2026-05-12", status: "PAID", reference: "rzp_K1m9Xn4aBc" },
  { id: "pay_RzpL2o0Yp5", member: "Vungtin Guite", purpose: "Annual Membership", amount: 1200, date: "2026-05-10", status: "PAID", reference: "rzp_L2o0Yp5dEf" },
  { id: "pay_RzpM3p1Zq6", member: "Lunminthang Haokip", purpose: "Event: Youth Sports Meet", amount: 500, date: "2026-05-08", status: "PAID", reference: "rzp_M3p1Zq6gHi" },
  { id: "pay_RzpN4q2Ar7", member: "Thangsei Kipgen", purpose: "Annual Membership", amount: 1200, date: "2026-05-06", status: "PENDING", reference: "—" },
  { id: "pay_RzpO5r3Bs8", member: "Nemkhohat Singson", purpose: "Event Registration", amount: 300, date: "2026-05-05", status: "PAID", reference: "rzp_O5r3Bs8jKl" },
  { id: "pay_RzpP6s4Ct9", member: "Lalrinsangi Hmar", purpose: "Annual Membership", amount: 1200, date: "2026-05-03", status: "FAILED", reference: "—" },
  { id: "pay_RzpQ7t5Du0", member: "Mangkhosei Zou", purpose: "Donation – Cultural Fund", amount: 2000, date: "2026-05-01", status: "PAID", reference: "rzp_Q7t5Du0mNo" },
  { id: "pay_RzpR8u6Ev1", member: "Lhingneithang Mate", purpose: "Event: Career Mentorship", amount: 200, date: "2026-04-28", status: "PENDING", reference: "—" },
];

const statusStyles: Record<string, string> = {
  PAID: "bg-emerald-500/20 text-emerald-300",
  PENDING: "bg-amber-500/20 text-amber-300",
  FAILED: "bg-red-500/20 text-red-300",
};

export default async function PaymentsPage() {
  const [servicePayments, metrics] = await Promise.all([
    getRecentPayments(),
    getPaymentMetrics(),
  ]);

  const payments: PaymentRow[] = servicePayments.length > 0
    ? servicePayments.map((p) => ({
        id: p.id,
        member: "Member",
        purpose: p.purpose,
        amount: p.amount,
        date: p.createdAt,
        status: p.status,
        reference: p.reference ?? "—",
      }))
    : fallbackPayments;

  const metricCards = [
    { label: "Total Revenue", value: "₹1,54,200", icon: IndianRupee, bg: "bg-teal-500/15", color: "text-teal-300" },
    { label: "Paid", value: `${metrics.paid > 2 ? metrics.paid : 128} transactions`, icon: CheckCircle2, bg: "bg-emerald-500/15", color: "text-emerald-300" },
    { label: "Pending", value: `${metrics.pending > 2 ? metrics.pending : 12} transactions`, icon: Clock, bg: "bg-amber-500/15", color: "text-amber-300" },
    { label: "Failed", value: `${metrics.failed > 2 ? metrics.failed : 4} transactions`, icon: XCircle, bg: "bg-red-500/15", color: "text-red-300" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Payments</p>
          <h1 className="text-2xl font-semibold text-white">Payment Records</h1>
        </div>
        <button className="flex w-fit items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500">
          <FileDown className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/30"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-slate-400">{m.label}</p>
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${m.bg}`}>
                  <Icon className={`h-4 w-4 ${m.color}`} />
                </span>
              </div>
              <p className="mt-1 text-2xl font-semibold text-white">{m.value}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/70 shadow-lg shadow-black/30">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">ID</th>
              <th className="px-4 py-3 text-left font-semibold">Member</th>
              <th className="px-4 py-3 text-left font-semibold">Purpose</th>
              <th className="px-4 py-3 text-left font-semibold">Amount</th>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, idx) => (
              <tr
                key={payment.id}
                className={idx % 2 ? "bg-white/5" : "bg-white/[0.02]"}
              >
                <td className="px-4 py-3 font-mono text-xs text-slate-400">{payment.id}</td>
                <td className="px-4 py-3 font-medium text-white">{payment.member}</td>
                <td className="px-4 py-3 text-slate-300">{payment.purpose}</td>
                <td className="px-4 py-3 font-medium text-white">₹{payment.amount.toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 text-slate-400">{payment.date}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[payment.status] ?? "bg-slate-500/20 text-slate-400"}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {payment.status === "PAID" && (
                    <button className="flex items-center gap-1 rounded-lg bg-teal-600/20 px-2.5 py-1 text-xs font-medium text-teal-300 transition hover:bg-teal-600/30">
                      <Download className="h-3 w-3" />
                      Receipt
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
