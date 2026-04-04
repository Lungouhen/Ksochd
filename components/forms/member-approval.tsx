"use client";

import { useState } from "react";

export function MemberApproval() {
  const [decision, setDecision] = useState<"approve" | "reject" | "pending">(
    "pending",
  );
  const [note, setNote] = useState("");

  return (
    <form className="space-y-3">
      <div className="flex gap-3">
        {["approve", "reject", "pending"].map((option) => (
          <label
            key={option}
            className={`flex-1 cursor-pointer rounded-lg border px-3 py-2 text-center text-sm font-semibold capitalize transition ${
              decision === option
                ? "border-emerald-400/60 bg-emerald-500/10 text-white"
                : "border-white/10 bg-slate-900/40 text-slate-200/80 hover:border-white/20"
            }`}
          >
            <input
              type="radio"
              name="decision"
              value={option}
              checked={decision === option}
              onChange={() =>
                setDecision(option as "approve" | "reject" | "pending")
              }
              className="hidden"
            />
            {option}
          </label>
        ))}
      </div>
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Add reviewer note"
        className="min-h-[120px] w-full rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-white outline-none focus:border-emerald-300/60"
      />
      <button
        type="submit"
        className="inline-flex items-center rounded-lg bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-300"
      >
        Record decision
      </button>
    </form>
  );
}
