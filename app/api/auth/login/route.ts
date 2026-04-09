import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password } = body as { phone: string; password?: string };

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const result = await withPrisma(
      async (client) => {
        // Find user by phone
        const user = await client.user.findUnique({
          where: { phone },
        });

        if (!user) {
          return { error: "Invalid phone or password", token: null };
        }

        // For now, allow login if:
        // 1. No password is set (phone-only auth)
        // 2. Password matches
        if (user.password && password) {
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            return { error: "Invalid phone or password", token: null };
          }
        } else if (user.password && !password) {
          return { error: "Password is required", token: null };
        }

        // Generate JWT token
        const token = await signToken({
          userId: user.id,
          name: user.name,
          role: user.role,
        });

        return { error: null, token, user: {
          id: user.id,
          name: user.name,
          role: user.role,
          membershipStatus: user.membershipStatus
        } };
      },
      () => ({ error: "Database unavailable", token: null, user: null })
    );

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Database unavailable" ? 503 : 401 }
      );
    }

    // Set cookie
    const response = NextResponse.json({
      success: true,
      token: result.token,
      user: result.user,
    });

    response.cookies.set("kso-session", result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
