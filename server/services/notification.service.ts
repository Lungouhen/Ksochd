import { withPrisma } from "@/lib/prisma";
import { Visibility } from "@/types/domain";

export type UserNotification = {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  visibility: Visibility;
};

const fallbackNotifications: UserNotification[] = [
  {
    id: "note-1",
    message: "Your membership renewal is confirmed.",
    read: false,
    createdAt: "2026-04-03",
    visibility: Visibility.MEMBER,
  },
  {
    id: "note-2",
    message: "Event registration: KSO Cultural Evening is approved.",
    read: true,
    createdAt: "2026-04-01",
    visibility: Visibility.MEMBER,
  },
  {
    id: "note-3",
    message: "New gallery upload: Sports Meet photos are live.",
    read: true,
    createdAt: "2026-03-28",
    visibility: Visibility.PUBLIC,
  },
];

export async function getNotifications(
  userId: string,
): Promise<UserNotification[]> {
  return withPrisma(
    async (client) => {
      const notes = await client.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 8,
      });
      if (!notes.length) return fallbackNotifications;
      return notes.map((note) => ({
        id: note.id,
        message: note.message,
        read: note.read,
        createdAt: note.createdAt.toISOString().split("T")[0],
        visibility: Visibility.MEMBER,
      }));
    },
    () => fallbackNotifications,
  );
}
