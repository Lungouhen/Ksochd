import { cookies, headers } from "next/headers";
import { Role } from "@/types/domain";
import { supabaseAdmin } from "./supabase";
import { jwtVerify } from "jose";

export type Session = {
  userId: string;
  name?: string;
  role: Role;
  token?: string;
};

/**
 * Verifies a JWT token using Supabase JWT secret
 */
async function verifyJWT(token: string): Promise<Partial<Session> | null> {
  try {
    const jwtSecret = process.env.SUPABASE_JWT_SECRET;

    if (!jwtSecret) {
      console.warn("[Auth] SUPABASE_JWT_SECRET not configured");
      return null;
    }

    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secret);

    // Extract user data from JWT payload
    // Supabase JWT typically has: { sub, email, role, user_metadata, ... }
    const userId = payload.sub;
    const metadata = payload.user_metadata as Record<string, unknown> | undefined;

    if (!userId) return null;

    return {
      userId,
      name: metadata?.name as string | undefined,
      role: (metadata?.role as Role) ?? Role.MEMBER,
      token,
    };
  } catch (error) {
    console.error("[Auth] JWT verification failed:", error);
    return null;
  }
}

/**
 * Legacy base64 decoding for development/testing only
 * DO NOT USE IN PRODUCTION
 */
function decodeTokenLegacy(raw?: string): Partial<Session> {
  if (!raw) return {};
  try {
    const json = Buffer.from(raw, "base64url").toString("utf8");
    const parsed = JSON.parse(json) as Partial<Session>;
    return parsed;
  } catch {
    return {};
  }
}

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

  // Try JWT verification first (production)
  const verified = await verifyJWT(rawToken);
  if (verified && verified.userId) {
    return {
      userId: verified.userId,
      name: verified.name,
      role: verified.role ?? Role.MEMBER,
      token: rawToken,
    };
  }

  // Fallback to legacy decoding for development
  // TODO: Remove this in production
  if (process.env.NODE_ENV === "development") {
    const decoded = decodeTokenLegacy(rawToken);
    if (decoded.userId) {
      console.warn("[Auth] Using legacy token decoding - not secure for production");
      return {
        userId: decoded.userId,
        name: decoded.name,
        role: decoded.role ?? Role.MEMBER,
        token: rawToken,
      };
    }
  }

  return null;
}

export async function verifySession(): Promise<Session | null> {
  return getSession();
}

/**
 * Requires authentication - throws if no valid session
 */
export async function requireAuth(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized - no valid session");
  }
  return session;
}

/**
 * Requires specific role - throws if insufficient permissions
 */
export async function requireRole(minimumRole: Role): Promise<Session> {
  const session = await requireAuth();

  const roleHierarchy = {
    [Role.MEMBER]: 0,
    [Role.MODERATOR]: 1,
    [Role.ADMIN]: 2,
  };

  if (roleHierarchy[session.role] < roleHierarchy[minimumRole]) {
    throw new Error(`Forbidden - requires ${minimumRole} role`);
  }

  return session;
}
