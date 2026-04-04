import { ContentType, Visibility } from "@/types/domain";

export type ContentItem = {
  id: string;
  title: string;
  type: ContentType;
  visibility: Visibility;
  createdAt: string;
};

export async function getFeaturedContent(): Promise<ContentItem[]> {
  return [
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
}
