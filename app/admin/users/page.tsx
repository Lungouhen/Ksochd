import { MemberApproval } from "@/components/forms/member-approval";
import { SectionCard } from "@/components/ui/section-card";

const pipelines = [
  "Registration submitted → Pending",
  "Moderator review → Approved/Rejected",
  "Membership activation → Payment confirmation",
  "Role promotion → Moderator/Admin",
];

export default function AdminUsers() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">User lifecycle</h2>
      <SectionCard
        title="Membership pipeline"
        description="Built for status transitions with auditability."
        items={pipelines}
        tone="gold"
        cta={{ href: "/register", label: "Test flow" }}
      />
      <SectionCard
        title="RBAC policy"
        description="Use server/middleware/rbac.ts to guard actions by role."
        items={[
          "Admins: full access to users, content, payments",
          "Moderators: approvals and content without billing",
          "Members: self-service profile, events, payments",
        ]}
        tone="slate"
      />
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-3 text-sm font-semibold text-white">
          Approval decision mock
        </p>
        <MemberApproval />
      </div>
    </div>
  );
}
