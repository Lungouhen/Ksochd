import { NextResponse } from "next/server";
import { prismaInstance } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { Role } from "@/types/domain";
import { verifyCSRF } from "@/lib/csrf";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!prismaInstance) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 },
      );
    }

    const event = await prismaInstance.event.findUnique({
      where: { id },
      include: {
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error("[Event API] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

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
    const { title, description, date, venue, fee, registrationDeadline, posterUrl } = body;

    const updateData: Record<string, unknown> = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (date !== undefined) updateData.date = new Date(date);
    if (venue !== undefined) updateData.venue = venue;
    if (fee !== undefined) updateData.fee = fee;
    if (registrationDeadline !== undefined) updateData.registrationDeadline = new Date(registrationDeadline);
    if (posterUrl !== undefined) updateData.posterUrl = posterUrl;

    const event = await prismaInstance.event.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ event });
  } catch (error) {
    console.error("[Event API] PATCH error:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

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

    await prismaInstance.event.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Event API] DELETE error:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 },
    );
  }
}
