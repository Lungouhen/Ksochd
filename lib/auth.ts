import { cookies, headers } from "next/headers";
import { Role } from "@/types/domain";

export type Session = {
  userId: string;
  role: Role;
  token?: string;
};

function decodeToken(raw?: string): Partial<Session> {
  if (!raw) return {};
  try {
    const json = Buffer.from(raw, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as Partial<Session>;
    return parsed;
  } catch {
    return {};
  }
}

export async function getSession(): Promise<Session> {
  const hdrs = await headers();
  const authHeader = hdrs.get("authorization");
  const bearer =
    authHeader && authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7)
      : undefined;
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("kso-session")?.value;
  const rawToken = bearer ?? cookieToken;
  const decoded = decodeToken(rawToken);

  return {
    userId: decoded.userId ?? "user-1",
    role: decoded.role ?? Role.MEMBER,
    token: rawToken ?? decoded.token,
  };
}

export const verifySession = getSession;
