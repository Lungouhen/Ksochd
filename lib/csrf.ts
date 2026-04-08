import crypto from "crypto";
import { cookies } from "next/headers";

const CSRF_TOKEN_LENGTH = 32;
const CSRF_COOKIE_NAME = "csrf-token";

/**
 * Generates a cryptographically secure CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString("hex");
}

/**
 * Sets CSRF token in httpOnly cookie
 */
export async function setCSRFToken(): Promise<string> {
  const token = generateCSRFToken();
  const cookieStore = await cookies();

  cookieStore.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  return token;
}

/**
 * Retrieves CSRF token from cookie
 */
export async function getCSRFToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_COOKIE_NAME)?.value ?? null;
}

/**
 * Validates CSRF token from request against cookie
 */
export async function validateCSRFToken(tokenFromRequest: string): Promise<boolean> {
  const tokenFromCookie = await getCSRFToken();

  if (!tokenFromCookie || !tokenFromRequest) {
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(tokenFromCookie),
      Buffer.from(tokenFromRequest),
    );
  } catch {
    return false;
  }
}

/**
 * Middleware helper to verify CSRF token from headers or body
 */
export async function verifyCSRF(request: Request): Promise<boolean> {
  // GET, HEAD, OPTIONS requests don't need CSRF protection
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) {
    return true;
  }

  // Check X-CSRF-Token header
  const tokenFromHeader = request.headers.get("x-csrf-token");

  if (tokenFromHeader) {
    return validateCSRFToken(tokenFromHeader);
  }

  // For form submissions, check body
  try {
    const contentType = request.headers.get("content-type");
    if (contentType?.includes("application/x-www-form-urlencoded")) {
      const clone = request.clone();
      const formData = await clone.formData();
      const tokenFromBody = formData.get("csrf_token");

      if (typeof tokenFromBody === "string") {
        return validateCSRFToken(tokenFromBody);
      }
    }
  } catch {
    // If parsing fails, fall through to return false
  }

  return false;
}
