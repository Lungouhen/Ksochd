import { getSession } from "@/lib/auth";
import { withPrisma } from "@/lib/prisma";
import { MemberProfile, Role, Status } from "@/types/domain";

const fallbackMember: MemberProfile = {
  id: "user-1",
  name: "Chinglen Vaiphei",
  phone: "+91-9876543210",
  email: "member@ksochd.org",
  clan: "Vaiphei",
  college: "Chandigarh University",
  role: Role.MEMBER,
  membershipStatus: Status.ACTIVE,
  profilePic: "/profile.png",
};

function mapToProfile(user: {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  clan: string | null;
  college: string | null;
  role: Role;
  membershipStatus: Status;
  profilePic: string | null;
}): MemberProfile {
  return {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email ?? undefined,
    clan: user.clan ?? undefined,
    college: user.college ?? undefined,
    role: user.role,
    membershipStatus: user.membershipStatus,
    profilePic: user.profilePic ?? undefined,
  };
}

export async function getCurrentUser(): Promise<MemberProfile> {
  const session = await getSession();

  return withPrisma(
    async (client) => {
      const user = await client.user.findUnique({
        where: { id: session.userId },
      });
      if (!user) {
        throw new Error("user not found");
      }
      return mapToProfile(user);
    },
    () => ({ ...fallbackMember, role: session.role }),
  );
}

export async function getPendingMembers(): Promise<MemberProfile[]> {
  return withPrisma(
    async (client) => {
      const pending = await client.user.findMany({
        where: { membershipStatus: Status.PENDING },
        orderBy: { createdAt: "desc" },
        take: 6,
      });
      if (!pending.length) return [];
      return pending.map(mapToProfile);
    },
    () => [
      { ...fallbackMember, id: "pending-1", membershipStatus: Status.PENDING },
      {
        ...fallbackMember,
        id: "pending-2",
        name: "Vungtin Guite",
        phone: "+91-9876501234",
        membershipStatus: Status.PENDING,
        clan: "Guite",
      },
      {
        ...fallbackMember,
        id: "pending-3",
        name: "Lunminthang Haokip",
        phone: "+91-9876505678",
        membershipStatus: Status.PENDING,
        clan: "Haokip",
      },
    ],
  );
}

export async function getAdminSummary() {
  return withPrisma(
    async (client) => {
      const [activeMembers, pendingApprovals, moderators, lastPayment] =
        await Promise.all([
          client.user.count({ where: { membershipStatus: Status.ACTIVE } }),
          client.user.count({ where: { membershipStatus: Status.PENDING } }),
          client.user.count({ where: { role: Role.MODERATOR } }),
          client.payment.findFirst({
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
          }),
        ]);

      return {
        activeMembers,
        pendingApprovals,
        moderators,
        lastPayment: lastPayment?.createdAt.toISOString() ?? "n/a",
      };
    },
    () => ({
      activeMembers: 1184,
      pendingApprovals: 32,
      moderators: 14,
      lastPayment: "2026-04-01",
    }),
  );
}
