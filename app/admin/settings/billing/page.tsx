import Link from "next/link";
import {
  CreditCard,
  Receipt,
  ArrowLeft,
  ArrowUpCircle,
  CheckCircle2,
} from "lucide-react";

const invoices = [
  { id: "INV-2026-004", date: "2026-04-01", amount: "₹0", status: "Paid", desc: "Free Tier – April 2026" },
  { id: "INV-2026-003", date: "2026-03-01", amount: "₹0", status: "Paid", desc: "Free Tier – March 2026" },
  { id: "INV-2026-002", date: "2026-02-01", amount: "₹0", status: "Paid", desc: "Free Tier – February 2026" },
  { id: "INV-2026-001", date: "2026-01-01", amount: "₹0", status: "Paid", desc: "Free Tier – January 2026" },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Settings</p>
          <h1 className="text-2xl font-semibold text-white">Billing & Invoices</h1>
          <p className="mt-1 text-sm text-slate-300">
            Manage your portal subscription and download invoices.
          </p>
        </div>
        <Link
          href="/admin/settings"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </Link>
      </div>

      {/* Current plan */}
      <div className="rounded-2xl border border-teal-400/30 bg-teal-500/5 p-6 shadow-lg shadow-black/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-500/20">
              <CreditCard className="h-6 w-6 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-white">KSO Chandigarh Free Tier</h2>
                <span className="rounded-full bg-teal-500/20 px-2.5 py-0.5 text-xs font-medium text-teal-300">
                  Active
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Unlimited members · Events · Payments · Gallery · Notifications
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-500">
            <ArrowUpCircle className="h-4 w-4" />
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Invoice history */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-lg shadow-black/30">
        <div className="mb-4 flex items-center gap-3">
          <Receipt className="h-5 w-5 text-teal-300" />
          <h2 className="text-base font-semibold text-white">Invoice History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-2 pr-4 text-left font-medium text-slate-400">Invoice</th>
                <th className="py-2 pr-4 text-left font-medium text-slate-400">Description</th>
                <th className="py-2 pr-4 text-left font-medium text-slate-400">Date</th>
                <th className="py-2 pr-4 text-left font-medium text-slate-400">Amount</th>
                <th className="py-2 text-left font-medium text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {invoices.map((inv) => (
                <tr key={inv.id} className="transition hover:bg-white/5">
                  <td className="py-3 pr-4 font-mono text-xs text-slate-300">{inv.id}</td>
                  <td className="py-3 pr-4 text-white">{inv.desc}</td>
                  <td className="py-3 pr-4 text-slate-400">{inv.date}</td>
                  <td className="py-3 pr-4 text-white">{inv.amount}</td>
                  <td className="py-3">
                    <span className="flex w-fit items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" />
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
