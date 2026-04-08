import { NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

// GET - Get the current executive term
export async function GET() {
  const result = await withPrisma(
    async (client) => {
      const currentTerm = await client.executiveTerm.findFirst({
        where: { isCurrent: true },
      });

      if (!currentTerm) {
        return { term: null, message: "No current term set" };
      }

      return { term: currentTerm };
    },
    () => ({ term: null, message: "Database unavailable" }),
  );

  return NextResponse.json(result);
}
