import { withPrisma } from "@/lib/prisma";
import { ContentType, Visibility } from "@/types/domain";

export type ContentItem = {
  id: string;
  title: string;
  type: ContentType;
  visibility: Visibility;
  createdAt: string;
};

const fallbackContent: ContentItem[] = [
  {
    id: "content-1",
    title: "Semester 4 Exam Hall Tickets",
    type: ContentType.DOCUMENT,
    visibility: Visibility.MEMBER,
    createdAt: "2026-03-30",
  },
  {
    id: "content-2",
    title: "Photo Gallery: Sports Meet",
    type: ContentType.GALLERY,
    visibility: Visibility.PUBLIC,
    createdAt: "2026-03-12",
  },
  {
    id: "content-3",
    title: "Chairperson Update: Membership Drive",
    type: ContentType.ANNOUNCEMENT,
    visibility: Visibility.ADMIN,
    createdAt: "2026-02-28",
  },
];

function mapContent(item: {
  id: string;
  title: string;
  type: ContentType;
  visibility: Visibility;
  createdAt: Date;
}): ContentItem {
  return {
    id: item.id,
    title: item.title,
    type: item.type,
    visibility: item.visibility,
    createdAt: item.createdAt.toISOString().split("T")[0],
  };
}

export async function getFeaturedContent(): Promise<ContentItem[]> {
  return withPrisma(
    async (client) => {
      const content = await client.content.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
      });
      if (!content.length) return fallbackContent;
      return content.map(mapContent);
    },
    () => fallbackContent,
  );
}

export async function getGalleryItems(): Promise<ContentItem[]> {
  return withPrisma(
    async (client) => {
      const gallery = await client.content.findMany({
        where: { type: ContentType.GALLERY },
        orderBy: { createdAt: "desc" },
        take: 9,
      });
      if (!gallery.length) {
        return fallbackContent.filter((item) => item.type === ContentType.GALLERY);
      }
      return gallery.map(mapContent);
    },
    () => fallbackContent.filter((item) => item.type === ContentType.GALLERY),
  );
}
