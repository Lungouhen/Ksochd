"use client";

import { useState } from "react";

export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">OTP verification</h2>
        <p className="text-sm text-slate-200/80">
          Used for device trust and low-friction member access. Replace mock
          handlers with Supabase OTP or SMS gateway.
        </p>
      </div>
      <form className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
        <label className="block space-y-2">
          <span className="text-sm text-slate-200/90">OTP Code</span>
          <input
            type="text"
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            placeholder="123456"
            className="w-full rounded-lg border border-white/15 bg-slate-900/50 px-3 py-2 text-white outline-none transition focus:border-emerald-300/60"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-slate-200/90">Session token</span>
          <input
            type="text"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="Paste the temporary token if required"
            className="w-full rounded-lg border border-white/15 bg-slate-900/50 px-3 py-2 text-white outline-none transition focus:border-emerald-300/60"
          />
        </label>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-400"
          >
            Verify
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/50"
          >
            Resend OTP
          </button>
        </div>
      </form>
    </div>
  );
}
