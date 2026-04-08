import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const publicPaths = ["/", "/login", "/register", "/otp"];
const authPaths = ["/login", "/register", "/otp"];
const memberPaths = ["/dashboard", "/events", "/payments", "/profile", "/notifications", "/gallery"];
const adminPaths = ["/admin"];

/**
 * Verifies JWT token from request
 */
async function verifyToken(token: string): Promise<{ userId: string; role: string } | null> {
  try {
    const jwtSecret = process.env.SUPABASE_JWT_SECRET;
    if (!jwtSecret) return null;

    const secret = new TextEncoder().encode(jwtSecret);
    const { payload } = await jwtVerify(token, secret);

    const userId = payload.sub;
    const metadata = payload.user_metadata as Record<string, unknown> | undefined;
    const role = (metadata?.role as string) ?? "MEMBER";

    if (!userId) return null;

    return { userId, role };
  } catch {
    return null;
  }
}

/**
 * Legacy token decoder for development
 */
function decodeTokenLegacy(token: string): { userId: string; role: string } | null {
  try {
    const json = Buffer.from(token, "base64url").toString("utf8");
    const parsed = JSON.parse(json);
    if (parsed.userId) {
      return {
        userId: parsed.userId,
        role: parsed.role ?? "MEMBER",
      };
    }
  } catch {
    return null;
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow static files and API routes (except /api/admin/*)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api/webhooks") ||
    (pathname.startsWith("/api") && !pathname.startsWith("/api/admin"))
  ) {
    return NextResponse.next();
  }

  // Get token from cookie or Authorization header
  const cookieToken = request.cookies.get("kso-session")?.value;
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const token = bearerToken ?? cookieToken;

  // No token - redirect to login
  if (!token) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Verify token
  let session = await verifyToken(token);

  // Fallback to legacy decoder in development
  if (!session && process.env.NODE_ENV === "development") {
    session = decodeTokenLegacy(token);
  }

  if (!session) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Check if user is trying to access auth pages while logged in
  if (authPaths.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Check admin access
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (session.role !== "ADMIN") {
      if (pathname.startsWith("/api")) {
        return NextResponse.json(
          { error: "Forbidden - Admin access required" },
          { status: 403 },
        );
      }
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - Webhooks
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2)$).*)",
  ],
};
