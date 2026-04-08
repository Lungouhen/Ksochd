'use client';

import { FileDown } from "lucide-react";
import { useState } from "react";

type Props = {
  href: string;
  label?: string;
};

export function ExportButton({ href, label = "Export CSV" }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const res = await fetch(href);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = res.headers.get("Content-Disposition");
      const filename = disposition
        ? disposition.split("filename=")[1]?.replace(/"/g, "") ?? "report.csv"
        : "report.csv";
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // Silently fail - button will reset
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex w-fit items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-500 disabled:opacity-50"
    >
      <FileDown className="h-4 w-4" />
      {loading ? "Exporting…" : label}
    </button>
  );
}
