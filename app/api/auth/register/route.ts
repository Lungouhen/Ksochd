import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, clan, college, password } = body as {
      name: string;
      phone: string;
      email?: string;
      clan?: string;
      college?: string;
      password?: string;
    };

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const result = await withPrisma(
      async (client) => {
        // Check if user already exists
        const existing = await client.user.findUnique({
          where: { phone },
        });

        if (existing) {
          return { error: "Phone number already registered", token: null };
        }

        // Hash password if provided
        let hashedPassword: string | undefined;
        if (password) {
          hashedPassword = await bcrypt.hash(password, 10);
        }

        // Create user
        const user = await client.user.create({
          data: {
            name,
            phone,
            email,
            clan,
            college,
            password: hashedPassword,
            role: "MEMBER",
            membershipStatus: "PENDING",
          },
        });

        // Generate JWT token
        const token = await signToken({
          userId: user.id,
          name: user.name,
          role: user.role,
        });

        return {
          error: null,
          token,
          user: {
            id: user.id,
            name: user.name,
            role: user.role,
            membershipStatus: user.membershipStatus,
          },
        };
      },
      () => ({ error: "Database unavailable", token: null, user: null })
    );

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "Database unavailable" ? 503 : 400 }
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
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
