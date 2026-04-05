import { CreditCard } from 'lucide-react';

export default function PaymentsPage() {
  const payments = [
    {
      id: 'PAY-001',
      member: 'Chinglen Vaiphei',
      amount: 1200,
      date: '2026-05-12',
      status: 'Paid',
      type: 'Annual Membership',
    },
    {
      id: 'PAY-002',
      member: 'Vungtin Guite',
      amount: 1200,
      date: '2026-05-10',
      status: 'Paid',
      type: 'Annual Membership',
    },
    {
      id: 'PAY-003',
      member: 'Thangsei Haokip',
      amount: 500,
      date: '2026-05-08',
      status: 'Pending',
      type: 'Event Registration',
    },
    {
      id: 'PAY-004',
      member: 'Nemkhohat Kipgen',
      amount: 1200,
      date: '2026-05-05',
      status: 'Failed',
      type: 'Annual Membership',
    },
  ];

  const statusColors: Record<string, string> = {
    Paid: 'bg-emerald-500/20 text-emerald-300',
    Pending: 'bg-amber-500/20 text-amber-300',
    Failed: 'bg-red-500/20 text-red-300',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Payments
          </p>
          <h1 className="text-2xl font-semibold text-white">
            Payment Records
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-800/80 px-3 py-2 text-sm text-slate-300">
            <CreditCard className="h-4 w-4 text-teal-400" />
            Total collected: ₹4,100
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-lg shadow-black/30">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">ID</th>
              <th className="px-4 py-3 text-left font-semibold">Member</th>
              <th className="px-4 py-3 text-left font-semibold">Type</th>
              <th className="px-4 py-3 text-left font-semibold">Amount</th>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, idx) => (
              <tr
                key={payment.id}
                className={idx % 2 ? 'bg-white/5' : 'bg-white/[0.02]'}
              >
                <td className="px-4 py-3 font-mono text-xs text-slate-400">
                  {payment.id}
                </td>
                <td className="px-4 py-3 font-medium text-white">
                  {payment.member}
                </td>
                <td className="px-4 py-3 text-slate-300">{payment.type}</td>
                <td className="px-4 py-3 text-white">₹{payment.amount}</td>
                <td className="px-4 py-3 text-slate-400">{payment.date}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[payment.status]}`}
                  >
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
