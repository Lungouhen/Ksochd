import { SectionCard } from "@/components/ui/section-card";

const metrics = [
  "Active members vs. goal (Supabase/Prisma query)",
  "Payments by purpose (membership vs events)",
  "Engagement: event registration velocity",
  "Content reach by visibility tier",
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Analytics</h2>
      <SectionCard
        title="Dashboards"
        description="Attach your BI source or Supabase SQL to populate these cards."
        items={metrics}
        tone="slate"
        cta={{ href: "/admin/dashboard", label: "Back to ops" }}
      />
    </div>
  );
}
