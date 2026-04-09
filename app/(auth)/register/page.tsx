"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    clan: "",
    college: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!form.name || !form.phone) {
      toast.error("Name and phone number are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }

      toast.success("Registration successful! Your membership is pending approval.");
      router.push("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Register</h2>
        <p className="text-sm text-slate-200/80">
          Create your account. Your membership will be pending until approved by an admin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
        {[
          { name: "name", label: "Full name*", type: "text", required: true },
          { name: "phone", label: "Phone*", type: "tel", required: true },
          { name: "email", label: "Email", type: "email", required: false },
          { name: "clan", label: "Clan (optional)", type: "text", required: false },
          { name: "college", label: "College", type: "text", required: false },
          { name: "password", label: "Password (optional)", type: "password", required: false },
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
              required={field.required}
              disabled={loading}
              placeholder={field.name === "phone" ? "+91-9876543210" : ""}
              className="w-full rounded-lg border border-white/15 bg-slate-900/50 px-3 py-2 text-white outline-none transition focus:border-emerald-300/60 disabled:opacity-50"
            />
          </label>
        ))}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Submit registration"}
          </button>
          <Link
            href="/login"
            className="text-sm font-semibold text-emerald-100 underline-offset-4 hover:underline"
          >
            Already have an account?
          </Link>
        </div>
      </form>
    </div>
  );
}
