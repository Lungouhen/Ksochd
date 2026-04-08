import { NextResponse } from "next/server";
import { prismaInstance } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { Role } from "@/types/domain";
import { verifyCSRF } from "@/lib/csrf";

export async function GET() {
  try {
    if (!prismaInstance) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 },
      );
    }

    const events = await prismaInstance.event.findMany({
      orderBy: { date: "asc" },
      include: {
        registrations: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("[Events API] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    // Require admin role
    await requireRole(Role.ADMIN);

    // Verify CSRF token
    const csrfValid = await verifyCSRF(request);
    if (!csrfValid) {
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 },
      );
    }

    if (!prismaInstance) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 },
      );
    }

    const body = await request.json();
    const { title, description, date, venue, fee, registrationDeadline, posterUrl, createdBy } = body;

    // Validation
    if (!title || !description || !date || !venue || !registrationDeadline || !createdBy) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const event = await prismaInstance.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        venue,
        fee: fee ?? 0,
        registrationDeadline: new Date(registrationDeadline),
        posterUrl,
        createdBy,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("[Events API] POST error:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  }
}
