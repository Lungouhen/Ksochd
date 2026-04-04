"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    clan: "",
    college: "",
  });

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Register</h2>
        <p className="text-sm text-slate-200/80">
          Capture membership intent; wire to Prisma mutation later. Phone is the
          primary key with OTP for verification.
        </p>
      </div>

      <form className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
        {[
          { name: "name", label: "Full name", type: "text" },
          { name: "phone", label: "Phone", type: "tel" },
          { name: "email", label: "Email", type: "email" },
          { name: "clan", label: "Clan (optional)", type: "text" },
          { name: "college", label: "College", type: "text" },
        ].map((field) => (
          <label key={field.name} className="block space-y-2">
            <span className="text-sm text-slate-200/90">{field.label}</span>
            <input
              type={field.type}
              value={form[field.name as keyof typeof form]}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  [field.name]: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-white/15 bg-slate-900/50 px-3 py-2 text-white outline-none transition focus:border-emerald-300/60"
            />
          </label>
        ))}

        <button
          type="submit"
          className="inline-flex items-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-400"
        >
          Submit registration
        </button>
      </form>
    </div>
  );
}
