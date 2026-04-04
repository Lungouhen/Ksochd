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

export async function getUnreadCount(userId: string): Promise<number> {
  return withPrisma(
    async (client) => {
      return await client.notification.count({
        where: { userId, read: false },
      });
    },
    () => 0,
  );
}

export async function createNotification(
  userId: string,
  message: string,
): Promise<boolean> {
  return withPrisma(
    async (client) => {
      await client.notification.create({
        data: {
          userId,
          message,
          read: false,
        },
      });
      return true;
    },
    () => false,
  );
}

export async function createBulkNotifications(
  userIds: string[],
  message: string,
): Promise<number> {
  return withPrisma(
    async (client) => {
      const result = await client.notification.createMany({
        data: userIds.map((userId) => ({
          userId,
          message,
          read: false,
        })),
      });
      return result.count;
    },
    () => 0,
  );
}

export async function markAsRead(
  notificationId: string,
  userId: string,
): Promise<boolean> {
  return withPrisma(
    async (client) => {
      await client.notification.updateMany({
        where: { id: notificationId, userId },
        data: { read: true },
      });
      return true;
    },
    () => false,
  );
}

export async function markAllAsRead(userId: string): Promise<boolean> {
  return withPrisma(
    async (client) => {
      await client.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });
      return true;
    },
    () => false,
  );
}

export async function deleteNotification(
  notificationId: string,
  userId: string,
): Promise<boolean> {
  return withPrisma(
    async (client) => {
      await client.notification.deleteMany({
        where: { id: notificationId, userId },
      });
      return true;
    },
    () => false,
  );
}
