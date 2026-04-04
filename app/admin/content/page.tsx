import { SectionCard } from "@/components/ui/section-card";
import { getFeaturedContent } from "@/server/services/content.service";

export default async function AdminContent() {
  const content = await getFeaturedContent();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Content workflows</h2>
      <SectionCard
        title="Content types"
        description="NEWS, GALLERY, DOCUMENT, ANNOUNCEMENT mapped to Prisma enums."
        items={content.map(
          (item) =>
            `${item.title} · ${item.type.toLowerCase()} · visibility: ${item.visibility.toLowerCase()}`,
        )}
        tone="teal"
        cta={{ href: "/admin/content/new", label: "Add content" }}
      />
      <SectionCard
        title="Visibility rules"
        description="PUBLIC, MEMBER, ADMIN scopes cascade through the single-stream renderer."
        items={[
          "Public posts land on the home pipeline",
          "Member-only posts surface in dashboards",
          "Admin posts stay inside control room",
        ]}
        tone="gold"
      />
    </div>
  );
}
