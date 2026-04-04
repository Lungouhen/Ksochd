"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Login</h2>
        <p className="text-sm text-slate-200/80">
          Phone-first login with OTP fallback. Wire this to Supabase auth or
          NextAuth in <code className="font-mono">lib/auth.ts</code>.
        </p>
      </div>
      <form className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
        <label className="block space-y-2">
          <span className="text-sm text-slate-200/90">Phone number</span>
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+91..."
            className="w-full rounded-lg border border-white/15 bg-slate-900/50 px-3 py-2 text-white outline-none transition focus:border-emerald-300/60"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-slate-200/90">OTP (optional)</span>
          <input
            type="text"
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            placeholder="123456"
            className="w-full rounded-lg border border-white/15 bg-slate-900/50 px-3 py-2 text-white outline-none transition focus:border-emerald-300/60"
          />
        </label>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-400"
          >
            Continue
          </button>
          <Link
            href="/register"
            className="text-sm font-semibold text-emerald-100 underline-offset-4 hover:underline"
          >
            Create account
          </Link>
        </div>
      </form>
    </div>
  );
}
