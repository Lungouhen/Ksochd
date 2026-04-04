import { Role } from "@/types/domain";

export type Session = {
  userId: string;
  role: Role;
  token?: string;
};

export async function verifySession(): Promise<Session> {
  // Placeholder: integrate with Supabase or NextAuth in production.
  return {
    userId: "user-1",
    role: Role.MEMBER,
    token: "mock-jwt",
  };
}
