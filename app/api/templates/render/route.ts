import { NextRequest, NextResponse } from "next/server";
import { renderTemplate, renderDefaultTemplate } from "@/server/services/template.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, type, data } = body;

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: "data object is required" },
        { status: 400 },
      );
    }

    let html: string;
    if (templateId) {
      html = await renderTemplate(templateId, data);
    } else if (type) {
      html = await renderDefaultTemplate(type, data);
    } else {
      return NextResponse.json(
        { error: "Either templateId or type is required" },
        { status: 400 },
      );
    }

    return NextResponse.json({ html });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to render template" },
      { status: 500 },
    );
  }
}
