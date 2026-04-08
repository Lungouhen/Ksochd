import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Role } from "@/types/domain";

// GET - List all executive terms
export async function GET() {
  const session = await getSession();

  // Only admins can view terms
  if (session.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const result = await withPrisma(
    async (client) => {
      const terms = await client.executiveTerm.findMany({
        orderBy: [
          { isCurrent: "desc" }, // Current term first
          { startYear: "desc" }, // Then by most recent
        ],
      });

      return { terms };
    },
    () => ({ terms: [] }),
  );

  return NextResponse.json(result);
}

// POST - Create a new executive term
export async function POST(request: NextRequest) {
  const session = await getSession();

  // Only admins can create terms
  if (session.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();
  const { name, startYear, endYear, startDate, endDate, description, isCurrent } = body;

  // Validation
  if (!name || !startYear || !endYear || !startDate || !endDate) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (startYear >= endYear) {
    return NextResponse.json(
      { error: "End year must be after start year" },
      { status: 400 }
    );
  }

  const result = await withPrisma(
    async (client) => {
      // If setting as current term, unset all other current terms
      if (isCurrent) {
        await client.executiveTerm.updateMany({
          where: { isCurrent: true },
          data: { isCurrent: false },
        });
      }

      const term = await client.executiveTerm.create({
        data: {
          name,
          startYear: parseInt(startYear),
          endYear: parseInt(endYear),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          description: description || null,
          isCurrent: isCurrent || false,
          createdBy: session.userId,
        },
      });

      // Create audit log
      await client.auditLog.create({
        data: {
          action: "EXECUTIVE_TERM_CREATED",
          targetUserId: null,
          targetUserName: null,
          performedBy: session.userId,
          performedByName: session.name || "Unknown Admin",
          details: {
            termId: term.id,
            termName: term.name,
            isCurrent: term.isCurrent,
          },
        },
      });

      return { success: true, term };
    },
    () => ({ error: "Database unavailable", status: 503 }),
  );

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status || 500 }
    );
  }

  return NextResponse.json(result);
}
