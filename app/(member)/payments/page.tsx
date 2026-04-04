import { RazorpayCheckout } from "@/components/payments/RazorpayCheckout";
import { PaymentHistory } from "@/components/payments/PaymentHistory";
import { getPaymentConfig } from "@/lib/razorpay";

export default async function MemberPayments() {
  const config = getPaymentConfig();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-2xl font-semibold text-white">
          Membership Fees
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="glass-panel space-y-4 border-white/10 p-6">
            <div>
              <h3 className="text-lg font-medium text-white">
                Individual Membership
              </h3>
              <p className="text-sm text-slate-300">
                Annual membership for one person
              </p>
            </div>
            <div className="text-3xl font-bold text-teal-400">
              ₹{config.membershipFees.individual / 100}
            </div>
            <RazorpayCheckout type="membership" membershipType="individual" />
          </div>

          <div className="glass-panel space-y-4 border-white/10 p-6">
            <div>
              <h3 className="text-lg font-medium text-white">
                Family Membership
              </h3>
              <p className="text-sm text-slate-300">
                Annual membership for entire family
              </p>
            </div>
            <div className="text-3xl font-bold text-teal-400">
              ₹{config.membershipFees.family / 100}
            </div>
            <RazorpayCheckout type="membership" membershipType="family" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-semibold text-white">
          Payment History
        </h2>
        <div className="glass-panel border-white/10 p-6">
          <PaymentHistory />
        </div>
      </div>
    </div>
  );
}
