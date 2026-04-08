import { NextRequest, NextResponse } from "next/server";
import { withPrisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  return withPrisma(async (prisma) => {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where = status && status !== "all" ? { status: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" } : {};

    const pages = await prisma.page.findMany({
      where,
      include: {
        seo: true,
        theme: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ pages });
  });
}

export async function POST(req: NextRequest) {
  return withPrisma(async (prisma) => {
    try {
      const body = await req.json();
      const { slug, title, content, excerpt, status, themeId, seo, createdBy } = body;

      // Create SEO record if provided
      let seoId: string | undefined;
      if (seo) {
        const seoRecord = await prisma.sEO.create({
          data: {
            title: seo.title || title,
            description: seo.description || excerpt || "",
            keywords: seo.keywords,
            ogTitle: seo.ogTitle,
            ogDescription: seo.ogDescription,
            ogImage: seo.ogImage,
            twitterCard: seo.twitterCard,
            twitterTitle: seo.twitterTitle,
            twitterDescription: seo.twitterDescription,
            twitterImage: seo.twitterImage,
            canonicalUrl: seo.canonicalUrl,
            noindex: seo.noindex || false,
            nofollow: seo.nofollow || false,
            structuredData: seo.structuredData ? JSON.stringify(seo.structuredData) : null,
          },
        });
        seoId = seoRecord.id;
      }

      const page = await prisma.page.create({
        data: {
          slug,
          title,
          content,
          excerpt,
          status: status || "DRAFT",
          themeId,
          seoId,
          createdBy,
          publishedAt: status === "PUBLISHED" ? new Date() : null,
        },
        include: {
          seo: true,
          theme: true,
        },
      });

      return NextResponse.json({ page }, { status: 201 });
    } catch (error) {
      console.error("Error creating page:", error);
      return NextResponse.json(
        { error: "Failed to create page" },
        { status: 500 }
      );
    }
  });
}
