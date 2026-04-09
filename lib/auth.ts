import { cookies, headers } from "next/headers";
import { Role } from "@/types/domain";
import { verifyToken } from "./jwt";

export type Session = {
  userId: string;
  name?: string;
  role: Role;
  token?: string;
};

export async function getSession(): Promise<Session | null> {
  const hdrs = await headers();
  const authHeader = hdrs.get("authorization");
  const bearer =
    authHeader && authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7)
      : undefined;
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("kso-session")?.value;
  const rawToken = bearer ?? cookieToken;

  if (!rawToken) {
    return null;
  }

  const decoded = await verifyToken(rawToken);

  if (!decoded) {
    return null;
  }

  return {
    userId: decoded.userId,
    name: decoded.name,
    role: decoded.role,
    token: rawToken,
  };
}

export const verifySession = getSession;

