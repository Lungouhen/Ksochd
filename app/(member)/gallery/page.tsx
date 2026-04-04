import { SectionCard } from "@/components/ui/section-card";
import { getGalleryItems } from "@/server/services/content.service";

export default async function MemberGallery() {
  const items = await getGalleryItems();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Gallery</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <SectionCard
            key={item.id}
            title={item.title}
            description={`Visibility: ${item.visibility.toLowerCase()}`}
            items={[`Published: ${item.createdAt}`, `Type: ${item.type.toLowerCase()}`]}
            tone="teal"
          />
        ))}
      </div>
    </div>
  );
}
