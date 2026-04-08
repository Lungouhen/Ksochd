import { NextResponse } from "next/server";
import { prismaInstance } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { RegistrationStatus } from "@/types/domain";
import { verifyCSRF } from "@/lib/csrf";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: eventId } = await params;

    // Require authentication
    const session = await requireAuth();

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

    // Check if event exists
    const event = await prismaInstance.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check registration deadline
    if (new Date() > event.registrationDeadline) {
      return NextResponse.json(
        { error: "Registration deadline has passed" },
        { status: 400 },
      );
    }

    // Check if already registered
    const existingRegistration = await prismaInstance.eventRegistration.findFirst({
      where: {
        eventId,
        userId: session.userId,
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "Already registered for this event" },
        { status: 400 },
      );
    }

    // Create registration
    const registration = await prismaInstance.eventRegistration.create({
      data: {
        eventId,
        userId: session.userId,
        status: RegistrationStatus.PENDING,
      },
    });

    return NextResponse.json({ registration }, { status: 201 });
  } catch (error) {
    console.error("[Event Registration API] POST error:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to register for event" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: eventId } = await params;

    // Require authentication
    const session = await requireAuth();

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

    // Find and delete registration
    const registration = await prismaInstance.eventRegistration.findFirst({
      where: {
        eventId,
        userId: session.userId,
      },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 },
      );
    }

    await prismaInstance.eventRegistration.delete({
      where: { id: registration.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Event Registration API] DELETE error:", error);

    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to cancel registration" },
      { status: 500 },
    );
  }
}
