import { MemberProfile, Role, Status } from "@/types/domain";

export async function getCurrentUser(): Promise<MemberProfile> {
  return {
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
}

export async function getAdminSummary() {
  return {
    activeMembers: 1184,
    pendingApprovals: 32,
    moderators: 14,
    lastPayment: "2026-04-01",
  };
}
