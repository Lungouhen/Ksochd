"use client";

import { useState } from "react";

export function EventForm() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");

  return (
    <form className="space-y-3">
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Event title"
        className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-white outline-none focus:border-emerald-300/60"
      />
      <input
        value={date}
        onChange={(event) => setDate(event.target.value)}
        placeholder="Date"
        className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-white outline-none focus:border-emerald-300/60"
      />
      <input
        value={venue}
        onChange={(event) => setVenue(event.target.value)}
        placeholder="Venue"
        className="w-full rounded-lg border border-white/10 bg-slate-900/50 px-3 py-2 text-white outline-none focus:border-emerald-300/60"
      />
      <button
        type="submit"
        className="inline-flex items-center rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-400"
      >
        Save draft
      </button>
    </form>
  );
}
