"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!phone) {
      toast.error("Phone number is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password: password || undefined }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Login failed");
        return;
      }

      toast.success("Login successful!");

      // Redirect based on role
      if (data.user?.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Login</h2>
        <p className="text-sm text-slate-200/80">
          Enter your phone number to login. Password is optional for demo users.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
        <label className="block space-y-2">
          <span className="text-sm text-slate-200/90">Phone number</span>
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+91-9876543210"
            disabled={loading}
            className="w-full rounded-lg border border-white/15 bg-slate-900/50 px-3 py-2 text-white outline-none transition focus:border-emerald-300/60 disabled:opacity-50"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm text-slate-200/90">Password (optional)</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password if set"
            disabled={loading}
            className="w-full rounded-lg border border-white/15 bg-slate-900/50 px-3 py-2 text-white outline-none transition focus:border-emerald-300/60 disabled:opacity-50"
          />
        </label>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Continue"}
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
